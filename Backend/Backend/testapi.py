# test_api.py
import requests

API_KEY = "2R7G249B8NLR7Q7D"  # Replace with your real key
BASE_URL = "https://www.alphavantage.co/query"

def get_stock_price_and_name(symbol):
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": API_KEY
    }

    try:
        response = requests.get(BASE_URL, params=params)
        data = response.json()
        print("📦 Full Response:")
        print(data)

        quote = data.get("Global Quote", {})
        price = quote.get("05. price")

        if not price:
            print("⚠️ No price found.")
            return None

        return {
            "name": symbol.upper(),
            "price": float(price)
        }

    except Exception as e:
        print("❌ Error:", str(e))
        return None

# Test it
symbol = "AAPL"
result = get_stock_price_and_name(symbol)
print("✅ Result:", result)
