import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Languages, Activity, MapPin, ShieldAlert, Database, MessageSquare, Home, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { JalDrishtiLogo } from './JalDrishtiLogo';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/dashboard', label: t.nav.dashboard, icon: MapPin },
    { path: '/advisories', label: t.nav.advisories, icon: ShieldAlert },
    { path: '/model-performance', label: t.nav.modelPerformance, icon: Activity },
    { path: '/data-info', label: t.nav.dataInfo, icon: Database },
    { path: '/feedback', label: t.nav.feedback, icon: MessageSquare },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <JalDrishtiLogo size="md" />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-brand-600 transition">
              JalDrishti
            </span>
            <span className="text-[10px] font-semibold text-slate-400 -mt-0.5">
              Panchayat Weather Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition shadow-sm"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-brand-600" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          <Link
            to="/settings"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
            title="Settings & App Status"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
