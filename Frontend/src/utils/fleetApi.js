/**
 * fleetApi.js - Fleet-specific API helpers
 * All calls use the centralized apiFetch (JWT is injected automatically)
 */
import { apiFetch } from './api';

const FLEET_BASE = '/fleet';

// Fleet Registration
export async function submitFleetRegistration(payload) {
  return apiFetch(`${FLEET_BASE}/registrations`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMyFleets() {
  return apiFetch(`${FLEET_BASE}/my`);
}

// Dashboard
export async function getFleetDashboard(fleetId) {
  return apiFetch(`${FLEET_BASE}/${fleetId}/dashboard`);
}

// Vehicles
export async function addFleetVehicle(fleetId, registrationNumber) {
  return apiFetch(`${FLEET_BASE}/${fleetId}/vehicles`, {
    method: 'POST',
    body: JSON.stringify({ registrationNumber }),
  });
}

export async function removeFleetVehicle(fleetId, vehicleId) {
  return apiFetch(`${FLEET_BASE}/${fleetId}/vehicles/${vehicleId}`, {
    method: 'DELETE',
  });
}

// Routes
export async function createFleetRoute(fleetId, payload) {
  return apiFetch(`${FLEET_BASE}/${fleetId}/routes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getActiveRoutes(fleetId) {
  return apiFetch(`${FLEET_BASE}/${fleetId}/routes/active`);
}

export async function stopFleetRoute(fleetId, routeId) {
  return apiFetch(`${FLEET_BASE}/${fleetId}/routes/${routeId}/stop`, {
    method: 'POST',
  });
}

// Alerts
export async function getFleetAlerts(fleetId) {
  return apiFetch(`${FLEET_BASE}/${fleetId}/alerts`);
}
