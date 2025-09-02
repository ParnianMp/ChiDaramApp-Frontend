import { ApiResponse, Category, CategoryFilters, PaginatedResponse, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 0, error);
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  register: (userData: Omit<User, 'id'> & { password: string }) =>
    apiRequest<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
  getCurrentUser: () =>
    apiRequest<ApiResponse<User>>('/auth/me'),
};

export const categoryApi = {
  getCategories: (filters?: CategoryFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const query = params.toString();
    return apiRequest<PaginatedResponse<Category>>(`/categories${query ? `?${query}` : ''}`);
  },
  
  getCategory: (id: string) =>
    apiRequest<ApiResponse<Category>>(`/categories/${id}`),
    
  createCategory: (category: Omit<Category, 'id'>) =>
    apiRequest<ApiResponse<Category>>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
    
  updateCategory: (id: string, category: Partial<Category>) =>
    apiRequest<ApiResponse<Category>>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),
    
  deleteCategory: (id: string) =>
    apiRequest<ApiResponse<void>>(`/categories/${id}`, {
      method: 'DELETE',
    }),
};

export { ApiError };
