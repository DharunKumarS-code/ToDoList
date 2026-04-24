# TaskFlow — Full-Stack Productivity Management System

A production-ready task management app built with React, Node.js, Express, and MongoDB.

## Features
- ✅ Full Task CRUD with priorities, due dates, categories, tags
- ✅ Subtasks with auto progress tracking
- ✅ Kanban board with drag-and-drop
- ✅ Calendar view with priority color indicators
- ✅ Analytics dashboard
- ✅ Time tracking per task
- ✅ Bulk actions (complete, delete, move)
- ✅ Search, filter, sort
- ✅ JWT Authentication
- ✅ Dark / Light mode
- ✅ Real-time updates via Socket.io
- ✅ Docker support

## Tech Stack
| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS      |
| State     | Zustand                           |
| Backend   | Node.js, Express                  |
| Database  | MongoDB + Mongoose                |
| Auth      | JWT + bcrypt                      |
| Real-time | Socket.io                         |
| Deploy    | Docker + docker-compose           |

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Backend
```bash
cd backend
npm install
# Edit .env if needed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Docker (Full Stack)
```bash
docker-compose up --build
```
Open http://localhost

## API Endpoints

| Method | Endpoint                        | Description          |
|--------|---------------------------------|----------------------|
| POST   | /api/auth/register              | Register             |
| POST   | /api/auth/login                 | Login                |
| GET    | /api/auth/me                    | Get current user     |
| GET    | /api/tasks                      | List tasks (filters) |
| POST   | /api/tasks                      | Create task          |
| PUT    | /api/tasks/:id                  | Update task          |
| DELETE | /api/tasks/:id                  | Delete task          |
| POST   | /api/tasks/bulk                 | Bulk actions         |
| GET    | /api/tasks/calendar             | Calendar grouped     |
| GET    | /api/tasks/analytics            | Analytics data       |
| POST   | /api/tasks/:id/subtasks         | Add subtask          |
| POST   | /api/tasks/:id/comments         | Add comment          |
| POST   | /api/tasks/:id/timer/start      | Start timer          |
| POST   | /api/tasks/:id/timer/stop       | Stop timer           |

## Project Structure
```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   ├── calendar/
│   │   │   ├── kanban/
│   │   │   ├── layout/
│   │   │   ├── tasks/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   └── Dockerfile
└── docker-compose.yml
```

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
