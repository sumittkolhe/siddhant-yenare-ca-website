import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/tracking';

export function useTracking() {
  const location = useLocation();

  // 1. Track Page View
  const trackPageView = useCallback((pageName) => {
    trackEvent('page_view', pageName);
  }, []);

  // 2. Track Service View
  const trackServiceView = useCallback((serviceId) => {
    trackEvent('service_view', serviceId);
  }, []);

  // 3. Track Button / Element Click
  const trackClick = useCallback((elementId, actionLabel = '') => {
    trackEvent('click', `${elementId}${actionLabel ? `: ${actionLabel}` : ''}`);
  }, []);

  // ─── Scroll Depth Listener ──────────────────────────────────────────────────
  useEffect(() => {
    let triggered25 = false;
    let triggered50 = false;
    let triggered75 = false;
    let triggered100 = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= 25 && !triggered25) {
        triggered25 = true;
        trackEvent('scroll', 25);
      }
      if (scrollPercent >= 50 && !triggered50) {
        triggered50 = true;
        trackEvent('scroll', 50);
      }
      if (scrollPercent >= 75 && !triggered75) {
        triggered75 = true;
        trackEvent('scroll', 75);
      }
      if (scrollPercent >= 98 && !triggered100) {
        triggered100 = true;
        trackEvent('scroll', 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once to initialize
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Route Change Listener ──────────────────────────────────────────────────
  useEffect(() => {
    // Record page view whenever path changes
    const pageName = location.pathname === '/' ? 'home' : location.pathname.substring(1);
    trackPageView(pageName);
  }, [location.pathname, trackPageView]);

  return {
    trackPageView,
    trackServiceView,
    trackClick,
  };
}
