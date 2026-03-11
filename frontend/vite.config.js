import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ai-cloud-dev-ops-engineer-ridhima.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
