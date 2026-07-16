// Minimal static file server for the built `dist/` output.
//
// Why this exists: the E2E suite's Playwright `webServer` needs to serve the
// production build, but `astro preview` throws with the `@astrojs/netlify`
// adapter ("adapter does not support the preview command"). This server mirrors
// the pieces of `astro preview` the tests rely on for a `output: 'static' +
// trailingSlash: 'always'` site: directory URLs resolve to `index.html`, and
// unknown routes return `dist/404.html` with a real HTTP 404 status.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const HOST = process.env.HOST ?? 'localhost';
const PORT = Number(process.env.PORT ?? 4321);

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

const contentType = (file) => MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';

// Resolve a request pathname to an absolute file path inside DIST, or null if
// it would escape the directory (path traversal guard).
function resolveFile(pathname) {
  let rel = decodeURIComponent(pathname.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  else if (!extname(rel)) rel += '/index.html';
  const abs = normalize(join(DIST, rel));
  if (abs !== DIST && !abs.startsWith(DIST + sep)) return null;
  return abs;
}

async function send404(res) {
  try {
    const body = await readFile(join(DIST, '404.html'));
    res.writeHead(404, { 'Content-Type': MIME['.html'] });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': MIME['.txt'] });
    res.end('404 Not Found');
  }
}

const server = createServer(async (req, res) => {
  const file = resolveFile(req.url ?? '/');
  if (!file) {
    await send404(res);
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': contentType(file) });
    res.end(body);
  } catch {
    await send404(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Serving dist/ at http://${HOST}:${PORT}/`);
});
