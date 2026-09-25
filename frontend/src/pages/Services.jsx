import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { CURRENCY_SYMBOL } from '../config/constants';
import {
  PartyPopper,
  Plus,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Zap,
  Tag,
  X,
  AlertCircle,
  RefreshCw,
  Star
} from 'lucide-react';

const FILTER_TYPES = ['All', 'Flat Fee', 'Per Guest Rate'];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewService, setQuickViewService] = useState(null);
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await serviceService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Unable to load event services. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services
      .filter((ser) => {
        const matchesSearch =
          ser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ser.description && ser.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (activeType === 'All') return true;
        if (activeType === 'Flat Fee') return ser.pricingType === 'flat';
        if (activeType === 'Per Guest Rate') return ser.pricingType === 'perAttendee';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [services, searchTerm, activeType, sortBy]);

  const handleAddService = (ser) => {
    navigate('/book', { state: { selectedService: ser } });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Add-On Enhancements
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-outfit text-white">
            Customizable <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Event Add-Ons</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Elevate your event with top-tier sound, stage lighting, gourmet multi-cuisine catering, candid photography, and live entertainment.
          </p>

          {/* Value Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Cost Calculation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Vetted Industry Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>100% Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH CONTROL BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search add-on services (e.g. DJ, Catering, Photography, Decor)..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-medium text-slate-900 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-semibold text-slate-800 transition-all outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Pricing Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {FILTER_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                activeType === type
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{type}</span>
              {type === 'All' && services.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeType === type ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {services.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Failed to Load Services</h3>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchServices}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between animate-pulse h-80"
              >
                <div className="h-48 bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-full"></div>
                </div>
                <div className="p-6 pt-0">
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 max-w-2xl mx-auto px-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Services Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {searchTerm || activeType !== 'All'
                ? `No add-on services match your search "${searchTerm || activeType}". Try clearing filters.`
                : 'No add-on services are currently available.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {(searchTerm || activeType !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveType('All');
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={fetchServices}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((ser) => (
              <div
                key={ser._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-cyan-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Service Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={
                        ser.image ||
                        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={ser.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/10">
                      {ser.pricingType === 'flat' ? 'Flat Rate Package' : 'Per-Guest Pricing'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors font-outfit">
                      {ser.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {ser.description}
                    </p>

                    <div className="pt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 font-outfit">
                        {CURRENCY_SYMBOL}{ser.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {ser.pricingType === 'perAttendee' ? '/ attendee' : ' total flat fee'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => handleAddService(ser)}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-brand-600 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Select for Event</span>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setQuickViewService(ser)}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition"
                  >
                    Service Breakdown
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QUICK VIEW MODAL */}
      {quickViewService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="relative h-52 shrink-0 bg-slate-900">
              <img
                src={quickViewService.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'}
                alt={quickViewService.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setQuickViewService(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">
                Rate: {CURRENCY_SYMBOL}{quickViewService.price.toLocaleString()} {quickViewService.pricingType === 'perAttendee' ? '/ attendee' : 'flat fee'}
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">
                {quickViewService.name}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {quickViewService.description}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Guarantee:</h4>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Professional grade equipment and vetted team</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Setup completed 2 hours prior to scheduled showtime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Direct coordination with your assigned Event Lead</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0 bg-white border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
              <button
                onClick={() => setQuickViewService(null)}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = quickViewService;
                  setQuickViewService(null);
                  handleAddService(s);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Event Booking</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
