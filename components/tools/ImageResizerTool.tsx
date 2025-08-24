'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '@/components/tools/FileUploader';
import { Image, Download, RefreshCw, ArrowLeft, Link as LinkIcon } from 'lucide-react';
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

export function ImageResizerTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState('0.9');
  const [format, setFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setResults([]);
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (maintainAspectRatio && files.length > 0) {
      // Calculate aspect ratio from first file
      const firstFile = files[0];
      if (firstFile.file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          setHeight(Math.round(parseInt(value) * aspectRatio).toString());
        };
        img.src = URL.createObjectURL(firstFile.file);
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (maintainAspectRatio && files.length > 0) {
      // Calculate aspect ratio from first file
      const firstFile = files[0];
      if (firstFile.file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          setWidth(Math.round(parseInt(value) * aspectRatio).toString());
        };
        img.src = URL.createObjectURL(firstFile.file);
      }
    }
  };

  const resizeImages = async () => {
    if (files.length === 0) {
      toast.error('Please select images to resize');
      return;
    }

    setIsProcessing(true);
    const newResults: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      
      try {
        // Update progress
        const updatedFiles = [...files];
        updatedFiles[i] = { ...fileItem, status: 'processing', progress: 0 };
        setFiles(updatedFiles);

        const result = await processImage(fileItem.file);
        newResults.push(result);

        // Update as completed
        updatedFiles[i] = { ...fileItem, status: 'completed', progress: 100, result };
        setFiles(updatedFiles);
      } catch (error) {
        // Update as error
        const updatedFiles = [...files];
        updatedFiles[i] = { ...fileItem, status: 'error', error: 'Failed to process image' };
        setFiles(updatedFiles);
      }
    }

    setResults(newResults);
    setIsProcessing(false);
    toast.success(`Successfully resized ${newResults.length} image(s)!`);
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

        const newWidth = parseInt(width);
        const newHeight = parseInt(height);

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Clear canvas and draw resized image
        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to desired format
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const qualityValue = format === 'jpeg' ? parseFloat(quality) : undefined;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              url,
              blob,
              filename: file.name.replace(/\.[^/.]+$/, '') + `_resized.${format}`,
              size: blob.size,
              dimensions: `${newWidth}x${newHeight}`
            });
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, mimeType, qualityValue);
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
    results.forEach(result => {
      setTimeout(() => downloadImage(result), 100);
    });
  };

  const presetSizes = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'HD', width: 1920, height: 1080 },
  ];

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth.toString());
    setHeight(presetHeight.toString());
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
                <Image className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Image Resizer</h1>
                <p className="text-sm text-gray-600">Resize images while maintaining quality</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload & Configuration Panel */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploader
                  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
                  maxFiles={10}
                  maxSize={50 * 1024 * 1024} // 50MB
                  onFilesChange={handleFilesChange}
                  supportsBulk={true}
                />
              </CardContent>
            </Card>

            {files.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Resize Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preset Sizes */}
                  <div className="space-y-2">
                    <Label>Quick Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {presetSizes.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset(preset.width, preset.height)}
                          className="text-xs"
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aspect-ratio"
                      checked={maintainAspectRatio}
                      onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
                    />
                    <Label htmlFor="aspect-ratio" className="flex items-center space-x-2">
                      <LinkIcon className="h-4 w-4" />
                      <span>Maintain aspect ratio</span>
                    </Label>
                  </div>

                  {/* Format & Quality */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format">Output Format</Label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {format === 'jpeg' && (
                      <div className="space-y-2">
                        <Label htmlFor="quality">Quality ({Math.round(parseFloat(quality) * 100)}%)</Label>
                        <Input
                          id="quality"
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={quality}
                          onChange={(e) => setQuality(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={resizeImages}
                    disabled={isProcessing}
                    className="w-full text-white"
                    style={{
                      background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Resize Images'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Panel */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Results</CardTitle>
                {results.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={downloadAll}>
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={result.url}
                        alt="Resized"
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
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Resized images will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}