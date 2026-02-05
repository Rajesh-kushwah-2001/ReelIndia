# YouPlay

YouPlay is a full-stack, real-time social media application inspired by Instagram, with a dedicated Reels experience, follow graph, notifications, and modern mobile-first UI.

## Stack
- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB
- **Realtime:** Socket.io
- **Media Storage:** Cloudinary
- **Auth:** JWT (header token + secure HTTP-only cookie)

## Features
- Email/password signup and login
- JWT auth + protected APIs
- User profile with avatar/bio editing
- Follow/unfollow system
- Feed posts (image/video), likes/comments, delete own post
- Reels: vertical full-screen videos, loop/autoplay, real-time likes/comments/views
- Explore section for trending posts and reels
- Real-time notifications for likes/comments/follows/reel interactions
- Mobile-first dark-mode UI
- Pagination-ready feed (infinite-load style via incremental fetch)

## Project Structure
```
YouPlay/
  backend/
    src/
      config/ controllers/ middleware/ models/ routes/ socket/ utils/
  frontend/
    src/
      api/ components/ contexts/ hooks/ pages/
```

## Environment Setup

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and configure values:

```bash
cp backend/.env.example backend/.env
```

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

## Install
```bash
npm run backend:install
npm run frontend:install
```

## Run in development
In two terminals:

```bash
npm run backend:dev
npm run frontend:dev
```
Or run both in one command:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Replit notes
- Configure the same env vars in Replit Secrets.
- Start backend and frontend via separate run commands or use two services.
- Ensure MongoDB URI points to a reachable instance (MongoDB Atlas recommended).

## Production deployment checklist
- Strong `JWT_SECRET`
- Restrictive CORS origin
- HTTPS-only cookies (`secure=true`)
- Rate limiting + WAF/CDN
- Cloudinary upload presets / moderation policies
- MongoDB indexes and backup strategy


## Production start
```bash
npm run start
```
