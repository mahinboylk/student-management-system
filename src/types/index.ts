export type Student = {
  id: string;
  admission_number: string;
  initials?: string;
  first_name: string;
  last_name?: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  nationality?: string;
  religion?: string;
  date_of_entry: string;
  previous_school?: string;
  address: string;
  phone_number: string;
  guardian_name: string;
  relationship_to_student: string;
  guardian_identity_number: string;
  created_at: string;
  updated_at: string;
};

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export type Attendance = {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  created_at: string;
};

export type Grade = {
  id: string;
  student_id: string;
  term: string;
  subject: string;
  marks: number;
  grade?: string;
  created_at: string;
};
