import type { LucideIcon } from 'lucide-react';
import {
  Tablet, PillBottle, Syringe, Droplet, Pill, FlaskConical, FlaskRound, SprayCan, Bandage,
} from 'lucide-react';

export type PharmacyOrderStatus =
  | 'NEW' | 'ACCEPTED' | 'PRESCRIPTION_REVIEW' | 'SAFETY_REVIEW'
  | 'PREPARING' | 'PACKED' | 'SEALED' | 'READY'
  | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';

export type MedicineForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Inhaler' | 'Cream' | 'Spray';

export type StorageRequirement = 'Room Temperature' | 'Refrigerated (2-8°C)' | 'Frozen (-20°C)' | 'Cool & Dry';

export interface PharmacyOrderItem {
  medicineId: string;
  name: string;
  brand: string;
  strength: string;
  form: MedicineForm;
  price: number;
  quantity: number;
  imageIcon: LucideIcon;
  imageColor: string;
  prescriptionRequired: boolean;
}

export interface PharmacyOrder {
  id: string;
  orderNumber: string;
  status: PharmacyOrderStatus;
  customerName: string;
  customerPhone: string;
  items: PharmacyOrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  placedAt: string;
  deliveryAddress: string;
  paymentMethod: string;
  riderName?: string;
  riderPhone?: string;
  estimatedDelivery: string;
  prescriptionRequired: boolean;
  prescriptionId?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  medicine: string;
  brand: string;
  activeIngredient: string;
  strength: string;
  form: MedicineForm;
  packSize: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  price: number;
  storageRequirement: StorageRequirement;
  lowStockThreshold: number;
  category: string;
  imageIcon: LucideIcon;
  imageColor: string;
}

export type PrescriptionVerificationStatus =
  | 'PENDING' | 'APPROVED' | 'CLARIFICATION_REQUIRED' | 'HOLD' | 'REJECTED';

export interface PharmacyPrescription {
  id: string;
  prescriptionNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  doctorName: string;
  doctorLicense: string;
  uploadedAt: string;
  fileType: 'image' | 'pdf';
  status: PrescriptionVerificationStatus;
  medicines: { name: string; strength: string; dosage: string; quantity: number }[];
  aiExtracted?: {
    patientName: string;
    doctorName: string;
    date: string;
    medicines: { name: string; strength: string; dosage: string; quantity: number }[];
  };
  safetyAlerts?: { type: string; severity: 'low' | 'medium' | 'high'; message: string }[];
}

export interface DeliveryTask {
  id: string;
  orderNumber: string;
  riderName: string;
  riderPhone: string;
  status: 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  address: string;
  distance: number;
  estimatedTime: string;
  items: number;
  total: number;
}

export interface PharmacyReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
  response?: string;
}

export interface PharmacyNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'prescription' | 'inventory' | 'delivery' | 'system' | 'review';
}

