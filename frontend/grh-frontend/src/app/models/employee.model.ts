export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hireDate: string;
  jobTitle: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  department?: Department;
}