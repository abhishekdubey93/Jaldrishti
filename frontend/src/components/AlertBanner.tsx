import React from 'react';
import { AlertTriangle, CloudRain, Flame, Wind } from 'lucide-react';

interface AlertBannerProps {
  alertLevel: string;
  summary: string;
  panchayatName: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alertLevel,
  summary,
  panchayatName
}) => {
  if (alertLevel === 'NORMAL') {
    return null;
  }

  const getAlertStyle = () => {
    switch (alertLevel) {
      case 'HEAVY_RAIN':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-900',
          icon: CloudRain,
          iconColor: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800',
          title: 'Heavy Rainfall Warning'
        };
      case 'HEAT_WAVE':
      case 'HIGH_TEMP':
        return {
          bg: 'bg-red-50 border-red-200 text-red-900',
          icon: Flame,
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-800',
          title: 'High Temperature Alert'
        };
      case 'HIGH_WIND':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: Wind,
          iconColor: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-800',
          title: 'High Wind Warning'
        };
      default:
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-800',
          title: 'Weather Alert'
        };
    }
  };

  const style = getAlertStyle();
  const Icon = style.icon;

  return (
    <div className={`p-4 rounded-xl border mb-6 flex items-start space-x-3.5 ${style.bg}`}>
      <div className={`p-2 rounded-lg bg-white/80 ${style.iconColor} shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
            {alertLevel}
          </span>
          <span className="text-xs font-semibold text-slate-500">Panchayat: {panchayatName}</span>
        </div>
        <h4 className="text-sm font-bold mt-1">{style.title}: {summary}</h4>
        <p className="text-xs mt-0.5 opacity-90">
          ML model detected extreme weather variations in local terrain. Take appropriate agricultural precautions.
        </p>
      </div>
    </div>
  );
};
