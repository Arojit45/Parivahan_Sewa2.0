import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const VRWizardContext = createContext(null);

const API_BASE = '/api/v1/vr';

const INITIAL_STATE = {
  applicationId: null,
  currentStep: 1,
  lastCompletedStep: 0,
  isResuming: false,
  isSaving: false,
  error: null,
  backendAvailable: true,

  state: null, stateCode: null,
  rtoCode: null, rtoName: null,
  vehicleCategory: null, usageType: null, vehicleType: null, isEligible: false,
  identityProof: null, addressProof: null, vehicleInvoice: null, insuranceProof: null, documentsConfirmed: false,
  feeAmount: null,
  appointmentDate: null, appointmentSlot: null,
  paymentStatus: 'PENDING', paymentTransactionId: null, paymentTimestamp: null,
  applicationStatus: 'DRAFT', applicationNumber: null, inspectionStatus: 'PENDING',
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, { ...options });
    let data = null;
    try { data = await res.json(); } catch (_) {}
    return { ok: res.ok, status: res.status, data };
  } catch (_) {
    return { ok: false, status: 0, data: null, networkError: true };
  }
};

const makeMockAppNumber = (stateCode) =>
  `VR-${stateCode || 'XX'}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

const makeMockTxn = () =>
  'MOCK-VR-' + Math.random().toString(36).substring(2, 10).toUpperCase();

export const VRWizardProvider = ({ children }) => {
  const [wizard, setWizard] = useState(INITIAL_STATE);

  // Resume in-progress application
  useEffect(() => {
    const checkResume = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const result = await safeFetch(`${API_BASE}/application/in-progress`, {
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      });

      if (result.networkError) {
        setWizard(prev => ({ ...prev, backendAvailable: false }));
        return;
      }

      if (result.status === 200 && result.data) {
        const d = result.data;
        setWizard(prev => ({
          ...prev,
          applicationId: d.id,
          currentStep: Math.min((d.lastCompletedStep || 0) + 1, 8),
          lastCompletedStep: d.lastCompletedStep || 0,
          isResuming: (d.lastCompletedStep || 0) > 0,
          state: d.state, stateCode: d.stateCode,
          rtoCode: d.rtoCode, rtoName: d.rtoName,
          vehicleCategory: d.vehicleCategory, usageType: d.usageType, vehicleType: d.vehicleType, isEligible: d.isEligible || false,
          identityProof: d.identityProof, addressProof: d.addressProof, vehicleInvoice: d.vehicleInvoice, insuranceProof: d.insuranceProof, documentsConfirmed: d.documentsConfirmed || false,
          feeAmount: d.feeAmount,
          appointmentDate: d.appointmentDate, appointmentSlot: d.appointmentSlot,
          paymentStatus: d.paymentStatus || 'PENDING',
          paymentTransactionId: d.paymentTransactionId,
          applicationStatus: d.applicationStatus || 'DRAFT',
          applicationNumber: d.applicationNumber,
          inspectionStatus: d.inspectionStatus || 'PENDING',
        }));
      }
    };
    checkResume();
  }, []);

  const updateField = useCallback((field, value) => {
    setWizard(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateFields = useCallback((fields) => {
    setWizard(prev => ({ ...prev, ...fields }));
  }, []);

  const advanceLocally = (stepData, currentStep, lastCompleted) => {
    setWizard(prev => ({
      ...prev,
      ...stepData,
      isSaving: false,
      isResuming: false,
      error: null,
      currentStep: Math.min(currentStep + 1, 8),
      lastCompletedStep: Math.max(lastCompleted, currentStep),
    }));
  };

  const saveAndNext = useCallback(async (stepData) => {
    setWizard(prev => ({ ...prev, isSaving: true, error: null }));

    const { currentStep, lastCompletedStep, applicationId, backendAvailable } = wizard;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // No token or backend down -> work locally
    if (!token || !backendAvailable) {
      advanceLocally(stepData, currentStep, lastCompletedStep);
      return;
    }

    // Step 1: create application
    if (!applicationId && currentStep === 1) {
      const result = await safeFetch(`${API_BASE}/application`, {
        method: 'POST',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: stepData.state, stateCode: stepData.stateCode }),
      });

      if (result.networkError) {
        setWizard(prev => ({ ...prev, backendAvailable: false }));
        advanceLocally(stepData, currentStep, lastCompletedStep);
        return;
      }

      if (!result.ok) {
        setWizard(prev => ({ ...prev, isSaving: false, error: 'Failed to save application. Please try again.' }));
        return;
      }

      setWizard(prev => ({
        ...prev,
        ...stepData,
        applicationId: result.data ? result.data.id : null,
        isSaving: false,
        isResuming: false,
        currentStep: 2,
        lastCompletedStep: Math.max(prev.lastCompletedStep, 1),
      }));
      return;
    }

    // Subsequent steps
    if (applicationId) {
      const result = await safeFetch(`${API_BASE}/application/${applicationId}`, {
        method: 'PUT',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedStep: currentStep, ...stepData }),
      });

      if (result.networkError) {
        setWizard(prev => ({ ...prev, backendAvailable: false }));
        advanceLocally(stepData, currentStep, lastCompletedStep);
        return;
      }

      if (!result.ok) {
        setWizard(prev => ({ ...prev, isSaving: false, error: 'Failed to update application. Please try again.' }));
        return;
      }

      setWizard(prev => ({
        ...prev,
        ...stepData,
        feeAmount: result.data?.feeAmount ? result.data.feeAmount : prev.feeAmount,
        applicationStatus: result.data?.applicationStatus ? result.data.applicationStatus : prev.applicationStatus,
        isSaving: false,
        isResuming: false,
        currentStep: Math.min(currentStep + 1, 8),
        lastCompletedStep: Math.max(prev.lastCompletedStep, currentStep),
      }));
    } else {
      advanceLocally(stepData, currentStep, lastCompletedStep);
    }
  }, [wizard]);

  const processMockPayment = useCallback(async () => {
    setWizard(prev => ({ ...prev, isSaving: true, error: null }));

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token || !wizard.applicationId || !wizard.backendAvailable) {
      setWizard(prev => ({
        ...prev,
        isSaving: false,
        paymentStatus: 'COMPLETED',
        paymentTransactionId: makeMockTxn(),
        paymentTimestamp: new Date().toISOString(),
        applicationStatus: 'SUBMITTED',
        applicationNumber: makeMockAppNumber(prev.stateCode),
        lastCompletedStep: 7,
        currentStep: 8,
      }));
      return;
    }

    const result = await safeFetch(`${API_BASE}/payment`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: wizard.applicationId,
        amount: wizard.feeAmount,
        simulatedResult: 'SUCCESS',
      }),
    });

    if (result.networkError || !result.ok) {
      setWizard(prev => ({
        ...prev,
        isSaving: false,
        paymentStatus: 'COMPLETED',
        paymentTransactionId: makeMockTxn(),
        paymentTimestamp: new Date().toISOString(),
        applicationStatus: 'SUBMITTED',
        applicationNumber: makeMockAppNumber(prev.stateCode),
        lastCompletedStep: 7,
        currentStep: 8,
      }));
      return;
    }

    const d = result.data;
    setWizard(prev => ({
      ...prev,
      isSaving: false,
      paymentStatus: d.paymentStatus,
      paymentTransactionId: d.paymentTransactionId,
      paymentTimestamp: d.paymentTimestamp,
      applicationStatus: d.applicationStatus,
      applicationNumber: d.applicationNumber,
      lastCompletedStep: 7,
      currentStep: 8,
    }));
  }, [wizard]);

  const goToStep = useCallback((step) => {
    setWizard(prev => ({ ...prev, currentStep: step }));
  }, []);

  const goBack = useCallback(() => {
    setWizard(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1), error: null }));
  }, []);

  return (
    <VRWizardContext.Provider value={{ wizard, updateField, updateFields, saveAndNext, processMockPayment, goToStep, goBack }}>
      {children}
    </VRWizardContext.Provider>
  );
};

export const useVRWizard = () => {
  const ctx = useContext(VRWizardContext);
  if (!ctx) throw new Error('useVRWizard must be used inside VRWizardProvider');
  return ctx;
};
