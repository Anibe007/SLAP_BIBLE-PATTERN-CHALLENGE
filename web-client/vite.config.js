import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy TheSinging.Bible and strip iframe-blocking headers
      '/singing-proxy': {
        target: 'https://thesinging.bible',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/singing-proxy/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Remove headers that block iframe embedding
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['X-Frame-Options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['Content-Security-Policy'];
            delete proxyRes.headers['x-content-type-options'];
          });
        },
      },
    },
  },
})
