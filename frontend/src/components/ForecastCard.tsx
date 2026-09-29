import React from 'react';
import { CloudRain, Droplets, Wind, ShieldCheck, Cpu, Database } from 'lucide-react';
import { PanchayatForecast } from '../types';

interface ForecastCardProps {
  forecast: PanchayatForecast;
  isToday?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, isToday }) => {
  const dateObj = new Date(forecast.date);
  const dayName = isToday
    ? 'Today'
    : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const isML = forecast.data_mode === 'TRAINED_ML_MODEL' || forecast.data_mode?.includes('ML');

  return (
    <div
      className={`p-4 rounded-xl border transition duration-200 ${
        isToday
          ? 'bg-gradient-to-br from-brand-600 to-brand-800 text-white border-brand-700 shadow-md ring-2 ring-brand-400'
          : 'bg-white text-slate-800 border-slate-200 hover:border-brand-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${isToday ? 'text-brand-100' : 'text-slate-500'}`}>
          {dayName}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isToday
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {forecast.weather_summary}
        </span>
      </div>

      <div className="my-3 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-extrabold">{forecast.temp_max}°</span>
          <span className={`text-xs ml-1 ${isToday ? 'text-brand-200' : 'text-slate-400'}`}>
            / {forecast.temp_min}°C
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <CloudRain className={`w-4 h-4 ${isToday ? 'text-brand-200' : 'text-brand-600'}`} />
          <span className="font-bold">{forecast.rainfall_mm} mm</span>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-2 text-xs pt-2 border-t ${isToday ? 'border-brand-500/50 text-brand-100' : 'border-slate-100 text-slate-500'}`}>
        <div className="flex items-center space-x-1">
          <Droplets className="w-3.5 h-3.5 opacity-70" />
          <span>{forecast.humidity_pct}% Hum</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wind className="w-3.5 h-3.5 opacity-70" />
          <span>{forecast.wind_speed_kmh} km/h</span>
        </div>
      </div>

      {/* Explicit Data Origin Line */}
      <div className={`mt-3 pt-2 text-[10px] flex items-center justify-between border-t ${isToday ? 'border-brand-500/50 text-brand-200' : 'border-slate-100 text-slate-400'}`}>
        <span className="flex items-center space-x-1 font-mono">
          {isML ? <Cpu className="w-3 h-3 text-emerald-400" /> : <Database className="w-3 h-3 text-amber-500" />}
          <span>{isML ? 'ML Model v1.0' : 'Sample Forecast'}</span>
        </span>
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3" />
          <span>±{forecast.uncertainty_mm}mm ({Math.round(forecast.confidence * 100)}%)</span>
        </span>
      </div>
    </div>
  );
};
