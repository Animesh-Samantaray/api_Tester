import api from './axios';

export interface RequestPayload {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: any;
  auth: {
    type: string;
    token?: string;
    key?: string;
    value?: string;
  };
}

export interface RequestResponse {
  success: boolean;
  data: {
    status: number;
    statusText: string;
    responseTime: number;
    headers: Record<string, string>;
    body: any;
  };
}

export const requestService = {
  async sendRequest(payload: RequestPayload): Promise<RequestResponse> {
    const response = await api.post('/request/send', payload);
    return response.data;
  }
};
