import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  Startup, 
  Partner, 
  User, 
  Project, 
  Event, 
  News,
  Sector,
  LegalStatus,
  PartnerType,
  ProjectStatus,
  EventCategory,
  TargetAudience,
  InvestorType,
  InvestmentFocus
} from '@/types/company';
import { api } from '@/services/api';

export const useAppStore = defineStore('app', () => {
  // State
  const startups = ref<Startup[]>([]);
  const partners = ref<Partner[]>([]);
  const projects = ref<Project[]>([]);
  const events = ref<Event[]>([]);
  const news = ref<News[]>([]);
  const users = ref<User[]>([]);
  
  // Authentication state
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const authToken = ref<string | null>(null);
  
  // Reference data
  const sectors = ref<Sector[]>([]);
  const legalStatuses = ref<LegalStatus[]>([]);
  const partnerTypes = ref<PartnerType[]>([]);
  const projectStatuses = ref<ProjectStatus[]>([]);
  const eventCategories = ref<EventCategory[]>([]);
  const targetAudiences = ref<TargetAudience[]>([]);
  const investorTypes = ref<InvestorType[]>([]);
  const investmentFocus = ref<InvestmentFocus[]>([]);
  
  // Loading states
  const loading = ref({
    startups: false,
    partners: false,
    projects: false,
    events: false,
    news: false,
    users: false,
    reference: false,
    auth: false,
  });
  
  // Error states
  const errors = ref({
    startups: null as string | null,
    partners: null as string | null,
    projects: null as string | null,
    events: null as string | null,
    news: null as string | null,
    users: null as string | null,
    reference: null as string | null,
    auth: null as string | null,
  });
  
  // Search functionality
  const searchQuery = ref('');
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  // Computed properties
  const filteredStartups = computed(() => {
    if (!searchQuery.value) return startups.value;
    
    const query = searchQuery.value.toLowerCase();
    return startups.value.filter(startup =>
      startup.Companies?.name?.toLowerCase().includes(query) ||
      startup.Companies?.description?.toLowerCase().includes(query) ||
      startup.website_url?.toLowerCase().includes(query)
    );
  });

  // Authentication computed
  const isAdmin = computed(() => {
    // Pour l'instant, on simule en vérifiant l'email ou un flag
    return user.value?.account?.email?.includes('admin') || false;
  });

  const isFounder = computed(() => {
    // Pour l'instant, on simule en vérifiant si l'utilisateur est connecté
    return isAuthenticated.value && !isAdmin.value;
  });

  // For backwards compatibility, map startups to companies format
  const companies = computed(() => 
    startups.value.map(startup => ({
      id: startup.id,
      name: startup.Companies?.name || 'Unknown Company',
      description: startup.Companies?.description || 'No description available.',
      excerpt: startup.Companies?.description?.substring(0, 150) + '...' || 'No description available.',
      tags: ['Tech'], // Default tag since sector is not available in current schema
      heroImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
      website: startup.website_url || undefined,
      type: 'startup' as const
    }))
  );

  const filteredCompanies = computed(() => {
    if (!searchQuery.value) return companies.value;
    
    const query = searchQuery.value.toLowerCase();
    return companies.value.filter(company =>
      company.name.toLowerCase().includes(query) ||
      company.description?.toLowerCase().includes(query) ||
      company.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page when searching
  };

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  // API Actions
  const fetchStartups = async (params?: { page?: number; limit?: number; search?: string }) => {
    loading.value.startups = true;
    errors.value.startups = null;
    
    try {
      const response = await api.startups.getAll(params);
      startups.value = response.data || [];
    } catch (error) {
      errors.value.startups = error instanceof Error ? error.message : 'Failed to fetch startups';
      console.error('Error fetching startups:', error);
      // Set empty array as fallback
      startups.value = [];
    } finally {
      loading.value.startups = false;
    }
  };

  const fetchPartners = async (params?: { page?: number; limit?: number; search?: string }) => {
    loading.value.partners = true;
    errors.value.partners = null;
    
    try {
      const response = await api.partners.getAll(params);
      partners.value = response.data;
    } catch (error) {
      errors.value.partners = error instanceof Error ? error.message : 'Failed to fetch partners';
      console.error('Error fetching partners:', error);
    } finally {
      loading.value.partners = false;
    }
  };

  const fetchProjects = async (params?: { page?: number; limit?: number; startup_id?: number }) => {
    loading.value.projects = true;
    errors.value.projects = null;
    
    try {
      const response = await api.projects.getAll(params);
      projects.value = response.data;
    } catch (error) {
      errors.value.projects = error instanceof Error ? error.message : 'Failed to fetch projects';
      console.error('Error fetching projects:', error);
    } finally {
      loading.value.projects = false;
    }
  };

  const fetchEvents = async (params?: { page?: number; limit?: number; upcoming?: boolean }) => {
    loading.value.events = true;
    errors.value.events = null;
    
    try {
      const response = await api.events.getAll(params);
      events.value = response.data || [];
    } catch (error) {
      errors.value.events = error instanceof Error ? error.message : 'Failed to fetch events';
      console.error('Error fetching events:', error);
      events.value = [];
    } finally {
      loading.value.events = false;
    }
  };

  const fetchNews = async (params?: { page?: number; limit?: number; company_id?: number }) => {
    loading.value.news = true;
    errors.value.news = null;
    
    try {
      const response = await api.news.getAll(params);
      news.value = response.data || [];
    } catch (error) {
      errors.value.news = error instanceof Error ? error.message : 'Failed to fetch news';
      console.error('Error fetching news:', error);
      news.value = [];
    } finally {
      loading.value.news = false;
    }
  };

  const fetchUsers = async (params?: { page?: number; limit?: number; type?: 'founder' | 'admin' | 'investor' }) => {
    loading.value.users = true;
    errors.value.users = null;
    
    try {
      const response = await api.users.getAll(params);
      users.value = response.data;
    } catch (error) {
      errors.value.users = error instanceof Error ? error.message : 'Failed to fetch users';
      console.error('Error fetching users:', error);
    } finally {
      loading.value.users = false;
    }
  };

  const fetchReferenceData = async () => {
    loading.value.reference = true;
    errors.value.reference = null;
    
    try {
      const [
        sectorsRes,
        legalStatusesRes,
        partnerTypesRes,
        projectStatusesRes,
        eventCategoriesRes,
        targetAudiencesRes,
        investorTypesRes,
        investmentFocusRes,
      ] = await Promise.allSettled([
        api.reference.getSectors(),
        api.reference.getLegalStatuses(),
        api.reference.getPartnerTypes(),
        api.reference.getProjectStatuses(),
        api.reference.getEventCategories(),
        api.reference.getTargetAudiences(),
        api.reference.getInvestorTypes(),
        api.reference.getInvestmentFocus(),
      ]);

      sectors.value = sectorsRes.status === 'fulfilled' ? sectorsRes.value.data || [] : [];
      legalStatuses.value = legalStatusesRes.status === 'fulfilled' ? legalStatusesRes.value.data || [] : [];
      partnerTypes.value = partnerTypesRes.status === 'fulfilled' ? partnerTypesRes.value.data || [] : [];
      projectStatuses.value = projectStatusesRes.status === 'fulfilled' ? projectStatusesRes.value.data || [] : [];
      eventCategories.value = eventCategoriesRes.status === 'fulfilled' ? eventCategoriesRes.value.data || [] : [];
      targetAudiences.value = targetAudiencesRes.status === 'fulfilled' ? targetAudiencesRes.value.data || [] : [];
      investorTypes.value = investorTypesRes.status === 'fulfilled' ? investorTypesRes.value.data || [] : [];
      investmentFocus.value = investmentFocusRes.status === 'fulfilled' ? investmentFocusRes.value.data || [] : [];
    } catch (error) {
      errors.value.reference = error instanceof Error ? error.message : 'Failed to fetch reference data';
      console.error('Error fetching reference data:', error);
      // Set empty arrays as fallback
      sectors.value = [];
      legalStatuses.value = [];
      partnerTypes.value = [];
      projectStatuses.value = [];
      eventCategories.value = [];
      targetAudiences.value = [];
      investorTypes.value = [];
      investmentFocus.value = [];
    } finally {
      loading.value.reference = false;
    }
  };

  // Initialize data - only startups
  const initializeApp = async () => {
    try {
      await Promise.allSettled([
        fetchStartups({ limit: 20 }),
        fetchEvents({ limit: 10, upcoming: true }),
        fetchNews({ limit: 10 }),
        fetchReferenceData(),
      ]);
    } catch (error) {
      console.error('Failed to initialize app data:', error);
      // Don't throw here, let individual fetch functions handle their own errors
    }
  };

  // Authentication actions

  // Unified handler for login/signup
  const handleAuth = async (mode: 'login' | 'signup', payload: { email: string; password: string; name?: string }) => {
    loading.value.auth = true;
    errors.value.auth = null;
    try {
      let response;
      if (mode === 'login') {
        if (!payload.email || !payload.password) throw new Error('Email and password are required');
        response = await api.auth.login({ email: payload.email, password: payload.password });
      } else {
        if (!payload.name || !payload.email || !payload.password) throw new Error('Name, email, and password are required');
        response = await api.auth.signup({ name: payload.name, email: payload.email, password: payload.password });
      }
      if (response && response.data && response.data.token && response.data.user) {
        authToken.value = response.data.token;
        user.value = response.data.user;
        isAuthenticated.value = true;
        localStorage.setItem('auth_token', authToken.value);
        localStorage.setItem('user', JSON.stringify(user.value));
        return { success: true };
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (error: any) {
      errors.value.auth = error?.response?.data?.message || error?.message || 'Authentication failed';
      return { success: false, error: errors.value.auth };
    } finally {
      loading.value.auth = false;
    }
  };

  // Login action
  const login = async (email: string, password: string) => {
    return handleAuth('login', { email, password });
  };

  // Signup action
  const signup = async (name: string, email: string, password: string) => {
    return handleAuth('signup', { name, email, password });
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    authToken.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        user.value = JSON.parse(userData);
        authToken.value = token;
        isAuthenticated.value = true;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  };

  return {
    // State
    startups,
    partners,
    projects,
    events,
    news,
    users,
    sectors,
    legalStatuses,
    partnerTypes,
    projectStatuses,
    eventCategories,
    targetAudiences,
    investorTypes,
    investmentFocus,
    loading,
    errors,
    searchQuery,
    currentPage,
    itemsPerPage,
    
    // Authentication state
    user,
    isAuthenticated,
    authToken,
    
    // Computed
    filteredStartups,
    companies,
    filteredCompanies,
    isAdmin,
    isFounder,
    
    // Actions
    setSearchQuery,
    setCurrentPage,
    fetchStartups,
    fetchPartners,
    fetchProjects,
    fetchEvents,
    fetchNews,
    fetchUsers,
    fetchReferenceData,
    initializeApp,
    
    // Authentication actions
    login,
    signup,
    logout,
    checkAuthStatus,
    };
});