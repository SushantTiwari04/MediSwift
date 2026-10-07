import type { LucideIcon } from 'lucide-react';
import {
  Tablet, PillBottle, Syringe, Droplet, Pill, FlaskConical, FlaskRound, Bike, Package, Store, MapPin, User,
} from 'lucide-react';

export type DeliveryStatus =
  | 'REQUEST'
  | 'ACCEPTED'
  | 'NAVIGATE_TO_PHARMACY'
  | 'PICKUP_OTP'
  | 'PACKAGE_VERIFIED'
  | 'NAVIGATE_TO_CUSTOMER'
  | 'CUSTOMER_OTP'
  | 'DELIVERED'
  | 'CANCELLED';

export type TemperatureStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface DeliveryItem {
  name: string;
  brand: string;
  strength: string;
  form: string;
  quantity: number;
  price: number;
  imageIcon: LucideIcon;
  imageColor: string;
  prescriptionRequired: boolean;
}

export interface DeliveryRequest {
  id: string;
  orderNumber: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyDistance: number;
  customerName: string;
  customerAddress: string;
  customerDistance: number;
  totalDistance: number;
  estimatedTime: string;
  payout: number;
  items: DeliveryItem[];
  itemCount: number;
  temperatureControlled: boolean;
  temperatureRange?: string;
  pickupOTP?: string;
  customerOTP?: string;
  status: DeliveryStatus;
  paymentMethod: string;
  notes?: string;
  placedAt: string;
}

export interface DeliveryHistoryItem {
  id: string;
  orderNumber: string;
  pharmacyName: string;
  customerName: string;
  customerArea: string;
  distance: number;
  payout: number;
  deliveredAt: string;
  duration: string;
  temperatureControlled: boolean;
  rating?: number;
}

export interface DeliveryNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'request' | 'delivery' | 'payment' | 'system' | 'rating';
}

