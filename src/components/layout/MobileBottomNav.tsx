import { NavLink, Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/config/navigation';

interface MobileBottomNavProps {
  items: NavItem[];
  homePath?: string;
}

export function MobileBottomNav({ items, homePath }: MobileBottomNavProps) {
  const visibleItems = items.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-[var(--bottom-nav-height)] items-center justify-around border-t bg-card lg:hidden">
      {visibleItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path.split('/').length === 2}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn('h-5 w-5', isActive && 'fill-primary/10')}
              />
              <span className="truncate">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function MobileBrandBar({ homePath }: { homePath?: string }) {
  const content = (
    <>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <HeartPulse className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="text-lg font-bold tracking-tight">MediSwift</span>
    </>
  );

  if (homePath) {
    return (
      <Link to={homePath} className="flex h-[var(--header-height)] items-center gap-2 border-b bg-card px-4 lg:hidden">
        {content}
      </Link>
    );
  }
  return (
    <div className="flex h-[var(--header-height)] items-center gap-2 border-b bg-card px-4 lg:hidden">
      {content}
    </div>
  );
}
