'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scissors, Download, RefreshCw } from 'lucide-react';
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

export function EnhancedImageCropTool() {
  const { domainConfig } = useDomain();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [cropSettings, setCropSettings] = useState({
    width: '4878',
    height: '3135',
    x: '610',
    y: '392'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const steps = ['Add files', 'Crop options', 'Process', 'Download'];

  useEffect(() => {
    if (files.length > 0) {
      setCurrentStep(1);
      // Set preview for first image
      const url = URL.createObjectURL(files[0].file);
      setPreviewImage(url);
    } else {
      setCurrentStep(0);
      setPreviewImage(null);
    }
  }, [files]);

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
    setResults([]);
  };

  const cropImages = async () => {
    if (files.length === 0) {
      toast.error('Please select images to crop');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);
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
    setCurrentStep(3);
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

        const width = parseInt(cropSettings.width);
        const height = parseInt(cropSettings.height);
        const x = parseInt(cropSettings.x);
        const y = parseInt(cropSettings.y);

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              filename: file.name.replace(/\.[^/.]+$/, '') + '_cropped.jpg',
              url,
              size: blob.size,
              preview: url,
              type: 'image/jpeg'
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

  if (!domainConfig) return null;

  return (
    <ToolLayout
      title="Crop IMAGE"
      description="Crop JPG, PNG or GIF by defining a rectangle in pixels. Cut your image online."
      icon={<Scissors className="h-6 w-6" />}
    >
      <div className="space-y-8">
        {/* Processing Steps */}
        <ProcessingSteps currentStep={currentStep} steps={steps} />

        {files.length === 0 ? (
          /* Step 1: Upload */
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Crop IMAGE</h2>
                <p className="text-lg text-gray-600">
                  Crop <strong>JPG</strong>, <strong>PNG</strong> or <strong>GIF</strong> with ease.
                  <br />
                  Choose pixels to define your rectangle or use our visual editor.
                </p>
              </div>
              
              <FileUploadZone
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
                maxFiles={20}
                maxSize={50 * 1024 * 1024}
                onFilesChange={handleFilesChange}
                supportsBulk={true}
                title="Select images"
                subtitle="or drop images here"
                buttonText="Select images"
              />
            </div>
          </div>
        ) : results.length === 0 ? (
          /* Step 2 & 3: Configure and Process */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {previewImage && (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-auto"
                        style={{ maxHeight: '500px' }}
                      />
                      <div 
                        className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 pointer-events-none"
                        style={{
                          left: `${(parseInt(cropSettings.x) / 4878) * 100}%`,
                          top: `${(parseInt(cropSettings.y) / 3135) * 100}%`,
                          width: `${(parseInt(cropSettings.width) / 4878) * 100}%`,
                          height: `${(parseInt(cropSettings.height) / 3135) * 100}%`
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Crop Options */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Crop options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        value={cropSettings.width}
                        onChange={(e) => setCropSettings(prev => ({ ...prev, width: e.target.value }))}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={cropSettings.height}
                        onChange={(e) => setCropSettings(prev => ({ ...prev, height: e.target.value }))}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position X (px)</Label>
                      <Input
                        type="number"
                        value={cropSettings.x}
                        onChange={(e) => setCropSettings(prev => ({ ...prev, x: e.target.value }))}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position Y (px)</Label>
                      <Input
                        type="number"
                        value={cropSettings.y}
                        onChange={(e) => setCropSettings(prev => ({ ...prev, y: e.target.value }))}
                        className="text-right"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={cropImages}
                    disabled={isProcessing}
                    className="w-full text-white text-lg py-6 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Cropping...
                      </>
                    ) : (
                      <>
                        <Scissors className="h-5 w-5 mr-2" />
                        Crop IMAGE
                      </>
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
            onDownload={downloadImage}
            onDownloadAll={downloadAll}
            showPreview={true}
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolLayout>
  );
}