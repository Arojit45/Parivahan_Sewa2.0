import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { BarChart2, MapPin } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLanguage } from "../../contexts/LanguageContext";

const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Internal helper: resets map view to initial position when triggered
const MapResetControl = ({ position, zoom, trigger }) => {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) {
      map.setView(position, zoom, { animate: true });
    }
  }, [trigger]);
  return null;
};

const LiveLocationMap = () => {
  const { dashboard } = useDashboard();
  const { t } = useLanguage();
  const twin = dashboard?.vehicleTwin;

  // Each time the component mounts (page refresh), increment mapKey to force
  // MapContainer remount and fresh tile load.
  const [mapKey] = useState(() => Date.now());
  // Incrementing this triggers MapResetControl to fly back to initial position.
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleViewFullTracking = () => {
    setResetTrigger((n) => n + 1);
  };

  // ── No location state ──────────────────────────────────────────────────────
  if (!twin || !twin.latitude || !twin.longitude) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">{t.dash?.liveLocation || "Live Location"}</h2>
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            {t.dash?.offline || "OFFLINE"}
          </span>
        </div>
        <div className="w-full h-64 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 mb-4">
          <MapPin className="w-10 h-10 text-slate-300" />
          <p className="text-sm font-semibold text-slate-400">{t.dash?.locationUnavailable || "Location unavailable"}</p>
          <p className="text-xs text-slate-400">{t.dash?.noGpsData || "No GPS data found for this vehicle"}</p>
        </div>
        <button className="w-full mt-auto py-2 border border-slate-200 rounded-lg text-sm font-semibold text-blue-600 hover:bg-slate-50 transition-colors">
          {t.dash?.viewFullTracking || "View Full Tracking"}
        </button>
      </div>
    );
  }

  const position = [twin.latitude, twin.longitude];
  const INITIAL_ZOOM = 14;

  const lastUpdatedLabel = twin.lastUpdated
    ? (() => {
        const diff = Math.floor((Date.now() - new Date(twin.lastUpdated).getTime()) / 60000);
        return diff < 60 ? `${diff} ${t.dash?.minAgo || "min ago"}` : `${Math.floor(diff / 60)} ${t.dash?.hrAgo || "hr ago"}`;
      })()
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">{t.dash?.liveLocation || "Live Location"}</h2>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {t.dash?.live || "LIVE"}
        </span>
      </div>

      {/* key={mapKey} forces a full remount on each page load → tiles refresh */}
      <div className="w-full h-64 min-h-[256px] rounded-xl overflow-hidden border border-slate-200 mb-4 z-0 relative block bg-slate-100">
        <MapContainer
          key={mapKey}
          center={position}
          zoom={INITIAL_ZOOM}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Circle center={position} radius={600} pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15 }} />
          <Marker position={position} icon={carIcon} />
          {/* Resets view to initial position when "View Full Tracking" is clicked */}
          <MapResetControl position={position} zoom={INITIAL_ZOOM} trigger={resetTrigger} />
        </MapContainer>
      </div>

      <div>
        <h3 className="font-bold text-slate-900 text-sm">{twin.address ?? (t.dash?.unknownLocation || "Unknown location")}</h3>
        <div className="flex justify-between items-end mt-1">
          <p className="text-xs text-slate-500 font-medium">
            {twin.speed != null ? `${twin.speed} ${t.dash?.kmh || "km/h"}` : "—"} • {twin.heading ?? "—"}
          </p>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            {lastUpdatedLabel ?? "—"} <BarChart2 className="w-3 h-3 text-emerald-500" />
          </p>
        </div>
      </div>

      <button
        onClick={handleViewFullTracking}
        className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-blue-600 hover:bg-slate-50 transition-colors"
      >
        {t.dash?.viewFullTracking || "View Full Tracking"}
      </button>
    </div>
  );
};

export default LiveLocationMap;
