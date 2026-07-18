"""
Router for executing prompt-injection attacks against the LLM sandbox
and retrieving attack history / presets.
"""

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models.models import AttackHistory, AttackPreset
from services.defense_service import (
    apply_xml_enclosure,
    build_system_prompt,
    check_blacklist,
)
from services.detection_service import check_compromise
from services.llm_service import call_ollama


router = APIRouter(prefix="/api", tags=["attack"])

# ──────────────────── Hardcoded secret ────────────────────────
SECRET_VALUE = "XJ42-PLUTO"


# ──────────────────── Request / Response schemas ──────────────
class DefensesActive(BaseModel):
    xml_enclosure: bool = False
    blacklist: bool = False
    guardian_judge: bool = False


class AttackExecuteRequest(BaseModel):
    attack_text: str = Field(..., min_length=1, max_length=2000)
    defenses_active: DefensesActive
    user_id: int | None = None


class AttackVerifyRequest(BaseModel):
    original_attack_text: str = Field(..., min_length=1, max_length=2000)
    new_defenses_active: DefensesActive
    user_id: int | None = None


class PromptSegment(BaseModel):
    type: str          # "system" | "user_payload" | "defense_wrapper"
    text: str


class AttackResponse(BaseModel):
    attack_name: str
    result: str        # "COMPROMISED" | "BLOCKED"
    compiled_prompt_segments: list[PromptSegment]
    llm_response: str | None
    leaked_data: str | None
    defenses_active: DefensesActive
    security_log: list[str]
    category: str
    owasp_tag: str | None
    mitre_tag: str | None


class VerifyResponse(AttackResponse):
    verified_fix: bool


class AttackHistoryOut(BaseModel):
    id: int
    user_id: int | None
    attack_name: str
    defenses_active: list[str]
    result: str
    compiled_prompt_segments: list[dict]
    llm_response: str
    leaked_data: str | None
    security_log: list[str]
    timestamp: datetime

    model_config = {"from_attributes": True}


class AttackPresetOut(BaseModel):
    id: int
    attack_name: str
    category: str
    payload_text: str
    owasp_tag: str | None
    mitre_tag: str | None

    model_config = {"from_attributes": True}


# ──────────────────── Helpers ─────────────────────────────────
def _match_preset(attack_text: str, db: Session) -> AttackPreset | None:
    """Exact-match attack_text against known preset payload_text."""
    return (
        db.query(AttackPreset)
        .filter(AttackPreset.payload_text == attack_text)
        .first()
    )


def _run_attack_pipeline(
    attack_text: str,
    defenses: DefensesActive,
    user_id: int | None,
    db: Session,
) -> dict:
    """Core attack pipeline shared by /execute and /verify."""
    security_log: list[str] = []

    # ── Match preset for category / tags ───────────────────────
    preset = _match_preset(attack_text, db)
    category = preset.category if preset else "Custom/Unclassified"
    owasp_tag = preset.owasp_tag if preset else None
    mitre_tag = preset.mitre_tag if preset else None

    # ── 1. Build system prompt ─────────────────────────────────
    system_prompt = build_system_prompt(
        SECRET_VALUE,
        xml_enclosure_enabled=defenses.xml_enclosure,
    )

    # ── 2. Blacklist check ─────────────────────────────────────
    if defenses.blacklist:
        blocked, pattern = check_blacklist(attack_text)
        if blocked:
            security_log.append(
                f"✖ Blacklist defense BLOCKED input — matched pattern: \"{pattern}\""
            )
            segments = [
                PromptSegment(type="system", text=system_prompt),
                PromptSegment(type="user_payload", text=attack_text),
            ]
            _persist(
                db,
                user_id=user_id,
                attack_name=attack_text[:80],
                defenses=defenses,
                result="BLOCKED",
                segments=segments,
                llm_response="",
                leaked_data=None,
                security_log=security_log,
            )
            return {
                "attack_name": attack_text[:80],
                "result": "BLOCKED",
                "compiled_prompt_segments": segments,
                "llm_response": None,
                "leaked_data": None,
                "defenses_active": defenses,
                "security_log": security_log,
                "category": category,
                "owasp_tag": owasp_tag,
                "mitre_tag": mitre_tag,
            }
        security_log.append("✔ Blacklist defense active — input passed")
    else:
        security_log.append("○ Blacklist defense disabled")

    # ── 3. XML enclosure ───────────────────────────────────────
    if defenses.xml_enclosure:
        user_payload = apply_xml_enclosure(attack_text)
        security_log.append("✔ XML enclosure applied to user input")
    else:
        user_payload = attack_text
        security_log.append("○ XML enclosure disabled")

    # ── 4. Compile prompt segments ─────────────────────────────
    segments: list[PromptSegment] = [
        PromptSegment(type="system", text=system_prompt),
    ]
    if defenses.xml_enclosure:
        segments.append(PromptSegment(type="defense_wrapper", text=user_payload))
    else:
        segments.append(PromptSegment(type="user_payload", text=user_payload))

    final_prompt = system_prompt + "\n\n" + user_payload

    # ── 5. Call LLM ────────────────────────────────────────────
    llm_response = call_ollama(final_prompt)

    # ── 5a. Handle LLM errors gracefully ──────────────────────
    if llm_response.startswith("[ERROR"):
        security_log.append(
            f"⚠ System error: LLM unavailable — please check Ollama is running"
        )
        _persist(
            db,
            user_id=user_id,
            attack_name=attack_text[:80],
            defenses=defenses,
            result="ERROR",
            segments=segments,
            llm_response="",
            leaked_data=None,
            security_log=security_log,
        )
        return {
            "attack_name": attack_text[:80],
            "result": "ERROR",
            "compiled_prompt_segments": segments,
            "llm_response": None,
            "leaked_data": None,
            "defenses_active": defenses,
            "security_log": security_log,
            "category": category,
            "owasp_tag": owasp_tag,
            "mitre_tag": mitre_tag,
        }

    security_log.append(f"✔ LLM responded ({len(llm_response)} chars)")

    # ── 6. Detection pipeline ──────────────────────────────────
    verdict = check_compromise(
        llm_response,
        SECRET_VALUE,
        guardian_enabled=defenses.guardian_judge,
    )

    if defenses.guardian_judge:
        security_log.append(
            f"✔ Guardian LLM judge active — flagged={verdict['signals']['guardian_flag']}"
        )
    else:
        security_log.append("○ Guardian LLM judge disabled")

    security_log.append(
        f"Detection signals: exact_leak={verdict['signals']['exact_leak']}, "
        f"fuzzy_leak={verdict['signals']['fuzzy_leak']}, "
        f"guardian_flag={verdict['signals']['guardian_flag']}"
    )

    if verdict["compromised"]:
        result = "COMPROMISED"
        leaked_data = SECRET_VALUE
        security_log.append(f"⚠ COMPROMISED — {verdict['reason']}")
    else:
        result = "BLOCKED"
        leaked_data = None
        security_log.append(f"✔ SAFE — {verdict['reason']}")

    # ── 7. Persist to database ─────────────────────────────────
    _persist(
        db,
        user_id=user_id,
        attack_name=attack_text[:80],
        defenses=defenses,
        result=result,
        segments=segments,
        llm_response=llm_response,
        leaked_data=leaked_data,
        security_log=security_log,
    )


    return {
        "attack_name": attack_text[:80],
        "result": result,
        "compiled_prompt_segments": segments,
        "llm_response": llm_response,
        "leaked_data": leaked_data,
        "defenses_active": defenses,
        "security_log": security_log,
        "category": category,
        "owasp_tag": owasp_tag,
        "mitre_tag": mitre_tag,
    }


