# 🌿 ZeroWaste AI

> An AI-powered smart food rescue & redistribution platform that connects donors, NGOs, and volunteers to eliminate food waste in real-time.

---

## 🚨 The Problem

India wastes approximately **78.2 million tonnes** of food every year — that's **214,000 tonnes every single day**. Meanwhile, millions of people go hungry.

The core issue? There's no efficient, real-time bridge between those who have **surplus food** (restaurants, hostels, event caterers) and those who can **redistribute it** (NGOs, volunteers).

Existing solutions are mostly static listing boards — someone posts leftover food, someone else might see it hours later. By then, the food is often no longer safe to eat. There's **no quality check, no live coordination, and no tracking**.

---

## 💡 The Solution

**ZeroWaste AI** solves this with an intelligent, real-time rescue pipeline:

1. 📸 **Donor uploads a food photo** → Gemini AI instantly analyzes freshness, estimates shelf life, and checks safety
2. 🛡️ **AI Safety Gate** → If the food is flagged as unsafe, it's automatically blocked from being listed
3. 📋 **Food gets listed** → Available donations appear on the NGO dashboard in real-time
4. 🏥 **NGO claims the food** → The donation status updates live across all dashboards
5. 🚚 **Volunteer picks it up** → Live GPS tracking shows the volunteer's location on an interactive map
6. ✅ **Delivered!** → The full rescue cycle completes, and everyone is notified

No manual refresh. No guesswork. No wasted food. 🎯

---

## 🔍 What Makes This Different?

| Feature | Typical Food Apps | ZeroWaste AI |
|---|---|---|
| Food quality check | ❌ None | ✅ AI-powered freshness score (0–100) + shelf life estimation |
| Safety validation | ❌ Trust-based | ✅ Gemini AI auto-blocks unsafe food |
| Live tracking | ❌ Static addresses | ✅ Real-time GPS on interactive map |
| Status updates | ❌ Manual / delayed | ✅ Instant via Firebase real-time listeners |
| Role-based dashboards | ❌ One generic screen | ✅ Dedicated workflows for Donors, NGOs & Volunteers |
| Navigation | ❌ Copy-paste address | ✅ One-click Google Maps navigation |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| 🖥️ Frontend | React + TypeScript + Vite |
| 🎨 Styling | Tailwind CSS |
| 🔥 Backend & Database | Firebase (Firestore + Auth) |
| 🤖 AI Engine | Google Gemini API (`gemini-3-flash-preview`) |
| 🗺️ Maps | Leaflet + OpenStreetMap + React-Leaflet |
| ✨ Animations | Framer Motion |
| 🔐 Authentication | Google OAuth via Firebase Auth |

---

## 🧭 How It Works

### 🍽️ Food Donor Flow
1. Sign in with Google and select the **Donor** role
2. Click **Upload Food Image** and take/upload a photo of the surplus food
3. The AI automatically detects the food, scores freshness, and estimates shelf life
4. Fill in quantity, preparation time, contact number, and pickup address
5. Hit **List for Rescue** — your food is now live on the platform with your GPS coordinates

### 🏥 NGO Flow
1. Sign in and select the **NGO** role
2. View all available food donations on the **Live Mission Map** with real-time markers
3. Click **Claim for Redistribution** on any available donation
4. Coordinate with volunteers for pickup through the dashboard

### 🚚 Volunteer Flow
1. Sign in and select the **Volunteer** role
2. See claimed donations waiting for pickup on the **Mission Navigation** map
3. Click **Start Rescue Mission** to accept a pickup
4. Your live GPS location is tracked and visible to NGOs on the map
5. Once delivered, hit **Mark as Delivered** to complete the rescue cycle

---

## 🚀 Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Firebase](https://console.firebase.google.com/) project with **Authentication** (Google provider) and **Firestore** enabled
- A [Gemini API Key](https://aistudio.google.com/apikey)

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NSBunny/Zerowaste-AI.git
   cd Zerowaste-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be running at **http://localhost:3000** 🎉

### 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

---

## 📁 Project Structure

```
zerowaste-ai/
├── src/
│   ├── components/        # 🧩 Reusable UI (Navbar, FoodCard, RescueMap)
│   ├── context/           # 🔐 Auth context (Google OAuth)
│   ├── lib/               # 🔥 Firebase config & utilities
│   ├── pages/             # 📄 Dashboard pages (Home, Donor, NGO, Volunteer)
│   ├── services/          # 🤖 AI service + Database service
│   └── types.ts           # 📝 TypeScript type definitions
├── .env.example           # 🔑 Environment variable template
├── firestore.rules        # 🛡️ Firestore security rules
└── vite.config.ts         # ⚡ Vite configuration
```

---

## 📄 License

Apache-2.0

---

<p align="center">
  Built with 💚 by <strong>Team Idea-Igniters</strong>
</p>
