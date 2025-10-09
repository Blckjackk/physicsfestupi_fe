'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

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
    const checkAuth = () => {
      try {
        const isAuth = authService.isAuthenticated();
        const user = authService.getAuthUser();
        const userRole = user?.role as UserRole || null;

        // Update state
        setState({
          isLoading: false,
          isAuthenticated: isAuth,
          user,
          userRole,
        });

        // Jika tidak terotentikasi dan halaman membutuhkan auth
        if (!isAuth && !allowUnauthenticated) {
          // Redirect ke halaman login yang sesuai berdasarkan required role
          const loginPath = requiredRole === 'admin' || requiredRole === 'superadmin' 
            ? '/login-admin' 
            : '/login';
          
          router.push(redirectTo || loginPath);
          return;
        }

        // Jika sudah terotentikasi tapi role tidak sesuai
        if (isAuth && requiredRole && userRole !== requiredRole) {
          // Jika admin mencoba akses halaman peserta atau sebaliknya
          if (userRole === 'admin' || userRole === 'superadmin') {
            router.push('/dashboard-admin');
          } else if (userRole === 'peserta') {
            router.push('/exam');
          } else {
            // Unknown role, logout dan redirect ke login
            authService.logout();
            router.push('/login');
          }
          return;
        }

        // Jika sudah login admin tapi mencoba akses halaman login admin
        if (isAuth && (userRole === 'admin' || userRole === 'superadmin')) {
          const currentPath = window.location.pathname;
          if (currentPath === '/login-admin') {
            router.push('/dashboard-admin');
            return;
          }
        }

        // Jika sudah login peserta tapi mencoba akses halaman login peserta
        if (isAuth && userRole === 'peserta') {
          const currentPath = window.location.pathname;
          if (currentPath === '/login') {
            router.push('/exam');
            return;
          }
        }

      } catch (error) {
        console.error('Auth check error:', error);
        // Jika terjadi error, logout dan redirect
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
    checkAuth();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
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