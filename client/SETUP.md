# Wiring the frontend to tasky-server

This folder only contains the files that changed to make the app talk to
the Express/MongoDB backend instead of localStorage. Copy them into your
existing `src/`, overwriting the matching files.

## Files in this bundle

| File | What changed |
|------|--------------|
| `src/api/client.js` | **New.** Fetch wrapper — attaches the JWT, parses JSON, throws on errors. |
| `src/context/AuthContext.jsx` | Now calls `/api/auth/*` instead of a local users table. Stores a JWT (`tasky_token`) instead of the old users table. Adds a `loading` flag while it verifies the token on load. |
| `src/context/TaskContext.jsx` | Now calls `/api/tasks/*` instead of localStorage. Mongo's `_id` is normalized to `id` so nothing downstream needs to change. |
| `src/components/ProtectedLayout.jsx` | Waits for `loading` from `AuthContext` before deciding whether to redirect, so a page refresh doesn't flash you to `/login` while the token is being checked. |
| `src/components/TaskCard.jsx` | Notes-save is now an API call; failures are logged, not blocking. |
| `src/components/TaskModal.jsx` | Accepts an `error` prop and shows it (used by the add/edit form). |
| `src/pages/Login.jsx`, `src/pages/Signup.jsx` | `login()`/`signup()` are now async — forms await them and show a submitting state. |
| `src/pages/MyTasks.jsx` | Add/edit now await the API call and show a real error in the modal if it fails (e.g. server down, validation error). |
| `src/pages/Settings.jsx` | `updateProfile()` is now async and can fail — added an error message. |

Not included because nothing changed: `Home.jsx`, `Dashboard.jsx`,
`Calendar.jsx`, `Navbar.jsx`, `Logo.jsx`, `ThemeContext.jsx`, `App.jsx`,
`main.jsx`, `index.css`, `icons.jsx`.

## New setup step

Add a `.env` file at your frontend's root (same level as `package.json`):

```bash
cp .env.example .env
```

It just needs:
```
VITE_API_URL=http://localhost:5000/api
```
Change the URL later if you deploy the backend somewhere else.

## Running the full stack locally

```bash
# terminal 1
cd tasky-server
npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run dev

# terminal 2
cd tasky-client         # your existing Vite app
npm run dev
```

Open the frontend (usually `http://localhost:5173`) — signup/login now
create real users in MongoDB, and tasks persist there per-user instead of
in the browser's localStorage.

## What to double check
- If you get CORS errors in the browser console, confirm `CLIENT_ORIGIN`
  in the backend's `.env` matches the exact origin your frontend runs on.
- If login/signup silently fails, open the Network tab — `client.js`
  surfaces the server's `message` field, so check the response body.
