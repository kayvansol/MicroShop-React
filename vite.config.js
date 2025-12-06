import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@app": "/src/app",
      "@shared": "/src/shared",
      "@features": "/src/features",
      "@lib": "/src/lib", 
      "@routes": "/src/routes", 
      "@layouts": "/src/layouts"     
    },
  },
})
