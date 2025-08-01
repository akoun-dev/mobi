import TagManager from 'react-gtm-module';

const GTM_ID = 'GTM-XXXXXX'; // À remplacer par l'ID GTM réel

export const initAnalytics = () => {
  TagManager.initialize({ gtmId: GTM_ID });
};

export const trackPageView = (path: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'pageview',
    pagePath: path
  });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'customEvent',
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  });
};

export const trackFormStart = () => {
  trackEvent('Form', 'Started');
};

export const trackFormComplete = () => {
  trackEvent('Form', 'Completed');
};

export const trackQuoteSelected = (insurer: string) => {
  trackEvent('Quote', 'Selected', insurer);
};

export const trackFormStep = (step: number) => {
  trackEvent('Form', `Step ${step} Started`);
};

export const trackFilterUsed = (filterType: string) => {
  trackEvent('Filter', `Used ${filterType}`);
};

export const trackDownload = (type: 'pdf'|'email'|'whatsapp') => {
  trackEvent('Download', type);
};

export const trackError = (errorType: string) => {
  trackEvent('Error', errorType);
};

interface CustomDataLayer {
  event: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  customPrice?: number;
  customCurrency?: string;
  customInsurer?: string;
}

export const trackConversion = (insurer: string, price: number) => {
  const data: CustomDataLayer = {
    event: 'conversion',
    eventCategory: 'Conversion',
    eventAction: 'QuoteSelected',
    eventLabel: insurer,
    customPrice: price,
    customCurrency: 'FCFA',
    customInsurer: insurer
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};