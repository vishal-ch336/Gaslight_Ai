const TOKEN_KEY = 'gaslight_token';
const EMAIL_KEY = 'gaslight_email';

/**
 * Store the JWT access token in localStorage.
 */
export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieve the stored JWT access token, or null if none exists.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove the stored JWT and email from localStorage (logout).
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

/**
 * Returns an Authorization header object for use in authenticated requests.
 * Returns an empty object if no token is stored.
 */
export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Persist the user's email alongside the token for display purposes.
 */
export function storeEmail(email: string): void {
  localStorage.setItem(EMAIL_KEY, email);
}

/**
 * Retrieve the stored user email.
 */
export function getEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}
