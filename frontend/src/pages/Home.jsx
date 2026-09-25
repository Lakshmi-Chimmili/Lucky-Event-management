import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME, CURRENCY_SYMBOL } from '../config/constants';
import { categoryService } from '../services/categoryService';
import { serviceService } from '../services/serviceService';
import {
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Award,
  Star,
  Music,
  Camera,
  Utensils,
  PartyPopper
} from 'lucide-react';

import { DEFAULT_CATEGORIES, DEFAULT_SERVICES } from '../config/defaultData';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(() => DEFAULT_CATEGORIES.slice(0, 6));
  const [services, setServices] = useState(() => DEFAULT_SERVICES.slice(0, 6));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, serRes] = await Promise.all([
          categoryService.getAll(),
          serviceService.getAll()
        ]);
        if (catRes.success && Array.isArray(catRes.data) && catRes.data.length > 0) {
          setCategories(catRes.data.slice(0, 6));
        }
        if (serRes.success && Array.isArray(serRes.data) && serRes.data.length > 0) {
          setServices(serRes.data.slice(0, 6));
        }
      } catch (error) {
        console.warn('Backend server waking up, using default curated content:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#536df8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Next-Gen Event Planning & Staffing</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-outfit">
                Make Your Event <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">
                  Unforgettable & Seamless
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                Professional event managers, coordinators, decorators, caterers & staff for weddings, birthdays, corporate summits, and family celebrations with real-time attendee pricing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/book"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 hover:shadow-brand-500/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book an Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Services</span>
                </Link>
              </div>

              {/* Stats pill */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0 text-center">
                <div>
                  <span className="block text-2xl font-bold text-white">500+</span>
                  <span className="text-xs text-slate-400 font-medium">Events Managed</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">99.8%</span>
                  <span className="text-xs text-slate-400 font-medium">Satisfaction Rate</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">100%</span>
                  <span className="text-xs text-slate-400 font-medium">Transparent Pricing</span>
                </div>
              </div>
            </div>

            {/* Hero Card Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 p-3">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
                  alt="Event Banner"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase text-brand-400">Featured Celebration</span>
                      <h3 className="text-xl font-bold mt-0.5">Royal Wedding Gala</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      Live Manager
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase font-bold text-brand-600 tracking-widest">Tailored Celebrations</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
            Explore Event Categories
          </h3>
          <p className="text-slate-600 text-base leading-relaxed">
            Select from our wide array of professional event offerings with dynamic attendee-based pricing calculations.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                      From {CURRENCY_SYMBOL}{cat.basePricePerAttendee} / guest
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigate('/book', { state: { selectedCategory: cat } })}
                    className="w-full py-3 rounded-xl bg-slate-100 group-hover:bg-brand-600 group-hover:text-white text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Plan {cat.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-bold text-brand-400 tracking-widest">Seamless Experience</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit">How {APP_NAME} Works</h2>
          <p className="text-slate-400 text-sm">
            Book top-tier event management in 5 simple steps with instant transparent cost computation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
          {[
            { step: '01', title: 'Choose Event', desc: 'Select your event category from wedding, birthday, corporate & more.' },
            { step: '02', title: 'Enter Attendees', desc: 'Provide guest count, venue details, preferred date & time.' },
            { step: '03', title: 'Select Services', desc: 'Choose add-on DJ, catering, decoration, photography, etc.' },
            { step: '04', title: 'See Live Price', desc: 'Instant itemized price breakdown computed by our pricing engine.' },
            { step: '05', title: 'Manager Assigned', desc: 'Confirm booking and get dedicated professional staff assigned.' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-brand-600/30 border border-brand-500/50 text-brand-300 font-bold text-sm flex items-center justify-center mx-auto">
                {item.step}
              </div>
              <h3 className="font-bold text-base text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-bold text-brand-600 tracking-widest">Popular Add-ons</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit mt-2">
              Event Management Services
            </h2>
          </div>
          <Link to="/services" className="mt-4 md:mt-0 text-brand-600 font-semibold text-sm hover:underline flex items-center gap-1">
            Browse All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((ser) => (
            <div key={ser._id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">{ser.name}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {ser.pricingType === 'flat' ? 'Flat' : '/ Guest'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ser.description}</p>
                <p className="text-sm font-bold text-brand-600 mt-3">{CURRENCY_SYMBOL}{ser.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-brand-50 to-indigo-50 rounded-3xl border border-brand-100">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">Why Choose {APP_NAME}</h2>
          <p className="text-slate-600 text-sm mt-2">We bring structure, elegance, and peace of mind to your special days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Verified Professional Staff', icon: ShieldCheck, desc: 'Trained managers, anchors, and staff assigned specifically for your event date.' },
            { title: 'Transparent Live Pricing', icon: Zap, desc: 'Zero hidden fees. Price is computed upfront based on attendee count and optional services.' },
            { title: 'Full Event Coordination', icon: Clock, desc: 'End-to-end timeline tracking from setup, venue prep to final execution.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS (DEMO CONTENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-widest">[ Demo Testimonials ]</span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-outfit mt-2">Loved by Event Hosts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Ananya & Vikram', role: 'Wedding Hosts', text: 'EventEase made our 200-guest reception stress-free. The catering and DJ coordination was spot on!' },
            { name: 'Sanjay Mehta', role: 'VP Corporate HR', text: 'Managed our annual summit with 300 attendees flawlessly. The live price calculator saved us tons of estimation time.' },
            { name: 'Pooja Deshmukh', role: 'Birthday Celebration', text: 'The anchor and floral stage decoration were magical. Highly recommend EventEase for any family event!' }
          ].map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-slate-600 text-xs italic leading-relaxed">"{t.text}"</p>
              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-[11px] text-slate-400 font-medium">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-12 text-center space-y-6 shadow-2xl border border-slate-800">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-outfit">Ready to Plan Your Event?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm">
            Calculate your custom package and book expert event managers in under 2 minutes.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-brand-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Now</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
