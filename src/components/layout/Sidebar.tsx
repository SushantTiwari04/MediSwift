import { NavLink, Link } from 'react-router-dom';
import { HeartPulse, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem, Role } from '@/config/navigation';
import { customerSidebarNav, pharmacySidebarNav, deliverySidebarNav, adminSidebarNav } from '@/config/navigation';

interface SidebarProps {
  role: Role;
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, items, isOpen, onClose }: SidebarProps) {
  const groupedNav = role === 'customer'
    ? customerSidebarNav
    : role === 'pharmacy'
    ? pharmacySidebarNav
    : role === 'delivery'
    ? deliverySidebarNav
    : role === 'admin'
    ? adminSidebarNav
    : null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-[var(--sidebar-width)] flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-[var(--header-height)] items-center justify-between border-b px-6">
          <Link to={`/${role}`} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">MediSwift</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          {groupedNav ? (
            groupedNav.map((group) => (
              <div key={group.label} className="mb-4">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === `/${role}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          )
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {role} portal
              </p>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === `/${role}`}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {role.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium capitalize">{role} user</p>
              <p className="truncate text-xs text-muted-foreground">Demo account</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
