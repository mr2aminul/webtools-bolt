'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  error?: string;
}

interface FileUploadZoneProps {
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  onFilesChange: (files: FileItem[]) => void;
  supportsBulk?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export function FileUploadZone({ 
  accept, 
  maxFiles = 20, 
  maxSize = 100 * 1024 * 1024,
  onFilesChange,
  supportsBulk = true,
  title = "Select files",
  subtitle = "or drop files here",
  buttonText = "Select files"
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<FileItem[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newFiles: FileItem[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending' as const
    }));

    const updatedFiles = supportsBulk ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);

    if (rejectedFiles.length > 0) {
      console.warn('Rejected files:', rejectedFiles);
    }
  }, [files, onFilesChange, supportsBulk]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: supportsBulk ? maxFiles : 1,
    maxSize,
    multiple: supportsBulk
  });

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const clearAll = () => {
    setFiles([]);
    onFilesChange([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{subtitle}</p>
          </div>

          <Button 
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium"
          >
            {buttonText}
          </Button>

          <div className="text-sm text-gray-500 space-y-1">
            {supportsBulk && <p>Up to {maxFiles} files</p>}
            <p>Max {formatFileSize(maxSize)} per file</p>
          </div>
        </div>

        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-2xl flex items-center justify-center">
            <div className="text-blue-600 font-medium text-lg">Drop files here</div>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Selected Files ({files.length})
            </h3>
            {supportsBulk && files.length > 1 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(fileItem.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatFileSize(fileItem.file.size)}
                    </span>
                  </div>
                  
                  {fileItem.status === 'processing' && (
                    <Progress value={fileItem.progress} className="h-2" />
                  )}
                  
                  {fileItem.status === 'error' && (
                    <p className="text-xs text-red-600">{fileItem.error || 'Processing failed'}</p>
                  )}
                  
                  {fileItem.status === 'completed' && (
                    <p className="text-xs text-green-600">✓ Processed successfully</p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(fileItem.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}