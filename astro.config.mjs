import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [tailwind({ applyBaseStyles: false }), icon()],
  site: 'https://terracoreapp.co',
  devToolbar: { enabled: false },
});
