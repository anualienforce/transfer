# Real-time Transaction & Audit Log System

**Assignment 2: Secure Fund Transfer Platform**

A peer-to-peer fund transfer system with atomic transactions, immutable audit logging, and JWT authentication.

---

## 1. Project Overview

**Core Features:**
- Atomic database transactions (both debit and credit succeed or fail together)
- Immutable audit logs for all transactions (success and failure)
- JWT authentication with protected API endpoints
- Rate limiting using Upstash Redis
- Real-time balance updates after transfers
- Dual database architecture (users and audit logs separated)

**Tech Stack:**
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Upstash Redis
- **Frontend**: React, Vite, React Router, Axios, Tailwind CSS, DaisyUI

---

## 2. Setup Instructions

**Prerequisites:** Node.js (v16+), MongoDB, Upstash Redis account

### Backend

```powershell
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
PORT=5001
```

```powershell
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Access: `http://localhost:5173`

---

## 3. API Endpoints

**Base URL:** `http://localhost:5001/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | User login |
| GET | `/auth/me` | Yes | Get current user |
| POST | `/transfer` | Yes | Transfer funds |
| GET | `/audit` | Yes | Get transaction history |


---

## 4. Database Schema

**Two MongoDB Databases:**
- `transfer_db` - User data
- `audit_db` - Transaction logs

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  balance: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Audits Collection
```javascript
{
  _id: ObjectId,
  senderEmail: String,
  receiverEmail: String,
  amount: Number,
  senderBalanceAfter: Number,
  receiverBalanceAfter: Number,
  status: "SUCCESS" | "FAILED",
  reason: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. AI Tool Usage Log

**Tool Used:** GitHub Copilot, Chatgpt for gaining more information on transcation via mongoDB

### AI-Assisted Tasks

**Backend:**
1. For connecting 2 differents collections for audit and users in mongoDB

**Frontend:**
2. React component boilerplate (Login, SignUp, Dashboard, Transfer, Landing)
3. Authentication flow with token storage and redirects
4. Toast notification system (toastOnce utility)
5. Rate limit UI component
6. Error handling for 401, 429, and 500 responses



**Justification:**
- **Saved 30-40% development time** (~3-4 hours saved)
- Generated comprehensive error handling
- Quick boilerplate for components and API routes
- Minor corrections needed for imports and context-specific logic

---

## 6. ScreenShots
Dashboard.


<img width="1896" height="921" alt="dashboard" src="https://github.com/user-attachments/assets/5a5a0007-c5b6-4225-80ad-ff7b69e933eb" />

Landing.

<img width="1905" height="918" alt="landing" src="https://github.com/user-attachments/assets/42aa778c-91a8-415b-96ae-239d1c6754f1" />

Transfer. 

<img width="1917" height="930" alt="transfer" src="https://github.com/user-attachments/assets/84bd33d0-a37f-49a3-900d-3ba4b522a962" />

Login.

<img width="1918" height="925" alt="login" src="https://github.com/user-attachments/assets/266fa521-bdb3-438d-9ae4-64913bcd11c3" />

SignUp.

<img width="1918" height="928" alt="signup" src="https://github.com/user-attachments/assets/068960a8-df54-4969-9965-fd6c036203f2" />


## 7. Video Link

Explanation and preview : [Video](https://drive.google.com/file/d/1xW42Asx2kmP9iKEhVD9O-aGI1xJylKtd/view?usp=sharing)


## 8. Author

**Anand** | GitHub: [anualienforce](https://github.com/anualienforce)





