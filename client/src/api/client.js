const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody.error || `API error: ${res.status}`)
  }
  if (res.status === 204) {
    return null
  }
  return res.json()
}