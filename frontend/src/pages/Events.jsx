import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { CURRENCY_SYMBOL } from '../config/constants';
import {
  Calendar,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Layers,
  X,
  AlertCircle,
  RefreshCw,
  Clock,
  Star
} from 'lucide-react';

const CATEGORY_TAGS = ['All', 'Weddings', 'Parties', 'Corporate', 'Milestones', 'Gatherings'];

const Events = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedQuickView, setSelectedQuickView] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Unable to load event packages. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter & Sort Logic
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const matchesSearch =
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (activeTag === 'All') return true;
        if (activeTag === 'Weddings') {
          return /wedding|marriage|engagement|reception/i.test(cat.name);
        }
        if (activeTag === 'Parties') {
          return /birthday|party|baby shower|college|school/i.test(cat.name);
        }
        if (activeTag === 'Corporate') {
          return /corporate|professional|conference/i.test(cat.name);
        }
        if (activeTag === 'Milestones') {
          return /anniversary|milestone/i.test(cat.name);
        }
        if (activeTag === 'Gatherings') {
          return /family|reunion|other/i.test(cat.name);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.basePricePerAttendee - b.basePricePerAttendee;
        if (sortBy === 'price-high') return b.basePricePerAttendee - a.basePricePerAttendee;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // 'featured' retains natural order
      });
  }, [categories, searchTerm, activeTag, sortBy]);

  const handleBook = (cat) => {
    navigate('/book', { state: { selectedCategory: cat } });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Curated Experiences
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-outfit text-white">
            Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">Event Categories</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Transparent, per-guest baseline pricing for weddings, intimate family milestones, and grand corporate summits. Fully customizable with premium add-ons.
          </p>

          {/* Quick Stats Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Event Managers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Transparent Per-Guest Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9/5 Average Rating</span>
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
              placeholder="Search by event name or keyword (e.g. Wedding, Birthday)..."
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
              <option value="price-low">Base Price: Low to High</option>
              <option value="price-high">Base Price: High to Low</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {CATEGORY_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                activeTag === tag
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{tag}</span>
              {tag === 'All' && categories.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTag === tag ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {categories.length}
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
                <h3 className="font-bold text-sm">Connection Issue</h3>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchCategories}
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
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between animate-pulse h-96"
              >
                <div className="h-56 bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-full"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
                </div>
                <div className="p-6 pt-0">
                  <div className="h-11 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCategories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 max-w-2xl mx-auto px-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Event Categories Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {searchTerm || activeTag !== 'All'
                ? `No event packages match your criteria "${searchTerm || activeTag}". Try searching for another term or reset your filters.`
                : 'No event categories are currently available in the system.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {(searchTerm || activeTag !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTag('All');
                  }}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  Clear All Filters
                </button>
              )}
              <button
                onClick={fetchCategories}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}

        {/* Category Cards Grid */}
        {!loading && !error && filteredCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    <img
                      src={
                        cat.image ||
                        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Price Pill */}
                    <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold border border-white/10 shadow-lg flex items-center gap-1.5">
                      <span className="text-emerald-400 font-extrabold">{CURRENCY_SYMBOL}{cat.basePricePerAttendee}</span>
                      <span className="text-slate-300 text-[11px] font-normal">/ guest</span>
                    </div>

                    {/* Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/20">
                        All-Inclusive Base
                      </span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors font-outfit">
                      {cat.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Dedicated Lead</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Timeline Planning</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Hospitality Desk</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Zero Hidden Fees</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => handleBook(cat)}
                    className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-brand-600/25 hover:shadow-brand-600/40 transition-all flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-indigo-600"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book This Event</span>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setSelectedQuickView(cat)}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition"
                  >
                    Quick View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QUICK VIEW MODAL */}
      {selectedQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="relative h-56 shrink-0 bg-slate-900">
              <img
                src={
                  selectedQuickView.image ||
                  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
                }
                alt={selectedQuickView.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedQuickView(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                Base Rate: {CURRENCY_SYMBOL}{selectedQuickView.basePricePerAttendee} / attendee
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">
                {selectedQuickView.name}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedQuickView.description}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">What’s Included in Base Package:</h4>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Complete setup and tear-down management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Dedicated on-site operations coordinator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Guest registration & hospitality management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Timeline scheduling and real-time vendor coordination</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0 bg-white border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
              <button
                onClick={() => setSelectedQuickView(null)}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const cat = selectedQuickView;
                  setSelectedQuickView(null);
                  handleBook(cat);
                }}
                className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Configure & Book Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
