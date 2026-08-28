import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Search, Star, Building2, Phone, Check } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';
import { REQUIRED_DOCUMENTS } from '../../data/indiaData';
import WizardNav from './WizardNav';

const Step6Documents = () => {
  const { wizard, updateFields, saveAndNext } = useDLWizard();
  const [checkedDocs, setCheckedDocs] = useState({});
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [schoolQuery, setSchoolQuery] = useState('');

  const requiredDocs = REQUIRED_DOCUMENTS.filter(d => d.required);
  const allRequiredChecked = requiredDocs.every(d => checkedDocs[d.id]);

  const toggleDoc = (id) => {
    setCheckedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Load driving schools for the selected state
  useEffect(() => {
    if (!wizard.state) return;
    setLoadingSchools(true);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    fetch(`https://parivahan-sewa2-0-backend.onrender.com/api/v1/dl/schools?state=${encodeURIComponent(wizard.state)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setSchools(data); setLoadingSchools(false); })
      .catch(() => { setSchools([]); setLoadingSchools(false); });
  }, [wizard.state]);

  const filteredSchools = schoolQuery
    ? schools.filter(s => s.name.toLowerCase().includes(schoolQuery.toLowerCase()) || s.city.toLowerCase().includes(schoolQuery.toLowerCase()))
    : schools;

  const handleNext = () => {
    if (!allRequiredChecked) return;
    saveAndNext({
      documentsConfirmed: true,
      selectedDrivingSchoolId: wizard.selectedDrivingSchoolId,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">6</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 6 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Here's exactly what you need.</h2>
        <p className="text-slate-500 text-sm font-medium">Check off each document you have ready. Optionally, enroll at a registered driving school.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-6">
        {/* Documents checklist */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h4 className="font-bold text-slate-900 text-sm mb-4">Required Documents</h4>
          <div className="space-y-3">
            {REQUIRED_DOCUMENTS.map(doc => {
              const isChecked = !!checkedDocs[doc.id];
              return (
                <button
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all
                    ${isChecked ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  {isChecked
                    ? <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    : <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  }
                  <span className={`text-sm font-medium ${isChecked ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
                    {doc.label}
                  </span>
                  {doc.required && (
                    <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded shrink-0">Required</span>
                  )}
                </button>
              );
            })}
          </div>

          {allRequiredChecked && (
            <div className="mt-4 flex items-center gap-2 text-emerald-700 text-sm font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <Check className="w-4 h-4 shrink-0" />
              All required documents confirmed!
            </div>
          )}
        </div>

        {/* Driving School Search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Find a Registered Driving School</h4>
          <p className="text-xs text-slate-500 font-medium mb-4">Optional â€” but highly recommended for first-time applicants.</p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by school name or city..."
              value={schoolQuery}
              onChange={e => setSchoolQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          {loadingSchools ? (
            <div className="text-center py-6 text-slate-400 text-sm">Loading driving schools...</div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No schools found for {wizard.state}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredSchools.map(school => {
                const isSelected = wizard.selectedDrivingSchoolId === school.id;
                return (
                  <button
                    key={school.id}
                    onClick={() => updateFields({
                      selectedDrivingSchoolId: isSelected ? null : school.id,
                      selectedDrivingSchoolName: isSelected ? null : school.name,
                    })}
                    className={`w-full flex items-start justify-between gap-3 p-3 rounded-xl border text-left transition-all
                      ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{school.name}</p>
                        {school.isGovernmentApproved && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Govt Approved</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{school.city} â€” {school.address}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {school.rating && (
                          <span className="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                            <Star className="w-3 h-3" /> {school.rating}
                          </span>
                        )}
                        {school.phone && (
                          <span className="flex items-center gap-1 text-slate-500 text-[10px] font-medium">
                            <Phone className="w-3 h-3" /> {school.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-blue-600 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <WizardNav onNext={handleNext} disabledNext={!allRequiredChecked} />
    </div>
  );
};

export default Step6Documents;
