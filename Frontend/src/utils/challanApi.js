const BASE = 'https://parivahan-sewa2-0-backend.onrender.com/api/v1/challans';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (res.status === 403) throw new Error('ACCESS_DENIED');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/** Fetch all challans for the current user across all vehicles */
export async function getAllChallans() {
  return request(BASE);
}

/** Fetch full detail of a single challan */
export async function getChallanDetail(challanId) {
  return request(`${BASE}/${challanId}`);
}

/** Pay a challan â€” returns PaymentReceiptDto */
export async function payChallan(challanId) {
  return request(`${BASE}/${challanId}/pay`, { method: 'POST' });
}

/** Raise a dispute on a challan */
export async function raiseDispute(challanId, { reason, explanation }) {
  return request(`${BASE}/${challanId}/dispute`, {
    method: 'POST',
    body: JSON.stringify({ reason, explanation }),
  });
}

/** Get existing dispute for a challan */
export async function getChallanDispute(challanId) {
  return request(`${BASE}/${challanId}/dispute`);
}

/** Get all disputes for the current user */
export async function getAllDisputes() {
  return request('https://parivahan-sewa2-0-backend.onrender.com/api/v1/disputes');
}

/**
 * Download challan as PDF (generated client-side from detail data).
 * Returns the ChallanDetailDto to be used by jsPDF.
 */
export async function getChallanForDownload(challanId) {
  return request(`${BASE}/${challanId}`);
}
