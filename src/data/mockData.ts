import type { LucideIcon } from 'lucide-react';
import {
  Pill, PillBottle, Syringe, Droplet, Tablet, Package, Stethoscope,
  HeartPulse, Bandage, FlaskRound, FlaskConical, SprayCan,
} from 'lucide-react';

export type MedicineForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Inhaler' | 'Cream' | 'Spray';

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  genericName: string;
  strength: string;
  form: MedicineForm;
  price: number;
  prescriptionRequired: boolean;
  category: string;
  description: string;
  manufacturer: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  imageIcon: LucideIcon;
  imageColor: string;
  sideEffects: string[];
  warnings: string[];
  dosage: string;
  storage: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  distance: number;
  eta: string;
  trustScore: number;
  open: boolean;
  address: string;
  phone: string;
  openHours: string;
  imageColor: string;
  specialties: string[];
  yearsActive: number;
}

export interface PharmacyMedicine {
  pharmacyId: string;
  medicineId: string;
  price: number;
  inStock: boolean;
  distance: number;
  eta: string;
}

export interface CartItem {
  medicineId: string;
  name: string;
  brand: string;
  strength: string;
  form: MedicineForm;
  price: number;
  quantity: number;
  prescriptionRequired: boolean;
  imageIcon: LucideIcon;
  imageColor: string;
}

export type OrderStatus =
  | 'NEW' | 'ACCEPTED' | 'VERIFICATION' | 'PREPARING' | 'PACKED'
  | 'READY' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  medicineId: string;
  name: string;
  brand: string;
  strength: string;
  form: MedicineForm;
  price: number;
  quantity: number;
  imageIcon: LucideIcon;
  imageColor: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  pharmacyId: string;
  pharmacyName: string;
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
}

export type PrescriptionStatus = 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  status: PrescriptionStatus;
  uploadedAt: string;
  doctorName: string;
  patientName: string;
  fileUrl: string;
  fileType: 'image' | 'pdf';
  medicines: { name: string; strength: string; quantity: number }[];
  notes?: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'HOME' | 'WORK' | 'OTHER';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'prescription' | 'delivery' | 'system' | 'safety';
}

