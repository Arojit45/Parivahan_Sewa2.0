import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';
import WizardNav from './WizardNav';

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 2); // Start from day after tomorrow
  // Skip weekends
  if (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 2);
  }
  return d.toISOString().split('T')[0];
});

const SLOTS = ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:30 AM - 12:30 PM', '02:00 PM - 03:00 PM', '03:30 PM - 04:30 PM'];

const Step6Appointment = () => {
  const { wizard, updateFields, saveAndNext } = useVRWizard();
  const { appointmentDate, appointmentSlot } = wizard;

  const handleNext = () => {
    saveAndNext({ appointmentDate, appointmentSlot });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">6</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 6 of 8</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Book RTO Inspection</h2>
        <p className="text-slate-500 text-sm font-medium">Select a date and time for physical verification of your vehicle at the RTO.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-4 space-y-6">
        
        {/* Date Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            Available Dates
          </label>
          <div className="flex flex-wrap gap-2">
            {DATES.map(date => {
              const isSelected = appointmentDate === date;
              return (
                <button
                  key={date}
                  onClick={() => updateFields({ appointmentDate: date, appointmentSlot: null })} // Reset slot on date change
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 bg-white'
                  }`}
                >
                  {formatDate(date)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slot Selection */}
        <div className={`space-y-3 transition-opacity duration-300 ${appointmentDate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Time Slots
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SLOTS.map(slot => {
              const isSelected = appointmentSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => updateFields({ appointmentSlot: slot })}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <WizardNav onNext={handleNext} disabledNext={!appointmentDate || !appointmentSlot} />
    </div>
  );
};

export default Step6Appointment;
