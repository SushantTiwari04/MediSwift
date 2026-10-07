import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth, getRoleHomePath } from '@/lib/auth';
import type { UserRole } from '@/lib/supabase';
import { HeartPulse, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  role: UserRole;
  children: ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <HeartPulse className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    const loginPaths: Record<UserRole, string> = {
      customer: '/customer/login',
      pharmacy: '/pharmacy/login',
      delivery: '/delivery/login',
      admin: '/admin/login',
    };
    return <Navigate to={loginPaths[role]} state={{ from: location }} replace />;
  }

  if (profile.role !== role) {
    return <Navigate to={getRoleHomePath(profile.role)} replace />;
  }

  return <>{children}</>;
}
