import React from 'react';
import { JalDrishtiLogo } from './JalDrishtiLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-12 border-t border-slate-800 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <JalDrishtiLogo size="sm" />
            <div>
              <span className="text-base font-bold text-white">JalDrishti</span>
              <p className="text-[11px] text-slate-400">Panchayat-Level Weather Intelligence & Advisory Platform</p>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            <p>© {new Date().getFullYear()} JalDrishti. Powered by Machine Learning & Open Earth Observations.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
