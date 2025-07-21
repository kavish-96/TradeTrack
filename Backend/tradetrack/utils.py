# "2R7G249B8NLR7Q7D"

# utils.py
import requests

ALPHA_VANTAGE_API_KEY = "2R7G249B8NLR7Q7D"  # Replace this with your actual key
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"

def get_stock_price_and_name(symbol):
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY
    }

    try:
        response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
        data = response.json()

        print("🔍 API Raw Response:", data)  # Debug print

        quote = data.get("Global Quote", {})
        price = quote.get("05. price")

        if not price:
            print("⚠️ Could not find '05. price' in response.")
            return None

        return {
            "name": symbol.upper(),  # Alpha Vantage doesn't return full name
            "price": float(price)
        }

    except Exception as e:
        print("❌ API Fetch Error:", str(e))
        return None

from .models import HistoricalPrice, Stock
from datetime import datetime
from django.conf import settings


def fetch_and_store_historical_data(stock):
    """
    Fetch historical prices for the given stock and store in DB.
    """
    symbol = stock.symbol.upper()
    api_key = settings.ALPHA_VANTAGE_API_KEY

    print(f"📈 Fetching historical data for {symbol}...")

    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}"
    response = requests.get(url)

    # if response.status_code != 200:
    #     print(f"Failed to fetch historical data for {symbol}")
    #     return False

    data = response.json().get('Time Series (Daily)', {})
    if not data:
        print(f"No historical data found for {symbol}")
        return False

    for date_str, values in list(data.items())[:30]:  # limit to last 30 days
        HistoricalPrice.objects.update_or_create(
            symbol=symbol,
            date=datetime.strptime(date_str, "%Y-%m-%d").date(),
            defaults={'close_price': float(values['4. close'])}
        )

    print(f"✅ Historical data stored for {symbol}")
    return True