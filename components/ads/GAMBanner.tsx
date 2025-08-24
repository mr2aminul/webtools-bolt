'use client';

import { useEffect, useRef, useState } from 'react';
import { GAM_CONFIG } from '@/lib/config/gam';

interface GAMBannerProps {
  slotId: string;
  className?: string;
  targeting?: Record<string, string>;
  onAdLoad?: () => void;
  onAdError?: () => void;
}

export function GAMBanner({ slotId, className = '', targeting, onAdLoad, onAdError }: GAMBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adSlot, setAdSlot] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!GAM_CONFIG.clientId || !GAM_CONFIG.slots[slotId]) {
      // Show placeholder in development
      return;
    }

    const slotConfig = GAM_CONFIG.slots[slotId];
    const divId = `gam-${slotId}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (adRef.current) {
      adRef.current.id = divId;
    }

    window.googletag = window.googletag || { cmd: [] };
    
    window.googletag.cmd.push(() => {
      const slot = window.googletag
        .defineSlot(slotConfig.adUnitPath, slotConfig.sizes, divId)
        ?.addService(window.googletag.pubads());

      if (slot) {
        // Apply targeting
        if (targeting) {
          Object.entries(targeting).forEach(([key, value]) => {
            slot.setTargeting(key, value);
          });
        }

        if (slotConfig.targeting) {
          Object.entries(slotConfig.targeting).forEach(([key, value]) => {
            slot.setTargeting(key, value);
          });
        }

        // Set up event listeners
        window.googletag.pubads().addEventListener('slotRenderEnded', (event: any) => {
          if (event.slot === slot) {
            if (event.isEmpty) {
              onAdError?.();
            } else {
              setIsLoaded(true);
              onAdLoad?.();
            }
          }
        });

        setAdSlot(slot);
        window.googletag.display(divId);

        // Set up auto-refresh if configured
        if (slotConfig.refreshInterval) {
          const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
              window.googletag.pubads().refresh([slot]);
            }
          }, slotConfig.refreshInterval);

          return () => clearInterval(interval);
        }
      }
    });

    return () => {
      if (adSlot) {
        window.googletag?.destroySlots([adSlot]);
      }
    };
  }, [slotId, targeting]);

  // Development placeholder
  if (process.env.NODE_ENV === 'development' || !GAM_CONFIG.clientId) {
    const slotConfig = GAM_CONFIG.slots[slotId];
    const [width, height] = slotConfig?.sizes[0] || [300, 250];
    
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 ${className}`}
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
      >
        <div className="text-center">
          <div className="text-sm font-medium">GAM Ad Slot</div>
          <div className="text-xs mt-1">{slotId}</div>
          <div className="text-xs">{width}×{height}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={adRef}
      className={`gam-ad-slot ${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    />
  );
}