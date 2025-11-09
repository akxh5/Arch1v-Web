import { useState } from 'react';
import { Database, LogOut, User } from 'lucide-react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { UploadCard } from '../components/UploadCard';
import { FilesTable } from '../components/FilesTable';
import * as api from '../api';

export function Dashboard() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [locateModal, setLocateModal] = useState<{ isOpen: boolean; path: string }>({ isOpen: false, path: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleError = (message: string) => {
    setToast({ message, type: 'error' });
  };

  const handleSuccess = (message: string) => {
    setToast({ message, type: 'success' });
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLocate = async (hash: string) => {
    try {
      const path = await api.locateFile(hash);
      setLocateModal({ isOpen: true, path });
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Failed to locate file');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Modal
        isOpen={locateModal.isOpen}
        onClose={() => setLocateModal({ isOpen: false, path: '' })}
        title="File Location"
      >
        <div className="bg-black/30 p-4 rounded-lg">
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
            {locateModal.path}
          </pre>
        </div>
      </Modal>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">Arch1v</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <User className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-150 hover:scale-[1.01] flex items-center gap-2"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <UploadCard
            onError={handleError}
            onSuccess={handleSuccess}
            onLocate={handleLocate}
          />

          <FilesTable
            onError={handleError}
            onSuccess={handleSuccess}
            onLocate={handleLocate}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
