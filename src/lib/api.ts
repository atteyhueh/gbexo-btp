const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let token: string | null = localStorage.getItem('auth_token');

export const setToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem('auth_token', newToken);
};

export const getToken = () => token;

export const clearToken = () => {
  token = null;
  localStorage.removeItem('auth_token');
};

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Error');
  }

  return response.json();
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () =>
      apiCall('/auth/logout', {
        method: 'POST',
      }),
  },

  projects: {
    list: () => apiCall('/projects'),
    get: (id: string) => apiCall(`/projects/${id}`),
    create: (data: any) =>
      apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/projects/${id}`, {
        method: 'DELETE',
      }),
  },

  services: {
    list: () => apiCall('/services'),
    create: (data: any) =>
      apiCall('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/services/${id}`, {
        method: 'DELETE',
      }),
  },

  jobs: {
    list: () => apiCall('/jobs'),
    get: (id: string) => apiCall(`/jobs/${id}`),
    create: (data: any) =>
      apiCall('/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/jobs/${id}`, {
        method: 'DELETE',
      }),
  },

  team: {
    list: () => apiCall('/team'),
    create: (data: any) =>
      apiCall('/team', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/team/${id}`, {
        method: 'DELETE',
      }),
  },

  testimonials: {
    list: () => apiCall('/testimonials'),
    create: (data: any) =>
      apiCall('/testimonials', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall(`/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/testimonials/${id}`, {
        method: 'DELETE',
      }),
  },

  quotes: {
    list: () => apiCall('/quotes'),
    create: (data: any) =>
      apiCall('/quotes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall(`/quotes/${id}`, {
        method: 'DELETE',
      }),
  },

  contact: {
    send: (data: any) =>
      apiCall('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
