import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Add this 'base' property to specify the subdirectory
  plugins: [react()],
  base: '/plantjoy/'
})
