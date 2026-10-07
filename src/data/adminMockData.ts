import type { LucideIcon } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'BANNED';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'EXPIRED';
export type DeliveryPartnerStatus = 'ONLINE' | 'OFFLINE' | 'ON_DELIVERY';
export type AdminOrderStatus =
  | 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'PICKED_UP'
  | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export type PrescriptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUIRED';
export type SafetyAlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SafetyAlertType = 'DRUG_INTERACTION' | 'DUPLICATE_MEDICINE' | 'ALLERGY' | 'DOSAGE' | 'CONTRAINDICATION';
export type ADRSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'FATAL';
export type ADRStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'REVIEWED' | 'ESCALATED';
export type TemperatureStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type SettlementStatus = 'SETTLED' | 'PENDING' | 'PROCESSING';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketChannel = 'CUSTOMER' | 'PHARMACY' | 'DELIVERY';

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: AccountStatus;
  totalOrders: number;
  totalSpent: number;
  city: string;
  avatarColor: string;
}

export interface AdminPharmacy {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  pharmacistLicense: string;
  verificationStatus: VerificationStatus;
  rating: number;
  totalOrders: number;
  revenue: number;
  joinedAt: string;
  inventoryCount: number;
  isOpen: boolean;
  avatarColor: string;
}

export interface AdminDeliveryPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: DeliveryPartnerStatus;
  verificationStatus: VerificationStatus;
  vehicleType: 'Bike' | 'Scooter' | 'Cycle';
  totalDeliveries: number;
  rating: number;
  earnings: number;
  joinedAt: string;
  currentDeliveryId?: string;
  avatarColor: string;
}

export interface AdminOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerId: string;
  pharmacyName: string;
  pharmacyId: string;
  deliveryPartnerName?: string;
  status: AdminOrderStatus;
  total: number;
  items: AdminOrderItem[];
  placedAt: string;
  paymentMethod: string;
  temperatureControlled: boolean;
}

export interface AdminPrescription {
  id: string;
  prescriptionNumber: string;
  customerName: string;
  pharmacyName: string;
  doctorName: string;
  doctorLicense: string;
  status: PrescriptionStatus;
  uploadedAt: string;
  fileType: 'image' | 'pdf';
  medicines: { name: string; strength: string; quantity: number }[];
  safetyAlertsCount: number;
}

export interface SafetyAlert {
  id: string;
  type: SafetyAlertType;
  severity: SafetyAlertSeverity;
  patientName: string;
  medicines: string[];
  description: string;
  pharmacistReviewed: boolean;
  reviewStatus: 'PENDING' | 'REVIEWED' | 'ESCALATED';
  createdAt: string;
  orderId: string;
}

export interface ADRReport {
  id: string;
  reportNumber: string;
  patientName: string;
  medicine: string;
  reaction: string;
  severity: ADRSeverity;
  status: ADRStatus;
  reportedAt: string;
  reportedBy: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  description: string;
}

export interface TemperatureLog {
  id: string;
  orderNumber: string;
  deliveryPartnerName: string;
  medicine: string;
  requiredRange: string;
  currentTemp: number;
  status: TemperatureStatus;
  lastUpdated: string;
  logCount: number;
}

export interface RevenueTransaction {
  id: string;
  date: string;
  type: 'ORDER' | 'COMMISSION' | 'DELIVERY_FEE' | 'SETTLEMENT' | 'REFUND';
  description: string;
  pharmacyName: string;
  amount: number;
  status: SettlementStatus;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'pharmacy' | 'delivery' | 'safety' | 'system' | 'revenue';
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  channel: TicketChannel;
  user: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  lastReply: string;
  category: string;
}

// ── Mock Data ──────────────────────────────────────────

export const adminCustomers: AdminCustomer[] = [
  { id: 'cust-001', name: 'John Doe', email: 'john.doe@email.com', phone: '+91 98765 43210', joinedAt: '2026-01-15', status: 'ACTIVE', totalOrders: 24, totalSpent: 12450, city: 'Bengaluru', avatarColor: 'bg-blue-500' },
  { id: 'cust-002', name: 'Sarah Wilson', email: 'sarah.w@email.com', phone: '+91 98400 11223', joinedAt: '2026-02-08', status: 'ACTIVE', totalOrders: 12, totalSpent: 5680, city: 'Bengaluru', avatarColor: 'bg-purple-500' },
  { id: 'cust-003', name: 'Raj Patel', email: 'raj.patel@email.com', phone: '+91 90080 55667', joinedAt: '2025-11-20', status: 'ACTIVE', totalOrders: 38, totalSpent: 22340, city: 'Mysuru', avatarColor: 'bg-teal-500' },
  { id: 'cust-004', name: 'Anita Sharma', email: 'anita.s@email.com', phone: '+91 91234 56780', joinedAt: '2026-03-05', status: 'ACTIVE', totalOrders: 8, totalSpent: 3120, city: 'Bengaluru', avatarColor: 'bg-pink-500' },
  { id: 'cust-005', name: 'Vikram Reddy', email: 'vikram.r@email.com', phone: '+91 90011 22334', joinedAt: '2025-09-12', status: 'SUSPENDED', totalOrders: 15, totalSpent: 7890, city: 'Bengaluru', avatarColor: 'bg-red-500' },
  { id: 'cust-006', name: 'Priya Iyer', email: 'priya.iyer@email.com', phone: '+91 94455 66778', joinedAt: '2026-04-18', status: 'ACTIVE', totalOrders: 31, totalSpent: 18900, city: 'Bengaluru', avatarColor: 'bg-indigo-500' },
  { id: 'cust-007', name: 'Deepak Singh', email: 'deepak.s@email.com', phone: '+91 90090 80706', joinedAt: '2026-06-22', status: 'ACTIVE', totalOrders: 5, totalSpent: 1450, city: 'Mangaluru', avatarColor: 'bg-orange-500' },
  { id: 'cust-008', name: 'Meera Nair', email: 'meera.nair@email.com', phone: '+91 98456 77889', joinedAt: '2026-07-01', status: 'PENDING', totalOrders: 0, totalSpent: 0, city: 'Bengaluru', avatarColor: 'bg-green-500' },
  { id: 'cust-009', name: 'Arjun Kumar', email: 'arjun.k@email.com', phone: '+91 90876 54321', joinedAt: '2025-08-14', status: 'ACTIVE', totalOrders: 42, totalSpent: 28500, city: 'Bengaluru', avatarColor: 'bg-cyan-500' },
  { id: 'cust-010', name: 'Fatima Begum', email: 'fatima.b@email.com', phone: '+91 99887 65432', joinedAt: '2026-05-30', status: 'BANNED', totalOrders: 3, totalSpent: 890, city: 'Bengaluru', avatarColor: 'bg-amber-500' },
];

