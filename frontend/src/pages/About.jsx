import React from 'react';
import { APP_NAME, TAGLINE } from '../config/constants';
import { Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold text-brand-600 tracking-widest">Our Story & Mission</span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-outfit">About {APP_NAME}</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          {TAGLINE}. Founded to remove guesswork and hidden costs from event planning.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">
            Transforming Event Management with Technology & Human Expertise
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            {APP_NAME} connects customers with top-rated event managers, decorators, caterers, sound engineers, and hospitality staff. We believe planning a wedding, birthday, or corporate summit should be as joyous as attending it.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <span className="block text-3xl font-bold text-brand-600 font-outfit">500+</span>
              <span className="text-xs text-slate-500 font-semibold">Events Managed</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <span className="block text-3xl font-bold text-brand-600 font-outfit">50+</span>
              <span className="text-xs text-slate-500 font-semibold">Vetted Managers</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800"
            alt="Event Team"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
