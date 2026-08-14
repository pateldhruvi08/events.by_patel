import requests
import json
import os

BASE_URL = "http://localhost:8000/api"

# Login
response = requests.post(f"{BASE_URL}/auth/login", data={"username": "mahi patel", "password": "admin123"})
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Add to gallery
data = {"title": "Test Image", "image_url": "static/uploads/20260814185140_test.jpg"}
response = requests.post(f"{BASE_URL}/gallery/", headers=headers, json=data)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
