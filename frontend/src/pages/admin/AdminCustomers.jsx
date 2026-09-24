import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

const AdminCustomers = () => {
  const { showSuccess, showError } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await userService.getCustomers();
      if (res.success) setCustomers(res.data);
    } catch (err) {
      showError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await userService.toggleStatus(id, !currentStatus);
      if (res.success) {
        showSuccess(res.message);
        fetchCustomers();
      }
    } catch (err) {
      showError('Error updating user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Registered Customers</h1>
        <p className="text-slate-500 text-sm">View customer accounts, registration dates, total booking counts, and status.</p>
      </div>

      {/* Customers Table REQUIREMENT #35 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
        {loading ? (
          <div className="py-8 space-y-3">
            {[1, 2, 3].map(n => <div key={n} className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>)}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Registered Date</th>
                <th className="p-3">Total Bookings</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">{c.name}</td>
                  <td className="p-3 text-slate-600">{c.email}</td>
                  <td className="p-3 text-slate-600">{c.phone || 'N/A'}</td>
                  <td className="p-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-bold text-brand-600">{c.bookingCount || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStatus(c._id, c.isActive)}
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold border ${c.isActive ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}
                    >
                      {c.isActive ? 'Disable Account' : 'Activate Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminCustomers;
