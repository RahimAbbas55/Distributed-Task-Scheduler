# ⚙️ Distributed Task Scheduler – Fullstack

A full-featured, scalable distributed job scheduler built using **Node.js**, **Supabase (PostgreSQL)**, **Redis**, and a modern **Next.js 14 + Tailwind CSS** front-end dashboard. Designed for asynchronous job creation, queuing, execution with retries, and a clean visual interface.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [Environment Variables](#-environment-variables)
- [Setup](#-setup)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)
- [License](#-license)

---

## ✅ Features

- REST API to schedule jobs with metadata
- Jobs stored in **PostgreSQL** via **Supabase**
- Redis ZSET used for job queuing
- Worker polls and processes jobs with retry logic
- Job dashboard UI to view, cancel, and create jobs
- Status badges, priority sorting, and scheduling
- Modular handlers for different job types (email, PDF, etc)

---

## 🛠 Tech Stack

| Layer         | Technology                         |
|--------------|-------------------------------------|
| Backend       | Node.js, Express                   |
| Queue         | Redis (Sorted Sets)                |
| DB            | Supabase (PostgreSQL)              |
| Job Runner    | Node.js Worker                     |
| Frontend      | Next.js 14 App Router + Tailwind CSS |
| API Testing   | Postman                            |

---

## 🏗 Architecture

```
                +---------------------+
                |     Frontend UI     | ← Next.js + Tailwind
                +----------+----------+
                           |
                           ↓
                +----------+----------+
                |     Express API     | ← Node.js
                +----------+----------+
                           |
        +------------------+-------------------+
        |                                      |
        ↓                                      ↓
+---------------+                   +-----------------+
| Supabase (PG) |                   | Redis Job Queue |
+---------------+                   +-----------------+
        ↑                                      ↓
        |                            +----------------------+
        +----------------------------> Job Worker Service   |
                                     +----------------------+
```

---

## 📦 Backend Overview

**Key Endpoints:**

```http
POST   /jobs            → create a job
GET    /jobs            → list all jobs
PUT    /jobs/:id/cancel → cancel job if pending
```

**DB Schema:**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','failed','cancelled')),
  payload JSONB,
  priority INT DEFAULT 0,
  retries INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  failed_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Worker Logic:**
- Polls Redis every 5s
- Uses `ZRANGEBYSCORE` to find due jobs
- Fetches job data from Supabase
- Executes via handler (e.g. `email`, `pdf`)
- Retries on failure with backoff

---

## 💻 Frontend Dashboard

**Pages:**
- `/` — Main dashboard with stats + job table
- `JobTable.tsx` — Lists all jobs with cancel button
- Modal to create job

**Highlights:**
- Tailwind CSS UI with status indicators
- Add job modal with validation
- Live update after job creation or cancellation

---

## 🔐 Environment Variables

```env
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
REDIS_URL=redis://localhost:6379
PORT=4000
```

---

## 🚀 Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/distributed-task-scheduler
cd distributed-task-scheduler
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev # or nodemon index.js
```

### 3. Worker
```bash
node worker/worker.js
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Enhancements

- Job logs + retries history
- Notifications (email, Slack)
- Auth for dashboard
- Drag and drop job config
- Filters/search for dashboard

---

## 👨‍💻 Author

**Rahim Abbas Sindhu**  
🚀 Let’s build scalable systems together!

---

## 📄 License

MIT — use, share, modify freely.
