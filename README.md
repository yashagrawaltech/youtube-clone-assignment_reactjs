# 🎬 YouTube Clone — MERN Stack Project

A full-stack YouTube clone built using the **MERN stack** with **JavaScript**. The application allows users to watch, upload, and interact with videos, with secure authentication using **JWT**.

---

GitHub: https://github.com/yashagrawaltech/youtube-clone-assignment_reactjs

## 🚀 Features

### 🌐 Frontend (React.js)

- YouTube-style header and sidebar layout ✅
- Filter buttons and search bar ✅
- Video thumbnail grid with title, views, and uploader ✅
- Responsive UI for all screen sizes ✅

### 🔐 Authentication

- JWT-based login & registration ✅
- Post-auth home view with user info shown in header ✅

### 📺 Video Features

- Upload, edit, delete videos ✅
- Like, dislike, and comment functionality ✅
- Individual channel pages displaying user’s uploaded content ✅

### 🔍 Search & Filter

- Search videos by title ✅
- Filter content by categories ✅

---

## 🧠 Backend (Express + Node.js)

- Built with Node.js runtime ✅
- RESTful APIs with Express ✅
- JWT authentication middleware ✅
- MongoDB models using Mongoose ✅
- Controllers for videos, users, comments, and channels ✅

---

## 🗂️ Database (MongoDB)

Collections:

- Users ✅
- Channels ✅
- Videos ✅
- Comments ✅

---

## 🛠️ Tech Stack

| Layer        | Tech                 |
| ------------ | -------------------- |
| Frontend     | React.js             |
| Backend      | Express.js + Node.js |
| Database     | MongoDB (Atlas)      |
| Auth         | JWT                  |
| Styling      | Tailwind CSS         |
| Video Player | Custom               |

---

## 📦 Installation & Setup

> Requires: Node.js installed, MongoDB Atlas URI, JWT Secret

```bash
# Clone the project
git clone https://github.com/your-username/youtube-clone.git
cd youtube-clone

# Backend Setup
cd backend
npm install
cp .env.example .env  # Add your MongoDB URI, JWT secret, and Google OAuth keys
npm run dev

# Frontend Setup
cd ../frontend
bun install
bun dev
```

> Make sure MongoDB is running locally or provide a connection URI.

---

## 🗂️ Project Structure

```
/frontend     → React.js client
/backend      → Express + Node.js server
```

---

## 👨‍💻 Author

**Yash Agrawal**  
[Portfolio](https://www.yashag.tech) · [LinkedIn](https://www.linkedin.com/in/yashagrawal0410/) · [GitHub](https://github.com/yashagrawaltech)
