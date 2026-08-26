import React, { useState } from 'react';
import { Eye, Download, Printer, MoreVertical, SlidersHorizontal, Scale } from 'lucide-react';
import { mockChallans, challanStats } from '../../data/mockChallans';

const StatusBadge = ({ status, ...rest }) => {
  const getStyles = () => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Pending':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Paid':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Disputed':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStyles()}`} {...rest}>
      {status}
    </span>
  );
};

const ChallanTable = () => {
  const [activeTab, setActiveTab] = useState('All Challans');
  const tabs = [
    { id: 'All Challans', label: 'All Challans', count: challanStats.total },
    { id: 'Pending', label: 'Pending', count: challanStats.pendingCount },
    { id: 'Overdue', label: 'Overdue', count: challanStats.overdueCount },
    { id: 'Paid', label: 'Paid', count: challanStats.paidCount },
    { id: 'Disputed', label: 'Disputed', count: challanStats.disputedCount },
  ];

  const filteredChallans = mockChallans.filter(c => {
    if (activeTab === 'All Challans') return true;
    return c.status === activeTab;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm mt-6 flex flex-col h-[700px]">
      {/* Tabs and Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-slate-100 gap-4">
        <div className="flex space-x-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label} <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center justify-center text-slate-600 bg-white border border-slate-200 p-1.5 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left min-w-[1000px]">
          <thead className="text-xs text-slate-500 bg-slate-50/50 sticky top-0 border-b border-slate-100 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold">Challan Number</th>
              <th className="px-6 py-4 font-semibold">Violation</th>
              <th className="px-6 py-4 font-semibold flex items-center gap-1 cursor-pointer hover:text-slate-700">Date & Time <span className="text-[10px]">↓↑</span></th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Amount (₹)</th>
              <th className="px-6 py-4 font-semibold">Due Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChallans.map((challan, index) => (
              <tr key={challan.id} className={`hover:bg-slate-50/80 transition-colors ${index % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                <td className="px-6 py-4 font-semibold text-slate-700">{challan.challanNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{challan.violation}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{challan.violationDesc}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-700 font-medium">{challan.date}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{challan.time}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{challan.location}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{challan.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className={`font-medium ${challan.status === 'Overdue' ? 'text-red-600' : 'text-slate-700'}`}>{challan.dueDate}</div>
                  {challan.status === 'Overdue' && <div className="text-xs text-red-500 mt-0.5 font-medium">{challan.overdueDays} days overdue</div>}
                  {challan.status === 'Pending' && <div className="text-xs text-orange-500 mt-0.5 font-medium">Due in {challan.dueInDays} days</div>}
                  {challan.status === 'Paid' && <div className="text-xs text-emerald-500 mt-0.5 font-medium">Paid on {challan.paidOn}</div>}
                  {challan.status === 'Disputed' && <div className="text-xs text-purple-500 mt-0.5 font-medium">{challan.disputeCount} Disputed</div>}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={challan.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3 text-slate-400">
                    <button className="hover:text-blue-600" title="View Details"><Eye className="w-4 h-4" /></button>
                    {(challan.status === 'Overdue' || challan.status === 'Pending') && (
                      <button className="hover:text-emerald-600" title="Pay Now">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </button>
                    )}
                    {challan.status === 'Paid' && (
                       <button className="hover:text-blue-600 text-emerald-500" title="Receipt">
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                         </svg>
                       </button>
                    )}
                     {challan.status === 'Disputed' && (
                       <button className="hover:text-purple-600 text-orange-400" title="Dispute Status">
                         <Scale className="w-4 h-4" />
                       </button>
                    )}
                    <button className="hover:text-blue-600" title="Download PDF"><Download className="w-4 h-4" /></button>
                    <button className="hover:text-blue-600" title="Print"><Printer className="w-4 h-4" /></button>
                    <button className="hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 bg-white rounded-b-xl shrink-0">
        <div>Showing 1 to {filteredChallans.length} of {mockChallans.length} challans</div>
        <div className="flex items-center gap-2">
           <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400">&lt;</button>
           <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-medium">1</button>
           <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-600">2</button>
           <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-600">3</button>
           <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-600">&gt;</button>
        </div>
        <div className="flex items-center gap-2">
          <select className="border border-slate-200 rounded px-2 py-1 bg-white outline-none">
            <option>10 / page</option>
            <option>20 / page</option>
            <option>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChallanTable;
