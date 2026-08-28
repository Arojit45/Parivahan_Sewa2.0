import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Car,
  CheckSquare,
  ChevronRight,
  Crosshair,
  History,
  Home,
  Loader2,
  MapPin,
  Moon,
  PlusCircle,
  Shield,
  Target,
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import CarModelViewer from '../components/CarModelViewer';
import { DashboardProvider, useDashboard } from '../contexts/DashboardContext';
import {
  checkGuardianGeofence,
  getGuardianBreachEvents,
  getGuardianConfig,
  getVehicleDashboard,
  saveGuardianConfig,
  toggleGuardianMode,
} from '../utils/api';

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const homeIcon = new L.DivIcon({
  html: '<div style="background-color:#10b981;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const DEFAULT_CENTER = [22.5726, 88.3639];
const RADIUS_OPTIONS = [500, 1000, 2000, 5000, 10000, 25000, 50000];

function MapSync({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center?.[0] && center?.[1]) {
      map.setView(center, zoom);
    }
  }, [center, map, zoom]);
  return null;
}

function formatTime(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatRadius(meters) {
  if (!meters) return '2 km';
  return meters >= 1000 ? `${Number(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 1)} km` : `${meters} m`;
}

function splitAddress(address) {
  if (!address) return ['Location unavailable', 'GPS data not received'];
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  return [parts.slice(0, 2).join(', ') || address, parts.slice(2).join(', ') || parts[1] || ''];
}

function distanceMeters(a, b) {
  if (!a || !b) return null;
  const toRad = (v) => (v * Math.PI) / 180;
  const radius = 6371000;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function configPayload(config, overrides = {}) {
  return {
    safeLat: config?.safeLat ?? overrides.safeLat,
    safeLng: config?.safeLng ?? overrides.safeLng,
    safeAreaName: config?.safeAreaName ?? overrides.safeAreaName,
    radiusMeters: config?.radiusMeters ?? 2000,
    pushAlertsEnabled: config?.pushAlertsEnabled ?? true,
    smsAlertsEnabled: config?.smsAlertsEnabled ?? true,
    emailAlertsEnabled: config?.emailAlertsEnabled ?? true,
    quietHoursEnabled: config?.quietHoursEnabled ?? true,
    quietHoursStart: config?.quietHoursStart ?? '22:00',
    quietHoursEnd: config?.quietHoursEnd ?? '06:00',
    ...overrides,
  };
}

const RegisterVehicleState = () => (
  <main className="flex-1 overflow-y-auto p-4 lg:p-8">
    <div className="h-full min-h-[520px] flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Register your vehicle</h2>
        <p className="text-sm text-slate-500 mb-6">Guardian Mode starts after a vehicle is linked to your account.</p>
        <Link to="/add-vehicle" className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700">
          <PlusCircle className="w-4 h-4" />
          Add Vehicle
        </Link>
      </div>
    </div>
  </main>
);

const GuardianModeInner = () => {
  const { vehicles, selectedVehicleId, selectVehicle, loadingVehicles, errorVehicles } = useDashboard();
  const [dashboard, setDashboard] = useState(null);
  const [config, setConfig] = useState(null);
  const [events, setEvents] = useState([]);
  const [locationMode, setLocationMode] = useState('area');
  const [areaName, setAreaName] = useState('Salt Lake Kolkata');
  const [latLng, setLatLng] = useState({ safeLat: '', safeLng: '' });
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingAlerts, setEditingAlerts] = useState(false);
  const [editingQuietHours, setEditingQuietHours] = useState(false);
  const [quietHours, setQuietHours] = useState({ start: '22:00', end: '06:00' });
  const [alertPrefs, setAlertPrefs] = useState({ push: true, sms: true, email: true });
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId) || null,
    [vehicles, selectedVehicleId]
  );

  const vehicleLocation = dashboard?.vehicleTwin;
  const carPosition = vehicleLocation?.latitude && vehicleLocation?.longitude
    ? [vehicleLocation.latitude, vehicleLocation.longitude]
    : null;
  const safePosition = config?.safeLat && config?.safeLng ? [config.safeLat, config.safeLng] : null;
  const mapCenter = safePosition || carPosition || DEFAULT_CENTER;
  const radiusMeters = config?.radiusMeters || 2000;
  const centerDistance = safePosition && carPosition ? distanceMeters(safePosition, carPosition) : null;
  const isOutside = config?.enabled && centerDistance != null && centerDistance > radiusMeters;
  const outsideBy = centerDistance == null ? null : Math.max(0, centerDistance - radiusMeters);
  const [locationTitle, locationSubtitle] = splitAddress(vehicleLocation?.address);
  const [safeTitle, safeSubtitle] = splitAddress(config?.safeAreaName);

  const loadGuardianData = useCallback(async (vehicleId) => {
    if (!vehicleId) return;
    setLoading(true);
    setError('');
    setStatusMessage('');
    try {
      const [dashboardData, configData] = await Promise.all([
        getVehicleDashboard(vehicleId),
        getGuardianConfig(vehicleId),
      ]);
      setDashboard(dashboardData);
      setConfig(configData);
      setAreaName(configData.safeAreaName || 'Salt Lake Kolkata');
      setLatLng({ safeLat: configData.safeLat ?? '', safeLng: configData.safeLng ?? '' });
      setAlertPrefs({
        push: configData.pushAlertsEnabled ?? true,
        sms: configData.smsAlertsEnabled ?? true,
        email: configData.emailAlertsEnabled ?? true,
      });
      setQuietHours({
        start: configData.quietHoursStart || '22:00',
        end: configData.quietHoursEnd || '06:00',
      });
      try {
        setEvents(await getGuardianBreachEvents(vehicleId));
      } catch (_) {
        setEvents([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load Guardian Mode.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuardianData(selectedVehicleId);
  }, [loadGuardianData, selectedVehicleId]);

  const saveConfig = async (overrides, message) => {
    setError('');
    setStatusMessage('');
    const payload = configPayload(config, overrides);
    if (!payload.safeAreaName && (payload.safeLat === '' || payload.safeLng === '' || payload.safeLat == null || payload.safeLng == null)) {
      setError('Set a safe area or latitude/longitude first.');
      return;
    }
    try {
      const updated = await saveGuardianConfig(selectedVehicleId, payload);
      setConfig(updated);
      setStatusMessage(message);
      setEditingLocation(false);
      setEditingAlerts(false);
      setEditingQuietHours(false);
    } catch (err) {
      setError(err.message || 'Could not save Guardian Mode settings.');
    }
  };

  const handleLocationSave = () => {
    if (locationMode === 'area') {
      saveConfig({ safeAreaName: areaName.trim(), safeLat: null, safeLng: null }, 'Safe location updated.');
      return;
    }
    saveConfig({ safeAreaName: null, safeLat: Number(latLng.safeLat), safeLng: Number(latLng.safeLng) }, 'Safe coordinates updated.');
  };

  const handleToggle = async () => {
    if (!config?.safeLat || !config?.safeLng) {
      setEditingLocation(true);
      setError('Set a safe location before enabling Guardian Mode.');
      return;
    }
    try {
      setError('');
      const updated = await toggleGuardianMode(selectedVehicleId);
      setConfig(updated);
      setStatusMessage(`Guardian Mode ${updated.enabled ? 'enabled' : 'disabled'}.`);
    } catch (err) {
      setError(err.message || 'Could not toggle Guardian Mode.');
    }
  };

  const handleCheck = async () => {
    try {
      setError('');
      const result = await checkGuardianGeofence(selectedVehicleId);
      setStatusMessage(result?.status === 'SAFE' ? result.message : 'Geofence breach recorded.');
      await loadGuardianData(selectedVehicleId);
    } catch (err) {
      setError(err.message || 'Could not run geofence check.');
    }
  };

  const focusMap = (position, zoom = 13) => {
    if (position && mapRef.current) mapRef.current.setView(position, zoom);
  };

  if (loadingVehicles) {
    return (
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex h-full items-center justify-center text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Loading vehicles
        </div>
      </main>
    );
  }

  if (errorVehicles || vehicles.length === 0) {
    return <RegisterVehicleState />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">
        <div className="flex-1 flex flex-col gap-6 min-w-0">


          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl p-3">{error}</div>}
          {statusMessage && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl p-3">{statusMessage}</div>}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 flex items-center justify-center relative shrink-0">
                <img src="/car.png" alt="Vehicle" className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{selectedVehicle?.manufacturer} {selectedVehicle?.model}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-slate-900 text-base tracking-wide">{selectedVehicle?.registrationNumber}</span>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">{selectedVehicle?.vehicleStatus || 'Active'}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{selectedVehicle?.fuelType || 'Fuel'} - {selectedVehicle?.registrationDate?.slice(0, 4) || 'Year'} - {selectedVehicle?.vehicleClass || 'Vehicle'}</p>
              </div>
            </div>
            <select
              value={selectedVehicleId || ''}
              onChange={(e) => selectVehicle(Number(e.target.value))}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.nickname || `${v.manufacturer} ${v.model}`}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Guardian Mode</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Keep your vehicle safe. Get notified if it leaves the safe zone.</p>
              </div>
            </div>
            <button type="button" onClick={handleToggle} disabled={loading} className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 disabled:opacity-60">
              <div className="text-right">
                <div className={`font-semibold leading-tight text-xs ${config?.enabled ? 'text-emerald-600' : 'text-slate-500'}`}>{config?.enabled ? 'ON' : 'OFF'}</div>
                <div className={`text-[9px] font-medium ${config?.enabled ? 'text-emerald-500' : 'text-slate-400'}`}>{config?.enabled ? 'Your vehicle is protected' : 'Set safe zone to protect'}</div>
              </div>
              <div className={`w-12 h-7 rounded-full p-1 flex shadow-inner ${config?.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                <div className="w-5 h-5 bg-white rounded-full shadow-md" />
              </div>
            </button>
          </div>

          {!config?.safeLat && !editingLocation && (
            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Set your vehicle location safe zone</h3>
              <p className="text-xs text-slate-500 mb-4">Choose a home/work area and radius before enabling Guardian Mode.</p>
              <button onClick={() => setEditingLocation(true)} className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700">Set Safe Location</button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center h-full">
              <div className="text-xs font-semibold text-slate-700 mb-2">Safe Location</div>
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1.5"><MapPin className="w-4 h-4" /></div>
              <div className="font-medium text-xs text-slate-800 mb-0.5">{config?.safeAreaName ? safeTitle : safePosition ? `${config.safeLat.toFixed(4)}, ${config.safeLng.toFixed(4)}` : 'Not set'}</div>
              <div className="text-[10px] text-slate-500 mb-3">{config?.safeAreaName ? safeSubtitle : 'Home, work, or custom area'}</div>
              <button onClick={() => setEditingLocation((v) => !v)} className="mt-auto w-full bg-white border border-blue-200 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-400 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300">Change Location</button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center h-full">
              <div className="text-xs font-semibold text-slate-700 mb-2">Safe Zone Radius</div>
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1.5"><Target className="w-4 h-4" /></div>
              <div className="font-medium text-xs text-slate-800 mb-0.5">Select Range</div>
              <div className="text-[10px] text-slate-500 mb-3">Recommended: 2 - 10 km</div>
              <div className="mt-auto w-full">
                <select value={radiusMeters} onChange={(e) => saveConfig({ radiusMeters: Number(e.target.value) }, 'Safe zone radius updated.')} className="w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg text-[11px] font-semibold outline-none text-center transition-all duration-300 cursor-pointer" disabled={!config?.safeLat}>
                  {RADIUS_OPTIONS.map((value) => <option key={value} value={value}>{formatRadius(value)}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center h-full">
              <div className="text-xs font-semibold text-slate-700 mb-2">Alert Preference</div>
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1.5"><Bell className="w-4 h-4" /></div>
              <div className="font-medium text-xs text-slate-800 mb-0.5">Instant Alerts</div>
              <div className="text-[10px] text-slate-500 mb-3">{[config?.pushAlertsEnabled && 'Push', config?.smsAlertsEnabled && 'SMS', config?.emailAlertsEnabled && 'Email'].filter(Boolean).join(' - ') || 'No channels'}</div>
              <button onClick={() => setEditingAlerts((v) => !v)} className="mt-auto w-full bg-white border border-blue-200 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-400 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300">Manage Alerts</button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center h-full">
              <div className="text-xs font-semibold text-slate-700 mb-2">Quiet Hours</div>
              <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-1.5"><Moon className="w-4 h-4" /></div>
              <div className="font-medium text-xs text-slate-800 mb-0.5">{config?.quietHoursEnabled ? `${config?.quietHoursStart || '22:00'} - ${config?.quietHoursEnd || '06:00'}` : 'Disabled'}</div>
              <div className="text-[10px] text-slate-500 mb-3">No alerts during this time</div>
              <button onClick={() => setEditingQuietHours((v) => !v)} className="mt-auto w-full bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-slate-600 hover:to-slate-400 hover:border-slate-400 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300">Edit</button>
            </div>
          </div>

          {(editingLocation || editingAlerts || editingQuietHours) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-4">
              {editingLocation && (
                <div>
                  <h3 className="font-semibold text-slate-800 text-xs mb-3">Safe Location</h3>
                  <div className="flex gap-2 mb-3">
                    <button onClick={() => setLocationMode('area')} className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg border ${locationMode === 'area' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-500 border-slate-200'}`}>Area</button>
                    <button onClick={() => setLocationMode('coords')} className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg border ${locationMode === 'coords' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-500 border-slate-200'}`}>Coordinates</button>
                  </div>
                  {locationMode === 'area' ? (
                    <input value={areaName} onChange={(e) => setAreaName(e.target.value)} placeholder="Example: Salt Lake Kolkata" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100" />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <input value={latLng.safeLat} onChange={(e) => setLatLng((v) => ({ ...v, safeLat: e.target.value }))} placeholder="Latitude" className="border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
                      <input value={latLng.safeLng} onChange={(e) => setLatLng((v) => ({ ...v, safeLng: e.target.value }))} placeholder="Longitude" className="border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
                    </div>
                  )}
                  <button onClick={handleLocationSave} className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700">Save Location</button>
                </div>
              )}

              {editingAlerts && (
                <div>
                  <h3 className="font-semibold text-slate-800 text-xs mb-3">Alert Channels</h3>
                  {[['push', 'Push notifications'], ['sms', 'SMS alerts'], ['email', 'Email alerts']].map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between text-xs text-slate-600 py-2 border-b border-slate-100">
                      {label}
                      <input type="checkbox" checked={alertPrefs[key]} onChange={(e) => setAlertPrefs((v) => ({ ...v, [key]: e.target.checked }))} />
                    </label>
                  ))}
                  <button onClick={() => saveConfig({ pushAlertsEnabled: alertPrefs.push, smsAlertsEnabled: alertPrefs.sms, emailAlertsEnabled: alertPrefs.email }, 'Alert preferences updated.')} className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700">Save Alerts</button>
                </div>
              )}

              {editingQuietHours && (
                <div>
                  <h3 className="font-semibold text-slate-800 text-xs mb-3">Quiet Hours</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="time" value={quietHours.start} onChange={(e) => setQuietHours((v) => ({ ...v, start: e.target.value }))} className="border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
                    <input type="time" value={quietHours.end} onChange={(e) => setQuietHours((v) => ({ ...v, end: e.target.value }))} className="border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
                  </div>
                  <label className="flex items-center justify-between text-xs text-slate-600 py-3">
                    Enable quiet hours
                    <input type="checkbox" checked={config?.quietHoursEnabled ?? true} onChange={(e) => setConfig((v) => ({ ...v, quietHoursEnabled: e.target.checked }))} />
                  </label>
                  <button onClick={() => saveConfig({ quietHoursEnabled: config?.quietHoursEnabled ?? true, quietHoursStart: quietHours.start, quietHoursEnd: quietHours.end }, 'Quiet hours updated.')} className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700">Save Quiet Hours</button>
                </div>
              )}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative h-[350px] z-0">
            <MapContainer ref={mapRef} center={mapCenter} zoom={safePosition ? 11 : 5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <MapSync center={mapCenter} zoom={safePosition ? 11 : 5} />
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap contributors" />
              {safePosition && <Circle center={safePosition} radius={radiusMeters} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, dashArray: '4, 8' }} />}
              {carPosition && <Marker position={carPosition} icon={carIcon} />}
              {safePosition && <Marker position={safePosition} icon={homeIcon} />}
              {events.slice(0, 5).map((event) => <Marker key={event.id} position={[event.breachLat, event.breachLng]} />)}
            </MapContainer>

            <button onClick={handleCheck} disabled={!config?.enabled || !safePosition || !carPosition} className="absolute top-4 left-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-700 z-[400] disabled:opacity-60">Run Geofence Check</button>
            <div className={`absolute top-4 right-4 border rounded-lg shadow-sm flex items-center px-2.5 py-1.5 text-xs font-semibold gap-1.5 z-[400] ${isOutside ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              {isOutside ? <AlertTriangle className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
              {isOutside ? 'Breach Detected' : 'Inside Safe Zone'}
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden z-[400]">
              <button onClick={() => mapRef.current?.zoomIn()} className="p-1.5 text-slate-600 hover:bg-slate-50 border-b border-slate-100">+</button>
              <button onClick={() => mapRef.current?.zoomOut()} className="p-1.5 text-slate-600 hover:bg-slate-50 border-b border-slate-100">-</button>
              <button onClick={() => focusMap(carPosition || safePosition, 13)} className="p-1.5 text-slate-600 hover:bg-slate-50"><Crosshair className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800 text-sm">Recent Guardian Events</h3>
              <button onClick={() => loadGuardianData(selectedVehicleId)} className="text-xs font-medium text-blue-600 hover:text-blue-700">Refresh</button>
            </div>
            {events.length === 0 ? (
              <p className="text-xs text-slate-500">No guardian events yet.</p>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 6).map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm mt-2.5 shrink-0" />
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 -my-2 rounded-xl hover:bg-slate-50">
                      <div className="flex items-start gap-3">
                        <div className="text-[10px] font-medium text-slate-500 w-20 pt-1">{formatTime(event.breachedAt)}</div>
                        <div className="w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle className="w-3 h-3" /></div>
                        <div className="pt-0.5">
                          <div className="font-semibold text-slate-800 text-xs">Geofence Breach Detected</div>
                          <div className="text-[10px] text-slate-500">{event.lastKnownAddress || 'Location unavailable'}</div>
                        </div>
                      </div>
                      <button onClick={() => focusMap([event.breachLat, event.breachLng], 14)} className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-2.5 py-1 rounded-md text-[10px] font-semibold">View on Map</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full xl:w-[320px] 2xl:w-[350px] flex flex-col gap-6 shrink-0 mt-6 xl:mt-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 text-xs">Last Known Location</h3>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 ${carPosition ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}><span className={`w-1.5 h-1.5 rounded-full ${carPosition ? 'bg-emerald-500' : 'bg-slate-400'}`} /> {carPosition ? 'Live' : 'Offline'}</span>
            </div>
            <div className="flex gap-2.5 mb-3">
              <div className="w-7 h-7 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5" /></div>
              <div>
                <div className="font-semibold text-slate-800 text-xs">{locationTitle}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{locationSubtitle}</div>
              </div>
            </div>
            <div className="flex gap-2.5 mb-5">
              <div className="w-7 h-7 flex items-center justify-center shrink-0"><History className="w-3.5 h-3.5 text-slate-400" /></div>
              <div className="text-[10px] font-medium text-slate-600 flex items-center h-7">{formatTime(vehicleLocation?.lastUpdated)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div><div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Speed</div><div className="font-semibold text-slate-800 text-xs">{vehicleLocation?.speed ?? 0} km/h</div></div>
              <div><div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Heading</div><div className="font-semibold text-slate-800 text-xs">{vehicleLocation?.heading || 'NA'}</div></div>
              <div><div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Distance</div><div className="font-semibold text-slate-800 text-xs">{centerDistance == null ? 'NA' : formatRadius(Math.round(centerDistance))}</div></div>
              <div><div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Status</div><div className={`font-semibold text-xs ${isOutside ? 'text-red-600' : 'text-emerald-600'}`}>{isOutside ? 'Outside' : vehicleLocation?.speed > 0 ? 'Moving' : 'Parked'}</div></div>
            </div>
            <button onClick={() => focusMap(carPosition, 14)} disabled={!carPosition} className="w-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-60">
              View Live Tracking <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isOutside && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-semibold text-red-700 text-xs">Geofence Breach Alert</h3>
                <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md">Outside Safe Zone</span>
              </div>
              <p className="text-[10px] text-red-600/80 font-medium mb-3">Your vehicle has moved outside the safe zone.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div><div className="text-[9px] font-semibold text-red-500/70 mb-0.5">Outside Since</div><div className="text-[10px] font-semibold text-red-800">{formatTime(config?.lastBreachAt || events[0]?.breachedAt)}</div></div>
                <div><div className="text-[9px] font-semibold text-red-500/70 mb-0.5">Outside By</div><div className="text-[10px] font-semibold text-red-800">{formatRadius(Math.round(outsideBy || 0))}</div></div>
              </div>
              <button onClick={() => focusMap(carPosition, 14)} className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> View on Map
              </button>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-xs mb-4">How Guardian Mode Works</h3>
            <div className="space-y-3">
              {[[Home, 'Set your safe location (home/work).'], [Target, 'Choose a radius for the safe zone.'], [Bell, 'Get instant alert if vehicle exits the zone.'], [MapPin, 'Track the vehicle on live map.'], [CheckSquare, 'Check event in timeline.']].map(([Icon, text]) => (
                <div key={text} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Icon className="w-2.5 h-2.5" /></div>
                  <div className="text-[10px] text-slate-600 font-medium">{text}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button onClick={() => setEditingLocation(true)} className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center justify-center gap-1">Configure now <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const GuardianModePage = () => (
  <DashboardProvider>
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <GuardianModeInner />
      </div>
    </div>
  </DashboardProvider>
);

export default GuardianModePage;
