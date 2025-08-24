'use client';

import { useDomain } from '@/lib/hooks/useDomain';
import { Tool } from '@/lib/config/tools';
import { JSONFormatterTool } from '@/components/tools/production/JSONFormatterTool';
import { QRGeneratorTool } from '@/components/tools/production/QRGeneratorTool';
import { ImageResizerTool } from '@/components/tools/ImageResizerTool';
import { PDFMergerTool } from '@/components/tools/production/PDFMergerTool';
import { ImageCompressorTool } from '@/components/tools/production/ImageCompressorTool';
import { ImageConverterTool } from '@/components/tools/ImageConverterTool';
import { ImageCropperTool } from '@/components/tools/ImageCropperTool';
import { PDFSplitterTool } from '@/components/tools/PDFSplitterTool';
import { PDFCompressorTool } from '@/components/tools/PDFCompressorTool';
import { HTMLFormatterTool } from '@/components/tools/HTMLFormatterTool';
import { CSSFormatterTool } from '@/components/tools/CSSFormatterTool';
import { Base64EncoderTool } from '@/components/tools/Base64EncoderTool';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ToolPageClientProps {
  tool: Tool;
}

export function ToolPageClient({ tool }: ToolPageClientProps) {
  const { domainConfig } = useDomain();

  if (!domainConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const renderTool = () => {
    switch (tool.slug) {
      case 'json-formatter':
        return <JSONFormatterTool />;
      case 'qr-generator':
        return <QRGeneratorTool />;
      case 'resize-image':
        return <ImageResizerTool />;
      case 'merge-pdf':
        return <PDFMergerTool />;
      case 'compress-image':
        return <ImageCompressorTool />;
      case 'convert-image':
        return <ImageConverterTool />;
      case 'crop-image':
        return <ImageCropperTool />;
      case 'split-pdf':
        return <PDFSplitterTool />;
      case 'compress-pdf':
        return <PDFCompressorTool />;
      case 'html-formatter':
        return <HTMLFormatterTool />;
      case 'css-formatter':
        return <CSSFormatterTool />;
      case 'base64-encoder':
        return <Base64EncoderTool />;
      default:
        return (
          <div className="min-h-screen bg-gray-50">
            {/* Header Ad */}
            <div className="container mx-auto px-4 pt-4">
              <AdBanner slot="tool-header" format="horizontal" />
            </div>

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
                <Link href="/" className="mt-6 inline-block">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Tools
                  </Button>
                </Link>
              </div>
            </div>

            {/* Footer Ad */}
            <div className="container mx-auto px-4 pb-4">
              <AdBanner slot="tool-footer" format="horizontal" />
            </div>
          </div>
        );
    }
  };

  return renderTool();
}