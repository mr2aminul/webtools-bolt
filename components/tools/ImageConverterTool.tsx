'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/tools/FileUploader';
import { Image, Download, RefreshCw, ArrowLeft } from 'lucide-react';
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

export function ImageConverterTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setResults([]);
  };

  const convertImages = async () => {
    if (files.length === 0) {
      toast.error('Please select images to convert');
      return;
    }

    setIsProcessing(true);
    const newResults: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      
      try {
        const updatedFiles = [...files];
        updatedFiles[i] = { ...fileItem, status: 'processing', progress: 0 };
        setFiles(updatedFiles);

        const result = await processImage(fileItem.file);
        newResults.push(result);

        updatedFiles[i] = { ...fileItem, status: 'completed', progress: 100, result };
        setFiles(updatedFiles);
      } catch (error) {
        const updatedFiles = [...files];
        updatedFiles[i] = { ...fileItem, status: 'error', error: 'Failed to convert image' };
        setFiles(updatedFiles);
      }
    }

    setResults(newResults);
    setIsProcessing(false);
    toast.success(`Successfully converted ${newResults.length} image(s)!`);
  };

  const processImage = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error('Canvas not available'));
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);

        const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
        const quality = outputFormat === 'jpg' ? 0.9 : undefined;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              url,
              blob,
              filename: file.name.replace(/\.[^/.]+$/, '') + `.${outputFormat}`,
              originalFormat: file.type,
              newFormat: mimeType,
              size: blob.size
            });
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, mimeType, quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadImage = (result: any) => {
    const link = document.createElement('a');
    link.download = result.filename;
    link.href = result.url;
    link.click();
    toast.success('Image downloaded!');
  };

  const downloadAll = () => {
    results.forEach((result, index) => {
      setTimeout(() => downloadImage(result), index * 100);
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
                <Image className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Convert Image</h1>
                <p className="text-sm text-gray-600">Convert images between different formats</p>
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Convert to {outputFormat.toUpperCase()}</h2>
                <p className="text-gray-600 mb-8">
                  Turn <strong>PNG</strong>, <strong>GIF</strong>, <strong>TIF</strong>, <strong>PSD</strong>, <strong>SVG</strong>, 
                  <strong>WEBP</strong>, <strong>HEIC</strong> or <strong>RAW</strong> format images to <strong>{outputFormat.toUpperCase()}</strong> in bulk with ease.
                </p>
                
                <div className="max-w-md mx-auto mb-6">
                  <Label htmlFor="format" className="block mb-2">Convert to:</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="max-w-md mx-auto">
                  <FileUploader
                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'] }}
                    maxFiles={20}
                    maxSize={50 * 1024 * 1024}
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
                    <CardTitle>Conversion Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="format">Output Format</Label>
                      <Select value={outputFormat} onValueChange={setOutputFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={convertImages}
                      disabled={isProcessing}
                      className="w-full text-white"
                      style={{
                        background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        `Convert to ${outputFormat.toUpperCase()}`
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {results.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Converted Images</CardTitle>
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
                            <img
                              src={result.url}
                              alt="Converted"
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{result.filename}</p>
                              <p className="text-sm text-gray-600">
                                {formatFileSize(result.size)} • {outputFormat.toUpperCase()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadImage(result)}
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

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}