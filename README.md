# Rail Super App

A beginner-friendly full-stack rail utility app built with:
- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MongoDB

## Features
- User signup and login with JWT
- Dashboard with quick actions and mock upcoming journeys
- Train search and booking UI
- PNR status checker
- Live train tracking mock UI
- Food ordering with cart using localStorage
- Rail help complaint form
- Dark mode and mock notifications

## Project Structure
```text
rail-super-app/
  frontend/
    index.html
    login.html
    dashboard.html
    styles.css
    script.js
  backend/
    server.js
    routes/
    models/
    controllers/
    data/
  package.json
  .env.example
```

## How to Run Locally
1. Open a terminal in `D:\c++.cpp\rail-super-app`
2. Install dependencies:
   `npm install`
3. Copy environment variables:
   `copy .env.example .env`
4. Make sure MongoDB is running locally on:
   `mongodb://127.0.0.1:27017/rail-super-app`
5. Start the app:
   `npm start`
6. Open your browser and visit:
   `http://localhost:5000`

## Helpful Development Commands
- Start normally: `npm start`
- Start in watch mode: `npm run dev`

## Notes
- Train, PNR, tracking, notifications, and food status use mock data.
- User accounts, bookings, and complaints use MongoDB.
- Cart, theme, and login session are stored in localStorage on the frontend.
