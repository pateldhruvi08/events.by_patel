# Event Management System

A full-stack event management application built with FastAPI (Backend) and Vanilla JS/HTML/CSS (Frontend).

## Prerequisites

- Python 3.8+
- PostgreSQL (Ensure it is running and you have a database named `event_management_db`)

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure Environment Variables:
    - Open `.env` file in `backend/` directory.
    - Update `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_SERVER`, `POSTGRES_DB` with your local PostgreSQL credentials.
    - **Important:** Ensure the database `event_management_db` exists in your PostgreSQL instance.

5.  Initialize the Database with Seed Data:
    ```bash
    python -m app.initial_data
    ```

6.  Run the Backend Server:
    ```bash
    python run.py
    ```
    The API will be available at `http://localhost:8000`.
    API Documentation (Swagger UI): `http://localhost:8000/docs`

### 2. Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Serve the files using a local server (e.g., Live Server extension in VS Code, or Python `http.server`).
    
    Using Python:
    ```bash
    cd frontend
    python -m http.server 5500
    ```
3.  Open your browser and visit `http://localhost:5500`.

## Features

- **User Authentication**: Register and Login.
- **Service Browsing**: View available event packages.
- **Booking System**: Book services for specific dates.
- **Dashboard**: View your booking history and status.
- **Admin**: (Backend ready) Admin endpoints available for managing users and bookings.

