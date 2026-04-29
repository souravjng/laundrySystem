# 🧺 Laundry Order Management System (AI-First)

A modern **Full Stack Laundry Management System** built with a clean UI, smart features, and real-world functionality.
Designed for managing laundry orders, tracking status, and visualizing business data.

---

## 🚀 Live Demo

* 🌐 Frontend: https://laundry-system-psi.vercel.app
* ⚙️ Backend: https://laundrysystem-58t9.onrender.com

---

## ✨ Features

### 🧾 Order Management

* Create new laundry orders
* Add multiple garments (Shirt, Saree, etc.)
* Auto total calculation (subtotal + tax + delivery)
* Delete orders with confirmation
* Update order status

### 🔍 Search & Filter

* Search by **customer name / phone**
* Filter by **order status**

### 📊 Dashboard

* Total Orders
* Total Revenue
* Delivered Orders
* Status summary cards
* 📈 Bar Chart + Pie Chart

### 📥 Export Feature

* Download all orders in **Excel (.xlsx)**
* One-click export with clean data

### 🎨 UI/UX

* Clean modern dashboard design
* Color-coded order status
* Responsive layout
* Smooth animations (Framer Motion)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Recharts (Charts)
* Lucide Icons
* React Hot Toast

### Backend

* Node.js
* Express.js
* CORS

---

## 📁 Folder Structure

```
laundrySystem/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│
├── backend/
│   ├── server.js
│   └── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/souravjng/laundrySystem.git
cd laundrySystem
```

---

### 2️⃣ Setup Backend

```
cd backend
npm install
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🌍 Environment Variables

Create `.env` file in frontend:

```
VITE_API_URL=http://localhost:5000
```

For production:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 📦 API Endpoints

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | /orders            | Create order               |
| GET    | /orders            | Get orders (search/filter) |
| PUT    | /orders/:id/status | Update status              |
| DELETE | /orders/:id        | Delete order               |
| GET    | /dashboard         | Dashboard data             |

---

## 📸 Screens

### 🧾 Orders Page

* Table UI with filters
* Status colors
* Delete + Update

### 📊 Dashboard

* Cards + Charts
* Excel download

---

## ⚠️ Notes

* Backend uses **in-memory storage** (data resets on restart)
* Render free tier may sleep (slow first request)

---

## 💡 Future Improvements

* Database integration (MongoDB)
* Authentication (Admin login)
* PDF invoice download
* Payment integration

---

## 👨‍💻 Author

**Sourav Jangra**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub — it helps a lot!
