import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import { CURRENCY_SYMBOL, APP_NAME } from '../../config/constants';
import { BarChart3, TrendingUp, DollarSign, Calendar, PieChart } from 'lucide-react';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await reportService.getDashboardStats();
      if (res.success) setData(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {};
  const categories = data?.bookingsByCategory || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Financial & Event Analytics</h1>
        <p className="text-slate-500 text-sm">Aggregated revenue reports and category breakdown.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-100 animate-pulse rounded-3xl"></div>
      ) : (
        <div className="space-y-8">
          
          {/* Revenue highlight */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-brand-400 tracking-widest">Calculated Total Revenue</span>
              <p className="text-4xl font-extrabold font-outfit mt-1">
                {CURRENCY_SYMBOL}{stats.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Computed from confirmed & completed bookings</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-300 flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          {/* Category Revenue Breakdown Bar chart visual representation */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">Bookings & Revenue by Category</h3>
            <div className="space-y-4">
              {categories.map((c, idx) => {
                const maxRev = Math.max(...categories.map(cat => cat.totalRevenue || 1));
                const widthPct = Math.round(((c.totalRevenue || 0) / maxRev) * 100);

                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800">{c.name} ({c.count} events)</span>
                      <span className="text-brand-600 font-bold">{CURRENCY_SYMBOL}{c.totalRevenue?.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, widthPct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminReports;
