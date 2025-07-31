/// <reference types="vite/client" />

interface Window {
  dataLayer: Array<{
    event: string;
    pagePath?: string;
    eventCategory?: string;
    eventAction?: string;
    eventLabel?: string;
  }>;
}
