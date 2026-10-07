import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Search,
  Package,
  FileText,
  User,
  Boxes,
  DollarSign,
  Users,
  Building2,
  BarChart3,
  Bike,
  Home,
  HeartPulse,
  Bell,
  Settings,
  HelpCircle,
  Siren,
  ShieldAlert,
  MapPin,
  ClipboardCheck,
  Truck,
  Star,
  Plus,
  CalendarClock,
  AlertTriangle,
  UserCircle,
  ClipboardList,
  Navigation,
  Inbox,
  History,
  LifeBuoy,
  ShieldCheck,
  ThermometerSun,
  LifeBuoy as Support,
  Pill,
} from 'lucide-react';

export type Role = 'customer' | 'pharmacy' | 'delivery' | 'admin';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  role: Role;
  label: string;
  items: NavItem[];
}

export const customerNav: NavItem[] = [
  { label: 'Home', path: '/customer', icon: Home },
  { label: 'Search', path: '/customer/search', icon: Search },
  { label: 'Orders', path: '/customer/orders', icon: Package },
  { label: 'Prescriptions', path: '/customer/prescriptions', icon: FileText },
  { label: 'Profile', path: '/customer/profile', icon: User },
];

export const customerSidebarNav: { label: string; items: NavItem[] }[] = [
  {
    label: 'Main',
    items: [
      { label: 'Home', path: '/customer', icon: Home },
      { label: 'Search Medicines', path: '/customer/search', icon: Search },
      { label: 'Pharmacies', path: '/customer/pharmacies', icon: MapPin },
      { label: 'My Orders', path: '/customer/orders', icon: Package },
      { label: 'Prescriptions', path: '/customer/prescriptions', icon: FileText },
    ],
  },
  {
    label: 'Health & Safety',
    items: [
      { label: 'Emergency Portal', path: '/customer/emergency', icon: Siren },
      { label: 'Report ADR', path: '/customer/adr-report', icon: ShieldAlert },
      { label: 'Medication Center', path: '/customer/medication-center', icon: HeartPulse },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Saved Addresses', path: '/customer/addresses', icon: MapPin },
      { label: 'Profile', path: '/customer/profile', icon: User },
      { label: 'Settings', path: '/customer/settings', icon: Settings },
      { label: 'Notifications', path: '/customer/notifications', icon: Bell },
      { label: 'Help & Support', path: '/customer/help', icon: HelpCircle },
    ],
  },
];

export const pharmacyNav: NavItem[] = [
  { label: 'Dashboard', path: '/pharmacy', icon: LayoutDashboard },
  { label: 'Orders', path: '/pharmacy/orders', icon: Package },
  { label: 'Inventory', path: '/pharmacy/inventory', icon: Boxes },
  { label: 'Prescriptions', path: '/pharmacy/prescriptions', icon: ClipboardCheck },
  { label: 'Profile', path: '/pharmacy/profile', icon: User },
];

export const pharmacySidebarNav: { label: string; items: NavItem[] }[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/pharmacy', icon: LayoutDashboard },
      { label: 'Orders', path: '/pharmacy/orders', icon: Package },
      { label: 'Prescription Verification', path: '/pharmacy/prescriptions', icon: ClipboardCheck },
      { label: 'Inventory', path: '/pharmacy/inventory', icon: Boxes },
    ],
  },
  {
    label: 'Stock Management',
    items: [
      { label: 'Add Medicine', path: '/pharmacy/inventory/add', icon: Plus },
      { label: 'Batch Management', path: '/pharmacy/inventory/batches', icon: ClipboardList },
      { label: 'Expiry Management', path: '/pharmacy/inventory/expiry', icon: CalendarClock },
      { label: 'Low Stock Alerts', path: '/pharmacy/inventory/low-stock', icon: AlertTriangle },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Delivery Management', path: '/pharmacy/delivery', icon: Truck },
      { label: 'Earnings', path: '/pharmacy/earnings', icon: DollarSign },
      { label: 'Analytics', path: '/pharmacy/analytics', icon: BarChart3 },
      { label: 'Reviews', path: '/pharmacy/reviews', icon: Star },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Pharmacy Profile', path: '/pharmacy/profile', icon: Building2 },
      { label: 'Pharmacist Profile', path: '/pharmacy/pharmacist-profile', icon: UserCircle },
      { label: 'Notifications', path: '/pharmacy/notifications', icon: Bell },
      { label: 'Settings', path: '/pharmacy/settings', icon: Settings },
    ],
  },
];

export const deliveryNav: NavItem[] = [
  { label: 'Dashboard', path: '/delivery', icon: LayoutDashboard },
  { label: 'Requests', path: '/delivery/requests', icon: Inbox },
  { label: 'Current', path: '/delivery/current', icon: Navigation },
  { label: 'Earnings', path: '/delivery/earnings', icon: DollarSign },
  { label: 'Profile', path: '/delivery/profile', icon: User },
];

export const deliverySidebarNav: { label: string; items: NavItem[] }[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/delivery', icon: LayoutDashboard },
      { label: 'Delivery Requests', path: '/delivery/requests', icon: Inbox },
      { label: 'Current Delivery', path: '/delivery/current', icon: Navigation },
    ],
  },
  {
    label: 'Performance',
    items: [
      { label: 'Earnings', path: '/delivery/earnings', icon: DollarSign },
      { label: 'Delivery History', path: '/delivery/history', icon: History },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', path: '/delivery/profile', icon: User },
      { label: 'Notifications', path: '/delivery/notifications', icon: Bell },
      { label: 'Help & Support', path: '/delivery/support', icon: LifeBuoy },
    ],
  },
];

export const navigation: NavGroup[] = [
  { role: 'customer', label: 'Customer', items: customerNav },
  {
    role: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacyNav,
  },
  {
    role: 'delivery',
    label: 'Delivery',
    items: deliveryNav,
  },
  {
    role: 'admin',
    label: 'Admin',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Customers', path: '/admin/customers', icon: Users },
      { label: 'Pharmacies', path: '/admin/pharmacies', icon: Building2 },
      { label: 'Delivery', path: '/admin/delivery-partners', icon: Bike },
      { label: 'Orders', path: '/admin/orders', icon: Package },
      { label: 'Prescriptions', path: '/admin/prescriptions', icon: ClipboardCheck },
      { label: 'Safety', path: '/admin/medication-safety', icon: ShieldCheck },
      { label: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

export const adminSidebarNav: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Customers', path: '/admin/customers', icon: Users },
      { label: 'Pharmacies', path: '/admin/pharmacies', icon: Building2 },
      { label: 'Delivery Partners', path: '/admin/delivery-partners', icon: Bike },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Orders', path: '/admin/orders', icon: Package },
      { label: 'Prescriptions', path: '/admin/prescriptions', icon: ClipboardCheck },
      { label: 'Medication Safety', path: '/admin/medication-safety', icon: ShieldCheck },
      { label: 'ADR Reports', path: '/admin/adr-reports', icon: ShieldAlert },
      { label: 'Temperature Monitoring', path: '/admin/temperature', icon: ThermometerSun },
    ],
  },
  {
    label: 'Financials',
    items: [
      { label: 'Revenue', path: '/admin/revenue', icon: DollarSign },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'Support', path: '/admin/support', icon: Support },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

export function getNavForRole(role: Role): NavItem[] {
  const group = navigation.find((g) => g.role === role);
  return group ? group.items : [];
}
