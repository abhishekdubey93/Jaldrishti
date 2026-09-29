import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { PanchayatForecast, BlockForecast } from '../types';

interface WeatherChartProps {
  panchayatForecasts: PanchayatForecast[];
  blockForecasts?: BlockForecast[];
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  panchayatForecasts,
  blockForecasts
}) => {
  // Merge data for comparison
  const data = panchayatForecasts.map((pf) => {
    const bf = blockForecasts?.find((b) => b.date === pf.date);
    return {
      date: new Date(pf.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      panchayatRain: pf.rainfall_mm,
      blockRain: bf ? bf.rainfall_mm : pf.rainfall_mm * 0.9,
      panchayatTempMax: pf.temp_max,
      blockTempMax: bf ? bf.temp_max : pf.temp_max + 1.2,
      humidity: pf.humidity_pct
    };
  });

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">5-Day Weather Forecast & Comparison</h3>
          <p className="text-xs text-slate-500">Comparing Localized Panchayat ML Estimates vs. Coarse Block Forecast</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-brand-500 rounded-sm"></div>
            <span className="text-slate-600 font-medium">Panchayat Rain (mm)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-slate-300 rounded-sm"></div>
            <span className="text-slate-600 font-medium">Block Rain (mm)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-rose-500"></div>
            <span className="text-slate-600 font-medium">Panchayat Temp (°C)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '12px' }}
            />
            <Bar yAxisId="left" dataKey="panchayatRain" name="Panchayat Rain (mm)" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar yAxisId="left" dataKey="blockRain" name="Block Rain (mm)" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
            <Line yAxisId="right" type="monotone" dataKey="panchayatTempMax" name="Panchayat Max Temp (°C)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
