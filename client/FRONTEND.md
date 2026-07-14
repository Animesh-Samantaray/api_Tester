# APIHUB Frontend

APIHUB is a browser-based API testing interface. The current client is a React single-page application that lets users create requests, send browser `fetch` calls, inspect responses, organize saved requests, and manage a local profile.

> Status: the frontend is self-contained. Authentication, request history, collections, environments, and metrics are stored in the browser; no server API is connected yet.

## Technology

- React 19 with TypeScript
- Vite 8
- React Router 7
- Framer Motion for transitions and animated UI
- Lucide React for icons
- Plain CSS with CSS variables for light and dark themes

## Run locally

From the `client` directory:

```bash
npm install
npm run dev
```

Other available commands:

```bash
npm run build   # Type-check and create a production build
npm run lint    # Run Oxlint
npm run preview # Serve the production build locally
```

## Application routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Marketing landing page with feature, pricing, and FAQ sections | Public |
| `/login` | Sign in | Public |
| `/signup` | Create a locally stored account | Public |
| `/forgot-password` | Start the simulated reset-password flow | Public |
| `/reset-password` | Complete the simulated password reset | Public |
| `/dashboard` | API tester workspace | Authenticated users only |

Unknown routes redirect to `/`. The global navbar is hidden for the authentication pages. Attempting to open `/dashboard` while signed out redirects to `/login` and preserves the original location in route state.

## Main features

### Landing page

- Responsive product landing page with feature cards, pricing content, FAQ accordion, animated sections, and theme-aware styling.
- Interactive request-preview mockup. It simulates a response after a short delay; it does not make a real request.
- Navigation links smoothly scroll to page sections.

### Authentication and profile

- Sign up, login, logout, profile updates, password changes, and password reset are implemented as browser-storage simulations.
- Default demonstration account:

  ```text
  Email: admin@api.com
  Password: admin123
  ```

- “Remember me” stores the active session in `localStorage`; otherwise it is stored in `sessionStorage`.
- Users can choose from preset avatar URLs and update their display name in Dashboard Settings.

### API tester dashboard

The dashboard has five areas:

| Area | Functionality |
| --- | --- |
| Tester | Compose and send HTTP requests; view formatted body and response headers |
| Collections | Create, view, load, and delete collections of saved requests |
| History | Review or clear recently sent requests |
| Environment | Maintain enabled/disabled variables used as `{{variableName}}` placeholders |
| Settings | Update profile data and simulated password |

The request editor supports:

- HTTP methods including GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.
- URL query parameters, custom headers, and JSON request bodies.
- Bearer-token and Basic authentication headers.
- Environment-variable substitution in URLs, headers, and bearer tokens.
- Response status, duration, estimated payload size, headers, and collapsible JSON viewing.
- Saving configured requests to a collection.

Requests use the browser `fetch` API. If a request fails—for example, because the target does not allow CORS—the dashboard creates a clearly labelled simulated response and still records it in history.

### Appearance and feedback

- Light and dark themes, with dark as the initial default when no preference is saved.
- Theme selection persists between visits.
- Glass-style surfaces, responsive layouts, custom scrollbars, and JSON syntax colours are defined in `src/index.css`.
- Success, error, info, and warning toast notifications dismiss automatically after four seconds and can be closed manually.

## Browser storage

The client currently persists these keys:

| Key | Contents |
| --- | --- |
| `activeUser` | Persisted remembered user session |
| `registered_users` | Locally created users, including simulated passwords |
| `reset_token`, `reset_email` | Temporary values for the simulated reset flow |
| `api_history` | Up to 50 request-history records |
| `api_collections` | Saved request collections |
| `api_env` | Environment variables |
| `api_stats` | Total, successful, failed, and per-method request counts |
| `theme` | Selected `light` or `dark` theme |

On first use, the client seeds sample request history, a JSONPlaceholder collection, environment variables, and dashboard statistics.

## Source layout

```text
src/
  components/       Shared navbar, route guard, and toast UI
  context/          Authentication/data, theme, and toast providers
  pages/            Landing, authentication, password, and dashboard pages
  App.tsx           Route definitions and provider composition
  main.tsx          React entry point
  index.css         Global styles, theme variables, and reusable classes
```

## Important limitations before production

- Authentication is not secure: user records and plaintext simulated passwords are saved in browser storage.
- Password reset tokens are simulated and never emailed.
- Browser CORS rules still apply; a backend proxy is needed to test arbitrary third-party APIs reliably.
- Collections, history, environments, and profile settings are device/browser-local and are not synced.
- The dashboard fallback can record a simulated success when the actual network request fails, so it should not be treated as an authoritative API-monitoring result.

To connect this frontend to the `server` folder, replace the storage-based methods in `src/context/AuthContext.tsx` with authenticated server requests and consider routing API-test calls through a server-side proxy.
