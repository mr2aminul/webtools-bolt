export interface GAMConfig {
  clientId: string;
  slots: {
    [key: string]: {
      adUnitPath: string;
      sizes: number[][];
      targeting?: Record<string, string>;
      refreshInterval?: number;
      frequencyCap?: number;
    };
  };
}

export const GAM_CONFIG: GAMConfig = {
  clientId: process.env.NEXT_PUBLIC_GAM_CLIENT_ID || '',
  slots: {
    'header-banner': {
      adUnitPath: '/pixora/header-banner',
      sizes: [[728, 90], [970, 90], [320, 50]],
      refreshInterval: 30000,
      frequencyCap: 3
    },
    'sidebar-rectangle': {
      adUnitPath: '/pixora/sidebar-rectangle',
      sizes: [[300, 250], [336, 280]],
      refreshInterval: 45000,
      frequencyCap: 2
    },
    'inline-responsive': {
      adUnitPath: '/pixora/inline-responsive',
      sizes: [[728, 90], [300, 250], [320, 50]],
      refreshInterval: 60000
    },
    'mobile-sticky': {
      adUnitPath: '/pixora/mobile-sticky',
      sizes: [[320, 50], [300, 50]],
      targeting: { device: 'mobile' }
    },
    'video-rewarded': {
      adUnitPath: '/pixora/video-rewarded',
      sizes: [[640, 480], [480, 360]]
    },
    'interstitial': {
      adUnitPath: '/pixora/interstitial',
      sizes: [[320, 480], [768, 1024]]
    }
  }
};

export function initializeGAM() {
  if (typeof window === 'undefined' || !GAM_CONFIG.clientId) return;

  // Initialize Google Publisher Tag
  window.googletag = window.googletag || { cmd: [] };
  
  window.googletag.cmd.push(() => {
    // Enable services
    window.googletag.pubads().enableSingleRequest();
    window.googletag.pubads().collapseEmptyDivs();
    window.googletag.pubads().enableLazyLoad({
      fetchMarginPercent: 500,
      renderMarginPercent: 200,
      mobileScaling: 2.0
    });
    
    // Privacy and consent
    window.googletag.pubads().setPrivacySettings({
      restrictDataProcessing: true,
      childDirectedTreatment: false,
      underAgeOfConsent: false
    });
    
    window.googletag.enableServices();
  });
}

declare global {
  interface Window {
    googletag: any;
  }
}