import { useMemo } from 'react';

export function useApiUrl() {
  return useMemo(() => {
    if (import.meta.env.DEV) {
      // In development, use the proxy setup
      return '/api';
    } else {
      // In production, use the environment variable or fallback to an empty string
      return import.meta.env.VITE_API_URL || '';
    }
  }, []);
}

export default useApiUrl;