'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code2, Copy, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { useDomain } from '@/lib/hooks/useDomain';
import { AdBanner } from '@/components/ads/AdBanner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function HTMLFormatterTool() {
  const { domainConfig } = useDomain();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const formatHTML = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter some HTML to format');
      setIsValid(false);
      return;
    }

    try {
      // Simple HTML formatting (in production, use html-beautify)
      let formatted = input
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/gm, '')
        .split('\n')
        .map((line, index, array) => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          
          let indent = 0;
          for (let i = 0; i < index; i++) {
            const prevLine = array[i].trim();
            if (prevLine.match(/<[^\/][^>]*[^\/]>$/)) indent++;
            if (prevLine.match(/<\/[^>]+>$/)) indent--;
          }
          
          if (trimmed.match(/^<\/[^>]+>$/)) indent--;
          
          return '  '.repeat(Math.max(0, indent)) + trimmed;
        })
        .filter(line => line.length > 0)
        .join('\n');

      setOutput(formatted);
      setError('');
      setIsValid(true);
      toast.success('HTML formatted successfully!');
    } catch (err: any) {
      setError(`Error formatting HTML: ${err.message}`);
      setOutput('');
      setIsValid(false);
      toast.error('Failed to format HTML');
    }
  };

  const minifyHTML = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter some HTML to minify');
      return;
    }

    try {
      // Simple HTML minification
      const minified = input
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/^\s+|\s+$/g, '');

      setOutput(minified);
      setError('');
      setIsValid(true);
      toast.success('HTML minified successfully!');
    } catch (err: any) {
      setError(`Error minifying HTML: ${err.message}`);
      setOutput('');
      setIsValid(false);
      toast.error('Failed to minify HTML');
    }
  };

  const validateHTML = () => {
    if (!input.trim()) {
      setError('Please enter some HTML to validate');
      setIsValid(false);
      return;
    }

    // Simple validation (check for basic tag matching)
    const openTags = input.match(/<[^\/][^>]*>/g) || [];
    const closeTags = input.match(/<\/[^>]+>/g) || [];
    
    if (openTags.length !== closeTags.length) {
      setError('HTML appears to have mismatched tags');
      setIsValid(false);
      toast.error('HTML validation failed');
    } else {
      setError('');
      setIsValid(true);
      toast.success('HTML appears to be valid!');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const downloadHTML = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.html';
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
    setIsValid(false);
  };

  const loadSample = () => {
    const sample = `<!DOCTYPE html>
<html><head><title>Sample</title></head><body><div class="container"><h1>Hello World</h1><p>This is a sample HTML document.</p></div></body></html>`;
    setInput(sample);
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
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HTML Formatter</h1>
                <p className="text-sm text-gray-600">Format, validate and minify HTML code</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>Input HTML</span>
                      {isValid && <Badge variant="secondary" className="bg-green-100 text-green-700">Valid</Badge>}
                      {error && <Badge variant="destructive">Invalid</Badge>}
                    </CardTitle>
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
                    placeholder="Paste your HTML here..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      onClick={formatHTML}
                      className="text-white"
                      style={{
                        background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                      }}
                    >
                      Format HTML
                    </Button>
                    <Button onClick={minifyHTML} variant="outline">
                      Minify
                    </Button>
                    <Button onClick={validateHTML} variant="outline">
                      Validate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Formatted Output</CardTitle>
                    {output && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadHTML}>
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
                    placeholder="Formatted HTML will appear here..."
                    className="min-h-[400px] font-mono text-sm bg-gray-50"
                  />
                  
                  {output && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        ✅ HTML formatted successfully! ({output.split('\n').length} lines, {output.length} characters)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            <AdBanner slot="tool-sidebar" format="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
}