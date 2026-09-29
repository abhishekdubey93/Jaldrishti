import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PanchayatMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { t } = useLanguage();

  const [panchayats, setPanchayats] = useState<PanchayatMeta[]>([]);
  const [selectedPanchayatId, setSelectedPanchayatId] = useState<string>('PNC_DHR_01');
  const [obsDate, setObsDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rainfall, setRainfall] = useState<string>('');
  const [temp, setTemp] = useState<string>('');
  const [useful, setUseful] = useState<boolean>(true);
  const [comments, setComments] = useState<string>('');

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    api.getPanchayats().then((list) => {
      setPanchayats(list);
      if (list.length > 0) setSelectedPanchayatId(list[0].panchayat_id);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    api.submitFeedback({
      panchayat_id: selectedPanchayatId,
      observation_date: obsDate,
      reported_rainfall_mm: rainfall ? parseFloat(rainfall) : undefined,
      reported_temp_c: temp ? parseFloat(temp) : undefined,
      advisory_useful: useful,
      comments: comments
    })
      .then(() => {
        setSubmitted(true);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.feedback.title}</h1>
        <p className="text-xs text-slate-500">{t.feedback.subtitle}</p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-emerald-900">Observation Recorded!</h3>
          <p className="text-xs text-emerald-700">
            Thank you for contributing ground truth weather observations. Verified reports will be used in future model retraining runs.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
          >
            Submit Another Observation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Panchayat</label>
            <select
              value={selectedPanchayatId}
              onChange={(e) => setSelectedPanchayatId(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {panchayats.map((p) => (
                <option key={p.panchayat_id} value={p.panchayat_id}>
                  {p.panchayat_name} ({p.block_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Observation Date</label>
            <input
              type="date"
              value={obsDate}
              onChange={(e) => setObsDate(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.feedback.reportedRain}</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 15.5"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.feedback.reportedTemp}</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 26.2"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.feedback.useful}</label>
            <div className="flex items-center space-x-4 text-xs font-medium pt-1">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="useful"
                  checked={useful === true}
                  onChange={() => setUseful(true)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <span>Yes, Very Useful</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="useful"
                  checked={useful === false}
                  onChange={() => setUseful(false)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <span>Needs Improvement</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.feedback.comments}</label>
            <textarea
              rows={3}
              placeholder="Provide additional details regarding crop stage or local field conditions..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl text-xs hover:bg-brand-700 transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : t.feedback.submit}</span>
          </button>
        </form>
      )}
    </div>
  );
};
