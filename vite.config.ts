import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'

// Web portal builds: VITE_PORTAL=crazygames|itch (npm run build:crazygames / build:itch) use
// src/monetization-portal.ts instead of src/monetization.ts (Unity Ads on iOS).
export default defineConfig(({ mode }) => {
  const portal = loadEnv(mode, process.cwd(), 'VITE_').VITE_PORTAL
  return {
    base: portal ? './' : '/',
    build: portal ? { outDir: `dist-${portal}` } : {},
    plugins: [
      react(),
      ...(portal ? [{
        name: 'portal-html',
        transformIndexHtml: (html: string) => ({
          html: html.replace(/<title>.*<\/title>/, '<title>Million Climb Quiz</title>'),
          tags: portal === 'crazygames'
            ? [{ tag: 'script', attrs: { src: 'https://sdk.crazygames.com/crazygames-sdk-v3.js' }, injectTo: 'head-prepend' as const }]
            : [],
        }),
      }] : []),
    ],
    resolve: portal ? {
      alias: [{ find: /^\.\/monetization$/, replacement: fileURLToPath(new URL('./src/monetization-portal.ts', import.meta.url)) }],
    } : {},
  }
})
