'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Download, Upload, Palette, Eye, Settings, Copy } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import toast from 'react-hot-toast';

const QR_TYPES = [
  { id: 'url', label: 'URL', icon: '🔗', placeholder: 'https://example.com' },
  { id: 'text', label: 'Text', icon: '📝', placeholder: 'Enter your text here...' },
  { id: 'email', label: 'Email', icon: '📧', placeholder: 'name@example.com' },
  { id: 'phone', label: 'Phone', icon: '📞', placeholder: '+1234567890' },
  { id: 'sms', label: 'SMS', icon: '💬', placeholder: '+1234567890' },
  { id: 'wifi', label: 'WiFi', icon: '📶', placeholder: 'Network credentials' },
  { id: 'vcard', label: 'vCard', icon: '👤', placeholder: 'Contact information' },
  { id: 'location', label: 'Location', icon: '📍', placeholder: 'Latitude, Longitude' },
  { id: 'event', label: 'Event', icon: '📅', placeholder: 'Event details' },
  { id: 'crypto', label: 'Bitcoin', icon: '₿', placeholder: 'Bitcoin address' }
];

const DOT_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'dots', label: 'Dots' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'extra-rounded', label: 'Extra Rounded' },
  { id: 'classy', label: 'Classy' },
  { id: 'classy-rounded', label: 'Classy Rounded' }
];

const CORNER_SQUARE_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' },
  { id: 'extra-rounded', label: 'Extra Rounded' }
];

const CORNER_DOT_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' }
];

