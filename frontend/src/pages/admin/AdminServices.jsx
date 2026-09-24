import React, { useEffect, useState } from 'react';
import { serviceService } from '../../services/serviceService';
import { useToast } from '../../context/ToastContext';
import { CURRENCY_SYMBOL } from '../../config/constants';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminServices = () => {
  const { showSuccess, showError } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricingType: 'flat',
    price: 5000,
    image: '',
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await serviceService.getAll(true);
      if (res.success) setServices(res.data);
    } catch (err) {
      showError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', pricingType: 'flat', price: 5000, image: '', isActive: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (ser) => {
    setEditingId(ser._id);
    setFormData({
      name: ser.name,
      description: ser.description,
      pricingType: ser.pricingType,
      price: ser.price,
      image: ser.image || '',
      isActive: ser.isActive
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await serviceService.update(editingId, formData);
        if (res.success) showSuccess('Service updated successfully');
      } else {
        const res = await serviceService.create(formData);
        if (res.success) showSuccess('Service created successfully');
      }
      setModalOpen(false);
      fetchServices();
    } catch (error) {
      showError(error.response?.data?.message || 'Error saving service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await serviceService.delete(id);
      if (res.success) {
        showSuccess('Service deleted');
        fetchServices();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Error deleting service');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Add-On Services Admin</h1>
          <p className="text-slate-500 text-sm">Manage optional event services, prices, and pricing types (FLAT vs PER ATTENDEE).</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Services Table REQUIREMENT #34 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
        {loading ? (
          <div className="py-8 space-y-3">
            {[1, 2, 3].map(n => <div key={n} className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>)}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Service Name</th>
                <th className="p-3">Pricing Type</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((ser) => (
                <tr key={ser._id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <img
                      src={ser.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'}
                      alt={ser.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  </td>
                  <td className="p-3 font-bold text-slate-900">{ser.name}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${ser.pricingType === 'flat' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {ser.pricingType === 'flat' ? 'FLAT' : 'PER ATTENDEE'}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-brand-600">{CURRENCY_SYMBOL}{ser.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ser.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {ser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(ser)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ser._id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 font-outfit">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pricing Type *</label>
              <select
                value={formData.pricingType}
                onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none"
              >
                <option value="flat">FLAT (Fixed total cost)</option>
                <option value="perAttendee">PER ATTENDEE (Multiplied by guest count)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price ({CURRENCY_SYMBOL}) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="serActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="serActive" className="text-xs font-semibold text-slate-700">Active / Available</label>
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
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminServices;
