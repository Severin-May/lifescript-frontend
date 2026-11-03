import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.{js,jsx}']
        }
      },
      {
        extends: true,
        test: {
          name: 'contract',
          include: ['tests/contract/**/*.test.{js,jsx}'],
          globalSetup: ['tests/support/checkBackend.js']
        }
      }
    ]
  }
})
