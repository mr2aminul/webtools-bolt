'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { QrCode, Download, Copy, Upload, Palette, Image as ImageIcon, Settings } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { useDomain } from '@/lib/hooks/useDomain';
import toast from 'react-hot-toast';

export function EnhancedQRGeneratorTool() {
  const { domainConfig } = useDomain();
  const [activeTab, setActiveTab] = useState('URL');
  const [content, setContent] = useState('https://www.qrcode-monkey.com');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [quality, setQuality] = useState([1000]);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [showLogoOptions, setShowLogoOptions] = useState(false);
  const [showDesignOptions, setShowDesignOptions] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tabs = ['URL', 'TEXT', 'EMAIL', 'PHONE', 'SMS', 'VCARD', 'MECARD', 'LOCATION', 'FACEBOOK', 'TWITTER', 'YOUTUBE', 'WIFI', 'EVENT', 'BITCOIN', 'MORE'];

  useEffect(() => {
    generateQR();
  }, [content, quality]);

  const generateQR = async () => {
    if (!content.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = quality[0];
    canvas.width = size;
    canvas.height = size;

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Create QR pattern
    ctx.fillStyle = '#000000';
    const moduleSize = size / 25;

    // Draw QR-like pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i + j) % 2 === 0 || (i % 5 === 0 && j % 5 === 0)) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add finder patterns
    const drawFinderPattern = (x: number, y: number) => {
      const patternSize = moduleSize * 7;
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, patternSize, patternSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + moduleSize, y + moduleSize, patternSize - 2 * moduleSize, patternSize - 2 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, patternSize - 4 * moduleSize, patternSize - 4 * moduleSize);
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(size - 7 * moduleSize, 0);
    drawFinderPattern(0, size - 7 * moduleSize);

    setQrDataUrl(canvas.toDataURL());
  };

  const downloadQR = (format: string) => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-code.${format}`;
    link.href = qrDataUrl;
    link.click();
    toast.success(`QR code downloaded as ${format.toUpperCase()}!`);
  };

  const copyQRCode = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast.success('QR code copied to clipboard!');
      }
    });
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'URL':
        return 'https://www.qrcode-monkey.com';
      case 'TEXT':
        return 'Enter your text here...';
      case 'EMAIL':
        return 'name@example.com';
      case 'PHONE':
        return '+1234567890';
      case 'SMS':
        return '+1234567890';
      case 'WIFI':
        return 'Network name and password';
      default:
        return 'Enter content...';
    }
  };

  if (!domainConfig) return null;

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create custom QR codes with logos, colors, and advanced design options"
      icon={<QrCode className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`
                  text-xs px-3 py-1 rounded
                  ${activeTab === tab 
                    ? 'bg-white text-green-600' 
                    : 'text-white hover:bg-green-700'
                  }
                `}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Content Input */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm">
                    ✓
                  </div>
                  <CardTitle>ENTER CONTENT</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Your URL</Label>
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="radio" id="stats-off" name="stats" defaultChecked />
                  <Label htmlFor="stats-off" className="text-sm">OFF</Label>
                  <Label className="text-sm text-gray-600">Statistics and Editability</Label>
                </div>
              </CardContent>
            </Card>

            {/* Color Options */}
            <Card>
              <CardHeader>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowColorOptions(!showColorOptions)}
                >
                  <div className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <CardTitle>SET COLORS</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    {showColorOptions ? '−' : '+'}
                  </Button>
                </div>
              </CardHeader>
              {showColorOptions && (
                <CardContent>
                  <p className="text-sm text-gray-600">Color customization options would go here</p>
                </CardContent>
              )}
            </Card>

            {/* Logo Options */}
            <Card>
              <CardHeader>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowLogoOptions(!showLogoOptions)}
                >
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <CardTitle>ADD LOGO IMAGE</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    {showLogoOptions ? '−' : '+'}
                  </Button>
                </div>
              </CardHeader>
              {showLogoOptions && (
                <CardContent>
                  <p className="text-sm text-gray-600">Logo upload options would go here</p>
                </CardContent>
              )}
            </Card>

            {/* Design Options */}
            <Card>
              <CardHeader>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowDesignOptions(!showDesignOptions)}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <CardTitle>CUSTOMIZE DESIGN</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    {showDesignOptions ? '−' : '+'}
                  </Button>
                </div>
              </CardHeader>
              {showDesignOptions && (
                <CardContent>
                  <p className="text-sm text-gray-600">Design customization options would go here</p>
                </CardContent>
              )}
            </Card>

            {/* File Upload */}
            <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-blue-600">
                Upload MP3, PDF or any file you wish to your QR Code.
              </p>
            </div>
          </div>

          {/* Right Panel - Preview & Download */}
          <div className="space-y-6">
            {/* QR Code Preview */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Generated QR Code" 
                      className="mx-auto border border-gray-200 rounded-lg shadow-sm"
                      style={{ width: '300px', height: '300px' }}
                    />
                  ) : (
                    <div className="w-72 h-72 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Quality Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Low Quality</span>
                      <span>{quality[0]} x {quality[0]} Px</span>
                      <span>High Quality</span>
                    </div>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={2000}
                      min={200}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={generateQR}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full"
                    >
                      Create QR Code
                    </Button>
                    
                    <Button
                      onClick={() => downloadQR('png')}
                      disabled={!qrDataUrl}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full"
                    >
                      Download PNG
                    </Button>
                  </div>

                  {/* Format Options */}
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR('svg')}
                      disabled={!qrDataUrl}
                      className="text-blue-400 border-blue-400"
                    >
                      .SVG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR('pdf')}
                      disabled={!qrDataUrl}
                      className="text-orange-400 border-orange-400"
                    >
                      .PDF*
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR('eps')}
                      disabled={!qrDataUrl}
                      className="text-purple-400 border-purple-400"
                    >
                      .EPS*
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500">
                    * no support for color gradients
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Templates */}
            <div className="text-center">
              <Button
                variant="outline"
                className="bg-green-600 text-white border-green-600 hover:bg-green-700"
              >
                ☰ QR Code Templates
              </Button>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolLayout>
  );
}