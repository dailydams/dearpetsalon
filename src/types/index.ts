// 공통 타입 정의

export interface Customer {
  id: string;
  guardian_name: string;
  pet_name: string;
  species?: string;
  weight?: number;
  memo?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  duration_hours: number;
  price?: number;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer?: Customer;
  service_ids: string[];
  services?: Service[];
  start_time: string;
  end_time: string;
  color: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  total_price?: number;
  memo?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'groomer';
  created_at: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  template: string;
  created_at: string;
  updated_at: string;
}