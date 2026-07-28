import api from './axios';

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: BackendUser;
}

export const authService = {
  async register(name: string, email: string, password: string, avatar?: string): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { name, email, password, avatar });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getMe(): Promise<AuthResponse> {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
