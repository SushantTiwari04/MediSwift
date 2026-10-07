import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav, MobileBrandBar } from './MobileBottomNav';
import type { Role } from '@/config/navigation';
import { getNavForRole } from '@/config/navigation';

interface AppLayoutProps {
  role: Role;
  children: React.ReactNode;
}

export function AppLayout({ role, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = getNavForRole(role);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        role={role}
        items={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[var(--sidebar-width)]">
        <MobileBrandBar homePath={`/${role}`} />
        <Header onMenuClick={() => setSidebarOpen(true)} role={role} />
        <main className="pb-[var(--bottom-nav-height)] lg:pb-0">
          {children}
        </main>
      </div>

      <MobileBottomNav items={navItems} />
    </div>
  );
}