export const adminPharmacies: AdminPharmacy[] = [
  { id: 'pharma-001', name: 'Wellness Pharmacy', ownerName: 'Dr. Rajesh Kumar', email: 'wellness@pharma.com', phone: '+91 80 2234 5678', city: 'Bengaluru', address: '12 MG Road, Bengaluru 560001', licenseNumber: 'KA-PHAR-2023-001', licenseExpiry: '2028-06-30', pharmacistLicense: 'KMC-12345', verificationStatus: 'VERIFIED', rating: 4.8, totalOrders: 1240, revenue: 245000, joinedAt: '2025-06-15', inventoryCount: 156, isOpen: true, avatarColor: 'bg-blue-500' },
  { id: 'pharma-002', name: 'Apollo Pharmacy', ownerName: 'Dr. Suresh Menon', email: 'apollo@pharma.com', phone: '+91 80 2555 1234', city: 'Bengaluru', address: '45 Brigade Road, Bengaluru 560025', licenseNumber: 'KA-PHAR-2022-002', licenseExpiry: '2027-03-15', pharmacistLicense: 'KMC-23456', verificationStatus: 'VERIFIED', rating: 4.7, totalOrders: 3400, revenue: 568000, joinedAt: '2025-04-10', inventoryCount: 210, isOpen: true, avatarColor: 'bg-red-500' },
  { id: 'pharma-003', name: 'MedPlus Pharmacy', ownerName: 'Dr. Lakshmi Rao', email: 'medplus@pharma.com', phone: '+91 80 4123 6789', city: 'Bengaluru', address: '78 Indiranagar, Bengaluru 560038', licenseNumber: 'KA-PHAR-2024-003', licenseExpiry: '2029-01-10', pharmacistLicense: 'KMC-34567', verificationStatus: 'VERIFIED', rating: 4.5, totalOrders: 2100, revenue: 389000, joinedAt: '2025-07-20', inventoryCount: 180, isOpen: true, avatarColor: 'bg-emerald-500' },
  { id: 'pharma-004', name: 'HealthCare Plus', ownerName: 'Dr. Imran Khan', email: 'healthcare@pharma.com', phone: '+91 80 4678 9012', city: 'Bengaluru', address: '23 Koramangala, Bengaluru 560095', licenseNumber: 'KA-PHAR-2025-004', licenseExpiry: '2030-04-20', pharmacistLicense: 'KMC-45678', verificationStatus: 'PENDING', rating: 0, totalOrders: 0, revenue: 0, joinedAt: '2026-09-15', inventoryCount: 0, isOpen: false, avatarColor: 'bg-purple-500' },
  { id: 'pharma-005', name: 'LifeLine Pharmacy', ownerName: 'Dr. Nisha Gowda', email: 'lifeline@pharma.com', phone: '+91 80 2233 7788', city: 'Bengaluru', address: '56 Jayanagar, Bengaluru 560011', licenseNumber: 'KA-PHAR-2024-005', licenseExpiry: '2026-08-30', pharmacistLicense: 'KMC-56789', verificationStatus: 'EXPIRED', rating: 4.2, totalOrders: 450, revenue: 67000, joinedAt: '2025-10-05', inventoryCount: 85, isOpen: false, avatarColor: 'bg-amber-500' },
  { id: 'pharma-006', name: 'CareWell Pharmacy', ownerName: 'Dr. Arun Pillai', email: 'carewell@pharma.com', phone: '+91 80 4567 8900', city: 'Bengaluru', address: '90 HSR Layout, Bengaluru 560102', licenseNumber: 'KA-PHAR-2023-006', licenseExpiry: '2028-07-25', pharmacistLicense: 'KMC-67890', verificationStatus: 'VERIFIED', rating: 4.7, totalOrders: 1560, revenue: 312000, joinedAt: '2025-05-12', inventoryCount: 145, isOpen: true, avatarColor: 'bg-cyan-500' },
  { id: 'pharma-007', name: 'Sunrise Medicals', ownerName: 'Dr. Kavya Reddy', email: 'sunrise@pharma.com', phone: '+91 80 4455 6677', city: 'Mysuru', address: '15 Sayyaji Rao Road, Mysuru 570001', licenseNumber: 'KA-PHAR-2025-007', licenseExpiry: '2030-12-31', pharmacistLicense: 'KMC-78901', verificationStatus: 'PENDING', rating: 0, totalOrders: 0, revenue: 0, joinedAt: '2026-09-28', inventoryCount: 0, isOpen: false, avatarColor: 'bg-orange-500' },
  { id: 'pharma-008', name: 'MediCare Plus', ownerName: 'Dr. Sunil Joshi', email: 'medicare@pharma.com', phone: '+91 80 3344 5566', city: 'Bengaluru', address: '8 JP Nagar, Bengaluru 560078', licenseNumber: 'KA-PHAR-2024-008', licenseExpiry: '2027-11-05', pharmacistLicense: 'KMC-89012', verificationStatus: 'REJECTED', rating: 0, totalOrders: 0, revenue: 0, joinedAt: '2026-08-20', inventoryCount: 0, isOpen: false, avatarColor: 'bg-rose-500' },
];

