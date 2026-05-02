# 🌿 ZeroWaste AI

An AI-powered smart food rescue and redistribution platform linking donors, NGOs, and volunteers to eliminate food waste in real-time.

## Features

- **AI Food Analysis** — Uses Gemini AI to assess food freshness, safety, and estimated shelf life from photos
- **Multi-Role Dashboards** — Dedicated interfaces for Food Donors, NGOs, and Volunteers
- **Real-Time Tracking** — Live donation status updates and volunteer location tracking
- **Google Authentication** — Secure sign-in via Firebase Auth
- **Smart Matching** — Connects surplus food with nearby NGOs and volunteers

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Firebase (Firestore, Auth)
- **AI:** Google Gemini API
- **Maps:** Leaflet / OpenStreetMap

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Firebase](https://console.firebase.google.com/) project with Auth and Firestore enabled
- A [Gemini API key](https://aistudio.google.com/apikey)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/zerowaste-ai.git
   cd zerowaste-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and fill in your actual API keys and Firebase config values.

4. **Run the app:**
   ```bash
   npm run dev
   ```

## Project Structure

```
zerowaste-ai/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context (Auth)
│   ├── lib/            # Firebase initialization & utilities
│   ├── pages/          # Dashboard pages
│   ├── services/       # AI & database services
│   └── types.ts        # TypeScript type definitions
├── .env.example        # Environment variable template
├── firestore.rules     # Firestore security rules
└── vite.config.ts      # Vite configuration
```

## Environment Variables

See [`.env.example`](.env.example) for all required variables. **Never commit your `.env` file.**

## License

Apache-2.0
