"use client";

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Image, Upload, Download, RefreshCw, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ImageResize() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState('0.9');
  const [format, setFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setWidth(img.width.toString());
      setHeight(img.height.toString());
    };
    img.src = URL.createObjectURL(file);
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (maintainAspectRatio && originalImage) {
      const aspectRatio = originalImage.height / originalImage.width;
      setHeight(Math.round(parseInt(value) * aspectRatio).toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (maintainAspectRatio && originalImage) {
      const aspectRatio = originalImage.width / originalImage.height;
      setWidth(Math.round(parseInt(value) * aspectRatio).toString());
    }
  };

  const resizeImage = async () => {
    if (!originalImage || !selectedFile) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newWidth = parseInt(width);
    const newHeight = parseInt(height);

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Clear canvas and draw resized image
    ctx.clearRect(0, 0, newWidth, newHeight);
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

    // Convert to desired format
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const qualityValue = format === 'jpeg' ? parseFloat(quality) : undefined;
    
    const resizedDataUrl = canvas.toDataURL(mimeType, qualityValue);
    setResizedImage(resizedDataUrl);
    setIsProcessing(false);
  };

  const downloadImage = () => {
    if (!resizedImage || !selectedFile) return;

    const link = document.createElement('a');
    const filename = selectedFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${filename}_resized.${format}`;
    link.href = resizedImage;
    link.click();
  };

  const resetAll = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setResizedImage(null);
    setWidth('800');
    setHeight('600');
    setMaintainAspectRatio(true);
    setQuality('0.9');
    setFormat('jpeg');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Image className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Image Resizer</h1>
                <p className="text-sm text-slate-600">Resize images while maintaining quality</p>
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
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div>
                      <Image className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <p className="font-medium text-slate-700">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">
                        {originalImage ? `${originalImage.width} × ${originalImage.height}px` : 'Loading...'}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                        e.stopPropagation();
                        resetAll();
                      }}>
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                      <p className="text-slate-600">Click to select an image</p>
                      <p className="text-sm text-slate-500">Supports JPG, PNG, WebP</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {originalImage && (
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
                    onClick={resizeImage}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Resize Image'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview</CardTitle>
                {resizedImage && (
                  <Button variant="outline" size="sm" onClick={downloadImage}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Original Image Preview */}
                {originalImage && (
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Original</Label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                      <img
                        src={originalImage.src}
                        alt="Original"
                        className="max-w-full max-h-[200px] object-contain border border-slate-200 rounded"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      {originalImage.width} × {originalImage.height}px
                    </p>
                  </div>
                )}

                {/* Resized Image Preview */}
                {resizedImage ? (
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Resized</Label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                      <img
                        src={resizedImage}
                        alt="Resized"
                        className="max-w-full max-h-[200px] object-contain border border-slate-200 rounded shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      {width} × {height}px • {format.toUpperCase()}
                      {format === 'jpeg' && ` • ${Math.round(parseFloat(quality) * 100)}% quality`}
                    </p>
                  </div>
                ) : originalImage ? (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
                    <div className="text-slate-500">
                      <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Resized image will appear here</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
                    <div className="text-slate-500">
                      <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Upload an image to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}