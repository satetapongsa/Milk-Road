// Centralized API configuration to support global management from anywhere in the world
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_BASE = `${API_BASE_URL}/api`;
