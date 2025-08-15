#!/usr/bin/env python3
"""
Debug script to see exactly what Alpha Vantage is returning
"""

import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

ALPHA_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')
BASE_URL = 'http://localhost:8000'

def debug_market():
    print("🔍 Debugging Alpha Vantage Market Data...\n")
    
    print(f"API Key (first 10 chars): {ALPHA_API_KEY[:10] if ALPHA_API_KEY else 'NOT FOUND'}...")
    
    # Test 1: Check what our endpoint returns
    print("\n1. Testing our market endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/market/quote?symbol=AAPL")
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text[:500]}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nParsed JSON: {json.dumps(data, indent=2)}")
            
            # Check for common Alpha Vantage error messages
            if 'Note' in data:
                print(f"\n⚠️  Alpha Vantage Note: {data['Note']}")
            if 'Error Message' in data:
                print(f"\n❌ Alpha Vantage Error: {data['Error Message']}")
            if 'Information' in data:
                print(f"\nℹ️  Alpha Vantage Info: {data['Information']}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Test Alpha Vantage directly
    print("\n2. Testing Alpha Vantage directly...")
    try:
        alpha_url = "https://www.alphavantage.co/query"
        params = {
            'function': 'GLOBAL_QUOTE',
            'symbol': 'AAPL',
            'apikey': ALPHA_API_KEY,
        }
        
        print(f"Request URL: {alpha_url}")
        print(f"Request Params: {params}")
        
        response = requests.get(alpha_url, params=params, timeout=20)
        print(f"Alpha Vantage Status: {response.status_code}")
        print(f"Alpha Vantage Response: {response.text[:500]}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nAlpha Vantage Parsed: {json.dumps(data, indent=2)}")
            
    except Exception as e:
        print(f"❌ Alpha Vantage Direct Error: {e}")
    
    # Test 3: Check different symbols
    print("\n3. Testing different symbols...")
    symbols = ['AAPL', 'MSFT', 'GOOGL']
    for symbol in symbols:
        try:
            response = requests.get(f"{BASE_URL}/api/market/quote?symbol={symbol}")
            if response.status_code == 200:
                data = response.json()
                if 'Global Quote' in data and data['Global Quote']:
                    quote = data['Global Quote']
                    print(f"✅ {symbol}: ${quote.get('05. price', 'N/A')}")
                else:
                    print(f"⚠️  {symbol}: No data returned")
            else:
                print(f"❌ {symbol}: HTTP {response.status_code}")
        except Exception as e:
            print(f"❌ {symbol}: Error {e}")
    
    print("\n🎯 Debug complete!")
    print("\nCommon issues:")
    print("1. API key expired or invalid")
    print("2. Rate limit exceeded (5 calls/minute for free tier)")
    print("3. Alpha Vantage service temporarily down")
    print("4. Symbol not found or invalid")

if __name__ == "__main__":
    import json
    debug_market() 