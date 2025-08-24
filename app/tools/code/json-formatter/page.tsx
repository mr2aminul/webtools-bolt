"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code2, Copy, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const formatJson = (indent = 2) => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter some JSON to format');
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError('');
      setIsValid(true);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setOutput('');
      setIsValid(false);
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter some JSON to minify');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setIsValid(true);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setOutput('');
      setIsValid(false);
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setError('Please enter some JSON to validate');
      setIsValid(false);
      return;
    }

    try {
      JSON.parse(input);
      setError('');
      setIsValid(true);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setIsValid(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadJson = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(false);
  };

  const loadSample = () => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "hobbies": ["reading", "swimming", "coding"],
      "isActive": true
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
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
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">JSON Formatter</h1>
                <p className="text-sm text-slate-600">Format, validate and minify JSON data</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>Input JSON</span>
                  {isValid && <Badge variant="secondary" className="bg-green-100 text-green-700">Valid</Badge>}
                  {error && <Badge variant="destructive">Invalid</Badge>}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={loadSample}>
                    Load Sample
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
                placeholder="Paste your JSON here..."
                className="min-h-[400px] font-mono text-sm"
              />
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={() => formatJson(2)} className="bg-gradient-to-r from-green-500 to-emerald-500">
                  Format (2 spaces)
                </Button>
                <Button onClick={() => formatJson(4)} variant="outline">
                  Format (4 spaces)
                </Button>
                <Button onClick={minifyJson} variant="outline">
                  Minify
                </Button>
                <Button onClick={validateJson} variant="outline">
                  Validate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Formatted Output</CardTitle>
                {output && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadJson}>
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
                placeholder="Formatted JSON will appear here..."
                className="min-h-[400px] font-mono text-sm bg-slate-50"
              />
              
              {output && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ JSON formatted successfully! ({output.split('\n').length} lines, {output.length} characters)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Format & Beautify</h4>
                <p className="text-sm text-slate-600">Pretty-print JSON with customizable indentation (2 or 4 spaces) for better readability.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Validate & Verify</h4>
                <p className="text-sm text-slate-600">Instantly check if your JSON is valid and get detailed error messages for debugging.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Minify & Compress</h4>
                <p className="text-sm text-slate-600">Remove unnecessary whitespace and reduce file size for production use.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}