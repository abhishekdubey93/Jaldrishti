import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { PanchayatMeta, PanchayatForecast } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ForecastCard } from '../components/ForecastCard';
import { AlertBanner } from '../components/AlertBanner';
import { LocationSelector } from '../components/LocationSelector';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  MapPin,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Sprout,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  const [panchayats, setPanchayats] = useState<PanchayatMeta[]>([]);
  const [selectedPanchayat, setSelectedPanchayat] = useState<PanchayatMeta | null>(null);
  const [forecasts, setForecasts] = useState<PanchayatForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api.getPanchayats()
      .then((list) => {
        setPanchayats(list);
        if (list.length > 0) {
          const initial = list[0];
          setSelectedPanchayat(initial);
          return api.getPanchayatForecast(initial.panchayat_id);
        }
        return [];
      })
      .then((fcData) => setForecasts(fcData))
      .catch((err) => console.error('Error loading home weather data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLocationChange = (p: PanchayatMeta) => {
    setSelectedPanchayat(p);
    setLoading(true);
    api.getPanchayatForecast(p.panchayat_id)
      .then((fcData) => setForecasts(fcData))
      .catch((err) => console.error('Error fetching updated forecast:', err))
      .finally(() => setLoading(false));
  };

  const today = forecasts[0];

  return (
    <ErrorBoundary fallbackTitle="Home Weather Overview">
      <div className="space-y-6 pb-6">
        {/* Location & Header Overview Card */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-600">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Selected Panchayat Location</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {selectedPanchayat ? `${selectedPanchayat.panchayat_name} Panchayat` : 'Select Location'}
            </h1>
            <p className="text-xs text-slate-500">
              {selectedPanchayat
                ? `${selectedPanchayat.block_name} Block, ${selectedPanchayat.district_name} District, ${selectedPanchayat.state_name}`
                : 'Panchayat Weather Intelligence'}
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="px-3.5 py-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl text-xs font-bold hover:bg-brand-100 transition flex items-center space-x-1.5 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{showLocationModal ? 'Close Location Filter' : 'Change Location'}</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Status:</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-emerald-600" />
                <span>ML Model v1.0 Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Location Selector Dropdowns */}
        {showLocationModal && (
          <div className="animate-fadeIn">
            <LocationSelector
              selectedPanchayatId={selectedPanchayat?.panchayat_id || 'PNC_DHR_01'}
              onSelectPanchayat={(p) => handleLocationChange(p)}
            />
          </div>
        )}

        {/* Important Weather Alert Banner */}
        {today && (
          <AlertBanner
            alertLevel={today.alert_level}
            summary={today.weather_summary}
            panchayatName={selectedPanchayat?.panchayat_name || 'Selected Panchayat'}
          />
        )}

        {/* Current Weather Summary Card */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse">
            Loading localized weather forecast...
          </div>
        ) : today ? (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-6 -translate-y-6">
              <CloudRain className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-brand-200">
                    Downscaled ML Forecast
                  </span>
                  <span className="text-xs text-slate-300">
                    {new Date(today.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-baseline space-x-3">
                  <span className="text-5xl font-black tracking-tight">{today.temp_max}°C</span>
                  <span className="text-lg text-slate-300 font-medium">/ {today.temp_min}°C Min</span>
                </div>

                <p className="text-sm font-semibold text-brand-200 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Condition: {today.weather_summary}</span>
                </p>
              </div>

              {/* Weather Quick Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 w-full md:w-auto bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs">
                <div className="text-center p-2">
                  <CloudRain className="w-4 h-4 text-sky-300 mx-auto mb-1" />
                  <span className="text-slate-300 block text-[10px]">Rainfall</span>
                  <span className="font-extrabold text-sm">{today.rainfall_mm} mm</span>
                </div>

                <div className="text-center p-2 border-x border-white/10">
                  <Droplets className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
                  <span className="text-slate-300 block text-[10px]">Humidity</span>
                  <span className="font-extrabold text-sm">{today.humidity_pct}%</span>
                </div>

                <div className="text-center p-2">
                  <Wind className="w-4 h-4 text-amber-300 mx-auto mb-1" />
                  <span className="text-slate-300 block text-[10px]">Wind Speed</span>
                  <span className="font-extrabold text-sm">{today.wind_speed_kmh} km/h</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Feature Navigation Cards (Dashboard & Advisory Shortcuts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/dashboard"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:scale-110 transition">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition">
                  Weather Dashboard
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View interactive temperature/rain charts, metrics & Leaflet map
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/advisories"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-agri-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-agri-50 text-agri-600 rounded-xl group-hover:scale-110 transition">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-agri-600 transition">
                  Crop Advisory Centre
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get irrigation, sowing & spraying advice for selected crops
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-agri-600 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* 5-Day Forecast Preview Section */}
        {forecasts.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">5-Day Panchayat Forecast Preview</h3>
              <Link to="/dashboard" className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1">
                <span>View Full Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {forecasts.map((fc, idx) => (
                <ForecastCard key={fc.date} forecast={fc} isToday={idx === 0} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
