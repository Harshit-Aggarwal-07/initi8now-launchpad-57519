// Google Analytics 4 tracking utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Initialize Google Analytics (no parameters needed - reads from env)
export function initGA(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId || typeof window === 'undefined') return;

  // Create script tag for gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || '', {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};

// Specific event trackers
export const analytics = {
  // Waitlist conversions
  trackWaitlistSignup: (userType: 'student' | 'recruiter') => {
    trackEvent('waitlist_signup', {
      user_type: userType,
      event_category: 'conversion',
      event_label: `Waitlist Signup - ${userType}`,
    });
  },

  // Newsletter subscription
  trackNewsletterSignup: () => {
    trackEvent('newsletter_signup', {
      event_category: 'engagement',
      event_label: 'Newsletter Subscription',
    });
  },

  // Form interactions
  trackFormStart: (formType: string) => {
    trackEvent('form_start', {
      form_type: formType,
      event_category: 'engagement',
    });
  },

  trackFormSubmit: (formType: string) => {
    trackEvent('form_submit', {
      form_type: formType,
      event_category: 'engagement',
    });
  },

  // Button clicks
  trackButtonClick: (buttonName: string, buttonLocation: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      button_location: buttonLocation,
      event_category: 'engagement',
    });
  },

  // Navigation
  trackNavigation: (destination: string) => {
    trackEvent('navigation', {
      destination: destination,
      event_category: 'navigation',
    });
  },

  // User type toggle
  trackUserTypeToggle: (userType: 'student' | 'recruiter') => {
    trackEvent('user_type_toggle', {
      user_type: userType,
      event_category: 'engagement',
    });
  },
};
