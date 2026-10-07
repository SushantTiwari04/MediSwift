import { supabase } from '@/lib/supabase';
import type { CartItemData } from '@/lib/cart';
import type { OrderStatus } from '@/data/mockData';

export interface OrderRecord {
  id: string;
  customer_id: string;
  order_number: string;
  status: OrderStatus;
  items: CartItemData[];
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  total: number;
  delivery_address: {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment_method: string;
  delivery_instructions: string | null;
  prescription_required: boolean;
  estimated_delivery: string | null;
  placed_at: string;
  created_at: string;
  updated_at: string;
}

function generateOrderNumber(): string {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MS${ymd}${random}`;
}

export interface CreateOrderParams {
  items: CartItemData[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  deliveryAddress: {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  deliveryInstructions?: string;
  prescriptionRequired: boolean;
}

export async function createOrder(
  params: CreateOrderParams,
): Promise<{ data: OrderRecord | null; error: string | null }> {
  const orderNumber = generateOrderNumber();
  const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: 'NEW' as OrderStatus,
      items: params.items,
      subtotal: params.subtotal,
      delivery_fee: params.deliveryFee,
      service_fee: params.serviceFee,
      total: params.total,
      delivery_address: params.deliveryAddress,
      payment_method: params.paymentMethod,
      delivery_instructions: params.deliveryInstructions || null,
      prescription_required: params.prescriptionRequired,
      estimated_delivery: estimatedDelivery,
    })
    .select('*')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as OrderRecord, error: null };
}

export async function fetchCustomerOrders(): Promise<{
  data: OrderRecord[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('placed_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as OrderRecord[], error: null };
}

export async function fetchOrderById(
  id: string,
): Promise<{ data: OrderRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as OrderRecord | null, error: null };
}

export async function fetchAllOrders(): Promise<{
  data: OrderRecord[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('placed_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as OrderRecord[], error: null };
}

export async function fetchOrdersByStatus(
  statuses: OrderStatus[],
): Promise<{ data: OrderRecord[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .in('status', statuses)
    .order('placed_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as OrderRecord[], error: null };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
