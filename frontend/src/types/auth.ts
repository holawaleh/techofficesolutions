export interface User {
  id: number;
  username: string;
  email: string;
  company_name: string;
  address: string;
  phone_number: string;
  areas_of_interest?: string[];
  is_superuser?: boolean;
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
