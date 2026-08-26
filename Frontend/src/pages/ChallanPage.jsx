import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">
            
            {/* Left Column (Main Data) */}
            <div className="flex-1 flex flex-col min-w-0">
              <ChallanHeader />
              <ChallanStatsRow />
              <ChallanTable />
              <ChallanInfoSection />
            </div>

            {/* Right Column (Widgets) */}
            <div className="w-full xl:w-[320px] 2xl:w-[360px] flex flex-col shrink-0">
              <ChallanSummaryWidget />
              <ChallanQuickActions />
              <ChallanHelpWidget />
              <ChallanPayOnlineWidget />
            </div>

          </div>
        </main>
      </div>

    </div>
  );
};

export default ChallanPage;
