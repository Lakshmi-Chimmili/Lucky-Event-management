import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  AlertCircle,
  XCircle,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Receipt
} from 'lucide-react';

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await bookingService.getById(id);
      if (res.success) {
        setBooking(res.data);
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Error loading booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      const res = await bookingService.cancelBooking(id);
      if (res.success) {
        showSuccess('Booking cancelled successfully');
        fetchDetails();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Booking Not Found</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const pb = booking.priceBreakdown || {};
  const statusInfo = BOOKING_STATUSES[booking.status] || { label: booking.status, badgeClass: 'bg-slate-100' };

  // Timeline Steps
  const timelineSteps = [
    { key: 'pending', label: 'Booking Created' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'assigned', label: 'Staff Assigned' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  const getStepStatus = (stepKey) => {
    const order = ['pending', 'confirmed', 'assigned', 'inProgress', 'completed'];
    const currentIdx = order.indexOf(booking.status);
    const stepIdx = order.indexOf(stepKey);

    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      return 'inactive';
    }
    if (stepIdx <= currentIdx) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
            {statusInfo.label}
          </span>
          {user?.role === 'customer' && ['pending', 'confirmed'].includes(booking.status) && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="bg-slate-900 text-white p-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-semibold text-brand-400">Event Overview</span>
              <h1 className="text-3xl font-bold font-outfit mt-1">{booking.category?.name}</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">Booking ID: {booking._id}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-semibold">Grand Total</span>
              <span className="text-3xl font-extrabold text-brand-300 font-outfit">
                {CURRENCY_SYMBOL}{pb.grandTotal?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* STATUS TIMELINE REQUIREMENT #28 */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-6">Booking Progress Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {timelineSteps.map((step, idx) => {
              const state = getStepStatus(step.key);
              return (
                <div key={step.key} className="flex sm:flex-col items-center gap-3 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      state === 'completed'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {state === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event & Venue Info */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Event Details</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Date: <strong>{new Date(booking.eventDate).toLocaleDateString()}</strong></span>
              </p>
              <p className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Time: <strong>{booking.eventTime}</strong></span>
              </p>
              <p className="flex items-center gap-2 text-slate-700">
                <Users className="w-4 h-4 text-brand-600" />
                <span>Attendees: <strong>{booking.attendeeCount} Guests</strong></span>
              </p>
              <p className="flex items-start gap-2 text-slate-700 pt-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                <span>Venue: <strong>{booking.venueAddress}, {booking.city}</strong></span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Assigned Staff / Manager</h3>
            {booking.assignedStaff ? (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{booking.assignedStaff.name}</p>
                  <p className="text-xs text-slate-500">{booking.assignedStaff.phone || booking.assignedStaff.email}</p>
                  <span className="text-[10px] font-bold text-brand-700 uppercase">Event Coordinator</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                Staff member will be assigned shortly by the admin.
              </div>
            )}
          </div>
        </div>

        {/* PRICE BREAKDOWN FREEZING SNAPSHOT REQUIREMENT #11 */}
        <div className="p-8 space-y-6">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-600" /> Frozen Price Breakdown Snapshot
          </h3>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 divide-y divide-slate-200 text-sm space-y-4">
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="font-bold text-slate-800">{booking.category?.name}</p>
                <p className="text-xs text-slate-500">
                  {CURRENCY_SYMBOL}{pb.categoryPricePerAttendee} × {pb.attendeeCount} guests
                </p>
              </div>
              <p className="font-bold text-slate-900">{CURRENCY_SYMBOL}{pb.categoryTotal?.toLocaleString()}</p>
            </div>

            {pb.services && pb.services.length > 0 && (
              <div className="py-4 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Additional Services</p>
                {pb.services.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{s.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {s.pricingType === 'flat' ? 'Flat rate' : `${CURRENCY_SYMBOL}${s.unitPrice} × ${s.quantity} guests`}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">{CURRENCY_SYMBOL}{s.total?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex items-center justify-between font-bold text-base text-brand-700">
              <span>Grand Total</span>
              <span className="text-2xl font-outfit">{CURRENCY_SYMBOL}{pb.grandTotal?.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetails;
