import re, requests, os

def validate_symbol(symbol: str) -> bool:
    """Alphanumeric & exists on Alpha Vantage."""
    if not re.fullmatch(r"[A-Za-z0-9]{1,10}", symbol):
        return False

    url = "https://www.alphavantage.co/query"
    params = {
        "function": "SYMBOL_SEARCH",
        "keywords": symbol,
        "apikey": os.getenv("ALPHA_KEY", "demo")
    }
    try:
        data = requests.get(url, params=params, timeout=10).json()
        return any(match["1. symbol"].upper() == symbol.upper()
                   for match in data.get("bestMatches", []))
    except Exception:
        return False
