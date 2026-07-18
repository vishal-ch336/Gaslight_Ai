from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base


# ──────────────────────────── User ────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # relationship
    attack_history = relationship("AttackHistory", back_populates="user")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


# ──────────────────────── AttackPreset ────────────────────────
class AttackPreset(Base):
    __tablename__ = "attack_presets"

    id = Column(Integer, primary_key=True, index=True)
    attack_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    payload_text = Column(Text, nullable=False)
    owasp_tag = Column(String, nullable=True)
    mitre_tag = Column(String, nullable=True)

    def __repr__(self) -> str:
        return f"<AttackPreset id={self.id} name={self.attack_name!r}>"


# ──────────────────────── AttackHistory ───────────────────────
class AttackHistory(Base):
    __tablename__ = "attack_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    attack_name = Column(String, nullable=False)
    defenses_active = Column(Text, nullable=False, default="[]")          # JSON string
    result = Column(String, nullable=False)                               # COMPROMISED | BLOCKED
    compiled_prompt_segments = Column(Text, nullable=False, default="[]") # JSON string
    llm_response = Column(Text, nullable=False, default="")
    leaked_data = Column(Text, nullable=True)
    security_log = Column(Text, nullable=False, default="[]")             # JSON string
    timestamp = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # relationship
    user = relationship("User", back_populates="attack_history")

    def __repr__(self) -> str:
        return f"<AttackHistory id={self.id} attack={self.attack_name!r} result={self.result}>"
