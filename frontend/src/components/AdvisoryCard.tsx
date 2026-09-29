import React from 'react';
import { ShieldAlert, CheckCircle, Info, Sprout, Droplets, Thermometer, Scissors } from 'lucide-react';
import { AdvisoryItem } from '../types';

interface AdvisoryCardProps {
  advisory: AdvisoryItem;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ advisory }) => {
  const getSeverityBadge = () => {
    switch (advisory.severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'MODERATE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const getAdvisoryIcon = () => {
    switch (advisory.advisory_type.toLowerCase()) {
      case 'irrigation advisory':
        return Droplets;
      case 'sowing advisory':
        return Sprout;
      case 'heat stress advisory':
        return Thermometer;
      case 'harvesting advisory':
        return Scissors;
      default:
        return ShieldAlert;
    }
  };

  const Icon = getAdvisoryIcon();

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-agri-300 transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-agri-50 text-agri-600 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{advisory.advisory_type}</span>
            <h4 className="text-base font-bold text-slate-900">{advisory.title}</h4>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getSeverityBadge()}`}>
          {advisory.severity}
        </span>
      </div>

      <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
        <div>
          <span className="font-bold text-slate-700 block mb-0.5">Recommended Action:</span>
          <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 text-emerald-900 rounded-lg font-medium">
            {advisory.recommended_action}
          </div>
        </div>

        <div>
          <span className="font-bold text-slate-700 block mb-0.5">Weather Context & Rationale:</span>
          <p className="opacity-90">{advisory.explanation}</p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Target: {advisory.affected_panchayat}</span>
          <span className="font-mono text-slate-500">Confidence: {advisory.data_confidence}</span>
        </div>
      </div>
    </div>
  );
};
