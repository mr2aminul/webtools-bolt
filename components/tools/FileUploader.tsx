'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, AlertCircle } from 'lucide-react';
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

interface FileUploaderProps {
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  onFilesChange: (files: FileItem[]) => void;
  supportsBulk?: boolean;
}

export function FileUploader({ 
  accept, 
  maxFiles = 10, 
  maxSize = 100 * 1024 * 1024, // 100MB
  onFilesChange,
  supportsBulk = true 
}: FileUploaderProps) {
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

    // Handle rejected files
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

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              {supportsBulk ? 'Drop files here or click to select' : 'Drop file here or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              {supportsBulk && `Up to ${maxFiles} files, `}
              Max {formatFileSize(maxSize)} per file
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Selected Files ({files.length})
            </h3>
            {supportsBulk && files.length > 1 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <File className="h-5 w-5 text-gray-500 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(fileItem.file.size)}
                    </span>
                  </div>
                  
                  {fileItem.status === 'processing' && (
                    <Progress value={fileItem.progress} className="h-1" />
                  )}
                  
                  {fileItem.status === 'error' && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{fileItem.error || 'Processing failed'}</span>
                    </div>
                  )}
                  
                  {fileItem.status === 'completed' && (
                    <div className="text-xs text-green-600">✓ Processed successfully</div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(fileItem.id)}
                  className="flex-shrink-0"
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