# 🌾 AgriTactix

An interactive educational video game focused on agriculture and farming strategies.

## Stack

- **Frontend**: React + Vite + Three.js (@react-three/fiber) + Zustand
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 2. Install dependencies

```bash
cd agritactix
npm install
npm install --workspace=client
npm install --workspace=server
```

### 3. Configure environment

```bash
cp server/.env.example server/.env
# Edit server/.env and set your JWT_SECRET
```

### 4. Seed the database

```bash
cd server
node src/seed.js
```

This creates:
- Admin: `admin@agritactix.com` / `admin123`
- Player: `player@agritactix.com` / `player123`
- 5 lessons + 3 quizzes

### 5. Run the app

```bash
# Terminal 1 - Backend
cd agritactix/server
npm run dev

# Terminal 2 - Frontend
cd agritactix/client
npm run dev
```

Open http://localhost:3000

## Features

| Feature | Description |
|---|---|
| Auth | Register/Login with JWT, role-based (admin/player) |
| Lessons | 5 agricultural topics with structured content |
| Quizzes | Per-lesson quizzes with instant feedback + scoring |
| 3D Simulation | Interactive farm with planting, watering, harvesting, pest control |
| Progression | Points, badges, unlockable levels/crops |
| Admin Panel | Create/edit lessons & quizzes, player analytics, unlock content |
| Profile | Personal stats, badge collection, quiz history |

## Project Structure

```
agritactix/
├── client/src/
│   ├── pages/          # Route pages (Auth, MainMenu, Lessons, Quiz, Simulation, Profile, Admin)
│   ├── components/     # Navbar, FarmScene (3D), SimHUD
│   ├── store/          # Zustand global state
│   ├── api/            # Axios instance
│   └── styles/         # Global CSS
└── server/src/
    ├── models/         # User, Lesson, Quiz, Progress
    ├── routes/         # auth, lessons, quizzes, progress, admin
    └── middleware/     # JWT auth, admin guard
```
