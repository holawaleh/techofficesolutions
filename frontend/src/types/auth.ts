export interface User {
  id: number;
  username: string;
  email: string;
  company_name: string;
  address: string;
  phone_number: string;
  areas_of_interest?: string[];

  // ✅ Added fields to match backend & Dashboard.tsx usage
  company_id?: string;
  telephone?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_admin?: boolean;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  company_name: string;
  address: string;
  phone_number: string;
  areas_of_interest?: string[];
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface StaffMember {
  id: number;
  username: string;
  email: string;
  can_edit: boolean;
  can_delete: boolean;
  special_privileges: string[];
  created_at: string;
}
