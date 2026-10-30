import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// Per-page HTML, sitemap.xml and robots.txt are generated after the build by scripts/prerender.mjs
// from the live product API, so new products appear without editing this file.
// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    cloudflare(),
  ],
}))
