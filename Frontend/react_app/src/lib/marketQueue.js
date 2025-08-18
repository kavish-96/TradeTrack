import { apiGet } from './api';

let last = Promise.resolve();
const GAP_MS = Number(import.meta.env.VITE_MARKET_GAP_MS || 12000); // default 12s

function schedule(task) {
  const run = last.then(() => task()).catch(() => {/* swallow to keep chain */});
  // after completion, wait GAP_MS before next
  last = run.then(() => new Promise((resolve) => setTimeout(resolve, GAP_MS)));
  return run;
}

export function getSimpleQuoteQueued(symbol) {
  return schedule(() => apiGet(`/api/market/simple-quote?symbol=${encodeURIComponent(symbol)}`));
}

export function getOverviewQueued(symbol) {
  return schedule(() => apiGet(`/api/market/overview?symbol=${encodeURIComponent(symbol)}`));
}
