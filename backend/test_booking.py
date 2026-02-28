import requests

API_URL = "https://events-by-patel.onrender.com"

print("Registering...")
reg_res = requests.post(f"{API_URL}/auth/register", json={
    "email": "bookingtest@example.com",
    "username": "bookingtest",
    "password": "123"
})
print("Reg:", reg_res.status_code, reg_res.text)

print("Logging in...")
log_res = requests.post(f"{API_URL}/auth/login", data={
    "username": "bookingtest",
    "password": "123"
})
print("Login:", log_res.status_code, log_res.text)

if log_res.status_code == 200:
    token = log_res.json()["access_token"]
    
    print("Booking...")
    book_res = requests.post(f"{API_URL}/bookings/", headers={
        "Authorization": f"Bearer {token}"
    }, json={
        "service_id": 1,
        "event_date": "2026-03-14T18:00:00",
        "time": "18:00",
        "location": "Test Location",
        "package": "Standard Package",
        "special_requests": "None"
    })
    print("Booking:", book_res.status_code, book_res.text)
