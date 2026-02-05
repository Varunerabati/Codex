# Full-Stack Task Management Web Application

A complete task management application built with React + Vite (frontend), Node.js + Express (backend), MongoDB + Mongoose (database), and Tailwind CSS (styling).

## Why this stack?

- **React + Vite**: React gives a component-driven UI model and reusable hooks/components. Vite provides very fast dev startup and HMR.
- **Node.js + Express**: Minimal, flexible server framework ideal for building REST APIs quickly.
- **MongoDB + Mongoose**: Document model is a natural fit for task records. Mongoose adds schema validation, relationships, and model helpers.
- **Tailwind CSS**: Utility-first classes speed up building consistent responsive UI without writing large custom CSS files.

## Architecture

```text
backend/
  src/
    config/      # DB connection
    controllers/ # Route handlers
    middleware/  # Auth, validation, errors
    models/      # Mongoose schemas
    routes/      # API routes
    utils/       # Token helper
frontend/
  src/
    api/         # Axios client
    components/  # Reusable UI
    context/     # Auth context
    pages/       # Page-level screens
```

## Authentication flow (JWT)

1. User registers/logs in from the React form.
2. Frontend calls `/api/auth/register` or `/api/auth/login`.
3. Backend validates input, hashes/checks password, issues JWT.
4. Frontend stores JWT in `localStorage`.
5. Axios interceptor adds `Authorization: Bearer <token>` automatically.
6. Protected backend routes verify token in `protect` middleware and set `req.userId`.
7. Tasks are always queried by `req.userId`, so users only access their own tasks.

## Frontend ↔ Backend communication

- Frontend uses Axios instance (`frontend/src/api/client.js`) with `baseURL` from `VITE_API_URL`.
- All task CRUD operations call REST endpoints under `/api/tasks`.
- Query params (`category`, `priority`, `sort`) are sent from filter controls.
- Backend returns enriched task objects with computed `status` (`Pending`, `Completed`, `Overdue`) for dashboard grouping.

## Features implemented

- JWT registration/login
- Protected task endpoints
- Create/edit/delete tasks
- Mark complete/incomplete
- Automatic overdue labeling
- Dashboard grouped by Pending / Completed / Overdue
- Filtering by category and priority
- Sorting by due date
- Input validation + centralized error handling

## Run locally

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` with your MongoDB connection string and JWT secret.

### 3) Start both apps

```bash
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks (protected)
- `GET /api/tasks?category=&priority=&sort=asc|desc`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id` (toggle completed)
- `DELETE /api/tasks/:id`

## Key implementation decisions

- **Status derivation on backend**: `status` is computed from `completed` + `dueDate` to avoid stale frontend-only status logic.
- **Single source of auth state**: React context stores user/token and exposes reusable methods.
- **Reusable UI blocks**: `TaskForm`, `TaskCard`, `TaskBoard`, and `ProtectedRoute` keep components focused and composable.
- **Validation before controller execution**: `express-validator` ensures bad input is rejected with clear 400 messages.
