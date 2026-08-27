import React from 'react';
import { useChallan } from '../../contexts/ChallanContext';

const ChallanSummaryWidget = () => {
  const { stats } = useChallan();

  // SVG Donut Chart constants
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const data = [
    { label: 'Overdue', value: stats.overdueCount, color: '#ef4444' }, // red-500
    { label: 'Pending', value: stats.pendingCount - stats.overdueCount, color: '#f97316' }, // orange-500
    { label: 'Paid', value: stats.paidCount, color: '#10b981' },    // emerald-500
    { label: 'Disputed', value: stats.disputedCount, color: '#8b5cf6' } // violet-500
  ].filter(d => d.value > 0); // Hide empty segments

  let currentOffset = 0;
  const segments = data.map(item => {
    const percentage = stats.total > 0 ? (item.value / stats.total) : 0;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += percentage * circumference;
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Challan Summary</h3>
      
      <div className="flex items-center justify-between">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {/* Data segments */}
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="transition-all duration-1000 ease-out"
              />
            ))}
          </svg>
          {/* Inner text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800 leading-none">{stats.total}</span>
            <span className="text-xs text-slate-500 font-medium mt-1">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 ml-2">
          {data.length === 0 ? (
            <span className="text-sm text-slate-400">No data</span>
          ) : (
            data.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.label}
                </div>
                <span className="text-sm font-bold text-slate-800">{item.value}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallanSummaryWidget;
