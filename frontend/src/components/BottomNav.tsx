import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, CloudSun, Sprout, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/dashboard', label: t.nav.dashboard, icon: CloudSun },
    { path: '/advisories', label: t.nav.advisories, icon: Sprout },
    { path: '/settings', label: t.nav.settings || 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex justify-around items-center">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-brand-600 font-bold bg-brand-50/80 scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
