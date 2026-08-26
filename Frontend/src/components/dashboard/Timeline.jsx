import React from 'react';
import { CheckCircle, ShieldCheck, UserCheck, FileText, File } from 'lucide-react';

const Timeline = () => {
  const events = [
    {
      title: 'PUC Certificate Updated',
      date: '26 May 2025 • 10:20 AM',
      icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      color: 'bg-emerald-50/50 border-emerald-100'
    },
    {
      title: 'Insurance Renewed',
      date: '25 Dec 2024 • 09:15 AM',
      icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
      color: 'bg-blue-50/50 border-blue-100'
    },
    {
      title: 'Road Tax Paid',
      date: '31 Mar 2025 • 11:40 AM',
      icon: <UserCheck className="w-4 h-4 text-emerald-500" />,
      color: 'bg-emerald-50/50 border-emerald-100'
    },
    {
      title: 'Vehicle Registered',
      date: '11 Sep 2022 • 10:30 AM',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      color: 'bg-blue-50/50 border-blue-100'
    },
    {
      title: 'RC Issued',
      date: '11 Sep 2022 • 04:25 PM',
      icon: <File className="w-4 h-4 text-blue-500" />,
      color: 'bg-blue-50/50 border-blue-100'
    }
  ];

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[15px] font-bold text-[#1e293b]">Recent Timeline</h2>
        <button className="text-[13px] font-bold text-blue-600 hover:underline">View All</button>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-3.5 space-y-5 flex-1 mt-2">
        {events.map((event, idx) => (
          <div key={idx} className="relative pl-8">
            <span className={`absolute -left-[15px] -top-1 w-7 h-7 rounded-lg border flex items-center justify-center ${event.color}`}>
              {event.icon}
            </span>
            <div className="-mt-0.5">
              <h4 className="text-[13px] font-bold text-slate-900">{event.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
