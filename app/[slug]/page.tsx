'use client';

import { useParams } from 'next/navigation';
import { getToolBySlug } from '@/lib/config/tools';
import { useDomain } from '@/lib/hooks/useDomain';
import { JsonFormatterTool } from '@/components/tools/JsonFormatterTool';
import { QRGeneratorTool } from '@/components/tools/QRGeneratorTool';
import { ImageResizerTool } from '@/components/tools/ImageResizerTool';
import { PDFMergerTool } from '@/components/tools/PDFMergerTool';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ToolPage() {
  const params = useParams();
  const { domainConfig } = useDomain();
  const slug = params.slug as string;
  const tool = getToolBySlug(slug);

  if (!tool || !domainConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-6">The requested tool could not be found.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderTool = () => {
    switch (tool.slug) {
      case 'json-formatter':
        return <JsonFormatterTool />;
      case 'qr-generator':
        return <QRGeneratorTool />;
      case 'resize-image':
        return <ImageResizerTool />;
      case 'merge-pdf':
        return <PDFMergerTool />;
      default:
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div 
                className="p-6 rounded-lg text-white text-4xl mb-6 inline-block"
                style={{
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                }}
              >
                {tool.icon}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{tool.title}</h1>
              <p className="text-lg text-gray-600 mb-8">{tool.description}</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-2">Coming Soon!</h3>
                <p className="text-yellow-700">
                  This tool is currently under development. Check back soon for the full implementation.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${domainConfig.primaryColor}10, ${domainConfig.secondaryColor}10)`
      }}
    >
      {/* Header Ad */}
      <div className="container mx-auto px-4 pt-4">
        <AdBanner slot="tool-header" format="horizontal" />
      </div>

      {/* Tool Content */}
      <div className="flex">
        <div className="flex-1">
          {renderTool()}
        </div>
        
        {/* Sidebar Ad */}
        <div className="hidden lg:block w-80 p-4">
          <div className="sticky top-20">
            <AdBanner slot="tool-sidebar" format="rectangle" />
          </div>
        </div>
      </div>

      {/* Footer Ad */}
      <div className="container mx-auto px-4 pb-4">
        <AdBanner slot="tool-footer" format="horizontal" />
      </div>
    </div>
  );
}