export const deliveryStatusSteps: { status: DeliveryStatus; label: string; description: string }[] = [
  { status: 'REQUEST', label: 'Request Received', description: 'New delivery request from pharmacy' },
  { status: 'ACCEPTED', label: 'Accepted', description: 'You accepted the delivery' },
  { status: 'NAVIGATE_TO_PHARMACY', label: 'Heading to Pharmacy', description: 'Navigate to pharmacy for pickup' },
  { status: 'PICKUP_OTP', label: 'Pharmacy Pickup', description: 'Verify OTP at pharmacy counter' },
  { status: 'PACKAGE_VERIFIED', label: 'Package Verified', description: 'Package checked and sealed' },
  { status: 'NAVIGATE_TO_CUSTOMER', label: 'Heading to Customer', description: 'Navigate to customer address' },
  { status: 'CUSTOMER_OTP', label: 'Customer Delivery', description: 'Verify OTP with customer' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Order delivered successfully' },
];

export const deliveryRequests: DeliveryRequest[] = [
  {
    id: 'dr-001',
    orderNumber: 'MS20260824001',
    pharmacyName: 'Wellness Pharmacy',
    pharmacyAddress: '12 MG Road, Bengaluru 560001',
    pharmacyDistance: 1.2,
    customerName: 'John Doe',
    customerAddress: 'Flat 302, Green Meadows, Indiranagar, Bengaluru 560038',
    customerDistance: 3.5,
    totalDistance: 4.7,
    estimatedTime: '25 min',
    payout: 85,
    items: [
      { name: 'Azithromycin', brand: 'Azee', strength: '500mg', form: 'Tablet', quantity: 6, price: 120, imageIcon: Pill, imageColor: 'text-emerald-500', prescriptionRequired: true },
    ],
    itemCount: 1,
    temperatureControlled: false,
    status: 'REQUEST',
    paymentMethod: 'UPI',
    placedAt: '2026-08-24T10:30:00',
    pickupOTP: '4821',
    customerOTP: '7391',
  },
  {
    id: 'dr-002',
    orderNumber: 'MS20260824002',
    pharmacyName: 'HealthPlus Pharmacy',
    pharmacyAddress: '45 Brigade Road, Bengaluru 560025',
    pharmacyDistance: 2.8,
    customerName: 'Priya Iyer',
    customerAddress: '90 HSR Layout, Bengaluru 560102',
    customerDistance: 5.2,
    totalDistance: 8.0,
    estimatedTime: '40 min',
    payout: 120,
    items: [
      { name: 'Insulin Glargine', brand: 'Lantus', strength: '100 IU/ml', form: 'Injection', quantity: 1, price: 1450, imageIcon: Syringe, imageColor: 'text-red-500', prescriptionRequired: true },
      { name: 'Metformin', brand: 'Glycomet', strength: '850mg', form: 'Tablet', quantity: 2, price: 85, imageIcon: Tablet, imageColor: 'text-teal-500', prescriptionRequired: true },
    ],
    itemCount: 2,
    temperatureControlled: true,
    temperatureRange: '2-8°C',
    status: 'REQUEST',
    paymentMethod: 'Credit Card',
    placedAt: '2026-08-24T10:15:00',
    pickupOTP: '2156',
    customerOTP: '6840',
    notes: 'Cold chain delivery - keep insulin refrigerated',
  },
  {
    id: 'dr-003',
    orderNumber: 'MS20260824003',
    pharmacyName: 'Wellness Pharmacy',
    pharmacyAddress: '12 MG Road, Bengaluru 560001',
    pharmacyDistance: 1.2,
    customerName: 'Sarah Wilson',
    customerAddress: '23 Koramangala 5th Block, Bengaluru 560095',
    customerDistance: 2.1,
    totalDistance: 3.3,
    estimatedTime: '20 min',
    payout: 65,
    items: [
      { name: 'Paracetamol', brand: 'Crocin', strength: '500mg', form: 'Tablet', quantity: 2, price: 35, imageIcon: Tablet, imageColor: 'text-blue-500', prescriptionRequired: false },
      { name: 'Cough Syrup', brand: 'Benadryl', strength: '100ml', form: 'Syrup', quantity: 1, price: 110, imageIcon: FlaskConical, imageColor: 'text-orange-500', prescriptionRequired: false },
    ],
    itemCount: 2,
    temperatureControlled: false,
    status: 'REQUEST',
    paymentMethod: 'Cash on Delivery',
    placedAt: '2026-08-24T09:45:00',
    pickupOTP: '9342',
    customerOTP: '5168',
  },
];

export const currentDelivery: DeliveryRequest = {
  id: 'dr-002',
  orderNumber: 'MS20260824002',
  pharmacyName: 'HealthPlus Pharmacy',
  pharmacyAddress: '45 Brigade Road, Bengaluru 560025',
  pharmacyDistance: 0,
  customerName: 'Priya Iyer',
  customerAddress: '90 HSR Layout, Bengaluru 560102',
  customerDistance: 3.8,
  totalDistance: 8.0,
  estimatedTime: '18 min remaining',
  payout: 120,
  items: [
    { name: 'Insulin Glargine', brand: 'Lantus', strength: '100 IU/ml', form: 'Injection', quantity: 1, price: 1450, imageIcon: Syringe, imageColor: 'text-red-500', prescriptionRequired: true },
    { name: 'Metformin', brand: 'Glycomet', strength: '850mg', form: 'Tablet', quantity: 2, price: 85, imageIcon: Tablet, imageColor: 'text-teal-500', prescriptionRequired: true },
  ],
  itemCount: 2,
  temperatureControlled: true,
  temperatureRange: '2-8°C',
  status: 'NAVIGATE_TO_CUSTOMER',
  paymentMethod: 'Credit Card',
  placedAt: '2026-08-24T10:15:00',
  pickupOTP: '2156',
  customerOTP: '6840',
  notes: 'Cold chain delivery - keep insulin refrigerated',
};

export const deliveryHistory: DeliveryHistoryItem[] = [
  { id: 'dh-001', orderNumber: 'MS20260823001', pharmacyName: 'Wellness Pharmacy', customerName: 'Vikram Reddy', customerArea: 'HSR Layout', distance: 3.5, payout: 85, deliveredAt: '2026-08-23T18:30:00', duration: '28 min', temperatureControlled: false, rating: 5 },
  { id: 'dh-002', orderNumber: 'MS20260823002', pharmacyName: 'HealthPlus Pharmacy', customerName: 'Anita Sharma', customerArea: 'Koramangala', distance: 2.1, payout: 65, deliveredAt: '2026-08-23T15:10:00', duration: '22 min', temperatureControlled: false, rating: 4 },
  { id: 'dh-003', orderNumber: 'MS20260823003', pharmacyName: 'Wellness Pharmacy', customerName: 'Raj Patel', customerArea: 'Indiranagar', distance: 4.2, payout: 95, deliveredAt: '2026-08-23T12:45:00', duration: '35 min', temperatureControlled: true, rating: 5 },
  { id: 'dh-004', orderNumber: 'MS20260822004', pharmacyName: 'HealthPlus Pharmacy', customerName: 'Deepak Singh', customerArea: 'Jayanagar', distance: 5.0, payout: 110, deliveredAt: '2026-08-22T19:20:00', duration: '42 min', temperatureControlled: false },
  { id: 'dh-005', orderNumber: 'MS20260822005', pharmacyName: 'Wellness Pharmacy', customerName: 'Sarah Wilson', customerArea: 'Brigade Road', distance: 1.8, payout: 55, deliveredAt: '2026-08-22T14:00:00', duration: '18 min', temperatureControlled: false, rating: 5 },
  { id: 'dh-006', orderNumber: 'MS20260822006', pharmacyName: 'HealthPlus Pharmacy', customerName: 'John Doe', customerArea: 'MG Road', distance: 2.5, payout: 70, deliveredAt: '2026-08-22T11:15:00', duration: '25 min', temperatureControlled: false, rating: 4 },
  { id: 'dh-007', orderNumber: 'MS20260821007', pharmacyName: 'Wellness Pharmacy', customerName: 'Priya Iyer', customerArea: 'HSR Layout', distance: 3.8, payout: 120, deliveredAt: '2026-08-21T17:30:00', duration: '32 min', temperatureControlled: true, rating: 5 },
  { id: 'dh-008', orderNumber: 'MS20260821008', pharmacyName: 'Wellness Pharmacy', customerName: 'Raj Patel', customerArea: 'Indiranagar', distance: 4.0, payout: 90, deliveredAt: '2026-08-21T10:00:00', duration: '30 min', temperatureControlled: false, rating: 5 },
];

export const deliveryNotifications: DeliveryNotification[] = [
  { id: 'dn-001', title: 'New delivery request', message: 'Order MS20260824001 from Wellness Pharmacy - payout ₹85', timestamp: '2026-08-24T10:30:00', read: false, type: 'request' },
  { id: 'dn-002', title: 'Cold chain delivery request', message: 'Order MS20260824002 requires temperature-controlled handling - payout ₹120', timestamp: '2026-08-24T10:15:00', read: false, type: 'request' },
  { id: 'dn-003', title: 'Payout processed', message: '₹540 has been credited to your account for 6 deliveries on Aug 23', timestamp: '2026-08-24T09:00:00', read: false, type: 'payment' },
  { id: 'dn-004', title: '5-star rating received', message: 'Vikram Reddy rated you 5 stars for order MS20260823001', timestamp: '2026-08-23T19:00:00', read: true, type: 'rating' },
  { id: 'dn-005', title: 'Delivery completed', message: 'Order MS20260823001 delivered successfully to Vikram Reddy', timestamp: '2026-08-23T18:30:00', read: true, type: 'delivery' },
  { id: 'dn-006', title: 'Weekly performance', message: 'You completed 28 deliveries this week - 15% more than last week!', timestamp: '2026-08-23T08:00:00', read: true, type: 'system' },
];

export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date('2026-08-24T10:30:00');
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}
