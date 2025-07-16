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
  