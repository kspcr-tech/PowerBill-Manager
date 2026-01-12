export interface Tenant {
  name: string;
  address: string;
  phone: string;
}

export interface Bill {
  amount: number;
  units: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
}

export interface UkscItem {
  id: string;
  ukscNumber: string;
  label: string;
  tenant: Tenant;
  lastBill?: Bill;
}

export type PropertyType = 'home' | 'apartment';

export interface Profile {
  id: string;
  name: string;
  type: PropertyType;
  items: UkscItem[];
}

export interface AppData {
  profiles: Profile[];
  apiKey: string;
}