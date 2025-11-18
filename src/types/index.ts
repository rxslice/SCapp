export enum View {
  DASHBOARD = 'DASHBOARD',
  MEDICATIONS = 'MEDICATIONS',
  APPOINTMENTS = 'APPOINTMENTS',
  ACTIVITIES = 'ACTIVITIES',
  EMERGENCY = 'EMERGENCY',
  SETTINGS = 'SETTINGS',
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // "HH:MM"
  taken: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  doctor: string;
  notes: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string; // "HH:MM"
  completed: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}