export const pharmacyOrders: PharmacyOrder[] = [
  {
    id: 'po-001',
    orderNumber: 'MS20260822001',
    status: 'PRESCRIPTION_REVIEW',
    customerName: 'John Doe',
    customerPhone: '+91 98765 43210',
    items: [
      { medicineId: 'med-002', name: 'Azithromycin', brand: 'Azee', strength: '500mg', form: 'Tablet', price: 120, quantity: 6, imageIcon: Pill, imageColor: 'text-emerald-500', prescriptionRequired: true },
    ],
    subtotal: 720,
    deliveryFee: 25,
    serviceFee: 10,
    total: 755,
    placedAt: '2026-08-22T09:30:00',
    deliveryAddress: 'Flat 302, Green Meadows, MG Road, Bengaluru 560001',
    paymentMethod: 'UPI',
    estimatedDelivery: '10:15 AM',
    prescriptionRequired: true,
    prescriptionId: 'rx-002',
    notes: 'Customer requested fast delivery',
  },
  {
    id: 'po-002',
    orderNumber: 'MS20260822002',
    status: 'NEW',
    customerName: 'Sarah Wilson',
    customerPhone: '+91 98400 11223',
    items: [
      { medicineId: 'med-001', name: 'Paracetamol', brand: 'Crocin', strength: '500mg', form: 'Tablet', price: 35, quantity: 2, imageIcon: Tablet, imageColor: 'text-blue-500', prescriptionRequired: false },
      { medicineId: 'med-014', name: 'ORS', brand: 'Electral', strength: '21.8g', form: 'Syrup', price: 25, quantity: 3, imageIcon: FlaskConical, imageColor: 'text-blue-400', prescriptionRequired: false },
    ],
    subtotal: 145,
    deliveryFee: 25,
    serviceFee: 10,
    total: 180,
    placedAt: '2026-08-22T10:05:00',
    deliveryAddress: '45 Brigade Road, Bengaluru 560025',
    paymentMethod: 'Credit Card',
    estimatedDelivery: '10:35 AM',
    prescriptionRequired: false,
  },
  {
    id: 'po-003',
    orderNumber: 'MS20260822003',
    status: 'PREPARING',
    customerName: 'Raj Patel',
    customerPhone: '+91 90080 55667',
    items: [
      { medicineId: 'med-003', name: 'Metformin', brand: 'Glycomet', strength: '850mg', form: 'Tablet', price: 85, quantity: 3, imageIcon: Tablet, imageColor: 'text-teal-500', prescriptionRequired: true },
      { medicineId: 'med-016', name: 'Atorvastatin', brand: 'Atorva', strength: '10mg', form: 'Tablet', price: 150, quantity: 2, imageIcon: Pill, imageColor: 'text-red-400', prescriptionRequired: true },
    ],
    subtotal: 555,
    deliveryFee: 25,
    serviceFee: 10,
    total: 590,
    placedAt: '2026-08-22T09:15:00',
    deliveryAddress: '78 Indiranagar, Bengaluru 560038',
    paymentMethod: 'UPI',
    riderName: 'Rajesh Kumar',
    riderPhone: '+91 98765 43210',
    estimatedDelivery: '10:00 AM',
    prescriptionRequired: true,
    prescriptionId: 'rx-001',
  },
  {
    id: 'po-004',
    orderNumber: 'MS20260822004',
    status: 'READY',
    customerName: 'Anita Sharma',
    customerPhone: '+91 91234 56780',
    items: [
      { medicineId: 'med-004', name: 'Cetirizine', brand: 'Zyrtec', strength: '10mg', form: 'Tablet', price: 45, quantity: 2, imageIcon: Tablet, imageColor: 'text-purple-500', prescriptionRequired: false },
      { medicineId: 'med-010', name: 'Ibuprofen', brand: 'Brufen', strength: '400mg', form: 'Tablet', price: 55, quantity: 1, imageIcon: Tablet, imageColor: 'text-indigo-500', prescriptionRequired: false },
    ],
    subtotal: 145,
    deliveryFee: 25,
    serviceFee: 10,
    total: 180,
    placedAt: '2026-08-22T08:45:00',
    deliveryAddress: '23 Koramangala 5th Block, Bengaluru 560095',
    paymentMethod: 'Cash on Delivery',
    riderName: 'Mohan Das',
    riderPhone: '+91 99887 76655',
    estimatedDelivery: '09:30 AM',
    prescriptionRequired: false,
  },
  {
    id: 'po-005',
    orderNumber: 'MS20260822005',
    status: 'DELIVERED',
    customerName: 'Vikram Reddy',
    customerPhone: '+91 90011 22334',
    items: [
      { medicineId: 'med-011', name: 'Vitamin D3', brand: 'Calcirol', strength: '60000 IU', form: 'Capsule', price: 65, quantity: 1, imageIcon: PillBottle, imageColor: 'text-yellow-500', prescriptionRequired: false },
      { medicineId: 'med-018', name: 'Multivitamin', brand: 'Revital H', strength: 'Capsule', form: 'Capsule', price: 250, quantity: 1, imageIcon: PillBottle, imageColor: 'text-lime-500', prescriptionRequired: false },
    ],
    subtotal: 315,
    deliveryFee: 25,
    serviceFee: 10,
    total: 350,
    placedAt: '2026-08-22T07:00:00',
    deliveryAddress: '90 HSR Layout, Bengaluru 560102',
    paymentMethod: 'UPI',
    riderName: 'Suresh Nair',
    riderPhone: '+91 98700 12345',
    estimatedDelivery: 'Delivered at 7:35 AM',
    prescriptionRequired: false,
  },
  {
    id: 'po-006',
    orderNumber: 'MS20260821006',
    status: 'DELIVERED',
    customerName: 'Priya Iyer',
    customerPhone: '+91 94455 66778',
    items: [
      { medicineId: 'med-008', name: 'Insulin Glargine', brand: 'Lantus', strength: '100 IU/ml', form: 'Injection', price: 1450, quantity: 1, imageIcon: Syringe, imageColor: 'text-red-500', prescriptionRequired: true },
    ],
    subtotal: 1450,
    deliveryFee: 25,
    serviceFee: 10,
    total: 1485,
    placedAt: '2026-08-21T16:00:00',
    deliveryAddress: '12 MG Road, Bengaluru 560001',
    paymentMethod: 'Credit Card',
    riderName: 'Arun Kumar',
    riderPhone: '+91 98000 54321',
    estimatedDelivery: 'Delivered at 4:30 PM',
    prescriptionRequired: true,
    prescriptionId: 'rx-003',
  },
  {
    id: 'po-007',
    orderNumber: 'MS20260821007',
    status: 'CANCELLED',
    customerName: 'Deepak Singh',
    customerPhone: '+91 90090 80706',
    items: [
      { medicineId: 'med-005', name: 'Amoxicillin', brand: 'Mox', strength: '250mg', form: 'Capsule', price: 95, quantity: 2, imageIcon: PillBottle, imageColor: 'text-amber-500', prescriptionRequired: true },
    ],
    subtotal: 190,
    deliveryFee: 25,
    serviceFee: 10,
    total: 225,
    placedAt: '2026-08-21T12:30:00',
    deliveryAddress: '56 Jayanagar, Bengaluru 560011',
    paymentMethod: 'UPI',
    estimatedDelivery: 'Cancelled',
    prescriptionRequired: true,
    notes: 'Customer cancelled - went to physical store instead',
  },
];

