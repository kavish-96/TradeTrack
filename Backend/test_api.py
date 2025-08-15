#!/usr/bin/env python3
"""
Simple test script to verify TradeTrack API endpoints
Run this from the Backend directory after starting the server
"""

import requests
import json

BASE_URL = 'http://localhost:8000'

def test_api():
    print("🧪 Testing TradeTrack API endpoints...\n")
    
    # Test 1: Root endpoint
    print("1. Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint working: {data['status']}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test 2: Market quote (no auth required)
    print("\n2. Testing market quote endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/market/quote?symbol=AAPL")
        if response.status_code == 200:
            data = response.json()
            if 'Global Quote' in data:
                print("✅ Market quote endpoint working")
                quote = data['Global Quote']
                if '05. price' in quote:
                    print(f"   AAPL price: ${quote['05. price']}")
            else:
                print("⚠️  Market quote endpoint working but no data (check Alpha Vantage API key)")
        else:
            print(f"❌ Market quote failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ Market quote error: {e}")
    
    # Test 3: Registration endpoint
    print("\n3. Testing registration endpoint...")
    try:
        test_user = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User",
            "two_factor_enabled": False
        }
        response = requests.post(f"{BASE_URL}/api/accounts/register/", json=test_user)
        if response.status_code == 201:
            print("✅ Registration endpoint working")
            print("   Test user created successfully")
        else:
            print(f"⚠️  Registration endpoint response: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ Registration error: {e}")
    
    # Test 4: JWT token endpoint
    print("\n4. Testing JWT token endpoint...")
    try:
        login_data = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/token/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            if 'access' in data and 'refresh' in data:
                print("✅ JWT token endpoint working")
                print("   Access token received")
                access_token = data['access']
                
                # Test 5: Protected endpoint with JWT
                print("\n5. Testing protected endpoint with JWT...")
                headers = {'Authorization': f'Bearer {access_token}'}
                response = requests.get(f"{BASE_URL}/api/accounts/me/", headers=headers)
                if response.status_code == 200:
                    print("✅ Protected endpoint working with JWT")
                    user_data = response.json()
                    print(f"   User: {user_data.get('username', 'N/A')}")
                else:
                    print(f"❌ Protected endpoint failed: {response.status_code}")
            else:
                print("❌ JWT response missing tokens")
        else:
            print(f"❌ JWT token failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"❌ JWT token error: {e}")
    
    print("\n🎯 API testing complete!")
    print("\nNext steps:")
    print("1. Check any failed endpoints above")
    print("2. If Alpha Vantage isn't working, verify your API key in .env")
    print("3. Start integrating with your React frontend")

if __name__ == "__main__":
    test_api() 