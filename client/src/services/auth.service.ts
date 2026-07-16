import api from './axios';

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: BackendUser;
}

export interface StatsResponse {
  success: boolean;
  stats: {
    totalRequests: number;
    successCount: number;
    failCount: number;
    methodDistribution: Record<string, number>;
    collectionsCount: number;
    savedRequestsCount: number;
    averageResponseTime: number;
  };
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
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; token?: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async updateProfile(name: string, avatar: string): Promise<AuthResponse> {
    const response = await api.put('/user/profile', { name, avatar });
    return response.data;
  },

  async getProfile(): Promise<AuthResponse> {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put('/user/change-password', { oldPassword, newPassword });
    return response.data;
  },

  async getStats(): Promise<StatsResponse> {
    const response = await api.get('/user/stats');
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ success: boolean; avatarUrl?: string; message?: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post("/user/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};
