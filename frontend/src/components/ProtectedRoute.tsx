import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth';
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
