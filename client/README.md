# API Testing Tool - Client Application

This is the frontend client application for the **API Testing Tool**, a React single-page application built using Vite, TypeScript, and React Router.

## Technologies

- **UI Library**: React 19 with TypeScript
- **Bundler**: Vite 8
- **Routing**: React Router 7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios (configured with `withCredentials: true` to auto-propagate sessions)
- **Styling**: Modern Vanilla CSS variables with custom dark and light themes

## Features Connected to Backend

- **Authentication**: Sign Up, Log In, Log Out, Google OAuth, and automatic session persistence check (`GET /auth/me`) on refresh.
- **User Profile**: Real-time display of profile name, email, role, and avatar. Profile editing and password updating are fully connected to the backend.
- **API Tester**: Composes and executes HTTP queries through the server proxy, populating responses, headers, time, and sizes.
- **Request History**: Dynamically synced history logs loaded from the backend, supporting clearing and auto-populating request builders on click.
- **Collections & Saved Requests**: Creation, naming, updates, nested requests saving, and deletion are fully database-driven.
- **Dashboard Stats**: Real metrics (Total requests, success vs fail counts, method distribution) computed dynamically on the server.

## Installation & Setup

1. Make sure the backend server in `../server/` is configured and running on `http://localhost:5000`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build the production application:
   ```bash
   npm run build
   ```
5. Preview the built application:
   ```bash
   npm run preview
   ```
