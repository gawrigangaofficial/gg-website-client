import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

import { cloudflare } from "@cloudflare/vite-plugin";

/** Product detail paths for SPA sitemap (vite-plugin-sitemap only sees dist HTML). */
const PRODUCT_SLUGS = [
  '1-mukhi-rudraksha',
  '2-mukhi-rudraksha',
  '3-mukhi-rudraksha',
  '4-mukhi-rudraksha',
  '5-mukhi-rudraksha',
  '6-mukhi-rudraksha',
  '7-mukhi-rudraksha',
  '8-mukhi-rudaksha',
  '9-mukhi-rudraksha',
  '10-mukhi-rudraksha',
  '11-mukhi-rudraksha',
  '12-mukhi-rudraksha',
  '13-mukhi-rudraksha',
  '14-mukhi-rudraksha',
  'karungli-mala',
  'original-thick-tulsi-kanthi-mala',
  'original-tulsi-kanthi-mala',
  'rudraksha-mala',
  'sacred-radhe-engraved-tulsi-mala',
  'sacred-rudraksha-japa-mala',
  'shiva-bracelet',
  'shri-radha-tulsi-mala-pendant',
  'sitaram-hanumanji-tulsi-necklace',
  'tulsi-bead-mala',
];

const PUBLIC_ROUTES = [
  '/sprays',
  '/rudraksha',
  '/tulsimala',
  '/rashi',
  '/accessories',
  '/purpose-products',
  '/about',
  '/blog',
  '/contact',
  '/terms-of-service',
  '/refund-cancellation',
  '/terms-and-conditions',
  '/shipping-policy',
  '/privacy-policy',
];

const BLOG_SLUGS = [
  '7-mukhi-rudraksha-blog',
  'amrat-bindu-blog',
  'gawri-ganga-blog',
];

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/+$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      cloudflare(),
      Sitemap({
        hostname: siteUrl,
        dynamicRoutes: [
          ...PUBLIC_ROUTES,
          ...BLOG_SLUGS.map((slug) => `/blog/${slug}`),
          ...PRODUCT_SLUGS.map((slug) => `/product/${slug}`),
        ],
        exclude: [
          '/auth',
          '/login',
          '/auth/callback',
          '/cart',
          '/wishlist',
          '/profile',
          '/order-success',
          '/order-failed',
        ],
        readable: true,
      }),
    ],
  }
})