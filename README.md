# AI-Powered CRM System (Next.js)

Full-stack CRM application with AI-powered lead scoring built with Next.js, TypeScript, and FastAPI.

## 🚀 Tech Stack

### Frontend + Backend (Next.js)

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Supabase** for database and real-time features
- **Next.js API Routes** for backend logic

### AI/ML Service (Python)

- **FastAPI** for high-performance API
- **scikit-learn** for machine learning
- **Random Forest Classifier** for lead scoring

## ✨ Features

- 🎯 **AI Lead Scoring** - ML model predicts conversion probability
- 📊 **Analytics Dashboard** - Real-time insights with interactive charts
- 🔄 **Real-time Updates** - Live synchronization via Supabase
- 📱 **Responsive Design** - Mobile-friendly interface
- 🚀 **API Routes** - Backend integrated into Next.js

## 📁 Project Structure

```
crmai-project/
├── app/
│   ├── api/
│   │   └── leads/          # API routes (replaces Express backend)
│   ├── leads/              # Leads page
│   ├── dashboard/          # Analytics page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Dashboard.tsx       # Analytics dashboard
│   ├── LeadForm.tsx        # Lead creation form
│   ├── LeadList.tsx        # Leads table
│   └── Navbar.tsx          # Navigation
├── lib/
│   ├── supabase-server.ts  # Server-side Supabase client
│   └── supabase-browser.ts # Client-side Supabase client
├── types/
│   └── index.ts            # TypeScript interfaces
├── ai-service/             # Separate Python ML service
│   ├── main.py
│   ├── scripts/
│   └── ml_models/
├── package.json            # Next.js dependencies
├── next.config.js          # Next.js configuration
└── supabase-schema.sql     # Database schema
```

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Supabase account (free tier works)

### 1. Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL from `supabase-schema.sql` in the SQL editor
3. Copy your project URL and keys

### 2. Next.js App Setup

```bash
# From the project root
npm install
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
ML_SERVICE_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

App runs on `http://localhost:3000`

### 3. AI Service Setup

```bash
cd ai-service
python3 -m venv venv  # Use python3 on Mac
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Generate training data and train the model:

```bash
python3 scripts/generate_data.py
python3 scripts/train_model.py
```

Start the AI service:

```bash
uvicorn main:app --reload --port 8000
```

AI service runs on `http://localhost:8000`

## 🎯 How It Works

```
User adds lead in Next.js app
    ↓
Next.js API Route (/api/leads)
    ↓
Calculates engagement score
    ↓
Calls Python AI service (FastAPI)
    ↓
AI model predicts conversion probability
    ↓
Saves to Supabase with AI score
    ↓
Real-time update to dashboard
```

## 🔗 API Endpoints

### Next.js API Routes

- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create lead (triggers AI scoring)
- `GET /api/leads/[id]` - Get specific lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

### Python AI Service

- `GET /health` - Health check
- `POST /predict/lead-score` - Get AI prediction

## 🚢 Deployment

### Next.js App → Vercel

```bash
# From project root
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### AI Service → Fly.io

```bash
cd ai-service
fly launch
fly deploy
```

Update `ML_SERVICE_URL` in Vercel to your Fly.io URL.

## 🏗️ Architecture

**Why Next.js + Python?**

- **Next.js** handles frontend UI and API routes (all TypeScript)
- **Python FastAPI** handles ML predictions (specialized ML libraries)

**Python AI service is separate** because:

- Specialized ML libraries (scikit-learn) work best in Python
- Can scale independently from the Next.js app
- Reusable by other services

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [scikit-learn Documentation](https://scikit-learn.org)

## 📝 License

MIT
