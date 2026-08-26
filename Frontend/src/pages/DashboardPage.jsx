import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import VehicleCard from '../components/dashboard/VehicleCard';
import HealthSummary from '../components/dashboard/HealthSummary';
import ComplianceStatus from '../components/dashboard/ComplianceStatus';
import Timeline from '../components/dashboard/Timeline';
import QuickActions from '../components/dashboard/QuickActions';
import PopularServices from '../components/dashboard/PopularServices';
import LiveLocationMap from '../components/dashboard/LiveLocationMap';
import AttentionWidget from '../components/dashboard/AttentionWidget';
import AiAssistantWidget from '../components/dashboard/AiAssistantWidget';
import GuidedProcesses from '../components/dashboard/GuidedProcesses';

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">
            
            {/* Left Column (Main Data) */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0">
              <VehicleCard />
              <HealthSummary />
              <ComplianceStatus />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <Timeline />
                <QuickActions />
                <PopularServices />
              </div>

              <GuidedProcesses />
            </div>

            {/* Right Column (Widgets) */}
            <div className="w-full xl:w-[350px] 2xl:w-[400px] flex flex-col gap-6 lg:gap-8 shrink-0">
              <LiveLocationMap />
              <AttentionWidget />
              <AiAssistantWidget />
            </div>

          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardPage;
