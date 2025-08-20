// Simple session-scoped cache using sessionStorage
// Data persists during the tab/session and is cleared on logout/session expiry

const PREFIX = 'tt_cache:';

export function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function cacheSet(key, value) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (_) {}
}

export function cacheRemove(key) {
  try {
    sessionStorage.removeItem(PREFIX + key);
  } catch (_) {}
}

export function cacheClearAll() {
  try {
    const toRemove = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(PREFIX)) toRemove.push(k);
    }
    toRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (_) {}
}


