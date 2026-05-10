# HexaPhish

HexaPhish is a modern cybersecurity web application that detects phishing URLs using advanced heuristics and pattern matching. It calculates a risk score based on numerous threats such as missing HTTPS, obfuscation characters, long URLs, IP-based domains, and common phishing keywords.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express
- **Deployment:** Vercel (Frontend), Render/Vercel (Backend)

## Local Development

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Setup the Backend
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`.

### 2. Setup the Frontend
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Deployment Instructions

### Deploying Frontend to Vercel
1. Push this repository to GitHub.
2. Log into [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Vercel will automatically detect Vite and configure the build settings.
6. Click **Deploy**.

### Deploying Backend to Render
1. Log into [Render](https://render.com/).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Set any required environment variables (e.g., `PORT`).
8. Click **Create Web Service**.

**Important:** After deploying the backend, update the API endpoint URL in `frontend/src/pages/Home.jsx` from `http://localhost:5000/api/analyze` to your newly deployed Render URL.

## Features
- **Real-time URL Analysis**: Detects malformed URLs, IP domains, excessive subdomains, and keywords.
- **Risk Score Meter**: Visual indicator of the danger level of a URL.
- **Scan History**: Local storage based history of previously scanned URLs.
- **Cybersecurity Aesthetic**: Neon glow effects, dark mode, and sleek animations.
