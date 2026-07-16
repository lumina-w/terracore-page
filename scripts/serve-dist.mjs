// Minimal zero-dependency static file server for the built `dist/` output.
//
// Why this exists: the app builds with `output: 'static'` but keeps the
// `@astrojs/netlify` adapter (see CLAUDE.md), and `astro preview` refuses to
// run under that adapter. This server fills the gap so `pnpm run preview` and
// the Playwright E2E `webServer` can serve the static build locally.
//
// It mirrors the site's `trailingSlash: 'always'` routing: a request for
// `/terminos/` resolves to `dist/terminos/index.html`, and unknown routes are
// answered with `dist/404.html` and a real 404 status.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = Number(process.env.PORT) || 4321;
const HOST = process.env.HOST || 'localhost';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

const contentType = (path) => MIME[extname(path).toLowerCase()] || 'application/octet-stream';

async function tryFile(path) {
  try {
    const info = await stat(path);
    if (info.isFile()) return path;
  } catch {
    /* not a file */
  }
  return null;
}

// Resolve a request path to a file inside dist, following the site's routing.
async function resolvePath(pathname) {
  // Keep the resolved path inside DIST (block `..` traversal).
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const abs = join(DIST, safe);
  if (!abs.startsWith(DIST)) return null;

  if (pathname.endsWith('/')) return tryFile(join(abs, 'index.html'));
  return (await tryFile(abs)) || (await tryFile(`${abs}.html`)) || tryFile(join(abs, 'index.html'));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const file = await resolvePath(url.pathname);

  if (file) {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': contentType(file) });
    res.end(req.method === 'HEAD' ? undefined : body);
    return;
  }

  const notFound = await tryFile(join(DIST, '404.html'));
  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
  res.end(notFound && req.method !== 'HEAD' ? await readFile(notFound) : 'Not Found');
});

server.listen(PORT, HOST, () => {
  console.log(`Serving dist/ at http://${HOST}:${PORT}/`);
});
