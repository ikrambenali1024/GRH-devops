export interface Attendance {
  id?: number;
  employee?: any;
  attendanceDate: string;
  checkIn: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  notes?: string;
}