export const medicines: Medicine[] = [
  {
    id: 'med-001',
    name: 'Paracetamol',
    brand: 'Crocin',
    genericName: 'Acetaminophen',
    strength: '500mg',
    form: 'Tablet',
    price: 35,
    prescriptionRequired: false,
    category: 'Pain Relief',
    description: 'Used to treat mild to moderate pain and reduce fever. Safe for most adults when taken as directed.',
    manufacturer: 'GSK Pharmaceuticals',
    inStock: true,
    rating: 4.5,
    reviews: 1280,
    imageIcon: Tablet,
    imageColor: 'text-blue-500',
    sideEffects: ['Nausea', 'Skin rash (rare)', 'Liver damage in overdose'],
    warnings: ['Do not exceed 4g per day', 'Avoid alcohol while taking', 'Consult doctor if pregnant'],
    dosage: '1-2 tablets every 4-6 hours as needed. Maximum 8 tablets in 24 hours.',
    storage: 'Store below 25°C in a dry place. Protect from moisture.',
  },
  {
    id: 'med-002',
    name: 'Azithromycin',
    brand: 'Azee',
    genericName: 'Azithromycin',
    strength: '500mg',
    form: 'Tablet',
    price: 120,
    prescriptionRequired: true,
    category: 'Antibiotic',
    description: 'Macrolide antibiotic used to treat respiratory infections, skin infections, and sexually transmitted diseases.',
    manufacturer: 'Cipla Ltd',
    inStock: true,
    rating: 4.3,
    reviews: 540,
    imageIcon: Pill,
    imageColor: 'text-emerald-500',
    sideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain', 'Headache'],
    warnings: ['Complete the full course', 'Take on empty stomach for best absorption', 'Inform doctor of liver issues'],
    dosage: '1 tablet daily for 3-5 days as prescribed by your doctor.',
    storage: 'Store at room temperature. Keep away from direct sunlight.',
  },
  {
    id: 'med-003',
    name: 'Metformin',
    brand: 'Glycomet',
    genericName: 'Metformin HCl',
    strength: '850mg',
    form: 'Tablet',
    price: 85,
    prescriptionRequired: true,
    category: 'Diabetes',
    description: 'First-line medication for type 2 diabetes. Helps control blood sugar levels by improving insulin sensitivity.',
    manufacturer: 'USV Pvt Ltd',
    inStock: true,
    rating: 4.6,
    reviews: 890,
    imageIcon: Tablet,
    imageColor: 'text-teal-500',
    sideEffects: ['GI upset', 'Metallic taste', 'Vitamin B12 deficiency (long-term)', 'Lactic acidosis (rare)'],
    warnings: ['Monitor kidney function', 'Stop before contrast imaging', 'Avoid alcohol'],
    dosage: '1 tablet twice daily with meals. Adjust based on blood glucose response.',
    storage: 'Store below 25°C. Protect from light and moisture.',
  },
  {
    id: 'med-004',
    name: 'Cetirizine',
    brand: 'Zyrtec',
    genericName: 'Cetirizine Hydrochloride',
    strength: '10mg',
    form: 'Tablet',
    price: 45,
    prescriptionRequired: false,
    category: 'Allergy',
    description: 'Antihistamine used to relieve allergy symptoms such as sneezing, runny nose, and itchy eyes.',
    manufacturer: 'Dr. Reddy\'s Labs',
    inStock: true,
    rating: 4.4,
    reviews: 2100,
    imageIcon: Tablet,
    imageColor: 'text-purple-500',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue', 'Headache'],
    warnings: ['May cause drowsiness', 'Avoid driving if affected', 'Not for children under 6'],
    dosage: '1 tablet once daily, preferably at bedtime.',
    storage: 'Store at room temperature. Keep dry.',
  },
  {
    id: 'med-005',
    name: 'Amoxicillin',
    brand: 'Mox',
    genericName: 'Amoxicillin Trihydrate',
    strength: '250mg',
    form: 'Capsule',
    price: 95,
    prescriptionRequired: true,
    category: 'Antibiotic',
    description: 'Penicillin-class antibiotic used to treat bacterial infections including ear, nose, throat, and urinary tract infections.',
    manufacturer: 'Sun Pharma',
    inStock: true,
    rating: 4.5,
    reviews: 750,
    imageIcon: PillBottle,
    imageColor: 'text-amber-500',
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Yeast infection'],
    warnings: ['Inform doctor of penicillin allergy', 'Complete full course', 'Take with or without food'],
    dosage: '1 capsule every 8 hours for 7-10 days as prescribed.',
    storage: 'Store below 25°C. Keep capsules dry.',
  },
  {
    id: 'med-006',
    name: 'Omeprazole',
    brand: 'Omez',
    genericName: 'Omeprazole',
    strength: '20mg',
    form: 'Capsule',
    price: 75,
    prescriptionRequired: false,
    category: 'Gastrointestinal',
    description: 'Proton pump inhibitor that reduces stomach acid. Used for acid reflux, ulcers, and heartburn.',
    manufacturer: 'Dr. Reddy\'s Labs',
    inStock: true,
    rating: 4.5,
    reviews: 1650,
    imageIcon: PillBottle,
    imageColor: 'text-pink-500',
    sideEffects: ['Headache', 'Diarrhea', 'Constipation', 'Stomach pain'],
    warnings: ['Take before meals', 'Long-term use may affect magnesium', 'Consult doctor if pregnant'],
    dosage: '1 capsule daily, 30 minutes before breakfast.',
    storage: 'Store at room temperature. Protect from moisture.',
  },
  {
    id: 'med-007',
    name: 'Cough Syrup',
    brand: 'Benadryl',
    genericName: 'Diphenhydramine + Ammonium Chloride',
    strength: '100ml',
    form: 'Syrup',
    price: 110,
    prescriptionRequired: false,
    category: 'Cough & Cold',
    description: 'Cough suppressant and antihistamine combination. Relieves dry cough and allergic conditions.',
    manufacturer: 'Johnson & Johnson',
    inStock: true,
    rating: 4.2,
    reviews: 3200,
    imageIcon: FlaskConical,
    imageColor: 'text-orange-500',
    sideEffects: ['Drowsiness', 'Dizziness', 'Dry mouth', 'Blurred vision'],
    warnings: ['May cause drowsiness', 'Do not exceed recommended dose', 'Not for children under 12 without advice'],
    dosage: '2 teaspoons (10ml) 3-4 times daily.',
    storage: 'Store below 25°C. Do not freeze. Use within 30 days of opening.',
  },
  {
    id: 'med-008',
    name: 'Insulin Glargine',
    brand: 'Lantus',
    genericName: 'Insulin Glargine',
    strength: '100 IU/ml',
    form: 'Injection',
    price: 1450,
    prescriptionRequired: true,
    category: 'Diabetes',
    description: 'Long-acting basal insulin for diabetes management. Provides steady glucose control over 24 hours.',
    manufacturer: 'Sanofi India',
    inStock: true,
    rating: 4.7,
    reviews: 420,
    imageIcon: Syringe,
    imageColor: 'text-red-500',
    sideEffects: ['Hypoglycemia', 'Injection site reactions', 'Weight gain', 'Edema'],
    warnings: ['Requires cold chain storage', 'Never inject cold insulin', 'Monitor blood glucose regularly'],
    dosage: 'As prescribed by your endocrinologist. Typically once daily at the same time.',
    storage: 'Refrigerate at 2-8°C. Do not freeze. Once opened, use within 28 days at room temperature.',
  },
  {
    id: 'med-009',
    name: 'Salbutamol Inhaler',
    brand: 'Asthalin',
    genericName: 'Salbutamol Sulphate',
    strength: '100mcg',
    form: 'Inhaler',
    price: 180,
    prescriptionRequired: true,
    category: 'Respiratory',
    description: 'Quick-relief bronchodilator for asthma and COPD. Opens airways during an asthma attack.',
    manufacturer: 'Cipla Ltd',
    inStock: true,
    rating: 4.6,
    reviews: 980,
    imageIcon: FlaskRound,
    imageColor: 'text-cyan-500',
    sideEffects: ['Tremor', 'Palpitations', 'Headache', 'Throat irritation'],
    warnings: ['Carry at all times if asthmatic', 'Do not exceed 8 puffs in 24 hours', 'Seek emergency care if not effective'],
    dosage: '2 puffs as needed during breathing difficulty. Wait 1 minute between puffs.',
    storage: 'Store below 30°C. Do not puncture or expose to high heat.',
  },
  {
    id: 'med-010',
    name: 'Ibuprofen',
    brand: 'Brufen',
    genericName: 'Ibuprofen',
    strength: '400mg',
    form: 'Tablet',
    price: 55,
    prescriptionRequired: false,
    category: 'Pain Relief',
    description: 'NSAID used to reduce pain, inflammation, and fever. Effective for headaches, muscle pain, and menstrual cramps.',
    manufacturer: 'Abbott India',
    inStock: true,
    rating: 4.5,
    reviews: 1850,
    imageIcon: Tablet,
    imageColor: 'text-indigo-500',
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness', 'GI bleeding (rare)'],
    warnings: ['Take with food', 'Avoid if you have stomach ulcers', 'Do not use in last 3 months of pregnancy'],
    dosage: '1 tablet every 6-8 hours with food. Maximum 3 tablets in 24 hours.',
    storage: 'Store below 25°C. Keep in original packaging.',
  },
  {
    id: 'med-011',
    name: 'Vitamin D3',
    brand: 'Calcirol',
    genericName: 'Cholecalciferol',
    strength: '60000 IU',
    form: 'Capsule',
    price: 65,
    prescriptionRequired: false,
    category: 'Supplements',
    description: 'Vitamin D3 supplement for bone health, immune function, and calcium absorption.',
    manufacturer: 'Sun Pharma',
    inStock: true,
    rating: 4.7,
    reviews: 2400,
    imageIcon: PillBottle,
    imageColor: 'text-yellow-500',
    sideEffects: ['Constipation', 'Nausea (rare)', 'Hypercalcemia in overdose'],
    warnings: ['Take with milk or fat for absorption', 'Do not exceed recommended dose', 'Get sunlight exposure too'],
    dosage: '1 capsule weekly for 8 weeks, then monthly as maintenance.',
    storage: 'Store at room temperature. Protect from light.',
  },
  {
    id: 'med-012',
    name: 'Eye Drops',
    brand: 'Refresh Tears',
    genericName: 'Carboxymethylcellulose Sodium',
    strength: '0.5%',
    form: 'Drops',
    price: 95,
    prescriptionRequired: false,
    category: 'Eye Care',
    description: 'Lubricating eye drops for dry eyes. Provides relief from burning, irritation, and discomfort.',
    manufacturer: 'Allergan India',
    inStock: true,
    rating: 4.6,
    reviews: 1500,
    imageIcon: Droplet,
    imageColor: 'text-sky-500',
    sideEffects: ['Temporary blurred vision', 'Eye irritation (rare)'],
    warnings: ['Do not touch dropper tip', 'Remove contact lenses before use', 'Discard 30 days after opening'],
    dosage: '1-2 drops in each eye 4 times daily as needed.',
    storage: 'Store at room temperature. Discard 30 days after opening.',
  },
  {
    id: 'med-013',
    name: 'Diclofenac Gel',
    brand: 'Volini',
    genericName: 'Diclofenac Diethylamine',
    strength: '1%',
    form: 'Cream',
    price: 130,
    prescriptionRequired: false,
    category: 'Pain Relief',
    description: 'Topical NSAID gel for local pain relief. Effective for muscle sprains, joint pain, and sports injuries.',
    manufacturer: 'Sun Pharma',
    inStock: true,
    rating: 4.4,
    reviews: 1100,
    imageIcon: SprayCan,
    imageColor: 'text-green-500',
    sideEffects: ['Skin irritation', 'Redness at application site', 'Rash (rare)'],
    warnings: ['Do not apply on broken skin', 'Wash hands after use', 'Avoid contact with eyes'],
    dosage: 'Apply a thin layer to the affected area 3-4 times daily.',
    storage: 'Store below 30°C. Do not freeze.',
  },
  {
    id: 'med-014',
    name: 'ORS',
    brand: 'Electral',
    genericName: 'Oral Rehydration Salts',
    strength: '21.8g',
    form: 'Syrup',
    price: 25,
    prescriptionRequired: false,
    category: 'First Aid',
    description: 'WHO-recommended oral rehydration solution for dehydration due to diarrhea, vomiting, or heat exhaustion.',
    manufacturer: 'FDC Ltd',
    inStock: true,
    rating: 4.8,
    reviews: 3500,
    imageIcon: FlaskConical,
    imageColor: 'text-blue-400',
    sideEffects: ['None at recommended doses'],
    warnings: ['Use clean water to prepare', 'Consume within 24 hours of preparation', 'Seek medical help if dehydration persists'],
    dosage: 'Dissolve one sachet in 1 liter of safe drinking water. Sip frequently.',
    storage: 'Store in a cool, dry place. Keep sachets sealed until use.',
  },
  {
    id: 'med-015',
    name: 'Povidone Iodine',
    brand: 'Betadine',
    genericName: 'Povidone Iodine',
    strength: '5%',
    form: 'Drops',
    price: 85,
    prescriptionRequired: false,
    category: 'First Aid',
    description: 'Antiseptic solution for wound cleaning and infection prevention. Broad-spectrum antimicrobial action.',
    manufacturer: 'Mundipharma',
    inStock: false,
    rating: 4.6,
    reviews: 1900,
    imageIcon: Droplet,
    imageColor: 'text-rose-500',
    sideEffects: ['Skin irritation', 'Staining of skin', 'Allergic reaction (rare)'],
    warnings: ['Do not use if allergic to iodine', 'Not for long-term use', 'Avoid in thyroid disorders'],
    dosage: 'Apply undiluted to the affected area 2-3 times daily.',
    storage: 'Store below 25°C. Protect from light.',
  },
  {
    id: 'med-016',
    name: 'Atorvastatin',
    brand: 'Atorva',
    genericName: 'Atorvastatin Calcium',
    strength: '10mg',
    form: 'Tablet',
    price: 150,
    prescriptionRequired: true,
    category: 'Cardiac',
    description: 'Statin medication to lower cholesterol and reduce risk of heart disease. Inhibits HMG-CoA reductase.',
    manufacturer: 'Zydus Cadila',
    inStock: true,
    rating: 4.5,
    reviews: 680,
    imageIcon: Pill,
    imageColor: 'text-red-400',
    sideEffects: ['Muscle pain', 'Liver enzyme elevation', 'Headache', 'GI upset'],
    warnings: ['Report unexplained muscle pain', 'Avoid grapefruit juice', 'Monitor liver function'],
    dosage: '1 tablet once daily, preferably in the evening.',
    storage: 'Store at room temperature. Protect from moisture.',
  },
  {
    id: 'med-017',
    name: 'Pantoprazole',
    brand: 'Pan',
    genericName: 'Pantoprazole Sodium',
    strength: '40mg',
    form: 'Tablet',
    price: 90,
    prescriptionRequired: false,
    category: 'Gastrointestinal',
    description: 'Proton pump inhibitor for acid-related disorders. Heals esophagitis and prevents acid reflux.',
    manufacturer: 'Alkem Laboratories',
    inStock: true,
    rating: 4.4,
    reviews: 1300,
    imageIcon: Tablet,
    imageColor: 'text-violet-500',
    sideEffects: ['Headache', 'Diarrhea', 'Dizziness', 'Vitamin B12 deficiency (long-term)'],
    warnings: ['Take before first meal', 'Do not crush or chew', 'Long-term use needs monitoring'],
    dosage: '1 tablet daily, 30 minutes before breakfast.',
    storage: 'Store below 25°C. Keep in original blister pack.',
  },
  {
    id: 'med-018',
    name: 'Multivitamin',
    brand: 'Revital H',
    genericName: 'Multivitamin + Minerals',
    strength: 'Capsule',
    form: 'Capsule',
    price: 250,
    prescriptionRequired: false,
    category: 'Supplements',
    description: 'Daily multivitamin and mineral supplement supporting energy, immunity, and overall wellness.',
    manufacturer: 'Sun Pharma',
    inStock: true,
    rating: 4.5,
    reviews: 2800,
    imageIcon: PillBottle,
    imageColor: 'text-lime-500',
    sideEffects: ['Stomach upset (rare)', 'Allergic reaction (rare)'],
    warnings: ['Do not exceed daily dose', 'Not a substitute for a balanced diet', 'Store away from children'],
    dosage: '1 capsule daily after breakfast.',
    storage: 'Store below 25°C. Keep container tightly closed.',
  },
  {
    id: 'med-019',
    name: 'Hand Sanitizer',
    brand: 'Dettol',
    genericName: 'Ethyl Alcohol 70%',
    strength: '200ml',
    form: 'Spray',
    price: 99,
    prescriptionRequired: false,
    category: 'Hygiene',
    description: 'Kills 99.9% of germs without water. Quick-drying formula with moisturizer for hand hygiene.',
    manufacturer: 'Reckitt Benckiser',
    inStock: true,
    rating: 4.7,
    reviews: 4200,
    imageIcon: SprayCan,
    imageColor: 'text-teal-400',
    sideEffects: ['Skin dryness with frequent use'],
    warnings: ['For external use only', 'Keep away from fire', 'Avoid contact with eyes'],
    dosage: 'Spray enough product on palms to cover both hands. Rub until dry.',
    storage: 'Store below 40°C. Keep away from heat and flame.',
  },
  {
    id: 'med-020',
    name: 'Adhesive Bandages',
    brand: 'Band-Aid',
    genericName: 'Adhesive Bandage',
    strength: 'Assorted',
    form: 'Cream',
    price: 60,
    prescriptionRequired: false,
    category: 'First Aid',
    description: 'Sterile adhesive bandages for minor cuts, scrapes, and burns. Waterproof and breathable.',
    manufacturer: 'Johnson & Johnson',
    inStock: true,
    rating: 4.6,
    reviews: 5200,
    imageIcon: Bandage,
    imageColor: 'text-orange-400',
    sideEffects: ['Skin irritation (rare)'],
    warnings: ['Change daily', 'Do not use on infected wounds', 'Seek medical care for deep wounds'],
    dosage: 'Clean wound, apply bandage, change daily or when wet.',
    storage: 'Store at room temperature. Keep sterile until use.',
  },
];

