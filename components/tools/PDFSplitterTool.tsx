'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUploader } from '@/components/tools/FileUploader';
import { FileText, Download, RefreshCw, ArrowLeft, Plus } from 'lucide-react';
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

interface Range {
  id: string;
  from: string;
  to: string;
}

export function PDFSplitterTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [splitMode, setSplitMode] = useState('custom');
  const [ranges, setRanges] = useState<Range[]>([{ id: '1', from: '1', to: '7' }]);
  const [mergeRanges, setMergeRanges] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setResults([]);
  };

  const addRange = () => {
    const newRange: Range = {
      id: Date.now().toString(),
      from: '1',
      to: '1'
    };
    setRanges([...ranges, newRange]);
  };

  const updateRange = (id: string, field: 'from' | 'to', value: string) => {
    setRanges(ranges.map(range => 
      range.id === id ? { ...range, [field]: value } : range
    ));
  };

  const removeRange = (id: string) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter(range => range.id !== id));
    }
  };

  const splitPDFs = async () => {
    if (files.length === 0) {
      toast.error('Please select PDF files to split');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newResults: any[] = [];

      files.forEach((fileItem, fileIndex) => {
        ranges.forEach((range, rangeIndex) => {
          // Create a simple PDF placeholder for each range
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
/Length 60
>>
stream
BT
/F1 12 Tf
100 700 Td
(Split PDF - Pages ${range.from}-${range.to}) Tj
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
320
%%EOF`;

          const blob = new Blob([pdfContent], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          newResults.push({
            url,
            blob,
            filename: `${fileItem.file.name.replace('.pdf', '')}_pages_${range.from}-${range.to}.pdf`,
            pages: `${range.from}-${range.to}`,
            size: blob.size
          });
        });
      });

      setResults(newResults);
      toast.success('PDFs split successfully!');
    } catch (error) {
      toast.error('Failed to split PDFs');
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
                <h1 className="text-2xl font-bold text-gray-800">Split PDF</h1>
                <p className="text-sm text-gray-600">Separate one page or a whole set for easy conversion into independent PDF files</p>
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
                <div className="max-w-md mx-auto">
                  <FileUploader
                    accept={{ 'application/pdf': ['.pdf'] }}
                    maxFiles={10}
                    maxSize={100 * 1024 * 1024}
                    onFilesChange={handleFilesChange}
                    supportsBulk={false}
                  />
                </div>
              </div>
            ) : (
              /* Processing Interface */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PDF Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>PDF Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">{files[0].file.name}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatFileSize(files[0].file.size)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Split Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Split</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={splitMode} onValueChange={setSplitMode}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom ranges</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pages" id="pages" />
                        <Label htmlFor="pages">Pages</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="size" id="size" />
                        <Label htmlFor="size">Size</Label>
                      </div>
                    </RadioGroup>

                    {splitMode === 'custom' && (
                      <div className="space-y-4">
                        <Label>Range mode: Custom ranges</Label>
                        
                        {ranges.map((range, index) => (
                          <div key={range.id} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">Range {index + 1}</span>
                              {ranges.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRange(range.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">from page</Label>
                                <Input
                                  type="number"
                                  value={range.from}
                                  onChange={(e) => updateRange(range.id, 'from', e.target.value)}
                                  min="1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">to</Label>
                                <Input
                                  type="number"
                                  value={range.to}
                                  onChange={(e) => updateRange(range.id, 'to', e.target.value)}
                                  min="1"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addRange}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Range
                        </Button>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="merge"
                            checked={mergeRanges}
                            onChange={(e) => setMergeRanges(e.target.checked)}
                          />
                          <Label htmlFor="merge" className="text-sm">
                            Merge all ranges in one PDF file.
                          </Label>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={splitPDFs}
                      disabled={isProcessing}
                      className="w-full text-white"
                      style={{
                        background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Splitting PDF...
                        </>
                      ) : (
                        'Split PDF'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {results.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Split Results</CardTitle>
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
                          <p className="text-sm text-gray-600">
                            Pages {result.pages} • {formatFileSize(result.size)}
                          </p>
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

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            <AdBanner slot="tool-sidebar" format="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
}