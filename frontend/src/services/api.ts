import type {
  Startup,
  Partner,
  User,
  Project,
  Event,
  News,
  ApiResponse,
  Sector,
  LegalStatus,
  PartnerType,
  ProjectStatus,
  EventCategory,
  TargetAudience,
  InvestorType,
  InvestmentFocus
} from '@/types/company';

// API Configuration
const API_BASE_URL = '/api'; // Use Vite proxy for all requests

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials),
  
  signup: (userData: { name: string; email: string; password: string, role: string }) =>
    apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/signup', userData),
  
  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },

  accountDetails: (accountId: number) => {
    return apiClient.get<ApiResponse<{ role: string }>>(`/auth/accountDetails/${accountId}`);
  }
};

// Startups API
export const startupsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<Startup[]>>(`/startups${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) =>
    apiClient.get<ApiResponse<Startup>>(`/startups/${id}`),
  
  create: (startup: Partial<Startup>) =>
    apiClient.post<ApiResponse<Startup>>('/startups', startup),
  
  update: (id: number, startup: Partial<Startup>) =>
    apiClient.put<ApiResponse<Startup>>(`/startups/${id}`, startup),
  
  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/startups/${id}`),
};

// Partners API
export const partnersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<Partner[]>>(`/partners${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) =>
    apiClient.get<ApiResponse<Partner>>(`/partners/${id}`),
  
  create: (partner: Partial<Partner>) =>
    apiClient.post<ApiResponse<Partner>>('/partners', partner),
  
  update: (id: number, partner: Partial<Partner>) =>
    apiClient.put<ApiResponse<Partner>>(`/partners/${id}`, partner),
  
  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/partners/${id}`),
};

// Projects API
export const projectsApi = {
  getAll: (params?: { page?: number; limit?: number; startup_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.startup_id) queryParams.append('startup_id', params.startup_id.toString());
    
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<Project[]>>(`/projects${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${id}`),
  
  create: (project: Partial<Project>) =>
    apiClient.post<ApiResponse<Project>>('/projects', project),
  
  update: (id: number, project: Partial<Project>) =>
    apiClient.put<ApiResponse<Project>>(`/projects/${id}`, project),
  
  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/projects/${id}`),
};

// Users API
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; type?: 'founder' | 'admin' | 'investor' }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<User[]>>(`/users${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),
  
  create: (user: Partial<User>) =>
    apiClient.post<ApiResponse<User>>('/users', user),
  
  update: (id: number, user: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, user),
  
  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),
};

// Events API
export const eventsApi = {
  getAll: (params?: { page?: number; limit?: number; upcoming?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.upcoming) queryParams.append('upcoming', 'true');
    
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<Event[]>>(`/events${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) =>
    apiClient.get<ApiResponse<Event>>(`/events/${id}`),
  
  create: (event: Partial<Event>) =>
    apiClient.post<ApiResponse<Event>>('/events', event),
  
  update: (id: number, event: Partial<Event>) =>
    apiClient.put<ApiResponse<Event>>(`/events/${id}`, event),
  
  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/events/${id}`),
};

// News API
export const newsApi = {
  getAll: (params?: { page?: number; limit?: number; company_id?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.company_id) queryParams.append('company_id', params.company_id.toString());
    
    const query = queryParams.toString();
    return apiClient.get<ApiResponse<News[]>>(`/news${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) =>
    apiClient.get<ApiResponse<News>>(`/news/${id}`),
  
  create: (news: Partial<News>) =>
    apiClient.post<ApiResponse<News>>('/news', news),
  
  update: (id: number, news: Partial<News>) =>
    apiClient.put<ApiResponse<News>>(`/news/${id}`, news),
  
  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/news/${id}`),
};

// Reference data APIs
export const referenceApi = {
  getSectors: () =>
    apiClient.get<ApiResponse<Sector[]>>('/reference/sectors'),
  
  getLegalStatuses: () =>
    apiClient.get<ApiResponse<LegalStatus[]>>('/reference/legal-statuses'),
  
  getPartnerTypes: () =>
    apiClient.get<ApiResponse<PartnerType[]>>('/reference/partner-types'),
  
  getProjectStatuses: () =>
    apiClient.get<ApiResponse<ProjectStatus[]>>('/reference/project-statuses'),
  
  getEventCategories: () =>
    apiClient.get<ApiResponse<EventCategory[]>>('/reference/event-categories'),
  
  getTargetAudiences: () =>
    apiClient.get<ApiResponse<TargetAudience[]>>('/reference/target-audiences'),
  
  getInvestorTypes: () =>
    apiClient.get<ApiResponse<InvestorType[]>>('/reference/investor-types'),
  
  getInvestmentFocus: () =>
    apiClient.get<ApiResponse<InvestmentFocus[]>>('/reference/investment-focus'),
};

// Export combined API
export const api = {
  auth: authApi,
  startups: startupsApi,
  partners: partnersApi,
  projects: projectsApi,
  users: usersApi,
  events: eventsApi,
  news: newsApi,
  reference: referenceApi,
};

export default api;
