export interface Quote {
    id: number;
    insurer: string;
    logo: string;
    price: number;
    coverage: string;
    deductible: number;
    options: string[];
    rating: number;
    details: string;
  }
  
  export interface FormData {
    age: string;
    licenseYears: string;
    accidents: string;
    usage: string;
    annualKm: string;
    vehicleValue: string;
    energy: string;
    registrationDate: string;
    seats: string;
    coverage: string;
    options: string[];
    deductible: string;
  }
  
  export interface Filters {
    insurer: string;
    coverage: string;
    maxPrice: string;
  }

  // Nouveaux types pour l'espace clients et admin
  export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    role: 'client' | 'admin';
  }

  export interface QuoteRequest {
    id: number;
    userId: number;
    userEmail: string;
    userName: string;
    formData: FormData;
    quotes: Quote[];
    selectedQuote?: Quote;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  }

  export interface AdminStats {
    totalUsers: number;
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    totalRevenue: number;
    monthlyGrowth: number;
    topInsurers: Array<{
      name: string;
      count: number;
      revenue: number;
    }>;
    recentActivity: Array<{
      id: number;
      action: string;
      user: string;
      timestamp: string;
    }>;
  }

  export interface LoginForm {
    email: string;
    password: string;
  }

  export interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }

  export interface InsurerOffer {
    id: number;
    insurerName: string;
    monthlyPrice: number;
    annualPrice: number;
    coverageType: string;
    includedOptions: string[];
    deductible: number;
    isActive: boolean;
    lastUpdated: string;
    createdBy: string;
  }

  export interface ImportRecord {
    id: number;
    fileName: string;
    importedAt: string;
    status: 'success' | 'error' | 'partial';
    recordsImported: number;
    recordsTotal: number;
    errors: string[];
    importedBy: string;
  }
  