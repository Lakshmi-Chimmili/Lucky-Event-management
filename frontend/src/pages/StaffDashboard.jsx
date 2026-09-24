import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CURRENCY_SYMBOL, BOOKING_STATUSES } from '../config/constants';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  PlayCircle,
  Briefcase,
  Phone,
  Mail,
  User,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [assignedBookings, setAssignedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    try {
      const res = await bookingService.getAssignedBookings();
      if (res.success) {
        setAssignedBookings(res.data);
      }
    } catch (error) {
      console.error('Error fetching staff assigned bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await bookingService.updateStatus(bookingId, newStatus);
      if (res.success) {
        showSuccess(`Event progress updated to: ${newStatus.toUpperCase()}`);
        fetchAssigned();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = assignedBookings.filter(b => b.eventDate && b.eventDate.startsWith(todayStr));
  const upcomingEvents = assignedBookings.filter(b => ['assigned', 'confirmed'].includes(b.status));
  const completedEvents = assignedBookings.filter(b => b.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">Event Manager Portal</span>
            <h1 className="text-3xl font-extrabold font-outfit mt-0.5">{user?.name}</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Assigned Events</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{assignedBookings.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-amber-600 uppercase">Today's Schedule</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{todayEvents.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-purple-600 uppercase">Upcoming Events</span>
          <p className="text-2xl font-bold text-purple-600 mt-1">{upcomingEvents.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Completed Events</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completedEvents.length}</p>
        </div>
      </div>

      {/* Assigned Events Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="font-bold text-slate-900 text-lg">My Assigned Event Tasks</h3>

        {loading ? (
          <div className="py-8 space-y-4">
            {[1, 2].map(n => <div key={n} className="h-24 bg-slate-100 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : assignedBookings.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No events currently assigned to your staff profile.
          </div>
        ) : (
          <div className="space-y-6">
            {assignedBookings.map((b) => {
              const statusInfo = BOOKING_STATUSES[b.status] || { label: b.status, badgeClass: 'bg-slate-100' };

              return (
                <div
                  key={b._id}
                  className="p-6 rounded-3xl border border-slate-200 hover:border-brand-300 transition-all space-y-4 bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-lg">{b.category?.name}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Booking ID: {b._id}</p>
                    </div>

                    {/* Progress Control Actions */}
                    <div className="flex items-center gap-3">
                      {b.status !== 'inProgress' && b.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'inProgress')}
                          disabled={updatingId === b._id}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <PlayCircle className="w-4 h-4" /> Start Event
                        </button>
                      )}

                      {b.status === 'inProgress' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'completed')}
                          disabled={updatingId === b._id}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Mark Completed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Customer Contact</span>
                      <p className="font-bold text-slate-900 text-sm">{b.customer?.name}</p>
                      <p className="text-slate-600 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {b.customer?.phone || 'N/A'}</p>
                      <p className="text-slate-600 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {b.customer?.email}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Schedule & Venue</span>
                      <p className="text-slate-800 font-semibold">📅 {new Date(b.eventDate).toLocaleDateString()} at {b.eventTime}</p>
                      <p className="text-slate-600">👥 {b.attendeeCount} Guests</p>
                      <p className="text-slate-600">📍 {b.venueAddress}, {b.city}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Included Add-On Services</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {b.addOns && b.addOns.length > 0 ? (
                          b.addOns.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-semibold border border-brand-200">
                              {s.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">No add-on services selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default StaffDashboard;
