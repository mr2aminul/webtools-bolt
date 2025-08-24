'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Image, Upload, Download, Settings, RotateCcw, Zap } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
  compressedUrl?: string;
  compressedSize?: number;
  compressionRatio?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export function ImageCompressorTool() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState([80]);
  const [outputFormat, setOutputFormat] = useState('auto');
  const [maxWidth, setMaxWidth] = useState([1920]);
  const [maxHeight, setMaxHeight] = useState([1080]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('balanced');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ImageFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const getCompressionOptions = () => {
    const baseOptions = {
      maxSizeMB: compressionLevel === 'extreme' ? 0.1 : compressionLevel === 'high' ? 0.5 : 1,
      maxWidthOrHeight: Math.max(maxWidth[0], maxHeight[0]),
      useWebWorker: true,
      fileType: outputFormat === 'auto' ? undefined : `image/${outputFormat}`,
      initialQuality: quality[0] / 100
    };

    if (compressionLevel === 'extreme') {
      return { ...baseOptions, maxIteration: 20, alwaysKeepResolution: false };
    } else if (compressionLevel === 'high') {
      return { ...baseOptions, maxIteration: 10, alwaysKeepResolution: true };
    } else {
      return { ...baseOptions, maxIteration: 5, alwaysKeepResolution: true };
    }
  };

  const compressImage = async (imageFile: ImageFile): Promise<void> => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === imageFile.id ? { ...f, status: 'processing', progress: 0 } : f
      ));

      const options = getCompressionOptions();
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === imageFile.id && f.progress < 90 
            ? { ...f, progress: f.progress + 10 } 
            : f
        ));
      }, 200);

      const compressedFile = await imageCompression(imageFile.file, options);
      
      clearInterval(progressInterval);
      
      const compressedUrl = URL.createObjectURL(compressedFile);
      const compressionRatio = ((imageFile.size - compressedFile.size) / imageFile.size * 100);
      
      setFiles(prev => prev.map(f => 
        f.id === imageFile.id 
          ? { 
              ...f, 
              status: 'completed', 
              progress: 100,
              compressedUrl,
              compressedSize: compressedFile.size,
              compressionRatio
            } 
          : f
      ));

    } catch (error) {
      console.error('Compression error:', error);
      setFiles(prev => prev.map(f => 
        f.id === imageFile.id ? { ...f, status: 'error', progress: 0 } : f
      ));
      toast.error(`Failed to compress ${imageFile.name}`);
    }
  };

  const compressAllImages = async () => {
    setIsProcessing(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    // Process files in batches of 3 for better performance
    const batchSize = 3;
    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      const batch = pendingFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(file => compressImage(file)));
    }
    
    setIsProcessing(false);
    toast.success('All images compressed successfully!');
  };

  const downloadImage = (file: ImageFile) => {
    if (!file.compressedUrl) return;
    
    const link = document.createElement('a');
    link.href = file.compressedUrl;
    link.download = file.name.replace(/\.[^/.]+$/, '_compressed.jpg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.compressedUrl);
    if (completedFiles.length === 0) return;

    const zip = new JSZip();
    
    for (const file of completedFiles) {
      const response = await fetch(file.compressedUrl!);
      const blob = await response.blob();
      const fileName = file.name.replace(/\.[^/.]+$/, '_compressed.jpg');
      zip.file(fileName, blob);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compressed_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('All images downloaded as ZIP!');
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const resetTool = () => {
    files.forEach(file => {
      URL.revokeObjectURL(file.preview);
      if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
    });
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalCompressedSize = files.reduce((sum, file) => sum + (file.compressedSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
              <Image className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compress Image</h1>
              <p className="text-gray-600">Reduce image file size up to 80% while maintaining quality</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {files.length === 0 ? (
          /* Upload Interface */
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardContent className="p-12">
                <div {...getRootProps()} className="text-center cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="space-y-6">
                    <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="h-12 w-12 text-blue-500" />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isDragActive ? 'Drop images here' : 'Select images'}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        or drop images here
                      </p>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg">
                        Select images
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>JPG, PNG, WebP, GIF</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Up to 50MB per image</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Batch processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compression Levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCompressionLevel('balanced')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Balanced</h3>
                  <p className="text-gray-600 text-sm">Good compression with quality preservation</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCompressionLevel('high')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
                  <p className="text-gray-600 text-sm">Minimal compression, maximum quality</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCompressionLevel('extreme')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Maximum</h3>
                  <p className="text-gray-600 text-sm">Extreme compression for smallest files</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Processing Interface */
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Settings Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Compression Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Quality */}
                  <div className="space-y-2">
                    <Label>Quality: {quality[0]}%</Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Output Format */}
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (Original)</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Max Width */}
                  <div className="space-y-2">
                    <Label>Max Width: {maxWidth[0]}px</Label>
                    <Slider
                      value={maxWidth}
                      onValueChange={setMaxWidth}
                      max={4000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Max Height */}
                  <div className="space-y-2">
                    <Label>Max Height: {maxHeight[0]}px</Label>
                    <Slider
                      value={maxHeight}
                      onValueChange={setMaxHeight}
                      max={4000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={resetTool}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Start Over
                    </Button>
                    <Button {...getRootProps()} variant="outline">
                      <input {...getInputProps()} />
                      <Upload className="h-4 w-4 mr-2" />
                      Add More Images
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={compressAllImages}
                    disabled={isProcessing || files.every(f => f.status !== 'pending')}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isProcessing ? 'Compressing...' : `Compress ${files.filter(f => f.status === 'pending').length} Images`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {files.some(f => f.status === 'completed') && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{files.length}</div>
                      <div className="text-sm text-green-700">Images Processed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{formatFileSize(totalOriginalSize)}</div>
                      <div className="text-sm text-green-700">Original Size</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{formatFileSize(totalCompressedSize)}</div>
                      <div className="text-sm text-green-700">Compressed Size</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{totalSavings.toFixed(1)}%</div>
                      <div className="text-sm text-green-700">Space Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {file.status === 'processing' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <div className="text-sm">Compressing...</div>
                        </div>
                      </div>
                    )}
                    {file.status === 'completed' && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        -{file.compressionRatio?.toFixed(0)}%
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 truncate mb-2">{file.name}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Original:</span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                      
                      {file.compressedSize && (
                        <div className="flex justify-between">
                          <span>Compressed:</span>
                          <span className="text-green-600">{formatFileSize(file.compressedSize)}</span>
                        </div>
                      )}
                    </div>

                    {file.status === 'processing' && (
                      <Progress value={file.progress} className="mt-3" />
                    )}

                    <div className="flex space-x-2 mt-4">
                      {file.status === 'completed' && (
                        <Button 
                          onClick={() => downloadImage(file)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === 'processing'}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Download All */}
            {files.some(f => f.status === 'completed') && (
              <div className="text-center">
                <Button 
                  onClick={downloadAllAsZip}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download All as ZIP
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}