import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/pipe-safe/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PipeSafe',
        short_name: 'PipeSafe',
        description: 'Check if it\'s safe to leave pipes in your car based on weather.',
        start_url: '/pipe-safe/',
        display: 'standalone',
        background_color: '#1A202C',
        theme_color: '#00C4B4',
        icons: [
          { src: 'pipe-safe-logo.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'pipe-safe-logo.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,svg,html}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});