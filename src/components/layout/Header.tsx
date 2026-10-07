import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, Search, LogOut, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/config/navigation';

interface HeaderProps {
  onMenuClick: () => void;
  role: Role;
}

export function Header({ onMenuClick, role }: HeaderProps) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    const loginPaths: Record<Role, string> = {
      customer: '/customer/login',
      pharmacy: '/pharmacy/login',
      delivery: '/delivery/login',
      admin: '/admin/login',
    };
    navigate(loginPaths[role]);
  };

  const initial = profile?.full_name?.charAt(0).toUpperCase() || role.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-[var(--header-height)] items-center gap-3 border-b bg-card/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link to={`/${role}`} className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <HeartPulse className="h-4 w-4 text-primary-foreground" />
        </div>
      </Link>

      <div className="hidden flex-1 sm:block">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="hidden text-right sm:block">
          <p className="truncate text-sm font-medium">{profile?.full_name || `${role} user`}</p>
          <p className="truncate text-xs text-muted-foreground capitalize">{profile?.role || role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {initial}
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
