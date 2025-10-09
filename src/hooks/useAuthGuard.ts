'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { api } from '@/lib/api';

export type UserRole = 'admin' | 'peserta' | 'superadmin';

interface UseAuthGuardOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  allowUnauthenticated?: boolean;
}

interface AuthGuardState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null;
  userRole: UserRole | null;
}

/**
 * Hook untuk proteksi halaman berdasarkan role dan status autentikasi
 * Menggunakan API /me untuk validasi token dan role dari backend
 * 
 * @param options - Konfigurasi auth guard
 * @returns State autentikasi dan loading
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}): AuthGuardState {
  const router = useRouter();
  const [state, setState] = useState<AuthGuardState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    userRole: null,
  });

  const {
    requiredRole,
    redirectTo,
    allowUnauthenticated = false,
  } = options;

  useEffect(() => {
    const checkAuthWithAPI = async () => {
      try {
        // Cek apakah ada token di localStorage
        const hasToken = authService.isAuthenticated();
        
        if (!hasToken && !allowUnauthenticated) {
          // Tidak ada token, redirect ke login
          const loginPath = requiredRole === 'admin' || requiredRole === 'superadmin' 
            ? '/login-admin' 
            : '/login';
          
          setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            userRole: null,
          });
          
          router.push(redirectTo || loginPath);
          return;
        }

        if (!hasToken && allowUnauthenticated) {
          // Halaman yang boleh diakses tanpa login
          setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            userRole: null,
          });
          return;
        }

        // Ada token, validasi dengan backend API /me
        try {
          // Tentukan endpoint berdasarkan required role
          const endpoint = requiredRole === 'admin' || requiredRole === 'superadmin' 
            ? '/admin/me' 
            : '/peserta/me';
            
          const response = await api.get<any>(endpoint); // API endpoint untuk get current user
          const userData = response.data || response;
          const user = userData.data || userData; // Handle Laravel response structure
          const userRole = user.role as UserRole;

          // Update state dengan data dari backend
          setState({
            isLoading: false,
            isAuthenticated: true,
            user,
            userRole,
          });

          // Cek apakah role sesuai dengan yang dibutuhkan
          if (requiredRole && userRole !== requiredRole) {
            // Role tidak sesuai, redirect ke halaman yang tepat
            if (userRole === 'admin' || userRole === 'superadmin') {
              router.push('/dashboard-admin');
            } else if (userRole === 'peserta') {
              router.push('/exam');
            } else {
              // Unknown role, logout dan redirect
              authService.logout();
              router.push('/login');
            }
            return;
          }

          // Auto-redirect jika sudah login tapi akses halaman login
          const currentPath = window.location.pathname;
          if (userRole === 'admin' || userRole === 'superadmin') {
            if (currentPath === '/login-admin') {
              router.push('/dashboard-admin');
              return;
            }
          } else if (userRole === 'peserta') {
            if (currentPath === '/login') {
              router.push('/exam');
              return;
            }
          }

        } catch (apiError) {
          // Token invalid atau expired, logout dan redirect
          console.error('Auth API validation failed:', apiError);
          authService.logout();
          
          setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            userRole: null,
          });
          
          const loginPath = requiredRole === 'admin' || requiredRole === 'superadmin' 
            ? '/login-admin' 
            : '/login';
          
          router.push(redirectTo || loginPath);
        }

      } catch (error) {
        console.error('Auth check error:', error);
        // Fallback: logout dan redirect
        authService.logout();
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          userRole: null,
        });
        
        const loginPath = requiredRole === 'admin' || requiredRole === 'superadmin' 
          ? '/login-admin' 
          : '/login';
        router.push(redirectTo || loginPath);
      }
    };

    // Check auth immediately
    checkAuthWithAPI();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthWithAPI();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, requiredRole, redirectTo, allowUnauthenticated]);

  return state;
}

/**
 * Hook khusus untuk halaman admin
 */
export function useAdminGuard() {
  return useAuthGuard({ 
    requiredRole: 'admin',
    redirectTo: '/login-admin'
  });
}

/**
 * Hook khusus untuk halaman peserta  
 */
export function usePesertaGuard() {
  return useAuthGuard({ 
    requiredRole: 'peserta',
    redirectTo: '/login'
  });
}