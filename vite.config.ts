import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wp-json': {
        target: 'http://wp.vanessaphil.com',
        changeOrigin: true,
        secure: false, // Allow HTTP to HTTPS proxy
      }
    }
  }
})
