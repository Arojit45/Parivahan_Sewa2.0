import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Truck, MapPin, Wifi, WifiOff, AlertTriangle, Navigation, Square, ArrowLeft, Loader2,
  CheckCircle2, XCircle, Search, Eye, Plus, BarChart3, Bell, ChevronDown, Filter,
  Maximize2, Car
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getFleetDashboard, createFleetRoute, stopFleetRoute } from '../utils/fleetApi';
import Sidebar from "../components/dashboard/Sidebar";

// Custom map icons for Light Theme Map (Car Icon)
const makeIcon = (color) => new L.DivIcon({
  html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

const iconOnline = makeIcon('#10b981'); // Emerald 500
const iconOffline = makeIcon('#64748b'); // Slate 500
const iconAtRisk = makeIcon('#f59e0b'); // Amber 500

const getIcon = (status) => {
  if (status === 'OFFLINE') return iconOffline;
  if (status === 'AT_RISK') return iconAtRisk;
  return iconOnline;
};

const statusBadge = (status) => {
  if (status === 'OFFLINE') return <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-100 text-slate-700">Offline</span>;
  if (status === 'AT_RISK') return <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border border-amber-300 bg-amber-100 text-amber-800">At Risk</span>;
  return <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-300 bg-emerald-100 text-emerald-800">Online</span>;
};

const alertTypeStyle = (type) => {
  if (type === 'ROUTE_DEVIATION') return { icon: <AlertTriangle className="w-5 h-5 text-red-500" />, label: 'Route Deviation', bg: 'bg-red-50 border-red-100', text: 'text-red-800' };
  if (type === 'GPS_OFFLINE') return { icon: <WifiOff className="w-5 h-5 text-slate-500" />, label: 'GPS Offline', bg: 'bg-slate-50 border-slate-200', text: 'text-slate-800' };
  return { icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, label: type, bg: 'bg-amber-50 border-amber-100', text: 'text-amber-800' };
};

const timeAgo = (dt) => {
  if (!dt) return 'â€”';
  const diff = Math.floor((Date.now() - new Date(dt).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

// Donut Chart Mock Component for Risk Radar
const FleetRiskRadarChart = ({ total, online, offline, atRisk }) => {
  // Simple SVG donut chart
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages (mock values for the visual if total is 0)
  const safeTotal = total || 1;
  const pOnline = (online / safeTotal) * 100;
  const pAtRisk = (atRisk / safeTotal) * 100;
  const pOffline = (offline / safeTotal) * 100;

  const strokeOnline = (pOnline / 100) * circumference;
  const strokeAtRisk = (pAtRisk / 100) * circumference;
  const strokeOffline = (pOffline / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
          {/* Online (Normal) - Green */}
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#10b981" strokeWidth="12"
            strokeDasharray={`${strokeOnline} ${circumference}`} strokeDashoffset="0" />
          {/* At Risk - Orange/Red */}
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f43f5e" strokeWidth="12"
            strokeDasharray={`${strokeAtRisk} ${circumference}`} strokeDashoffset={-strokeOnline} />
          {/* Offline - Gray */}
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#94a3b8" strokeWidth="12"
            strokeDasharray={`${strokeOffline} ${circumference}`} strokeDashoffset={-(strokeOnline + strokeAtRisk)} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800 leading-none">{total}</span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">Total Vehicles</span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-slate-600 font-medium">Critical</span></div>
          <span className="font-semibold text-slate-700">{atRisk > 0 ? (pAtRisk / 2).toFixed(1) : '0.0'}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-slate-600 font-medium">Warning</span></div>
          <span className="font-semibold text-slate-700">{atRisk > 0 ? (pAtRisk / 2).toFixed(1) : '0.0'}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-slate-600 font-medium">Normal</span></div>
          <span className="font-semibold text-slate-700">{pOnline.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span className="text-slate-600 font-medium">Offline</span></div>
          <span className="font-semibold text-slate-700">{pOffline.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

const FleetDashboardPage = () => {
  const { fleetId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const [showCreateRoute, setShowCreateRoute] = useState(false);
  const [showNotImplemented, setShowNotImplemented] = useState(false);
  const [routeForm, setRouteForm] = useState({ vehicleRegistrationNumber: '', startLocation: '', destination: '', startLat: '', startLng: '', destLat: '', destLng: '' });
  const [routeLoading, setRouteLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const dashboard = await getFleetDashboard(fleetId);
      setData(dashboard);
    } catch (err) {
      setError(err.message || 'Failed to load fleet dashboard.');
    } finally {
      setLoading(false);
    }
  }, [fleetId]);

  useEffect(() => { load(); }, [load]);

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    setRouteLoading(true);
    try {
      await createFleetRoute(fleetId, {
        ...routeForm,
        startLat: routeForm.startLat ? parseFloat(routeForm.startLat) : null,
        startLng: routeForm.startLng ? parseFloat(routeForm.startLng) : null,
        destLat: routeForm.destLat ? parseFloat(routeForm.destLat) : null,
        destLng: routeForm.destLng ? parseFloat(routeForm.destLng) : null,
      });
      setShowCreateRoute(false);
      load();
    } catch (err) {
      alert(err.message || 'Failed to create route.');
    } finally {
      setRouteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-red-500"><AlertTriangle className="w-12 h-12 mx-auto mb-2" />{error}</div>
      </div>
    );
  }

  const { vehicles = [], routes = [], alerts = [] } = data || {};
  const openAlerts = alerts.filter(a => a.status === 'OPEN');

  const filteredVehicles = vehicles.filter(v => {
    const matchFilter = vehicleFilter === 'ALL' ? true :
      vehicleFilter === 'ONLINE' ? v.onlineStatus === 'ONLINE' :
        vehicleFilter === 'OFFLINE' ? v.onlineStatus === 'OFFLINE' :
          v.onlineStatus === 'AT_RISK';
    const matchSearch = search ? v.registrationNumber.includes(search.toUpperCase()) : true;
    return matchFilter && matchSearch;
  });

  const withGps = vehicles.filter(v => v.latitude && v.longitude);
  const mapCenter = withGps.length > 0
    ? [withGps.reduce((s, v) => s + v.latitude, 0) / withGps.length, withGps.reduce((s, v) => s + v.longitude, 0) / withGps.length]
    : [22.5726, 88.3639];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here's what's happening with your fleet.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Fleet Selector Mock */}
            <div className="hidden md:flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:border-blue-300">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Fleet</p>
                <p className="text-sm font-bold text-slate-800">{data?.fleetName || 'My Fleet'}</p>
              </div>
              <div className="h-8 w-px bg-slate-200 mx-1"></div>
              <div className="text-left">
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</p>
                <p className="text-xs text-slate-500 font-mono">{data?.fleetRegistrationNumber || 'â€”'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Vehicles', value: data?.totalVehicles ?? 0, icon: <Truck className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100', sub: 'All vehicles in fleet' },
              { label: 'Online', value: data?.onlineVehicles ?? 0, icon: <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500"></div>, bg: 'bg-emerald-50', sub: 'Live & tracking' },
              { label: 'Offline', value: data?.offlineVehicles ?? 0, icon: <WifiOff className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-100', sub: 'No GPS signal' },
              { label: 'Risk Alerts', value: openAlerts.length, icon: <AlertTriangle className="w-5 h-5 text-red-500" />, bg: 'bg-red-100', sub: 'Action required' },
              { label: 'Active Routes', value: data?.activeRoutes ?? 0, icon: <Navigation className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-100', sub: 'Currently running' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-0.5">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-800 leading-none">{stat.value}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* LEFT: Map + Vehicle List */}
            <div className="xl:col-span-7 space-y-6">

              {/* Live Map Card */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Live Fleet Map</h2>
                    <div className="flex items-center gap-4 mt-1.5 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />Online</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />At Risk</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-400 rounded-full" />Offline</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px] relative z-0 w-full bg-slate-100">
                  {withGps.length > 0 ? (
                    <MapContainer center={mapCenter} zoom={9} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; OpenStreetMap & CartoDB'
                      />
                      {withGps.map(v => (
                        <Marker key={v.vehicleId} position={[v.latitude, v.longitude]} icon={getIcon(v.onlineStatus)}>
                          <Popup className="rounded-xl overflow-hidden">
                            <div className="text-sm p-1">
                              <p className="font-bold text-slate-800 text-base">{v.registrationNumber}</p>
                              <p className="text-slate-500 text-xs mb-2">{v.manufacturer} {v.model}</p>
                              <div className="space-y-1">
                                <p className="flex items-center justify-between gap-4"><span className="text-slate-400">Speed</span> <span className="font-semibold">{v.speed != null ? `${v.speed} km/h` : 'â€”'}</span></p>
                                {v.routeInfo && <p className="flex items-center justify-between gap-4"><span className="text-slate-400">Route</span> <span className="font-semibold text-blue-600">{v.routeInfo}</span></p>}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      {routes.map(r => {
                        const v = vehicles.find(vv => vv.vehicleId === r.vehicleId);
                        if (!v || !v.latitude || !r.currentLat) return null;
                        return <Polyline key={r.id} positions={[[v.latitude, v.longitude], [r.currentLat, r.currentLng]]} pathOptions={{ color: '#ef4444', weight: 3, dashArray: '8 6' }} />;
                      })}
                    </MapContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <MapPin className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm font-medium">No GPS data available</p>
                    </div>
                  )}

                  {/* Fullscreen overlay button */}
                  <button className="absolute bottom-6 left-6 z-[1000] bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md border border-slate-200 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    <Maximize2 className="w-4 h-4" /> View Fullscreen
                  </button>
                </div>
              </div>

              {/* Vehicle List Card */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-slate-800">Vehicle List</h2>

                  <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      {[
                        { id: 'ALL', label: `All (${vehicles.length})` },
                        { id: 'ONLINE', label: `Online (${vehicles.filter(v => v.onlineStatus === 'ONLINE').length})` },
                        { id: 'OFFLINE', label: `Offline (${vehicles.filter(v => v.onlineStatus === 'OFFLINE').length})` },
                        { id: 'AT_RISK', label: `At Risk (${vehicles.filter(v => v.onlineStatus === 'AT_RISK').length})` }
                      ].map(f => (
                        <button key={f.id} onClick={() => setVehicleFilter(f.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${vehicleFilter === f.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="Search vehicle..." value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                      <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Vehicle Number</th>
                        <th className="px-6 py-4">Make / Model</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Current Route</th>
                        <th className="px-6 py-4">Speed</th>
                        <th className="px-6 py-4">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredVehicles.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No vehicles match your criteria.</td></tr>
                      ) : filteredVehicles.map(v => (
                        <tr key={v.vehicleId} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${v.onlineStatus === 'ONLINE' ? 'bg-emerald-500' : v.onlineStatus === 'AT_RISK' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                              <span className="font-bold text-slate-800">{v.registrationNumber}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{v.manufacturer} {v.model}</td>
                          <td className="px-6 py-4">{statusBadge(v.onlineStatus)}</td>
                          <td className="px-6 py-4">
                            {v.routeInfo ? (
                              <div className="flex flex-col">
                                <span className="text-slate-800 font-medium">{v.routeInfo}</span>
                                {v.hasAlert && <span className="text-red-500 text-xs font-semibold mt-0.5 flex items-center gap-1">Route Deviation</span>}
                              </div>
                            ) : <span className="text-slate-400">â€”</span>}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700">{v.speed != null ? `${v.speed} km/h` : 'â€”'}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs">{timeAgo(v.lastUpdated)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button onClick={() => setShowNotImplemented(true)} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 w-full">
                    View All Vehicles <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar Cards */}
            <div className="xl:col-span-5 space-y-6">

              {/* Fleet Risk Radar */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800">Fleet Risk Radar</h2>
                </div>
                <div className="p-6">
                  <FleetRiskRadarChart
                    total={vehicles.length}
                    online={vehicles.filter(v => v.onlineStatus === 'ONLINE').length}
                    atRisk={vehicles.filter(v => v.onlineStatus === 'AT_RISK').length}
                    offline={vehicles.filter(v => v.onlineStatus === 'OFFLINE').length}
                  />
                </div>
              </div>

              {/* Active Alerts */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Active Alerts</h2>
                  <button onClick={() => setShowNotImplemented(true)} className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {openAlerts.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">No active alerts.</div>
                  ) : openAlerts.map(a => {
                    const style = alertTypeStyle(a.alertType);
                    return (
                      <div key={a.id} className={`p-4 rounded-xl border ${style.bg} transition-colors flex gap-3 cursor-pointer`}>
                        <div className="shrink-0 mt-0.5">{style.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-bold ${style.text}`}>{style.label}</h4>
                            <ArrowLeft className="w-4 h-4 rotate-180 text-slate-400" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 mb-0.5">{a.vehicleRegistrationNumber}</p>
                          <p className="text-xs text-slate-600 leading-relaxed mb-2">{a.message}</p>
                          <p className="text-xs font-semibold text-slate-500">{timeAgo(a.lastTriggeredAt || a.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
                </div>
                <div className="p-6 grid grid-cols-4 gap-4">
                  {[
                    { label: 'Create Route', icon: <Navigation className="w-5 h-5" />, onClick: () => setShowCreateRoute(true) },
                    { label: 'Add Vehicle', icon: <Truck className="w-5 h-5" />, onClick: () => setShowNotImplemented(true) },
                    { label: 'View Reports', icon: <BarChart3 className="w-5 h-5" />, onClick: () => setShowNotImplemented(true) },
                    { label: 'Send Alert', icon: <Bell className="w-5 h-5" />, onClick: () => setShowNotImplemented(true) },
                  ].map((action, i) => (
                    <button key={i} onClick={action.onClick} className="flex flex-col items-center justify-center gap-2 group">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all shadow-sm group-hover:shadow">
                        {action.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-600 text-center leading-tight group-hover:text-blue-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Create Route Modal */}
        {showCreateRoute && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" /> Create New Route
              </h3>
              <form onSubmit={handleCreateRoute} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vehicle Registration Number</label>
                  <input required value={routeForm.vehicleRegistrationNumber}
                    onChange={e => setRouteForm(f => ({ ...f, vehicleRegistrationNumber: e.target.value.toUpperCase() }))}
                    placeholder="e.g. WB12AB1234"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Location</label>
                    <input required value={routeForm.startLocation}
                      onChange={e => setRouteForm(f => ({ ...f, startLocation: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Destination</label>
                    <input required value={routeForm.destination}
                      onChange={e => setRouteForm(f => ({ ...f, destination: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button type="button" onClick={() => setShowCreateRoute(false)}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all shadow-sm">Cancel</button>
                  <button type="submit" disabled={routeLoading}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-70 flex justify-center items-center gap-2">
                    {routeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Monitoring'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Not Implemented Modal */}
        {showNotImplemented && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <AlertTriangle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Coming Soon</h3>
              <p className="text-slate-500 text-sm mb-6">This feature is currently under development and will be available in a future update.</p>
              <button onClick={() => setShowNotImplemented(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md">
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetDashboardPage;