export const pharmacies: Pharmacy[] = [
  {
    id: 'ph-001',
    name: 'Wellness Pharmacy',
    verified: true,
    rating: 4.8,
    reviewCount: 1240,
    distance: 0.8,
    eta: '15 min',
    trustScore: 96,
    open: true,
    address: '12 MG Road, Bengaluru, KA 560001',
    phone: '+91 80 2234 5678',
    openHours: 'Open 24 hours',
    imageColor: 'bg-blue-500',
    specialties: ['Prescription medicines', 'Cold chain storage', '24/7 service'],
    yearsActive: 12,
  },
  {
    id: 'ph-002',
    name: 'Apollo Pharmacy',
    verified: true,
    rating: 4.7,
    reviewCount: 3400,
    distance: 1.2,
    eta: '20 min',
    trustScore: 94,
    open: true,
    address: '45 Brigade Road, Bengaluru, KA 560025',
    phone: '+91 80 2555 1234',
    openHours: '7:00 AM - 11:00 PM',
    imageColor: 'bg-red-500',
    specialties: ['All medicines', 'Diagnostic tests', 'Home delivery'],
    yearsActive: 18,
  },
  {
    id: 'ph-003',
    name: 'MedPlus Pharmacy',
    verified: true,
    rating: 4.5,
    reviewCount: 2100,
    distance: 1.8,
    eta: '25 min',
    trustScore: 91,
    open: true,
    address: '78 Indiranagar 100ft Road, Bengaluru, KA 560038',
    phone: '+91 80 4123 6789',
    openHours: '8:00 AM - 10:00 PM',
    imageColor: 'bg-emerald-500',
    specialties: ['Generic medicines', 'Wellness products', 'Loyalty program'],
    yearsActive: 15,
  },
  {
    id: 'ph-004',
    name: 'HealthCare Plus',
    verified: true,
    rating: 4.6,
    reviewCount: 890,
    distance: 2.5,
    eta: '30 min',
    trustScore: 89,
    open: true,
    address: '23 Koramangala 5th Block, Bengaluru, KA 560095',
    phone: '+91 80 4678 9012',
    openHours: '24 hours',
    imageColor: 'bg-purple-500',
    specialties: ['Emergency medicines', 'Surgical supplies', '24/7 service'],
    yearsActive: 8,
  },
  {
    id: 'ph-005',
    name: 'LifeLine Pharmacy',
    verified: false,
    rating: 4.2,
    reviewCount: 450,
    distance: 3.1,
    eta: '35 min',
    trustScore: 82,
    open: false,
    address: '56 Jayanagar 4th Block, Bengaluru, KA 560011',
    phone: '+91 80 2233 7788',
    openHours: '9:00 AM - 9:00 PM',
    imageColor: 'bg-amber-500',
    specialties: ['General medicines', 'Baby care'],
    yearsActive: 5,
  },
  {
    id: 'ph-006',
    name: 'CareWell Pharmacy',
    verified: true,
    rating: 4.7,
    reviewCount: 1560,
    distance: 3.8,
    eta: '40 min',
    trustScore: 93,
    open: true,
    address: '90 HSR Layout Sector 2, Bengaluru, KA 560102',
    phone: '+91 80 4567 8900',
    openHours: '7:00 AM - 11:00 PM',
    imageColor: 'bg-cyan-500',
    specialties: ['Chronic disease meds', 'Geriatric care', 'Home delivery'],
    yearsActive: 10,
  },
];

