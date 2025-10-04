/**
 * API Helper Library for Laravel Backend Integration
 * Provides centralized HTTP client with token management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token management helpers
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('ujian');
    }
  },
};

// Request options interface
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Generic HTTP request handler
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = tokenManager.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    throw new ApiError(
      'Network error occurred',
      0,
      error
    );
  }
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  // Upload with FormData
  upload: async <T>(
    endpoint: string,
    formData: FormData,
    options?: Omit<RequestOptions, 'headers'>
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = tokenManager.getToken();

    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Upload failed',
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Upload failed', 0, error);
    }
  },
};

export default api;
