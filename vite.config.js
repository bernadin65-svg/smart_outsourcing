import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    // ✅ Fix "Invalid hook call" - évite les copies dupliquées de React
    dedupe: ['react', 'react-dom'],
  },
})