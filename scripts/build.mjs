import { execSync } from 'node:child_process';
import { rmSync, mkdirSync, cpSync, readFileSync, writeFileSync } from 'node:fs';

const SITE_URL = (process.env.SITE_URL || 'https://site-fourrure.vercel.app').replace(/\/$/, '');
const FAQ = JSON.parse(readFileSync('src/data/faq.json', 'utf8'));
const FAQ_SETS = {
  home: ['etat', 'gratuit', 'types', 'france', 'form', 'conf'],
  luxe: ['griffe', 'types', 'prix', 'gratuit', 'etat', 'conf'],
  occasion: ['etat', 'ancien', 'types', 'prix', 'gratuit', 'form'],
  contact: ['gratuit', 'form', 'conf', 'france'],
};
const PAGES = { 'index.html': '/', 'fourrure-luxe.html': '/fourrure-luxe', 'fourrure-occasion.html': '/fourrure-occasion', 'contact.html': '/contact' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const partial = (n) => readFileSync(`src/partials/${n}.html`, 'utf8');

function faqBlock(set) {
  const items = FAQ_SETS[set].map((k) => FAQ[k]);
  const html = items.map((f) => `    <details class="group reveal"><summary class="flex cursor-pointer items-center justify-between gap-6 py-7 font-display text-2xl md:text-3xl">${esc(f.q).replace(/ \?/g, '&nbsp;?')}<span class="plus text-3xl text-gold-400 transition-transform duration-500" aria-hidden="true">+</span></summary><div class="faq-panel"><div><p class="pb-7 text-bone/60">${esc(f.a)}</p></div></div></details>`).join('\n');
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return `<div class="divide-y divide-gold-400/20 border-y border-gold-400/20">\n${html}\n  </div>\n  <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets', { recursive: true });
cpSync('src/img', 'dist/assets/img', { recursive: true });
cpSync('src/app.js', 'dist/assets/app.js');
cpSync('src/favicon.svg', 'dist/favicon.svg');

for (const [file, path] of Object.entries({ ...PAGES, '404.html': '/404' })) {
  let html = readFileSync(`src/${file}`, 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'Maison Peltra';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  html = html.replace(/<!--@include (\w+)-->/g, (_, n) => partial(n));
  html = html.replace(/<!--@faq (\w+)-->/g, (_, s) => faqBlock(s));
  html = html.replaceAll('%TITLE%', title).replaceAll('%DESC%', desc).replaceAll('%PATH%', path === '/' ? '/' : path).replaceAll('%SITE_URL%', SITE_URL);
  if (path === '/404') html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '').replace('index, follow', 'noindex');
  writeFileSync(`dist/${file}`, html);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.values(PAGES).map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
execSync('npx tailwindcss -c tailwind.config.js -i src/input.css -o dist/assets/style.css --minify', { stdio: 'inherit' });
