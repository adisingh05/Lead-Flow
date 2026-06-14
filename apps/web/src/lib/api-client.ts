const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiClient {
  static async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    // If clerk is setup locally, we can extract token, otherwise use fallback headers
    if (typeof window !== 'undefined') {
      const mockClerkId = localStorage.getItem('mock-clerk-id') || 'mock-user-123';
      const mockEmail = localStorage.getItem('mock-email') || 'developer@leadflow.ai';
      headers.set('x-mock-clerk-id', mockClerkId);
      headers.set('x-mock-email', mockEmail);
    } else {
      headers.set('x-mock-clerk-id', 'mock-user-123');
      headers.set('x-mock-email', 'developer@leadflow.ai');
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Request Failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  static async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  static async post<T>(path: string, body: any): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static async patch<T>(path: string, body: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}
