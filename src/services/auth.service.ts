/**
 * Authentication Service
 * Handles login for peserta and admin
 */

import { api, tokenManager } from '@/lib/api';
import type {
  LoginPesertaRequest,
  LoginPesertaResponse,
  LoginAdminRequest,
  LoginAdminResponse,
  User,
  Ujian,
} from '@/types/api';

// Authentication service
export const authService = {
  /**
   * Login peserta
   */
  loginPeserta: async (credentials: LoginPesertaRequest): Promise<LoginPesertaResponse> => {
    const response = await api.post<LoginPesertaResponse>(
      '/peserta/login',
      credentials
    );

    // Store token and user data
    tokenManager.setToken(response.token);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.peserta));
      localStorage.setItem('ujian', JSON.stringify(response.ujian));
    }

    return response;
  },

  /**
   * Login admin
   */
  loginAdmin: async (credentials: LoginAdminRequest): Promise<LoginAdminResponse> => {
    const response = await api.post<LoginAdminResponse>(
      '/admin/login',
      credentials
    );

    // Store token and admin data
    tokenManager.setToken(response.token);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.admin));
    }

    return response;
  },

  /**
   * Logout (clear all stored data)
   */
  logout: (): void => {
    tokenManager.removeToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.getToken() !== null;
  },

  /**
   * Get current user from localStorage
   */
  getAuthUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Get current ujian from localStorage
   */
  getAuthUjian: (): Ujian | null => {
    if (typeof window !== 'undefined') {
      const ujianStr = localStorage.getItem('ujian');
      if (ujianStr) {
        try {
          return JSON.parse(ujianStr) as Ujian;
        } catch {
          return null;
        }
      }
    }
    return null;
  },
};

export default authService;
