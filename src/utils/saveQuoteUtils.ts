import type { FormData } from '../types/types';

export type QuoteFormData = FormData;

export const saveQuoteProgress = (formData: QuoteFormData, currentStep: number) => {
  try {
    localStorage.setItem('quoteProgress', JSON.stringify({
      formData,
      currentStep,
      timestamp: new Date().getTime()
    }));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
};

export const loadQuoteProgress = () => {
  try {
    const saved = localStorage.getItem('quoteProgress');
    if (!saved) return null;
    
    const { formData, currentStep, timestamp } = JSON.parse(saved);
    
    // Vérifier si la sauvegarde a moins de 24h
    const isExpired = (new Date().getTime() - timestamp) > 24 * 60 * 60 * 1000;
    return isExpired ? null : { formData, currentStep };
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return null;
  }
};

export const clearQuoteProgress = () => {
  localStorage.removeItem('quoteProgress');
};