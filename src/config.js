// Centralized API configuration to support unified single-server deployment
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const API_BASE = `${API_BASE_URL}/api`;
