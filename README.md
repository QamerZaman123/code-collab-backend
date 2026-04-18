# 💻 Real-Time Code Collaboration API (Backend)

A scalable **Node.js + Express backend** powering a **real-time code collaboration platform** where multiple developers can write, edit, and execute code together in shared sessions.

---

## 🚀 Live API

- Demo: (https://code-collab-frontend-blond.vercel.app/)

---

## 🧠 Project Overview

This backend handles **real-time communication**, **code synchronization**, and **code execution** for collaborative coding sessions.

It enables multiple users to join a shared room and:
- Edit code simultaneously
- Sync changes in real-time
- Execute code using an external compilation service

---

## ⚙️ Core Features

- Real-time bidirectional communication using WebSockets
- Multi-user collaboration with room-based architecture
- Live code synchronization across all connected clients
- Code execution via external Judge API

---

## 🏗️ Architecture

- **Client Communication** → WebSockets (Socket.IO)
- **Backend API** → Node.js + Express.js (Render)
- **Real-Time Engine** → Socket.IO
- **Code Execution** → Judge API (External Service)

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- Socket.IO
- REST API Architecture

### Integrations / Services
- Judge API (Code Compilation & Execution)
- Render (Backend Deployment)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

FRONTEND_URL=http://localhost:5173

RAPID_API_KEY=your_judge_api_key
