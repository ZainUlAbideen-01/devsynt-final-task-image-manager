import { apiClient } from './client';
import { SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/api.types';

export const authApi = {
  checkAuth: async () => {
    const res = await apiClient('/auth/me');
    return res.json();
  },

  login: async (data: LoginRequest) => {
    const res = await apiClient('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  signup: async (data: SignupRequest) => {
    const res = await apiClient('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  logout: async () => {
    const res = await apiClient('/auth/logout', {
      method: 'POST'
    });
    return res.json();
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const res = await apiClient('/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  resetPassword: async (token: string, data: ResetPasswordRequest) => {
    const res = await apiClient(`/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
