import { useState } from 'react';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import * as api from '../api';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess: (token: string, username: string) => void;
  onError: (message: string) => void;
  onRegisterSuccess: () => void;
}

export function AuthForm({ mode, onSuccess, onError, onRegisterSuccess }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const u = username.trim();
    const p = password;

    if (!u || !p) {
      onError('Username and password are required');
      return;
    }

    if (p.length < 4) {
      onError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await api.login(u, p);
        // Persist auth BEFORE navigating to avoid race condition with ProtectedRoute
        localStorage.setItem('arch1v_token', response.token);
        localStorage.setItem('arch1v_user', response.username);
        // Give React a tick so contexts/routes see the new token
        setTimeout(() => {
          onSuccess(response.token, response.username);
        }, 100);
      } else {
        await api.register(username, password);
        onRegisterSuccess();
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
          placeholder="Enter username"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
          placeholder="Enter password (min 4 chars)"
          required
          minLength={4}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg font-medium transition-all duration-150 hover:scale-[1.01] glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : mode === 'login' ? (
          <>
            <LogIn className="w-5 h-5" />
            Sign In
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            Sign Up
          </>
        )}
      </button>
    </form>
  );
}
