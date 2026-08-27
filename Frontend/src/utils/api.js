/**
 * api.js — Centralized API client for Parivahan Sewa 2.0
 * Reads the JWT token from localStorage and injects it into every request.
 */

const BASE_URL = '/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
    throw new Error('UNAUTHORIZED');
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Server error ${res.status}`);
  }

  if (res.status === 204) return null;

  return res.json();
}

export async function getMyVehicles() {
  return apiFetch('/dashboard/vehicles');
}

export async function getVehicleDashboard(vehicleId) {
  return apiFetch(`/dashboard/vehicles/${vehicleId}`);
}
