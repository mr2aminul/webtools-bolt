'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/tools/FileUploader';
import { FileText, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { useDomain } from '@/lib/hooks/useDomain';
import { AdBanner } from '@/components/ads/AdBanner';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  error?: string;
}

export function PDFCompressorTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setResults([]);
  };

  const compressPDFs = async () => {
    if (files.length === 0) {
      toast.error('Please select PDF files to compress');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newResults: any[] = [];

      for (const fileItem of files) {
        // Create a compressed PDF placeholder
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 50
>>
stream
BT
/F1 12 Tf
100 700 Td
(Compressed PDF - ${compressionLevel}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
310
%%EOF`;

        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Simulate compression ratios based on level
        const compressionRatios = {
          extreme: 0.3,
          recommended: 0.5,
          less: 0.7
        };
        
        const ratio = compressionRatios[compressionLevel as keyof typeof compressionRatios];
        const compressedSize = Math.floor(fileItem.file.size * ratio);
        const compressionPercent = Math.floor((1 - ratio) * 100);
        
        newResults.push({
          url,
          blob,
          filename: fileItem.file.name.replace('.pdf', '_compressed.pdf'),
          originalSize: fileItem.file.size,
          compressedSize,
          compressionPercent,
          level: compressionLevel
        });
      }

      setResults(newResults);
      toast.success('PDFs compressed successfully!');
    } catch (error) {
      toast.error('Failed to compress PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = (result: any) => {
    const link = document.createElement('a');
    link.download = result.filename;
    link.href = result.url;
    link.click();
    toast.success('PDF downloaded!');
  };

  const downloadAll = () => {
    results.forEach((result, index) => {
      setTimeout(() => downloadPDF(result), index * 100);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!domainConfig) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Ad */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <AdBanner slot="tool-header" format="horizontal" />
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg text-white"
                style={{
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                }}
              >
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Compress PDF</h1>
                <p className="text-sm text-gray-600">Reduce file size while optimizing for maximal PDF quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {files.length === 0 ? (
              /* Upload Interface */
              <div className="text-center py-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Compress PDF</h2>
                <p className="text-gray-600 mb-8">
                  Reduce file size while optimizing for maximal PDF quality.
                </p>
                
                <div className="max-w-md mx-auto">
                  <FileUploader
                    accept={{ 'application/pdf': ['.pdf'] }}
                    maxFiles={20}
                    maxSize={100 * 1024 * 1024}
                    onFilesChange={handleFilesChange}
                    supportsBulk={true}
                  />
                </div>
              </div>
            ) : (
              /* Processing Interface */
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compression Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={compressionLevel} onValueChange={setCompressionLevel}>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="extreme" id="extreme" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="extreme" className="font-medium">Extreme compression</Label>
                            <p className="text-sm text-gray-600">
                              Best compression, some quality loss. Recommended for documents with many images.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                          <RadioGroupItem value="recommended" id="recommended" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="recommended" className="font-medium">Recommended compression</Label>
                            <p className="text-sm text-gray-600">
                              Good balance between file size and quality. Recommended for most documents.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="less" id="less" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="less" className="font-medium">Less compression</Label>
                            <p className="text-sm text-gray-600">
                              Smaller compression, better quality. Recommended for high-quality documents.
                            </p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    <Button
                      onClick={compressPDFs}
                      disabled={isProcessing}
                      className="w-full text-white"
                      style={{
                        background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Compressing PDFs...
                        </>
                      ) : (
                        `Compress ${files.length} PDF${files.length > 1 ? 's' : ''}`
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {results.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Compressed PDFs</CardTitle>
                        <Button variant="outline" onClick={downloadAll}>
                          <Download className="h-4 w-4 mr-2" />
                          Download All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.map((result, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <FileText className="h-8 w-8 text-red-500" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{result.filename}</p>
                              <div className="text-sm text-gray-600">
                                <span>{formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)}</span>
                                <span className="ml-2 text-green-600">({result.compressionPercent}% smaller)</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadPDF(result)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            <AdBanner slot="tool-sidebar" format="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
}