export const addresses: Address[] = [
  {
    id: 'addr-001',
    label: 'Home',
    line1: 'Flat 302, Green Meadows Apartments',
    line2: 'MG Road, Near Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    isDefault: true,
    type: 'HOME',
  },
  {
    id: 'addr-002',
    label: 'Work',
    line1: 'Tower B, 5th Floor, Tech Park',
    line2: 'Whitefield Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    isDefault: false,
    type: 'WORK',
  },
  {
    id: 'addr-003',
    label: 'Mom\'s Place',
    line1: '14, 3rd Cross, Jayanagar 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560011',
    isDefault: false,
    type: 'OTHER',
  },
];

export const orders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'MS20260822001',
    status: 'IN_TRANSIT',
    items: [
      { medicineId: 'med-001', name: 'Paracetamol', brand: 'Crocin', strength: '500mg', form: 'Tablet', price: 35, quantity: 2, imageIcon: Tablet, imageColor: 'text-blue-500' },
      { medicineId: 'med-007', name: 'Cough Syrup', brand: 'Benadryl', strength: '100ml', form: 'Syrup', price: 110, quantity: 1, imageIcon: FlaskConical, imageColor: 'text-orange-500' },
    ],
    pharmacyId: 'ph-001',
    pharmacyName: 'Wellness Pharmacy',
    subtotal: 180,
    deliveryFee: 25,
    serviceFee: 10,
    total: 215,
    placedAt: '2026-08-22T09:30:00',
    deliveryAddress: 'Flat 302, Green Meadows Apartments, MG Road, Bengaluru 560001',
    paymentMethod: 'UPI',
    riderName: 'Rajesh Kumar',
    riderPhone: '+91 98765 43210',
    estimatedDelivery: '10:00 AM',
    prescriptionRequired: false,
  },
  {
    id: 'order-002',
    orderNumber: 'MS20260821002',
    status: 'DELIVERED',
    items: [
      { medicineId: 'med-003', name: 'Metformin', brand: 'Glycomet', strength: '850mg', form: 'Tablet', price: 85, quantity: 3, imageIcon: Tablet, imageColor: 'text-teal-500' },
      { medicineId: 'med-011', name: 'Vitamin D3', brand: 'Calcirol', strength: '60000 IU', form: 'Capsule', price: 65, quantity: 1, imageIcon: PillBottle, imageColor: 'text-yellow-500' },
    ],
    pharmacyId: 'ph-002',
    pharmacyName: 'Apollo Pharmacy',
    subtotal: 320,
    deliveryFee: 25,
    serviceFee: 10,
    total: 355,
    placedAt: '2026-08-21T14:15:00',
    deliveryAddress: 'Flat 302, Green Meadows Apartments, MG Road, Bengaluru 560001',
    paymentMethod: 'Credit Card',
    estimatedDelivery: 'Delivered at 2:45 PM',
    prescriptionRequired: true,
  },
  {
    id: 'order-003',
    orderNumber: 'MS20260820003',
    status: 'DELIVERED',
    items: [
      { medicineId: 'med-004', name: 'Cetirizine', brand: 'Zyrtec', strength: '10mg', form: 'Tablet', price: 45, quantity: 2, imageIcon: Tablet, imageColor: 'text-purple-500' },
      { medicineId: 'med-014', name: 'ORS', brand: 'Electral', strength: '21.8g', form: 'Syrup', price: 25, quantity: 4, imageIcon: FlaskConical, imageColor: 'text-blue-400' },
    ],
    pharmacyId: 'ph-003',
    pharmacyName: 'MedPlus Pharmacy',
    subtotal: 190,
    deliveryFee: 25,
    serviceFee: 10,
    total: 225,
    placedAt: '2026-08-20T18:00:00',
    deliveryAddress: 'Flat 302, Green Meadows Apartments, MG Road, Bengaluru 560001',
    paymentMethod: 'Cash on Delivery',
    estimatedDelivery: 'Delivered at 6:30 PM',
    prescriptionRequired: false,
  },
  {
    id: 'order-004',
    orderNumber: 'MS20260819004',
    status: 'CANCELLED',
    items: [
      { medicineId: 'med-010', name: 'Ibuprofen', brand: 'Brufen', strength: '400mg', form: 'Tablet', price: 55, quantity: 1, imageIcon: Tablet, imageColor: 'text-indigo-500' },
    ],
    pharmacyId: 'ph-001',
    pharmacyName: 'Wellness Pharmacy',
    subtotal: 55,
    deliveryFee: 25,
    serviceFee: 10,
    total: 90,
    placedAt: '2026-08-19T10:00:00',
    deliveryAddress: 'Flat 302, Green Meadows Apartments, MG Road, Bengaluru 560001',
    paymentMethod: 'UPI',
    estimatedDelivery: 'Cancelled',
    prescriptionRequired: false,
  },
];

