export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export function getAccessToken() {
  return localStorage.getItem('access');
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  // Clear session-scoped cached data when session expires or user logs out
  try {
    const PREFIX = 'tt_cache:';
    const toRemove = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(PREFIX)) toRemove.push(k);
    }
    toRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (_) {}
}

let alertedUnauthorized = false;
async function handleResponse(res, method, path) {
  if (res.ok) {
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : await res.text();
  }
  if (res.status === 401) {
    clearTokens();
    if (!alertedUnauthorized) {
      alertedUnauthorized = true;
      try { alert('Your session has expired. Please sign in again.'); } catch (_) {}
    }
    localStorage.setItem('currentPage', 'login');
    window.location.reload();
    const err401 = new Error('Unauthorized');
    err401.status = 401;
    throw err401;
  }
  let detail = `HTTP ${res.status}`;
  try {
    const data = await res.json();
    detail = data;
  } catch (_) {}
  const err = new Error(`${method} ${path} failed: ${res.status}`);
  err.data = detail;
  err.status = res.status;
  throw err;
}

export async function apiGet(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, credentials: 'omit' });
  return handleResponse(res, 'GET', path);
}

export async function apiPost(path, body, opts = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', body: JSON.stringify(body), headers, credentials: 'omit' });
  return handleResponse(res, 'POST', path);
}

export async function apiPut(path, body, opts = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', body: JSON.stringify(body), headers, credentials: 'omit' });
  return handleResponse(res, 'PUT', path);
}

export async function apiDelete(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers, credentials: 'omit' });
  return handleResponse(res, 'DELETE', path);
}
