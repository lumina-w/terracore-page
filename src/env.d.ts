/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_ID: string;
  readonly PUBLIC_SITE_URL: string;
  readonly MAIN_CTA_URL: string;
  readonly CONTACT_WHATSAPP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
