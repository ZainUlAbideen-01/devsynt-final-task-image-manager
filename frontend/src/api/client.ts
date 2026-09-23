const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = `${BASE_URL}${endpoint}`;
  
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
