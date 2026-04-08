# 📋 Trackify — Frontend

> A role-based workflow task management system. Built like a mini Jira — where users submit tasks and admins approve, reject, or manage them through a multi-stage lifecycle.

🔗 **Live Demo:** [trackify-frontend-seven.vercel.app](https://trackify-frontend-seven.vercel.app)
🔗 **Backend Repo:** [trackify-backend](https://github.com/talhajamshaid/trackify-backend)

---

## 🚀 What is Trackify?

Trackify is a company-style task workflow system with two roles:

- **Admin** — approves/rejects tasks, manages users, views all task history
- **User** — registers, submits daily tasks, tracks their status

This is not a simple CRUD app. It implements a **real-world multi-stage task lifecycle** with role-based access control — the kind of system companies actually use.

---

## ✨ Features

### 👤 User Panel

- Register & Login
- Submit daily tasks (status starts as `Pending Approval`)
- View task status updates in real time
- Move approved tasks to `In Progress` → `Completed`
- Change password
- Update profile (name, phone, address — email locked)

### 🛠️ Admin Panel

- Dashboard with tasks overview
- Approve or reject tasks (with comments)
- Assign tasks to users
- Activate / deactivate user accounts
- View full task history for all users

### 🔐 Auth System

- JWT-based authentication
- Protected routes (role-based)
- Forgot password / reset via email
- First registered user becomes admin automatically

---

## 🧱 Task Lifecycle

```
User Submits Task
       ↓
  Pending Approval
       ↓
Admin Approves / Rejects
       ↓
   In Progress   (user updates)
       ↓
   Completed
```

---

## 🛠️ Tech Stack

| Technology        | Purpose               |
| ----------------- | --------------------- |
| React + Vite      | Frontend framework    |
| Tailwind CSS      | Styling               |
| shadcn/ui         | UI components         |
| MUI (Material UI) | Additional components |
| Redux Toolkit     | State management      |
| RTK Query         | API calls & caching   |
| React Router DOM  | Client-side routing   |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Modals/          # CreateTaskModal, TaskDetailsModal, etc.
│   ├── pagination/
│   ├── AuthLayout.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Admin/           # Dashboard, TaskManage, UserRequest, TaskHistory
│   ├── Auth/            # Login, Register, Forgot, Reset, OTP
│   └── User/            # Dashboard, MyTasks
├── redux/               # Store, slices
└── config/              # Axios config, env
```

---

## ⚙️ Getting Started (Local)

### 1. Clone the repo

```bash
git clone https://github.com/talhajamshaid/trackify-frontend.git
cd trackify-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root:

```env
VITE_SERVER_URL=http://localhost:5000/api
```

### 4. Run the app

```bash
npm run dev
```

App will run at `http://localhost:5173`

---

## 🌍 Environment Variables

| Variable          | Description          |
| ----------------- | -------------------- |
| `VITE_SERVER_URL` | Backend API base URL |

---

## 👤 First Time Setup

1. Open the live app
2. Click **Register** — the first registered user becomes **Admin** automatically
3. Login as admin and start managing users and tasks

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🤝 Related

- **Backend Repo:** [trackify-backend](https://github.com/talhajamshaid/trackify-backend)
- **Deployed on:** Vercel
