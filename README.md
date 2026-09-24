# Lucky Events — Complete Event Management Service Platform

**EventEase** is a production-ready, full-stack Event Management & Staffing Platform built using the **MERN Stack (React.js, Express.js, Node.js, MongoDB)**. 

The platform allows customers to browse event categories, calculate attendee-based live pricing, select add-on services, book events, and track their booking status. It provides dedicated portals for Administrators to manage events, categories, services, staff, customers, and reports, as well as Staff/Managers to view and update assigned events.

---

## 🚀 Key Features

### 👤 Customer Features
- **Interactive Booking Wizard**: 7-step guided process for selecting categories, attendees, date, time, venue, and add-on services.
- **Dynamic Pricing Engine**: Real-time breakdown calculated on both client and server based on attendee counts and service types (`flat` vs `perAttendee`).
- **Real MongoDB Booking IDs**: Returns valid MongoDB `_id` on creation.
- **Price Freezing Rule**: Saves complete itemized price breakdown snapshots into the booking document.
- **Customer Dashboard**: Track status timeline (`Booking Created -> Confirmed -> Staff Assigned -> In Progress -> Completed`), view assigned staff details, and cancel eligible bookings.

### 🛡️ Admin Features
- **Dashboard Analytics**: Real-time aggregated statistics for revenue, customer count, staff count, and status distributions.
- **Category & Service Management**: Add, edit, activate/deactivate, and change prices or pricing models.
- **Staff Assignment Modal**: Assign/reassign available event coordinators to bookings.
- **Booking Control**: Search (by ID, customer name, phone, email) and filter (by status, category, date).
- **Customer & Contact Management**: Manage accounts and read user messages.

### 👔 Staff / Event Manager Features
- **Assigned Event Portal**: View assigned events, venue details, guest counts, and customer contacts.
- **Event Timeline Controls**: Mark event progress as `inProgress` or `completed`.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, React Router DOM v6, Axios, Context API (Auth & Toast Notifications).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth, bcryptjs password hashing, dotenv, CORS.
- **Architecture**: Proper MVC Structure (Controllers, Middleware, Models, Routes, Services, Config, Seed, Utils).

---

## 🔑 Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@eventease.com` | `Admin@12345` |
| **Staff** | `staff@eventease.com` | `Staff@12345` |
| **Customer** | `customer@eventease.com` | `Customer@12345` |

---

## 📁 Project Structure

```
event-management/
├── backend/
│   ├── config/          # db.js, constants.js (APP_NAME = "EventEase")
│   ├── controllers/     # auth, category, service, booking, staff, user, contact, report
│   ├── middleware/      # authMiddleware, roleMiddleware, validateObjectId, errorHandler
│   ├── models/          # User, Category, Service, Booking, StaffProfile, ContactMessage, Notification
│   ├── routes/          # API route definitions
│   ├── services/        # pricingService.js (Formula calculation & freeze snapshot)
│   ├── seed/            # seed.js (DB initialization script)
│   ├── tests/           # pricing.test.js (Automated pricing unit test)
│   ├── server.js        # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProtectedRoute, RoleProtectedRoute
│   │   ├── context/     # AuthContext, ToastContext
│   │   ├── pages/       # Home, Events, Services, BookingWizard, CustomerDashboard, StaffDashboard, Admin pages
│   │   ├── services/    # Axios API service handlers
│   │   ├── config/      # constants.js (APP_NAME = "EventEase")
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
└── README.md
```

---

## ⚙️ Quick Start (Local Setup)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI.

### 2. Backend Setup & Database Seeding
```bash
cd backend
npm install
npm run seed     # Populate default Admin, Staff, Customer, Categories & Services
npm run test     # Run automated pricing engine test (Wedding 100 guests = ₹188,000)
npm run dev      # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 🧪 Pricing Formula Verification

Test Case:
- **Category**: Wedding (₹1,500 / attendee)
- **Attendees**: 100
- **Add-Ons**: Catering (Per Attendee ₹300), DJ & Music (Flat ₹8,000)

**Backend Calculation:**
- Category Total: `₹1,500 × 100` = `₹150,000`
- Catering Total: `₹300 × 100` = `₹30,000`
- DJ Total: `₹8,000` (Flat)
- Add-Ons Total: `₹30,000 + ₹8,000` = `₹38,000`
- **Grand Total**: `₹150,000 + ₹38,000` = `₹188,000`

---

## 🌐 Production Deployment Guide

### Render Backend Deployment
1. Set Start Command: `npm start`
2. Set Environment Variables:
   - `PORT`: (Provided automatically by Render)
   - `MONGO_URI`: MongoDB Atlas Connection String
   - `JWT_SECRET`: Production Secret Key
   - `CLIENT_URL`: Deployed Frontend Domain (e.g. `https://eventease.vercel.app`)

### Vercel Frontend Deployment
1. Set Build Command: `npm run build`
2. Set Output Directory: `dist`
3. Set Environment Variable: `VITE_API_URL=https://your-render-backend-url.onrender.com/api`

---

## 📄 License
ISC License — Created for Event Ease Platform.