export const inventory: InventoryItem[] = [
  { id: 'inv-001', medicine: 'Paracetamol', brand: 'Crocin', activeIngredient: 'Acetaminophen', strength: '500mg', form: 'Tablet', packSize: '15 tablets', batchNumber: 'CRO2026A', expiryDate: '2027-06-30', quantity: 340, price: 35, storageRequirement: 'Room Temperature', lowStockThreshold: 50, category: 'Pain Relief', imageIcon: Tablet, imageColor: 'text-blue-500' },
  { id: 'inv-002', medicine: 'Azithromycin', brand: 'Azee', activeIngredient: 'Azithromycin', strength: '500mg', form: 'Tablet', packSize: '3 tablets', batchNumber: 'AZE2026B', expiryDate: '2027-03-15', quantity: 28, price: 120, storageRequirement: 'Room Temperature', lowStockThreshold: 30, category: 'Antibiotic', imageIcon: Pill, imageColor: 'text-emerald-500' },
  { id: 'inv-003', medicine: 'Metformin', brand: 'Glycomet', activeIngredient: 'Metformin HCl', strength: '850mg', form: 'Tablet', packSize: '20 tablets', batchNumber: 'GLY2025C', expiryDate: '2026-09-20', quantity: 120, price: 85, storageRequirement: 'Room Temperature', lowStockThreshold: 40, category: 'Diabetes', imageIcon: Tablet, imageColor: 'text-teal-500' },
  { id: 'inv-004', medicine: 'Cetirizine', brand: 'Zyrtec', activeIngredient: 'Cetirizine HCl', strength: '10mg', form: 'Tablet', packSize: '10 tablets', batchNumber: 'ZYR2026D', expiryDate: '2027-01-10', quantity: 200, price: 45, storageRequirement: 'Room Temperature', lowStockThreshold: 50, category: 'Allergy', imageIcon: Tablet, imageColor: 'text-purple-500' },
  { id: 'inv-005', medicine: 'Amoxicillin', brand: 'Mox', activeIngredient: 'Amoxicillin Trihydrate', strength: '250mg', form: 'Capsule', packSize: '10 capsules', batchNumber: 'MOX2026E', expiryDate: '2026-11-05', quantity: 15, price: 95, storageRequirement: 'Room Temperature', lowStockThreshold: 25, category: 'Antibiotic', imageIcon: PillBottle, imageColor: 'text-amber-500' },
  { id: 'inv-006', medicine: 'Omeprazole', brand: 'Omez', activeIngredient: 'Omeprazole', strength: '20mg', form: 'Capsule', packSize: '14 capsules', batchNumber: 'OME2026F', expiryDate: '2027-04-20', quantity: 85, price: 75, storageRequirement: 'Room Temperature', lowStockThreshold: 30, category: 'Gastrointestinal', imageIcon: PillBottle, imageColor: 'text-pink-500' },
  { id: 'inv-007', medicine: 'Cough Syrup', brand: 'Benadryl', activeIngredient: 'Diphenhydramine', strength: '100ml', form: 'Syrup', packSize: '1 bottle', batchNumber: 'BEN2026G', expiryDate: '2027-02-28', quantity: 60, price: 110, storageRequirement: 'Room Temperature', lowStockThreshold: 20, category: 'Cough & Cold', imageIcon: FlaskConical, imageColor: 'text-orange-500' },
  { id: 'inv-008', medicine: 'Insulin Glargine', brand: 'Lantus', activeIngredient: 'Insulin Glargine', strength: '100 IU/ml', form: 'Injection', packSize: '1 vial', batchNumber: 'LAN2026H', expiryDate: '2026-10-15', quantity: 8, price: 1450, storageRequirement: 'Refrigerated (2-8°C)', lowStockThreshold: 10, category: 'Diabetes', imageIcon: Syringe, imageColor: 'text-red-500' },
  { id: 'inv-009', medicine: 'Salbutamol Inhaler', brand: 'Asthalin', activeIngredient: 'Salbutamol Sulphate', strength: '100mcg', form: 'Inhaler', packSize: '200 doses', batchNumber: 'AST2026I', expiryDate: '2027-05-30', quantity: 42, price: 180, storageRequirement: 'Room Temperature', lowStockThreshold: 15, category: 'Respiratory', imageIcon: FlaskRound, imageColor: 'text-cyan-500' },
  { id: 'inv-010', medicine: 'Ibuprofen', brand: 'Brufen', activeIngredient: 'Ibuprofen', strength: '400mg', form: 'Tablet', packSize: '15 tablets', batchNumber: 'BRU2025J', expiryDate: '2026-08-30', quantity: 95, price: 55, storageRequirement: 'Room Temperature', lowStockThreshold: 40, category: 'Pain Relief', imageIcon: Tablet, imageColor: 'text-indigo-500' },
  { id: 'inv-011', medicine: 'Vitamin D3', brand: 'Calcirol', activeIngredient: 'Cholecalciferol', strength: '60000 IU', form: 'Capsule', packSize: '4 capsules', batchNumber: 'CAL2026K', expiryDate: '2028-01-15', quantity: 150, price: 65, storageRequirement: 'Room Temperature', lowStockThreshold: 30, category: 'Supplements', imageIcon: PillBottle, imageColor: 'text-yellow-500' },
  { id: 'inv-012', medicine: 'Atorvastatin', brand: 'Atorva', activeIngredient: 'Atorvastatin Calcium', strength: '10mg', form: 'Tablet', packSize: '15 tablets', batchNumber: 'ATO2026L', expiryDate: '2027-07-25', quantity: 22, price: 150, storageRequirement: 'Room Temperature', lowStockThreshold: 25, category: 'Cardiac', imageIcon: Pill, imageColor: 'text-red-400' },
  { id: 'inv-013', medicine: 'Eye Drops', brand: 'Refresh Tears', activeIngredient: 'Carboxymethylcellulose', strength: '0.5%', form: 'Drops', packSize: '10ml', batchNumber: 'REF2026M', expiryDate: '2026-09-10', quantity: 18, price: 95, storageRequirement: 'Room Temperature', lowStockThreshold: 15, category: 'Eye Care', imageIcon: Droplet, imageColor: 'text-sky-500' },
  { id: 'inv-014', medicine: 'Diclofenac Gel', brand: 'Volini', activeIngredient: 'Diclofenac Diethylamine', strength: '1%', form: 'Cream', packSize: '30g tube', batchNumber: 'VOL2026N', expiryDate: '2027-03-20', quantity: 65, price: 130, storageRequirement: 'Room Temperature', lowStockThreshold: 20, category: 'Pain Relief', imageIcon: SprayCan, imageColor: 'text-green-500' },
  { id: 'inv-015', medicine: 'ORS', brand: 'Electral', activeIngredient: 'Oral Rehydration Salts', strength: '21.8g', form: 'Syrup', packSize: '5 sachets', batchNumber: 'ELE2026O', expiryDate: '2027-12-31', quantity: 280, price: 25, storageRequirement: 'Cool & Dry', lowStockThreshold: 50, category: 'First Aid', imageIcon: FlaskConical, imageColor: 'text-blue-400' },
  { id: 'inv-016', medicine: 'Povidone Iodine', brand: 'Betadine', activeIngredient: 'Povidone Iodine', strength: '5%', form: 'Drops', packSize: '100ml', batchNumber: 'BET2025P', expiryDate: '2026-09-05', quantity: 0, price: 85, storageRequirement: 'Room Temperature', lowStockThreshold: 15, category: 'First Aid', imageIcon: Droplet, imageColor: 'text-rose-500' },
];

