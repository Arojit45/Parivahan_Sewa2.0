import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DLWizardContext = createContext(null);

const API_BASE = '/api/v1/dl';

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
  vehicleClass: null, feeAmount: null,
  hasLL: null, llNumber: '',
  applicantName: '', dob: null, address: '', aadharNumber: '', isEligible: false,
  documentsConfirmed: false, selectedDrivingSchoolId: null, selectedDrivingSchoolName: null,
  appointmentDate: null, appointmentSlot: null,
  paymentStatus: 'PENDING', paymentTransactionId: null, paymentTimestamp: null,
  applicationStatus: 'DRAFT', applicationNumber: null, testResult: 'PENDING',
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Fetch wrapper that never throws — returns { ok, status, data, networkError } */
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
  `DL-${stateCode || 'XX'}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

const makeMockTxn = () =>
  'MOCK-DL-' + Math.random().toString(36).substring(2, 10).toUpperCase();

export const DLWizardProvider = ({ children }) => {
  const [wizard, setWizard] = useState(INITIAL_STATE);

  // On mount: try to resume an in-progress application — non-blocking, never crashes
  useEffect(() => {
    const checkResume = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return; // not logged in — wizard works locally

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
          currentStep: Math.min((d.lastCompletedStep || 0) + 1, 9),
          lastCompletedStep: d.lastCompletedStep || 0,
          isResuming: (d.lastCompletedStep || 0) > 0,
          state: d.state, stateCode: d.stateCode,
          rtoCode: d.rtoCode, rtoName: d.rtoName,
          vehicleClass: d.vehicleClass, feeAmount: d.feeAmount,
          hasLL: d.hasLL, llNumber: d.llNumber || '',
          applicantName: d.applicantName || '', dob: d.dob,
          address: d.address || '', aadharNumber: d.aadharNumber || '',
          isEligible: d.isEligible || false,
          documentsConfirmed: d.documentsConfirmed || false,
          selectedDrivingSchoolId: d.selectedDrivingSchoolId,
          selectedDrivingSchoolName: d.selectedDrivingSchoolName,
          appointmentDate: d.appointmentDate, appointmentSlot: d.appointmentSlot,
          paymentStatus: d.paymentStatus || 'PENDING',
          paymentTransactionId: d.paymentTransactionId,
          applicationStatus: d.applicationStatus || 'DRAFT',
          applicationNumber: d.applicationNumber,
          testResult: d.testResult || 'PENDING',
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

  /** Advance locally — used when backend is unavailable or user has no token */
  const advanceLocally = (stepData, currentStep, lastCompleted) => {
    setWizard(prev => ({
      ...prev,
      ...stepData,
      isSaving: false,
      isResuming: false,
      error: null,
      currentStep: Math.min(currentStep + 1, 9),
      lastCompletedStep: Math.max(lastCompleted, currentStep),
    }));
  };

  const saveAndNext = useCallback(async (stepData) => {
    setWizard(prev => ({ ...prev, isSaving: true, error: null }));

    const { currentStep, lastCompletedStep, applicationId, backendAvailable } = wizard;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // No token or backend down — work 100% locally
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
      }

      // Advance regardless of backend success
      setWizard(prev => ({
        ...prev,
        ...stepData,
        applicationId: result.ok && result.data ? result.data.id : null,
        isSaving: false,
        isResuming: false,
        currentStep: 2,
        lastCompletedStep: Math.max(prev.lastCompletedStep, 1),
        backendAvailable: result.networkError ? false : prev.backendAvailable,
      }));
      return;
    }

    // Subsequent steps: update existing application (best-effort)
    if (applicationId) {
      const result = await safeFetch(`${API_BASE}/application/${applicationId}`, {
        method: 'PUT',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedStep: currentStep, ...stepData }),
      });

      setWizard(prev => ({
        ...prev,
        ...stepData,
        feeAmount: result.ok && result.data?.feeAmount ? result.data.feeAmount : prev.feeAmount,
        applicationStatus: result.ok && result.data?.applicationStatus ? result.data.applicationStatus : prev.applicationStatus,
        isSaving: false,
        isResuming: false,
        currentStep: Math.min(currentStep + 1, 9),
        lastCompletedStep: Math.max(prev.lastCompletedStep, currentStep),
        backendAvailable: result.networkError ? false : prev.backendAvailable,
      }));
    } else {
      advanceLocally(stepData, currentStep, lastCompletedStep);
    }
  }, [wizard]);

  const processMockPayment = useCallback(async () => {
    setWizard(prev => ({ ...prev, isSaving: true, error: null }));

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // Local mock payment — no token or backend down
    if (!token || !wizard.applicationId || !wizard.backendAvailable) {
      setWizard(prev => ({
        ...prev,
        isSaving: false,
        paymentStatus: 'COMPLETED',
        paymentTransactionId: makeMockTxn(),
        paymentTimestamp: new Date().toISOString(),
        applicationStatus: 'SUBMITTED',
        applicationNumber: makeMockAppNumber(prev.stateCode),
        lastCompletedStep: 8,
        currentStep: 9,
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
      // Backend failed — mock locally anyway so UX completes
      setWizard(prev => ({
        ...prev,
        isSaving: false,
        paymentStatus: 'COMPLETED',
        paymentTransactionId: makeMockTxn(),
        paymentTimestamp: new Date().toISOString(),
        applicationStatus: 'SUBMITTED',
        applicationNumber: makeMockAppNumber(prev.stateCode),
        lastCompletedStep: 8,
        currentStep: 9,
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
      lastCompletedStep: 8,
      currentStep: 9,
    }));
  }, [wizard]);

  const goToStep = useCallback((step) => {
    setWizard(prev => ({ ...prev, currentStep: step }));
  }, []);

  const goBack = useCallback(() => {
    setWizard(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1), error: null }));
  }, []);

  return (
    <DLWizardContext.Provider value={{ wizard, updateField, updateFields, saveAndNext, processMockPayment, goToStep, goBack }}>
      {children}
    </DLWizardContext.Provider>
  );
};

export const useDLWizard = () => {
  const ctx = useContext(DLWizardContext);
  if (!ctx) throw new Error('useDLWizard must be used inside DLWizardProvider');
  return ctx;
};
