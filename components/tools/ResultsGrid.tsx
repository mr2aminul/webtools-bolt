'use client';

import { Download, Share2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface ResultItem {
  id: string;
  filename: string;
  url: string;
  size?: number;
  preview?: string;
  type?: string;
}

interface ResultsGridProps {
  results: ResultItem[];
  onDownload: (result: ResultItem) => void;
  onDownloadAll?: () => void;
  showPreview?: boolean;
}

export function ResultsGrid({ results, onDownload, onDownloadAll, showPreview = true }: ResultsGridProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyLink = (result: ResultItem) => {
    navigator.clipboard.writeText(result.url);
    toast.success('Link copied to clipboard!');
  };

  const shareResult = (result: ResultItem) => {
    if (navigator.share) {
      navigator.share({
        title: result.filename,
        url: result.url
      });
    } else {
      copyLink(result);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Results ({results.length})
        </h3>
        {results.length > 1 && onDownloadAll && (
          <Button onClick={onDownloadAll} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <Card key={result.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              {/* Preview */}
              {showPreview && result.preview && (
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={result.preview} 
                    alt={result.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* File Info */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 truncate" title={result.filename}>
                    {result.filename}
                  </h4>
                  {result.size && (
                    <p className="text-sm text-gray-500">{formatFileSize(result.size)}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onDownload(result)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyLink(result)}
                    className="px-3"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareResult(result)}
                    className="px-3"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Try Another Tool */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-gray-600 mb-4">Need to process more files?</p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Try Another Tool
          </Button>
          <Button variant="outline">
            Process More Files
          </Button>
        </div>
      </div>
    </div>
  );
}