export const adminDeliveryPartners: AdminDeliveryPartner[] = [
  { id: 'dp-001', name: 'Rajesh Kumar', email: 'rajesh.d@email.com', phone: '+91 98765 43210', city: 'Bengaluru', status: 'ONLINE', verificationStatus: 'VERIFIED', vehicleType: 'Bike', totalDeliveries: 342, rating: 4.8, earnings: 28500, joinedAt: '2025-08-15', avatarColor: 'bg-blue-500' },
  { id: 'dp-002', name: 'Mohan Das', email: 'mohan.d@email.com', phone: '+91 99887 76655', city: 'Bengaluru', status: 'ON_DELIVERY', verificationStatus: 'VERIFIED', vehicleType: 'Scooter', totalDeliveries: 218, rating: 4.6, earnings: 19200, joinedAt: '2025-09-20', currentDeliveryId: 'ao-003', avatarColor: 'bg-emerald-500' },
  { id: 'dp-003', name: 'Suresh Nair', email: 'suresh.d@email.com', phone: '+91 98700 12345', city: 'Bengaluru', status: 'OFFLINE', verificationStatus: 'VERIFIED', vehicleType: 'Bike', totalDeliveries: 189, rating: 4.5, earnings: 15600, joinedAt: '2025-10-10', avatarColor: 'bg-purple-500' },
  { id: 'dp-004', name: 'Arun Kumar', email: 'arun.d@email.com', phone: '+91 98000 54321', city: 'Bengaluru', status: 'ON_DELIVERY', verificationStatus: 'VERIFIED', vehicleType: 'Bike', totalDeliveries: 275, rating: 4.7, earnings: 22800, joinedAt: '2025-07-18', currentDeliveryId: 'ao-004', avatarColor: 'bg-amber-500' },
  { id: 'dp-005', name: 'Vijay Prasad', email: 'vijay.d@email.com', phone: '+91 90123 45678', city: 'Bengaluru', status: 'OFFLINE', verificationStatus: 'PENDING', vehicleType: 'Scooter', totalDeliveries: 0, rating: 0, earnings: 0, joinedAt: '2026-09-25', avatarColor: 'bg-cyan-500' },
  { id: 'dp-006', name: 'Ganesh Rao', email: 'ganesh.d@email.com', phone: '+91 98456 12378', city: 'Bengaluru', status: 'ONLINE', verificationStatus: 'VERIFIED', vehicleType: 'Cycle', totalDeliveries: 98, rating: 4.3, earnings: 6800, joinedAt: '2026-01-14', avatarColor: 'bg-orange-500' },
  { id: 'dp-007', name: 'Manoj Shetty', email: 'manoj.d@email.com', phone: '+91 99765 43210', city: 'Mysuru', status: 'ON_DELIVERY', verificationStatus: 'VERIFIED', vehicleType: 'Bike', totalDeliveries: 156, rating: 4.4, earnings: 11200, joinedAt: '2026-02-20', currentDeliveryId: 'ao-006', avatarColor: 'bg-red-500' },
  { id: 'dp-008', name: 'Puneeth Raj', email: 'puneeth.d@email.com', phone: '+91 90909 80807', city: 'Bengaluru', status: 'OFFLINE', verificationStatus: 'REJECTED', vehicleType: 'Scooter', totalDeliveries: 0, rating: 0, earnings: 0, joinedAt: '2026-09-10', avatarColor: 'bg-indigo-500' },
];

