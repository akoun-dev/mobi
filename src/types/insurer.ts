import type { InsurerOffer } from './types';

export interface Insurer {
  id: number;
  name: string;
  logo: string;
  rating: number;
  isActive?: boolean;
}

export function convertToInsurer(offer: InsurerOffer): Insurer {
  return {
    id: offer.id,
    name: offer.insurerName,
    logo: '🛡️', // Valeur par défaut
    rating: 4.0, // Valeur par défaut
    isActive: offer.isActive
  };
}

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
  subscribeUrl: string;
}