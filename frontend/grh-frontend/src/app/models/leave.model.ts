export interface LeaveRequest {
  id?: number;
  employee?: any;
  startDate: string;
  endDate: string;
  leaveType: 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'PATERNITY' | 'OTHER';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  requestedAt?: string;
}