import React, { useEffect, useState } from 'react';
import { contactService } from '../../services/contactService';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';

const AdminMessages = () => {
  const { showSuccess, showError } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await contactService.getAll();
      if (res.success) setMessages(res.data);
    } catch (err) {
      showError('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const res = await contactService.markRead(id);
      if (res.success) {
        showSuccess('Message marked as read');
        fetchMessages();
      }
    } catch (err) {
      showError('Failed to update message');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Contact Messages</h1>
        <p className="text-slate-500 text-sm">Customer inquiries submitted through the contact page.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-8 space-y-3">
            {[1, 2].map(n => <div key={n} className="h-24 bg-slate-100 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-sm">
            No contact messages received yet.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`p-6 rounded-3xl border transition-all space-y-3 ${
                m.isRead ? 'bg-white border-slate-200' : 'bg-brand-50/40 border-brand-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-base">{m.name}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {m.email}</span>
                  {m.phone && <span className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {m.phone}</span>}
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{m.message}</p>

              {!m.isRead && (
                <div className="pt-2 text-right">
                  <button
                    onClick={() => handleMarkRead(m._id)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow"
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminMessages;
