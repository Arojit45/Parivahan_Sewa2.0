import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, FileText, CheckCircle2, Clock, ChevronRight, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';


const StatusBadge = ({ status }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;
  
  if (['APPROVED', 'PASS', 'COMPLETED', 'DL_DISPATCHED'].includes(status)) {
    color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  } else if (['REJECTED', 'FAIL'].includes(status)) {
    color = 'bg-red-50 text-red-700 border-red-200';
    Icon = XCircle;
  } else if (['UNDER_REVIEW', 'DOCUMENTS_VERIFIED', 'INSPECTION_PENDING', 'TEST_SCHEDULED'].includes(status)) {
    color = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (status === 'SUBMITTED') {
    color = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};

const TrackReviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [vrApps, setVrApps] = useState([]);
  const [dlApps, setDlApps] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const [vrRes, dlRes] = await Promise.all([
          fetch('https://parivahan-sewa2-0-backend.onrender.com/api/v1/vr/application/mine', { headers }),
          fetch('https://parivahan-sewa2-0-backend.onrender.com/api/v1/dl/application/mine', { headers })
        ]);
        
        if (vrRes.ok) setVrApps(await vrRes.json());
        if (dlRes.ok) setDlApps(await dlRes.json());
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleReportMistake = (type, id) => {
    navigate(`/corrections?targetType=${type}&targetId=${id}`);
  };

  const ApplicationCard = ({ app, type }) => {
    const isVr = type === 'VEHICLE_REGISTRATION_APPLICATION';
    const title = isVr ? 'Vehicle Registration' : 'Driving License';
    const status = app.applicationStatus;
    
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isVr ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm font-medium text-slate-500">App No: <span className="text-slate-800">{app.applicationNumber || 'Draft'}</span></p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
          {isVr ? (
            <>
              <div><span className="text-slate-500 block">Vehicle Category</span><span className="font-semibold text-slate-900">{app.vehicleCategory || '-'}</span></div>
              <div><span className="text-slate-500 block">Vehicle Type</span><span className="font-semibold text-slate-900">{app.vehicleType || '-'}</span></div>
              <div><span className="text-slate-500 block">RTO</span><span className="font-semibold text-slate-900">{app.rtoName || '-'}</span></div>
              <div><span className="text-slate-500 block">Inspection Date</span><span className="font-semibold text-slate-900">{app.appointmentDate || '-'}</span></div>
            </>
          ) : (
            <>
              <div><span className="text-slate-500 block">Applicant Name</span><span className="font-semibold text-slate-900">{app.applicantName || '-'}</span></div>
              <div><span className="text-slate-500 block">Vehicle Class</span><span className="font-semibold text-slate-900">{app.vehicleClass || '-'}</span></div>
              <div><span className="text-slate-500 block">RTO</span><span className="font-semibold text-slate-900">{app.rtoName || '-'}</span></div>
              <div><span className="text-slate-500 block">Test Result</span><span className="font-semibold text-slate-900">{app.testResult || '-'}</span></div>
            </>
          )}
        </div>

        {status !== 'DRAFT' && (
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button 
              onClick={() => handleReportMistake(type, app.id)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              I Found a Mistake
            </button>
          </div>
        )}
      </div>
    );
  };

  const allApps = [...vrApps, ...dlApps];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Track & Review Applications</h1>
              <p className="text-slate-500 font-medium">Monitor the status of your submitted applications and request corrections if needed.</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4">
                <AlertCircle className="w-8 h-8" />
                <p className="font-semibold">{error}</p>
              </div>
            ) : allApps.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Applications Found</h3>
                <p className="text-slate-500 text-sm">You haven't submitted any Vehicle Registration or Driving License applications yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {vrApps.map(app => (
                  <ApplicationCard key={`vr-${app.id}`} app={app} type="VEHICLE_REGISTRATION_APPLICATION" />
                ))}
                {dlApps.map(app => (
                  <ApplicationCard key={`dl-${app.id}`} app={app} type="DRIVING_LICENSE_APPLICATION" />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrackReviewPage;
