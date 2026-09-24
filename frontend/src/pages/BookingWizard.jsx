import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { categoryService } from '../services/categoryService';
import { serviceService } from '../services/serviceService';
import { bookingService } from '../services/bookingService';
import { CURRENCY_SYMBOL, APP_NAME } from '../config/constants';
import {
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  Building,
  Plus
} from 'lucide-react';

const BookingWizard = () => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Wizard Step (1 to 7)
  const [currentStep, setCurrentStep] = useState(1);

  // Data Sources from backend
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [attendeeCount, setAttendeeCount] = useState(100);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('18:00');
  const [venueAddress, setVenueAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  // Submitting state
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, serRes] = await Promise.all([
          categoryService.getAll(),
          serviceService.getAll()
        ]);
        if (catRes.success) {
          setCategories(catRes.data);
          // If passed via navigation state
          if (location.state?.selectedCategory) {
            const found = catRes.data.find(c => c._id === location.state.selectedCategory._id);
            if (found) setSelectedCategory(found);
          } else if (catRes.data.length > 0) {
            setSelectedCategory(catRes.data[0]);
          }
        }
        if (serRes.success) {
          setServices(serRes.data);
          if (location.state?.selectedService) {
            const foundSer = serRes.data.find(s => s._id === location.state.selectedService._id);
            if (foundSer) setSelectedServices([foundSer._id]);
          }
        }
      } catch (err) {
        showError('Failed to load event data');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Calculate live breakdown on frontend
  const calculateLivePrice = () => {
    if (!selectedCategory) return { categoryTotal: 0, addOnsTotal: 0, grandTotal: 0, items: [] };

    const count = Number(attendeeCount) || 0;
    const categoryTotal = selectedCategory.basePricePerAttendee * count;

    const items = [];
    let addOnsTotal = 0;

    selectedServices.forEach(serId => {
      const ser = services.find(s => s._id === serId);
      if (ser) {
        let total = 0;
        let qty = 1;
        if (ser.pricingType === 'flat') {
          total = ser.price;
          qty = 1;
        } else {
          total = ser.price * count;
          qty = count;
        }
        addOnsTotal += total;
        items.push({
          service: ser,
          qty,
          total
        });
      }
    });

    return {
      categoryTotal,
      addOnsTotal,
      grandTotal: categoryTotal + addOnsTotal,
      items
    };
  };

  const livePrice = calculateLivePrice();

  // Step Nav validation
  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!selectedCategory) {
        showError('Please select an event category');
        return;
      }
    } else if (currentStep === 2) {
      if (!attendeeCount || attendeeCount <= 0) {
        showError('Please enter a valid attendee count greater than 0');
        return;
      }
      if (!eventDate) {
        showError('Please select an event date');
        return;
      }
      if (!eventTime) {
        showError('Please select an event time');
        return;
      }
      if (!venueAddress.trim()) {
        showError('Please enter the venue address');
        return;
      }
      if (!city.trim()) {
        showError('Please enter the city');
        return;
      }
    } else if (currentStep === 4) {
      // Auth step check
      if (!isAuthenticated) {
        setCurrentStep(5);
        return;
      } else {
        setCurrentStep(6);
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleConfirmBooking = async () => {
    if (submitting) return; // Prevent double submission requirement #26

    setSubmitting(true);
    try {
      const payload = {
        categoryId: selectedCategory._id,
        attendeeCount: Number(attendeeCount),
        eventDate,
        eventTime,
        venueAddress,
        city,
        notes,
        addOnIds: selectedServices
      };

      const res = await bookingService.createBooking(payload);

      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        showSuccess('Booking confirmed successfully!');
        setCurrentStep(7); // Success Step
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleService = (serId) => {
    if (selectedServices.includes(serId)) {
      setSelectedServices(selectedServices.filter(id => id !== serId));
    } else {
      setSelectedServices([...selectedServices, serId]);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        <p className="text-slate-500 text-sm font-medium">Loading event wizard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER & STEPPER */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase font-bold text-brand-600 tracking-widest">Instant Event Booking</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">Plan Your Celebration</h1>
      </div>

      {/* Progress Bar (Steps 1 to 6) */}
      {currentStep < 7 && (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-semibold">
            {[
              { num: 1, label: 'Event Type' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Add-Ons' },
              { num: 4, label: 'Summary' },
              { num: 5, label: 'Login' },
              { num: 6, label: 'Review' }
            ].map(s => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl transition-all ${
                  currentStep === s.num
                    ? 'bg-brand-600 text-white shadow-md'
                    : currentStep > s.num
                    ? 'bg-brand-50 text-brand-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span className="block text-sm font-bold">{s.num}</span>
                <span className="hidden sm:inline text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: SELECT EVENT CATEGORY */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-outfit">Step 1 — Select Event Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer rounded-3xl p-4 border transition-all duration-300 relative flex flex-col justify-between ${
                  selectedCategory?._id === cat._id
                    ? 'border-brand-600 ring-2 ring-brand-500 bg-brand-50/20 shadow-xl'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {selectedCategory?._id === cat._id && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'}
                    alt={cat.name}
                    className="w-full h-44 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Starting price</span>
                  <span className="text-sm font-bold text-brand-600">{CURRENCY_SYMBOL}{cat.basePricePerAttendee} / guest</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: EVENT DETAILS */}
      {currentStep === 2 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-outfit">Step 2 — Event & Guest Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Number of Attendees *</label>
              <div className="relative">
                <Users className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min="1"
                  required
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Event Date *</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Event Start Time *</label>
              <div className="relative">
                <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">City *</label>
              <div className="relative">
                <Building className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Bangalore, Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Venue Address *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Full venue / banquet hall address..."
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Special Requests / Notes</label>
              <textarea
                rows={3}
                placeholder="Any dietary restrictions, theme colors, or specific requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ADDITIONAL SERVICES */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">Step 3 — Additional Services</h2>
            <span className="text-sm text-slate-500">Selected: {selectedServices.length} items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((ser) => {
              const isSelected = selectedServices.includes(ser._id);
              const unitCost = ser.pricingType === 'flat' ? ser.price : ser.price * Number(attendeeCount || 0);

              return (
                <div
                  key={ser._id}
                  onClick={() => toggleService(ser._id)}
                  className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-600 ring-2 ring-brand-500 bg-brand-50/20 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={ser.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800'}
                      alt={ser.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{ser.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{ser.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">
                        {ser.pricingType === 'flat' ? 'Flat Rate' : `${CURRENCY_SYMBOL}${ser.price} x ${attendeeCount} guests`}
                      </span>
                      <p className="text-sm font-bold text-brand-600">{CURRENCY_SYMBOL}{unitCost.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {isSelected ? 'Selected' : 'Add'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: PRICE SUMMARY */}
      {currentStep === 4 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-outfit">Step 4 — Price Summary & Breakdown</h2>

          <div className="divide-y divide-slate-100 space-y-4">
            {/* Category Base */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-base">{selectedCategory?.name}</p>
                <p className="text-xs text-slate-500">
                  {CURRENCY_SYMBOL}{selectedCategory?.basePricePerAttendee} × {attendeeCount} attendees
                </p>
              </div>
              <p className="font-bold text-slate-900 text-lg">
                {CURRENCY_SYMBOL}{livePrice.categoryTotal.toLocaleString()}
              </p>
            </div>

            {/* Add ons */}
            {livePrice.items.length > 0 && (
              <div className="pt-4 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Add-on Services</p>
                {livePrice.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">{item.service.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.service.pricingType === 'flat'
                          ? 'Flat rate'
                          : `${CURRENCY_SYMBOL}${item.service.price} × ${attendeeCount} attendees`}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-800">
                      {CURRENCY_SYMBOL}{item.total.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Grand Total */}
            <div className="pt-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Estimated Grand Total</span>
                <p className="text-3xl font-extrabold text-brand-600 font-outfit">
                  {CURRENCY_SYMBOL}{livePrice.grandTotal.toLocaleString()}
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-slate-100 rounded-full font-semibold text-slate-600">
                Calculated by Server Engine
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: LOGIN PROMPT IF GUEST */}
      {currentStep === 5 && (
        <div className="bg-slate-900 text-white p-10 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold font-outfit">Please Login to Continue Booking</h2>
          <p className="text-slate-300 max-w-md mx-auto text-sm">
            Sign in or create a quick account so we can link your event booking and display status updates on your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: '/book' } } })}
              className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register', { state: { from: { pathname: '/book' } } })}
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: FINAL REVIEW & CONFIRM */}
      {currentStep === 6 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-outfit">Step 6 — Final Review & Confirmation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Event Type</p>
              <p className="font-bold text-slate-900 text-base">{selectedCategory?.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Attendees</p>
              <p className="font-bold text-slate-900 text-base">{attendeeCount} Guests</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Date & Time</p>
              <p className="font-semibold text-slate-800">{eventDate} at {eventTime}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Venue</p>
              <p className="font-semibold text-slate-800">{venueAddress}, {city}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-700 font-semibold uppercase">Grand Total Price</p>
              <p className="text-3xl font-extrabold text-brand-700 font-outfit">
                {CURRENCY_SYMBOL}{livePrice.grandTotal.toLocaleString()}
              </p>
            </div>
            <span className="text-xs font-semibold text-brand-600 bg-white px-3 py-1.5 rounded-full border border-brand-200">
              Payment Status: Pending Approval
            </span>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>{submitting ? 'Creating Booking...' : 'Confirm Booking'}</span>
          </button>
        </div>
      )}

      {/* STEP 7: BOOKING SUCCESS PAGE (Requirement #20, #25, #81) */}
      {currentStep === 7 && createdBooking && (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">✓ Booking Successful!</h2>
            <p className="text-slate-500 text-sm">Your booking has been received and registered with MongoDB.</p>
          </div>

          {/* MongoDB _id banner requirement #20 */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white max-w-lg mx-auto space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-400">Booking ID (MongoDB _id):</span>
              <span className="font-mono text-sm font-bold text-brand-300">{createdBooking._id}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Event:</span>
                <span className="font-semibold text-white">{createdBooking.category?.name || selectedCategory?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Event Date:</span>
                <span className="font-semibold text-white">{new Date(createdBooking.eventDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Attendees:</span>
                <span className="font-semibold text-white">{createdBooking.attendeeCount} Guests</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Amount:</span>
                <span className="font-semibold text-emerald-400">{CURRENCY_SYMBOL}{createdBooking.priceBreakdown?.grandTotal?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(`/bookings/${createdBooking._id}`)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md"
            >
              View Booking Details
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
            >
              Go to Customer Dashboard
            </button>
          </div>
        </div>
      )}

      {/* CONTROLS BAR (Steps 1 to 4) */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all disabled:opacity-30 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={goToNextStep}
            className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default BookingWizard;
