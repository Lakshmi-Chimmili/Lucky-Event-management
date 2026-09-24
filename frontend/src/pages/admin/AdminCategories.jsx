import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { CURRENCY_SYMBOL } from '../../config/constants';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminCategories = () => {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePricePerAttendee: 500,
    image: '',
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll(true);
      if (res.success) setCategories(res.data);
    } catch (err) {
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', basePricePerAttendee: 500, image: '', isActive: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description,
      basePricePerAttendee: cat.basePricePerAttendee,
      image: cat.image || '',
      isActive: cat.isActive
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await categoryService.update(editingId, formData);
        if (res.success) showSuccess('Category updated successfully');
      } else {
        const res = await categoryService.create(formData);
        if (res.success) showSuccess('Category created successfully');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      showError(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await categoryService.delete(id);
      if (res.success) {
        showSuccess('Category deleted');
        fetchCategories();
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Error deleting category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Event Categories Admin</h1>
          <p className="text-slate-500 text-sm">Add, edit, change per-attendee base pricing, or toggle active status.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories Table REQUIREMENT #33 */}
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
                <th className="p-3">Category Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Base Price / Attendee</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'}
                      alt={cat.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  </td>
                  <td className="p-3 font-bold text-slate-900">{cat.name}</td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">{cat.description}</td>
                  <td className="p-3 font-bold text-brand-600">{CURRENCY_SYMBOL}{cat.basePricePerAttendee}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
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

      {/* Category Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 font-outfit">
              {editingId ? 'Edit Event Category' : 'Add New Category'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Base Price Per Attendee ({CURRENCY_SYMBOL}) *</label>
              <input
                type="number"
                required
                value={formData.basePricePerAttendee}
                onChange={(e) => setFormData({ ...formData, basePricePerAttendee: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" className="text-xs font-semibold text-slate-700">Active / Visible</label>
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
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
