import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { getMyFleets, submitFleetRegistration } from '../utils/fleetApi';

const FleetGatewayPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fleet, setFleet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFleet = async () => {
      try {
        const fleets = await getMyFleets();
        if (fleets && fleets.length > 0) {
          // Use the most recent fleet
          setFleet(fleets[0]);
        }
      } catch (err) {
        console.error('Failed to fetch fleets:', err);
      } finally {
        setLoading(false);
      }
    };
    checkFleet();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // CASE 4: Approved fleet â†’ go to dashboard
  if (fleet && fleet.status === 'APPROVED') {
    navigate(`/fleet/dashboard/${fleet.id}`, { replace: true });
    return null;
  }

  // CASE 2: Pending
  if (fleet && (fleet.status === 'PENDING' || fleet.status === 'UNDER_REVIEW')) {
    return <FleetPendingView fleet={fleet} />;
  }

  // CASE 3: Rejected
  if (fleet && fleet.status === 'REJECTED') {
    return <FleetRejectedView fleet={fleet} />;
  }

  // CASE 1: No fleet
  return <NoFleetView />;
};

const NoFleetView = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <Link to="/dashboard" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </Link>
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-sm">
          <Truck className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Fleet Management</h1>
        <p className="text-slate-600 text-lg mb-2">You don't have a registered fleet yet.</p>
        <p className="text-slate-500 text-sm mb-10">
          Register your fleet to track vehicles in real-time, monitor routes, and receive alerts.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Live GPS Tracking', icon: 'ðŸ›°ï¸' },
            { label: 'Route Monitoring', icon: 'ðŸ—ºï¸' },
            { label: 'Instant Alerts', icon: 'ðŸ””' },
          ].map((f) => (
            <div key={f.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-xs text-slate-600 font-semibold">{f.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/fleet/register')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-lg"
        >
          <Truck className="w-5 h-5" />
          Start Fleet Registration
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const FleetPendingView = ({ fleet }) => {
  const steps = [
    { label: 'Application Submitted', done: true },
    { label: 'Document Verification', done: fleet.status === 'UNDER_REVIEW', active: fleet.status === 'UNDER_REVIEW' },
    { label: 'Authority Approval', done: false },
    { label: 'Fleet Approved', done: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <Link to="/dashboard" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </Link>
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-100 shadow-sm">
          <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Fleet Registration Under Review</h1>
        <p className="text-slate-600 mb-2">Your application for <span className="font-semibold text-slate-900">{fleet.fleetName || 'your fleet'}</span> is being processed.</p>
        <p className="text-slate-500 text-sm mb-10">This typically takes 1â€“3 business days.</p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 text-left shadow-sm">
          <h3 className="text-slate-800 font-bold mb-5 text-sm uppercase tracking-wider">Application Timeline</h3>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  step.done ? 'bg-emerald-500 border-emerald-500' :
                  step.active ? 'border-amber-400 bg-amber-50 animate-pulse' :
                  'border-slate-300 bg-slate-100'
                }`}>
                  {step.done ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                   step.active ? <Clock className="w-3 h-3 text-amber-500" /> :
                   <span className="w-2 h-2 bg-slate-300 rounded-full" />}
                </div>
                <span className={`text-sm font-semibold ${step.done ? 'text-emerald-600' : step.active ? 'text-amber-600' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => window.location.reload()}
          className="flex items-center justify-center w-full gap-2 bg-white border border-slate-200 shadow-sm py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-semibold">
          <RefreshCw className="w-4 h-4" /> Refresh Status
        </button>
      </div>
    </div>
  );
};

const FleetRejectedView = ({ fleet }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <Link to="/dashboard" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </Link>
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-100 shadow-sm">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Fleet Registration Rejected</h1>
        <p className="text-slate-600 mb-6">Your fleet registration application was not approved.</p>

        {fleet.rejectionReason && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-left shadow-sm">
            <p className="text-red-800 text-sm font-bold mb-1">Reason for Rejection:</p>
            <p className="text-red-600 text-sm">{fleet.rejectionReason}</p>
          </div>
        )}

        <button onClick={() => navigate('/fleet/register')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
          <Truck className="w-5 h-5" /> Reapply for Fleet Registration
        </button>
      </div>
    </div>
  );
};

export default FleetGatewayPage;
