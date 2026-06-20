import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [tailwind({ applyBaseStyles: false }), icon(), sitemap()],
  site: 'https://terracoreapp.co',
  devToolbar: { enabled: false },
});
