import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { PanchayatMeta, PanchayatForecast, AdvisoryResponse } from '../types';
import { AdvisoryCard } from '../components/AdvisoryCard';
import { ForecastCard } from '../components/ForecastCard';
import { MapPin, Mountain, Sun, Sprout, ArrowLeft, ShieldCheck, Database } from 'lucide-react';

export const PanchayatDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const panchayatId = id || 'PNC_DHR_01';

  const [panchayat, setPanchayat] = useState<PanchayatMeta | null>(null);
  const [forecasts, setForecasts] = useState<PanchayatForecast[]>([]);
  const [advisoryData, setAdvisoryData] = useState<AdvisoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getPanchayats().then((list) => list.find((p) => p.panchayat_id === panchayatId)),
      api.getPanchayatForecast(panchayatId),
      api.getAdvisories(panchayatId)
    ])
      .then(([pMeta, pFc, pAdv]) => {
        if (pMeta) setPanchayat(pMeta);
        setForecasts(pFc);
        setAdvisoryData(pAdv);
      })
      .finally(() => setLoading(false));
  }, [panchayatId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading Panchayat Geographical & Agricultural Profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link to="/dashboard" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{panchayat?.panchayat_name} Panchayat Profile</h1>
          <p className="text-xs text-slate-500">
            {panchayat?.block_name} Block, {panchayat?.district_name} District, {panchayat?.state_name}
          </p>
        </div>
      </div>

      {/* Terrain & Geo Meta Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Elevation & Slope</span>
            <span className="text-sm font-bold text-slate-800">{panchayat?.elevation_m}m ({panchayat?.slope_deg}° slope)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Mean Sentinel NDVI</span>
            <span className="text-sm font-bold text-slate-800">{panchayat?.ndvi} (Healthy Crop)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Land Surface Temp (LST)</span>
            <span className="text-sm font-bold text-slate-800">{panchayat?.lst_c}°C</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Soil & Primary Crops</span>
            <span className="text-sm font-bold text-slate-800">{panchayat?.soil_type}</span>
          </div>
        </div>
      </div>

      {/* Local 5-Day Forecast Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800">5-Day Downscaled Weather Estimates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {forecasts.map((fc, idx) => (
            <ForecastCard key={fc.date} forecast={fc} isToday={idx === 0} />
          ))}
        </div>
      </div>

      {/* Advisories Section */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-slate-800">Crop Advisories for {panchayat?.panchayat_name}</h3>
        {advisoryData?.advisories && advisoryData.advisories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advisoryData.advisories.map((adv) => (
              <AdvisoryCard key={adv.id} advisory={adv} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl border">
            No active crop warnings for current weather conditions.
          </div>
        )}
      </div>
    </div>
  );
};
