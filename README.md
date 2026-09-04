# TasteHub — Full-Stack Food Ordering Web Application

A production-style food ordering platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Includes a complete customer storefront and a separate admin console for managing the restaurant business — built to demonstrate real-world, industrial-level full-stack engineering practices.

---

## ✨ Features

### Customer Dashboard
- Browse menu with search, category filters, veg/non-veg filter, sorting, and pagination
- Detailed food pages with ratings, prep time, tags, and pricing
- Persistent cart (localStorage) with quantity controls
- Secure checkout with delivery address & payment method selection
- Order tracking with a live status timeline (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
- Order history and order cancellation
- Profile management with multiple saved addresses

### Admin Dashboard
- Revenue, order, and customer statistics with a 7-day sales trend chart
- Top-selling items report
- Full CRUD for food items (name, price, discount, image, category, availability, featured flag)
- Category management
- Order management with live status updates
- Customer management (view / block / unblock accounts)

### Engineering Highlights
- JWT authentication with role-based access control (customer vs admin)
- Passwords hashed with bcrypt; protected & admin-only middleware
- Server-side price calculation on order creation (never trusts client-submitted prices)
- RESTful API design with proper HTTP status codes and centralized error handling
- Rate limiting, Helmet security headers, CORS configuration
- MongoDB text search indexing, aggregation pipelines for admin analytics
- Fully responsive, custom-designed UI (Tailwind CSS, no generic template look)

---

## 🛠 Tech Stack

| Layer      | Technology                                             |
|------------|---------------------------------------------------------|
| Frontend   | React 18, Vite, React Router v6, Tailwind CSS, Recharts, Axios, React Hot Toast |
| Backend    | Node.js, Express.js                                     |
| Database   | MongoDB with Mongoose ODM                                |
| Auth       | JWT + bcrypt                                             |
| Tooling    | Vite (fast dev/build), Nodemon                            |

All tools used are **free and open-source**.

---

## 📁 Project Structure

```
food-ordering-app/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth guard, error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── seed/            # Demo data seeder
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, FoodCard, ProtectedRoute
    │   ├── context/     # Auth & Cart global state
    │   ├── pages/
    │   │   ├── customer/  # Home, Menu, Cart, Checkout, Orders, Profile...
    │   │   └── admin/     # Dashboard, ManageFoods, ManageOrders...
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A MongoDB database — the easiest **free** option is [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free M0 cluster), or run MongoDB locally.

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your values:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
```

Seed the database with demo categories, food items, an admin account, and a demo customer:
```bash
npm run seed
```

Start the API server:
```bash
npm run dev
```
The API will run at `http://localhost:5000`.

### 2. Frontend Setup

Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
The app will run at `http://localhost:5173`.

### 3. Login

After seeding, use these demo accounts:

| Role     | Email                  | Password      |
|----------|-------------------------|---------------|
| Admin    | admin@foodapp.com       | Admin@123     |
| Customer | customer@foodapp.com    | Customer@123  |

Admins are automatically routed to `/admin`; customers use the main storefront.

---

## 🌐 Deployment (all free options)

- **Frontend:** [Vercel](https://vercel.com) or [Netlify](https://netlify.com) — connect your GitHub repo, set `VITE_API_URL` to your deployed backend URL.
- **Backend:** [Render](https://render.com) free web service — set the environment variables from `.env.example`.
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) free M0 cluster.

---

## 📄 Resume Description (suggested)

> **TasteHub – Full-Stack Food Ordering Platform** (React.js, Node.js, Express.js, MongoDB)
> Designed and built a full-stack food delivery application with separate customer and admin dashboards. Implemented JWT-based authentication with role-based access control, RESTful APIs with server-side price validation, MongoDB aggregation pipelines for real-time sales analytics, and a fully responsive UI with search, filtering, and live order tracking. Deployed on Vercel/Render with MongoDB Atlas.

---

## 📝 License

Free to use for learning, portfolio, and resume purposes.
