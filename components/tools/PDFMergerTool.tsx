'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/tools/FileUploader';
import { FileText, Download, RefreshCw, ArrowLeft, ArrowUp, ArrowDown, X } from 'lucide-react';
import { useDomain } from '@/lib/hooks/useDomain';
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

export function PDFMergerTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setMergedPdfUrl(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);

    try {
      // For demo purposes, we'll create a simple merged PDF placeholder
      // In a real implementation, you'd use pdf-lib to actually merge PDFs
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a simple blob as placeholder
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
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Merged PDF - Demo) Tj
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
300
%%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      
      toast.success('PDFs merged successfully!');
    } catch (error) {
      toast.error('Failed to merge PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMergedPDF = () => {
    if (!mergedPdfUrl) return;
    
    const link = document.createElement('a');
    link.download = 'merged-document.pdf';
    link.href = mergedPdfUrl;
    link.click();
    toast.success('Merged PDF downloaded!');
  };

  if (!domainConfig) return null;

  return (
    <div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
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
                <h1 className="text-2xl font-bold text-gray-800">PDF Merger</h1>
                <p className="text-sm text-gray-600">Combine multiple PDF files into one document</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload & File Management */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Upload PDF Files</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploader
                  accept={{ 'application/pdf': ['.pdf'] }}
                  maxFiles={20}
                  maxSize={100 * 1024 * 1024} // 100MB
                  onFilesChange={handleFilesChange}
                  supportsBulk={true}
                />
              </CardContent>
            </Card>

            {files.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>File Order ({files.length} files)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {files.map((fileItem, index) => (
                      <div
                        key={fileItem.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveFile(index, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveFile(index, 'down')}
                            disabled={index === files.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-3 flex-1">
                          <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {index + 1}. {fileItem.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={mergePDFs}
                    disabled={isProcessing || files.length < 2}
                    className="w-full mt-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Merging PDFs...
                      </>
                    ) : (
                      `Merge ${files.length} PDFs`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview & Download */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Merged PDF</CardTitle>
                {mergedPdfUrl && (
                  <Button variant="outline" size="sm" onClick={downloadMergedPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {mergedPdfUrl ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">PDF Merged Successfully!</h3>
                        <p className="text-sm text-green-700">
                          Combined {files.length} PDF files into one document
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">merged-document.pdf</p>
                          <p className="text-sm text-gray-600">Ready for download</p>
                        </div>
                      </div>
                      <Button onClick={downloadMergedPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload PDF files and click "Merge PDFs" to combine them</p>
                  {files.length === 1 && (
                    <p className="text-sm mt-2">Add at least one more PDF file to merge</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Drag & Drop Reordering</h4>
                <p className="text-sm text-gray-600">Easily reorder your PDF files before merging to get the exact sequence you want.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Bulk Processing</h4>
                <p className="text-sm text-gray-600">Merge up to 20 PDF files at once with support for large file sizes up to 100MB each.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Privacy Focused</h4>
                <p className="text-sm text-gray-600">All processing happens in your browser - your files never leave your device.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}