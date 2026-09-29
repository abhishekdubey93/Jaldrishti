import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { JalDrishtiLogo } from '../components/JalDrishtiLogo';
import {
  Languages,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Database,
  BarChart2,
  MessageSquare,
  ShieldCheck,
  Server
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);

  useEffect(() => {
    api.getHealth()
      .then((data) => setHealthStatus(data))
      .catch(() => setHealthStatus({ status: 'offline' }))
      .finally(() => setLoadingHealth(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* App Branding Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center space-y-3">
        <JalDrishtiLogo size="lg" />
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">JalDrishti</h2>
          <p className="text-xs text-slate-500">Localized Panchayat Weather Intelligence v1.2.0</p>
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
          <Languages className="w-5 h-5 text-brand-600" />
          <span>Interface Language Preference</span>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
              language === 'en'
                ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-400'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>English (EN)</span>
            {language === 'en' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
              language === 'hi'
                ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-400'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>हिंदी (Hindi)</span>
            {language === 'hi' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
          </button>
        </div>
      </div>

      {/* Backend & ML System Status */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
          <Server className="w-5 h-5 text-brand-600" />
          <span>Backend & ML Model Connection</span>
        </div>

        {loadingHealth ? (
          <p className="text-xs text-slate-400">Checking FastAPI backend status...</p>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600">FastAPI Service Status:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                healthStatus?.status === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {healthStatus?.status === 'online' ? 'Online' : 'Offline / Unavailable'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600">Trained ML Model:</span>
              <span className="font-bold text-slate-800 font-mono">
                {healthStatus?.ml_model_loaded ? 'Active (RandomForest v1.0)' : 'Statistical Fallback'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* System Links */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900 mb-2">System Diagnostics & Feedback</h3>
        <Link
          to="/model-performance"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-semibold text-slate-800 transition"
        >
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-brand-600" />
            <span>Model Evaluation & Accuracy Metrics</span>
          </div>
          <span className="text-slate-400">→</span>
        </Link>

        <Link
          to="/data-info"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-semibold text-slate-800 transition"
        >
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-brand-600" />
            <span>Data Lineage & Geospatial Sources</span>
          </div>
          <span className="text-slate-400">→</span>
        </Link>

        <Link
          to="/feedback"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-semibold text-slate-800 transition"
        >
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-agri-600" />
            <span>Submit Local Weather Observations</span>
          </div>
          <span className="text-slate-400">→</span>
        </Link>
      </div>
    </div>
  );
};
