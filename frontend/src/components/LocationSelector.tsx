import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { api } from '../services/api';
import { PanchayatMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LocationSelectorProps {
  selectedPanchayatId: string;
  onSelectPanchayat: (panchayat: PanchayatMeta) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedPanchayatId,
  onSelectPanchayat
}) => {
  const { t } = useLanguage();

  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [panchayats, setPanchayats] = useState<PanchayatMeta[]>([]);

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('');

  useEffect(() => {
    api.getStates().then((data) => {
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    api.getDistricts(selectedState).then((data) => {
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0]);
      } else {
        setSelectedDistrict('');
      }
    });
  }, [selectedState]);

  useEffect(() => {
    if (!selectedState || !selectedDistrict) return;
    api.getBlocks(selectedState, selectedDistrict).then((data) => {
      setBlocks(data);
      if (data.length > 0) {
        setSelectedBlock(data[0].block_id);
      } else {
        setSelectedBlock('');
      }
    });
  }, [selectedState, selectedDistrict]);

  useEffect(() => {
    api.getPanchayats(selectedState, selectedDistrict, selectedBlock).then((data) => {
      setPanchayats(data);
      if (data.length > 0) {
        const found = data.find((p) => p.panchayat_id === selectedPanchayatId) || data[0];
        onSelectPanchayat(found);
      }
    });
  }, [selectedState, selectedDistrict, selectedBlock]);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center space-x-2 mb-3 text-slate-800 font-semibold text-sm">
        <MapPin className="w-4 h-4 text-brand-600" />
        <span>Select Location Hierarchy</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* State */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">{t.selectors.state}</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">{t.selectors.district}</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Block */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">{t.selectors.block}</label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {blocks.map((blk) => (
              <option key={blk.block_id} value={blk.block_id}>
                {blk.block_name}
              </option>
            ))}
          </select>
        </div>

        {/* Panchayat */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">{t.selectors.panchayat}</label>
          <select
            value={selectedPanchayatId}
            onChange={(e) => {
              const p = panchayats.find((item) => item.panchayat_id === e.target.value);
              if (p) onSelectPanchayat(p);
            }}
            className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-brand-50 border-brand-300 text-brand-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {panchayats.map((pnc) => (
              <option key={pnc.panchayat_id} value={pnc.panchayat_id}>
                {pnc.panchayat_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
