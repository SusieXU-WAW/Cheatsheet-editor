import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment, uncomment and set the base path:
  base: '/cheatsheet/',
})
