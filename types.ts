export interface TenantDetails {
  name: string;
  flatOrPlotNo: string;
  phone: string;
}

export interface BillDetails {
  ukscNo: string;
  billingDate: string;
  dueDate: string;
  amount: number;
  unitsConsumed: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  fetchedAt: string;
}

export interface UkscItem {
  id: string;
  ukscNumber: string;
  label: string; // User defined name (e.g., "Meter 1")
  tenant: TenantDetails;
  lastBill?: BillDetails;
}

export type ProfileType = 'home' | 'apartment';

export interface Profile {
  id: string;
  name: string;
  type: ProfileType;
  items: UkscItem[];
}

export interface AppState {
  profiles: Profile[];
  addProfile: (name: string, type: ProfileType) => void;
  deleteProfile: (id: string) => void;
  addUkscToProfile: (profileId: string, ukscNumbers: string[]) => void;
  updateUksc: (profileId: string, ukscId: string, updates: Partial<UkscItem>) => void;
  removeUksc: (profileId: string, ukscId: string) => void;
  updateTenantDetails: (profileId: string, ukscId: string, details: TenantDetails) => void;
}
