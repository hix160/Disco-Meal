import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.0.111',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.0.111:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: Adjust API paths
      }
    }
  }
});
