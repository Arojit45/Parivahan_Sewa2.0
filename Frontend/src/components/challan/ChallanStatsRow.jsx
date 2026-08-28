import React from 'react';
import { FileText, Wallet, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';
import { useLanguage } from '../../contexts/LanguageContext';

const ChallanStatsRow = () => {
  const { stats, loading } = useChallan();
  const { t } = useLanguage();
  const c = t.challan || {};

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm h-32 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Total Challans */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[13px] font-bold text-slate-500 tracking-wide uppercase">{c.totalChallans || 'Total Challans'}</span>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{stats.total}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">{c.allTime || 'All time'}</p>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[13px] font-bold text-orange-500 tracking-wide uppercase">{c.pendingAmount || 'Pending Amount'}</span>
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-orange-500">â‚¹ {stats.pendingAmount.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">{c.toBePaid || 'To be paid'}</p>
        </div>
      </div>

      {/* Overdue Challans */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[13px] font-bold text-red-500 tracking-wide uppercase">{c.overdueChallans || 'Overdue Challans'}</span>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-red-500">{String(stats.overdueCount).padStart(2, '0')}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total â‚¹ {stats.overdueAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Paid Challans */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[13px] font-bold text-emerald-600 tracking-wide uppercase">{c.paidChallans || 'Paid Challans'}</span>
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-emerald-600">{String(stats.paidCount).padStart(2, '0')}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total â‚¹ {stats.paidAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default ChallanStatsRow;
