export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  user_role: string;
  is_active: boolean;
  user_information: any;
}

export interface AuthResponse {
  data: {
    token_type: string;
    access_token: string;
    access_token_expires: string;
    refresh_token: string;
    refresh_token_expires: string;
  };
  meta: {
    error: boolean;
    message: string | null;
  };
  status_code: number;
}

export interface UserResponse {
  data: User;
  meta: {
    error: boolean;
    message: string | null;
  };
  status_code: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
