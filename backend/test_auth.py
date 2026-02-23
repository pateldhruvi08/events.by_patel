import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    print("Testing Registration...")
    payload = {
        "username": "agent_test_user",
        "email": "agent_test@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Registration Request Failed: {e}")
        return False

def test_login():
    print("\nTesting Login...")
    payload = {
        "username": "agent_test_user",
        "password": "password123"
    }
    # OAuth2 spec usually uses form-data (application/x-www-form-urlencoded)
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Login Request Failed: {e}")
        return False

if __name__ == "__main__":
    if test_register():
        test_login()
    else:
        # Try login anyway, maybe user already exists
        test_login()
