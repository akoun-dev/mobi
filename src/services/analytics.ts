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