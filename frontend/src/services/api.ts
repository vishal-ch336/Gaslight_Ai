const API_BASE = 'http://localhost:8000';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PromptSegment {
  type: 'system' | 'user_payload' | 'defense_wrapper';
  text: string;
}

export interface DefensesActive {
  xml_enclosure: boolean;
  blacklist: boolean;
  guardian_judge: boolean;
}

export interface AttackResult {
  attack_name: string;
  result: 'COMPROMISED' | 'BLOCKED';
  category: string;
  owasp_tag: string | null;
  mitre_tag: string | null;
  compiled_prompt_segments: PromptSegment[];
  llm_response: string | null;
  leaked_data: string | null;
  defenses_active: DefensesActive;
  security_log: string[];
}

export interface VerifyResult extends AttackResult {
  verified_fix: boolean;
}

export interface Preset {
  id: number;
  attack_name: string;
  category: string;
  payload_text: string;
  owasp_tag: string;
  mitre_tag: string;
}

export interface HistoryEntry extends AttackResult {
  id: number;
  user_id: string;
  timestamp: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function safeFetch<T>(
  url: string,
  options: RequestInit,
  customErrorMap?: Record<number, string>,
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try to extract detail from FastAPI error responses
      let message: string;
      if (customErrorMap && customErrorMap[response.status]) {
        message = customErrorMap[response.status];
      } else {
        try {
          const errBody = await response.json();
          message = errBody.detail || `Request failed (${response.status})`;
        } catch {
          message = `Request failed (${response.status})`;
        }
      }
      return { data: null, error: message };
    }

    const data = (await response.json()) as T;
    return { data, error: null };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { data: null, error: 'Request timed out — the server took too long to respond.' };
    }
    if (err instanceof TypeError) {
      // fetch throws TypeError on network failures
      return { data: null, error: 'Network error — could not reach the server. Is the backend running?' };
    }
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return { data: null, error: message };
  }
}

function jsonPost(body: Record<string, unknown>): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

// ── API Functions ────────────────────────────────────────────────────────────

/**
 * Execute an attack payload against the defense simulator.
 * Can take 2–20s depending on active defenses (guardian adds a second LLM call).
 */
export async function executeAttack(
  attackText: string,
  defensesActive: DefensesActive,
  userId: string | null = null,
): Promise<ApiResponse<AttackResult>> {
  return safeFetch<AttackResult>(
    `${API_BASE}/api/attack/execute`,
    jsonPost({
      attack_text: attackText,
      defenses_active: defensesActive,
      user_id: userId,
    }),
  );
}

/**
 * Verify whether toggling new defenses fixes a previously successful attack.
 * Returns the same shape as executeAttack plus a `verified_fix` boolean.
 */
export async function verifyFix(
  originalAttackText: string,
  newDefensesActive: DefensesActive,
  userId: string | null = null,
): Promise<ApiResponse<VerifyResult>> {
  return safeFetch<VerifyResult>(
    `${API_BASE}/api/attack/verify`,
    jsonPost({
      original_attack_text: originalAttackText,
      new_defenses_active: newDefensesActive,
      user_id: userId,
    }),
  );
}

/**
 * Fetch the list of preset attack payloads.
 */
export async function getPresets(): Promise<ApiResponse<Preset[]>> {
  return safeFetch<Preset[]>(`${API_BASE}/api/attacks/presets`, { method: 'GET' });
}

/**
 * Fetch execution history for a user. Returns empty array if no userId given.
 */
export async function getHistory(
  userId: string | null | undefined,
): Promise<ApiResponse<HistoryEntry[]>> {
  if (!userId) {
    return { data: [], error: null };
  }
  return safeFetch<HistoryEntry[]>(
    `${API_BASE}/api/attacks/history?user_id=${encodeURIComponent(userId)}`,
    { method: 'GET' },
  );
}

/**
 * Create a new account.
 */
export async function signup(
  email: string,
  password: string,
): Promise<ApiResponse<AuthToken>> {
  return safeFetch<AuthToken>(
    `${API_BASE}/api/auth/signup`,
    jsonPost({ email, password }),
  );
}

/**
 * Log in with existing credentials.
 */
export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<AuthToken>> {
  return safeFetch<AuthToken>(
    `${API_BASE}/api/auth/login`,
    jsonPost({ email, password }),
    { 401: 'Incorrect email or password' },
  );
}
