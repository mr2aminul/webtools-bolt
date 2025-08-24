'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Download, ArrowUp, ArrowDown, X, RotateCcw, Eye } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages: number;
  thumbnail?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export function PDFMergerTool() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: PDFFile[] = [];
    
    for (const file of acceptedFiles) {
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();
          
          // Generate thumbnail (simplified)
          const thumbnail = await generateThumbnail(file);
          
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            pages: pageCount,
            thumbnail,
            status: 'pending',
            progress: 0
          });
        } catch (error) {
          toast.error(`Failed to load PDF: ${file.name}`);
        }
      } else {
        toast.error(`${file.name} is not a valid PDF file`);
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const generateThumbnail = async (file: File): Promise<string> => {
    // Simplified thumbnail generation
    // In production, you'd use PDF.js to render the first page
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iI0VGNDQ0NCIvPgo8dGV4dCB4PSIyMCIgeT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBERjwvdGV4dD4KPC9zdmc+';
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingProgress((i / files.length) * 100);
        
        // Update file status
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing', progress: 50 } : f
        ));

        const arrayBuffer = await file.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        
        // Update file status
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
        ));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setMergedPdfUrl(url);
      setProcessingProgress(100);
      toast.success('PDFs merged successfully!');
      
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast.error('Failed to merge PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMergedPDF = () => {
    if (!mergedPdfUrl) return;
    
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'merged-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Merged PDF downloaded!');
  };

  const resetTool = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    setProcessingProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Merge PDF</h1>
              <p className="text-gray-600">Combine PDF files in the order you want with the easiest PDF merger available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {files.length === 0 ? (
          /* Upload Interface */
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors">
              <CardContent className="p-12">
                <div {...getRootProps()} className="text-center cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="space-y-6">
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                      <Upload className="h-12 w-12 text-red-500" />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isDragActive ? 'Drop PDF files here' : 'Select PDF files'}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        or drop PDF files here
                      </p>
                      <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg">
                        Select PDF files
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Up to 20 files</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Max 100MB per file</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>100% secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Easy to use</h3>
                  <p className="text-gray-600 text-sm">Simply drag and drop your PDF files and reorder them as needed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preview pages</h3>
                  <p className="text-gray-600 text-sm">See thumbnails of your PDF pages before merging</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fast processing</h3>
                  <p className="text-gray-600 text-sm">Merge PDFs quickly with our optimized processing engine</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Processing Interface */
          <div className="max-w-6xl mx-auto space-y-8">
            {/* File List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>PDF Files ({files.length})</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={resetTool}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Start Over
                    </Button>
                    <Button 
                      onClick={mergePDFs}
                      disabled={isProcessing || files.length < 2}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      {isProcessing ? 'Merging...' : `Merge ${files.length} PDFs`}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        <img 
                          src={file.thumbnail} 
                          alt="PDF thumbnail"
                          className="w-12 h-12 rounded border"
                        />
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {index + 1}. {file.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {file.pages} pages • {formatFileSize(file.size)}
                          </span>
                        </div>
                        
                        {file.status === 'processing' && (
                          <Progress value={file.progress} className="h-2" />
                        )}
                        
                        {file.status === 'completed' && (
                          <div className="text-sm text-green-600">✓ Ready to merge</div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0 || isProcessing}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === files.length - 1 || isProcessing}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          disabled={isProcessing}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add More Files */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div {...getRootProps()} className="cursor-pointer">
                    <input {...getInputProps()} />
                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 transition-colors">
                      <Upload className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">Add more PDF files</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Progress */}
            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <h3 className="text-lg font-semibold">Merging PDFs...</h3>
                    <Progress value={processingProgress} className="max-w-md mx-auto" />
                    <p className="text-gray-600">Processing {files.length} PDF files</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Download Result */}
            {mergedPdfUrl && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800">PDF Merged Successfully!</h3>
                    <p className="text-green-700">Your {files.length} PDF files have been combined into one document</p>
                    <Button 
                      onClick={downloadMergedPDF}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Merged PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}