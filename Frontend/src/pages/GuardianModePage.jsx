import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { ArrowLeft, ArrowRight, Shield, MapPin, Target, Bell, Moon, Crosshair, AlertTriangle, History, Home, CheckSquare, ChevronRight } from 'lucide-react';
import CarModelViewer from '../components/CarModelViewer';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

// Custom icon for car marker
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const GuardianModePage = () => {
  const position = [22.5726, 88.3639];
  const safeZoneRadius = 5000; // 5km in meters
  // Slightly offset position for the car to simulate it being outside the zone
  const carPosition = [22.5850, 88.4250];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">

            {/* Left Content (Main) */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              {/* Back Button */}
              <div>
                <Link to="/dashboard" className="inline-flex items-center text-blue-600 font-medium text-xs hover:text-blue-700 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back to My Vehicles
                </Link>
              </div>

              {/* Header Block */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center relative shrink-0">
                    <div className="absolute inset-0 w-[150%] h-[150%] -left-1/4 -top-1/4">
                      <CarModelViewer />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Hyundai Creta</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-slate-900 text-base tracking-wide">WB12AB1234</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">Active</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Petrol • 2022 • LMV (Non-Transport)</p>
                  </div>
                </div>
                <button className="text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                  Change Vehicle
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>

              {/* Title & Toggle */}
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
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
                  <div className="text-right">
                    <div className="font-semibold text-emerald-600 leading-tight text-xs">ON</div>
                    <div className="text-[9px] font-medium text-emerald-500">Your vehicle is protected</div>
                  </div>
                  <div className="w-12 h-7 bg-emerald-500 rounded-full p-1 cursor-pointer transition-colors relative flex items-center justify-end shadow-inner">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Safe Location (Home)</div>
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="font-medium text-xs text-slate-800 mb-0.5">Salt Lake, Sector V</div>
                  <div className="text-[10px] text-slate-500 mb-3">Kolkata, West Bengal</div>
                  <button className="mt-auto w-full border border-blue-200 text-blue-600 hover:bg-blue-50 py-1 rounded-lg text-[10px] font-semibold transition-colors">Change Location</button>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Safe Zone Radius</div>
                  <div className="flex items-center justify-center gap-1.5 mb-1.5 w-full">
                    <div className="w-6 h-6 text-blue-400 shrink-0 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 font-semibold text-sm text-slate-800 flex items-center justify-between flex-1">
                      5 km
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 mb-3">Recommended: 2 - 10 km</div>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Alert Preference</div>
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="font-medium text-xs text-slate-800 mb-0.5">Instant Alerts</div>
                  <div className="text-[10px] text-slate-500 mb-3">Push • SMS • Email</div>
                  <button className="mt-auto w-full border border-blue-200 text-blue-600 hover:bg-blue-50 py-1 rounded-lg text-[10px] font-semibold transition-colors">Manage Alerts</button>
                </div>

                {/* Card 4 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Quiet Hours</div>
                  <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-1.5">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="font-medium text-xs text-slate-800 mb-0.5">10:00 PM - 6:00 AM</div>
                  <div className="text-[10px] text-slate-500 mb-3">No alerts during this time</div>
                  <button className="mt-auto w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-1 rounded-lg text-[10px] font-semibold transition-colors">Edit</button>
                </div>
              </div>

              {/* Live Map Area */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative h-[350px] z-0">

                <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Circle center={position} radius={safeZoneRadius} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, dashArray: '4, 8' }} />
                  <Marker position={carPosition} icon={carIcon} />

                  {/* Custom home icon marker in center */}
                  <Marker position={position} icon={new L.DivIcon({
                    html: `<div style="background-color:#10b981;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })} />
                </MapContainer>

                {/* Map Controls Overlays */}
                <div className="absolute top-4 left-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer z-[400]">
                  Live Map
                  <svg className="w-3.5 h-3.5 text-slate-400 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                <div className="absolute top-4 right-4 bg-red-50 text-red-600 border border-red-200 rounded-lg shadow-sm flex items-center px-2.5 py-1.5 text-xs font-semibold gap-1.5 z-[400]">
                  <AlertTriangle className="w-3.5 h-3.5" /> Breach Detected
                </div>

                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden z-[400]">
                  <button className="p-1.5 text-slate-600 hover:bg-slate-50 border-b border-slate-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                  <button className="p-1.5 text-slate-600 hover:bg-slate-50 border-b border-slate-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg></button>
                  <button className="p-1.5 text-slate-600 hover:bg-slate-50"><Crosshair className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-slate-800 text-sm">Recent Guardian Events</h3>
                  <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">View All Events</a>
                </div>

                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[5px] top-1 bottom-1 w-0.5 bg-slate-100"></div>

                  <div className="space-y-4">
                    {/* Event 1 */}
                    <div className="flex gap-3 relative">
                      <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm mt-2.5 shrink-0 relative z-10"></div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 -my-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="text-[10px] font-medium text-slate-500 w-12 pt-1">10:18 AM<br /><span className="text-slate-400">Today</span></div>
                          <div className="w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle className="w-3 h-3" />
                          </div>
                          <div className="pt-0.5">
                            <div className="font-semibold text-slate-800 text-xs">Geofence Breach Detected</div>
                            <div className="text-[10px] text-slate-500">Vehicle moved outside the safe zone (5 km)</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:ml-auto">
                          <span className="text-[10px] font-semibold text-red-600">Outside Zone</span>
                          <button className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors">View on Map</button>
                        </div>
                      </div>
                    </div>

                    {/* Event 2 */}
                    <div className="flex gap-3 relative">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm mt-2.5 shrink-0 relative z-10"></div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 -my-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="text-[10px] font-medium text-slate-500 w-12 pt-1">09:32 AM<br /><span className="text-slate-400">Today</span></div>
                          <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <div className="pt-0.5">
                            <div className="font-semibold text-slate-800 text-xs">Entered Safe Zone</div>
                            <div className="text-[10px] text-slate-500">Vehicle entered the safe zone</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:ml-auto">
                          <span className="text-[10px] font-semibold text-emerald-600 mr-[84px]">Inside Zone</span>
                        </div>
                      </div>
                    </div>

                    {/* Event 3 */}
                    <div className="flex gap-3 relative">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm mt-2.5 shrink-0 relative z-10"></div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 -my-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="text-[10px] font-medium text-slate-500 w-12 pt-1">Yesterday<br /><span className="text-slate-400">07:45 PM</span></div>
                          <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <div className="pt-0.5">
                            <div className="font-semibold text-slate-800 text-xs">Entered Safe Zone</div>
                            <div className="text-[10px] text-slate-500">Vehicle entered the safe zone</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:ml-auto">
                          <span className="text-[10px] font-semibold text-emerald-600 mr-[84px]">Inside Zone</span>
                        </div>
                      </div>
                    </div>

                    {/* Event 4 */}
                    <div className="flex gap-3 relative">
                      <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm mt-2.5 shrink-0 relative z-10"></div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 -my-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="text-[10px] font-medium text-slate-500 w-12 pt-1">Yesterday<br /><span className="text-slate-400">06:20 PM</span></div>
                          <div className="w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle className="w-3 h-3" />
                          </div>
                          <div className="pt-0.5">
                            <div className="font-semibold text-slate-800 text-xs">Geofence Breach Detected</div>
                            <div className="text-[10px] text-slate-500">Vehicle moved outside the safe zone (5 km)</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:ml-auto">
                          <span className="text-[10px] font-semibold text-red-600 mr-[84px]">Outside Zone</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (Widgets) */}
            <div className="w-full xl:w-[320px] 2xl:w-[350px] flex flex-col gap-6 shrink-0 mt-6 xl:mt-10">

              {/* Location Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800 text-xs">Last Known Location</h3>
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Live</span>
                </div>
                <div className="flex gap-2.5 mb-3">
                  <div className="w-7 h-7 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Salt Lake, Sector V</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Kolkata, West Bengal</div>
                  </div>
                </div>
                <div className="flex gap-2.5 mb-5">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-[10px] font-medium text-slate-600 flex items-center h-7">
                    Today, 10:24 AM
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Speed</div>
                    <div className="font-semibold text-slate-800 text-xs">28 km/h</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Heading</div>
                    <div className="font-semibold text-slate-800 text-xs">NE</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Accuracy</div>
                    <div className="font-semibold text-slate-800 text-xs">± 10 m</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Status</div>
                    <div className="font-semibold text-emerald-600 text-xs">Moving</div>
                  </div>
                </div>

                <button className="w-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                  View Live Tracking <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Breach Alert Card */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-red-700 text-xs">Geofence Breach Alert</h3>
                  <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md">Outside Safe Zone</span>
                </div>
                <p className="text-[10px] text-red-600/80 font-medium mb-3">Your vehicle has moved outside the safe zone.</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-[9px] font-semibold text-red-500/70 mb-0.5">Outside Since</div>
                    <div className="text-[10px] font-semibold text-red-800">10:18 AM, Today</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold text-red-500/70 mb-0.5">Distance from Safe Zone</div>
                    <div className="text-[10px] font-semibold text-red-800">6.4 km</div>
                  </div>
                </div>

                <button className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-red-500/10">
                  <MapPin className="w-3.5 h-3.5" /> View on Map
                </button>
              </div>

              {/* How it Works Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 text-xs mb-4">How Guardian Mode Works</h3>

                <div className="space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Home className="w-2.5 h-2.5" /></div>
                    <div className="text-[10px] text-slate-600 font-medium">Set your safe location (home/work).</div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Target className="w-2.5 h-2.5" /></div>
                    <div className="text-[10px] text-slate-600 font-medium">Choose a radius for the safe zone.</div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Bell className="w-2.5 h-2.5" /></div>
                    <div className="text-[10px] text-slate-600 font-medium">Get instant alert if vehicle exits the zone.</div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><MapPin className="w-2.5 h-2.5" /></div>
                    <div className="text-[10px] text-slate-600 font-medium">Track the vehicle on live map.</div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckSquare className="w-2.5 h-2.5" /></div>
                    <div className="text-[10px] text-slate-600 font-medium">Check event in timeline.</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <a href="#" className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">Learn more <ChevronRight className="w-3 h-3" /></a>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default GuardianModePage;
