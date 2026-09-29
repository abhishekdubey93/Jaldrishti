import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LocationSelector } from '../components/LocationSelector';
import { ForecastCard } from '../components/ForecastCard';
import { WeatherChart } from '../components/WeatherChart';
import { PanchayatMap } from '../components/PanchayatMap';
import { AlertBanner } from '../components/AlertBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { api } from '../services/api';
import { PanchayatForecast, BlockForecast, PanchayatMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  MapPin,
  Clock,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Cpu,
  BarChart2,
  Calendar
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();

  const [selectedPanchayat, setSelectedPanchayat] = useState<PanchayatMeta | null>(null);
  const [panchayatForecasts, setPanchayatForecasts] = useState<PanchayatForecast[]>([]);
  const [blockForecasts, setBlockForecasts] = useState<BlockForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocationSelector, setShowLocationSelector] = useState<boolean>(false);

  const loadDataForPanchayat = (p: PanchayatMeta) => {
    setLoading(true);
    setError(null);

    Promise.all([
      api.getPanchayatForecast(p.panchayat_id),
      api.getBlockForecast(p.block_id)
    ])
      .then(([pFc, bFc]) => {
        setPanchayatForecasts(pFc || []);
        setBlockForecasts(bFc || []);
      })
      .catch((err) => {
        console.error('Error fetching dashboard forecast:', err);
        setError('Unable to fetch forecast data from backend. Please verify backend connection.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    api.getPanchayats()
      .then((list) => {
        if (list && list.length > 0) {
          const initial = list[0];
          setSelectedPanchayat(initial);
          loadDataForPanchayat(initial);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching panchayats:', err);
        setError('Could not connect to JalDrishti backend API.');
        setLoading(false);
      });
  }, []);

  const handleSelectPanchayat = (p: PanchayatMeta) => {
    setSelectedPanchayat(p);
    loadDataForPanchayat(p);
  };

  const todayFc = panchayatForecasts[0];

  return (
    <ErrorBoundary fallbackTitle="Weather Dashboard">
      <div className="space-y-6 pb-8">
        {/* Dashboard Header & Location Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition"
                title="Go Back Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t.dashboard.title}
                </h1>
                <p className="text-xs text-slate-500">
                  {selectedPanchayat
                    ? `${selectedPanchayat.panchayat_name} Panchayat (${selectedPanchayat.block_name} Block, ${selectedPanchayat.district_name}, ${selectedPanchayat.state_name})`
                    : t.dashboard.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowLocationSelector(!showLocationSelector)}
                className="px-3.5 py-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl text-xs font-bold hover:bg-brand-100 transition shadow-sm flex items-center space-x-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{showLocationSelector ? 'Hide Selector' : 'Change Panchayat'}</span>
              </button>

              {selectedPanchayat && (
                <Link
                  to={`/panchayat/${selectedPanchayat.panchayat_id}`}
                  className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition flex items-center space-x-1"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Timestamp & Lineage Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center space-x-2 font-mono">
              <Cpu className="w-3.5 h-3.5 text-brand-600" />
              <span>Downscaled ML Model Engine: Active</span>
            </div>
          </div>
        </div>

        {/* Collapsible Location Selector */}
        {showLocationSelector && (
          <LocationSelector
            selectedPanchayatId={selectedPanchayat?.panchayat_id || 'PNC_DHR_01'}
            onSelectPanchayat={(p) => handleSelectPanchayat(p)}
          />
        )}

        {/* Error Fallback Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => selectedPanchayat && loadDataForPanchayat(selectedPanchayat)}
              className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Weather Alert if present */}
        {todayFc && (
          <AlertBanner
            alertLevel={todayFc.alert_level}
            summary={todayFc.weather_summary}
            panchayatName={selectedPanchayat?.panchayat_name || 'Selected Panchayat'}
          />
        )}

        {/* 5-Day Forecast Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse">
            Fetching localized forecast metrics...
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>5-Day Panchayat Weather Forecast</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {panchayatForecasts.map((fc, idx) => (
                  <ForecastCard key={fc.date} forecast={fc} isToday={idx === 0} />
                ))}
              </div>
            </div>

            {/* Weather Charts & Leaflet GIS Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <WeatherChart panchayatForecasts={panchayatForecasts} blockForecasts={blockForecasts} />
              <PanchayatMap
                selectedPanchayatId={selectedPanchayat?.panchayat_id || 'PNC_DHR_01'}
                onSelectPanchayatId={(id) => {
                  api.getPanchayats().then((list) => {
                    const match = list.find((p) => p.panchayat_id === id);
                    if (match) handleSelectPanchayat(match);
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};
