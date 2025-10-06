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
  loginPeserta: async (credentials: LoginPesertaRequest): Promise<any> => {
    const response = await api.post<any>(
      '/peserta/login',
      credentials
    );

    // Laravel returns { success, message, data: { peserta, token } }
    if (response.success && response.data) {
      // Store token and user data
      tokenManager.setToken(response.data.token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.peserta));
      }
    }

    return response.data; // Return just the data part
  },

  /**
   * Login admin
   */
  loginAdmin: async (credentials: LoginAdminRequest): Promise<any> => {
    const response = await api.post<any>(
      '/admin/login',
      credentials
    );

    // Laravel returns { success, message, data: { admin, token } }
    if (response.success && response.data) {
      // Store token and admin data
      tokenManager.setToken(response.data.token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.admin));
      }
    }

    return response.data; // Return just the data part
  },

  /**
   * Logout (clear all stored data)
   */
  logout: (): void => {
    tokenManager.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('ujian');
    }
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
