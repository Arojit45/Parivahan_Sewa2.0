import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const DocumentCard = ({ title, status, validTill, type, idNumber, Icon }) => {
  const { t } = useLanguage();
  const isExpired = validTill && new Date(validTill) < new Date();
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
      <div className="flex justify-between items-start mb-4 relative">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          {isExpired ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full uppercase tracking-wider">
              {t.myDocsPage.expired}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" /> {t.myDocsPage.active}
            </span>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm font-medium text-slate-500 mb-4">{idNumber || 'N/A'}</p>
      
      <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
        <span className="text-slate-500">{t.myDocsPage.validTill}</span>
        <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-slate-800'}`}>
          {validTill ? new Date(validTill).toLocaleDateString('en-IN') : t.myDocsPage.lifetime}
        </span>
      </div>
    </div>
  );
};

const MyDocumentsPage = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const res = await fetch('https://parivahan-sewa2-0-backend.onrender.com/api/v1/documents/mine', {
          headers
        });
        if (!res.ok) throw new Error('Failed to fetch documents');
        const json = await res.json();
        setData(json);
        if (json.vehicles && json.vehicles.length > 0) {
          setSelectedVehicleId(json.vehicles[0].id);
        }
      } catch (err) {
        setError('Unable to load documents at this time.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const selectedVehicle = data?.vehicles?.find(v => v.id === selectedVehicleId);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.myDocsPage.title}</h1>
              <p className="text-slate-500 font-medium">{t.myDocsPage.subtitle}</p>
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
            ) : (
              <div className="space-y-10">
                
                {/* Personal Documents (DL) */}
                <section>
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </span>
                    {t.myDocsPage.personalDocs}
                  </h2>
                  
                  {data.drivingLicense ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DocumentCard 
                        title={t.myDocsPage.drivingLicense}
                        idNumber={data.drivingLicense.applicationNumber}
                        validTill={null} // Usually lifetime or 20 years, we don't have this field in DL mock
                        type="DL"
                        Icon={CreditCard}
                      />
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 text-center max-w-2xl">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{t.myDocsPage.noDlFound}</h3>
                      <p className="text-slate-500 text-sm mb-6">{t.myDocsPage.noDlDesc}</p>
                      <Link to="/driving-license" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        {t.myDocsPage.applyDl}
                      </Link>
                    </div>
                  )}
                </section>

                {/* Vehicle Documents */}
                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </span>
                      {t.myDocsPage.vehicleDocs}
                    </h2>
                    
                    {data.vehicles?.length > 0 && (
                      <select 
                        className="bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        value={selectedVehicleId || ''}
                        onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                      >
                        {data.vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.registrationNumber} ({v.nickname || v.model})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedVehicle ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DocumentCard 
                        title={t.myDocsPage.rc}
                        idNumber={selectedVehicle.registrationNumber}
                        validTill={null} // Lifetime for private, 15 years usually
                        Icon={FileText}
                      />
                      <DocumentCard 
                        title={t.myDocsPage.insurance}
                        idNumber={selectedVehicle.insuranceProvider}
                        validTill={selectedVehicle.insuranceValidTill}
                        Icon={FileText}
                      />
                      <DocumentCard 
                        title={t.myDocsPage.puc}
                        idNumber={`PUC-${selectedVehicle.registrationNumber}`}
                        validTill={selectedVehicle.pucValidTill}
                        Icon={FileText}
                      />
                      {selectedVehicle.taxValidTill && (
                         <DocumentCard 
                           title={t.myDocsPage.roadTax}
                           idNumber={`TAX-${selectedVehicle.registrationNumber}`}
                           validTill={selectedVehicle.taxValidTill}
                           Icon={FileText}
                         />
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 text-center max-w-2xl">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{t.myDocsPage.noVehiclesFound}</h3>
                      <p className="text-slate-500 text-sm mb-6">{t.myDocsPage.noVehiclesDesc}</p>
                      <Link to="/register-vehicle" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        {t.myDocsPage.registerVehicle}
                      </Link>
                    </div>
                  )}
                </section>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyDocumentsPage;