export const pharmacyPrescriptions: PharmacyPrescription[] = [
  {
    id: 'rx-001',
    prescriptionNumber: 'RX20260822001',
    orderId: 'po-003',
    orderNumber: 'MS20260822003',
    customerName: 'Raj Patel',
    doctorName: 'Dr. Anil Sharma, MBBS, MD',
    doctorLicense: 'KMC-45678',
    uploadedAt: '2026-08-22T09:15:00',
    fileType: 'image',
    status: 'APPROVED',
    medicines: [
      { name: 'Metformin', strength: '850mg', dosage: '1 tablet twice daily', quantity: 60 },
      { name: 'Atorvastatin', strength: '10mg', dosage: '1 tablet at night', quantity: 30 },
    ],
    aiExtracted: {
      patientName: 'Raj Patel',
      doctorName: 'Dr. Anil Sharma, MBBS, MD',
      date: '2026-08-20',
      medicines: [
        { name: 'Metformin', strength: '850mg', dosage: '1 tablet twice daily', quantity: 60 },
        { name: 'Atorvastatin', strength: '10mg', dosage: '1 tablet at night', quantity: 30 },
      ],
    },
    safetyAlerts: [
      { type: 'Drug Interaction', severity: 'medium', message: 'Metformin + Atorvastatin: Monitor for hypoglycemia when used together.' },
      { type: 'Dosage Check', severity: 'low', message: 'Metformin 850mg twice daily is within recommended range.' },
    ],
  },
  {
    id: 'rx-002',
    prescriptionNumber: 'RX20260822002',
    orderId: 'po-001',
    orderNumber: 'MS20260822001',
    customerName: 'John Doe',
    doctorName: 'Dr. Priya Reddy, MBBS',
    doctorLicense: 'KMC-78901',
    uploadedAt: '2026-08-22T09:30:00',
    fileType: 'pdf',
    status: 'PENDING',
    medicines: [
      { name: 'Azithromycin', strength: '500mg', dosage: '1 tablet daily for 5 days', quantity: 5 },
    ],
    aiExtracted: {
      patientName: 'John Doe',
      doctorName: 'Dr. Priya Reddy, MBBS',
      date: '2026-08-21',
      medicines: [
        { name: 'Azithromycin', strength: '500mg', dosage: '1 tablet daily for 5 days', quantity: 5 },
      ],
    },
    safetyAlerts: [
      { type: 'Allergy Warning', severity: 'high', message: 'Patient history indicates penicillin allergy. Azithromycin is a macrolide — safe alternative.' },
      { type: 'Dosage Check', severity: 'low', message: 'Azithromycin 500mg daily for 5 days is standard course.' },
    ],
  },
  {
    id: 'rx-003',
    prescriptionNumber: 'RX20260821003',
    orderId: 'po-006',
    orderNumber: 'MS20260821006',
    customerName: 'Priya Iyer',
    doctorName: 'Dr. Vikram Singh, MBBS, MS',
    doctorLicense: 'KMC-12345',
    uploadedAt: '2026-08-21T16:00:00',
    fileType: 'image',
    status: 'APPROVED',
    medicines: [
      { name: 'Insulin Glargine', strength: '100 IU/ml', dosage: 'As directed', quantity: 1 },
    ],
    aiExtracted: {
      patientName: 'Priya Iyer',
      doctorName: 'Dr. Vikram Singh, MBBS, MS',
      date: '2026-08-18',
      medicines: [
        { name: 'Insulin Glargine', strength: '100 IU/ml', dosage: 'As directed', quantity: 1 },
      ],
    },
    safetyAlerts: [
      { type: 'Cold Chain', severity: 'high', message: 'Insulin requires refrigerated storage (2-8°C). Ensure cold chain delivery.' },
    ],
  },
  {
    id: 'rx-004',
    prescriptionNumber: 'RX20260820004',
    orderId: 'po-007',
    orderNumber: 'MS20260821007',
    customerName: 'Deepak Singh',
    doctorName: 'Dr. Unknown',
    doctorLicense: 'Not visible',
    uploadedAt: '2026-08-20T12:30:00',
    fileType: 'image',
    status: 'REJECTED',
    medicines: [],
    aiExtracted: undefined,
    safetyAlerts: [
      { type: 'Image Quality', severity: 'high', message: 'Prescription image is blurry. Doctor name and license number not legible.' },
    ],
  },
];

