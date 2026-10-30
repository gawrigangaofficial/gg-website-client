import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// Per-page HTML, sitemap.xml and robots.txt are generated after the build by scripts/prerender.mjs
// from the live product API, so new products appear without editing this file.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    cloudflare({
      // wrangler.jsonc serves real 404s in production (every page has its own prerendered file).
      // The dev server has no prerendered files, so it keeps the single-page fallback; otherwise
      // refreshing /about locally would show "page not found".
      config: command === 'serve' ? { assets: { not_found_handling: 'single-page-application' } } : undefined,
    }),
  ],
}))
