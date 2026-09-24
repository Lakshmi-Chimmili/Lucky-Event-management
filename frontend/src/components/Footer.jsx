import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, TAGLINE } from '../config/constants';
import { Sparkles, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl text-white font-outfit">{APP_NAME}</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {TAGLINE}. Transforming occasions into unforgettable celebrations with transparent attendee pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-brand-400 transition-colors">Event Categories</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">Add-on Services</Link></li>
              <li><Link to="/book" className="hover:text-brand-400 transition-colors">Book Event</Link></li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Customer Login</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>100 Innovation Plaza, Suite 400, Tech City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@{APP_NAME.toLowerCase()}.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for world-class event management.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