export const deliveryTasks: DeliveryTask[] = [
  { id: 'dt-001', orderNumber: 'MS20260822003', riderName: 'Rajesh Kumar', riderPhone: '+91 98765 43210', status: 'PICKED_UP', address: '78 Indiranagar, Bengaluru 560038', distance: 2.3, estimatedTime: '15 min', items: 2, total: 590 },
  { id: 'dt-002', orderNumber: 'MS20260822004', riderName: 'Mohan Das', riderPhone: '+91 99887 76655', status: 'ASSIGNED', address: '23 Koramangala 5th Block, Bengaluru 560095', distance: 1.8, estimatedTime: '10 min', items: 2, total: 180 },
  { id: 'dt-003', orderNumber: 'MS20260822005', riderName: 'Suresh Nair', riderPhone: '+91 98700 12345', status: 'DELIVERED', address: '90 HSR Layout, Bengaluru 560102', distance: 3.5, estimatedTime: 'Delivered', items: 2, total: 350 },
];

export const pharmacyReviews: PharmacyReview[] = [
  { id: 'rev-001', customerName: 'John Doe', rating: 5, comment: 'Super fast delivery and the pharmacist was very helpful with my prescription.', date: '2026-08-22', orderId: 'MS20260822001', response: 'Thank you for your kind words!' },
  { id: 'rev-002', customerName: 'Sarah Wilson', rating: 4, comment: 'Good service but delivery took a bit longer than expected.', date: '2026-08-21', orderId: 'MS20260821002' },
  { id: 'rev-003', customerName: 'Raj Patel', rating: 5, comment: 'Best pharmacy in the area. Always have my diabetes medicines in stock.', date: '2026-08-20', orderId: 'MS20260820003', response: 'We appreciate your trust in us!' },
  { id: 'rev-004', customerName: 'Anita Sharma', rating: 3, comment: 'Medicines were correct but the packaging could be better.', date: '2026-08-19', orderId: 'MS20260819004' },
  { id: 'rev-005', customerName: 'Vikram Reddy', rating: 5, comment: 'Excellent service. The cold chain delivery for insulin was perfect.', date: '2026-08-18', orderId: 'MS20260818005', response: 'Thank you! Cold chain is our priority.' },
];

