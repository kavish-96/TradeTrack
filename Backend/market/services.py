import os
import requests
from typing import Dict, Any
from time import time, sleep
import threading

ALPHA_BASE_URL = 'https://www.alphavantage.co/query'

# Simple in-memory caches
_QUOTE_CACHE: Dict[str, Dict[str, Any]] = {}
_OVERVIEW_CACHE: Dict[str, Dict[str, Any]] = {}
_QUOTE_TTL = int(os.getenv('ALPHA_QUOTE_TTL', '120'))        # seconds
_OVERVIEW_TTL = int(os.getenv('ALPHA_OVERVIEW_TTL', '86400')) # 24h

# Global throttle to respect free-tier limits
_ALPHA_MIN_INTERVAL = int(os.getenv('ALPHA_MIN_INTERVAL', '15'))  # seconds between calls
_LAST_CALL_TS = 0.0
_ALPHA_LOCK = threading.Lock()


def get_alpha_api_key() -> str:
    from django.conf import settings
    api_key = getattr(settings, 'ALPHA_VANTAGE_API_KEY', None) or os.getenv('ALPHA_VANTAGE_API_KEY', '')
    if not api_key:
        raise ValueError("ALPHA_VANTAGE_API_KEY not found in settings or environment")
    return api_key


def _throttled_request(params: Dict[str, Any]) -> requests.Response:
    global _LAST_CALL_TS
    with _ALPHA_LOCK:
        now = time()
        wait = (_LAST_CALL_TS + _ALPHA_MIN_INTERVAL) - now
        if wait > 0:
            sleep(wait)
        # Update last call to current time right before performing request
        _LAST_CALL_TS = time()
    # Perform request outside the lock
    response = requests.get(ALPHA_BASE_URL, params=params, timeout=30)
    return response


def _now() -> float:
    return time()


def _get_cached(cache: Dict[str, Dict[str, Any]], key: str, ttl: int):
    entry = cache.get(key)
    if not entry:
        return None
    if _now() - entry['ts'] <= ttl:
        return entry['value']
    return None


def _set_cache(cache: Dict[str, Dict[str, Any]], key: str, value: Any):
    cache[key] = {'value': value, 'ts': _now()}


def fetch_global_quote(symbol: str) -> Dict[str, Any]:
    api_key = get_alpha_api_key()
    params = {'function': 'GLOBAL_QUOTE', 'symbol': symbol, 'apikey': api_key}
    response = _throttled_request(params)
    response.raise_for_status()
    return response.json()


def fetch_time_series(symbol: str, interval: str = 'daily', outputsize: str = 'compact') -> Dict[str, Any]:
    api_key = get_alpha_api_key()
    if interval in ['daily', 'weekly', 'monthly']:
        function = f'TIME_SERIES_{interval.upper()}'
        params = {'function': function, 'symbol': symbol, 'outputsize': outputsize, 'apikey': api_key}
    else:
        function = 'TIME_SERIES_INTRADAY'
        params = {'function': function, 'symbol': symbol, 'interval': interval, 'outputsize': outputsize, 'apikey': api_key}
    response = _throttled_request(params)
    response.raise_for_status()
    return response.json()


def search_symbol(keywords: str) -> Dict[str, Any]:
    api_key = get_alpha_api_key()
    params = {'function': 'SYMBOL_SEARCH', 'keywords': keywords, 'apikey': api_key}
    response = _throttled_request(params)
    response.raise_for_status()
    return response.json()


def fetch_company_overview(symbol: str) -> Dict[str, Any]:
    api_key = get_alpha_api_key()
    params = {'function': 'OVERVIEW', 'symbol': symbol, 'apikey': api_key}
    response = _throttled_request(params)
    response.raise_for_status()
    return response.json()


class AlphaRateLimited(Exception):
    pass


def get_simple_quote_cached(symbol: str) -> Dict[str, Any]:
    cached = _get_cached(_QUOTE_CACHE, symbol, _QUOTE_TTL)
    try:
        data = fetch_global_quote(symbol)
        if 'Note' in data or 'Information' in data:
            if cached:
                return cached
            raise AlphaRateLimited(data.get('Note') or data.get('Information'))
        quote = data.get('Global Quote', {})
        price = quote.get('05. price')
        prev_close = quote.get('08. previous close')
        change = quote.get('09. change')
        change_percent = quote.get('10. change percent')
        if not price:
            if cached:
                return cached
            raise AlphaRateLimited('Empty quote payload')
        simple = {
            'symbol': symbol,
            'price': price,
            'previous_close': prev_close,
            'change': change,
            'change_percent': change_percent,
        }
        _set_cache(_QUOTE_CACHE, symbol, simple)
        return simple
    except requests.RequestException:
        if cached:
            return cached
        raise


def get_company_overview_cached(symbol: str) -> Dict[str, Any]:
    cached = _get_cached(_OVERVIEW_CACHE, symbol, _OVERVIEW_TTL)
    try:
        data = fetch_company_overview(symbol)
        if 'Note' in data or 'Information' in data or not data:
            if cached:
                return cached
            raise AlphaRateLimited(data.get('Note') or data.get('Information') or 'Empty overview')
        _set_cache(_OVERVIEW_CACHE, symbol, data)
        return data
    except requests.RequestException:
        if cached:
            return cached
        raise 