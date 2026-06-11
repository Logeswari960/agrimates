const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_BASE = rawApiUrl.replace(/\/$/, '');

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function getToken() {
  return localStorage.getItem('agrimate_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('agrimate_token', token);
  else localStorage.removeItem('agrimate_token');
}

export async function api(path, { method = 'GET', body, formData, auth = true } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let payload = body;
  if (body && !formData) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData || payload,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed', res.status);
  }
  return data;
}

export { ApiError };
