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
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[14px] font-bold text-[#1e293b]">Recent Timeline</h2>
        <button className="text-[12px] font-bold text-blue-600 hover:underline">View All</button>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-3 space-y-4 flex-1 mt-1">
        {events.map((event, idx) => (
          <div key={idx} className="relative pl-6">
            <span className={`absolute -left-[13px] -top-0.5 w-6 h-6 rounded-lg border flex items-center justify-center ${event.color}`}>
              {React.cloneElement(event.icon, { className: 'w-3.5 h-3.5 ' + event.icon.props.className.replace('w-4 h-4 ', '') })}
            </span>
            <div className="-mt-1">
              <h4 className="text-[12px] font-bold text-slate-900 leading-tight">{event.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
