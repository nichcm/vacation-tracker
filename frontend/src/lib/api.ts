const TOKEN_KEY = 'vacation-tracker.token'
const SERVER_UNAVAILABLE = 'Servidor indisponível no momento. Tente novamente em instantes.'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // localStorage indisponível (ex.: modo privado): sessão dura só enquanto a aba estiver aberta
  }
}

let unauthorizedListener: (() => void) | null = null

/** Chamado quando a API responde 401 com um token (sessão expirada). */
export function onUnauthorized(listener: (() => void) | null) {
  unauthorizedListener = listener
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

/** Chama a API (via proxy `/api` do Vite/nginx) com o token JWT salvo. */
export async function api<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, SERVER_UNAVAILABLE)
  }

  if (response.status === 401 && token) {
    setToken(null)
    unauthorizedListener?.()
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join('\n') : data?.message
    const fallback = response.status >= 500 ? SERVER_UNAVAILABLE : 'Não foi possível completar a operação'
    throw new ApiError(response.status, message ?? fallback)
  }
  return data as T
}
