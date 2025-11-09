const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('arch1v_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res: Response, parse: 'json' | 'text' = 'json') {
  if (res.status === 401) {
    localStorage.removeItem('arch1v_token');
    localStorage.removeItem('arch1v_user');
    window.location.href = '/auth';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    // Try to surface server-side error text; fall back to status code
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Request failed with ${res.status}`);
  }
  return parse === 'json' ? res.json() : res.text();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res, 'json');
}

export async function register(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res, 'json');
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  // IMPORTANT: do not set Content-Type for FormData — the browser sets boundary
  const res = await fetch(`${BASE_URL}/api/files/upload`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  });
  return handleResponse(res, 'json');
}

export async function listFiles() {
  const res = await fetch(`${BASE_URL}/api/files/all`, {
    headers: { ...authHeaders() },
  });
  return handleResponse(res, 'json');
}

export async function locateFile(hash: string) {
  const res = await fetch(`${BASE_URL}/api/files/locate/${encodeURIComponent(hash)}`, {
    headers: { ...authHeaders() },
  });
  // Backend returns JSON Map { hash, path }
  return handleResponse(res, 'json');
}

export async function deleteFile(hash: string) {
  const res = await fetch(`${BASE_URL}/api/files/delete/${encodeURIComponent(hash)}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse(res, 'json');
}

export async function clearAll() {
  const res = await fetch(`${BASE_URL}/api/files/clear`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse(res, 'json');
}
