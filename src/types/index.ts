// Shared types for lessons and students
export interface Student {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string; // ISO date string
  address: string;
  training_package: 'basic' | 'standard' | 'premium';
  preferred_time_slots: string[];
  has_license_theory?: boolean | null;
  emergency_contact: string;
  emergency_phone: string;
  terms_accepted?: boolean | null;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | null;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string | number;
  user_id: string; // references students.user_id
  student_id?: string | number; // optional, for backward compatibility
  student_name: string;
  date: string;
  time: string;
  instructor: string;
  status: string;
} 