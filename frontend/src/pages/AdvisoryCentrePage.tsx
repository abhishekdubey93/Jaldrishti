import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AdvisoryResponse, PanchayatMeta } from '../types';
import { AdvisoryCard } from '../components/AdvisoryCard';
import { LocationSelector } from '../components/LocationSelector';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  Filter,
  ShieldAlert,
  MapPin,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const AdvisoryCentrePage: React.FC = () => {
  const { t } = useLanguage();

  const [panchayats, setPanchayats] = useState<PanchayatMeta[]>([]);
  const [selectedPanchayat, setSelectedPanchayat] = useState<PanchayatMeta | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [advisoryData, setAdvisoryData] = useState<AdvisoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocationSelector, setShowLocationSelector] = useState<boolean>(false);

  const availableCrops = ['Wheat', 'Paddy', 'Maize', 'Mustard', 'Tomato'];

  const fetchAdvisories = (pId: string, crop: string) => {
    setLoading(true);
    setError(null);
    api.getAdvisories(pId, crop)
      .then((data) => setAdvisoryData(data))
      .catch((err) => {
        console.error('Error loading advisories:', err);
        setError('Unable to load crop advisories. Please verify backend connection.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    api.getPanchayats()
      .then((data) => {
        setPanchayats(data || []);
        if (data && data.length > 0) {
          const initial = data[0];
          setSelectedPanchayat(initial);
          fetchAdvisories(initial.panchayat_id, selectedCrop);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching panchayats for advisories:', err);
        setError('Failed to fetch Panchayats list from backend.');
        setLoading(false);
      });
  }, []);

  const handlePanchayatChange = (p: PanchayatMeta) => {
    setSelectedPanchayat(p);
    fetchAdvisories(p.panchayat_id, selectedCrop);
  };

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    if (selectedPanchayat) {
      fetchAdvisories(selectedPanchayat.panchayat_id, crop);
    }
  };

  return (
    <ErrorBoundary fallbackTitle="Crop Advisory Centre">
      <div className="space-y-6 pb-8">
        {/* Header Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition"
              title="Go Back Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <Sprout className="w-6 h-6 text-agri-600" />
                <span>{t.advisories.title}</span>
              </h1>
              <p className="text-xs text-slate-500">
                {selectedPanchayat
                  ? `${selectedPanchayat.panchayat_name} Panchayat (${selectedPanchayat.block_name} Block, ${selectedPanchayat.state_name})`
                  : t.advisories.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLocationSelector(!showLocationSelector)}
            className="px-3.5 py-2 bg-agri-50 border border-agri-200 text-agri-800 rounded-xl text-xs font-bold hover:bg-agri-100 transition shadow-sm flex items-center space-x-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-agri-600" />
            <span>{showLocationSelector ? 'Hide Location Selector' : 'Change Panchayat'}</span>
          </button>
        </div>

        {/* Collapsible Location Selector */}
        {showLocationSelector && (
          <LocationSelector
            selectedPanchayatId={selectedPanchayat?.panchayat_id || 'PNC_DHR_01'}
            onSelectPanchayat={(p) => handlePanchayatChange(p)}
          />
        )}

        {/* Error Fallback */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => selectedPanchayat && fetchAdvisories(selectedPanchayat.panchayat_id, selectedCrop)}
              className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Crop Selection Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-agri-600" />
            <span>Select Target Crop:</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {availableCrops.map((crop) => (
              <button
                key={crop}
                onClick={() => handleCropChange(crop)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  selectedCrop === crop
                    ? 'bg-agri-600 text-white ring-2 ring-agri-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Advisories Display Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse">
            Generating weather-based agricultural advisories for {selectedCrop}...
          </div>
        ) : advisoryData?.advisories && advisoryData.advisories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advisoryData.advisories.map((adv) => (
              <AdvisoryCard key={adv.id} advisory={adv} />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Critical Weather Risks Detected</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Current weather forecasts indicate safe environmental parameters for {selectedCrop} in {selectedPanchayat?.panchayat_name || 'selected'} Panchayat.
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
