import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build'
  },
  plugins: [react()],
  define: {
    global: 'window'
  },
  server: {
    port: 3000,
    open: true
  }
})