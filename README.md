# 🗂️ Arch1v — Spring Boot Full Stack Edition  

> 🔒 Intelligent File Organization, Duplicate Detection & Secure Cloud-Ready Architecture  

![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-blue?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-H2%20%2F%20JPA-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0-success?style=for-the-badge)

---

## 🚀 Overview  

**Arch1v** is a full-stack **file organization and duplicate detection system**, rebuilt from the original **Java Swing desktop app** into a **modern Spring Boot + React web application**.  

It brings all the intelligent file-handling power of the original offline Arch1v to the web — with user authentication, cloud-ready backend, and a sleek, glassmorphism UI.  

🧩 **Original Arch1v (Desktop App):**  
🎯 [Download v1.0 Release](https://github.com/akxh5/Arch1v/releases/tag/v1.0)

🌐 **Arch1v — Web Edition (this repo):**  
Full-stack Spring Boot + React rebuild of the same system.

---

## 🧩 Tech Stack  

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React (Vite) + TailwindCSS | Modern glassmorphism UI |
| **Backend** | Spring Boot | RESTful APIs & business logic |
| **Auth** | JWT (Spring Security) | Secure authentication |
| **Persistence** | H2 Database / JSON | File metadata storage |
| **Hashing** | SHA-256 (MessageDigest) | Duplicate detection |
| **Build Tools** | Maven + npm | Dependency management |

---

## ⚙️ Features  

✅ Secure login & registration with JWT  
✅ File upload with SHA-256 duplicate detection  
✅ Organized file storage (`/storage/<type>/...`)  
✅ Duplicate alert and locate-file feature  
✅ Fully functional REST API for integration  
✅ Sleek **glassmorphism UI** with dark-glow theme  
✅ Lightweight and academic project-ready  

---

## 🖼️ UI Preview (Glassmorphism Theme)  

> ✨ *Minimal, dark-glow glassmorphism aesthetic inspired by Notion and macOS Big Sur.*

| Login Page | Dashboard | Upload Modal |
|-------------|------------|---------------|
| ![Login](https://via.placeholder.com/320x180?text=Login+Page) | ![Dashboard](https://via.placeholder.com/320x180?text=Dashboard) | ![Upload](https://via.placeholder.com/320x180?text=Upload+Modal) |

*(Replace these with screenshots once deployed!)*

---

## 🧭 API Endpoints  

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Authenticate and get JWT token |
| `/api/files/upload` | POST | Upload file (detects duplicates) |
| `/api/files/all` | GET | Fetch all stored file records |
| `/api/files/locate/{hash}` | GET | Locate file by its hash |
| `/api/files/delete/{hash}` | DELETE | Delete a file and record |
| `/api/files/clear` | DELETE | Clear all records |

---

## 🧠 Architecture  
Frontend (React + Vite + Tailwind)
|
|  Axios / Fetch API (JWT Bearer Auth)
v
Backend (Spring Boot)
├── Controller Layer (REST)
├── Service Layer (FileService, DuplicateService)
├── Repository Layer (JPA / H2)
└── Storage (/storage/*)

---

## ⚡ Quick Start  

### 🧱 Backend  
```bash
./mvnw spring-boot:run
```
Server runs at → http://localhost:8080

### 💅 Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at → http://localhost:5173

### 🧩 Project Structure
Arch1v/
├── frontend/                  # React + Tailwind frontend
│   ├── src/
│   │   ├── components/        # UploadCard, Modal, Toast, etc.
│   │   ├── pages/             # AuthPage, Dashboard
│   │   └── context/           # AuthContext (JWT handling)
│   └── vite.config.ts
│
├── src/main/java/com/arch1v/  # Spring Boot backend
│   ├── controller/            # REST endpoints
│   ├── service/               # Core logic
│   ├── model/                 # Entities (FileRecord, User)
│   ├── repository/            # Data access layer
│   ├── util/                  # Helpers (HashUtils, FileUtils)
│   └── config/                # Security (JWT)
│
├── storage/                   # Uploaded files
├── data/                      # H2 database files
├── pom.xml                    # Maven configuration
└── README.md

🧪 Example Workflow

1️⃣ Register or log in via /api/auth/login
2️⃣ Upload file → backend hashes file → checks DB
3️⃣ If duplicate → response: "Duplicate found"
4️⃣ If unique → file saved + record stored
5️⃣ Dashboard shows all uploads with locate/delete options

⸻

🧾 Academic Summary

Project Type: Minor Project — Spring Boot Full Stack Application
Author: Akshansh Sharma
Based On: Legacy Java Swing application “Arch1v”
Original Release: Arch1v v1.0 (Desktop App)￼

This project demonstrates the modernization of a standalone desktop application into a web-based, cloud-ready system using Spring Boot, React, and JWT authentication — satisfying all academic and full-stack requirements.

⸻

🧩 Future Enhancements
	•	🔐 Per-user storage isolation (/storage/<username>/)
	•	☁️ Cloud storage integration (Google Drive, Dropbox)
	•	📊 Analytics dashboard (duplicates, total size)
	•	💾 Switch from H2 → PostgreSQL for persistence
	•	🔄 Refresh tokens & session expiry

⸻

🧑‍💻 Author

Akshansh Sharma
Creator of Arch1v | Founder of Oper8a
Focused on minimalist, intelligent data organization tools.

🌐 GitHub￼ • 💬 LinkedIn￼

⸻

🪄 License

This project is licensed under the MIT License.
Feel free to fork, modify, and expand — just credit the original author.

⸻

“Simplicity isn’t the lack of complexity — it’s mastering it.” ✨
