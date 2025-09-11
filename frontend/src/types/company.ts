// Base Account interface
export interface Account {
  id: number;
  name: string;
  email: string;
  image_path?: string;
  created_at: string;
  deleted_at?: string;
  last_updated_at: string;
}

// Company interface - represents a business entity that extends Account
export interface Company extends Account {
  account_id: number;
  legal_status_id?: number;
  address?: string;
  phone_number?: string;
  description?: string;
  // Joined data from Account (when fetched from DB)
  Accounts?: Account;
  account?: Account;
  legal_status?: LegalStatus;
  social_medias?: SocialMedia[];
}

// Startup interface - a company with startup-specific properties
export interface Startup extends Company {
  startup_id: number;
  company_id: number;
  website_url?: string;
  // Joined company data (Backend returns "Companies" capitalized)
  Companies?: Company;
  // Related data (Prisma returns capitalized field names)
  founders?: StartupFounder[];
  Projects?: Project[];
}

// Partner interface - a company with partnership info
export interface Partner extends Company {
  partner_id: number;
  company_id: number;
  partnership_type_id?: number;
  // Joined company data
  Companies?: Company;
  partnership_type?: PartnerType;
}

// User interface - represents a person that extends Account
export interface User extends Account {
  user_id: number;
  account_id: number;
  role?: string;
  // Joined data from Account (when fetched from DB)
  account?: Account;
  Accounts?: Account;
}

// Founder interface - a user with founder-specific properties
export interface Founder extends User {
  founder_id: number;
  user_id: number;
  // Joined user data
  Users?: User;
  user?: User;
}

// StartupFounder relationship
export interface StartupFounder {
  id: number;
  startup_id: number;
  founder_id: number;
  startup?: Startup;
  founder?: Founder;
}

// Admin interface - a user with admin privileges
export interface Admin extends User {
  admin_id: number;
  user_id: number;
  Users?: User;
  user?: User;
}

// Investor interface - a user with investment-related properties
export interface Investor extends User {
  investor_id: number;
  user_id: number;
  legal_status_id?: number;
  address?: string;
  phone_number?: string;
  description?: string;
  investment_focus_id?: number;
  investor_type_id?: number;
  // Joined data
  Users?: User;
  user?: User;
  legal_status?: LegalStatus;
  investment_focus?: InvestmentFocus;
  investor_type?: InvestorType;
}

// Project interface
export interface Project {
  id: number;
  startup_id: number;
  name: string;
  project_status_id?: number;
  needs?: string;
  sector_id?: number;
  maturity?: string;
  // Joined data
  startup?: Startup;
  project_status?: ProjectStatus;
  sector?: Sector;
}

// Event interface
export interface Event {
  id: number;
  name: string;
  location?: string;
  description?: string;
  event_type_id?: number;
  target_audience_id?: number;
  // Joined data
  event_type?: EventCategory;
  target_audience?: TargetAudience;
  event_dates?: EventDate[];
}

// News interface
export interface News {
  id: number;
  title: string;
  location?: string;
  description: string;
  company_id: number;
  // Joined data
  company?: Company;
}

// Supporting interfaces
export interface LegalStatus {
  id: number;
  name: string;
}

export interface PartnerType {
  id: number;
  name: string;
}

export interface SocialMedia {
  id: number;
  url: string;
  company_id: number;
}

export interface EventDate {
  id: number;
  date: string;
  event_id: number;
}

export interface InvestorType {
  id: number;
  name: string;
}

export interface InvestmentFocus {
  id: number;
  name: string;
  sector_id: number;
  sector?: Sector;
}

export interface Sector {
  id: number;
  name: string;
}

export interface TargetAudience {
  id: number;
  name: string;
}

export interface ProjectStatus {
  id: number;
  name: string;
}

export interface EventCategory {
  id: number;
  name: string;
}

export interface ValidationError {
  id: number;
  unformatted_message: string;
  type: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation interface (keeping for UI)
export interface NavItem {
  id: string;
  name: string;
  path: string;
  icon: string;
}