import api from './axios';
import type { ApiRequest } from '../context/AuthContext';

export interface CollectionResponse {
  success: boolean;
  message?: string;
  data: any;
}

export const collectionService = {
  async getCollections(): Promise<CollectionResponse> {
    const response = await api.get('/collections');
    return response.data;
  },

  async createCollection(name: string, description?: string): Promise<CollectionResponse> {
    const response = await api.post('/collections', { name, description });
    return response.data;
  },

  async updateCollection(collectionId: string, name: string, description?: string): Promise<CollectionResponse> {
    const response = await api.put(`/collections/${collectionId}`, { name, description });
    return response.data;
  },

  async deleteCollection(collectionId: string): Promise<CollectionResponse> {
    const response = await api.delete(`/collections/${collectionId}`);
    return response.data;
  },

  async saveRequest(
    collectionId: string,
    request: Omit<ApiRequest, 'id'>
  ): Promise<CollectionResponse> {
    const response = await api.post(`/collections/${collectionId}/request`, request);
    return response.data;
  },

  async updateSavedRequest(
    requestId: string,
    request: Partial<ApiRequest>
  ): Promise<CollectionResponse> {
    const response = await api.put(`/request/${requestId}`, request);
    return response.data;
  },

  async deleteSavedRequest(requestId: string): Promise<CollectionResponse> {
    const response = await api.delete(`/request/${requestId}`);
    return response.data;
  }
};
