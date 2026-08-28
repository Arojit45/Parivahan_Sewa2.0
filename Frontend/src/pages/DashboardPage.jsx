import React from "react";
import { Link } from "react-router-dom";
import { Car, PlusCircle, AlertCircle, Loader2 } from "lucide-react";
import { DashboardProvider, useDashboard } from "../contexts/DashboardContext";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { useLanguage } from "../contexts/LanguageContext";
import VehicleCard from "../components/dashboard/VehicleCard";
import HealthSummary from "../components/dashboard/HealthSummary";
import ComplianceStatus from "../components/dashboard/ComplianceStatus";
import Timeline from "../components/dashboard/Timeline";
import QuickActions from "../components/dashboard/QuickActions";
import PopularServices from "../components/dashboard/PopularServices";
import LiveLocationMap from "../components/dashboard/LiveLocationMap";
import AttentionWidget from "../components/dashboard/AttentionWidget";
import AiAssistantWidget from "../components/dashboard/AiAssistantWidget";
import GuidedProcesses from "../components/dashboard/GuidedProcesses";
import GovtPosterWidget from "../components/dashboard/GovtPosterWidget";

// --------------------------------------------------------------------------
// Empty state â€” shown when user has no registered vehicles
// --------------------------------------------------------------------------
const EmptyState = () => {
  const { t } = useLanguage();
  return (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 max-w-md w-full text-center">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
        <Car className="w-12 h-12 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.dash?.noVehiclesTitle || "No Vehicles Found"}</h2>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        {t.dash?.noVehiclesDesc || "You have not linked any vehicles yet. Add your vehicle to unlock your personal dashboard â€” track compliance, challans, live location and more."}
      </p>
      <Link
        to="/add-vehicle"
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        {t.dash?.addVehicleBtn || "Add Vehicle"}
      </Link>
    </div>
  </div>
  );
};

// --------------------------------------------------------------------------
// Error state
// --------------------------------------------------------------------------
const ErrorState = ({ message }) => {
  const { t } = useLanguage();
  return (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="bg-white rounded-3xl border border-red-200 shadow-sm p-10 max-w-md w-full text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{t.dash?.errorTitle || "Something Went Wrong"}</h2>
      <p className="text-slate-500 text-sm leading-relaxed">{message || (t.dash?.errorDesc || "Failed to load your dashboard. Please try again later.")}</p>
    </div>
  </div>
  );
};

// --------------------------------------------------------------------------
// Loading skeleton
// --------------------------------------------------------------------------
const LoadingSkeleton = () => (
  <div className="flex-1 flex flex-col gap-6 min-w-0 animate-pulse">
    <div className="bg-white rounded-2xl border border-slate-200 h-52 w-full" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 h-32" />
      ))}
    </div>
    <div className="bg-white rounded-2xl border border-slate-200 h-56 w-full" />
  </div>
);

// --------------------------------------------------------------------------
// Inner layout â€” consumed after DashboardProvider is mounted
// --------------------------------------------------------------------------
const DashboardInner = () => {
  const { loadingVehicles, errorVehicles, vehicles, loadingDashboard, errorDashboard } = useDashboard();

  if (loadingVehicles) {
    return (
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  if (errorVehicles) {
    return (
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <ErrorState message={errorVehicles} />
      </main>
    );
  }

  if (vehicles.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">

        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0">
          {loadingDashboard ? (
            <LoadingSkeleton />
          ) : errorDashboard ? (
            <ErrorState message={errorDashboard} />
          ) : (
            <>
              <VehicleCard />
              <HealthSummary />
              <ComplianceStatus />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <Timeline />
                <QuickActions />
                <PopularServices />
              </div>
              <GuidedProcesses />
            </>
          )}
        </div>

        {/* Right Column (Widgets) */}
        <div className="w-full xl:w-[350px] 2xl:w-[400px] flex flex-col gap-6 lg:gap-8 shrink-0">
          <LiveLocationMap />
          <AiAssistantWidget />
          <AttentionWidget />
          <GovtPosterWidget />
        </div>

      </div>
    </main>
  );
};

// --------------------------------------------------------------------------
// Page root â€” wraps everything in the provider
// --------------------------------------------------------------------------
const DashboardPage = () => (
  <DashboardProvider>
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <DashboardInner />
      </div>
    </div>
  </DashboardProvider>
);

export default DashboardPage;
