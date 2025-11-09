import { useState } from 'react';
import { useNavigate } from '../router';
import { Database } from 'lucide-react';
import { AuthForm } from '../components/AuthForm';
import { Toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (token: string, username: string) => {
    login(token, username);
    navigate('/app');
  };

  const handleError = (message: string) => {
    setToast({ message, type: 'error' });
  };

  const handleRegisterSuccess = () => {
    setToast({ message: 'Registration successful! Please sign in.', type: 'success' });
    setMode('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 mb-4 glow">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Arch1v</h1>
          <p className="text-gray-400">Spring Boot Edition</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex border-b border-white/10 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                mode === 'login'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                mode === 'register'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AuthForm
            mode={mode}
            onSuccess={handleSuccess}
            onError={handleError}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>
    </div>
  );
}
