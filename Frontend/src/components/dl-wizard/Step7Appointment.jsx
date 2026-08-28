import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';
import { APPOINTMENT_SLOTS } from '../../data/indiaData';
import WizardNav from './WizardNav';

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year, month) => new Date(year, month, 1).getDay();

const Step7Appointment = () => {
  const { wizard, updateFields, saveAndNext } = useDLWizard();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isDateDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // Disable past dates, today, and Sundays
    return d < tomorrow || d.getDay() === 0;
  };

  const selectedDate = wizard.appointmentDate ? new Date(wizard.appointmentDate) : null;

  const handleDateSelect = (day) => {
    if (isDateDisabled(day)) return;
    const d = new Date(viewYear, viewMonth, day);
    const dateStr = d.toISOString().split('T')[0];
    updateFields({ appointmentDate: dateStr });
  };

  const handleNext = () => {
    if (!wizard.appointmentDate || !wizard.appointmentSlot) return;
    saveAndNext({ appointmentDate: wizard.appointmentDate, appointmentSlot: wizard.appointmentSlot });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">7</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 7 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Book your appointment.</h2>
        <p className="text-slate-500 text-sm font-medium">Select a convenient date and time slot for your driving test at {wizard.rtoName || 'your RTO'}.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-sm font-bold text-slate-800">{MONTHS[viewMonth]} {viewYear}</span>
              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} />)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const disabled = isDateDisabled(day);
                const d = new Date(viewYear, viewMonth, day);
                const dateStr = d.toISOString().split('T')[0];
                const isSelected = wizard.appointmentDate === dateStr;
                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    disabled={disabled}
                    className={`aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all
                      ${isSelected ? 'bg-blue-600 text-white shadow-md' :
                        disabled ? 'text-slate-200 cursor-not-allowed' :
                        'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-4 text-[10px] font-semibold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded-sm inline-block" /> Selected</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-100 rounded-sm inline-block" /> Unavailable</span>
            </div>
          </div>

          {/* Time Slots */}
          <div className="w-full lg:w-60 bg-white border border-slate-200 rounded-2xl p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Select Time Slot
            </h4>

            {!wizard.appointmentDate ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">Select a date first</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {APPOINTMENT_SLOTS.map(slot => {
                  const isSelected = wizard.appointmentSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => updateFields({ appointmentSlot: slot })}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all
                        ${isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected summary */}
        {wizard.appointmentDate && wizard.appointmentSlot && (
          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">Appointment Confirmed</p>
              <p className="text-xs text-blue-700 font-medium mt-0.5">
                📅 {new Date(wizard.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ⏰ {wizard.appointmentSlot}
              </p>
              <p className="text-xs text-blue-600 mt-1">📍 {wizard.rtoName}</p>
            </div>
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={!wizard.appointmentDate || !wizard.appointmentSlot} />
    </div>
  );
};

export default Step7Appointment;
