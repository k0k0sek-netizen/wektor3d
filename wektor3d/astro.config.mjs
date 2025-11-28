// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wektor3d.pl',

  image: {
    domains: ["images.unsplash.com"],
    service: { entrypoint: 'astro/assets/services/sharp' }
  },

  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },

  integrations: [sitemap()],
});