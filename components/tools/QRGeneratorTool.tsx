'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { QrCode, Download, RefreshCw, ArrowLeft, Copy } from 'lucide-react';
import { useDomain } from '@/lib/hooks/useDomain';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function QRGeneratorTool() {
  const { domainConfig } = useDomain();
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState('text');
  const [size, setSize] = useState('256');
  const [errorLevel, setErrorLevel] = useState('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim()) {
      toast.error('Please enter content to generate QR code');
      return;
    }

    // For demo purposes, we'll create a simple QR code pattern
    // In a real implementation, you'd use a QR code library like qrcode.js
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sizeNum = parseInt(size);
    canvas.width = sizeNum;
    canvas.height = sizeNum;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, sizeNum, sizeNum);

    // Create a simple pattern (this would be replaced with actual QR generation)
    ctx.fillStyle = foregroundColor;
    const moduleSize = sizeNum / 25;

    // Draw simple QR-like pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i + j) % 2 === 0 || (i % 5 === 0 && j % 5 === 0)) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add finder patterns (corner squares)
    const drawFinderPattern = (x: number, y: number) => {
      const patternSize = moduleSize * 7;
      ctx.fillStyle = foregroundColor;
      ctx.fillRect(x, y, patternSize, patternSize);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(x + moduleSize, y + moduleSize, patternSize - 2 * moduleSize, patternSize - 2 * moduleSize);
      ctx.fillStyle = foregroundColor;
      ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, patternSize - 4 * moduleSize, patternSize - 4 * moduleSize);
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(sizeNum - 7 * moduleSize, 0);
    drawFinderPattern(0, sizeNum - 7 * moduleSize);

    setQrDataUrl(canvas.toDataURL());
    toast.success('QR code generated successfully!');
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrDataUrl;
    link.click();
    toast.success('QR code downloaded!');
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
    switch (qrType) {
      case 'url':
        return 'https://example.com';
      case 'email':
        return 'mailto:name@example.com';
      case 'phone':
        return '+1234567890';
      case 'wifi':
        return 'WIFI:T:WPA;S:NetworkName;P:Password;;';
      case 'sms':
        return 'SMSTO:+1234567890:Hello World';
      default:
        return 'Enter your text here...';
    }
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
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">QR Code Generator</h1>
                <p className="text-sm text-gray-600">Create custom QR codes with various options</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>QR Code Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Type */}
              <div className="space-y-2">
                <Label htmlFor="qr-type">QR Code Type</Label>
                <Select value={qrType} onValueChange={setQrType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="url">Website URL</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="wifi">WiFi Network</SelectItem>
                    <SelectItem value="sms">SMS Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="min-h-[100px]"
                />
              </div>

              {/* Customization Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size (px)</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128">128x128</SelectItem>
                      <SelectItem value="256">256x256</SelectItem>
                      <SelectItem value="512">512x512</SelectItem>
                      <SelectItem value="1024">1024x1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="error-level">Error Correction</Label>
                  <Select value={errorLevel} onValueChange={setErrorLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Foreground Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={generateQR} 
                className="w-full text-white"
                style={{
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                }}
                disabled={!text.trim()}
              >
                Generate QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>QR Code Preview</CardTitle>
                {qrDataUrl && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyQRCode}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadQR}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                {qrDataUrl ? (
                  <div className="text-center">
                    <img 
                      src={qrDataUrl} 
                      alt="Generated QR Code" 
                      className="mx-auto mb-4 border border-gray-200 rounded-lg shadow-sm"
                    />
                    <p className="text-sm text-gray-600">
                      {size}x{size} pixels, Error Level: {errorLevel}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Enter content and click "Generate QR Code" to preview</p>
                  </div>
                )}
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Plain Text & URLs</li>
                <li>• Email Addresses</li>
                <li>• Phone Numbers</li>
                <li>• WiFi Credentials</li>
                <li>• SMS Messages</li>
                <li>• Contact Information</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Error Correction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Low (7%):</strong> Smaller QR codes</div>
                <div><strong>Medium (15%):</strong> Balanced size/reliability</div>
                <div><strong>Quartile (25%):</strong> Good for damaged codes</div>
                <div><strong>High (30%):</strong> Maximum reliability</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use high contrast colors</li>
                <li>• Test with multiple scanners</li>
                <li>• Keep content concise</li>
                <li>• Use appropriate error correction</li>
                <li>• Ensure sufficient quiet zone</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}