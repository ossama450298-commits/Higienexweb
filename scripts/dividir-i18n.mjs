// Genera i18n/<idioma>.js a partir de i18n-dades.js (la font de totes les traduccions).
// Ús:  node scripts/dividir-i18n.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const arrel = new URL('..', import.meta.url).pathname;
const ctx = {};
runInNewContext(readFileSync(arrel + 'i18n-dades.js', 'utf8') + '\nthis.HX_I18N = HX_I18N;', ctx);
const dades = ctx.HX_I18N;
const idiomes = ['ca', 'es', 'en', 'fr', 'de', 'ar'];
mkdirSync(arrel + 'i18n', { recursive: true });
for (const l of idiomes) {
  const d = {};
  for (const [k, v] of Object.entries(dades)) if (v && typeof v[l] === 'string') d[k] = v[l];
  const js =
    `/* Generat per scripts/dividir-i18n.mjs a partir de i18n-dades.js — no l'editis a mà. */\n` +
    `(window.HX_I18N_PARTS = window.HX_I18N_PARTS || []).push(['${l}', ${JSON.stringify(d)}]);\n` +
    `if (window.hxI18nPart) window.hxI18nPart();\n`;
  writeFileSync(`${arrel}i18n/${l}.js`, js);
  console.log(`i18n/${l}.js  ${Object.keys(d).length} textos  ${(Buffer.byteLength(js) / 1024).toFixed(0)} KB`);
}