export const prescriptions: Prescription[] = [
  {
    id: 'rx-001',
    prescriptionNumber: 'RX20260822001',
    status: 'VERIFIED',
    uploadedAt: '2026-08-22T08:00:00',
    doctorName: 'Dr. Anil Sharma, MBBS, MD',
    patientName: 'John Doe',
    fileUrl: 'rx-001.jpg',
    fileType: 'image',
    medicines: [
      { name: 'Metformin', strength: '850mg', quantity: 60 },
      { name: 'Atorvastatin', strength: '10mg', quantity: 30 },
    ],
    notes: 'Verified by pharmacy. Valid for 30 days.',
  },
  {
    id: 'rx-002',
    prescriptionNumber: 'RX20260820002',
    status: 'PENDING_REVIEW',
    uploadedAt: '2026-08-22T07:30:00',
    doctorName: 'Dr. Priya Reddy, MBBS',
    patientName: 'John Doe',
    fileUrl: 'rx-002.pdf',
    fileType: 'pdf',
    medicines: [
      { name: 'Azithromycin', strength: '500mg', quantity: 5 },
    ],
    notes: 'Awaiting pharmacy verification.',
  },
  {
    id: 'rx-003',
    prescriptionNumber: 'RX20260815003',
    status: 'EXPIRED',
    uploadedAt: '2026-08-15T11:00:00',
    doctorName: 'Dr. Vikram Singh, MBBS, MS',
    patientName: 'John Doe',
    fileUrl: 'rx-003.jpg',
    fileType: 'image',
    medicines: [
      { name: 'Insulin Glargine', strength: '100 IU/ml', quantity: 1 },
    ],
  },
  {
    id: 'rx-004',
    prescriptionNumber: 'RX20260810004',
    status: 'REJECTED',
    uploadedAt: '2026-08-10T15:00:00',
    doctorName: 'Dr. Unknown',
    patientName: 'John Doe',
    fileUrl: 'rx-004.jpg',
    fileType: 'image',
    medicines: [],
    notes: 'Prescription image was unclear. Please re-upload a clear photo.',
  },
];

