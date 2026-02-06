# Modern Task Management Application

A production-quality task management application with a clean, modern interface built with TypeScript, React, and Node.js. Designed to showcase intermediate-level development skills with professional UI/UX, smooth animations, and thoughtful user experience.

## Tech Stack

### Frontend
- **React 18** + **Vite** - Fast, modern development experience
- **TypeScript** - Type-safe code with excellent developer experience
- **Tailwind CSS** - Utility-first CSS for rapid, consistent styling
- **Framer Motion** - Smooth animations and micro-interactions
- **Lucide Icons** - Beautiful, consistent icon system
- **@dnd-kit** - Accessible drag-and-drop functionality
- **Sonner** - Elegant toast notifications

### Backend
- **Node.js** + **Express** - RESTful API server
- **SQLite** - Lightweight, serverless database
- **JWT Authentication** - Secure, stateless authentication
- **bcryptjs** - Password hashing

## Key Features

### Core Functionality
- JWT-based authentication with protected routes
- Create, edit, delete, and complete tasks
- Automatic overdue task detection
- Task prioritization (Low, Medium, High)
- Task categorization and filtering
- Due date tracking
- Search functionality with instant filtering

### Modern UX Enhancements
- **Dark Mode** - Seamless light/dark theme toggle with system preference detection
- **Drag & Drop** - Reorder tasks intuitively within columns
- **Undo Delete** - 5-second grace period to restore deleted tasks
- **Toast Notifications** - Elegant feedback for all actions
- **Skeleton Loaders** - Professional loading states
- **Smooth Animations** - Framer Motion-powered transitions
- **Keyboard Shortcuts** - Ctrl+K to focus search
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Accessibility** - ARIA labels, keyboard navigation, proper contrast

### UI Components
Professional, reusable component library:
- Custom Button with variants and loading states
- Styled Input, Select, and Textarea components
- Card components with variants
- Badge system for status indicators
- Skeleton loaders for better perceived performance

## Architecture

```text
backend/
  src/
    config/         # Database connection
    controllers/    # Route handlers
    middleware/     # Auth, validation, error handling
    repositories/   # Data access layer
    routes/         # API route definitions
    utils/          # JWT token generation

frontend/
  src/
    api/            # Axios HTTP client
    components/     # React components
      ui/           # Reusable UI component library
    context/        # React Context (Auth, Theme)
    hooks/          # Custom React hooks
    pages/          # Page-level components
    types/          # TypeScript type definitions
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

## Design Philosophy

This application demonstrates professional-level development with:

- **Clean, Modern Aesthetic** - Inspired by Linear, Notion, and Todoist
- **Smooth Interactions** - Framer Motion animations for delightful UX
- **Accessibility First** - Keyboard navigation, ARIA labels, proper focus management
- **Performance** - Skeleton loaders, optimized re-renders, efficient state management
- **Type Safety** - Full TypeScript implementation with proper interfaces
- **Code Organization** - Modular architecture with clear separation of concerns
- **Production Ready** - Error handling, loading states, user feedback

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

Update `backend/.env` with your JWT secret (SQLite database is auto-configured).

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

## Technical Highlights

### Frontend
- **TypeScript Throughout** - Full type safety with interfaces for all data models
- **Context API** - Centralized auth and theme state management
- **Custom Hooks** - `useKeyboardShortcuts` for keyboard navigation
- **Component Library** - Reusable UI components with consistent styling
- **Framer Motion** - Entrance animations, hover effects, and smooth transitions
- **Dark Mode** - Class-based dark mode with localStorage persistence
- **Responsive Grid** - Three-column layout that adapts to mobile
- **Accessibility** - Proper semantic HTML, ARIA labels, keyboard focus

### Backend
- **Repository Pattern** - Clean separation between data access and business logic
- **JWT Authentication** - Secure token-based auth with middleware protection
- **Input Validation** - express-validator for comprehensive request validation
- **Error Handling** - Centralized error middleware with proper status codes
- **SQLite Database** - Lightweight, no external database setup required

### User Experience
- **Optimistic UI Updates** - Instant feedback before server confirmation
- **Undo Functionality** - 5-second window to restore deleted tasks
- **Toast Notifications** - Rich notifications with actions (undo, dismiss)
- **Skeleton Loaders** - Professional loading states instead of spinners
- **Search** - Real-time task filtering as you type
- **Drag and Drop** - Smooth task reordering with visual feedback
- **Keyboard Shortcuts** - Ctrl+K for search focus, Enter to submit forms

## Project Structure

The codebase follows clean architecture principles:
- **Separation of Concerns** - UI, business logic, and data access are clearly separated
- **Reusability** - Component library approach for consistent UI
- **Type Safety** - TypeScript ensures compile-time error catching
- **Scalability** - Modular structure ready for feature expansion
- **Maintainability** - Clear file organization and naming conventions
