import React, { useState } from 'react';
import { contactService } from '../services/contactService';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { APP_NAME } from '../config/constants';

const Contact = () => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await contactService.submit(formData);
      if (res.success) {
        showSuccess(res.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold text-brand-600 tracking-widest">Get In Touch</span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-outfit">Contact {APP_NAME}</h1>
        <p className="text-slate-600 text-sm">
          Have questions about pricing, custom corporate packages, or specific event requirements? Drop us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-2xl font-bold font-outfit">Contact Information</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Our event specialists are available 24/7 to assist you with booking details and custom requests.
          </p>

          <div className="space-y-6 text-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Main Office</p>
                <p className="font-semibold">100 Innovation Plaza, Suite 400</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Support</p>
                <p className="font-semibold">support@{APP_NAME.toLowerCase()}.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rahul Verma"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Your Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your event requirements..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
