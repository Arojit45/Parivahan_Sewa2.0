import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { ChallanProvider } from '../contexts/ChallanContext';
import ChallanDetailModal from '../components/challan/ChallanDetailModal';
import PaymentConfirmationModal from '../components/challan/PaymentConfirmationModal';
import ChallanDisputeModal from '../components/challan/ChallanDisputeModal';
import ChallanPaymentHistoryModal from '../components/challan/ChallanPaymentHistoryModal';
import ChallanDisputeHistoryModal from '../components/challan/ChallanDisputeHistoryModal';

const ChallanLayout = () => {
  return (
    <ChallanProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* Modals available to all Challan sub-pages */}
        <ChallanDetailModal />
        <PaymentConfirmationModal />
        <ChallanDisputeModal />
        <ChallanPaymentHistoryModal />
        <ChallanDisputeHistoryModal />
      </div>
    </ChallanProvider>
  );
};

export default ChallanLayout;
