'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/tools/FileUploader';
import { Image, Download, RefreshCw, ArrowLeft, Scissors } from 'lucide-react';
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

export function ImageCropperTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [cropWidth, setCropWidth] = useState('400');
  const [cropHeight, setCropHeight] = useState('300');
  const [cropX, setCropX] = useState('0');
  const [cropY, setCropY] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setResults([]);
    
    // Set preview for first image
    if (newFiles.length > 0) {
      const url = URL.createObjectURL(newFiles[0].file);
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };

  const cropImages = async () => {
    if (files.length === 0) {
      toast.error('Please select images to crop');
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
        updatedFiles[i] = { ...fileItem, status: 'error', error: 'Failed to crop image' };
        setFiles(updatedFiles);
      }
    }

    setResults(newResults);
    setIsProcessing(false);
    toast.success(`Successfully cropped ${newResults.length} image(s)!`);
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

        const width = parseInt(cropWidth);
        const height = parseInt(cropHeight);
        const x = parseInt(cropX);
        const y = parseInt(cropY);

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              url,
              blob,
              filename: file.name.replace(/\.[^/.]+$/, '') + '_cropped.jpg',
              dimensions: `${width}x${height}`,
              size: blob.size
            });
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
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
                <Scissors className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Crop Image</h1>
                <p className="text-sm text-gray-600">Crop JPG, PNG or GIF by defining a rectangle in pixels</p>
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Crop IMAGE</h2>
                <p className="text-gray-600 mb-8">
                  Crop <strong>JPG</strong>, <strong>PNG</strong> or <strong>GIF</strong> with ease.
                  <br />
                  Choose pixels to define your rectangle or use our visual editor.
                </p>
                
                <div className="max-w-md mx-auto">
                  <FileUploader
                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
                    maxFiles={20}
                    maxSize={50 * 1024 * 1024}
                    onFilesChange={handleFilesChange}
                    supportsBulk={true}
                  />
                </div>
              </div>
            ) : (
              /* Processing Interface */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {previewImage && (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="max-w-full h-auto border rounded"
                        />
                        <div 
                          className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                          style={{
                            left: `${cropX}px`,
                            top: `${cropY}px`,
                            width: `${cropWidth}px`,
                            height: `${cropHeight}px`
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Crop Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Crop options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Width (px)</Label>
                        <Input
                          type="number"
                          value={cropWidth}
                          onChange={(e) => setCropWidth(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (px)</Label>
                        <Input
                          type="number"
                          value={cropHeight}
                          onChange={(e) => setCropHeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Position X (px)</Label>
                        <Input
                          type="number"
                          value={cropX}
                          onChange={(e) => setCropX(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position Y (px)</Label>
                        <Input
                          type="number"
                          value={cropY}
                          onChange={(e) => setCropY(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={cropImages}
                      disabled={isProcessing}
                      className="w-full text-white"
                      style={{
                        background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Cropping...
                        </>
                      ) : (
                        <>
                          <Scissors className="h-4 w-4 mr-2" />
                          Crop IMAGE
                        </>
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
                    <CardTitle>Cropped Images</CardTitle>
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
                          alt="Cropped"
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{result.filename}</p>
                          <p className="text-sm text-gray-600">
                            {result.dimensions} • {formatFileSize(result.size)}
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