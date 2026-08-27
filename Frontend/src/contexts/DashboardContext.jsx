import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyVehicles, getVehicleDashboard } from "../utils/api";

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
};

export const DashboardProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [errorVehicles, setErrorVehicles] = useState(null);
  const [errorDashboard, setErrorDashboard] = useState(null);

  // 1. Fetch vehicle list on mount
  useEffect(() => {
    let cancelled = false;
    setLoadingVehicles(true);
    setErrorVehicles(null);
    getMyVehicles()
      .then((data) => {
        if (cancelled) return;
        setVehicles(data ?? []);
        if (data && data.length > 0) {
          setSelectedVehicleId(data[0].id);
        }
      })
      .catch((err) => {
        if (!cancelled) setErrorVehicles(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingVehicles(false);
      });
    return () => { cancelled = true; };
  }, []);

  // 2. Fetch full dashboard whenever selectedVehicleId changes
  useEffect(() => {
    if (!selectedVehicleId) return;
    let cancelled = false;
    setLoadingDashboard(true);
    setErrorDashboard(null);
    getVehicleDashboard(selectedVehicleId)
      .then((data) => { if (!cancelled) setDashboard(data); })
      .catch((err) => { if (!cancelled) setErrorDashboard(err.message); })
      .finally(() => { if (!cancelled) setLoadingDashboard(false); });
    return () => { cancelled = true; };
  }, [selectedVehicleId]);

  const selectVehicle = useCallback((id) => {
    setSelectedVehicleId(id);
    setDashboard(null);
  }, []);

  const value = {
    vehicles,
    selectedVehicleId,
    dashboard,
    loadingVehicles,
    loadingDashboard,
    errorVehicles,
    errorDashboard,
    selectVehicle,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
