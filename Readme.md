# The Horizons - Full-Stack Booking Platform

A modern, full-stack hospitality platform designed for travelers exploring Vietnam. This comprehensive application provides a seamless experience for booking hotels, tours, cruises, and buses, complete with a powerful admin dashboard for management.

---

## ✨ Core Features

* **Multi-Service Booking Engine:** A unified platform to manage and book various travel services including Hotels, Tours, Cruises, and Buses.
* **Dynamic Pricing & Availability:** Sophisticated pricing engine that supports seasonal rates, special event pricing, and real-time availability management.
* **Comprehensive Admin Dashboard:** A secure, role-based dashboard for complete control over listings, bookings, users, and system settings.
* **Secure Authentication & Payments:** Integrated with Google OAuth for easy user login and multiple payment gateways like PayPal for secure transactions.
* **Automated Notifications:** Transactional email system for booking confirmations, payment receipts, and status updates.

---

## 🛠️ Tech Stack

The project is a monorepo with a React frontend and a Node.js backend.

### Backend (Node.js / Express.js)

* **Framework:** **Express.js**
* **Database:** **MongoDB** with **Mongoose** ODM (Indexed for performance).
* **API:** RESTful API documented with **Swagger (OpenAPI 3.0)**.
* **Authentication:**
    * **JWT** for secure, stateless session management.
    * Password hashing with **`bcryptjs`**.
* **Payments:** Modular integration with  **OnePay**.
* **File Management:** **Cloudinary** for cloud-based media uploads.
* **Email Service:** **Nodemailer** for dynamic HTML notifications.

### Frontend (React.js)

* **Framework:** **React.js**
* **State Management:** **Redux** for centralized state.
* **UI Components:** **Material-UI** and **TailwindCSS**.
* **API Communication:** **Axios**.

---

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

* Node.js (v16 or later recommended)
* MongoDB (Local instance or MongoDB Atlas)
* Git

### 1. Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd betel-hospitality

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

### 2. Configure Environment Variables

Create a `.env` file in the `/backend` directory and populate it with your credentials:

```bash
# Server Configuration
PORT=8800
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/betel_hospitality

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Email Service (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password

# Payment Gateway Credentials
PAYPAL_CLIENT_ID=...

# Cloudinary for File Uploads
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

```

### 3. Run the Application

You can run both the backend and frontend servers concurrently.

```bash
# Terminal 1: Run the backend server (starts at port 8800)
cd backend
npm start

# Terminal 2: Run the frontend development server
cd frontend
npm start

```

---

## 📖 API Documentation (Swagger)

The backend API is fully documented using Swagger (OpenAPI), which provides an interactive UI to explore and test the endpoints.

* **Access URL:** `http://localhost:8800/api-docs` (Available when the backend is running).

### How to Use the Swagger UI

The Swagger UI allows you to test API endpoints directly from your browser.

#### 1. Authorization (For Protected Routes)

Most endpoints (like creating a hotel or viewing admin data) require a JWT.

1. **Get a Token:**
* Navigate to the **Admin** tag and expand `POST /api/admin/login`.
* Click **"Try it out"**.
* Enter the admin credentials in the request body.
* Click **"Execute"**.
* Copy the token value from the response body.


2. **Authorize Your Session:**
* Click the green **"Authorize"** button at the top right.
* Paste your token into the Value field. **Important:** Prefix the token with `Bearer ` (e.g., `Bearer eyJhbGci...`).
* Click **"Authorize"** and then **"Close"**.



#### 2. Testing an Endpoint

1. **Find an Endpoint:** Expand a tag (e.g., Hotels, Users) to see routes.
2. **Try it Out:** Click on an endpoint (e.g., `GET /api/hotels`), then click **"Try it out"**.
3. **Execute:** Fill in parameters if needed and click the blue **"Execute"** button.
4. **Review:** Check the Request URL, Response Body, and Status Code (200, 401, 404, etc.).

---

## 🚢 Deployment (CI/CD)

This project is configured for deployment using GitLab CI/CD, Docker, and a VPS.

### GitLab CI/CD Variables

Navigate to **Settings -> CI/CD -> Variables** in your GitLab repository and add the following keys:

| Key | Description / Example Value |
| --- | --- |
| `DOCKER_USER` | Your Docker Hub username (e.g., `traitimtrongvang10`) |
| `DOCKER_PASS` | Your Docker Hub password or access token |
| `SSH_PRIVATE_KEY` | Private key content to SSH into your VPS |
| `VPS_IP` | Target VPS IP address (e.g., `116.118.48.142`) |
| `VPS_USER` | VPS Username (e.g., `root`) |
| `DEV_API_URL` | `https://api-dev.betelhospitality.com` |
| `PROD_API_URL` | `https://api.betelhospitality.com` |
| `ENV_DEV_FILE` | Copy the entire content of your `backend.dev.env` file here |
| `ENV_PROD_FILE` | Copy the entire content of your `backend.prod.env` file here |

```

```
