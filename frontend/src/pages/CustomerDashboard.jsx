import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { CURRENCY_SYMBOL, BOOKING_STATUSES } from '../config/constants';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  XCircle,
  User,
  Bell,
  MessageSquare,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings(filterStatus);
      if (res.success) {
        setBookings(res.data);
      }
    } catch (error) {
      console.error('Error fetching my bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'assigned' || b.status === 'inProgress').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-brand-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold uppercase">
                Customer Account
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-3 space-y-1 text-sm font-semibold">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-brand-600 text-white rounded-2xl shadow-md shadow-brand-600/20"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/book"
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
            >
              <Plus className="w-5 h-5 text-brand-600" />
              <span>Book New Event</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
            >
              <User className="w-5 h-5 text-indigo-600" />
              <span>My Profile</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-slate-500" />
              <span>Support Contact</span>
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">My Bookings Overview</h1>
              <p className="text-slate-500 text-sm">Track real-time status and staff assignments for your events.</p>
            </div>
            <Link
              to="/book"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book Event</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Bookings</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-amber-600 font-semibold uppercase">Pending</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-blue-600 font-semibold uppercase">Confirmed</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">{confirmedCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-emerald-600 font-semibold uppercase">Completed</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">My Event History</h3>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {loading ? (
              <div className="space-y-4 py-8">
                {[1, 2].map((n) => (
                  <div key={n} className="h-20 bg-slate-100 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-medium text-sm">No bookings found.</p>
                <Link to="/book" className="inline-block px-5 py-2.5 bg-brand-600 text-white font-semibold text-xs rounded-xl">
                  Book Your First Event
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => {
                  const statusInfo = BOOKING_STATUSES[b.status] || { label: b.status, badgeClass: 'bg-slate-100' };

                  return (
                    <div
                      key={b._id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-brand-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 text-base">{b.category?.name || 'Event'}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Booking ID: <span className="font-mono text-slate-700">{b._id}</span>
                        </p>
                        <p className="text-xs text-slate-600">
                          📅 {new Date(b.eventDate).toLocaleDateString()} at {b.eventTime} | 👥 {b.attendeeCount} guests
                        </p>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0">
                        <span className="font-bold text-slate-900 text-base">
                          {CURRENCY_SYMBOL}{b.priceBreakdown?.grandTotal?.toLocaleString()}
                        </span>
                        <Link
                          to={`/bookings/${b._id}`}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Details</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
