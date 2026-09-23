# Image Manager

## Project Overview
Image Manager is a full-stack web application that provides a complete, secure user authentication flow and image uploading capabilities. It features secure JWT-based authentication using `httpOnly` cookies, email verification, a forgot/reset password flow, and allows users to upload images securely to Cloudinary. The frontend is a modern Single Page Application (SPA) built with React and Vite, while the backend is an Express/Node.js API backed by a MongoDB database.

## Live Deployments
- **Frontend:** [https://imagehandler.vercel.app](https://imagehandler.vercel.app)
- **Backend:** [https://imagehandlerbackend.vercel.app](https://imagehandlerbackend.vercel.app)

## Features
- **User Authentication:** Sign up, log in, and log out securely.
- **Session Management:** Secure access and refresh tokens stored via `httpOnly` cookies, with automatic token refreshing.
- **Account Verification:** Email-based account verification using NodeMailer.
- **Password Recovery:** Forgot password and secure password reset flow.
- **Image Upload:** Upload images directly to Cloudinary using `multer`.
- **API Rate Limiting:** Built-in protection against brute force attacks using `express-rate-limit`.
- **Modern UI:** Responsive, stylish frontend using Tailwind CSS (v4) and React Query for state/data fetching.

## Technology Stack

### Frontend
- **React (v19)** - UI Library
- **Vite (v8)** - Build tool and development server
- **React Router (v7)** - Routing
- **Tailwind CSS (v4)** - Styling
- **React Query (@tanstack/react-query)** - Server state and data fetching
- **TypeScript** - Language

### Backend
- **Node.js & Express (v5)** - Server framework
- **MongoDB & Mongoose** - Database and ORM
- **JSON Web Tokens (JWT)** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Sending emails (verification & password resets)
- **Cloudinary & Multer** - Image hosting and multipart/form-data parsing
- **TypeScript** - Language

## Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB account/cluster
- Cloudinary account
- A Gmail account (or SMTP server) for sending emails

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Start the backend development server:
```bash
npm run dev
```
*(The backend will run on http://localhost:3000)*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*(The frontend will run on http://localhost:5173)*

## Environment Variables
Create a `.env` file in the **backend** directory with the following variables. Do not commit your actual secrets to version control.

```env
# Server config
PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster...
DB_NAME=Uploader_User

# Nodemailer / Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Authentication (JWT)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Setup for Image Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the **frontend** directory:
```env
# Points to your backend API URL
VITE_API_URL=http://localhost:3000/api
```

## API Information

All API endpoints are prefixed with `/api`.

### Authentication Routes (`/api/auth` & `/api`)
- `POST /api/signup`: Register a new user (triggers verification email).
- `GET /api/verify/:token`: Verify user email.
- `POST /api/login`: Authenticate user and receive `httpOnly` cookies.
- `POST /api/forgot-password`: Send a password reset link.
- `POST /api/reset-password/:token`: Reset user password using token.
- `POST /api/refresh-token`: Refresh the access token using the refresh token cookie.
- `GET /api/auth/me`: Get current authenticated user (requires valid access token).
- `POST /api/auth/logout`: Clear cookies and invalidate refresh token.

### Image Routes (`/api/images`)
- `POST /api/images/upload`: Upload an image to Cloudinary (requires authentication and `multipart/form-data`).
