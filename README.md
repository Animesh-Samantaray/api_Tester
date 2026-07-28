# API Testing Tool (MERN Stack)

A professional, premium web application built for testing APIs, saving collections, maintaining request histories, and orchestrating requests without browser CORS restrictions. Similar to Postman, it offers a fully integrated backend proxy to query endpoints securely.

---

## Technical Stack

### Frontend (Client)
- **Framework**: React 19 (TypeScript) + Vite 8
- **Routing**: React Router 7
- **Styling**: Vanilla CSS with custom variables (Light/Dark themes)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Requests**: Axios with custom interceptors for session propagation and centralized error mapping.

### Backend (Server)
- **Framework**: Node.js & Express 5
- **Database**: MongoDB (Mongoose 9)
- **Authentication**: JWT stored in secure HTTP-only cookies
- **Third-Party Auth**: Google OAuth 2.0 (Passport.js)
- **API Requests Proxy**: Server-side Axios runner allowing arbitrary third-party endpoint queries.

---

## Features

- **Centralized API Tester Builder**: 
  - Compose queries with methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD).
  - Inject query parameters, custom headers, and raw JSON request body.
  - Choose between Bearer token or Basic Authentication.
  - Automatically substitues environment variable placeholders using `{{variableName}}` syntax.
- **Backend Request Proxy**: Routes requests through the Express proxy to bypass browser-level CORS policies, returning true headers, status codes, response bodies (pretty-printed), and millisecond response times.
- **Authentication & Security**:
  - Secure registration and email-password login.
  - Unified Google OAuth Login callback creating local users on-the-fly.
  - Persistent cookie sessions verifying login state on page refreshes.
  - Protected routing for workspace panels.
- **Simulated Sandboxing**: Supports local settings management, password updates, collections organization, and environment management persisted in secure local storage context.

---

## Project Structure

```
API Tester/
│
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Global navbar, route guards, toast overlays
│   │   ├── context/            # AuthContext (state + history), ThemeContext
│   │   ├── pages/              # Landing, LoginPage, SignUpPage, DashboardPage
│   │   ├── services/           # auth.service, request.service, central axios client
│   │   └── index.css           # Styling system & theme tokens
│   └── package.json
│
├── server/                     # Backend API Server
│   ├── configs/                # Passport Google strategy configurations
│   ├── controllers/            # auth.controller, request.controller
│   ├── helper/                 # Password hashing, token generators
│   ├── middlewares/            # Session token verification, json validators
│   ├── models/                 # User mongoose schema
│   ├── routes/                 # Express route entrypoints
│   ├── services/               # request.service proxy executor
│   ├── utils/                  # axios configuration utilities
│   ├── server.js               # Express entrypoint
│   └── package.json
│
└── README.md                   # Project Documentation
```

---

## Installation & Setup

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed, as well as a MongoDB database instance running.

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your_session_secret_key
NODE_ENV=development
```

### 3. Setup and Run Backend Server
From the root directory:
```bash
cd server
npm install
npm run dev
```
The server will start running on `http://localhost:5000`.

### 4. Setup and Run Frontend Client
From the root directory in another terminal shell:
```bash
cd client
npm install
npm run dev
```
Open your browser to `http://localhost:5173`.
