# Full-Stack Notes Manager (React + Django)

A robust full-stack blueprint for modern web architecture. This project serves as a comprehensive reference for integrating a **React** frontend with a **Django REST Framework (DRF)** backend.

The primary focus is demonstrating the "handshake" between technologies—from secure stateless authentication to persistent relational data storage.

## 🛠 1. Tech Stack

* **Frontend:** React (Vite), Axios (API handling), `jwt-decode`.
* **Backend:** Django, Django REST Framework (DRF).
* **Database:** PostgreSQL (Relational data modeling).
* **Security:** JWT (JSON Web Tokens) for stateless authentication.

## 🚀 2. Key Features & Learning Objectives

* **JWT Authentication:** Implementation of access/refresh token rotation logic.
* **Full CRUD Pipeline:** Create, Read, Update, and Delete operations synced across the stack.
* **Role-Based Access Control (RBAC):** Distinct logic paths for Admin vs. Regular Users.
* **The "Handshake":** Detailed configuration of CORS (Cross-Origin Resource Sharing).
* **PostgreSQL Integration:** Managing relational data via Django's ORM to prevent SQL injection.

## ⚙️ 3. How It Works

1. **Request:** React sends a request with a JWT `Bearer` token in the header.
2. **Validation:** Django verifies the token signature against the server's `SECRET_KEY`.
3. **Process:** The backend interacts with PostgreSQL based on user permissions.
4. **Response:** Data is returned as JSON and rendered dynamically in the React UI.

## 🧠 4. Lessons Learned & Technical Challenges

### The JWT "Silent" Failure

Managing token expiration gracefully was a major hurdle. A simple expired token would normally boot a user out.

* **The Fix:** I implemented an **Axios Interceptor**. This middleware intercepts `401 Unauthorized` errors, automatically hits the `/api/token/refresh/` endpoint, and retries the original request seamlessly.

### Environment Variable Security (PostgreSQL)

Moving from SQLite to PostgreSQL introduced the risk of hardcoding credentials.

* **The Fix:** I transitioned to a `.env` architecture using `python-dotenv`. This taught me the criticality of `.gitignore` and mapping environment variables to the `DATABASES` dictionary in `settings.py`.

---

## 🚦 Getting Started

### i. Backend Setup (Django)

```bash
# Setup environment
mkdir backend && cd backend
python -m venv myenv

# Activate (Mac/Linux)
source myenv/bin/activate  
# Activate (Windows)
myenv\Scripts\activate 

# Install dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt psycopg2-binary gunicorn python-dotenv dj-database-url whitenoise

# Database initialization
python manage.py makemigrations
python manage.py migrate

# Start the server
python manage.py runserver

```

### ii. Frontend Setup (React + Vite)

```bash
# Create project
npm create vite@latest frontend -- --template react

cd frontend
npm install axios react-router-dom jwt-decode

# Start development server
npm run dev

```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **POST** | `/api/token/` | Obtain Access/Refresh pair | Public |
| **POST** | `/api/token/refresh/` | Refresh expired access token | Public |
| **POST** | `/api/user/register/` | Register a new account | Public |
| **GET** | `/api/user/me/` | Get current user profile details | Authenticated |
| **GET** | `/api/notes/` | List user-specific notes | Authenticated |
| **DELETE** | `/api/notes/delete/<int:pk>/` | Delete a specific note | Owner Only |
| **POST** | `/api/users/<int:id>/` | Update specific user details | Admin |
| **DELETE** | `/api/users/delete/<int:id>/` | Remove user from system | Admin |
| **GET** | `/admin/` | Django Admin Panel | Superuser |

---

To make this professional and "recruiter-ready," it’s best to separate the backend and frontend configurations. I’ve cleaned up the syntax, added comments to explain each variable, and used standard naming conventions.

Here are the templates you can include in your repository as `.env.example` files:

---

### 📂 Backend `.env.example`

**File Location:** `/backend/.env`

*Note: Never commit your actual `.env` file to GitHub. Use this template instead.*

```bash
# --- Django Core Settings ---
SECRET_KEY='django-insecure-your-super-secret-key-here'
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost,your-render-domain.onrender.com

# --- Security & CORS ---
# Frontend URLs allowed to make requests to this API
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.vercel.app
CSRF_TRUSTED_ORIGINS=http://localhost:5173,https://your-frontend-domain.vercel.app

# --- Database Configuration (PostgreSQL) ---
# Format: postgres://USER:PASSWORD@HOST:PORT/NAME
DATABASE_URL=postgres://db_user:db_password@localhost:5432/notes_db

# Package used is `dj-database-url`; it allows Django to read that single `DATABASE_URL` string from your `.env` and convert it into a dictionary that Django understands.

# --- Initial Admin Setup (Custom Script) ---
# Used for automated superuser creation via 'python manage.py create_admin'
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password_123

```

---

### 📂 Frontend `.env.example`

**File Location:** `/frontend/.env`

*Note: In Vite, variables must be prefixed with `VITE_` to be accessible.*

```bash
# The base URL for your Django API
VITE_API_URL=http://127.0.0.1:8000

# For Production (uncomment when deploying)
# VITE_API_URL=https://your-backend-api.onrender.com

```

---
