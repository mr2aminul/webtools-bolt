'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, Copy, Download, Upload, RefreshCw, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface ValidationError {
  line: number;
  column: number;
  message: string;
}

export function JSONFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [stats, setStats] = useState({
    characters: 0,
    lines: 0,
    size: 0,
    keys: 0,
    arrays: 0,
    objects: 0
  });

  useEffect(() => {
    if (input.trim()) {
      validateAndFormat();
    } else {
      setOutput('');
      setIsValid(null);
      setErrors([]);
      resetStats();
    }
  }, [input, indentSize, sortKeys]);

  const validateAndFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setIsValid(true);
      setErrors([]);
      
      // Calculate statistics
      const jsonString = JSON.stringify(parsed);
      const stats = analyzeJSON(parsed);
      setStats({
        characters: jsonString.length,
        lines: input.split('\n').length,
        size: new Blob([jsonString]).size,
        ...stats
      });

      // Format JSON
      const indent = parseInt(indentSize);
      let formatted;
      
      if (sortKeys) {
        formatted = JSON.stringify(sortObjectKeys(parsed), null, indent);
      } else {
        formatted = JSON.stringify(parsed, null, indent);
      }
      
      setOutput(formatted);
      
    } catch (error: any) {
      setIsValid(false);
      setOutput('');
      
      // Parse error details
      const errorMatch = error.message.match(/at position (\d+)/);
      if (errorMatch) {
        const position = parseInt(errorMatch[1]);
        const lines = input.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        setErrors([{
          line,
          column,
          message: error.message
        }]);
      } else {
        setErrors([{
          line: 1,
          column: 1,
          message: error.message
        }]);
      }
      
      resetStats();
    }
  };

  const analyzeJSON = (obj: any): { keys: number; arrays: number; objects: number } => {
    let keys = 0;
    let arrays = 0;
    let objects = 0;

    const analyze = (item: any) => {
      if (Array.isArray(item)) {
        arrays++;
        item.forEach(analyze);
      } else if (item && typeof item === 'object') {
        objects++;
        Object.keys(item).forEach(key => {
          keys++;
          analyze(item[key]);
        });
      }
    };

    analyze(obj);
    return { keys, arrays, objects };
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj && typeof obj === 'object') {
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
      return sorted;
    }
    return obj;
  };

  const resetStats = () => {
    setStats({
      characters: 0,
      lines: 0,
      size: 0,
      keys: 0,
      arrays: 0,
      objects: 0
    });
  };

  const minifyJSON = () => {
    if (!isValid || !input.trim()) {
      toast.error('Please enter valid JSON first');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      toast.success('JSON minified successfully!');
    } catch (error) {
      toast.error('Failed to minify JSON');
    }
  };

  const copyToClipboard = () => {
    if (!output) {
      toast.error('No output to copy');
      return;
    }
    
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const downloadJSON = () => {
    if (!output) {
      toast.error('No output to download');
      return;
    }

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setErrors([]);
    resetStats();
  };

  const loadSample = () => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001",
        "country": "USA"
      },
      "hobbies": ["reading", "swimming", "coding", "traveling"],
      "isActive": true,
      "balance": 1250.75,
      "lastLogin": "2024-01-15T10:30:00Z",
      "preferences": {
        "theme": "dark",
        "notifications": {
          "email": true,
          "push": false,
          "sms": true
        },
        "language": "en"
      },
      "tags": null
    };
    setInput(JSON.stringify(sample));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
              <Code2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">JSON Formatter</h1>
              <p className="text-gray-600">Format, validate, and analyze JSON data with advanced options</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Indentation
                  </label>
                  <Select value={indentSize} onValueChange={setIndentSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="8">8 spaces</SelectItem>
                      <SelectItem value="tab">Tab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sortKeys"
                    checked={sortKeys}
                    onChange={(e) => setSortKeys(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="sortKeys" className="text-sm font-medium text-gray-700">
                    Sort keys alphabetically
                  </label>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={loadSample}
                    className="w-full"
                  >
                    Load Sample
                  </Button>
                  
                  <div>
                    <input
                      type="file"
                      accept=".json,.txt"
                      onChange={uploadFile}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                {/* Statistics */}
                {(isValid || isValid === false) && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Statistics</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Characters:</span>
                        <span className="font-mono">{stats.characters.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lines:</span>
                        <span className="font-mono">{stats.lines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-mono">{formatFileSize(stats.size)}</span>
                      </div>
                      {isValid && (
                        <>
                          <div className="flex justify-between">
                            <span>Objects:</span>
                            <span className="font-mono">{stats.objects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Arrays:</span>
                            <span className="font-mono">{stats.arrays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Keys:</span>
                            <span className="font-mono">{stats.keys}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="formatter" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="formatter">JSON Formatter</TabsTrigger>
                <TabsTrigger value="validator">JSON Validator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="formatter" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Panel */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <span>Input JSON</span>
                          {isValid === true && <Badge className="bg-green-100 text-green-700">Valid</Badge>}
                          {isValid === false && <Badge variant="destructive">Invalid</Badge>}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your JSON here..."
                        className="min-h-[500px] font-mono text-sm resize-none"
                      />
                      
                      {errors.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          {errors.map((error, index) => (
                            <div key={index} className="flex items-start space-x-2 text-red-700">
                              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <div className="font-medium">Line {error.line}, Column {error.column}</div>
                                <div>{error.message}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Output Panel */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Formatted Output</CardTitle>
                        {output && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={minifyJSON}>
                              Minify
                            </Button>
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadJSON}>
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
                        className="min-h-[500px] font-mono text-sm bg-gray-50 resize-none"
                      />
                      
                      {output && isValid && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-green-700">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              JSON formatted successfully! ({output.split('\n').length} lines, {output.length} characters)
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="validator" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>JSON Validator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Paste your JSON here to validate..."
                      className="min-h-[400px] font-mono text-sm resize-none"
                    />
                    
                    <div className="mt-4">
                      {isValid === true && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Valid JSON!</span>
                          </div>
                          <div className="mt-2 text-sm text-green-600">
                            Your JSON is properly formatted and contains no syntax errors.
                          </div>
                        </div>
                      )}
                      
                      {isValid === false && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-red-700 mb-2">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium">Invalid JSON!</span>
                          </div>
                          {errors.map((error, index) => (
                            <div key={index} className="text-sm text-red-600 ml-7">
                              <div className="font-medium">Line {error.line}, Column {error.column}:</div>
                              <div>{error.message}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {isValid === null && input.trim() === '' && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <FileText className="h-5 w-5" />
                            <span>Enter JSON to validate</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}