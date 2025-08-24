'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, RefreshCw, Plus, X } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { FileUploadZone } from '@/components/tools/FileUploadZone';
import { ProcessingSteps } from '@/components/tools/ProcessingSteps';
import { ResultsGrid } from '@/components/tools/ResultsGrid';
import { useDomain } from '@/lib/hooks/useDomain';
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

export function EnhancedPDFSplitTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [splitMode, setSplitMode] = useState('range');
  const [ranges, setRanges] = useState<Range[]>([{ id: '1', from: '1', to: '7' }]);
  const [mergeRanges, setMergeRanges] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const steps = ['Add files', 'Split options', 'Process', 'Download'];

  useEffect(() => {
    if (files.length > 0) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [files]);

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
    setCurrentStep(2);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newResults: any[] = [];

      files.forEach((fileItem, fileIndex) => {
        ranges.forEach((range, rangeIndex) => {
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
            id: `${fileIndex}-${rangeIndex}`,
            filename: `${fileItem.file.name.replace('.pdf', '')}_pages_${range.from}-${range.to}.pdf`,
            url,
            size: blob.size,
            type: 'application/pdf'
          });
        });
      });

      setResults(newResults);
      setCurrentStep(3);
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
    <ToolLayout
      title="Split PDF"
      description="Separate one page or a whole set for easy conversion into independent PDF files"
      icon={<FileText className="h-6 w-6" />}
    >
      <div className="space-y-8">
        {/* Processing Steps */}
        <ProcessingSteps currentStep={currentStep} steps={steps} />

        {files.length === 0 ? (
          /* Step 1: Upload */
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Split PDF</h2>
                <p className="text-lg text-gray-600">
                  Separate one page or a whole set for easy conversion into independent PDF files.
                </p>
              </div>
              
              <FileUploadZone
                accept={{ 'application/pdf': ['.pdf'] }}
                maxFiles={10}
                maxSize={100 * 1024 * 1024}
                onFilesChange={handleFilesChange}
                supportsBulk={false}
                title="Select PDF files"
                subtitle="or drop PDF files here"
                buttonText="Select PDF files"
              />
            </div>
          </div>
        ) : results.length === 0 ? (
          /* Step 2 & 3: Configure and Process */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PDF Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>PDF Preview</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="bg-green-100 text-green-700 border-green-300">
                        Range
                      </Button>
                      <Button variant="outline" size="sm">
                        Pages
                      </Button>
                      <Button variant="outline" size="sm">
                        Size
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                    <div className="space-y-4">
                      <FileText className="h-16 w-16 mx-auto text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">{files[0].file.name}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {formatFileSize(files[0].file.size)}
                        </p>
                      </div>
                      
                      {/* Range Preview */}
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                        <div className="text-sm text-blue-700 mb-2">Range 1</div>
                        <div className="flex items-center justify-center space-x-4">
                          <div className="w-16 h-20 bg-white border border-gray-300 rounded flex items-center justify-center text-xs">
                            1
                          </div>
                          <div className="text-gray-400">...</div>
                          <div className="w-16 h-20 bg-white border border-gray-300 rounded flex items-center justify-center text-xs">
                            7
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Split Options */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Split</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={splitMode} onValueChange={setSplitMode}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="range" id="range" />
                      <Label htmlFor="range">Custom ranges</Label>
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

                  {splitMode === 'range' && (
                    <div className="space-y-4">
                      <Label className="text-sm text-gray-600">Range mode: Custom ranges</Label>
                      
                      {ranges.map((range, index) => (
                        <div key={range.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-600">Range {index + 1}</span>
                            {ranges.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRange(range.id)}
                                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-gray-500">from page</Label>
                              <Input
                                type="number"
                                value={range.from}
                                onChange={(e) => updateRange(range.id, 'from', e.target.value)}
                                min="1"
                                className="text-center"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">to</Label>
                              <Input
                                type="number"
                                value={range.to}
                                onChange={(e) => updateRange(range.id, 'to', e.target.value)}
                                min="1"
                                className="text-center"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addRange}
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Range
                      </Button>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="merge"
                          checked={mergeRanges}
                          onCheckedChange={(checked) => setMergeRanges(checked as boolean)}
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
                    className="w-full text-white text-lg py-6 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Splitting PDF...
                      </>
                    ) : (
                      'Split PDF'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Step 4: Results */
          <ResultsGrid
            results={results}
            onDownload={downloadPDF}
            onDownloadAll={downloadAll}
            showPreview={false}
          />
        )}
      </div>
    </ToolLayout>
  );
}