export const adminOrders: AdminOrder[] = [
  { id: 'ao-001', orderNumber: 'MS20261001001', customerName: 'John Doe', customerId: 'cust-001', pharmacyName: 'Wellness Pharmacy', pharmacyId: 'pharma-001', deliveryPartnerName: 'Rajesh Kumar', status: 'DELIVERED', total: 755, items: [{ name: 'Azithromycin 500mg', quantity: 6, price: 120 }, { name: 'Paracetamol 500mg', quantity: 2, price: 35 }], placedAt: '2026-10-01T09:30:00', paymentMethod: 'UPI', temperatureControlled: false },
  { id: 'ao-002', orderNumber: 'MS20261001002', customerName: 'Sarah Wilson', customerId: 'cust-002', pharmacyName: 'Apollo Pharmacy', pharmacyId: 'pharma-002', status: 'IN_TRANSIT', total: 180, items: [{ name: 'Paracetamol 500mg', quantity: 2, price: 35 }, { name: 'ORS', quantity: 3, price: 25 }], placedAt: '2026-10-01T10:05:00', paymentMethod: 'Credit Card', temperatureControlled: false },
  { id: 'ao-003', orderNumber: 'MS20261001003', customerName: 'Raj Patel', customerId: 'cust-003', pharmacyName: 'MedPlus Pharmacy', pharmacyId: 'pharma-003', deliveryPartnerName: 'Mohan Das', status: 'PICKED_UP', total: 590, items: [{ name: 'Metformin 850mg', quantity: 3, price: 85 }, { name: 'Atorvastatin 10mg', quantity: 2, price: 150 }], placedAt: '2026-10-01T09:15:00', paymentMethod: 'UPI', temperatureControlled: false },
  { id: 'ao-004', orderNumber: 'MS20261001004', customerName: 'Anita Sharma', customerId: 'cust-004', pharmacyName: 'CareWell Pharmacy', pharmacyId: 'pharma-006', deliveryPartnerName: 'Arun Kumar', status: 'PREPARING', total: 1485, items: [{ name: 'Insulin Glargine 100IU', quantity: 1, price: 1450 }], placedAt: '2026-10-01T08:45:00', paymentMethod: 'Credit Card', temperatureControlled: true },
  { id: 'ao-005', orderNumber: 'MS20261001005', customerName: 'Vikram Reddy', customerId: 'cust-005', pharmacyName: 'Wellness Pharmacy', pharmacyId: 'pharma-001', deliveryPartnerName: 'Suresh Nair', status: 'DELIVERED', total: 350, items: [{ name: 'Vitamin D3', quantity: 1, price: 65 }, { name: 'Multivitamin', quantity: 1, price: 250 }], placedAt: '2026-10-01T07:00:00', paymentMethod: 'UPI', temperatureControlled: false },
  { id: 'ao-006', orderNumber: 'MS20261001006', customerName: 'Priya Iyer', customerId: 'cust-006', pharmacyName: 'Apollo Pharmacy', pharmacyId: 'pharma-002', deliveryPartnerName: 'Manoj Shetty', status: 'IN_TRANSIT', total: 1485, items: [{ name: 'Insulin Glargine 100IU', quantity: 1, price: 1450 }], placedAt: '2026-10-01T11:20:00', paymentMethod: 'Credit Card', temperatureControlled: true },
  { id: 'ao-007', orderNumber: 'MS20261001007', customerName: 'Deepak Singh', customerId: 'cust-007', pharmacyName: 'MedPlus Pharmacy', pharmacyId: 'pharma-003', status: 'CANCELLED', total: 225, items: [{ name: 'Amoxicillin 250mg', quantity: 2, price: 95 }], placedAt: '2026-09-30T12:30:00', paymentMethod: 'UPI', temperatureControlled: false },
  { id: 'ao-008', orderNumber: 'MS20261001008', customerName: 'Arjun Kumar', customerId: 'cust-009', pharmacyName: 'CareWell Pharmacy', pharmacyId: 'pharma-006', deliveryPartnerName: 'Ganesh Rao', status: 'READY', total: 420, items: [{ name: 'Omeprazole 20mg', quantity: 2, price: 75 }, { name: 'Cetirizine 10mg', quantity: 3, price: 45 }], placedAt: '2026-10-01T06:30:00', paymentMethod: 'Cash on Delivery', temperatureControlled: false },
  { id: 'ao-009', orderNumber: 'MS20261001009', customerName: 'Meera Nair', customerId: 'cust-008', pharmacyName: 'Wellness Pharmacy', pharmacyId: 'pharma-001', status: 'NEW', total: 310, items: [{ name: 'Cough Syrup', quantity: 1, price: 110 }, { name: 'Ibuprofen 400mg', quantity: 2, price: 55 }], placedAt: '2026-10-01T11:45:00', paymentMethod: 'UPI', temperatureControlled: false },
  { id: 'ao-010', orderNumber: 'MS20260930010', customerName: 'John Doe', customerId: 'cust-001', pharmacyName: 'Apollo Pharmacy', pharmacyId: 'pharma-002', deliveryPartnerName: 'Rajesh Kumar', status: 'DELIVERED', total: 560, items: [{ name: 'Pantoprazole 40mg', quantity: 2, price: 90 }, { name: 'Eye Drops', quantity: 2, price: 95 }], placedAt: '2026-09-30T16:00:00', paymentMethod: 'Credit Card', temperatureControlled: false },
];

export const adminPrescriptions: AdminPrescription[] = [
  { id: 'aprx-001', prescriptionNumber: 'RX20261001001', customerName: 'John Doe', pharmacyName: 'Wellness Pharmacy', doctorName: 'Dr. Priya Reddy, MBBS', doctorLicense: 'KMC-78901', status: 'PENDING', uploadedAt: '2026-10-01T09:30:00', fileType: 'pdf', medicines: [{ name: 'Azithromycin', strength: '500mg', quantity: 5 }], safetyAlertsCount: 1 },
  { id: 'aprx-002', prescriptionNumber: 'RX20261001002', customerName: 'Raj Patel', pharmacyName: 'MedPlus Pharmacy', doctorName: 'Dr. Anil Sharma, MBBS, MD', doctorLicense: 'KMC-45678', status: 'APPROVED', uploadedAt: '2026-10-01T09:15:00', fileType: 'image', medicines: [{ name: 'Metformin', strength: '850mg', quantity: 60 }, { name: 'Atorvastatin', strength: '10mg', quantity: 30 }], safetyAlertsCount: 2 },
  { id: 'aprx-003', prescriptionNumber: 'RX20261001003', customerName: 'Priya Iyer', pharmacyName: 'Apollo Pharmacy', doctorName: 'Dr. Vikram Singh, MBBS, MS', doctorLicense: 'KMC-12345', status: 'APPROVED', uploadedAt: '2026-10-01T11:20:00', fileType: 'image', medicines: [{ name: 'Insulin Glargine', strength: '100 IU/ml', quantity: 1 }], safetyAlertsCount: 1 },
  { id: 'aprx-004', prescriptionNumber: 'RX20261001004', customerName: 'Deepak Singh', pharmacyName: 'MedPlus Pharmacy', doctorName: 'Dr. Unknown', doctorLicense: 'Not visible', status: 'REJECTED', uploadedAt: '2026-09-30T12:30:00', fileType: 'image', medicines: [], safetyAlertsCount: 0 },
  { id: 'aprx-005', prescriptionNumber: 'RX20261001005', customerName: 'Anita Sharma', pharmacyName: 'CareWell Pharmacy', doctorName: 'Dr. Meera Krishnan, MBBS', doctorLicense: 'KMC-34521', status: 'CLARIFICATION_REQUIRED', uploadedAt: '2026-10-01T08:45:00', fileType: 'image', medicines: [{ name: 'Insulin Glargine', strength: '100 IU/ml', quantity: 1 }], safetyAlertsCount: 1 },
  { id: 'aprx-006', prescriptionNumber: 'RX20260930006', customerName: 'Arjun Kumar', pharmacyName: 'CareWell Pharmacy', doctorName: 'Dr. Sanjay Gupta, MBBS, MD', doctorLicense: 'KMC-67812', status: 'PENDING', uploadedAt: '2026-09-30T14:00:00', fileType: 'pdf', medicines: [{ name: 'Omeprazole', strength: '20mg', quantity: 14 }, { name: 'Cetirizine', strength: '10mg', quantity: 10 }], safetyAlertsCount: 0 },
  { id: 'aprx-007', prescriptionNumber: 'RX20260930007', customerName: 'Meera Nair', pharmacyName: 'Wellness Pharmacy', doctorName: 'Dr. Anjali Rao, MBBS', doctorLicense: 'KMC-89023', status: 'PENDING', uploadedAt: '2026-09-30T10:15:00', fileType: 'image', medicines: [{ name: 'Cough Syrup', strength: '100ml', quantity: 1 }, { name: 'Ibuprofen', strength: '400mg', quantity: 10 }], safetyAlertsCount: 0 },
];

