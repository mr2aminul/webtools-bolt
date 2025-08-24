'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Palette, Copy, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { useDomain } from '@/lib/hooks/useDomain';
import { AdBanner } from '@/components/ads/AdBanner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function CSSFormatterTool() {
  const { domainConfig } = useDomain();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const formatCSS = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter some CSS to format');
      setIsValid(false);
      return;
    }

    try {
      // Simple CSS formatting
      let formatted = input
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n\n')
        .replace(/,\s*/g, ',\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      setOutput(formatted);
      setError('');
      setIsValid(true);
      toast.success('CSS formatted successfully!');
    } catch (err: any) {
      setError(`Error formatting CSS: ${err.message}`);
      setOutput('');
      setIsValid(false);
      toast.error('Failed to format CSS');
    }
  };

  const minifyCSS = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter some CSS to minify');
      return;
    }

    try {
      // Simple CSS minification
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, '}')
        .replace(/\s*{\s*/g, '{')
        .replace(/;\s*/g, ';')
        .replace(/,\s*/g, ',')
        .replace(/:\s*/g, ':')
        .trim();

      setOutput(minified);
      setError('');
      setIsValid(true);
      toast.success('CSS minified successfully!');
    } catch (err: any) {
      setError(`Error minifying CSS: ${err.message}`);
      setOutput('');
      setIsValid(false);
      toast.error('Failed to minify CSS');
    }
  };

  const validateCSS = () => {
    if (!input.trim()) {
      setError('Please enter some CSS to validate');
      setIsValid(false);
      return;
    }

    // Simple validation (check for basic syntax)
    const openBraces = (input.match(/{/g) || []).length;
    const closeBraces = (input.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      setError('CSS appears to have mismatched braces');
      setIsValid(false);
      toast.error('CSS validation failed');
    } else {
      setError('');
      setIsValid(true);
      toast.success('CSS appears to be valid!');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const downloadCSS = () => {
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.css';
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
    const sample = `.container{max-width:1200px;margin:0 auto;padding:20px}.header{background:#333;color:white;padding:1rem}.button{background:#007bff;color:white;border:none;padding:10px 20px;border-radius:4px}`;
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
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">CSS Formatter</h1>
                <p className="text-sm text-gray-600">Format, validate and minify CSS stylesheets</p>
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
                      <span>Input CSS</span>
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
                    placeholder="Paste your CSS here..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      onClick={formatCSS}
                      className="text-white"
                      style={{
                        background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                      }}
                    >
                      Format CSS
                    </Button>
                    <Button onClick={minifyCSS} variant="outline">
                      Minify
                    </Button>
                    <Button onClick={validateCSS} variant="outline">
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
                        <Button variant="outline" size="sm" onClick={downloadCSS}>
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
                    placeholder="Formatted CSS will appear here..."
                    className="min-h-[400px] font-mono text-sm bg-gray-50"
                  />
                  
                  {output && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        ✅ CSS formatted successfully! ({output.split('\n').length} lines, {output.length} characters)
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