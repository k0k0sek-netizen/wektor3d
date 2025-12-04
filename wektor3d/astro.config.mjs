// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wektor3d.pl',

  image: {
    domains: ["images.unsplash.com", "images.ctfassets.net"],
    service: { entrypoint: 'astro/assets/services/sharp' }
  },

  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },

  integrations: [sitemap(), react()],
});