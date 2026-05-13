# NextGen Store — Full-Stack Application

A modern e-commerce platform with a React frontend, Express/Node backend, MongoDB Atlas database, and a protected Admin Dashboard.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Recharts, Vite |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |

---

## Project Structure

```
nextgen/
├── backend/
│   ├── models/          # User, Product, Order schemas
│   ├── routes/          # authRoutes, productRoutes, adminRoutes
│   ├── middleware/       # JWT auth middleware
│   ├── server.js        # Express app entry
│   ├── seed.js          # Database seeder
│   └── .env             # Environment variables
└── frontend/
    └── src/
        ├── context/     # AuthContext (JWT state)
        ├── layouts/     # MainLayout (Navbar + Footer)
        ├── pages/       # Home, About, Contact, AdminLogin, AdminDashboard
        ├── components/  # ProductCard
        └── utils/       # API utility
```

---

## Setup

### 1. MongoDB Atlas — Whitelist Your IP
Go to [MongoDB Atlas](https://cloud.mongodb.com) → Network Access → Add IP Address → Add your current IP (or `0.0.0.0/0` for all IPs during dev).

### 2. Backend

```bash
cd backend
npm install

# Seed the database (creates admin user + products + orders)
node seed.js

# Start the server
npm start        # production
npm run dev      # development (nodemon)
```

Server starts on **http://localhost:5000**

### 3. Frontend

```bash
cd frontend
npm install
npm run dev      # development
npm run build    # production build
```

Frontend starts on **http://localhost:3000** (proxies `/api` to backend)

---

## Pages & Routes

| URL | Page | Access |
|-----|------|--------|
| `/` | Home — Product store with search & filter | Public |
| `/about` | About Us | Public |
| `/contact` | Contact form | Public |
| `/admin/login` | Admin login | Public |
| `/admin` | Admin Dashboard | Admin only (JWT) |

---

## Admin Login

After running `seed.js`:

- **Email:** `admin@nextgen.com`
- **Password:** `admin123`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Login, returns JWT |
| POST | `/api/auth/register` | — | Register user |
| GET | `/api/products` | — | List products (filter/sort/search) |
| GET | `/api/products/:id` | — | Single product |
| GET | `/api/admin/stats` | Admin | Dashboard analytics |
| GET | `/api/admin/orders` | Admin | All orders |
| GET | `/api/admin/users` | Admin | All users |

---

## Admin Dashboard Features

- **Stat Cards:** Total Revenue, Orders, Users, Products
- **Area Chart:** Monthly revenue (Recharts)
- **Pie Chart:** Sales by category (Recharts)
- **Bar Chart:** Monthly order volume (Recharts)
- **Orders Table:** Status badges, customer details, dates
- **Tabs:** Overview / Orders / Analytics
- **Demo Mode:** Falls back to mock data if backend is offline

---

## Environment Variables (`backend/.env`)

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
```
# ecommerce
