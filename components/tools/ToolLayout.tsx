'use client';

import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GAMBanner } from '@/components/ads/GAMBanner';
import { useDomain } from '@/lib/hooks/useDomain';
import Link from 'next/link';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  showAds?: boolean;
}

export function ToolLayout({ title, description, icon, children, showAds = true }: ToolLayoutProps) {
  const { domainConfig } = useDomain();

  if (!domainConfig) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Ad */}
      {showAds && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-2">
            <GAMBanner slotId="header-banner" className="mx-auto" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-xl text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                }}
              >
                {icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Tool Content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Sidebar with Ads */}
          {showAds && (
            <div className="w-80 space-y-6">
              <div className="sticky top-6">
                <GAMBanner slotId="sidebar-rectangle" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Ad */}
      {showAds && (
        <div className="bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <GAMBanner slotId="inline-responsive" className="mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}