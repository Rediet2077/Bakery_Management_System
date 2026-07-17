# 🥖 Bakery Management System (BMS)

A full-stack POS + admin system for bakeries built with React + PHP + MySQL.

---

## Quick Setup

### 1. Database (XAMPP phpMyAdmin)

1. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Click **Import**
3. Select `database/bakery.sql`
4. Click **Go**

### 2. Backend (XAMPP)

XAMPP Apache must be running. The backend is already in the correct location:
```
C:\xampps\htdocs\Bakery_System\backend\
```
Accessible at: `http://localhost/Bakery_System/backend`

### 3. Frontend (Development)

```bash
cd frontend
npm run dev
```
Open: `http://localhost:5173`

### 4. Frontend (Production Build)

```bash
cd frontend
npm run build
```
Then copy `frontend/dist/` contents to `htdocs/Bakery_System/` (optional).

---

## Default Login Credentials

| Username    | Password     | Role    |
|-------------|--------------|---------|
| `admin`     | `admin123`   | Admin   |
| `john`      | `cashier123` | Cashier |
| `johndoe`   | `cashier123` | Cashier |
| `janesmith` | `cashier123` | Cashier |

> ⚠️ Change these passwords after first login!

---

## Project Structure

```
bakery-management-system/
├── frontend/                  # React + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Cart.jsx        # POS cart with checkout
│   │   │   ├── Navbar.jsx      # Top header bar
│   │   │   ├── ProductCard.jsx # Product grid card
│   │   │   ├── ProductForm.jsx # Add/Edit product modal
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx     # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CashierDashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── SalesHistory.jsx
│   │   │   └── SaleDetail.jsx
│   │   ├── services/
│   │   │   └── api.js          # All fetch API calls
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── config/database.php
│   ├── middleware/
│   │   ├── auth.php            # Session auth guards
│   │   └── cors.php            # CORS headers
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── me.php
│   └── api/
│       ├── products/           # CRUD
│       ├── sales/              # Create + history
│       ├── users/              # Create + delete
│       └── dashboard/          # Stats + chart
│
└── database/
    └── bakery.sql              # Full schema + seed data
```

---

## Features

### Cashier
- Browse all products in a visual grid
- Click to add to cart (click again = qty++)
- Real-time change calculation
- Complete sale → PHP transaction (stock deducted atomically)

### Admin
- Dashboard with revenue stats, low-stock alerts, weekly chart
- Full product CRUD (add/edit/delete)
- User management (create/delete cashiers)
- Sales history with date filter
- Sale detail view (items breakdown)
