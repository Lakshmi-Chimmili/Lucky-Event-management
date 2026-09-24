import React, { useEffect, useState } from 'react';
import { staffService } from '../../services/staffService';
import { useToast } from '../../context/ToastContext';
import { Plus, UserCheck, Phone, Mail, Award, CheckCircle } from 'lucide-react';

const AdminStaff = () => {
  const { showSuccess, showError } = useToast();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'Event Manager',
    experience: '3+ Years',
    skills: 'Coordination, Vendor Management'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await staffService.getAll();
      if (res.success) setStaffList(res.data);
    } catch (err) {
      showError('Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await staffService.create(formData);
      if (res.success) {
        showSuccess('Staff member created successfully');
        setModalOpen(false);
        setFormData({ name: '', email: '', password: '', phone: '', specialization: 'Event Manager', experience: '3+ Years', skills: '' });
        fetchStaff();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Error creating staff member');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Staff & Event Managers</h1>
          <p className="text-slate-500 text-sm">Add and assign qualified event management professionals.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(n => <div key={n} className="h-48 bg-slate-100 animate-pulse rounded-3xl"></div>)
        ) : (
          staffList.map((s) => (
            <div key={s._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                  <span className="text-xs text-brand-600 font-semibold">{s.specialization}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {s.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone || 'N/A'}</p>
                <p className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-slate-400" /> Experience: {s.experience}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Add New Staff Member</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
              >
                Create Staff Account
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminStaff;
