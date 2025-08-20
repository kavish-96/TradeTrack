import { apiGet } from './api';

let last = Promise.resolve();
const GAP_MS = Number(import.meta.env.VITE_MARKET_GAP_MS || 12000); // default 12s

function schedule(task) {
  const run = last.then(() => task()).catch(() => {/* swallow to keep chain */});
  // after completion, wait GAP_MS before next
  last = run.then(() => new Promise((resolve) => setTimeout(resolve, GAP_MS)));
  return run;
}

function isMarketFetchAllowed() {
  try {
    return sessionStorage.getItem('allow_market_fetch') === '1';
  } catch (_) {
    return false;
  }
}

export function getSimpleQuoteQueued(symbol) {
  if (!isMarketFetchAllowed()) {
    // Block unintended auto fetches
    return Promise.resolve({});
  }
  return schedule(() => apiGet(`/api/market/simple-quote?symbol=${encodeURIComponent(symbol)}`));
}

export function getOverviewQueued(symbol) {
  if (!isMarketFetchAllowed()) {
    return Promise.resolve({});
  }
  return schedule(() => apiGet(`/api/market/overview?symbol=${encodeURIComponent(symbol)}`));
}
