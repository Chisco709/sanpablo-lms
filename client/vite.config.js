import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Configuración para desarrollo local
    port: 5173, // Puerto por defecto
    proxy: {
      // 🔥 Soluciona problemas CORS en desarrollo
      '/api': {
        target: 'https://sanpablo-lms-server.vercel.app', // Tu backend en Vercel
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '') // Opcional: limpia /api en las rutas
      }
    }
  },
  build: {
    // Optimización para producción
    outDir: 'dist', // Carpeta de build
    sourcemap: false, // Mejor rendimiento (poner 'true' solo en desarrollo)
    minify: 'terser' // Comprime el código para producción
  },
  optimizeDeps: {
    // Acelera el desarrollo
    include: ['react', 'react-dom', 'react-router-dom']
  }
});