# Tasky server

Express + MongoDB (Mongoose) API for the Tasky frontend. Auth is JWT-based;
tasks are scoped to the logged-in user.

## Setup

```bash
cd tasky-server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — a local MongoDB (`mongodb://127.0.0.1:27017/tasky`) or a
  free MongoDB Atlas connection string.
- `JWT_SECRET` — any long random string. Generate one with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `CLIENT_ORIGIN` — where your Vite frontend runs (`http://localhost:5173`
  by default).

Run it:
```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start
```

Health check: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`

## API reference

All request/response bodies are JSON. Protected routes require
`Authorization: Bearer <token>`.

### Auth — `/api/auth`

| Method | Path        | Auth | Body                               | Returns                        |
|--------|-------------|------|-------------------------------------|---------------------------------|
| POST   | `/signup`   | No   | `{ name, email, password }`         | `{ user, token }`               |
| POST   | `/login`    | No   | `{ email, password }`               | `{ user, token }`               |
| GET    | `/me`       | Yes  | —                                    | `{ user }`                      |
| PUT    | `/profile`  | Yes  | `{ name }`                          | `{ user }`                      |

`user` shape: `{ id, name, email }`.

### Tasks — `/api/tasks` (all require auth)

| Method | Path   | Body                                            | Returns          |
|--------|--------|--------------------------------------------------|-------------------|
| GET    | `/`    | —                                                 | `{ tasks: [...] }` |
| POST   | `/`    | `{ title, dueDate, priority? }`                  | `{ task }`        |
| PUT    | `/:id` | any of `{ title, dueDate, priority, completed, notes }` | `{ task }` |
| DELETE | `/:id` | —                                                 | `{ message }`     |

`task` shape: `{ _id, user, title, dueDate, priority, completed, notes, createdAt, updatedAt }`.
`dueDate` is a plain `'YYYY-MM-DD'` string, matching the frontend's date input.

## Notes

- Passwords are hashed with bcrypt before saving (see `models/User.js`).
- Every task query filters by `req.user._id`, so one user can never read,
  edit, or delete another user's tasks.
- CORS is locked to `CLIENT_ORIGIN` — update it (or add an array of
  origins in `server.js`) if you deploy the frontend somewhere else.
