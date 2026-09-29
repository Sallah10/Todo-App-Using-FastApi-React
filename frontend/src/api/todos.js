const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(
  /\/+$/,
  '',
)

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (cause) {
    throw new Error(`Cannot reach the API at ${BASE_URL}. Is the backend running?`, {
      cause,
    })
  }

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch {
      // Non-JSON error body; keep the status line.
    }
    throw new Error(detail)
  }

  return response.status === 204 ? null : response.json()
}

export const api = {
  list: () => request('/todos'),
  create: (title) => request('/todos', { method: 'POST', body: JSON.stringify({ title }) }),
  setCompleted: (id, completed) =>
    request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify({ completed }) }),
  remove: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
}
