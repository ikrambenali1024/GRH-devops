export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'RH' | 'MANAGER' | 'EMPLOYEE';
}

export interface AuthResponse {
  token: string;
}