export const safetyAlerts: SafetyAlert[] = [
  { id: 'sa-001', type: 'DRUG_INTERACTION', severity: 'HIGH', patientName: 'Raj Patel', medicines: ['Metformin', 'Atorvastatin'], description: 'Metformin + Atorvastatin may increase risk of hypoglycemia. Monitor blood glucose closely.', pharmacistReviewed: true, reviewStatus: 'REVIEWED', createdAt: '2026-10-01T09:15:00', orderId: 'ao-003' },
  { id: 'sa-002', type: 'ALLERGY', severity: 'CRITICAL', patientName: 'John Doe', medicines: ['Azithromycin'], description: 'Patient history indicates penicillin allergy. Azithromycin is a macrolide — safe alternative confirmed.', pharmacistReviewed: true, reviewStatus: 'REVIEWED', createdAt: '2026-10-01T09:30:00', orderId: 'ao-001' },
  { id: 'sa-003', type: 'DUPLICATE_MEDICINE', severity: 'MEDIUM', patientName: 'Arjun Kumar', medicines: ['Omeprazole', 'Pantoprazole'], description: 'Both Omeprazole and Pantoprazole are proton pump inhibitors. Duplicate therapy detected.', pharmacistReviewed: false, reviewStatus: 'PENDING', createdAt: '2026-10-01T06:30:00', orderId: 'ao-008' },
  { id: 'sa-004', type: 'DOSAGE', severity: 'LOW', patientName: 'Anita Sharma', medicines: ['Insulin Glargine'], description: 'Insulin Glargine 100 IU/ml dosage requires endocrinologist confirmation.', pharmacistReviewed: false, reviewStatus: 'PENDING', createdAt: '2026-10-01T08:45:00', orderId: 'ao-004' },
  { id: 'sa-005', type: 'CONTRAINDICATION', severity: 'HIGH', patientName: 'Priya Iyer', medicines: ['Insulin Glargine'], description: 'Patient reports history of hypoglycemia episodes. Insulin therapy requires careful monitoring.', pharmacistReviewed: false, reviewStatus: 'ESCALATED', createdAt: '2026-10-01T11:20:00', orderId: 'ao-006' },
  { id: 'sa-006', type: 'DRUG_INTERACTION', severity: 'MEDIUM', patientName: 'Sarah Wilson', medicines: ['Paracetamol', 'Ibuprofen'], description: 'Paracetamol + Ibuprofen combination is generally safe but monitor for liver enzymes.', pharmacistReviewed: true, reviewStatus: 'REVIEWED', createdAt: '2026-09-30T15:00:00', orderId: 'ao-002' },
  { id: 'sa-007', type: 'ALLERGY', severity: 'HIGH', patientName: 'Deepak Singh', medicines: ['Amoxicillin'], description: 'Patient reports rash with previous antibiotic course. Consider alternative antibiotic class.', pharmacistReviewed: false, reviewStatus: 'PENDING', createdAt: '2026-09-30T12:30:00', orderId: 'ao-007' },
];

