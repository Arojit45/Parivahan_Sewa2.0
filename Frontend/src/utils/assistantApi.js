/**
 * assistantApi.js
 * Utility for calling the Ask My Vehicle backend endpoint.
 *
 * Security: JWT is read from localStorage and sent as Bearer header.
 * The Gemini API key is NEVER included here - it stays on the server.
 */

const BASE_URL = '/api/vehicles';

/**
 * Send a question to the AI assistant for a specific vehicle.
 *
 * @param {number} vehicleId - The vehicle database ID
 * @param {string} message   - The user natural-language question
 * @param {Array}  history   - Optional conversation history [{role, content}]
 * @returns {Promise<{answer, intent, actions, sources, fallback}>}
 */
export async function askVehicle(vehicleId, message, history = []) {
  // Token key must match what AuthContext saves — it saves as 'token'
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/${vehicleId}/assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history }),
  });

  if (response.status === 403) {
    throw new Error('ACCESS_DENIED');
  }
  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Server error ${response.status}`);
  }

  return response.json();
}

export async function askApplicationProcess(message, history = []) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const response = await fetch('/api/v1/application-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history }),
  });

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Server error ${response.status}`);
  }

  return response.json();
}

/**
 * Controlled action router - maps action strings from AI response to app routes.
 * NEVER executes arbitrary strings as URLs or code.
 */
export const ACTION_ROUTES = {
  VIEW_PUC:        '/dashboard#compliance',
  VIEW_INSURANCE:  '/dashboard#compliance',
  VIEW_TAX:        '/dashboard#compliance',
  VIEW_RC:         '/dashboard#compliance',
  VIEW_CHALLANS:   '/challans',
  PAY_CHALLAN:     '/challans',
  VIEW_HEALTH:     '/dashboard#health',
  OPEN_LIVE_MAP:   '/dashboard#map',
  VIEW_ALERTS:     '/dashboard#alerts',
  VIEW_COMPLIANCE: '/dashboard#compliance',
  OPEN_DASHBOARD:  '/dashboard',
  VIEW_TIMELINE:   '/dashboard#timeline',
  START_DL_APPLICATION: '/driving-license/apply',
  TRACK_DL_APPLICATION: '/driving-license/apply',
};

export function resolveActionRoute(actionCode) {
  return ACTION_ROUTES[actionCode] || null;
}