export const notifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Order in transit',
    message: 'Your order MS20260822001 is on the way. Rajesh will deliver it by 10:00 AM.',
    timestamp: '2026-08-22T09:45:00',
    read: false,
    type: 'delivery',
  },
  {
    id: 'notif-002',
    title: 'Prescription verified',
    message: 'Your prescription RX20260822001 has been verified by Wellness Pharmacy.',
    timestamp: '2026-08-22T08:15:00',
    read: false,
    type: 'prescription',
  },
  {
    id: 'notif-003',
    title: 'Order delivered',
    message: 'Your order MS20260821002 has been delivered. Rate your experience!',
    timestamp: '2026-08-21T14:45:00',
    read: true,
    type: 'order',
  },
  {
    id: 'notif-004',
    title: 'Safety reminder',
    message: 'Check your medicine cabinet for expired items. Safe disposal saves lives.',
    timestamp: '2026-08-21T09:00:00',
    read: true,
    type: 'safety',
  },
  {
    id: 'notif-005',
    title: 'Welcome to MediSwift',
    message: 'Complete your profile to get personalized medicine recommendations.',
    timestamp: '2026-08-19T12:00:00',
    read: true,
    type: 'system',
  },
];

export const popularProducts = medicines.filter(m =>
  ['med-011', 'med-018', 'med-014', 'med-019', 'med-020', 'med-012'].includes(m.id)
);

export const orderStatusSteps: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'NEW', label: 'Order Placed', description: 'Your order has been placed' },
  { status: 'ACCEPTED', label: 'Accepted', description: 'Pharmacy accepted your order' },
  { status: 'VERIFICATION', label: 'Verification', description: 'Prescription verification in progress' },
  { status: 'PREPARING', label: 'Preparing', description: 'Your order is being prepared' },
  { status: 'PACKED', label: 'Packed', description: 'Order has been packed' },
  { status: 'READY', label: 'Ready for Pickup', description: 'Order ready for delivery pickup' },
  { status: 'PICKED_UP', label: 'Picked Up', description: 'Delivery partner picked up your order' },
  { status: 'IN_TRANSIT', label: 'In Transit', description: 'Your order is on the way' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Order delivered successfully' },
];

export function getMedicineById(id: string): Medicine | undefined {
  return medicines.find(m => m.id === id);
}

export function getPharmacyById(id: string): Pharmacy | undefined {
  return pharmacies.find(p => p.id === id);
}

export function getOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id);
}

export function getPrescriptionById(id: string): Prescription | undefined {
  return prescriptions.find(p => p.id === id);
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
  const now = new Date('2026-08-22T10:00:00');
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
