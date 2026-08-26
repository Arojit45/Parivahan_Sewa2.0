import React from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import { BarChart2 } from 'lucide-react';

// Custom icon for car marker
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // A top-down car icon placeholder
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const LiveLocationMap = () => {
  // Placeholder coords for Kolkata
  const position = [22.5726, 88.3639];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Live Location</h2>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> LIVE
        </span>
      </div>

      <div className="w-full h-64 min-h-[256px] rounded-xl overflow-hidden border border-slate-200 mb-4 z-0 relative block bg-slate-100">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Circle center={position} radius={800} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }} />
          <Marker position={position} icon={carIcon} />
        </MapContainer>
      </div>

      <div>
        <h3 className="font-bold text-slate-900 text-sm">Kolkata, West Bengal</h3>
        <div className="flex justify-between items-end mt-1">
          <p className="text-xs text-slate-500 font-medium">46 km/h • North</p>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">2 min ago <BarChart2 className="w-3 h-3 text-emerald-500" /></p>
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-blue-600 hover:bg-slate-50 transition-colors">
        View Full Tracking
      </button>
    </div>
  );
};

export default LiveLocationMap;
