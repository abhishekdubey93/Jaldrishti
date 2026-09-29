import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import { api } from '../services/api';
import { Layer } from 'leaflet';

interface PanchayatMapProps {
  selectedPanchayatId: string;
  onSelectPanchayatId: (id: string) => void;
}

// Helper component to center map on selected feature
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
};

export const PanchayatMap: React.FC<PanchayatMapProps> = ({
  selectedPanchayatId,
  onSelectPanchayatId
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30.88, 77.02]);
  const [activeVariable, setActiveVariable] = useState<'rainfall' | 'temperature'>('rainfall');

  useEffect(() => {
    api.getMapGeoJSON().then((data) => {
      setGeoJsonData(data);
    });
  }, []);

  const getColor = (feature: any) => {
    const props = feature.properties || {};
    if (activeVariable === 'rainfall') {
      const rain = props.rainfall_mm || 0;
      if (rain > 25) return '#0284c7'; // Heavy rain
      if (rain > 10) return '#38bdf8'; // Moderate rain
      if (rain > 0) return '#bae6fd';  // Light rain
      return '#e2e8f0'; // No rain
    } else {
      const temp = props.temp_max || 25;
      if (temp >= 38) return '#e11d48'; // High heat
      if (temp >= 30) return '#f97316'; // Warm
      if (temp >= 20) return '#eab308'; // Moderate
      return '#22c55e'; // Mild
    }
  };

  const styleFeature = (feature: any) => {
    const isSelected = feature.id === selectedPanchayatId || feature.properties?.panchayat_id === selectedPanchayatId;
    return {
      fillColor: getColor(feature),
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected ? '#0f172a' : '#64748b',
      fillOpacity: isSelected ? 0.85 : 0.6
    };
  };

  const onEachFeature = (feature: any, layer: Layer) => {
    const props = feature.properties || {};
    layer.on({
      click: () => {
        if (props.panchayat_id) {
          onSelectPanchayatId(props.panchayat_id);
        }
      }
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Interactive Panchayat Weather Boundaries</h3>
          <p className="text-xs text-slate-500">Color-coded spatial weather variations downscaled by JalDrishti ML</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveVariable('rainfall')}
            className={`px-3 py-1 rounded-md transition ${
              activeVariable === 'rainfall' ? 'bg-white text-brand-700 shadow-sm font-bold' : 'text-slate-600'
            }`}
          >
            Rainfall (mm)
          </button>
          <button
            onClick={() => setActiveVariable('temperature')}
            className={`px-3 py-1 rounded-md transition ${
              activeVariable === 'temperature' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-slate-600'
            }`}
          >
            Temperature (°C)
          </button>
        </div>
      </div>

      <div className="h-80 w-full rounded-lg overflow-hidden border border-slate-200 relative">
        {geoJsonData ? (
          <MapContainer
            center={mapCenter}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter center={mapCenter} />
            <GeoJSON
              key={activeVariable + JSON.stringify(geoJsonData)}
              data={geoJsonData}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50">
            Loading Map Boundaries...
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-lg shadow-md border border-slate-200 text-[11px] z-[1000]">
          <span className="font-bold block mb-1 text-slate-700">
            {activeVariable === 'rainfall' ? 'Rainfall Scale (mm)' : 'Temperature Scale (°C)'}
          </span>
          {activeVariable === 'rainfall' ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-[#0284c7]"></div>
                <span>Heavy (&gt;25 mm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-[#38bdf8]"></div>
                <span>Moderate (10 - 25 mm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-[#bae6fd]"></div>
                <span>Light (1 - 10 mm)</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-[#e11d48]"></div>
                <span>Heat Wave (&gt;38°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-[#f97316]"></div>
                <span>Warm (30 - 38°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-[#22c55e]"></div>
                <span>Mild (&lt;30°C)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
