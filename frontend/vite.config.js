import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
  }

  if (command === 'serve') {
    // Development-specific config
    config.server = {
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
  }

  return config
})