'use client';

import { useEffect, useState } from 'react';
import { getDomainConfig, DomainConfig } from '@/lib/config/domains';
import { getToolsForDomain, Tool } from '@/lib/config/tools';

export function useDomain() {
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const config = getDomainConfig(window.location.host);
      setDomainConfig(config);
      setAvailableTools(getToolsForDomain(config.categories));
      setIsLoading(false);
    }
  }, []);

  return {
    domainConfig,
    availableTools,
    isLoading,
    isGlobal: domainConfig?.isGlobal || false
  };
}