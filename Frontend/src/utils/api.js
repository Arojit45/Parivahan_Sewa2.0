/**
 * api.js - Centralized API client for Parivahan Sewa 2.0
 * Reads the JWT token from localStorage and injects it into every request.
 */

const BASE_URL = '/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(path, options = {}) {
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

export async function getGuardianConfig(vehicleId) {
  return apiFetch(`/guardian-mode/vehicles/${vehicleId}`);
}

export async function saveGuardianConfig(vehicleId, payload) {
  return apiFetch(`/guardian-mode/vehicles/${vehicleId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function toggleGuardianMode(vehicleId) {
  return apiFetch(`/guardian-mode/vehicles/${vehicleId}/toggle`, {
    method: 'PATCH',
  });
}

export async function checkGuardianGeofence(vehicleId) {
  return apiFetch(`/guardian-mode/vehicles/${vehicleId}/check`, {
    method: 'POST',
  });
}

export async function getGuardianBreachEvents(vehicleId) {
  return apiFetch(`/guardian-mode/vehicles/${vehicleId}/breach-events`);
}

export async function getCitizenGuide(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiFetch(`/citizen-guide${suffix}`);
}

export async function getCitizenGuideDetail(guideId) {
  return apiFetch(`/citizen-guide/guides/${encodeURIComponent(guideId)}`);
}

export async function updateProfile(payload) {
  const token = getToken();
  const res = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Server error ${res.status}`);
  }

  return res.json();
}
