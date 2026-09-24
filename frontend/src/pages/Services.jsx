import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { CURRENCY_SYMBOL } from '../config/constants';
import { PartyPopper, Plus, CheckCircle2 } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceService.getAll();
        if (res.success) setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold text-brand-600 tracking-widest">Optional Enhancements</span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-outfit">Event Add-On Services</h1>
        <p className="text-slate-600 text-base">
          Customize your celebration with high-octane DJ setups, royal stage decor, gourmet catering, professional photography, and live entertainment.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-72 bg-slate-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((ser) => (
            <div
              key={ser._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ser.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'}
                    alt={ser.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
                    {ser.pricingType === 'flat' ? 'Flat Fee' : 'Per Guest Rate'}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{ser.name}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{ser.description}</p>
                  <p className="text-lg font-bold text-brand-600 pt-2">
                    {CURRENCY_SYMBOL}{ser.price.toLocaleString()}
                    <span className="text-xs text-slate-400 font-normal">
                      {ser.pricingType === 'perAttendee' ? ' / attendee' : ' total'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => navigate('/book', { state: { selectedService: ser } })}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Event</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
