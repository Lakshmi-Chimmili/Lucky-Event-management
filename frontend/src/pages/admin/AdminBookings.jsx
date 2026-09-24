import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { staffService } from '../../services/staffService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { CURRENCY_SYMBOL, BOOKING_STATUSES } from '../../config/constants';
import { Search, Filter, UserCheck, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBookings = () => {
  const { showSuccess, showError } = useToast();
  const [bookings, setBookings] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, categoryFilter, dateFilter, search]);

  const fetchInitialData = async () => {
    try {
      const [staffRes, catRes] = await Promise.all([
        staffService.getAll(),
        categoryService.getAll(true)
      ]);
      if (staffRes.success) setStaffMembers(staffRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching admin filters data', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (dateFilter) params.date = dateFilter;
      if (search) params.search = search;

      const res = await bookingService.getAllBookings(params);
      if (res.success) {
        setBookings(res.data);
      }
    } catch (error) {
      showError('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await bookingService.updateStatus(bookingId, newStatus);
      if (res.success) {
        showSuccess(`Booking status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Error updating status');
    }
  };

  const openAssignModal = (b) => {
    setSelectedBooking(b);
    setSelectedStaffId(b.assignedStaff?._id || '');
    setAssignModalOpen(true);
  };

  const handleAssignStaff = async () => {
    if (!selectedBooking) return;
    try {
      const res = await bookingService.assignStaff(selectedBooking._id, selectedStaffId);
      if (res.success) {
        showSuccess('Staff assigned successfully');
        setAssignModalOpen(false);
        fetchBookings();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to assign staff');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Booking Management</h1>
          <p className="text-slate-500 text-sm">Review, confirm, assign staff, and filter all customer bookings.</p>
        </div>
      </div>

      {/* SEARCH AND FILTERS REQUIREMENT #30 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search ID, customer, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="assigned">Assigned</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
        {loading ? (
          <div className="py-8 space-y-3">
            {[1, 2, 3].map(n => <div key={n} className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">No matching bookings found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Event Category</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Staff</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => {
                const statusInfo = BOOKING_STATUSES[b.status] || { label: b.status, badgeClass: 'bg-slate-100' };

                return (
                  <tr key={b._id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-700">{b._id}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{b.customer?.name}</p>
                      <p className="text-[10px] text-slate-400">{b.customer?.email} | {b.customer?.phone}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{b.category?.name}</td>
                    <td className="p-3">
                      <p className="text-slate-800">{new Date(b.eventDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400">{b.eventTime} ({b.attendeeCount} guests)</p>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{CURRENCY_SYMBOL}{b.priceBreakdown?.grandTotal?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.badgeClass}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-3">
                      {b.assignedStaff ? (
                        <span className="font-semibold text-indigo-700 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> {b.assignedStaff.name}
                        </span>
                      ) : (
                        <button
                          onClick={() => openAssignModal(b)}
                          className="text-brand-600 font-bold hover:underline"
                        >
                          + Assign Staff
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/bookings/${b._id}`} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(b._id, 'confirmed')}
                            className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px]"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => openAssignModal(b)}
                          className="px-2 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-[10px]"
                        >
                          Staff
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ASSIGN STAFF MODAL REQUIREMENT #31 */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Assign Staff to Booking</h3>
            <p className="text-xs text-slate-500">
              Select an available event coordinator for booking ID: <span className="font-mono">{selectedBooking?._id}</span>
            </p>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              <label className="block text-xs font-semibold text-slate-700">Available Staff Members:</label>
              {staffMembers.map((s) => (
                <div
                  key={s._id}
                  onClick={() => setSelectedStaffId(s._id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    selectedStaffId === s._id ? 'border-brand-600 bg-brand-50 font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.specialization} ({s.experience})</p>
                  </div>
                  <span className="text-[10px] text-slate-600">{s.phone}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignStaff}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBookings;
