const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;
  
  let response = await fetch(url, {
    ...options,
    credentials: "include"
  });

  if (response.status === 401 && endpoint !== '/auth/refresh-token' && endpoint !== '/login') {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include"
    });

    if (!refreshRes.ok) {
      window.location.href = "/";
      throw new ApiError(401, "Session expired");
    }

    // Retry original request
    response = await fetch(url, {
      ...options,
      credentials: "include"
    });
  }

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response;
};