export const pharmacyNotifications: PharmacyNotification[] = [
  { id: 'pn-001', title: 'New order received', message: 'Order MS20260822002 from Sarah Wilson needs to be accepted.', timestamp: '2026-08-22T10:05:00', read: false, type: 'order' },
  { id: 'pn-002', title: 'Prescription pending review', message: 'Prescription RX20260822002 for Azithromycin needs verification.', timestamp: '2026-08-22T09:30:00', read: false, type: 'prescription' },
  { id: 'pn-003', title: 'Low stock alert', message: 'Insulin Glargine is below threshold (8 units left).', timestamp: '2026-08-22T08:00:00', read: false, type: 'inventory' },
  { id: 'pn-004', title: 'Expiry warning', message: 'Ibuprofen batch BRU2025J expires in 8 days.', timestamp: '2026-08-22T07:00:00', read: true, type: 'inventory' },
  { id: 'pn-005', title: 'Order delivered', message: 'Order MS20260822005 has been delivered successfully.', timestamp: '2026-08-22T07:35:00', read: true, type: 'delivery' },
  { id: 'pn-006', title: 'New 5-star review', message: 'John Doe left a 5-star review for order MS20260822001.', timestamp: '2026-08-22T09:00:00', read: true, type: 'review' },
];

export const orderStatusSteps: { status: PharmacyOrderStatus; label: string; description: string }[] = [
  { status: 'NEW', label: 'New Order', description: 'Order received from customer' },
  { status: 'ACCEPTED', label: 'Accepted', description: 'Pharmacy accepted the order' },
  { status: 'PRESCRIPTION_REVIEW', label: 'Prescription Review', description: 'Verifying prescription validity' },
  { status: 'SAFETY_REVIEW', label: 'Safety Review', description: 'Checking drug interactions and safety' },
  { status: 'PREPARING', label: 'Preparing', description: 'Medicines being prepared' },
  { status: 'PACKED', label: 'Packed', description: 'Order has been packed' },
  { status: 'SEALED', label: 'Sealed', description: 'Order sealed and labeled' },
  { status: 'READY', label: 'Ready for Pickup', description: 'Order ready for delivery partner' },
  { status: 'PICKED_UP', label: 'Picked Up', description: 'Delivery partner picked up order' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Order delivered to customer' },
];

export function getPharmacyOrderById(id: string): PharmacyOrder | undefined {
  return pharmacyOrders.find(o => o.id === id);
}

export function getPrescriptionById(id: string): PharmacyPrescription | undefined {
  return pharmacyPrescriptions.find(p => p.id === id);
}

export function getInventoryById(id: string): InventoryItem | undefined {
  return inventory.find(i => i.id === id);
}

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
  const now = new Date('2026-08-22T10:30:00');
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

export function daysUntilExpiry(dateStr: string): number {
  const expiry = new Date(dateStr);
  const now = new Date('2026-08-22');
  const diffMs = expiry.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