export const adrReports: ADRReport[] = [
  { id: 'adr-001', reportNumber: 'ADR20261001001', patientName: 'John Doe', medicine: 'Azithromycin (Azee 500mg)', reaction: 'Severe stomach cramps and diarrhea', severity: 'MODERATE', status: 'UNDER_REVIEW', reportedAt: '2026-10-01T08:00:00', reportedBy: 'John Doe (Self)', age: 34, gender: 'Male', description: 'Patient experienced severe abdominal pain and watery diarrhea 2 hours after taking first dose of Azithromycin 500mg. Symptoms persisted for 6 hours. No previous history of similar reaction.' },
  { id: 'adr-002', reportNumber: 'ADR20261001002', patientName: 'Priya Iyer', medicine: 'Insulin Glargine (Lantus)', reaction: 'Injection site redness and swelling', severity: 'MILD', status: 'REVIEWED', reportedAt: '2026-09-30T16:30:00', reportedBy: 'Priya Iyer (Self)', age: 52, gender: 'Female', description: 'Localized redness and mild swelling at injection site. Resolved within 48 hours without treatment. Patient advised to rotate injection sites.' },
  { id: 'adr-003', reportNumber: 'ADR20261001003', patientName: 'Raj Patel', medicine: 'Metformin (Glycomet 850mg)', reaction: 'Nausea and metallic taste', severity: 'MILD', status: 'REVIEWED', reportedAt: '2026-09-29T12:00:00', reportedBy: 'Dr. Anil Sharma', age: 58, gender: 'Male', description: 'Patient reports persistent nausea and metallic taste after starting Metformin 850mg twice daily. Advised to take with meals. Symptoms improved after 3 days.' },
  { id: 'adr-004', reportNumber: 'ADR20261001004', patientName: 'Meera Nair', medicine: 'Cough Syrup (Benadryl)', reaction: 'Drowsiness and dizziness', severity: 'MODERATE', status: 'SUBMITTED', reportedAt: '2026-10-01T11:00:00', reportedBy: 'Meera Nair (Self)', age: 29, gender: 'Female', description: 'Experienced significant drowsiness and dizziness after taking 2 teaspoons of Benadryl cough syrup. Unable to perform daily activities. Symptoms lasted approximately 4 hours.' },
  { id: 'adr-005', reportNumber: 'ADR20260930005', patientName: 'Vikram Reddy', medicine: 'Atorvastatin (Atorva 10mg)', reaction: 'Muscle pain and weakness', severity: 'SEVERE', status: 'ESCALATED', reportedAt: '2026-09-30T09:00:00', reportedBy: 'Dr. Suresh Menon', age: 45, gender: 'Male', description: 'Patient reports severe muscle pain and weakness in both legs after 2 weeks of Atorvastatin 10mg. CPK levels elevated. Medication discontinued pending further evaluation. Possible rhabdomyolysis.' },
  { id: 'adr-006', reportNumber: 'ADR20260930006', patientName: 'Arjun Kumar', medicine: 'Omeprazole (Omez 20mg)', reaction: 'Headache and constipation', severity: 'MILD', status: 'SUBMITTED', reportedAt: '2026-09-29T18:00:00', reportedBy: 'Arjun Kumar (Self)', age: 41, gender: 'Male', description: 'Mild headache and constipation started 3 days after beginning Omeprazole 20mg daily. Symptoms manageable with hydration and dietary changes.' },
  { id: 'adr-007', reportNumber: 'ADR20260930007', patientName: 'Fatima Begum', medicine: 'Amoxicillin (Mox 250mg)', reaction: 'Anaphylaxis - difficulty breathing', severity: 'FATAL', status: 'ESCALATED', reportedAt: '2026-09-28T22:00:00', reportedBy: 'Emergency Services', age: 37, gender: 'Female', description: 'Patient developed anaphylactic reaction within 15 minutes of taking Amoxicillin 250mg. Difficulty breathing, facial swelling, and hypotension. Required emergency hospitalization. Reported to pharmacovigilance authority.' },
];

export const temperatureLogs: TemperatureLog[] = [
  { id: 'tlog-001', orderNumber: 'MS20261001004', deliveryPartnerName: 'Arun Kumar', medicine: 'Insulin Glargine', requiredRange: '2-8°C', currentTemp: 5.2, status: 'NORMAL', lastUpdated: '2026-10-01T10:45:00', logCount: 8 },
  { id: 'tlog-002', orderNumber: 'MS20261001006', deliveryPartnerName: 'Manoj Shetty', medicine: 'Insulin Glargine', requiredRange: '2-8°C', currentTemp: 9.1, status: 'WARNING', lastUpdated: '2026-10-01T11:30:00', logCount: 6 },
  { id: 'tlog-003', orderNumber: 'MS20261001003', deliveryPartnerName: 'Mohan Das', medicine: 'Insulin Glargine', requiredRange: '2-8°C', currentTemp: 3.8, status: 'NORMAL', lastUpdated: '2026-10-01T10:20:00', logCount: 12 },
  { id: 'tlog-004', orderNumber: 'MS20261001001', deliveryPartnerName: 'Rajesh Kumar', medicine: 'Insulin Glargine', requiredRange: '2-8°C', currentTemp: 12.5, status: 'CRITICAL', lastUpdated: '2026-10-01T09:50:00', logCount: 10 },
  { id: 'tlog-005', orderNumber: 'MS20260930010', deliveryPartnerName: 'Rajesh Kumar', medicine: 'Salbutamol Inhaler', requiredRange: '15-25°C', currentTemp: 22.3, status: 'NORMAL', lastUpdated: '2026-09-30T17:30:00', logCount: 8 },
  { id: 'tlog-006', orderNumber: 'MS20261001005', deliveryPartnerName: 'Suresh Nair', medicine: 'Insulin Glargine', requiredRange: '2-8°C', currentTemp: 6.0, status: 'NORMAL', lastUpdated: '2026-10-01T07:35:00', logCount: 9 },
];