def _persist(
    db: Session,
    *,
    user_id: int | None,
    attack_name: str,
    defenses: DefensesActive,
    result: str,
    segments: list[PromptSegment],
    llm_response: str,
    leaked_data: str | None,
    security_log: list[str],
) -> None:
    """Write an AttackHistory row to the database."""
    active_list = [k for k, v in defenses.model_dump().items() if v]
    segment_dicts = [s.model_dump() for s in segments]

    record = AttackHistory(
        user_id=user_id,
        attack_name=attack_name,
        defenses_active=json.dumps(active_list),
        result=result,
        compiled_prompt_segments=json.dumps(segment_dicts),
        llm_response=llm_response,
        leaked_data=leaked_data,
        security_log=json.dumps(security_log),
        timestamp=datetime.now(timezone.utc),
    )
    db.add(record)
    db.commit()


# ──────────────────── POST /api/attack/execute ────────────────
@router.post("/attack/execute", response_model=AttackResponse)
def execute_attack(
    body: AttackExecuteRequest,
    db: Session = Depends(get_db),
):
    data = _run_attack_pipeline(
        attack_text=body.attack_text,
        defenses=body.defenses_active,
        user_id=body.user_id,
        db=db,
    )
    return AttackResponse(**data)


# ──────────────────── POST /api/attack/verify ─────────────────
@router.post("/attack/verify", response_model=VerifyResponse)
def verify_attack(
    body: AttackVerifyRequest,
    db: Session = Depends(get_db),
):
    data = _run_attack_pipeline(
        attack_text=body.original_attack_text,
        defenses=body.new_defenses_active,
        user_id=body.user_id,
        db=db,
    )
    verified_fix = data["result"] == "BLOCKED"
    return VerifyResponse(**data, verified_fix=verified_fix)


# ──────────────────── GET /api/attacks/history ────────────────
@router.get("/attacks/history", response_model=list[AttackHistoryOut])
def get_attack_history(user_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(AttackHistory)
        .filter(AttackHistory.user_id == user_id)
        .order_by(AttackHistory.timestamp.desc())
        .all()
    )
    results = []
    for row in rows:
        results.append(
            AttackHistoryOut(
                id=row.id,
                user_id=row.user_id,
                attack_name=row.attack_name,
                defenses_active=json.loads(row.defenses_active),
                result=row.result,
                compiled_prompt_segments=json.loads(row.compiled_prompt_segments),
                llm_response=row.llm_response,
                leaked_data=row.leaked_data,
                security_log=json.loads(row.security_log),
                timestamp=row.timestamp,
            )
        )
    return results


# ──────────────────── GET /api/attacks/presets ─────────────────
@router.get("/attacks/presets", response_model=list[AttackPresetOut])
def get_attack_presets(db: Session = Depends(get_db)):
    return db.query(AttackPreset).all()
