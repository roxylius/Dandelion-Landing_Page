// Defines the configuration for the Vite build tool.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/landingPage/', // This is crucial!
  // An array of plugins to use.
  plugins: [react()],
  // Development server configuration.
  server: {
    // Hosts that are allowed to access the dev server. for porting
    allowedHosts: [
      'http://localhost:5173'
    ],
  }
})