import requests
import json
import os

BASE_URL = "http://localhost:8000/api"

# Login
response = requests.post(f"{BASE_URL}/auth/login", data={"username": "mahi patel", "password": "admin123"})
if response.status_code != 200:
    print(f"Login failed: {response.text}")
    exit(1)

token = response.json()["access_token"]
print("Logged in!")

# Create a dummy image file
with open("test.jpg", "wb") as f:
    f.write(b"fake image data")

# Upload
headers = {"Authorization": f"Bearer {token}"}
files = {"file": ("test.jpg", open("test.jpg", "rb"), "image/jpeg")}
response = requests.post(f"{BASE_URL}/admin/upload", headers=headers, files=files)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
