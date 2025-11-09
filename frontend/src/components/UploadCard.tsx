import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle, MapPin } from 'lucide-react';
import * as api from '../api';

interface UploadCardProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onLocate: (hash: string) => void;
}

export function UploadCard({ onError, onSuccess, onLocate }: UploadCardProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await api.uploadFile(file);
      setResult(response);

      if (response.duplicate) {
        onSuccess('Duplicate file detected');
      } else {
        onSuccess('File uploaded successfully');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4">Upload File</h2>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-400/10'
            : 'border-white/20 hover:border-white/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          className="hidden"
          disabled={loading}
        />

        <div className="flex flex-col items-center gap-3">
          {loading ? (
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-cyan-400" />
          )}

          <div>
            <p className="text-lg font-medium mb-1">
              {loading ? 'Uploading...' : 'Drop file here or click to browse'}
            </p>
            <p className="text-sm text-gray-400">
              Any file type supported
            </p>
          </div>

          {!loading && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-150 hover:scale-[1.01]"
            >
              Select File
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${
          result.duplicate
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-green-500/10 border-green-500/30'
        }`}>
          <div className="flex items-start gap-3">
            {result.duplicate ? (
              <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <p className="font-medium mb-1">
                {result.duplicate ? 'Duplicate File Found' : 'Upload Successful'}
              </p>

              {result.savedPath && (
                <p className="text-sm text-gray-300 mb-2 font-mono break-all">
                  {result.savedPath}
                </p>
              )}

              {result.hash && (
                <p className="text-xs text-gray-400">
                  Hash: {result.hash}
                </p>
              )}

              {result.duplicate && result.hash && (
                <button
                  onClick={() => onLocate(result.hash)}
                  className="mt-2 px-4 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-sm transition-all duration-150 hover:scale-[1.01]"
                >
                  Locate Original
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
