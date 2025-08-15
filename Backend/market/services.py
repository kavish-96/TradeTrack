import os
import requests
from typing import Dict, Any

ALPHA_BASE_URL = 'https://www.alphavantage.co/query'


def get_alpha_api_key() -> str:
    """Get Alpha Vantage API key from environment"""
    # Import Django settings here to avoid circular imports
    from django.conf import settings
    
    # Try Django settings first, then environment
    api_key = getattr(settings, 'ALPHA_VANTAGE_API_KEY', None)
    if not api_key:
        api_key = os.getenv('ALPHA_VANTAGE_API_KEY', '')
    
    if not api_key:
        raise ValueError("ALPHA_VANTAGE_API_KEY not found in settings or environment")
    
    return api_key


def fetch_global_quote(symbol: str) -> Dict[str, Any]:
    """Fetch real-time quote from Alpha Vantage"""
    api_key = get_alpha_api_key()
    params = {
        'function': 'GLOBAL_QUOTE',
        'symbol': symbol,
        'apikey': api_key,
    }
    response = requests.get(ALPHA_BASE_URL, params=params, timeout=20)
    response.raise_for_status()
    return response.json()


def fetch_time_series(symbol: str, interval: str = 'daily', outputsize: str = 'compact') -> Dict[str, Any]:
    """Fetch historical data from Alpha Vantage"""
    api_key = get_alpha_api_key()
    
    if interval in ['daily', 'weekly', 'monthly']:
        function = f'TIME_SERIES_{interval.upper()}'
        params = {
            'function': function,
            'symbol': symbol,
            'outputsize': outputsize,
            'apikey': api_key,
        }
    else:
        # intraday
        function = 'TIME_SERIES_INTRADAY'
        params = {
            'function': function,
            'symbol': symbol,
            'interval': interval,
            'outputsize': outputsize,
            'apikey': api_key,
        }
    response = requests.get(ALPHA_BASE_URL, params=params, timeout=20)
    response.raise_for_status()
    return response.json() 