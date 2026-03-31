export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Header {
  key: string;
  value: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  size: number;
  time: number;
}