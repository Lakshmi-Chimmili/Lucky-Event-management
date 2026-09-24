import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';
import { CURRENCY_SYMBOL, APP_NAME } from '../../config/constants';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Sparkles,
  Users,
  UserCheck,
  TrendingUp,
  MessageSquare,
  LogOut,
  Eye,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await reportService.getDashboardStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">Administration Console</span>
          <h1 className="text-3xl font-extrabold font-outfit mt-1">{APP_NAME} Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">Logged in as {user?.email}</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Admin Nav Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs font-semibold">
        <Link to="/admin/dashboard" className="p-3 bg-brand-600 text-white rounded-2xl text-center shadow-md">Dashboard</Link>
        <Link to="/admin/bookings" className="p-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl text-center">Bookings</Link>
        <Link to="/admin/categories" className="p-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl text-center">Categories</Link>
        <Link to="/admin/services" className="p-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl text-center">Services</Link>
        <Link to="/admin/staff" className="p-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl text-center">Staff</Link>
        <Link to="/admin/customers" className="p-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl text-center">Customers</Link>
        <Link to="/admin/reports" className="p-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl text-center">Reports</Link>
      </div>

      {/* Statistics Cards Grid Requirement #29 */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => <div key={n} className="h-24 bg-slate-200 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Customers</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats.totalCustomers || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Staff</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats.totalStaff || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Bookings</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats.totalBookings || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-amber-600 font-semibold uppercase">Pending</span>
            <p className="text-xl font-bold text-amber-600 mt-1">{stats.pendingBookings || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-blue-600 font-semibold uppercase">Confirmed</span>
            <p className="text-xl font-bold text-blue-600 mt-1">{stats.confirmedBookings || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-emerald-600 font-semibold uppercase">Completed</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">{stats.completedBookings || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-200">
            <span className="text-[10px] text-brand-700 font-bold uppercase">Total Revenue</span>
            <p className="text-lg font-extrabold text-brand-700 mt-1 font-outfit">
              {CURRENCY_SYMBOL}{stats.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      )}

      {/* Recent Bookings & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Bookings Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-lg">Recent Event Bookings</h3>
            <Link to="/admin/bookings" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentBookings?.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{b.customer?.name}</td>
                    <td className="p-3">{b.category?.name}</td>
                    <td className="p-3">{new Date(b.eventDate).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-slate-900">{CURRENCY_SYMBOL}{b.priceBreakdown?.grandTotal?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link to={`/bookings/${b._id}`} className="text-brand-600 font-bold hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Revenue by Category</h3>
          <div className="space-y-3">
            {data?.bookingsByCategory?.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div>
                  <p className="font-bold text-slate-800">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.count} bookings</p>
                </div>
                <span className="font-bold text-brand-600">
                  {CURRENCY_SYMBOL}{c.totalRevenue?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
