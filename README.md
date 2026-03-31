# UPSC Mains Booster 🎯

An AI-powered UPSC Mains preparation platform that generates structured case studies, quotes, ethical examples, and answer-ready content for all GS papers and Essay.

---

## 🚀 Features

- **AI Content Generation** — Google Gemini-powered generation of UPSC-ready structured content
- **Case Studies** — Real India + Global case studies with impact data
- **GS4 Ethics** — Ethical dimensions and examples for GS4
- **Quotes & Committees** — Thinkers, committee reports, government schemes
- **Structured Format** — Introduction → Body → Conclusion answer framework
- **Keyword Highlighting** — Visual emphasis of important terms
- **Export** — PDF & Markdown export for offline use
- **Bookmarks & Tags** — Organize content for revision
- **Search & Filters** — Filter by GS paper, theme, keyword
- **History Tracking** — All generated content with view counts & ratings
- **Authentication** — JWT-based auth with bcrypt password hashing
- **Admin Panel** — User management and platform stats
- **PWA Support** — Install as mobile app
- **Responsive** — Full mobile-first design

---

## 🗂 Project Structure

```
upsc-mains-booster/
├── frontend/                  # React + Vite (deploy to Vercel as static)
│   ├── src/
│   │   ├── components/        # UI, Layout components
│   │   ├── context/           # Auth context
│   │   ├── pages/             # All page components
│   │   └── utils/             # API client, export utilities
│   ├── public/
│   ├── vite.config.js
│   └── vercel.json
│
└── backend/                   # Express.js (deploy to Vercel as serverless)
    ├── api/
    │   ├── server.js           # Main Express app
    │   └── routes/             # Auth, Generate, Cases, User, History, Admin
    ├── lib/
    │   ├── db.js               # MongoDB connection
    │   └── gemini.js           # Google Gemini AI service
    ├── middleware/
    │   └── auth.js             # JWT authentication middleware
    ├── models/                 # Mongoose models
    └── vercel.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at [ai.google.dev](https://ai.google.dev))

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all

# Or individually:
cd backend && npm install
cd frontend && npm install
```

### 2. Configure Environment Variables

**Backend** — create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/upsc-booster
JWT_SECRET=your-very-secret-jwt-key-at-least-32-chars
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Visit: `http://localhost:5173`

---

## 🌐 Deploy to Vercel

### Backend Deployment

```bash
cd backend
vercel --prod
```

Set environment variables in Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `FRONTEND_URL` (your frontend Vercel URL)

### Frontend Deployment

```bash
cd frontend
# Set VITE_API_URL to your backend Vercel URL
vercel --prod
```

Set in Vercel:
- `VITE_API_URL=https://your-backend.vercel.app/api`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/me` | Current user | ✅ |
| POST | `/api/generate` | Generate content | ✅ |
| GET | `/api/generate/trending` | Trending topics | ✅ |
| GET | `/api/generate/daily` | Daily suggestions | ✅ |
| GET | `/api/cases` | List content (filters) | ✅ |
| GET | `/api/cases/:id` | Get single content | ✅ |
| PATCH | `/api/cases/:id/bookmark` | Toggle bookmark | ✅ |
| PATCH | `/api/cases/:id/tags` | Update tags | ✅ |
| PATCH | `/api/cases/:id/rate` | Rate content | ✅ |
| DELETE | `/api/cases/:id` | Delete content | ✅ |
| GET | `/api/user/stats` | User statistics | ✅ |
| GET | `/api/history` | Generation history | ✅ |
| DELETE | `/api/history/clear` | Clear non-bookmarked | ✅ |
| GET | `/api/admin/stats` | Platform stats | Admin |
| GET | `/api/admin/users` | All users | Admin |

---

## 🔐 Creating Admin Account

After creating a regular account, update role in MongoDB:
```javascript
db.users.updateOne({ username: "yourusername" }, { $set: { role: "admin" } })
```

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6 (lazy loading)
- Tailwind CSS v3
- react-hot-toast
- jsPDF + jspdf-autotable
- Axios

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Google Gemini 1.5 Flash
- express-rate-limit
- express-validator

**Deployment**
- Vercel (frontend static + backend serverless)

---

## 📝 License

For personal UPSC preparation use. All AI-generated content should be verified for accuracy before use in exams.