export const revenueTransactions: RevenueTransaction[] = [
  { id: 'rt-001', date: '2026-10-01', type: 'ORDER', description: 'Order MS20261001001', pharmacyName: 'Wellness Pharmacy', amount: 755, status: 'SETTLED' },
  { id: 'rt-002', date: '2026-10-01', type: 'COMMISSION', description: 'Platform commission - 15%', pharmacyName: 'Wellness Pharmacy', amount: 113.25, status: 'SETTLED' },
  { id: 'rt-003', date: '2026-10-01', type: 'ORDER', description: 'Order MS20261001003', pharmacyName: 'MedPlus Pharmacy', amount: 590, status: 'SETTLED' },
  { id: 'rt-004', date: '2026-10-01', type: 'COMMISSION', description: 'Platform commission - 15%', pharmacyName: 'MedPlus Pharmacy', amount: 88.5, status: 'SETTLED' },
  { id: 'rt-005', date: '2026-10-01', type: 'ORDER', description: 'Order MS20261001004', pharmacyName: 'CareWell Pharmacy', amount: 1485, status: 'PENDING' },
  { id: 'rt-006', date: '2026-10-01', type: 'COMMISSION', description: 'Platform commission - 15%', pharmacyName: 'CareWell Pharmacy', amount: 222.75, status: 'PENDING' },
  { id: 'rt-007', date: '2026-10-01', type: 'DELIVERY_FEE', description: 'Delivery fees collected', pharmacyName: 'Multiple', amount: 250, status: 'SETTLED' },
  { id: 'rt-008', date: '2026-10-01', type: 'SETTLEMENT', description: 'Weekly settlement - Wellness Pharmacy', pharmacyName: 'Wellness Pharmacy', amount: 12450, status: 'PROCESSING' },
  { id: 'rt-009', date: '2026-09-30', type: 'SETTLEMENT', description: 'Weekly settlement - Apollo Pharmacy', pharmacyName: 'Apollo Pharmacy', amount: 28900, status: 'SETTLED' },
  { id: 'rt-010', date: '2026-09-30', type: 'REFUND', description: 'Refund - Cancelled order MS20261001007', pharmacyName: 'MedPlus Pharmacy', amount: -225, status: 'SETTLED' },
  { id: 'rt-011', date: '2026-09-30', type: 'SETTLEMENT', description: 'Weekly settlement - MedPlus Pharmacy', pharmacyName: 'MedPlus Pharmacy', amount: 18700, status: 'SETTLED' },
  { id: 'rt-012', date: '2026-09-30', type: 'SETTLEMENT', description: 'Weekly settlement - CareWell Pharmacy', pharmacyName: 'CareWell Pharmacy', amount: 15600, status: 'SETTLED' },
];

export const adminNotifications: AdminNotification[] = [
  { id: 'an-001', title: 'New pharmacy registration', message: 'Sunrise Medicals from Mysuru has submitted registration for approval.', timestamp: '2026-10-01T11:45:00', read: false, type: 'pharmacy' },
  { id: 'an-002', title: 'Critical ADR report filed', message: 'ADR20260930007 - Anaphylaxis reported for Amoxicillin. Escalated to pharmacovigilance.', timestamp: '2026-10-01T09:00:00', read: false, type: 'safety' },
  { id: 'an-003', title: 'Temperature breach detected', message: 'Order MS20261001001 - Insulin Glargine temperature exceeded required range (12.5°C vs 2-8°C).', timestamp: '2026-10-01T09:50:00', read: false, type: 'safety' },
  { id: 'an-004', title: 'New delivery partner application', message: 'Vijay Prasad has applied to become a delivery partner. Verification pending.', timestamp: '2026-10-01T08:30:00', read: false, type: 'delivery' },
  { id: 'an-005', title: 'Revenue milestone', message: 'Platform has crossed ₹15,00,000 in total revenue this month.', timestamp: '2026-10-01T07:00:00', read: true, type: 'revenue' },
  { id: 'an-006', title: 'Pharmacy license expired', message: 'LifeLine Pharmacy license KA-PHAR-2024-005 has expired. Action required.', timestamp: '2026-09-30T18:00:00', read: true, type: 'pharmacy' },
  { id: 'an-007', title: 'Weekly settlement processed', message: '₹62,200 settled to 4 pharmacies for the week of Sep 23-29.', timestamp: '2026-09-30T12:00:00', read: true, type: 'revenue' },
  { id: 'an-008', title: 'Safety alert escalated', message: 'Contraindication alert for Priya Iyer (Insulin Glargine) requires immediate pharmacist review.', timestamp: '2026-10-01T11:20:00', read: false, type: 'safety' },
];

export const supportTickets: SupportTicket[] = [
  { id: 'st-001', ticketNumber: 'TKT20261001001', subject: 'Order delivered to wrong address', channel: 'CUSTOMER', user: 'John Doe', priority: 'HIGH', status: 'IN_PROGRESS', createdAt: '2026-10-01T09:00:00', lastReply: '2026-10-01T10:30:00', category: 'Delivery Issue' },
  { id: 'st-002', ticketNumber: 'TKT20261001002', subject: 'Prescription not getting verified', channel: 'CUSTOMER', user: 'Meera Nair', priority: 'MEDIUM', status: 'OPEN', createdAt: '2026-10-01T08:15:00', lastReply: '2026-10-01T08:15:00', category: 'Prescription' },
  { id: 'st-003', ticketNumber: 'TKT20261001003', subject: 'Commission rate dispute', channel: 'PHARMACY', user: 'Apollo Pharmacy', priority: 'URGENT', status: 'IN_PROGRESS', createdAt: '2026-09-30T16:00:00', lastReply: '2026-10-01T09:00:00', category: 'Billing' },
  { id: 'st-004', ticketNumber: 'TKT20261001004', subject: 'Unable to update inventory', channel: 'PHARMACY', user: 'MedPlus Pharmacy', priority: 'MEDIUM', status: 'OPEN', createdAt: '2026-09-30T14:30:00', lastReply: '2026-09-30T14:30:00', category: 'Technical' },
  { id: 'st-005', ticketNumber: 'TKT20261001005', subject: 'Payout not received', channel: 'DELIVERY', user: 'Suresh Nair', priority: 'HIGH', status: 'IN_PROGRESS', createdAt: '2026-09-30T11:00:00', lastReply: '2026-09-30T15:00:00', category: 'Payment' },
  { id: 'st-006', ticketNumber: 'TKT20260930006', subject: 'App keeps crashing on order screen', channel: 'CUSTOMER', user: 'Arjun Kumar', priority: 'HIGH', status: 'RESOLVED', createdAt: '2026-09-29T10:00:00', lastReply: '2026-09-30T12:00:00', category: 'Technical' },
  { id: 'st-007', ticketNumber: 'TKT20260930007', subject: 'Cold chain delivery complaint', channel: 'CUSTOMER', user: 'Priya Iyer', priority: 'URGENT', status: 'RESOLVED', createdAt: '2026-09-28T18:00:00', lastReply: '2026-09-29T14:00:00', category: 'Quality' },
  { id: 'st-008', ticketNumber: 'TKT20260930008', subject: 'Request profile update', channel: 'DELIVERY', user: 'Ganesh Rao', priority: 'LOW', status: 'CLOSED', createdAt: '2026-09-27T09:00:00', lastReply: '2026-09-28T10:00:00', category: 'Account' },
];

