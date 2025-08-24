'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Code2, Copy, Download, RefreshCw, FileText, Link as LinkIcon } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { useDomain } from '@/lib/hooks/useDomain';
import toast from 'react-hot-toast';

export function EnhancedCodeFormatterTool() {
  const { domainConfig } = useDomain();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('json');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCode = () => {
    if (!input.trim()) {
      setOutput('');
      toast.error('Please enter code to format');
      return;
    }

    setIsProcessing(true);

    try {
      let formatted = '';
      
      switch (language) {
        case 'json':
          const parsed = JSON.parse(input);
          formatted = JSON.stringify(parsed, null, 2);
          break;
        case 'xml':
          // Simple XML formatting
          formatted = input
            .replace(/></g, '>\n<')
            .replace(/^\s+|\s+$/gm, '')
            .split('\n')
            .map((line, index, array) => {
              let indent = 0;
              for (let i = 0; i < index; i++) {
                const prevLine = array[i].trim();
                if (prevLine.match(/<[^\/][^>]*[^\/]>$/)) indent++;
                if (prevLine.match(/<\/[^>]+>$/)) indent--;
              }
              if (line.trim().match(/^<\/[^>]+>$/)) indent--;
              return '  '.repeat(Math.max(0, indent)) + line.trim();
            })
            .join('\n');
          break;
        case 'css':
          formatted = input
            .replace(/\s*{\s*/g, ' {\n  ')
            .replace(/;\s*/g, ';\n  ')
            .replace(/\s*}\s*/g, '\n}\n\n')
            .replace(/,\s*/g, ',\n')
            .replace(/\n\s*\n/g, '\n')
            .trim();
          break;
        case 'html':
          formatted = input
            .replace(/></g, '>\n<')
            .replace(/^\s+|\s+$/gm, '')
            .split('\n')
            .map((line, index, array) => {
              let indent = 0;
              for (let i = 0; i < index; i++) {
                const prevLine = array[i].trim();
                if (prevLine.match(/<[^\/][^>]*[^\/]>$/)) indent++;
                if (prevLine.match(/<\/[^>]+>$/)) indent--;
              }
              if (line.trim().match(/^<\/[^>]+>$/)) indent--;
              return '  '.repeat(Math.max(0, indent)) + line.trim();
            })
            .join('\n');
          break;
        default:
          formatted = input;
      }

      setOutput(formatted);
      toast.success('Code formatted successfully!');
    } catch (err: any) {
      toast.error(`Error formatting code: ${err.message}`);
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const minifyCode = () => {
    if (!input.trim()) {
      toast.error('Please enter code to minify');
      return;
    }

    try {
      let minified = '';
      
      switch (language) {
        case 'json':
          const parsed = JSON.parse(input);
          minified = JSON.stringify(parsed);
          break;
        case 'css':
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/\s*{\s*/g, '{')
            .replace(/;\s*/g, ';')
            .replace(/,\s*/g, ',')
            .replace(/:\s*/g, ':')
            .trim();
          break;
        case 'html':
          minified = input
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/^\s+|\s+$/g, '');
          break;
        default:
          minified = input.replace(/\s+/g, ' ').trim();
      }

      setOutput(minified);
      toast.success('Code minified successfully!');
    } catch (err: any) {
      toast.error(`Error minifying code: ${err.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const downloadCode = () => {
    const extensions = {
      json: 'json',
      xml: 'xml',
      css: 'css',
      html: 'html',
      javascript: 'js'
    };
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${extensions[language as keyof typeof extensions] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const loadSample = () => {
    const samples = {
      json: '{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zipCode":"10001"},"hobbies":["reading","swimming","coding"],"isActive":true}',
      xml: '<root><person><name>John Doe</name><age>30</age><email>john@example.com</email></person></root>',
      css: '.container{max-width:1200px;margin:0 auto;padding:20px}.header{background:#333;color:white;padding:1rem}.button{background:#007bff;color:white;border:none;padding:10px 20px;border-radius:4px}',
      html: '<!DOCTYPE html><html><head><title>Sample</title></head><body><div class="container"><h1>Hello World</h1><p>This is a sample HTML document.</p></div></body></html>',
      javascript: 'function add(a,b){return a+b;}const result=add(5,3);console.log(result);'
    };
    
    setInput(samples[language as keyof typeof samples] || '');
  };

  if (!domainConfig) return null;

  return (
    <ToolLayout
      title="JSON to TOML Converter"
      description="Convert JSON to TOML format with validation and formatting options"
      icon={<Code2 className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Tool Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" className="bg-gray-100">
                    <FileText className="h-4 w-4 mr-2" />
                    File
                  </Button>
                  <Button variant="outline" size="sm">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    URL
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-update"
                    checked={autoUpdate}
                    onCheckedChange={(checked) => setAutoUpdate(checked as boolean)}
                  />
                  <Label htmlFor="auto-update" className="text-sm">Auto Update</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={loadSample}>
                    Sample
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setInput('')}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste or type your data here..."
                className="min-h-[400px] font-mono text-sm resize-none"
              />
              
              <div className="text-xs text-gray-500">
                Ln: 1 Col: 0
              </div>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Output</CardTitle>
                {output && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCode}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                placeholder="Formatted output will appear here..."
                className="min-h-[400px] font-mono text-sm bg-gray-50 resize-none"
              />
              
              <div className="text-xs text-gray-500">
                Ln: 1 Col: 0
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={formatCode}
            disabled={isProcessing}
            className="px-8 py-3 text-white rounded-full"
            style={{
              background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'JSON to TOML'
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={minifyCode}
            className="px-8 py-3 rounded-full"
          >
            Download
          </Button>
        </div>

        {/* Additional Tools */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">JSON Sorter</p>
        </div>
      </div>
    </ToolLayout>
  );
}