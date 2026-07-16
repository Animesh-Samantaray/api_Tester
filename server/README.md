# API Testing Tool - Backend Server

This is the Express-based API server that powers the **API Testing Tool**, handling authentication, request histories, collections, saved request parameters, profile settings, and dashboard statistics.

## Technical Details

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose 9)
- **Authentication**: JWT-based session validation stored in secure HTTP-only cookies
- **Third-Party Auth**: Google OAuth (via Passport.js strategy)
- **Dependencies**: nodemon, jsonwebtoken, bcryptjs, cookie-parser, cors, helmet, morgan

## API Endpoints

### 1. Authentication (`/api/auth`)
- `POST /register`: Registers a new user.
- `POST /login`: Log in and sets secure JWT cookie.
- `POST /logout`: Clears cookie.
- `GET /me`: Returns logged-in user profile if authenticated.
- `GET /google`: Redirects to Google consent screen.
- `GET /google/callback`: Sets JWT cookie and redirects to client.
- `POST /forgot-password`: Generates database-backed recovery token.
- `POST /reset-password`: Resets password using verification token.

### 2. User Profile & Stats (`/api/user`)
- `GET /profile`: Get details of the active user.
- `PUT /profile`: Update name or avatar.
- `PUT /change-password`: Verifies current credentials and sets new password.
- `GET /stats`: Dynamically calculates dashboard metrics from history logs, collections, and saved requests.

### 3. API Proxy Runner (`/api/request`)
- `POST /send`: Sends HTTP request proxying custom methods, headers, auth payloads, and body inputs. Automatically creates a request history item in MongoDB.
- `GET /:requestId`: Retrieve details of a saved request.
- `PUT /:requestId`: Update saved request configuration.
- `DELETE /:requestId`: Delete a saved request.

### 4. Request History (`/api/history`)
- `GET /`: Lists request logs of the user (newest first).
- `DELETE /:id`: Removes a single history item.
- `DELETE /`: Clears all history items of the user.

### 5. Collections (`/api/collections`)
- `GET /`: Lists user collections with nested saved requests populated.
- `POST /`: Creates a new empty collection.
- `PUT /:collectionId`: Updates collection name or description.
- `DELETE /:collectionId`: Deletes a collection and all its saved requests.
- `POST /:collectionId/request`: Saves a request inside a collection.
- `GET /:collectionId/request`: Lists requests in a collection.

## Getting Started

1. Create a `.env` configuration file inside this directory (see root README for properties).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server with hot-reloading:
   ```bash
   npm run dev
   ```
