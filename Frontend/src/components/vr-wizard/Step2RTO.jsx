import React, { useState } from 'react';
import { Search, Building2, ChevronRight } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';
import { RTOS_BY_STATE } from '../../data/indiaData';
import WizardNav from './WizardNav';

const Step2RTO = () => {
  const { wizard, updateFields, saveAndNext } = useVRWizard();
  const [query, setQuery] = useState('');

  // FILTER RTOs based on the selected state code
  const stateRtos = RTOS_BY_STATE[wizard.stateCode] || [];

  const filtered = query.trim()
    ? stateRtos.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) || 
        r.code.toLowerCase().includes(query.toLowerCase())
      )
    : stateRtos;

  const handleSelect = (r) => {
    updateFields({ rtoCode: r.code, rtoName: r.name });
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
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 2 of 8</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Select your RTO</h2>
        <p className="text-slate-500 text-sm font-medium">Choose the Regional Transport Office in <span className="font-bold text-slate-700">{wizard.state}</span>.</p>
      </div>

      {/* Search */}
      <div className="px-8 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search RTO by name or code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Selected RTO banner */}
      {wizard.rtoCode && (
        <div className="mx-8 mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-sm font-semibold text-blue-700">Selected: <span className="font-bold">{wizard.rtoName}</span></span>
          <span className="ml-auto text-xs text-blue-500 font-medium bg-blue-100 px-2 py-0.5 rounded-full">{wizard.rtoCode}</span>
        </div>
      )}

      {/* RTO grid */}
      <div className="flex-1 overflow-y-auto px-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(r => {
            const isSelected = wizard.rtoCode === r.code;
            return (
              <button
                key={r.code}
                onClick={() => handleSelect(r)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{r.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{r.code}</p>
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
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No RTOs found for "{query}"</p>
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={!wizard.rtoCode} />
    </div>
  );
};

export default Step2RTO;
