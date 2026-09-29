import React from 'react';
import { Info } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-slate-100 border-b border-slate-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-700 font-medium">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>JalDrishti: Downscaled Panchayat Weather Forecasts</span>
        </div>
        <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
          Active
        </span>
      </div>
    </div>
  );
};
