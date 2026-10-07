import { supabase } from '@/lib/supabase';

export type PrescriptionStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUIRED';

export interface PrescriptionRecord {
  id: string;
  customer_id: string;
  prescription_number: string;
  doctor_name: string;
  patient_name: string;
  notes: string | null;
  file_url: string | null;
  file_type: 'image' | 'pdf';
  file_name: string;
  status: PrescriptionStatus;
  admin_notes: string | null;
  medicines: { name: string; strength: string; quantity: number }[];
  created_at: string;
  updated_at: string;
}

function generatePrescriptionNumber(): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RX${ymd}${rand}`;
}

export async function uploadPrescriptionImage(
  customerId: string,
  file: File,
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${customerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('prescriptions')
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    return { error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from('prescriptions')
    .getPublicUrl(fileName);

  return { path: fileName, publicUrl: urlData.publicUrl };
}

export async function createPrescription(params: {
  customerId: string;
  doctorName: string;
  patientName: string;
  notes?: string;
  fileUrl?: string;
  filePath?: string;
  fileType: 'image' | 'pdf';
  fileName: string;
  medicines?: { name: string; strength: string; quantity: number }[];
}): Promise<{ data: PrescriptionRecord | null; error: string | null }> {
  const prescriptionNumber = generatePrescriptionNumber();

  const { data, error } = await supabase
    .from('prescriptions')
    .insert({
      customer_id: params.customerId,
      prescription_number: prescriptionNumber,
      doctor_name: params.doctorName,
      patient_name: params.patientName,
      notes: params.notes || null,
      file_url: params.fileUrl || null,
      file_type: params.fileType,
      file_name: params.fileName,
      medicines: params.medicines || [],
      status: 'PENDING',
    })
    .select('*')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as PrescriptionRecord, error: null };
}

export async function fetchCustomerPrescriptions(
  customerId: string,
): Promise<{ data: PrescriptionRecord[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as PrescriptionRecord[], error: null };
}

export async function fetchPrescriptionById(
  id: string,
): Promise<{ data: PrescriptionRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as PrescriptionRecord | null, error: null };
}

export async function fetchAllPrescriptions(): Promise<{
  data: PrescriptionRecord[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as PrescriptionRecord[], error: null };
}

export async function updatePrescriptionStatus(
  id: string,
  status: PrescriptionStatus,
  adminNotes?: string,
): Promise<{ error: string | null }> {
  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (adminNotes !== undefined) {
    update.admin_notes = adminNotes;
  }

  const { error } = await supabase
    .from('prescriptions')
    .update(update)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
