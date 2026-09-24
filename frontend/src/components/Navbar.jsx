import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config/constants';
import { notificationService } from '../services/notificationService';
import {
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Bell,
  LayoutDashboard,
  ShieldAlert,
  Users,
  Briefcase,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (error) {
      // Silent error
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'staff') return '/staff/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-300 font-outfit">
                {APP_NAME}
              </span>
              <span className="block text-[10px] text-brand-400 font-medium tracking-widest uppercase">
                Events & Management
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              to="/"
              className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-brand-400 font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`hover:text-white transition-colors ${location.pathname.startsWith('/events') ? 'text-brand-400 font-semibold' : ''}`}
            >
              Events
            </Link>
            <Link
              to="/services"
              className={`hover:text-white transition-colors ${location.pathname === '/services' ? 'text-brand-400 font-semibold' : ''}`}
            >
              Services
            </Link>
            <Link
              to="/about"
              className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-brand-400 font-semibold' : ''}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`hover:text-white transition-colors ${location.pathname === '/contact' ? 'text-brand-400 font-semibold' : ''}`}
            >
              Contact
            </Link>
          </div>

          {/* Action Buttons / Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-brand-600/20 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Event</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-slate-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="font-semibold text-sm">Notifications</span>
                        <span className="text-xs text-brand-400 font-medium">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-800 my-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-4">No notifications yet</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n._id} className="py-2.5 text-xs hover:bg-slate-800/50 px-2 rounded-lg transition-colors">
                              <p className="font-semibold text-slate-100">{n.title}</p>
                              <p className="text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-slate-500 block mt-1">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-slate-200">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-400" />
                          <span>Dashboard</span>
                        </Link>

                        {user.role === 'customer' && (
                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4 text-indigo-400" />
                            <span>My Profile</span>
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-500/10 text-rose-400 rounded-xl transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Events
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Services
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Contact
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold shadow-md"
          >
            Book Event Now
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-brand-400 font-semibold"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard ({user?.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-rose-400 font-semibold w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-slate-800 text-white font-semibold text-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-slate-800 text-white font-semibold text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
