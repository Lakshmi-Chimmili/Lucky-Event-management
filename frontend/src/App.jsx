import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Booking Wizard
import BookingWizard from './pages/BookingWizard';
import BookingDetails from './pages/BookingDetails';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/CustomerProfile';

// Staff Pages
import StaffDashboard from './pages/StaffDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCategories from './pages/admin/AdminCategories';
import AdminServices from './pages/admin/AdminServices';
import AdminStaff from './pages/admin/AdminStaff';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReports from './pages/admin/AdminReports';
import AdminMessages from './pages/admin/AdminMessages';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Booking Wizard */}
          <Route path="/book" element={<BookingWizard />} />

          {/* Customer Routes */}
          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <RoleProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <RoleProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                <CustomerProfile />
              </RoleProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/bookings"
            element={
              <RoleProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminBookings />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminCategories />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminServices />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminStaff />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminCustomers />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminMessages />
              </RoleProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
