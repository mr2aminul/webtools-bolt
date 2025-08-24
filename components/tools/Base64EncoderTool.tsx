'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { useDomain } from '@/lib/hooks/useDomain';
import { AdBanner } from '@/components/ads/AdBanner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function Base64EncoderTool() {
  const { domainConfig } = useDomain();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');

  const encodeBase64 = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter text to encode');
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
      toast.success('Text encoded successfully!');
    } catch (err: any) {
      setError(`Error encoding: ${err.message}`);
      setOutput('');
      toast.error('Failed to encode text');
    }
  };

  const decodeBase64 = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter Base64 text to decode');
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
      toast.success('Text decoded successfully!');
    } catch (err: any) {
      setError(`Error decoding: Invalid Base64 string`);
      setOutput('');
      toast.error('Failed to decode Base64');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const downloadText = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('Hello, World! This is a sample text for Base64 encoding.');
    } else {
      setInput('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4=');
    }
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
                <Key className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Base64 Encoder/Decoder</h1>
                <p className="text-sm text-gray-600">Encode and decode Base64 strings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>

              <TabsContent value="encode">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Panel */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Plain Text</CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={loadSample}>
                            Sample
                          </Button>
                          <Button variant="outline" size="sm" onClick={clearAll}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter text to encode..."
                        className="min-h-[300px] font-mono text-sm"
                      />
                      
                      {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                      )}

                      <Button 
                        onClick={encodeBase64}
                        className="w-full mt-4 text-white"
                        style={{
                          background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                        }}
                      >
                        Encode to Base64
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Output Panel */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Base64 Encoded</CardTitle>
                        {output && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadText}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={output}
                        readOnly
                        placeholder="Base64 encoded text will appear here..."
                        className="min-h-[300px] font-mono text-sm bg-gray-50"
                      />
                      
                      {output && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            ✅ Text encoded successfully! ({output.length} characters)
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="decode">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Panel */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Base64 Text</CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={loadSample}>
                            Sample
                          </Button>
                          <Button variant="outline" size="sm" onClick={clearAll}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter Base64 text to decode..."
                        className="min-h-[300px] font-mono text-sm"
                      />
                      
                      {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                      )}

                      <Button 
                        onClick={decodeBase64}
                        className="w-full mt-4 text-white"
                        style={{
                          background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                        }}
                      >
                        Decode from Base64
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Output Panel */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Decoded Text</CardTitle>
                        {output && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadText}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={output}
                        readOnly
                        placeholder="Decoded text will appear here..."
                        className="min-h-[300px] font-mono text-sm bg-gray-50"
                      />
                      
                      {output && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            ✅ Text decoded successfully! ({output.length} characters)
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            <AdBanner slot="tool-sidebar" format="rectangle" />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Base64</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>
                  Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
                </p>
                <p>
                  It's commonly used for encoding data in email, storing complex data in XML or JSON, and embedding images in HTML/CSS.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Common Uses:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Email attachments</li>
                    <li>• Data URLs for images</li>
                    <li>• API authentication tokens</li>
                    <li>• Storing binary data in text formats</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}