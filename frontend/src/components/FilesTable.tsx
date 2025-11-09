import { useState, useEffect } from 'react';
import { Loader2, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import * as api from '../api';

interface File {
  filename: string;
  hash: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

interface FilesTableProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onLocate: (hash: string) => void;
  refreshTrigger?: number;
}

export function FilesTable({ onError, onSuccess, onLocate, refreshTrigger }: FilesTableProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteHash, setDeleteHash] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadFiles = async () => {
    try {
      const data = await api.listFiles();
      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  const handleDelete = async (hash: string) => {
    try {
      await api.deleteFile(hash);
      onSuccess('File deleted successfully');
      loadFiles();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to delete file');
    } finally {
      setDeleteHash(null);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.clearAll();
      onSuccess('All files cleared successfully');
      loadFiles();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to clear files');
    } finally {
      setShowClearConfirm(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Files ({files.length})</h2>
        {files.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm transition-all duration-150 hover:scale-[1.01] flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {files.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No files uploaded yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Filename</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Hash</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Size</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Created</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.hash} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 text-sm font-medium truncate max-w-[200px]">{file.filename}</td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-400 truncate max-w-[120px]">
                    {file.hash.substring(0, 10)}...
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-300">{formatSize(file.size)}</td>
                  <td className="py-3 px-2 text-sm text-gray-400 truncate max-w-[120px]">{file.mimeType}</td>
                  <td className="py-3 px-2 text-sm text-gray-400">{formatTime(file.createdAt)}</td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onLocate(file.hash)}
                        className="p-2 hover:bg-cyan-500/20 rounded transition-colors"
                        aria-label="Locate file"
                      >
                        <MapPin className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => setDeleteHash(file.hash)}
                        className="p-2 hover:bg-red-500/20 rounded transition-colors"
                        aria-label="Delete file"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteHash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteHash(null)} />
          <div className="glass-card p-6 max-w-md w-full relative z-10">
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this file?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteHash(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteHash)}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowClearConfirm(false)} />
          <div className="glass-card p-6 max-w-md w-full relative z-10">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Clear All Files
            </h3>
            <p className="text-gray-300 mb-6">
              This will permanently delete all files. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
