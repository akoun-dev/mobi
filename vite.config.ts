import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vitest config will also use this file

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
  },
})
