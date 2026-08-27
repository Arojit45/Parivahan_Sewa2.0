import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllChallans, payChallan as apiPayChallan } from '../utils/challanApi';

const ChallanContext = createContext(null);

/**
 * Computes summary stats from a list of challans.
 * "Overdue" = status PENDING and dueDate is in the past.
 */
function computeStats(challans) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let total = challans.length;
  let pendingCount = 0, overdueCount = 0, paidCount = 0, disputedCount = 0;
  let pendingAmount = 0, overdueAmount = 0, paidAmount = 0;

  challans.forEach((c) => {
    const due = c.dueDate ? new Date(c.dueDate) : null;
    const isOverdue = c.status === 'PENDING' && due && due < today;

    if (c.status === 'PAID') {
      paidCount++;
      paidAmount += Number(c.amount);
    } else if (c.status === 'DISPUTED') {
      disputedCount++;
    } else if (isOverdue) {
      overdueCount++;
      overdueAmount += Number(c.amount);
      pendingAmount += Number(c.amount); // overdue is also part of pending amount
    } else if (c.status === 'PENDING') {
      pendingCount++;
      pendingAmount += Number(c.amount);
    }
  });

  return { total, pendingCount, overdueCount, paidCount, disputedCount, pendingAmount, overdueAmount, paidAmount };
}

export const ChallanProvider = ({ children }) => {
  const [challans, setChallans] = useState([]);
  const [stats, setStats] = useState({ total: 0, pendingCount: 0, overdueCount: 0, paidCount: 0, disputedCount: 0, pendingAmount: 0, overdueAmount: 0, paidAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState({ open: false, challan: null, receipt: null, step: 'confirm' });
  // Detail modal state
  const [detailModal, setDetailModal] = useState({ open: false, challan: null });
  // Dispute modal state
  const [disputeModal, setDisputeModal] = useState({ open: false, challan: null });
  // Payment History modal
  const [paymentHistoryModal, setPaymentHistoryModal] = useState({ open: false });
  // Dispute History modal
  const [disputeHistoryModal, setDisputeHistoryModal] = useState({ open: false });

  const fetchChallans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllChallans();
      setChallans(data || []);
      setStats(computeStats(data || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallans();
  }, [fetchChallans]);

  /** Open payment confirmation modal */
  const openPaymentModal = (challan) => {
    setPaymentModal({ open: true, challan, receipt: null, step: 'confirm' });
  };

  /** Execute payment and transition to success screen */
  const confirmPayment = async (challanId) => {
    try {
      const receipt = await apiPayChallan(challanId);
      // Update the local list optimistically
      setChallans((prev) =>
        prev.map((c) => (c.id === challanId ? { ...c, status: 'PAID', paymentDate: receipt.paymentDate, transactionId: receipt.transactionId } : c))
      );
      setStats(computeStats(
        challans.map((c) => (c.id === challanId ? { ...c, status: 'PAID' } : c))
      ));
      setPaymentModal((m) => ({ ...m, receipt, step: 'success' }));
    } catch (err) {
      throw err;
    }
  };

  const closePaymentModal = () => setPaymentModal({ open: false, challan: null, receipt: null, step: 'confirm' });
  const openDetailModal = (challan) => setDetailModal({ open: true, challan });
  const closeDetailModal = () => setDetailModal({ open: false, challan: null });
  const openDisputeModal = (challan) => setDisputeModal({ open: true, challan });
  const closeDisputeModal = () => setDisputeModal({ open: false, challan: null });
  const openPaymentHistoryModal = () => setPaymentHistoryModal({ open: true });
  const closePaymentHistoryModal = () => setPaymentHistoryModal({ open: false });
  const openDisputeHistoryModal = () => setDisputeHistoryModal({ open: true });
  const closeDisputeHistoryModal = () => setDisputeHistoryModal({ open: false });

  /** Mark a challan as disputed locally after raising a dispute */
  const markDisputed = (challanId) => {
    setChallans((prev) => prev.map((c) => (c.id === challanId ? { ...c, status: 'DISPUTED', hasActiveDispute: true } : c)));
  };

  return (
    <ChallanContext.Provider value={{
      challans, stats, loading, error,
      paymentModal, openPaymentModal, confirmPayment, closePaymentModal,
      detailModal, openDetailModal, closeDetailModal,
      disputeModal, openDisputeModal, closeDisputeModal,
      paymentHistoryModal, openPaymentHistoryModal, closePaymentHistoryModal,
      disputeHistoryModal, openDisputeHistoryModal, closeDisputeHistoryModal,
      markDisputed, fetchChallans,
    }}>
      {children}
    </ChallanContext.Provider>
  );
};

export const useChallan = () => {
  const ctx = useContext(ChallanContext);
  if (!ctx) throw new Error('useChallan must be used inside ChallanProvider');
  return ctx;
};
