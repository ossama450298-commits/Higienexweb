// Genera una página propia para cada producto: producto/<nombre>/index.html
//   node scripts/paginas-producto.mjs
// Cada página tiene su título, descripción, foto y precio (Open Graph y datos de producto
// para Google), así que al compartirla por WhatsApp sale la tarjeta con la foto. Al abrirla,
// lleva a la tienda con la ficha del producto abierta (?producte=…). También añade las
// páginas al sitemap.xml. Vuelve a ejecutarlo si cambian los productos o los precios.
import fs from 'node:fs';
import vm from 'node:vm';

const WEB = 'https://ossama450298-commits.github.io/Higienexweb/';
const src = fs.readFileSync('app-2.js', 'utf8');
const trozo = (nombre) => {
  const i = src.indexOf('var ' + nombre + ' = ');
  if (i < 0) throw new Error('No encuentro ' + nombre);
  let n = 0;
  for (let j = src.indexOf(nombre === 'PRODUCTS' ? '[' : '{', i); j < src.length; j++) {
    if ('[{'.includes(src[j])) n++;
    if (']}'.includes(src[j]) && --n === 0) return src.slice(i, j + 1) + ';';
  }
  throw new Error('No se cierra ' + nombre);
};
const ctx = {};
vm.runInNewContext(trozo('PRODUCTS') + trozo('HX_PRODUCT_DESC') + 'this.P=PRODUCTS;this.D=HX_PRODUCT_DESC;', ctx);

const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const eur = (n) => n.toFixed(2).replace('.', ',') + ' €';

const urls = [];
for (const p of ctx.P.filter((x) => x.active)) {
  const s = slug(p.name);
  const url = WEB + 'producto/' + s + '/';
  const img = WEB + 'img/prod-' + s + '.webp';
  const desc = ((ctx.D[p.name] || {}).es || '').replace(/\s+/g, ' ').trim();
  const corta = desc.length > 155 ? desc.slice(0, 152).replace(/\s+\S*$/, '') + '…' : desc;
  const tienda = '../../?producte=' + encodeURIComponent(p.name);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: img,
    description: desc,
    brand: { '@type': 'Brand', name: 'HIGIENEX' },
    offers: {
      '@type': 'Offer',
      price: p.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/' + (p.stock === 'order' ? 'PreOrder' : 'InStock'),
      url,
    },
  };
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} · ${eur(p.price)} / garrafa 5 L · HIGIENEX</title>
<meta name="description" content="${esc(corta)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="HIGIENEX">
<meta property="og:title" content="${esc(p.name)} · ${eur(p.price)} / garrafa 5 L">
<meta property="og:description" content="${esc(corta)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:alt" content="${esc(p.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta property="product:price:amount" content="${p.price.toFixed(2)}">
<meta property="product:price:currency" content="EUR">
<link rel="icon" href="../../icons/icon-web-192.png">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#F3F6F5;color:#0E2A3F;display:grid;place-items:center;min-height:100vh;padding:16px}
main{max-width:460px;background:#fff;border-radius:18px;padding:24px;box-shadow:0 8px 30px rgba(11,61,107,.12);text-align:center}
img{width:100%;max-width:260px;height:auto;border-radius:12px}
h1{font-size:24px;margin:16px 0 4px}p{line-height:1.55;color:#33424f}.precio{font-size:22px;font-weight:800;color:#0B3D6B}
a{display:inline-block;margin-top:12px;padding:12px 22px;border-radius:10px;background:#F2A900;color:#1A1A1A;font-weight:800;text-decoration:none}
</style>
</head>
<body>
<main>
<img src="../../img/prod-${s}.webp" alt="${esc(p.name)}" width="260" height="260">
<h1>${esc(p.name)}</h1>
<div class="precio">${eur(p.price)} <small>/ garrafa 5 L</small></div>
<p>${esc(desc)}</p>
<a href="${esc(tienda)}">Ver en la tienda HIGIENEX</a>
</main>
<script>location.replace(${JSON.stringify(tienda)});</script>
</body>
</html>
`;
  fs.mkdirSync('producto/' + s, { recursive: true });
  fs.writeFileSync('producto/' + s + '/index.html', html);
  urls.push(url);
  console.log('producto/' + s + '/');
}

// sitemap: se quitan las páginas de producto anteriores y se añaden las de ahora
let sm = fs.readFileSync('sitemap.xml', 'utf8').replace(/\s*<url>\s*<loc>[^<]*\/producto\/[^<]*<\/loc>[\s\S]*?<\/url>/g, '');
const hoy = new Date().toISOString().slice(0, 10);
const nuevas = urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u}</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  )
  .join('\n');
sm = sm.replace('</urlset>', nuevas + '\n</urlset>');
fs.writeFileSync('sitemap.xml', sm);
console.log('sitemap.xml: ' + urls.length + ' páginas de producto');