export function QRGeneratorTool() {
  const [activeType, setActiveType] = useState('url');
  const [content, setContent] = useState('https://qr-code-monkey.com');
  const [size, setSize] = useState([300]);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [margin, setMargin] = useState([10]);
  
  // Design options
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [dotType, setDotType] = useState('square');
  const [cornerSquareType, setCornerSquareType] = useState('square');
  const [cornerDotType, setCornerDotType] = useState('square');
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000');
  const [cornerDotColor, setCornerDotColor] = useState('#000000');
  
  // Logo options
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState([0.4]);
  const [logoMargin, setLogoMargin] = useState([0]);
  
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WiFi form fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard form fields
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  const [vcardUrl, setVcardUrl] = useState('');

  useEffect(() => {
    generateQRCode();
  }, [
    content, size, errorCorrection, margin, foregroundColor, backgroundColor,
    dotType, cornerSquareType, cornerDotType, cornerSquareColor, cornerDotColor,
    logoUrl, logoSize, logoMargin
  ]);

  const generateQRCode = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);

    try {
      const qrCodeInstance = new QRCodeStyling({
        width: size[0],
        height: size[0],
        type: 'svg',
        data: getFormattedContent(),
        margin: margin[0],
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: errorCorrection as 'L' | 'M' | 'Q' | 'H'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: logoSize[0],
          margin: logoMargin[0],
          crossOrigin: 'anonymous'
        },
        dotsOptions: {
          color: foregroundColor,
          type: dotType as any
        },
        backgroundOptions: {
          color: backgroundColor
        },
        cornersSquareOptions: {
          color: cornerSquareColor,
          type: cornerSquareType as any
        },
        cornersDotOptions: {
          color: cornerDotColor,
          type: cornerDotType as any
        }
      });

      if (logoUrl) {
        qrCodeInstance.update({
          image: logoUrl
        });
      }

      setQrCode(qrCodeInstance);

      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
        qrCodeInstance.append(canvasRef.current);
      }

    } catch (error) {
      console.error('QR Code generation error:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormattedContent = () => {
    switch (activeType) {
      case 'email':
        return `mailto:${content}`;
      case 'phone':
        return `tel:${content}`;
      case 'sms':
        const [phone, message] = content.split('|');
        return `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
FN:${vcardName}
TEL:${vcardPhone}
EMAIL:${vcardEmail}
ORG:${vcardOrg}
URL:${vcardUrl}
END:VCARD`;
      case 'location':
        const [lat, lng] = content.split(',');
        return `geo:${lat?.trim()},${lng?.trim()}`;
      default:
        return content;
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo file must be smaller than 2MB');
        return;
      }
      
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const downloadQR = (format: 'png' | 'svg' | 'pdf') => {
    if (!qrCode) return;

    const fileName = `qr-code.${format}`;
    
    if (format === 'svg') {
      qrCode.download({ name: fileName, extension: 'svg' });
    } else if (format === 'png') {
      qrCode.download({ name: fileName, extension: 'png' });
    } else if (format === 'pdf') {
      // For PDF, we'll download as PNG and let user convert
      qrCode.download({ name: 'qr-code', extension: 'png' });
      toast.info('Downloaded as PNG. Use a PDF converter for PDF format.');
    }
    
    toast.success(`QR code downloaded as ${format.toUpperCase()}!`);
  };

  const copyQRCode = async () => {
    if (!qrCode) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = size[0];
      canvas.height = size[0];
      
      qrCode.append(canvas);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success('QR code copied to clipboard!');
        }
      });
    } catch (error) {
      toast.error('Failed to copy QR code');
    }
  };

  const renderContentForm = () => {
    switch (activeType) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <Label>Network Name (SSID)</Label>
              <Input
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder="My WiFi Network"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="WiFi password"
              />
            </div>
            <div>
              <Label>Security Type</Label>
              <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Organization</Label>
              <Input
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={vcardUrl}
                onChange={(e) => setVcardUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={QR_TYPES.find(t => t.id === activeType)?.placeholder}
              className="min-h-[100px] mt-2"
            />
          </div>
        );
    }
  };

  useEffect(() => {
    // Update content when WiFi or vCard fields change
    if (activeType === 'wifi') {
      setContent(`${wifiSSID}|${wifiPassword}|${wifiSecurity}`);
    } else if (activeType === 'vcard') {
      setContent(`${vcardName}|${vcardPhone}|${vcardEmail}|${vcardOrg}|${vcardUrl}`);
    }
  }, [activeType, wifiSSID, wifiPassword, wifiSecurity, vcardName, vcardPhone, vcardEmail, vcardOrg, vcardUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <QrCode className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
              <p className="text-gray-600">Create custom QR codes with advanced design options and logo support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Content & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {QR_TYPES.map((type) => (
                    <Button
                      key={type.id}
                      variant={activeType === type.id ? "default" : "outline"}
                      onClick={() => setActiveType(type.id)}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <span className="text-lg mb-1">{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Input */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                {renderContentForm()}
              </CardContent>
            </Card>

            {/* Design Customization */}
            <Card>
              <CardHeader>
                <CardTitle>Design Customization</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="shape">Shape</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                    <TabsTrigger value="options">Options</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="colors" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Foreground Color</Label>
                        <div className="flex items-center space-x-2 mt-2">
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
                      <div>
                        <Label>Background Color</Label>
                        <div className="flex items-center space-x-2 mt-2">
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Corner Square Color</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Input
                            type="color"
                            value={cornerSquareColor}
                            onChange={(e) => setCornerSquareColor(e.target.value)}
                            className="w-12 h-10"
                          />
                          <Input
                            value={cornerSquareColor}
                            onChange={(e) => setCornerSquareColor(e.target.value)}
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Corner Dot Color</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Input
                            type="color"
                            value={cornerDotColor}
                            onChange={(e) => setCornerDotColor(e.target.value)}
                            className="w-12 h-10"
                          />
                          <Input
                            value={cornerDotColor}
                            onChange={(e) => setCornerDotColor(e.target.value)}
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shape" className="space-y-4">
                    <div>
                      <Label>Dot Style</Label>
                      <Select value={dotType} onValueChange={setDotType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DOT_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Corner Square Style</Label>
                      <Select value={cornerSquareType} onValueChange={setCornerSquareType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CORNER_SQUARE_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Corner Dot Style</Label>
                      <Select value={cornerDotType} onValueChange={setCornerDotType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CORNER_DOT_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logo" className="space-y-4">
                    <div>
                      <Label>Upload Logo</Label>
                      <div className="mt-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Logo Image
                        </Button>
                      </div>
                      {logoFile && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected: {logoFile.name}
                        </div>
                      )}
                    </div>
                    
                    {logoUrl && (
                      <>
                        <div>
                          <Label>Logo Size: {(logoSize[0] * 100).toFixed(0)}%</Label>
                          <Slider
                            value={logoSize}
                            onValueChange={setLogoSize}
                            max={0.8}
                            min={0.1}
                            step={0.05}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label>Logo Margin: {logoMargin[0]}</Label>
                          <Slider
                            value={logoMargin}
                            onValueChange={setLogoMargin}
                            max={20}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="options" className="space-y-4">
                    <div>
                      <Label>Size: {size[0]}px</Label>
                      <Slider
                        value={size}
                        onValueChange={setSize}
                        max={1000}
                        min={100}
                        step={50}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Error Correction</Label>
                      <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                        <SelectTrigger className="mt-2">
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
                    
                    <div>
                      <Label>Margin: {margin[0]}px</Label>
                      <Slider
                        value={margin}
                        onValueChange={setMargin}
                        max={50}
                        min={0}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview & Download */}
          <div className="space-y-6">
            {/* QR Code Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-200 min-h-[300px] flex items-center justify-center">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                      <p className="text-gray-600">Generating QR code...</p>
                    </div>
                  ) : (
                    <div ref={canvasRef} className="flex items-center justify-center" />
                  )}
                </div>
                
                {qrCode && (
                  <div className="mt-4 space-y-3">
                    <Button
                      onClick={() => downloadQR('png')}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => downloadQR('svg')}
                        className="text-blue-600 border-blue-600"
                      >
                        SVG
                      </Button>
                      <Button
                        variant="outline"
                        onClick={copyQRCode}
                        className="text-purple-600 border-purple-600"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Info */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{QR_TYPES.find(t => t.id === activeType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{size[0]} × {size[0]}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Correction:</span>
                  <span className="font-medium">{errorCorrection}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Length:</span>
                  <span className="font-medium">{getFormattedContent().length} chars</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Use high contrast colors for better scanning</p>
                <p>• Test your QR code with multiple scanners</p>
                <p>• Keep content concise for smaller QR codes</p>
                <p>• Higher error correction helps with damaged codes</p>
                <p>• Logo should not exceed 30% of the QR code area</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}