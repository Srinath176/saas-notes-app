export const TOKEN_KEY = "saas_notes_token";
export const EMAIL_KEY = "saas_notes_email";

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
