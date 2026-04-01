import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set to '/<repo-name>/' or '/' if using custom domain
  base: '/birdeye-social-prototype/',
})
