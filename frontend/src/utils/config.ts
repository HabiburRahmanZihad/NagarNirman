// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


// Earthquake API Endpoints
export const EARTHQUAKE_ENDPOINTS = {
  LIST: `${API_BASE_URL}/api/earthquakes`,
  RECENT: `${API_BASE_URL}/api/earthquakes/recent`,
  HIGH_ALERT: `${API_BASE_URL}/api/earthquakes/high-alert`,
  BY_ID: (id: string) => `${API_BASE_URL}/api/earthquakes/${id}`,
  BY_LOCATION: `${API_BASE_URL}/api/earthquakes/location`,
  STATS: `${API_BASE_URL}/api/earthquakes/stats`,
  SEVERITY_DISTRIBUTION: `${API_BASE_URL}/api/earthquakes/severity-distribution`,
};