// ── Chart Data ─────────────────────────────────────────

export const revenueChart = [
  { month: 'May', revenue: 98000, commission: 14700 },
  { month: 'Jun', revenue: 115000, commission: 17250 },
  { month: 'Jul', revenue: 132000, commission: 19800 },
  { month: 'Aug', revenue: 148000, commission: 22200 },
  { month: 'Sep', revenue: 165000, commission: 24750 },
  { month: 'Oct', revenue: 89500, commission: 13425 },
];

export const orderTrendChart = [
  { day: 'Mon', orders: 142 },
  { day: 'Tue', orders: 168 },
  { day: 'Wed', orders: 155 },
  { day: 'Thu', orders: 189 },
  { day: 'Fri', orders: 210 },
  { day: 'Sat', orders: 245 },
  { day: 'Sun', orders: 178 },
];

export const userGrowthChart = [
  { month: 'May', customers: 1240, pharmacies: 18, delivery: 45 },
  { month: 'Jun', customers: 1560, pharmacies: 22, delivery: 52 },
  { month: 'Jul', customers: 1890, pharmacies: 25, delivery: 58 },
  { month: 'Aug', customers: 2150, pharmacies: 28, delivery: 63 },
  { month: 'Sep', customers: 2480, pharmacies: 32, delivery: 68 },
  { month: 'Oct', customers: 2620, pharmacies: 35, delivery: 72 },
];

export const pharmacyRevenueBreakdown = [
  { pharmacy: 'Apollo Pharmacy', revenue: 568000, color: 'bg-red-500' },
  { pharmacy: 'CareWell Pharmacy', revenue: 312000, color: 'bg-cyan-500' },
  { pharmacy: 'MedPlus Pharmacy', revenue: 389000, color: 'bg-emerald-500' },
  { pharmacy: 'Wellness Pharmacy', revenue: 245000, color: 'bg-blue-500' },
  { pharmacy: 'LifeLine Pharmacy', revenue: 67000, color: 'bg-amber-500' },
];

// ── Helpers ────────────────────────────────────────────

export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function formatRevenue(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toFixed(0)}`;
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
  const now = new Date('2026-10-02T12:00:00');
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

// ── Stats ──────────────────────────────────────────────

export const dashboardStats = {
  totalCustomers: 2620,
  totalPharmacies: 35,
  totalDeliveryPartners: 72,
  activeOrders: 189,
  pendingPrescriptions: 7,
  safetyAlerts: 5,
  adrReports: 7,
  totalRevenue: 847500,
  monthlyRevenue: 89500,
  monthlyCommission: 13425,
};

// ── Order Status Timeline ──────────────────────────────

export const orderTimelineSteps: { status: AdminOrderStatus; label: string; description: string }[] = [
  { status: 'NEW', label: 'Order Placed', description: 'Customer placed the order' },
  { status: 'ACCEPTED', label: 'Accepted', description: 'Pharmacy accepted the order' },
  { status: 'PREPARING', label: 'Preparing', description: 'Medicines being prepared' },
  { status: 'READY', label: 'Ready for Pickup', description: 'Order ready for delivery partner' },
  { status: 'PICKED_UP', label: 'Picked Up', description: 'Delivery partner picked up the order' },
  { status: 'IN_TRANSIT', label: 'In Transit', description: 'Order on the way to customer' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Order delivered successfully' },
];

// ── Getter helpers ─────────────────────────────────────

export function getAdminOrderById(id: string): AdminOrder | undefined {
  return adminOrders.find(o => o.id === id);
}

export function getAdminCustomerById(id: string): AdminCustomer | undefined {
  return adminCustomers.find(c => c.id === id);
}

export function getAdminPharmacyById(id: string): AdminPharmacy | undefined {
  return adminPharmacies.find(p => p.id === id);
}

export function getAdminDeliveryPartnerById(id: string): AdminDeliveryPartner | undefined {
  return adminDeliveryPartners.find(d => d.id === id);
}

export function getAdminPrescriptionById(id: string): AdminPrescription | undefined {
  return adminPrescriptions.find(p => p.id === id);
}

export function getADRReportById(id: string): ADRReport | undefined {
  return adrReports.find(a => a.id === id);
}

export function getSafetyAlertById(id: string): SafetyAlert | undefined {
  return safetyAlerts.find(s => s.id === id);
}

export function getSupportTicketById(id: string): SupportTicket | undefined {
  return supportTickets.find(t => t.id === id);
}
