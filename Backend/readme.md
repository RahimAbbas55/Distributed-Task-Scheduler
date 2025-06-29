# ⚙️ Distributed Task Scheduler – Backend

A scalable, fault-tolerant distributed job scheduling system built with **Node.js**, **Express**, **Redis**, and **Supabase (PostgreSQL)**. It allows asynchronous jobs to be scheduled, queued, processed with retry logic, and managed via RESTful APIs.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Worker Logic](#-worker-logic)
- [Job Handlers](#-job-handlers)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)
- [License](#-license)

---

## ✅ Features

- Create scheduled jobs via REST API
- Jobs stored in Supabase (PostgreSQL)
- Queued using Redis sorted sets
- Worker polls Redis and executes jobs
- Retry mechanism with max retries + backoff
- Cancel jobs before they are processed
- Modular job handler system (e.g. email, image, PDF)

---

## 🛠 Tech Stack

| Layer         | Technology             |
|---------------|------------------------|
| Backend       | Node.js, Express       |
| Queue         | Redis (ZSET)           |
| Database      | Supabase (PostgreSQL)  |
| Job Execution | Node.js Worker Service |
| API Testing   | Postman                |
| Future UI     | NextJs (Optional)       |

---

## 📁 Project Structure

backend/
├── controllers/ # Express route logic
│ └── jobsController.js
├── routes/ # API route definitions
│ └── jobs.js
├── lib/ # Redis & Supabase clients
│ ├── redis.js
│ └── supabase.js
├── worker/ # Background job processor
│ ├── worker.js
│ └── handlers/
│ ├── email.js
│ ├── imageResize.js
│ ├── pdf.js
│ └── index.js
├── scripts/ # CLI tools for syncing jobs
│ └── syncJobsToRedis.js
├── index.js # Express server entry point
├── .env # Env variables (ignored by git)
└── README.md

---

## 📄 API Endpoints

### `POST /jobs`

Create a new job.

```json
{
  "type": "email_notification",
  "payload": {
    "to": "test@example.com",
    "subject": "Hello!",
    "message": "This is a test job."
  },
  "scheduled_at": "2025-06-23T18:30:00.000Z",
  "priority": 1,
  "max_retries": 3
}
```

### `GET /jobs`

Fetch all jobs from the database, sorted by latest created.

### PUT /jobs/:id/cancel

Cancel a job only if it's still pending.

--- 

## ⚙️Worker Logic

The worker.js script:

->Polls Redis every 5 seconds

->Uses zrangebyscore to find due jobs

->Fetches job details from Supabase

->Dispatches to the appropriate handler based on type

->Updates status (in_progress, completed, failed)

->Retries with backoff delay if failed (up to max_retries)

->Removes jobs from Redis queue after execution

To run the worker: **node worker/worker.js**

---

## 🔌 Job Handlers

Located in worker/handlers/ and registered in index.js.

->email_notification → Logs email sending simulation

->resize_image → Simulates image resizing

->generate_pdf → Simulates PDF generation

Each handler receives job.payload.

---

## 🧪 Getting Started

1. Clone the repo & install dependencies
      cd backend
      npm install
2. Add .env file
      SUPABASE_URL=https://your-project.supabase.co
      SUPABASE_KEY=your-supabase-service-role-key
      REDIS_URL=redis://localhost:6379
3. Start API server
      nodemon index.js
4.Run the background worker
      node worker/worker.js

---

## 👨‍💻 Author

Rahim Abbas Sindhu

## 📄 License

MIT — Feel free to use, modify and share.
