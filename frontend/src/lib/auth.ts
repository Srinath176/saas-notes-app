export const TOKEN_KEY = "saas_notes_token";
export const EMAIL_KEY = "saas_notes_email";

/**
 * Simple JWT decode function (no verification) to extract payload
 * Used for client-side token parsing - should not be used for security validation
 * @param token - JWT token string
 * @returns Decoded payload object or null if invalid
 */

// simple JWT decode (no verification) to extract payload
export function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function setEmail(email: string) {
  localStorage.setItem(EMAIL_KEY, email);
}

export function getEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}
