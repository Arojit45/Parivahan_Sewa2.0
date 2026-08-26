import React, { useState, useMemo } from 'react';
import { Search, Building2, ChevronRight } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';
import { RTOS_BY_STATE } from '../../data/indiaData';
import WizardNav from './WizardNav';

const Step2RTO = () => {
  const { wizard, updateFields, saveAndNext } = useDLWizard();
  const [query, setQuery] = useState('');

  // Only show RTOs for the selected state
  const stateRTOs = useMemo(() => {
    if (!wizard.stateCode) return [];
    return RTOS_BY_STATE[wizard.stateCode] || [];
  }, [wizard.stateCode]);

  const filtered = query.trim()
    ? stateRTOs.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.code.toLowerCase().includes(query.toLowerCase())
      )
    : stateRTOs;

  const handleSelect = (rto) => {
    updateFields({ rtoCode: rto.code, rtoName: rto.name });
  };

  const handleNext = () => {
    if (!wizard.rtoCode) return;
    saveAndNext({ rtoCode: wizard.rtoCode, rtoName: wizard.rtoName });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">2</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 2 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Which RTO?</h2>
        <p className="text-slate-500 text-sm font-medium">
          Showing RTOs in <span className="text-blue-600 font-bold">{wizard.state}</span>. Select the Regional Transport Office near you.
        </p>
      </div>

      {/* Search */}
      <div className="px-8 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by RTO name or code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* RTO list */}
      <div className="flex-1 overflow-y-auto px-8 pb-4">
        {stateRTOs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No RTOs found for this state.</p>
            <p className="text-xs mt-1">Please go back and select a different state.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(rto => {
              const isSelected = wizard.rtoCode === rto.code;
              return (
                <button
                  key={rto.code}
                  onClick={() => handleSelect(rto)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                      ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <Building2 className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{rto.name}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{rto.code}</p>
                    </div>
                  </div>
                  {isSelected
                    ? <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    : <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  }
                </button>
              );
            })}
            {filtered.length === 0 && query && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm font-medium">No RTOs match "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={!wizard.rtoCode} />
    </div>
  );
};

export default Step2RTO;
