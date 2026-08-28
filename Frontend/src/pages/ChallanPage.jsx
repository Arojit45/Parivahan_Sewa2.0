import React from 'react';
import ChallanHeader from '../components/challan/ChallanHeader';
import ChallanStatsRow from '../components/challan/ChallanStatsRow';
import ChallanTable from '../components/challan/ChallanTable';
import ChallanInfoSection from '../components/challan/ChallanInfoSection';
import ChallanSummaryWidget from '../components/challan/ChallanSummaryWidget';
import ChallanQuickActions from '../components/challan/ChallanQuickActions';
import ChallanHelpWidget from '../components/challan/ChallanHelpWidget';
import ChallanPayOnlineWidget from '../components/challan/ChallanPayOnlineWidget';

const ChallanPage = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 pb-10">
      
      {/* Left Column (Main Data) */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChallanHeader />
        <ChallanStatsRow />
        <ChallanTable />
        <ChallanInfoSection />
      </div>

      {/* Right Column (Widgets) */}
      <div className="w-full xl:w-[320px] 2xl:w-[360px] flex flex-col gap-6 shrink-0">
        <ChallanSummaryWidget />
        <ChallanQuickActions />
        <ChallanHelpWidget />
        <ChallanPayOnlineWidget />
      </div>

    </div>
  );
};

export default ChallanPage;
