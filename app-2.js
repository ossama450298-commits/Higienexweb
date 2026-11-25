/* HIGIENEX — codi de la web (abans dins d'index.html) */
// HIGIENEX Auth, Login, Cart, Admin

document.addEventListener('DOMContentLoaded', function() {
  var ef = document.getElementById('loginEmail');
  var pf = document.getElementById('loginPassword');
  if (ef) ef.addEventListener('keydown', function(e) { if(e.key==='Enter'){e.preventDefault();if(pf)pf.focus();} });
  if (pf) pf.addEventListener('keydown', function(e) { if(e.key==='Enter'){e.preventDefault();loginWithEmail();} });
  function clearLoginErrorOnEdit() {
    var errBox=document.getElementById('loginError'); if(errBox) errBox.style.display='none';
    if(ef) ef.style.borderColor='#E0E0E0';
    if(pf) pf.style.borderColor='#E0E0E0';
  }
  if (ef) ef.addEventListener('input', clearLoginErrorOnEdit);
  if (pf) pf.addEventListener('input', clearLoginErrorOnEdit);
  if (typeof renderCart === 'function') renderCart();
});

// ── POPUP DE SUBSCRIPCIÓ A LA NEWSLETTER (als 30 segons) ──
var HX_NEWSLETTER_KEY = 'hx_newsletter_status'; // 'subscribed' | timestamp de l'últim tancament
function hxMarkNewsletterSubscribed() {
  try { localStorage.setItem(HX_NEWSLETTER_KEY, 'subscribed'); } catch(e){}
  closeNewsletterPopup();
}
function closeNewsletterPopup() {
  var p = document.getElementById('newsletterPopup');
  if (p) p.classList.remove('open');
  try {
    if (localStorage.getItem(HX_NEWSLETTER_KEY) !== 'subscribed') {
      localStorage.setItem(HX_NEWSLETTER_KEY, String(Date.now()));
    }
  } catch(e){}
}
window.closeNewsletterPopup = closeNewsletterPopup;

function submitNewsletterPopup(e) {
  e.preventDefault();
  var honeypot = document.getElementById('nlWebsite');
  if (honeypot && honeypot.value) { return false; }
  var input = document.getElementById('newsletterPopupEmail');
  var email = input ? input.value.trim() : '';
  if (!email) return;
  try {
    enviarNotificacioEmail({
      title: 'Nova subscripció a la newsletter — HIGIENEX',
      name: email,
      email: email,
      badge: 'NOVA SUBSCRIPCIÓ',
      subtitle: 'Algú s\'ha subscrit a la newsletter des del pop-up.',
      detailLabel: 'Subscriptor',
      message: 'Email: ' + email,
      data: { event: 'newsletter', contact: { email: email } }
    });
  } catch(err) { console.warn('No s\'ha pogut registrar la subscripció:', err); }
  var s = document.getElementById('newsletterPopupSuccess');
  var f = e.target;
  if (s) s.style.display = 'block';
  if (f) f.style.display = 'none';
  setTimeout(hxMarkNewsletterSubscribed, 1400);
}
window.submitNewsletterPopup = submitNewsletterPopup;

// ── POPUP DE MOSTRA GRATUÏTA ──────────────────────────────
function openSamplePopup() {
  var p = document.getElementById('samplePopup');
  if (p) p.classList.add('open');
}
window.openSamplePopup = openSamplePopup;
function closeSamplePopup() {
  var p = document.getElementById('samplePopup');
  if (p) p.classList.remove('open');
}
window.closeSamplePopup = closeSamplePopup;
function submitSamplePopup(e) {
  e.preventDefault();
  var honeypotSam = document.getElementById('samWebsite');
  if (honeypotSam && honeypotSam.value) { return false; }
  var nom = document.getElementById('samNom').value.trim();
  var email = document.getElementById('samEmail').value.trim();
  var empresa = document.getElementById('samEmpresa').value.trim();
  var producte = document.getElementById('samProducte').value;
  if (!nom || !email) return;
  try {
    enviarNotificacioEmail({
      title: 'Sol·licitud de mostra gratuïta: ' + producte,
      name: nom,
      email: email,
      badge: 'MOSTRA GRATUÏTA',
      subtitle: 'Algú ha sol·licitat una mostra gratuïta des de la web.',
      detailLabel: 'Sol·licitud',
      message: 'Nom: ' + escHtml(nom) + '<br>Email: ' + escHtml(email) + (empresa ? ('<br>Empresa: ' + escHtml(empresa)) : '') + '<br>Producte: ' + escHtml(producte),
      ctaButtonHtml: hxEmailCtaButton('Respondre al client →', 'mailto:' + email, 'gold'),
      data: { event: 'mostra', contact: { name: nom, email: email, company: empresa }, fields: [['Producte', producte]] }
    });
  } catch(err) { console.warn('No s\'ha pogut enviar la sol·licitud de mostra:', err); }
  var s = document.getElementById('samplePopupSuccess');
  var f = e.target;
  if (s) s.style.display = 'block';
  if (f) f.style.display = 'none';
  setTimeout(closeSamplePopup, 2200);
}
window.submitSamplePopup = submitSamplePopup;

function hxMaybeShowNewsletterPopup() {
  var DAYS_ABANS_DE_TORNAR_A_PREGUNTAR = 7;
  try {
    // No mostrar si l'usuari ha iniciat sessió com a client o com a empleat/admin
    if (typeof CP_LOGGED_IN !== 'undefined' && CP_LOGGED_IN) return;
    var adminPanelEl = document.getElementById('adminPanel');
    if (adminPanelEl && adminPanelEl.classList.contains('open')) return;
    var clientAppEl = document.getElementById('hxClientApp');
    if (clientAppEl && clientAppEl.style.display === 'block') return;
    var status = localStorage.getItem(HX_NEWSLETTER_KEY);
    if (status === 'subscribed') return;
    if (status) {
      var elapsedDays = (Date.now() - parseInt(status, 10)) / 86400000;
      if (elapsedDays < DAYS_ABANS_DE_TORNAR_A_PREGUNTAR) return;
    }
    // No mostrar si ja hi ha un altre popup obert (auth, producte...)
    var authOpen = document.getElementById('authModal');
    var prodOpen = document.getElementById('productPopup');
    if ((authOpen && authOpen.classList.contains('open')) ||
        (prodOpen && prodOpen.classList.contains('open'))) return;
    var p = document.getElementById('newsletterPopup');
    if (p && !p.classList.contains('open')) p.classList.add('open');
  } catch(e){}
}
window.hxMaybeShowNewsletterPopup = hxMaybeShowNewsletterPopup;

function hxFilterNewsletter(cat, btnEl) {
  var cards = document.querySelectorAll('#nlGrid .blog-card, .nl-featured');
  cards.forEach(function(c) {
    var show = (cat === 'tots') || (c.getAttribute('data-cat') === cat);
    c.style.display = show ? '' : 'none';
  });
  var btns = document.querySelectorAll('.nl-filter-btn');
  btns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  if (btnEl) { btnEl.classList.add('active'); btnEl.setAttribute('aria-pressed', 'true'); }
}
window.hxFilterNewsletter = hxFilterNewsletter;

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(hxMaybeShowNewsletterPopup, 30000);
});

var _authModalOpenedAt = 0;
function openAuthModal() {
  var m=document.getElementById('authModal'); if(m) m.classList.add('open');
  _authModalOpenedAt = Date.now();
  var errBox=document.getElementById('loginError'); if(errBox) errBox.style.display='none';
  var em=document.getElementById('loginEmail'), pw=document.getElementById('loginPassword');
  if(em) em.style.borderColor='#E0E0E0';
  if(pw) pw.style.borderColor='#E0E0E0';
}
window.openAuthModal = openAuthModal;
function closeAuthModal() { var m=document.getElementById('authModal'); if(m) m.classList.remove('open'); }
window.closeAuthModal = closeAuthModal;

function switchTab(tab) {
  var isLogin = (tab==='login');
  var pL=document.getElementById('panelLogin'), pR=document.getElementById('panelRegister');
  var tL=document.getElementById('tabLogin'),   tR=document.getElementById('tabRegister');
  if(pL) pL.style.display = isLogin ? 'block' : 'none';
  if(pR) pR.style.display = isLogin ? 'none'  : 'block';
  if(tL){tL.style.background=isLogin?'#0B3D6B':'white'; tL.style.color=isLogin?'white':'#666';}
  if(tR){tR.style.background=isLogin?'white':'#0B3D6B'; tR.style.color=isLogin?'#666':'white';}
}
window.switchTab = switchTab;

function loginWithApple()  { alert('Apple login estara disponible al servidor.'); }
function loginWithGoogle() { alert('Google login estara disponible al servidor.'); }
window.loginWithApple  = loginWithApple;
window.loginWithGoogle = loginWithGoogle;

function hxLoadRegisteredUsers() {
  // Antes los registros se guardaban aquí con la contraseña en claro: se borran.
  try { localStorage.removeItem('hx_registered_users'); } catch(e) {}
  return {};
}
function hxSaveRegisteredUsers() { /* los usuarios se guardan en el servidor */ }
window.hxSaveRegisteredUsers = hxSaveRegisteredUsers;
var REGISTERED_USERS = hxLoadRegisteredUsers();

// Los usuarios viven en la base de datos (Cloudflare D1). USERS y REGISTERED_USERS
// solo se rellenan en memoria cuando un administrador abre su panel.
var USERS = {};
var HX_API_BASE = 'https://higienexweb2.ossama450298.workers.dev/api';

// Estadístiques anònimes per al panell «En directe» del Centre de control:
// quina pàgina s'obre i com respon la Mònica. No s'envien dades personals, ni
// cookies, ni el text que escriu el visitant. Si el navegador té activat
// «No rastrejar» no s'envia res.
function hxStat(dades){
  try {
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
    // Solo si el visitante ha aceptado las cookies analíticas
    var pr = null; try { pr = JSON.parse(localStorage.getItem('hx_cookie_prefs') || 'null'); } catch (e2) { pr = null; }
    if (!pr || !pr.analytics) return;
    fetch(HX_API_BASE + '/stat', { method: 'POST', body: JSON.stringify(dades), keepalive: true,
      headers: { 'Content-Type': 'text/plain' }, mode: 'cors', credentials: 'omit' }).catch(function(){});
  } catch (e) {}
}
function hxApiToken(){ try { return localStorage.getItem('hx_api_token') || ''; } catch(e) { return ''; } }
function hxSetApiToken(t){ try { if (t) localStorage.setItem('hx_api_token', t); else localStorage.removeItem('hx_api_token'); } catch(e) {} }
async function hxApi(path, opts) {
  opts = opts || {};
  var headers = { 'Content-Type': 'application/json' };
  var tok = hxApiToken(); if (tok) headers.Authorization = 'Bearer ' + tok;
  var r = await fetch(HX_API_BASE + path, { method: opts.method || 'GET', headers: headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined });
  var d = {}; try { d = await r.json(); } catch(e) {}
  if (!r.ok) { var err = new Error(d.error || ('Error ' + r.status)); err.status = r.status; throw err; }
  return d;
}
window.hxApi = hxApi;
// Carga la lista de usuarios para el panel de administración.
async function hxLoadAdminUsers() {
  var d = await hxApi('/admin/users');
  USERS = {}; REGISTERED_USERS = {};
  (d.users || []).forEach(function(u){
    var rec = { name: u.name, role: u.role, company: u.company, cif: u.cif, sector: u.sector };
    if (u.role === 'admin') USERS[u.email] = rec; else REGISTERED_USERS[u.email] = rec;
  });
}
window.hxLoadAdminUsers = hxLoadAdminUsers;
async function hxRefreshAdminPanel() {
  try { await hxLoadAdminUsers(); } catch(e) { showToast('No s\'han pogut carregar els usuaris: ' + e.message, '⚠️'); return; }
  renderAdminUsers(); if (typeof updateSaStats === 'function') updateSaStats();
  var su = document.getElementById('statUsers'); if (su) su.textContent = Object.keys(USERS).length + Object.keys(REGISTERED_USERS).length;
}
var PRODUCTS = [
  { id:1, name:'ECO Concentrat Pro',       price:12.50, unit:'garrafes 5L', active:true, stock:'in' },
  { id:2, name:'Desinfectant HOSP-V',      price:18.00, unit:'garrafes 5L', active:true, stock:'in' },
  { id:3, name:'Detergent ALIM-PRO',       price:9.80,  unit:'garrafes 5L', active:true, stock:'in' },
  { id:4, name:'Net HOSTAL Premium',       price:11.20, unit:'garrafes 5L', active:true, stock:'low' },
  { id:5, name:'Gamma Superfícies QR', price:14.00, unit:'garrafes 5L', active:true, stock:'low' },
  { id:6, name:'WorkSafe Antimicrobial',   price:22.00, unit:'garrafes 5L', active:true, stock:'order' }
];
var STOCK_INFO = {
  in:    { label:'✅ Disponible',        color:'#2E7D32', bg:'#E8F5E9' },
  low:   { label:'⚠️ Últimes unitats',   color:'#B8860B', bg:'#FFF6E0' },
  order: { label:'📦 Sota comanda',      color:'#0B3D6B', bg:'#E7EEF6' }
};

// ═══════════════════════════════════════════════════════════
// CHATBOT HIGIENEX — motor de respostes per paraules clau
// (sense servidor: funciona 100% al navegador, sense cap cost)
// ═══════════════════════════════════════════════════════════
var HX_CHAT_OPENED = false;
var HX_CHAT_HISTORY = [];
var HX_CHAT_FALLBACK_STREAK = 0;
var HX_CHAT_STORAGE_KEY = 'hx_chat_history_v1';
var HX_CHAT_MAX_HISTORY = 40;
var HX_LAST_LANG = null; // últim idioma detectat en aquesta conversa

// ── Detecció de l'idioma del missatge de l'usuari ──
function hxDetectLang(text){
  if (!text) return cpLang();
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  var markers = {
    ca: ['hola','bon dia','bona tarda','adéu','adeu','gràcies','si us plau','què','com','quan','on','quant','quants','quina','quins','aquest','aquesta','vosaltres','teniu','voleu','envieu','és','però','també','amb','molt','ràpid','aquí','producte','productes','preu','preus','comanda','comandes','contacte','horari','sóc','necessito','vull','puc','català','vostre','vostra'],
    es: ['hola','buenos días','buenas tardes','adiós','gracias','por favor','qué','cómo','cuándo','dónde','cuánto','cuántos','cuál','cuáles','este','esta','ustedes','vosotros','tienen','quieren','envían','es','son','están','pero','también','con','muy','rápido','aquí','producto','productos','precio','precios','pedido','pedidos','contacto','horario','soy','necesito','quiero','puedo','castellano','español','su','sus','vuestro','vuestra'],
    en: ['hello','hi','hey','good morning','good afternoon','thanks','thank you','please','what','how','when','where','which','this','that','you','do','have','is','are','but','also','with','very','fast','here','product','products','price','prices','order','orders','contact','hours','bye','goodbye','am','need','want','can','the','your','our'],
    fr: ['bonjour','salut','bonsoir','au revoir','merci',"s'il vous plaît",'quoi','comment','quand','où','combien','quel','quelle','quels','quelles','ce','cette','vous','vos','avez','voulez','livrez','est','sont','êtes','mais','aussi','avec','très','rapide','ici','produit','produits','prix','commande','commandes','contact','horaire','horaires','suis','besoin','veux','peux','français','notre','nos','votre'],
    de: ['hallo','guten tag','guten morgen','tschüss','danke','bitte','was','wie','wann','wo','wieviel','welche','welcher','dieser','diese','sie','ihre','ihr','haben','sind','wollen','versenden','ist','aber','auch','mit','sehr','schnell','hier','produkt','produkte','preis','bestellung','bestellungen','kontakt','öffnungszeiten','bin','brauche','möchte','kann','deutsch','unser','unsere'],
  };
  var norm = ' ' + text.toLowerCase().replace(/[¿¡?!.,;:]/g,' ').replace(/\s+/g,' ') + ' ';
  var scores = {ca:0, es:0, en:0, fr:0, de:0};
  Object.keys(markers).forEach(function(lang){
    markers[lang].forEach(function(w){
      if (norm.indexOf(' ' + w + ' ') !== -1) scores[lang]++;
    });
  });
  var best = null, bestScore = 0, tie = false;
  Object.keys(scores).forEach(function(lang){
    if (scores[lang] > bestScore) { bestScore = scores[lang]; best = lang; tie = false; }
    else if (scores[lang] === bestScore && scores[lang] > 0 && lang !== best) { tie = true; }
  });
  if (!best || bestScore === 0 || tie) return cpLang();
  return best;
}
window.hxDetectLang = hxDetectLang;

function hxTopicAnswer(topicId, lang){
  var t = (typeof HX_TOPIC_ANSWERS !== 'undefined') ? HX_TOPIC_ANSWERS[topicId] : null;
  if (!t) return null;
  return t.a[lang] || t.a['ca'] || '';
}
function hxTopicAction(topicId, lang){
  var t = (typeof HX_TOPIC_ANSWERS !== 'undefined') ? HX_TOPIC_ANSWERS[topicId] : null;
  if (!t || !t.action) return null;
  return { label: t.action.label[lang] || t.action.label['ca'], fn: t.action.fn };
}
function hxUiStr(key, lang, vars){
  var d = (typeof HX_UI !== 'undefined') ? HX_UI[key] : null;
  if (!d) return '';
  var s = d[lang] || d['ca'] || '';
  if (vars) Object.keys(vars).forEach(function(k){ s = s.replace('{'+k+'}', vars[k]); });
  return s;
}

function hxNormalize(s){
  return (s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g,' ')
    .trim();
}

// Temes que, en comptes de mostrar tot el catàleg/preus, cedeixen el pas a
// la fitxa d'un producte concret si l'usuari n'ha esmentat un pel nom.
var HX_GENERIC_CATALOG_TOPICS = {productes_catalog:true, preus_generals:true};
// Temes que només s'han d'activar en missatges curts (saludes/agraïments),
// perquè no segrestin preguntes més llargues que simplement comencen així.
var HX_SHORT_ONLY_TOPICS = {hola:true, gracies:true};

function hxFindTopic(userText){
  var norm = hxNormalize(userText);
  var words = norm.split(/\s+/).filter(Boolean);
  if (HX_SHORT_ONLY_TOPICS && words.length <= 3) {
    for (var sid in HX_SHORT_ONLY_TOPICS) {
      if (hxTopicKeyMatch(sid, norm, words)) return sid;
    }
  }
  var ids = Object.keys(HX_TOPIC_KEYS);
  for (var i=0; i<ids.length; i++) {
    var tid = ids[i];
    if (HX_SHORT_ONLY_TOPICS[tid]) continue; // ja comprovats a dalt si calia
    if (hxTopicKeyMatch(tid, norm, words)) return tid;
  }
  return null;
}
function hxTopicKeyMatch(topicId, norm, words){
  var keys = HX_TOPIC_KEYS[topicId] || [];
  for (var j=0; j<keys.length; j++) {
    var keyNorm = hxNormalize(keys[j]);
    if (!keyNorm) continue;
    if (keyNorm.indexOf(' ') !== -1) {
      if ((' ' + norm + ' ').indexOf(' ' + keyNorm.split(' ').join(' ') + ' ') !== -1 || norm.indexOf(keyNorm) !== -1) return true;
    } else {
      if (words.indexOf(keyNorm) !== -1) return true;
    }
  }
  return false;
}

// ── Reconeixement d'un producte concret esmentat pel nom ──
function hxFindProduct(userText){
  var norm = hxNormalize(userText);
  var words = norm.split(/\s+/).filter(Boolean);
  var best = null, bestScore = 0;
  PRODUCTS.forEach(function(p){
    var nameWords = hxNormalize(p.name).split(/\s+/).filter(function(w){ return w.length > 2; });
    var score = 0;
    nameWords.forEach(function(w){ if (words.indexOf(w) !== -1) score++; });
    if (score > bestScore && score >= Math.ceil(nameWords.length/2)) { bestScore = score; best = p; }
  });
  return best;
}

function hxRenderProductCard(p){
  var body = document.getElementById('hxChatBody');
  if (!body) return;
  var info = STOCK_INFO[p.stock] || {};
  var lang = HX_LAST_LANG || cpLang();
  var wrap = document.createElement('div');
  wrap.className = 'hxMsg bot';
  wrap.innerHTML = '<div class="hxProductCard">' +
    '<div class="hxPName">' + p.name + '</div>' +
    '<div class="hxPMeta">' + p.price.toFixed(2).replace('.',',') + ' € / ' + p.unit + ' · ' + (info.label || '') + '</div>' +
    '<button type="button" class="hxPBtn" onclick="hxAddProductFromChat(' + p.id + ')">' + hxUiStr('add_to_cart_btn', lang) + '</button>' +
    '</div>';
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
}

function hxAddProductFromChat(productId){
  var p = PRODUCTS.filter(function(x){ return x.id === productId; })[0];
  if (!p) return;
  var lang = HX_LAST_LANG || cpLang();
  try {
    cpAddDirectToCart(p.name + ' ' + p.unit.replace('garrafes ',''), p.price, 1);
    openCartDrawer();
    hxAddMessage(hxUiStr('product_added', lang, {name: p.name}), 'bot');
  } catch(e) {
    hxAddMessage(hxUiStr('product_add_error', lang), 'bot');
  }
}
window.hxAddProductFromChat = hxAddProductFromChat;

function hxRenderMessageDOM(text, who){
  var body = document.getElementById('hxChatBody');
  if (!body) return;
  var div = document.createElement('div');
  div.className = 'hxMsg ' + who;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function hxSaveHistory(){
  try {
    var trimmed = HX_CHAT_HISTORY.slice(-HX_CHAT_MAX_HISTORY);
    localStorage.setItem(HX_CHAT_STORAGE_KEY, JSON.stringify(trimmed));
  } catch(e) {}
}

function hxAddMessage(text, who){
  hxRenderMessageDOM(text, who);
  if (who === 'bot') hxParlar(text);
  HX_CHAT_HISTORY.push({who: who, text: text});
  if (HX_CHAT_HISTORY.length > HX_CHAT_MAX_HISTORY) HX_CHAT_HISTORY = HX_CHAT_HISTORY.slice(-HX_CHAT_MAX_HISTORY);
  hxSaveHistory();
}

// ── MÒNICA AMB VEU ─────────────────────────────────────────
// Micròfon: dictar la pregunta (reconeixement de veu del navegador).
// Altaveu: la Mònica llegeix les respostes en veu alta (síntesi del navegador).
// Tot passa dins del navegador: la veu no s'envia a cap servidor d'HIGIENEX.
var HX_VEU_IDIOMA = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-SA' };
var HX_VEU_ACTIVA = false, HX_RECONEIXEMENT = null;
function hxIdiomaVeu(){ var l = HX_LAST_LANG || cpLang(); return HX_VEU_IDIOMA[l] || 'ca-ES'; }
function hxTextPerLlegir(text){
  return String(text || '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[•*_#>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function hxParlar(text){
  if (!HX_VEU_ACTIVA || !('speechSynthesis' in window)) return;
  var frase = hxTextPerLlegir(text);
  if (!frase) return;
  var u = new SpeechSynthesisUtterance(frase), idioma = hxIdiomaVeu();
  u.lang = idioma;
  var veus = window.speechSynthesis.getVoices() || [];
  var veu = veus.find(function(v){ return v.lang === idioma; }) || veus.find(function(v){ return v.lang && v.lang.slice(0, 2) === idioma.slice(0, 2); });
  if (veu) u.voice = veu;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
function hxActualitzarBotoVeu(){
  var b = document.getElementById('hxChatVeu'); if (!b) return;
  var lang = HX_LAST_LANG || cpLang();
  b.setAttribute('aria-pressed', HX_VEU_ACTIVA ? 'true' : 'false');
  b.textContent = HX_VEU_ACTIVA ? '🔊' : '🔈';
  var etiqueta = hxUiStr(HX_VEU_ACTIVA ? 'veu_off' : 'veu_on', lang) || 'Veu';
  b.setAttribute('aria-label', etiqueta); b.title = etiqueta;
  var m = document.getElementById('hxChatMic');
  if (m) { var em = hxUiStr('mic', lang) || 'Parlar'; m.setAttribute('aria-label', em); m.title = em; }
}
function hxCanviarVeu(forcar){
  HX_VEU_ACTIVA = (typeof forcar === "boolean") ? forcar : !HX_VEU_ACTIVA;
  try { localStorage.setItem('hx_chat_veu', HX_VEU_ACTIVA ? '1' : '0'); } catch (e) {}
  if (!HX_VEU_ACTIVA && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  hxActualitzarBotoVeu();
}
window.hxCanviarVeu = hxCanviarVeu;
function hxMicro(){
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  var input = document.getElementById('hxChatInput'), boto = document.getElementById('hxChatMic');
  if (!Rec || !input) return;
  if (HX_RECONEIXEMENT) { HX_RECONEIXEMENT.stop(); return; }
  var lang = HX_LAST_LANG || cpLang();
  var rec = new Rec();
  rec.lang = hxIdiomaVeu(); rec.interimResults = true; rec.maxAlternatives = 1;
  var placeholder = input.placeholder, final = '';
  rec.onstart = function(){ HX_RECONEIXEMENT = rec; boto.classList.add('escoltant'); input.value = ''; input.placeholder = hxUiStr('mic_escolto', lang); };
  rec.onresult = function(ev){
    var parcial = '';
    for (var i = ev.resultIndex; i < ev.results.length; i++) {
      if (ev.results[i].isFinal) final += ev.results[i][0].transcript; else parcial += ev.results[i][0].transcript;
    }
    input.value = (final + parcial).trim();
  };
  rec.onerror = function(ev){
    if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') showToast(hxUiStr('mic_denegat', lang), '🎤');
    else if (ev.error === 'no-speech') showToast(hxUiStr('mic_res', lang), '🎤');
  };
  rec.onend = function(){
    HX_RECONEIXEMENT = null; boto.classList.remove('escoltant'); input.placeholder = placeholder;
    if (input.value.trim()) {
      if (!HX_VEU_ACTIVA) hxCanviarVeu(true);   // si li parles, et contesta parlant
      hxChatSend();
    }
  };
  try { rec.start(); } catch (e) { HX_RECONEIXEMENT = null; }
}
window.hxMicro = hxMicro;
// Els botons només apareixen si el navegador ho permet.
document.addEventListener('DOMContentLoaded', function(){
  try { HX_VEU_ACTIVA = localStorage.getItem('hx_chat_veu') === '1'; } catch (e) {}
  if ('speechSynthesis' in window) { var v = document.getElementById('hxChatVeu'); if (v) v.hidden = false; window.speechSynthesis.getVoices(); }
  if (window.SpeechRecognition || window.webkitSpeechRecognition) { var m = document.getElementById('hxChatMic'); if (m) m.hidden = false; }
  hxActualitzarBotoVeu();
});

function hxRestoreHistory(){
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(HX_CHAT_STORAGE_KEY) || 'null'); } catch(e) {}
  if (!saved || !saved.length) return false;
  HX_CHAT_HISTORY = saved;
  saved.forEach(function(m){ hxRenderMessageDOM(m.text, m.who); });
  return true;
}

// Accions dels botons de la Mònica. Abans s'executava el text amb new Function() (eval);
// ara només s'accepten aquestes tres formes, sense eval (política CSP sense 'unsafe-eval').
function hxRunAction(fn){
  var m = /^navTo\('([a-z0-9-]+)'\)$/.exec(fn || '');
  if (m) return navTo(m[1]);
  if (fn === 'openCartDrawer()') return openCartDrawer();
  m = /^window\.open\('(https:\/\/wa\.me\/[^']+)','_blank'\)$/.exec(fn || '');
  if (m) return window.open(m[1], '_blank', 'noopener');
  console.warn('Acció de la Mònica desconeguda:', fn);
}
function hxAddAction(action){
  var body = document.getElementById('hxChatBody');
  if (!body || !action) return;
  var btn = document.createElement('button');
  btn.className = 'hxQuickBtn';
  btn.style.alignSelf = 'flex-start';
  btn.textContent = action.label;
  btn.onclick = function(){ hxRunAction(action.fn); };
  body.appendChild(btn);
  body.scrollTop = body.scrollHeight;
}

function hxAddEscalation(lang){
  var body = document.getElementById('hxChatBody');
  if (!body) return;
  var div = document.createElement('div');
  div.className = 'hxEscalate';
  div.innerHTML = hxUiStr('escalation', lang);
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function hxShowTyping(){
  var body = document.getElementById('hxChatBody');
  if (!body) return;
  var div = document.createElement('div');
  div.className = 'hxTyping';
  div.id = 'hxTypingIndicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}
function hxHideTyping(){
  var t = document.getElementById('hxTypingIndicator');
  if (t) t.remove();
}

// Resposta de reserva quan ni les preguntes freqüents ni la IA (monica-ia.js, /api/chat del
// Worker higienexweb2) tenen resposta. L'antic servidor «higienexchat» ja no s'utilitza.
function hxAskAI(userText, lang){
  hxHideTyping();
  hxStat({ k: 'c', s: 'reserva', l: lang });
  hxAddMessage(hxUiStr('fallback', lang), 'bot');
  HX_CHAT_FALLBACK_STREAK++;
  if (HX_CHAT_FALLBACK_STREAK >= 2) { hxAddEscalation(lang); HX_CHAT_FALLBACK_STREAK = 0; }
  hxRenderQuickReplies(lang);
}

// ── Corpus ampli de preguntes freqüents (monica-faq-data.js), multiidioma ──
// El corpus (1,6 MB) ja no es descarrega amb la portada: es carrega quan
// s'obre el xat o quan cal per respondre una pregunta.
var HX_FAQ_PROMESA = null;
function hxCarregarFaq(){
  if (typeof HX_FAQ_DATA !== 'undefined') return Promise.resolve();
  if (!HX_FAQ_PROMESA) {
    HX_FAQ_PROMESA = new Promise(function(resolve){
      var s = document.createElement('script');
      s.src = 'monica-faq-data.js?v=20261123c';
      s.onload = function(){ resolve(); };
      s.onerror = function(){ HX_FAQ_PROMESA = null; resolve(); };   // sense FAQ, la IA respon igualment
      document.head.appendChild(s);
    });
  }
  // Com a màxim 5 s d'espera (connexions molt lentes): després es continua sense FAQ.
  return Promise.race([HX_FAQ_PROMESA, new Promise(function(r){ setTimeout(r, 5000); })]);
}
var HX_FAQ_PREPARED = false;
function hxPrepareFaqData(){
  if (HX_FAQ_PREPARED || typeof HX_FAQ_DATA === 'undefined') return;
  HX_FAQ_DATA.forEach(function(e){ e._w = hxNormalize(e.q).split(/\s+/).filter(Boolean); });
  HX_FAQ_PREPARED = true;
}
function hxFindFaqMatch(userText, lang){
  if (typeof HX_FAQ_DATA === 'undefined') return null;
  // El corpus ampliat només està en català. Per a qualsevol altre idioma
  // (castellà inclòs) no val la pena arriscar-se a barrejar idiomes dins
  // la mateixa resposta: millor passar directament a la IA (nivell 3),
  // que sí que respon sempre en l'idioma detectat.
  if (lang !== 'ca') return null;
  hxPrepareFaqData();
  var norm = hxNormalize(userText);
  var userWords = norm.split(/\s+/).filter(function(w){ return w.length > 1; });
  if (!userWords.length) return null;
  var userSet = {};
  userWords.forEach(function(w){ userSet[w] = true; });
  var best = null, bestScore = 0;
  var bestAny = null, bestAnyScore = 0;
  for (var i=0; i<HX_FAQ_DATA.length; i++) {
    var entry = HX_FAQ_DATA[i];
    if (!entry._w.length) continue;
    var overlap = 0;
    for (var j=0; j<entry._w.length; j++) { if (userSet[entry._w[j]]) overlap++; }
    var score = overlap / entry._w.length;
    if (score > bestAnyScore) { bestAnyScore = score; bestAny = entry; }
    if (entry.lang === lang && score > bestScore) { bestScore = score; best = entry; }
  }
  if (best && bestScore >= 0.5) return best;
  if (bestAny && bestAnyScore >= 0.6) return bestAny; // coincidència molt clara encara que sigui d'un altre idioma
  return null;
}

function hxRespond(userText){
  var lang = hxDetectLang(userText);
  HX_LAST_LANG = lang;
  hxShowTyping();

  var producte = hxFindProduct(userText);
  var topicId = hxFindTopic(userText);
  if (producte && (!topicId || HX_GENERIC_CATALOG_TOPICS[topicId])) {
    var delayP = 450 + Math.random()*400;
    setTimeout(function(){
      hxHideTyping();
      hxStat({ k: 'c', s: 'producte', l: lang });
      hxAddMessage(hxUiStr('product_intro', lang, {name: producte.name}), 'bot');
      hxRenderProductCard(producte);
      hxRenderQuickReplies(lang);
    }, delayP);
    HX_CHAT_FALLBACK_STREAK = 0;
    return;
  }

  if (topicId === 'esteu_oberts_ara') {
    HX_CHAT_FALLBACK_STREAK = 0;
    var ara = new Date();
    var dia = ara.getDay();
    var minutsAra = ara.getHours()*60 + ara.getMinutes();
    var esObert = (dia >= 1 && dia <= 5) && minutsAra >= (8*60) && minutsAra <= (17*60+30);
    hxStat({ k: 'c', s: 'tema', l: lang });
    var textObert = HX_OBERT_ARA[lang] ? (esObert ? HX_OBERT_ARA[lang].open : HX_OBERT_ARA[lang].closed) : '';
    setTimeout(function(){ hxHideTyping(); hxAddMessage(textObert, 'bot'); hxRenderQuickReplies(lang); }, 600);
    return;
  }

  if (topicId === 'on_es_comanda') {
    HX_CHAT_FALLBACK_STREAK = 0;
    setTimeout(function(){
      hxHideTyping();
      hxStat({ k: 'c', s: 'tema', l: lang });
      var cs = HX_COMANDA_STATUS[lang] || HX_COMANDA_STATUS['ca'];
      if (!CP_CURRENT_USER) {
        hxAddMessage(cs.noLogin, 'bot');
      } else {
        var comandes = (CP_DB.comandes || []).slice(-3).reverse();
        if (!comandes.length) {
          hxAddMessage(cs.empty, 'bot');
        } else {
          var list = comandes.map(function(c){ return '• ' + c.num + ' (' + CP_FD(c.fecha) + '): ' + c.estat + ' — ' + CP_EUR(c.total); }).join('\n');
          hxAddMessage(cs.list + '\n\n' + list + '\n\n' + cs.foot, 'bot');
        }
      }
      hxRenderQuickReplies(lang);
    }, 600);
    return;
  }

  if (topicId) {
    HX_CHAT_FALLBACK_STREAK = 0;
    hxStat({ k: 'c', s: 'tema', l: lang });
    var replyText = hxTopicAnswer(topicId, lang);
    var action = hxTopicAction(topicId, lang);
    var delay = Math.min(1400, 500 + replyText.length*4 + Math.random()*400);
    setTimeout(function(){
      hxHideTyping();
      hxAddMessage(replyText, 'bot');
      if (action) hxAddAction(action);
      hxRenderQuickReplies(lang);
    }, delay);
    return;
  }

  hxCarregarFaq().then(function(){
    var faqMatch = hxFindFaqMatch(userText, lang);
    if (faqMatch) {
      HX_CHAT_FALLBACK_STREAK = 0;
      var delayF = Math.min(1400, 500 + faqMatch.a.length*4 + Math.random()*400);
      setTimeout(function(){
        hxHideTyping();
        hxStat({ k: 'c', s: 'faq', l: lang });
        hxAddMessage(faqMatch.a, 'bot');
        if (faqMatch.action) hxAddAction(faqMatch.action);
        hxRenderQuickReplies(lang);
      }, delayF);
      return;
    }
    hxAskAI(userText, lang);
  });
}

function hxChatSend(ev){
  if (ev) ev.preventDefault();
  var input = document.getElementById('hxChatInput');
  if (!input) return false;
  var text = input.value.trim();
  if (!text) return false;
  hxAddMessage(text, 'user');
  input.value = '';
  hxRespond(text);
  return false;
}
window.hxChatSend = hxChatSend;

function hxQuickReply(text){
  hxAddMessage(text, 'user');
  hxRespond(text);
}
window.hxQuickReply = hxQuickReply;

function hxRenderQuickReplies(lang){
  var box = document.getElementById('hxChatQuickReplies');
  if (!box) return;
  lang = lang || HX_LAST_LANG || cpLang();
  box.innerHTML = '';
  if (typeof HX_QUICK_REPLIES_I18N === 'undefined') return;
  HX_QUICK_REPLIES_I18N.forEach(function(qr){
    var btn = document.createElement('button');
    btn.className = 'hxQuickBtn';
    btn.textContent = qr.icon + ' ' + (qr.label[lang] || qr.label['ca']);
    btn.onclick = function(){ hxQuickReply(qr.text[lang] || qr.text['ca']); };
    box.appendChild(btn);
  });
}

function toggleHxChat(force){
  var win = document.getElementById('hxChatWindow');
  if (!win) return;
  var shouldOpen = (force !== undefined) ? force : !win.classList.contains('open');
  if (shouldOpen) {
    win.classList.add('open');
    var badge = document.getElementById('hxChatBadge');
    if (badge) badge.classList.add('hidden');
    hxCarregarFaq();   // es va descarregant mentre el client escriu
    if (!HX_CHAT_OPENED) {
      HX_CHAT_OPENED = true;
      var siteLang = cpLang();
      HX_LAST_LANG = siteLang;
      var restored = hxRestoreHistory();
      if (!restored) {
        hxAddMessage(hxTopicAnswer('hola', siteLang), 'bot');
      }
      hxRenderQuickReplies(siteLang);
    }
    var input = document.getElementById('hxChatInput');
    if (input) setTimeout(function(){ input.focus(); }, 260);
  } else {
    win.classList.remove('open');
  }
}
window.toggleHxChat = toggleHxChat;

function forgotPassword() {
  var emailInput = document.getElementById('loginEmail');
  var val = (emailInput ? emailInput.value : '').trim();
  var subject = encodeURIComponent('Recuperació de contrasenya - HIGIENEX');
  var body = encodeURIComponent(
    'Hola,\n\nHe oblidat la meva contrasenya d\'accés a la web de HIGIENEX.' +
    (val ? ('\nEl meu usuari/email és: ' + val) : '') +
    '\n\nSi us plau, ajudeu-me a recuperar-la o restablir-la.\n\nGràcies.'
  );
  window.location.href = 'mailto:contacto@higienexvalencia.es?subject=' + subject + '&body=' + body;
  showToast('Obrint el teu correu per demanar la recuperació…', '✉️');
}
window.forgotPassword = forgotPassword;

function hxTogglePass(id,btn){
  var el = document.getElementById(id); if (!el) return;
  var showing = el.type === 'text';
  el.type = showing ? 'password' : 'text';
  if (btn) { btn.textContent = showing ? '👁️' : '🙈'; btn.title = showing ? 'Mostrar contrasenya' : 'Amagar contrasenya'; }
}
window.hxTogglePass = hxTogglePass;
async function loginWithEmail() {
  var emailInput = document.getElementById('loginEmail');
  var passInput  = document.getElementById('loginPassword');
  var errBox     = document.getElementById('loginError');
  var input    = (emailInput.value    || '').trim().toLowerCase();
  var password = (passInput.value || '').trim();

  function showLoginError(msg) {
    if (errBox) { errBox.textContent = '⚠ ' + msg; errBox.style.display = 'block'; }
    emailInput.style.borderColor = '#D32F2F';
    passInput.style.borderColor  = '#D32F2F';
  }
  function clearLoginError() {
    if (errBox) errBox.style.display = 'none';
    emailInput.style.borderColor = '#E0E0E0';
    passInput.style.borderColor  = '#E0E0E0';
  }

  if (!input || !password) { showLoginError('Introdueix el teu nom i contrasenya.'); return; }

  var res;
  try {
    res = await hxApi('/login', { method: 'POST', body: { user: input, password: password } });
  } catch(e) {
    showLoginError(e.status === 401 ? 'Nom o contrasenya incorrectes.' : 'No s\'ha pogut connectar amb el servidor. Torna-ho a provar.');
    return;
  }
  hxSetApiToken(res.token);
  window.HX_PROFILE = res.user;
  if (res.portal) cpAplicarPortal(res.portal);
  clearLoginError();
  closeAuthModal();
  setLoggedInUser(res.user.name, '', res.user.role, res.user.email);
  if (res.user.role === 'admin') { showAdminWelcome(res.user.name); hxRefreshAdminPanel(); }
  else showWelcome(res.user.name, false);
}
window.loginWithEmail = loginWithEmail;

var _registerInFlight = false;
async function registerUser() {
  if (_registerInFlight) return;
  var name=document.getElementById('regName').value.trim();
  var email=document.getElementById('regEmail').value.trim();
  var password=document.getElementById('regPassword').value;
  var company=document.getElementById('regCompany').value.trim();
  var cifEl=document.getElementById('regCif');
  var cif=cifEl?cifEl.value.trim():'';
  var sector=document.getElementById('regSector').value;
  if (!name||!email||!password) { alert('Omple tots els camps obligatoris.'); return; }
  if (password.length<6) { alert('La contrasenya ha de tenir minim 6 caracters.'); return; }
  _registerInFlight = true;
  var refActiu = hxCodiReferitActiu();
  var res;
  try {
    res = await hxApi('/register', { method: 'POST', body: { name: name, email: email, password: password,
      company: company, cif: cif, sector: sector, ref: refActiu || '', lang: hxIdiomaWeb() } });
  } catch(e) {
    _registerInFlight = false;
    if (e.status === 409) { alert('Aquest email ja està registrat. Inicia sessió.'); switchTab('login'); }
    else alert(e.message || 'No s\'ha pogut completar el registre. Torna-ho a provar.');
    return;
  }
  hxSetApiToken(res.token);
  window.HX_PROFILE = res.user;
  enviarNotificacioEmail({
    title: 'Nou usuari registrat a la web',
    badge: refActiu ? 'REGISTRE REFERIT' : 'NOU REGISTRE',
    subtitle: refActiu ? ('Algú s\'ha registrat via una recomanació (codi ' + refActiu + ').') : 'Algú s\'ha registrat a HIGIENEX des de la web.',
    name: name,
    email: email,
    detailLabel: 'Dades del registre',
    message: 'Nom: ' + name + '\nEmail: ' + email + (company ? ('\nEmpresa: ' + company) : '') + (cif ? ('\nCIF: ' + cif) : '') + (sector ? ('\nSector: ' + sector) : '') + (refActiu ? ('\nCodi de referit: ' + refActiu + ' (aplicar el descompte de benvinguda)') : ''),
    ctaButtonHtml: hxEmailCtaButton('Donar la benvinguda →', 'mailto:' + email, 'gold'),
    data: { event: 'registro', contact: { name: name, email: email, company: company },
      fields: [['CIF', cif], ['Sector', sector]], referral: refActiu || '' }
  });
  closeAuthModal(); setLoggedInUser(name,'','client',email); showWelcome(name,false);
  _registerInFlight = false;
}
window.registerUser = registerUser;

function showToast(msg, emoji) {
  var ex=document.getElementById('toastMsg'); if(ex) ex.remove();
  var t=document.createElement('div'); t.id='toastMsg';
  t.setAttribute('role','status'); t.setAttribute('aria-live','polite');
  t.style.cssText='position:fixed;bottom:5rem;right:1.5rem;z-index:9999999;background:#0B3D6B;color:white;padding:0.8rem 1.2rem;border-radius:14px;box-shadow:0 8px 32px rgba(11,61,107,0.3);font-family:Arial,sans-serif;font-size:0.88rem;font-weight:600;display:flex;align-items:center;gap:0.6rem;max-width:300px;';
  t.innerHTML = '<span style="font-size:1.3rem;">' + emoji + '</span><span>' + msg + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1.1rem;margin-left:auto;padding:0 0 0 0.5rem;" type="button" aria-label="Tancar notificació">x</button>';
  document.body.appendChild(t);
  setTimeout(function(){ if(t.parentElement) t.remove(); }, 4000);
}
window.showToast = showToast;

function showWelcome(name, isProfessor) {
  showToast('Benvingut/da, ' + name + '!', '❤️');
  if (_pendingCheckout) {
    _pendingCheckout = false;
    openCartDrawer();
  }
}
window.showWelcome = showWelcome;

function showAdminWelcome(name) {
  openAdminPanel();
  setTimeout(function(){ showToast('Benvingut/da, ' + name + '!', '⚙️'); }, 300);
}
window.showAdminWelcome = showAdminWelcome;

function setLoggedInUser(name, avatar, role, email, skipSave) {
  window.HX_USER = { name: name, role: role, email: email || '' };
  var uEl=document.getElementById('userName'); if(uEl) uEl.textContent=name;
  if (!skipSave) {
    try { localStorage.setItem('hx_user_session', JSON.stringify({name:name, avatar:avatar||'', role:role, email:email||''})); } catch(e) {}
  }
  // El acceso al portal de clientes lo concede el servidor al iniciar sesión (ver loginWithEmail).
  var navInner=document.getElementById('navRightGroup');
  var exBtn=document.getElementById('userNavBtn');
  if (!exBtn && navInner) {
    var ab=document.getElementById('authBtns'); if(ab) ab.style.display='none';
    var btn=document.createElement('button'); btn.id='userNavBtn';
    var isAdmin=(role==='admin');
    btn.style.cssText='display:flex;align-items:center;gap:0.5rem;background:'+(isAdmin?'#F2A900':'#0B3D6B')+';color:'+(isAdmin?'#1A1A1A':'white')+';border:none;padding:0.45rem 1rem;border-radius:40px;cursor:pointer;font-family:Arial,sans-serif;font-size:0.82rem;font-weight:700;';
    btn.textContent=(isAdmin?'⚙️ ':'👤 ') + name.split(' ')[0] + (isAdmin?' (Admin)':'');
    btn.onclick=function(){ if(isAdmin) openAdminPanel(); else { openCartDrawer(); } };
    navInner.insertBefore(btn, navInner.lastElementChild);
  } else if (exBtn) {
    exBtn.textContent=(role==='admin'?'⚙️ ':'👤 ') + name.split(' ')[0] + (role==='admin'?' (Admin)':'');
  }
}

function logout() {
  if (hxApiToken()) { hxApi('/logout', { method: 'POST' }).catch(function(){}); }
  hxSetApiToken('');
  window.HX_PROFILE = null; HX_SERVER_ORDERS = null;
  window.HX_USER = null;
  if (hxPortalToken()) { hxPortal('/logout', { method: 'POST' }).catch(function(){}); }
  hxSetPortalToken('');
  CP_DB.cliente = { team: [] }; CP_DB.facturas = []; CP_DB.comandes = []; CP_DB.productos = {};
  CP_LOGGED_IN = false;
  try { localStorage.removeItem('hx_user_session'); localStorage.removeItem('hx_cp_logged_in'); } catch(e) {}
  cpUpdateNavState();
  var p=document.getElementById('pedidosSection'); if(p) p.classList.remove('open');
  var a=document.getElementById('adminPanel'); if(a) a.classList.remove('open');
  document.body.style.overflow='';
  var ub=document.getElementById('userNavBtn'); if(ub) ub.remove();
  var ab=document.getElementById('authBtns'); if(ab) ab.style.display='flex';
  var ef=document.getElementById('loginEmail'); if(ef) ef.value='';
  var pf=document.getElementById('loginPassword'); if(pf) pf.value='';
  if (typeof renderOrderHistory === 'function') renderOrderHistory();
  switchTab('login');
}
window.logout = logout;

function closePedidosSection() { var p=document.getElementById('pedidosSection'); if(p) p.classList.remove('open'); document.body.style.overflow=''; }
window.closePedidosSection = closePedidosSection;

// El cistell (pedidosSection) fa ara de "drawer" del carret: es pot obrir sense
// haver iniciat sessió, nomes cal iniciar sessió per tramitar la comanda final.
function openCartDrawer() {
  var p=document.getElementById('pedidosSection');
  if (p) { p.classList.add('open'); document.body.style.overflow='hidden'; }
  if (typeof renderCart === 'function') renderCart();
  if (typeof renderOrderHistory === 'function') renderOrderHistory();
}
window.openCartDrawer = openCartDrawer;
function closeCartDrawer() { closePedidosSection(); }
window.closeCartDrawer = closeCartDrawer;

var _pendingCheckout = false;
function startCheckout() {
  var keys = Object.keys(cart);
  if (!keys.length) { alert('Afegeix almenys un producte al cistell abans de tramitar la comanda.'); return; }
  if (!window.HX_USER && !CP_LOGGED_IN) {
    _pendingCheckout = true;
    closeCartDrawer();
    openAuthModal(); switchTab('login');
    showToast('Inicia sessió per finalitzar la teva comanda', '🔐');
    return;
  }
  openPaymentModal();
}
window.startCheckout = startCheckout;

// ── PASSAREL·LA DE PAGAMENT (FICTÍCIA) ──────────────────────────────
// Entorn de proves: no es connecta amb cap banc ni processador real.
// Simula l'experiència de pagament (validació de targeta, retard de
// "processament") i, en acabar, crida sendOrder() com si el pagament
// s'hagués confirmat.
var _hxPayMethod = 'card';
// Arrodoniment a cèntims «de botiga» (3,675 → 3,68): toFixed() fallava amb els decimals de coma flotant.
function hxRedon(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }
window.hxRedon = hxRedon;
// Descuento extra de cliente (5–30 %) que se asigna en el ERP a los mejores clientes.
// Llega con la cuenta (HX_PROFILE.dtoExtra) y se aplica sobre los productos, después
// del descuento por volumen. En pantalla no se enseña: sale al pagar, en los PDF y en el email.
function hxDtoCli() {
  var u = window.HX_PROFILE, v = u ? +u.dtoExtra : 0;
  return (window.HX_USER && [5, 10, 15, 20, 25, 30].indexOf(v) >= 0) ? v : 0;
}
window.hxDtoCli = hxDtoCli;
// prodVol = suma de productos con el descuento por volumen ya aplicado
function hxImports(prodVol) {
  var pct = hxDtoCli(), dteCli = hxRedon(prodVol * pct / 100), prod = hxRedon(prodVol - dteCli);
  var base = hxRedon(prod + (TRANSPORT || 0)), iva = hxRedon(base * IVA_PCT);
  return { pct: pct, dteCli: dteCli, prod: prod, base: base, iva: iva, total: hxRedon(base + iva) };
}
window.hxImports = hxImports;
function hxCartTotalNow() {
  var subtotal = Object.keys(cart).reduce(function(s,k){ return s + cart[k].total; }, 0);
  if (!subtotal) return 0;
  // El IVA se aplica también al transporte (igual que en el pedido que se registra)
  return hxImports(subtotal).total;
}
function openPaymentModal() {
  var keys = Object.keys(cart);
  if (!keys.length) { alert('Afegeix almenys un producte al cistell abans de pagar.'); return; }
  var m = document.getElementById('paymentModal');
  if (!m) return;
  var total = hxCartTotalNow();
  var disp = document.getElementById('paymentTotalDisplay');
  if (disp) disp.textContent = hxFormatPrice(total);
  // El descuento por volumen no se enseña en el carrito; aquí se explica por qué el total es menor.
  var nota = document.getElementById('paymentDteNote');
  if (nota) {
    var dte = Object.keys(cart).reduce(function(s,k){ var it = cart[k]; return s + (it.rawTotal != null ? it.rawTotal - it.total : 0); }, 0);
    var prodVol = Object.keys(cart).reduce(function(s,k){ return s + cart[k].total; }, 0);
    var imC = hxImports(prodVol);
    var dteIva = hxRedon((dte + imC.dteCli) * (1 + IVA_PCT));
    var TN = imC.pct
      ? { ca: 'Inclou els teus descomptes (client {1} % i per volum): {0} (IVA inclòs).', es: 'Incluye tus descuentos (cliente {1} % y por volumen): {0} (IVA incluido).', en: 'Includes your discounts (customer {1} % and volume): {0} (VAT incl.).', fr: 'Inclut vos remises (client {1} % et volume) : {0} (TVA comprise).', de: 'Enthält Ihre Rabatte (Kunde {1} % und Menge): {0} (inkl. MwSt.).', ar: 'يشمل خصوماتك (عميل {1}% وكمية): {0} (شامل الضريبة).' }
      : { ca: 'Inclou un descompte per volum de {0} (IVA inclòs).', es: 'Incluye un descuento por volumen de {0} (IVA incluido).', en: 'Includes a volume discount of {0} (VAT incl.).', fr: 'Inclut une remise sur volume de {0} (TVA comprise).', de: 'Enthält einen Mengenrabatt von {0} (inkl. MwSt.).', ar: 'يشمل خصم كمية بقيمة {0} (شامل الضريبة).' };
    var l = (typeof cpLang === 'function' && cpLang()) || 'ca';
    nota.textContent = (TN[l] || TN.ca).replace('{0}', hxFormatPrice(dteIva)).replace('{1}', imC.pct);
    nota.style.display = (dte + imC.dteCli) > 0.004 ? 'block' : 'none';
  }
  var err = document.getElementById('paymentError');
  if (err) err.style.display = 'none';
  var f = document.getElementById('paymentCardForm');
  if (f) f.reset();
  hxPaySetMethod('card');
  var qp = document.querySelectorAll('#paymentModal .hx-quickpay-btn');
  qp.forEach(function(b){ b.disabled = false; b.style.opacity = '1'; if (b.dataset.original) b.innerHTML = b.dataset.original; });
  closeCartDrawer();
  m.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
window.openPaymentModal = openPaymentModal;
function closePaymentModal() {
  var m = document.getElementById('paymentModal');
  if (m) m.style.display = 'none';
  document.body.style.overflow = '';
  var btn = document.getElementById('paySubmitBtn');
  if (btn) { btn.disabled = false; btn.textContent = cpT('t849'); }
}
window.closePaymentModal = closePaymentModal;
function hxPaySetMethod(method) {
  _hxPayMethod = method;
  var isCard = method === 'card';
  document.getElementById('paymentCardForm').style.display = isCard ? 'block' : 'none';
  document.getElementById('paymentTransferForm').style.display = isCard ? 'none' : 'block';
  var tCard = document.getElementById('payTabCard'), tTr = document.getElementById('payTabTransfer');
  [tCard, tTr].forEach(function(b){ b.style.background='#fff'; b.style.color='#555'; b.style.borderColor='#D9E5F0'; });
  var active = isCard ? tCard : tTr;
  active.style.background = '#0B3D6B'; active.style.color = '#fff'; active.style.borderColor = '#0B3D6B';
}
window.hxPaySetMethod = hxPaySetMethod;
function hxPayFormatCard(el) {
  var digits = el.value.replace(/\D/g, '').slice(0, 16);
  el.value = digits.replace(/(.{4})/g, '$1 ').trim();
}
window.hxPayFormatCard = hxPayFormatCard;
function hxPayFormatExpiry(el) {
  var digits = el.value.replace(/\D/g, '').slice(0, 4);
  el.value = digits.length > 2 ? digits.slice(0,2) + '/' + digits.slice(2) : digits;
}
window.hxPayFormatExpiry = hxPayFormatExpiry;
function hxProcessPayment(e, forceMethod) {
  if (e) e.preventDefault();
  var method = forceMethod || _hxPayMethod;
  var err = document.getElementById('paymentError');
  if (err) err.style.display = 'none';

  if (method === 'card') {
    var num = document.getElementById('payCardNumber').value.replace(/\s/g, '');
    var exp = document.getElementById('payExpiry').value;
    var cvv = document.getElementById('payCvv').value;
    var name = document.getElementById('payName').value.trim();
    if (!name || num.length < 13 || !/^\d{2}\/\d{2}$/.test(exp) || cvv.length < 3) {
      if (err) { err.textContent = cpT('t853'); err.style.display = 'block'; }
      return false;
    }
    var mm = parseInt(exp.slice(0,2), 10);
    if (mm < 1 || mm > 12) {
      if (err) { err.textContent = cpT('t854'); err.style.display = 'block'; }
      return false;
    }
  }

  var btn = method === 'card' ? document.getElementById('paySubmitBtn') : event && event.target;
  if (btn) { btn.disabled = true; btn.textContent = method === 'card' ? cpT('t855') : cpT('t856'); }

  setTimeout(function() {
    closePaymentModal();
    sendOrder();
  }, method === 'card' ? 1400 : 500);
  return false;
}
window.hxProcessPayment = hxProcessPayment;

function hxQuickPay(method, btn) {
  var labels = { applepay: 'Apple Pay', googlepay: 'Google Pay', paypal: 'PayPal' };
  if (!btn.dataset.original) btn.dataset.original = btn.innerHTML;
  btn.disabled = true;
  btn.style.opacity = '0.7';
  btn.innerHTML = cpT('t857') + labels[method] + '…';
  var otherBtns = btn.parentElement.querySelectorAll('button');
  otherBtns.forEach(function(b){ if (b !== btn) b.disabled = true; });
  setTimeout(function() {
    closePaymentModal();
    sendOrder();
  }, 1300);
}
window.hxQuickPay = hxQuickPay;

var cart = {};
try {
  var _savedCart = localStorage.getItem('hx_cart');
  if (_savedCart) cart = JSON.parse(_savedCart) || {};
  Object.keys(cart).forEach(function(k){ if (typeof recalcCartLine === 'function') recalcCartLine(k); });
} catch(e) { cart = {}; }
function guardarCarret() {
  try { localStorage.setItem('hx_cart', JSON.stringify(cart)); } catch(e) {}
}
function changeQty(btn, delta) {
  var n=btn.parentElement.querySelector('.qty-num');
  if(n){ var v = Math.max(0, (parseInt(n.value,10)||0)+delta); n.value = v; }
}
function hxQtySanitize(el) {
  var v = parseInt(el.value, 10);
  if (isNaN(v) || v < 0) v = 0;
  el.value = v;
}
window.hxQtySanitize = hxQtySanitize;
window.changeQty = changeQty;
var _catalogCategory = '';
function filterByCategory(cat) {
  _catalogCategory = cat;
  var btns = document.querySelectorAll('.cat-filter-btn');
  btns.forEach(function(b){
    var active = (b.getAttribute('data-cat') === cat);
    b.style.background = active ? '#0B3D6B' : 'white';
    b.style.color = active ? 'white' : '#0B3D6B';
    b.style.borderColor = active ? '#0B3D6B' : '#D9E5F0';
  });
  var s = document.getElementById('catalogSearch');
  filterCatalog(s ? s.value : '');
}
window.filterByCategory = filterByCategory;

function filterCatalog(q) {
  var grid = document.getElementById('pedidosGrid');
  if (!grid) return;
  var cards = grid.querySelectorAll('.pedido-card-new');
  var query = (q || '').trim().toLowerCase();
  var visibleCount = 0;
  cards.forEach(function(card){
    var text = card.textContent.toLowerCase();
    var matchesText = !query || text.indexOf(query) !== -1;
    var matchesCat = !_catalogCategory || card.getAttribute('data-category') === _catalogCategory;
    var match = matchesText && matchesCat;
    card.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });
  var empty = document.getElementById('catalogSearchEmpty');
  if (empty) empty.style.display = (visibleCount === 0 && query) ? 'block' : 'none';
}
window.filterCatalog = filterCatalog;
// ── Moneda per idioma ──────────────────────────────────────────
// Tots els idiomes mostren euros (és la moneda en què es cobra); només canvia
// el format del número i la posició del símbol.
var HX_CURRENCY_BY_LANG = {
  ca: {code:'EUR', symbol:'€', rate:1,    position:'after'},
  es: {code:'EUR', symbol:'€', rate:1,    position:'after'},
  fr: {code:'EUR', symbol:'€', rate:1,    position:'after'},
  de: {code:'EUR', symbol:'€', rate:1,    position:'after'},
  // Se cobra siempre en euros: en todos los idiomas el precio se muestra en euros
  // (antes el inglés y el árabe convertían a dólares y dírhams con un cambio fijo).
  en: {code:'EUR', symbol:'€', rate:1,    position:'before'},
  ar: {code:'EUR', symbol:'€', rate:1,    position:'after'}
};
function hxFormatPrice(eurAmount) {
  var lang = (typeof cpLang === 'function') ? cpLang() : 'ca';
  var cur = HX_CURRENCY_BY_LANG[lang] || HX_CURRENCY_BY_LANG.ca;
  var loc = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-u-nu-latn' }[lang] || 'ca-ES';
  var numStr = (Number(eurAmount) || 0).toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  return cur.position === 'before' ? (cur.symbol + numStr) : (numStr + '\u00a0' + cur.symbol);
}
window.hxFormatPrice = hxFormatPrice;
// Recalcula i repinta tots els preus visibles de la pàgina amb la moneda de
// l'idioma actual. Es crida en carregar la pàgina i cada cop que es canvia
// d'idioma des del selector.
function hxRefreshAllPrices() {
  document.querySelectorAll('.hx-price[data-eur]').forEach(function(el) {
    el.textContent = hxFormatPrice(parseFloat(el.getAttribute('data-eur')));
  });
  if (typeof CP_FITXA_ACTUAL !== 'undefined' && CP_FITXA_ACTUAL) {
    if (typeof obrirFitxaProducte === 'function') obrirFitxaProducte(CP_FITXA_ACTUAL);
  }
  if (typeof renderCart === 'function') renderCart();
}
window.hxRefreshAllPrices = hxRefreshAllPrices;
document.addEventListener('DOMContentLoaded', hxRefreshAllPrices);

function volumeDiscountRate(qty) {
  if (qty >= 20) return 0.15;
  if (qty >= 10) return 0.10;
  if (qty >= 5)  return 0.05;
  return 0;
}
window.volumeDiscountRate = volumeDiscountRate;

function recalcCartLine(name) {
  var it = cart[name];
  if (!it) return;
  var rate = volumeDiscountRate(it.qty);
  it.discountRate = rate;
  it.rawTotal = it.price * it.qty;
  it.total = it.rawTotal * (1 - rate);
}
window.recalcCartLine = recalcCartLine;

function addToCart(name, price, btn) {
  // Find qty-num inside the card (go up to card container then find .qty-num)
  var card = btn.parentElement;
  var n = card.querySelector('.qty-num');
  var qty = n ? (parseInt(n.value, 10) || 0) : 0;
  if (qty === 0) { alert('Selecciona una quantitat primer.'); return; }
  if (cart[name]) { cart[name].qty += qty; }
  else { cart[name] = {qty: qty, price: price}; }
  recalcCartLine(name);
  if (n) n.value = '1';
  renderCart();
  var rate = cart[name].discountRate;
  var producte = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.filter(function(p){ return p.name === name; })[0] : null;
  if (producte && producte.stock === 'low' && qty > 5) {
    showToast('⚠️ ' + name + ': estoc baix (últimes unitats). Aquesta quantitat pot trigar més del normal a servir-se.', '⚠️');
  } else {
    showToast(name + ' afegit! (' + qty + ' u.)', '✅');
  }
}
window.addToCart = addToCart;
var TRANSPORT = 5.00;
var IVA_PCT  = 0.21;

// ── PRESSUPOSTADOR INTERACTIU ──────────────────────────────
var PRESSUPOST_QTY = {};

function pressupostChangeQty(name, delta) {
  var current = PRESSUPOST_QTY[name] || 0;
  var next = Math.max(0, current + delta);
  PRESSUPOST_QTY[name] = next;
  renderPressupost();
}
window.pressupostChangeQty = pressupostChangeQty;

function pressupostSetQty(name, input) {
  var v = parseInt(input.value, 10);
  if (isNaN(v) || v < 0) v = 0;
  PRESSUPOST_QTY[name] = v;
  renderPressupost();
}
window.pressupostSetQty = pressupostSetQty;

function pressupostItems() {
  if (typeof PRODUCTS === 'undefined') return [];
  return PRODUCTS.filter(function(p){ return (PRESSUPOST_QTY[p.name] || 0) > 0; }).map(function(p){
    var qty = PRESSUPOST_QTY[p.name];
    var rate = volumeDiscountRate(qty);
    var rawTotal = p.price * qty;
    var total = rawTotal * (1 - rate);
    return { name: p.name, unit: p.unit, qty: qty, price: p.price, discountRate: rate, rawTotal: rawTotal, total: total };
  });
}

function renderPressupostLines() {
  var box = document.getElementById('pressupostLines');
  if (!box || typeof PRODUCTS === 'undefined') return;
  box.innerHTML = PRODUCTS.map(function(p, idx) {
    var qty = PRESSUPOST_QTY[p.name] || 0;
    return '<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1.4rem;' + (idx > 0 ? 'border-top:1px solid var(--border);' : '') + '">' +
      '<div style="min-width:0;"><div style="font-weight:700;color:var(--green-deep);font-size:0.95rem;">' + escHtml(p.name) + '</div>' +
      '<div style="font-size:0.8rem;color:#7A8B9C;margin-top:0.15rem;">' + p.price.toFixed(2).replace('.', ',') + ' € / ' + escHtml(p.unit) + '</div></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0;">' +
      '<button type="button" onclick="pressupostChangeQty(\'' + escHtml(p.name).replace(/'/g, "\\'") + '\',-1)" aria-label="Disminuir" style="width:30px;height:30px;border-radius:50%;border:1.5px solid var(--border);background:#fff;color:var(--green-deep);font-weight:700;cursor:pointer;">−</button>' +
      '<input type="number" min="0" step="1" value="' + qty + '" oninput="pressupostSetQty(\'' + escHtml(p.name).replace(/'/g, "\\'") + '\',this)" style="width:46px;text-align:center;border:1.5px solid var(--border);border-radius:8px;padding:0.35rem 0.2rem;font-weight:700;color:var(--green-deep);">' +
      '<button type="button" onclick="pressupostChangeQty(\'' + escHtml(p.name).replace(/'/g, "\\'") + '\',1)" aria-label="Augmentar" style="width:30px;height:30px;border-radius:50%;border:1.5px solid var(--border);background:#fff;color:var(--green-deep);font-weight:700;cursor:pointer;">+</button>' +
      '</div></div>';
  }).join('');
}

function renderPressupostResum() {
  var box = document.getElementById('pressupostResum');
  if (!box) return;
  var items = pressupostItems();
  if (!items.length) {
    box.innerHTML = '<p style="color:rgba(255,255,255,0.65);font-size:0.85rem;">Encara no has afegit cap producte. Tria quantitats a l\'esquerra per veure el càlcul.</p>';
    return;
  }
  // En pantalla, sin descuento; el PDF del presupuesto que llega por email ya lo aplica.
  var subtotal = items.reduce(function(s, i){ return s + i.rawTotal; }, 0);
  var totalDescompte = 0;
  var base = subtotal + TRANSPORT;
  var iva = hxRedon(hxRedon(base) * IVA_PCT);
  var total = hxRedon(base + iva);
  var linesHTML = items.map(function(i) {
    return '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.85rem;color:rgba(255,255,255,0.85);">' +
      '<span>' + i.qty + ' × ' + escHtml(i.name) + '</span><span>' + hxFormatPrice(i.rawTotal) + '</span></div>';
  }).join('');
  box.innerHTML = linesHTML +
    '<div style="margin-top:0.6rem;padding-top:0.6rem;border-top:1px dashed rgba(255,255,255,0.25);">' +
    '<div style="display:flex;justify-content:space-between;padding:0.2rem 0;font-size:0.85rem;color:rgba(255,255,255,0.75);"><span>Subtotal</span><span>' + hxFormatPrice(subtotal) + '</span></div>' +
    (totalDescompte > 0 ? '<div style="display:flex;justify-content:space-between;padding:0.2rem 0;font-size:0.85rem;color:var(--accent);"><span>Descompte per volum</span><span>-' + hxFormatPrice(totalDescompte) + '</span></div>' : '') +
    '<div style="display:flex;justify-content:space-between;padding:0.2rem 0;font-size:0.85rem;color:rgba(255,255,255,0.75);"><span>Transport</span><span>' + hxFormatPrice(TRANSPORT) + '</span></div>' +
    '<div style="display:flex;justify-content:space-between;padding:0.2rem 0;font-size:0.85rem;color:rgba(255,255,255,0.75);"><span>IVA (' + Math.round(IVA_PCT*100) + '%)</span><span>' + hxFormatPrice(iva) + '</span></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.7rem;padding:0.8rem 1rem;background:rgba(255,255,255,0.12);border-radius:10px;">' +
    '<span style="font-size:0.78rem;letter-spacing:0.05em;text-transform:uppercase;font-weight:700;">Total</span>' +
    '<span style="font-size:1.3rem;font-weight:700;font-family:Georgia,serif;">' + hxFormatPrice(total) + '</span></div>';
}

function renderPressupost() {
  renderPressupostLines();
  renderPressupostResum();
}

function pressupostInvoiceNum() {
  var any = new Date().getFullYear();
  var rand = Math.floor(1000 + Math.random() * 9000);
  return 'PRE-' + any + '-' + rand;
}

function htmlPressupost(clientInfo, items) {
  var subtotal = items.reduce(function(s, i){ return s + i.total; }, 0);
  var totalDescompte = items.reduce(function(s, i){ return s + (i.rawTotal - i.total); }, 0);
  var base = subtotal + TRANSPORT;
  var iva = base * IVA_PCT;
  var total = base + iva;
  var num = pressupostInvoiceNum();
  var ara = new Date();
  var validesa = new Date(ara.getTime() + 30*24*60*60*1000);
  var hiHaDescomptes = items.some(function(it){ return it.discountRate > 0; });
  var filesHTML = items.map(function(it, idx){
    var descompteCell = hiHaDescomptes
      ? (it.discountRate > 0 ? '<td class="num"><span class="pill">-' + Math.round(it.discountRate*100) + '%</span></td>' : '<td class="num muted">—</td>')
      : '';
    return '<tr class="' + (idx % 2 ? 'alt' : '') + '"><td class="pname">' + escHtml(it.name) + '</td><td class="num">' + it.qty + '</td><td class="num muted">' +
      it.price.toFixed(2) + ' €</td>' + descompteCell + '<td class="num strong">' + it.total.toFixed(2) + ' €</td></tr>';
  }).join('');
  return '<!DOCTYPE html><html lang="ca"><head><meta charset="UTF-8"><title>Pressupost ' + escHtml(num) + ' · HIGIENEX S.L.</title>' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'html{background:#EDEAE2}' +
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#16232E;background:#FBFAF7;font-size:13px;line-height:1.5;position:relative}' +
    '.sheet{max-width:760px;margin:0 auto;padding:46px 50px 38px;position:relative;overflow:hidden}' +
    '.watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:Georgia,\'Times New Roman\',serif;font-size:520px;font-weight:700;color:#0B3D6B;opacity:0.028;line-height:1;pointer-events:none;z-index:0;user-select:none}' +
    '.sheet > *:not(.watermark){position:relative;z-index:1}' +
    '.top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;margin-bottom:6px}' +
    '.brand{font-size:27px;font-weight:700;color:#0B3D6B;font-family:Georgia,\'Times New Roman\',serif;letter-spacing:.01em}.brand span{color:#F2A900}' +
    '.brand-sub{font-size:10.5px;color:#64748B;margin-top:7px;line-height:1.65}' +
    '.doc{text-align:right}' +
    '.doc .kicker{font-size:10px;letter-spacing:.12em;color:#B8860B;font-weight:700;margin-bottom:3px}' +
    '.doc h1{font-size:21px;font-weight:700;margin:0 0 6px 0;color:#16232E;font-family:Georgia,\'Times New Roman\',serif}' +
    '.doc .num{font-size:14px;font-weight:700;font-family:ui-monospace,Consolas,monospace;color:#0B3D6B;background:#EAF1F8;padding:3px 10px;border-radius:20px;display:inline-block}' +
    '.rule{height:1px;background:linear-gradient(90deg,#0B3D6B 0%,#0B3D6B 60%,#F2A900 100%);margin-bottom:26px}' +
    '.stamp{margin:12px 0 0 auto;width:86px;height:86px;border:2px solid #B8860B;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(-10deg)}' +
    '.stamp .st{font-size:8px;font-weight:800;letter-spacing:.05em;color:#B8860B;line-height:1.3;font-family:Georgia,serif}' +
    '.meta{display:flex;gap:0;margin-bottom:28px;border:1px solid #E3E8ED;border-radius:10px;overflow:hidden}' +
    '.box{flex:1;padding:14px 18px;background:#fff}' +
    '.box + .box{border-left:1px solid #E3E8ED}' +
    '.box h3{font-size:9.5px;letter-spacing:.1em;color:#B8860B;font-weight:700;margin:0 0 7px 0}' +
    '.box p{margin:0;line-height:1.65;color:#33424F}' +
    '.box p strong{color:#16232E}' +
    'table{width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:22px}' +
    'thead th{border-bottom:2px solid #16232E;padding:9px 4px;text-align:left;font-size:10px;letter-spacing:.07em;color:#16232E;font-weight:700}' +
    'tbody td{padding:11px 4px;border-bottom:1px solid #EDF1F4;vertical-align:middle}' +
    'tbody tr.alt td{background:#FAFBFC}' +
    'td.pname{font-weight:600;color:#16232E}' +
    'td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}' +
    'td.muted{color:#8A9BAC}td.strong{font-weight:700;color:#0B3D6B}' +
    '.pill{background:#FFF6E0;color:#B8860B;font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px}' +
    '.totwrap{display:flex;justify-content:flex-end}' +
    '.totbox{width:290px}' +
    '.totbox .l{display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;color:#4A5A6A}' +
    '.totbox .l.discount{color:#B8860B;font-weight:600}' +
    '.totbox .tot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:14px 16px;background:#0B3D6B;border-radius:10px}' +
    '.totbox .tot span:first-child{color:#BFD4E8;font-size:11px;letter-spacing:.08em;font-weight:700}' +
    '.totbox .tot span:last-child{color:#fff;font-size:20px;font-weight:700;font-family:Georgia,serif}' +
    '.foot{margin-top:34px;padding-top:16px;border-top:1px solid #E3E8ED;display:flex;justify-content:space-between;align-items:flex-end;gap:20px}' +
    '.foot p{font-size:9.5px;color:#94A3B0;line-height:1.6;max-width:440px}' +
    '.foot .seal{font-family:Georgia,serif;font-size:11px;color:#0B3D6B;font-weight:700;text-align:right;white-space:nowrap}' +
    '.foot .seal small{display:block;font-family:-apple-system,Arial,sans-serif;font-weight:400;color:#94A3B0;font-size:9px;letter-spacing:.04em;margin-top:2px}' +
    'thead{display:table-header-group}tr{page-break-inside:avoid}.box{page-break-inside:avoid}.totwrap{page-break-inside:avoid}.foot{page-break-inside:avoid}' +
    '@media print{ html,body{background:#fff;font-size:12px} .sheet{padding:6px 2px} .watermark{font-size:440px} .top{padding-bottom:14px} .meta{margin-bottom:18px} table{margin-bottom:14px} tbody td{padding:7px 4px} .box{padding:10px 14px} .rule{margin-bottom:16px} .foot{margin-top:20px;padding-top:10px} @page{margin:12mm} }' +
    '</style></head><body>' +
    '<div class="sheet">' +
    '<div class="watermark">X</div>' +
    '<div class="top">' +
      '<div><div class="brand">HIGIENE<span>X</span></div>' +
      '<div class="brand-sub">HIGIENEX S.L. · CIF B12345678<br>Carrer de la Indústria, 25, 46010 València<br>contacto@higienexvalencia.es · 631 706 398</div></div>' +
      '<div class="doc"><div class="kicker">PRESSUPOST SENSE COMPROMÍS</div><h1>Pressupost</h1><div class="num">' + escHtml(num) + '</div><div class="stamp"><div class="st">VÀLID FINS<br>' + validesa.toLocaleDateString('ca-ES') + '</div></div></div>' +
    '</div>' +
    '<div class="rule"></div>' +
    '<div class="meta">' +
      '<div class="box"><h3>CLIENT</h3><p><strong>' + escHtml(clientInfo.empresa || 'Client') + '</strong>' +
        (clientInfo.cif ? ('<br>CIF/NIF: ' + escHtml(clientInfo.cif)) : '') +
        (clientInfo.contacte ? ('<br>' + escHtml(clientInfo.contacte)) : '') +
        (clientInfo.email ? ('<br>' + escHtml(clientInfo.email)) : '') + '</p></div>' +
      '<div class="box"><h3>DETALLS</h3><p>Data d\'emissió: <strong>' + ara.toLocaleDateString('ca-ES') + '</strong><br>Vàlid durant: <strong>30 dies</strong></p></div>' +
    '</div>' +
    '<table><thead><tr><th>PRODUCTE</th><th class="num">UDS.</th><th class="num">PREU/UT.</th>' + (hiHaDescomptes ? '<th class="num">DESCOMPTE</th>' : '') + '<th class="num">IMPORT</th></tr></thead><tbody>' + filesHTML + '</tbody></table>' +
    '<div class="totwrap"><div class="totbox">' +
    '<div class="l"><span>Subtotal productes</span><span>' + subtotal.toFixed(2) + ' €</span></div>' +
    (totalDescompte > 0 ? ('<div class="l discount"><span>Descomptes per volum</span><span>-' + totalDescompte.toFixed(2) + ' €</span></div>') : '') +
    '<div class="l"><span>Transport</span><span>' + TRANSPORT.toFixed(2) + ' €</span></div>' +
    '<div class="l"><span>IVA (' + Math.round(IVA_PCT*100) + '%)</span><span>' + iva.toFixed(2) + ' €</span></div>' +
    '<div class="tot"><span>TOTAL</span><span>' + total.toFixed(2) + ' €</span></div>' +
    '</div></div>' +
    '<div class="foot">' +
      '<p>Aquest pressupost no és una factura ni una comanda en ferm. Preus vàlids durant 30 dies des de la data d\'emissió, IVA inclòs. Per confirmar la comanda, contacta amb el nostre equip comercial indicant el número de pressupost.</p>' +
      '<div class="seal">HIGIENE<span style="color:#F2A900">X</span><small>' + ara.toLocaleString('ca-ES') + '</small></div>' +
    '</div>' +
    '</div></body></html>';
}

function pressupostClientInfo() {
  return {
    empresa: (document.getElementById('presEmpresa') || {}).value || '',
    cif: (document.getElementById('presCif') || {}).value || '',
    contacte: (document.getElementById('presContacte') || {}).value || '',
    email: (document.getElementById('presEmail') || {}).value || ''
  };
}

function descarregarPressupostPDF(senseDesar) {
  var items = pressupostItems();
  if (!items.length) { showToast('Afegeix almenys un producte per generar el pressupost.', '⚠️'); return; }
  var info = pressupostClientInfo();
  /* Si jsPDF no ha carregat, fem servir la versió imprimible */
  if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF || typeof new window.jspdf.jsPDF().autoTable !== 'function') {
    abrirImprimibleFallback('Pressupost', htmlPressupost(info, items)); return;
  }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({ unit: 'pt', format: 'a4' });
  /* Textos en l'idioma triat a la web (pdf-i18n.js) */
  var T = function () { return window.HXT ? HXT.apply(null, arguments) : arguments[0]; };
  var TU = function (t) { return T(t).toUpperCase(); };
  var W = 595.28, H = 841.89, M = 40;
  var NAVY = [11,61,107], GOLD = [242,169,0], GOLD_D = [184,134,11], INK = [22,35,46], MUTED = [112,128,146], TXT = [74,90,106], LINE = [227,232,237], SOFT = [245,248,251], CREAM = [255,246,224];
  function eur(n) { var v = (Math.round((Number(n) || 0) * 100) / 100).toFixed(2).split('.'); return v[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + v[1] + ' \u20ac'; }
  function dd(d) { return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }
  function fill(c) { doc.setFillColor(c[0], c[1], c[2]); } function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); } function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
  function kicker(t, x, y, c) { doc.setFont('helvetica', 'bold'); doc.setFontSize(7); color(c || MUTED); doc.setCharSpace(1); doc.text(t, x, y); doc.setCharSpace(0); }

  var subtotalBrut = items.reduce(function (s, i) { return s + i.rawTotal; }, 0);
  var descompte = items.reduce(function (s, i) { return s + (i.rawTotal - i.total); }, 0);
  var subtotal = items.reduce(function (s, i) { return s + i.total; }, 0);
  var impP = hxImports(subtotal), dtoCli = impP.dteCli;
  var base = impP.base, iva = impP.iva, total = impP.total;
  var num = pressupostInvoiceNum(), ara = new Date(), validesa = new Date(ara.getTime() + 30 * 86400000);
  var hiHaDte = items.some(function (it) { return it.discountRate > 0; });

  function capcalera(primera) {
    var hh = primera ? 104 : 54;
    fill(NAVY); doc.rect(0, 0, W, hh, 'F'); fill(GOLD); doc.rect(0, hh, W, 3, 'F');
    var yl = primera ? 52 : 34;
    doc.setFont('times', 'bold'); doc.setFontSize(primera ? 30 : 18); doc.setTextColor(255, 255, 255); doc.text('HIGIENE', M, yl);
    doc.setFont('times', 'bolditalic'); color(GOLD); doc.text('X', M + doc.getTextWidth('HIGIENE') + 1, yl);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(178, 200, 222);
    if (primera) {
      doc.setFontSize(8); doc.setCharSpace(1.6); doc.text(T('HIGIENE PROFESSIONAL SOSTENIBLE'), M, 70); doc.setCharSpace(0);
      doc.setFontSize(8.5); doc.text('HIGIENEX S.L.  \u00b7  CIF B12345678', M, 86);
      kicker(TU('Pressupost sense compromís'), W - M - doc.getTextWidth(TU('Pressupost sense compromís')) - 9, 30, GOLD);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(24); doc.setTextColor(255, 255, 255); doc.text(TU('Pressupost'), W - M, 56, { align: 'right' });
      doc.setFontSize(11); color(GOLD); doc.text('N\u00ba ' + num, W - M, 74, { align: 'right' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(178, 200, 222); doc.text(T('Data') + ': ' + dd(ara), W - M, 89, { align: 'right' });
    } else {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
      doc.text(T('Pressupost') + ' ' + num, W - M, 32, { align: 'right' });
    }
  }
  capcalera(true);
  var y = 132;

  /* Franja de dades clau */
  var claus = [[TU('Data d’emissió'), dd(ara)], [TU('Vàlid fins al'), dd(validesa)], [TU('Productes'), items.length === 1 ? T('{0} referència', 1) : T('{0} referències', items.length)], [TU('Total (IVA incl.)'), eur(total)]];
  var cw = (W - 2 * M) / claus.length;
  fill(SOFT); stroke(LINE); doc.setLineWidth(0.6); doc.roundedRect(M, y, W - 2 * M, 46, 5, 5, 'FD');
  claus.forEach(function (k, i) {
    var x = M + i * cw + 14;
    if (i) { stroke(LINE); doc.line(M + i * cw, y + 9, M + i * cw, y + 37); }
    kicker(k[0], x, y + 18);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(i === 3 ? 11.5 : 10); color(i === 3 ? NAVY : INK); doc.text(k[1], x, y + 34);
  });
  y += 64;

  /* Client / Emissor */
  var bw = (W - 2 * M - 16) / 2;
  function caixa(x, titol, linies, accent) {
    stroke(LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, bw, 98, 5, 5, 'FD');
    fill(accent); doc.rect(x, y + 10, 3, 20, 'F');
    kicker(titol, x + 14, y + 18);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); color(INK); doc.text(doc.splitTextToSize(linies[0], bw - 28)[0], x + 14, y + 34);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6); color(TXT);
    linies.slice(1).filter(Boolean).slice(0, 4).forEach(function (l, i) { doc.text(doc.splitTextToSize(l, bw - 28)[0], x + 14, y + 50 + i * 12); });
  }
  caixa(M, TU('Client'), [info.empresa || T('Client'), info.cif ? 'CIF/NIF: ' + info.cif : '', info.contacte ? T('A l’atenció de: {0}', info.contacte) : '', info.email || ''], GOLD);
  caixa(M + bw + 16, TU('Emissor'), ['HIGIENEX S.L.', 'CIF: B12345678', 'Carrer de la Ind\u00fastria, 25 \u00b7 46010 Val\u00e8ncia', 'Tel. 631 706 398', 'contacto@higienexvalencia.es'], NAVY);
  y += 118;

  /* Taula de productes */
  var head = [TU('Producte'), TU('Uds.'), TU('Preu/ut.')].concat(hiHaDte ? [TU('Dte.')] : []).concat([TU('Import')]);
  var body = items.map(function (it) {
    var r = [it.name + '\n' + it.unit, String(it.qty), eur(it.price)];
    if (hiHaDte) r.push(it.discountRate > 0 ? '-' + Math.round(it.discountRate * 100) + ' %' : '\u2014');
    r.push(eur(it.total)); return r;
  });
  var nc = head.length, cs = { 0: { cellWidth: 'auto' } };
  cs[1] = { cellWidth: 50, halign: 'right' }; cs[2] = { cellWidth: 74, halign: 'right' };
  if (hiHaDte) cs[3] = { cellWidth: 52, halign: 'right' };
  cs[nc - 1] = { cellWidth: 86, halign: 'right', fontStyle: 'bold', textColor: NAVY };
  doc.autoTable({
    startY: y, head: [head], body: body, theme: 'plain',
    margin: { left: M, right: M, top: 78, bottom: 70 },
    styles: { font: 'helvetica', fontSize: 9, textColor: INK, cellPadding: { top: 8, bottom: 8, left: 10, right: 10 }, valign: 'middle' },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', fontSize: 7.5, cellPadding: { top: 9, bottom: 9, left: 10, right: 10 } },
    alternateRowStyles: { fillColor: SOFT },
    columnStyles: cs,
    didParseCell: function (d) {
      if (d.section === 'head' && d.column.index >= 1) d.cell.styles.halign = 'right';
      if (d.section === 'body' && d.column.index === 0) {
        d.cell.styles.fontStyle = 'bold';
        if (window.HXPDF && HXPDF.foto && HXPDF.foto(items[d.row.index].name)) { d.cell.styles.cellPadding = { top: 9, bottom: 9, left: 46, right: 10 }; d.cell.styles.minCellHeight = 42; }
      }
      if (d.section === 'body' && hiHaDte && d.column.index === 3 && d.cell.raw !== '\u2014') { d.cell.styles.textColor = GOLD_D; d.cell.styles.fontStyle = 'bold'; }
    },
    willDrawCell: function (d) { if (d.section === 'body' && d.column.index === 0) { d.cell._txt = String(d.cell.raw).split('\n'); d.cell.text = []; } },
    didDrawCell: function (d) {
      /* Nom del producte en negreta i, a sota, la unitat en gris */
      if (d.section === 'body' && d.column.index === 0 && window.HXPDF && HXPDF.miniatura) HXPDF.miniatura(doc, items[d.row.index].name, d.cell.x + 8, d.cell.y + 5, 30, d.cell.height - 10);
      if (d.section === 'body' && d.column.index === 0 && d.cell._txt) {
        var cx = d.cell.x + d.cell.padding('left'), cy = d.cell.y + d.cell.height / 2;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); color(INK); doc.text(d.cell._txt[0], cx, cy - 1);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); color(MUTED); doc.text(d.cell._txt[1] || '', cx, cy + 9);
      }
      if (d.section === 'body') { stroke(LINE); doc.setLineWidth(0.5); doc.line(d.cell.x, d.cell.y + d.cell.height, d.cell.x + d.cell.width, d.cell.y + d.cell.height); } },
    didDrawPage: function (d) { if (d.pageNumber > 1) capcalera(false); }
  });
  y = doc.lastAutoTable.finalY + 20;

  /* Totals + condicions */
  var nFiles = 3 + (descompte > 0 ? 1 : 0) + (dtoCli > 0 ? 1 : 0), th = 26 + nFiles * 20 + 44;
  if (y + th + 84 > H - 56) { doc.addPage(); capcalera(false); y = 84; }
  var tw = 230, tx = W - M - tw;
  stroke(LINE); doc.setLineWidth(0.6); doc.setFillColor(255, 255, 255); doc.roundedRect(tx, y, tw, th, 5, 5, 'FD');
  var yt = y + 24;
  function filaT(l, v, c) { doc.setFont('helvetica', c ? 'bold' : 'normal'); doc.setFontSize(9.5); color(c || TXT); doc.text(l, tx + 14, yt); color(c || INK); doc.text(v, W - M - 14, yt, { align: 'right' }); yt += 20; }
  filaT(T('Subtotal productes'), eur(subtotalBrut));
  if (descompte > 0) filaT(T('Descompte per volum'), '-' + eur(descompte), GOLD_D);
  if (dtoCli > 0) filaT(T('Descompte de client ({0} %)', impP.pct), '-' + eur(dtoCli), GOLD_D);
  filaT(T('Transport'), eur(TRANSPORT));
  filaT(T('IVA ({0} %)', Math.round(IVA_PCT * 100)), eur(iva));
  var ytot = y + th - 44;
  fill(NAVY); doc.roundedRect(tx, ytot, tw, 44, 5, 5, 'F'); doc.rect(tx, ytot, tw, 8, 'F');
  kicker(TU('Total'), tx + 14, ytot + 26, [178, 200, 222]);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(255, 255, 255); doc.text(eur(total), W - M - 14, ytot + 28, { align: 'right' });

  var cwid = W - 2 * M - tw - 18, yc = y + 28;
  kicker(TU('Condicions'), M, y + 12);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.4); color(TXT);
  [T('Pressupost sense compromís, vàlid fins al {0}.', dd(validesa)),
   T('Preus en euros. Descomptes per volum aplicats automàticament.'),
   T('Transport de {0} per comanda. IVA del {1} % inclòs al total.', eur(TRANSPORT), Math.round(IVA_PCT * 100)),
   T('Per confirmar la comanda, indica el número {0} al nostre equip comercial.', num)
  ].forEach(function (t) { var ls = doc.splitTextToSize(t, cwid - 12); fill(GOLD); doc.circle(M + 2.5, yc - 3, 1.8, 'F'); doc.text(ls, M + 12, yc); yc += ls.length * 11 + 5; });
  y += Math.max(th, yc - y) + 20;

  /* Crida a l'acció */
  if (y + 82 > H - 60) { doc.addPage(); capcalera(false); y = 84; }
  fill(CREAM); stroke([245, 214, 140]); doc.setLineWidth(0.6); doc.roundedRect(M, y, W - 2 * M, 76, 6, 6, 'FD');
  /* QR que porta a la web per fer la comanda */
  var teQR = false;
  if (window.QRCode && typeof window.QRCode.create === 'function') {
    try {
      var qq = window.QRCode.create('https://ossama450298-commits.github.io/Higienexweb/?seccio=productes', { errorCorrectionLevel: 'M' });
      var qn = qq.modules.size, qd = qq.modules.data, qm = 54, qp = qm / qn, qx = M + 11, qy = y + 11;
      doc.setFillColor(255, 255, 255); doc.roundedRect(M + 8, y + 8, 60, 60, 4, 4, 'F');
      fill(NAVY);
      for (var qj = 0; qj < qn; qj++) for (var qi = 0; qi < qn; qi++) if (qd[qj * qn + qi]) doc.rect(qx + qi * qp, qy + qj * qp, qp + 0.05, qp + 0.05, 'F');
      teQR = true;
    } catch (e) { /* sense QR */ }
  }
  var cxx = M + (teQR ? 84 : 16);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); color(INK); doc.text(T('Vols confirmar-lo o ajustar quantitats?'), cxx, y + 26);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.6); color(TXT);
  doc.text(doc.splitTextToSize(T('Escriu a contacto@higienexvalencia.es o truca al 631 706 398 indicant el número de pressupost.') + (teQR ? ' ' + T('O escaneja el codi per fer la comanda a la web.') : ''), W - M - cxx - 16).slice(0, 3), cxx, y + 42);

  /* Peu a totes les pàgines */
  var n = doc.getNumberOfPages();
  for (var i = 1; i <= n; i++) {
    doc.setPage(i);
    stroke(GOLD); doc.setLineWidth(1); doc.line(M, H - 48, W - M, H - 48);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.6); color(MUTED);
    doc.text('HIGIENEX S.L.  \u00b7  CIF B12345678  \u00b7  Carrer de la Ind\u00fastria, 25, 46010 Val\u00e8ncia  \u00b7  631 706 398  \u00b7  contacto@higienexvalencia.es', M, H - 34);
    doc.text(T('Pàg.') + ' ' + i + ' / ' + n, W - M, H - 34, { align: 'right' });
  }
  if (senseDesar) return { doc: doc, num: num, validesa: dd(validesa), total: total };
  doc.save(hxNomPdf('pressupost', num));
}
window.descarregarPressupostPDF = descarregarPressupostPDF;

function enviarPressupostEmail() {
  var items = pressupostItems();
  if (!items.length) { showToast('Afegeix almenys un producte per generar el pressupost.', '⚠️'); return; }
  var info = pressupostClientInfo();
  // Amb sessió iniciada, s'envia a l'email del compte encara que el camp estigui buit.
  if (hxApiToken() && window.HX_USER && HX_USER.email) info.email = HX_USER.email;
  if (!info.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    showToast('Introdueix un email vàlid per rebre el pressupost.', '⚠️');
    return;
  }
  var btn = document.getElementById('presEnviarBtn');
  var subtotal = items.reduce(function(s, i){ return s + i.total; }, 0);
  var total = hxImports(subtotal).total; // con el descuento de cliente, si lo tiene
  /* El email que recibe el cliente va en el idioma que tiene elegido en la web. */
  var T = function () { return window.HXT ? HXT.apply(null, arguments) : arguments[0]; };
  var loc = window.HXT ? HXT.locale() : 'ca-ES';
  var eurL = function (n) { return Number(n).toLocaleString(loc, { style: 'currency', currency: 'EUR' }); };
  var resumText = items.map(function(i){ return i.qty + ' × ' + i.name + ' — ' + eurL(i.total); }).join('\n');
  var numPres = pressupostInvoiceNum();
  var params = {
    to_email: info.email,
    email: info.email,
    empresa: info.empresa || '—',
    contacte: info.contacte || '—',
    resum: resumText,
    total: eurL(total),
    invoice_num: numPres,
    title: T('El teu pressupost {0} — HIGIENEX', numPres),
    name: info.contacte || info.empresa || '',
    badge: T('PRESSUPOST'),
    subtitle: T('Aquí tens el pressupost que has preparat a la nostra web. És vàlid durant 30 dies.'),
    detail_label: T('Detall del pressupost'),
    time: new Date().toLocaleString(loc),
    lang: hxIdiomaWeb(),
    message: T('Empresa') + ': ' + (info.empresa || '—') + '\n' +
      T('Pressupost') + ': ' + numPres + '\n\n' + resumText + '\n\n' +
      T('Transport') + ': ' + eurL(TRANSPORT) + '\n' +
      T('Total (IVA inclòs)') + ': ' + eurL(total) + '\n\n' +
      T('Per confirmar la comanda o canviar quantitats, respon aquest correu o truca’ns al 631 706 398 indicant el número de pressupost.')
  };
  if (btn) { btn.disabled = true; btn.textContent = T('Enviant…'); }
  // Amb sessió iniciada, el pressupost arriba en PDF a l'email del compte.
  var pdfPres = null;
  if (hxApiToken() && window.jspdf) {
    try { pdfPres = descarregarPressupostPDF(true); } catch (e) { console.warn('PDF del pressupost:', e); }
  }
  if (pdfPres && pdfPres.doc) {
    var fdP = new FormData();
    fdP.append('num', pdfPres.num);
    fdP.append('total', String(Math.round(pdfPres.total * 100) / 100));
    fdP.append('validesa', pdfPres.validesa);
    fdP.append('lang', hxIdiomaWeb());
    fdP.append('items', JSON.stringify(items.map(function (i) { return { name: i.name, qty: i.qty, total: Math.round(i.total * 100) / 100 }; })));
    fdP.append('pdf', pdfPres.doc.output('blob'), hxNomPdf('pressupost', pdfPres.num));
    fetch(HX_API_BASE + '/notify-pressupost', { method: 'POST', headers: { Authorization: 'Bearer ' + hxApiToken() }, body: fdP })
      .then(function (r) { if (!r.ok) throw new Error('Error ' + r.status); })
      .then(function () {
        var dest = (window.HX_USER && HX_USER.email) || info.email;
        showToast(T('Pressupost {0} enviat a {1}', pdfPres.num, dest), '✅');
        if (btn) { btn.disabled = false; btn.textContent = "✉️ Enviar-me'l per email"; }
      })
      .catch(function (err) {
        console.warn('Error enviant el pressupost en PDF:', err);
        showToast('No s\'ha pogut enviar l\'email. Torna-ho a provar més tard.', '⚠️');
        if (btn) { btn.disabled = false; btn.textContent = "✉️ Enviar-me'l per email"; }
      });
    return;
  }
  hxNotify('pressupost', params).then(function(){
    showToast('Pressupost enviat a ' + info.email + ' ✅', '✅');
    if (btn) { btn.disabled = false; btn.textContent = "✉️ Enviar-me'l per email"; }
  }).catch(function(err){
    console.warn('Error enviant pressupost per email:', err);
    showToast('No s\'ha pogut enviar l\'email. Torna-ho a provar més tard.', '⚠️');
    if (btn) { btn.disabled = false; btn.textContent = "✉️ Enviar-me'l per email"; }
  });
}
window.enviarPressupostEmail = enviarPressupostEmail;

document.addEventListener('DOMContentLoaded', function(){
  if (document.getElementById('pressupostLines')) renderPressupost();
});

function updateCartBadge() {
  var badge = document.getElementById('cartBadge');
  if (!badge) return;
  var count = 0;
  Object.keys(cart).forEach(function(k){ count += cart[k].qty; });
  if (count > 0) { badge.style.display = 'flex'; badge.textContent = count > 99 ? '99+' : count; }
  else badge.style.display = 'none';
}
window.updateCartBadge = updateCartBadge;

function renderCart() {
  guardarCarret();
  updateCartBadge();
  var items   = document.getElementById('cartItems');
  var tot     = document.getElementById('cartTotal');
  var totAmt  = document.getElementById('cartTotalAmount');
  var keys = Object.keys(cart);
  if (!items) return;
  if (!keys.length) {
    items.innerHTML = '<p style="color:#aaa;font-size:0.85rem;text-align:center;padding:1.5rem 0;">' + escHtml(typeof cpT === 'function' ? cpT('t292') : 'Cap producte afegit encara') + '</p>';
    if (tot) tot.style.display = 'none';
    return;
  }
  var subtotal = 0;
  items.innerHTML = keys.map(function(k) {
    var it = cart[k];
    // En pantalla, preu sense descompte: el descompte per volum només surt al correu i als PDF.
    var brut = it.rawTotal != null ? it.rawTotal : it.total;
    subtotal += brut;
    return '<div style="display:flex;justify-content:space-between;padding:0.55rem 0;border-bottom:1px solid #F0F0F0;font-size:0.84rem;">' +
      '<span style="color:#444;">' + k + ' <strong>x' + it.qty + '</strong></span>' +
      '<span style="font-weight:700;color:#0B3D6B;">' + hxFormatPrice(brut) + '</span>' +
      '</div>';
  }).join('');

  // IVA sobre productos + transporte (precio sin descuento; al pagar se cobra con el descuento)
  var iva   = hxRedon(hxRedon(subtotal + TRANSPORT) * IVA_PCT);
  var total = hxRedon(subtotal + TRANSPORT + iva);

  items.innerHTML += '<div style="margin-top:0.8rem;padding-top:0.8rem;border-top:1px dashed #ddd;font-size:0.82rem;color:#666;">' +
    '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span>Subtotal</span><span>' + hxFormatPrice(subtotal) + '</span></div>' +
    '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span>Transport</span><span>' + hxFormatPrice(TRANSPORT) + '</span></div>' +
    '<div style="display:flex;justify-content:space-between;padding:0.3rem 0;"><span>IVA (21%)</span><span>' + hxFormatPrice(iva) + '</span></div>' +
    '</div>';

  if (tot) tot.style.display = 'flex';
  if (totAmt) totAmt.innerHTML = '<strong style="font-size:1.1rem;">' + hxFormatPrice(total) + '</strong>';
}
// ── DOCUMENT IMPRIMIBLE / DESCARREGABLE DE LA COMANDA ──────────────
// Mateix patró que ja fas servir al ERP per a les factures: s'obre una
// finestra nova amb l'HTML de la comanda i es llança el diàleg
// d'impressió del navegador — triant "Desar com a PDF" el client obté
// el PDF descarregat, sense dependre de cap llibreria externa.
function descargarPDFDirecto(filename, htmlDoc, onDone) {
  if (typeof window.jspdf === 'undefined' || typeof window.html2canvas === 'undefined') {
    // Les llibreries encara no han carregat (o han fallat): usem el mètode
    // d'impressió del navegador com a alternativa fiable.
    abrirImprimibleFallback(filename.replace(/\.pdf$/i, ''), htmlDoc);
    if (onDone) onDone();
    return;
  }
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-99999px;top:0;width:900px;height:1200px;border:0;opacity:0;';
  document.body.appendChild(iframe);
  iframe.onload = function () {
    setTimeout(function () {
      try {
        var doc0 = iframe.contentDocument;
        var body = doc0.body;
        var alturaReal = Math.max(body.scrollHeight, doc0.documentElement.scrollHeight);
        iframe.style.height = alturaReal + 'px';
        // Captura exacta del document (amb tot el seu disseny) i el PDF es
        // munta a partir d'aquesta imatge. Abans s'usava doc.html(), que
        // redibuixava el text i perdia bona part del CSS.
        var opcions = { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 900, width: 900, height: alturaReal, windowHeight: alturaReal };
        // 1r intent: el navegador mateix dibuixa el text (foreignObject), idèntic al que es veu en pantalla.
        // Si el navegador no ho suporta o la captura surt en blanc, es torna al mode normal.
        html2canvas(body, Object.assign({ foreignObjectRendering: true }, opcions))
          .then(function (canvas) { return canvasBuit(canvas) ? html2canvas(body, opcions) : canvas; },
                function () { return html2canvas(body, opcions); })
          .then(function (canvas) {
            pdfDesDeCanvas(canvas, filename);
            document.body.removeChild(iframe);
            if (onDone) onDone();
          })
          .catch(function (e) {
            console.warn('No s\'ha pogut generar el PDF directe, usant alternativa:', e);
            if (iframe.parentNode) document.body.removeChild(iframe);
            abrirImprimibleFallback(filename.replace(/\.pdf$/i, ''), htmlDoc);
            if (onDone) onDone();
          });
      } catch (e) {
        console.warn('No s\'ha pogut generar el PDF directe, usant alternativa:', e);
        document.body.removeChild(iframe);
        abrirImprimibleFallback(filename.replace(/\.pdf$/i, ''), htmlDoc);
        if (onDone) onDone();
      }
    }, 60);
  };
  iframe.srcdoc = htmlDoc;
}
window.descargarPDFDirecto = descargarPDFDirecto;

// Una captura «buida» (tot del mateix color) vol dir que el mode foreignObject ha fallat.
function canvasBuit(canvas) {
  try {
    var d = canvas.getContext('2d').getImageData(0, 0, canvas.width, Math.min(canvas.height, 400)).data;
    for (var i = 4; i < d.length; i += 40) { if (Math.abs(d[i] - d[0]) > 8 || Math.abs(d[i + 1] - d[1]) > 8 || Math.abs(d[i + 2] - d[2]) > 8) return false; }
    return true;
  } catch (e) { return true; }
}

// Converteix la captura d'un document en un PDF A4 de diverses pàgines.
// Talla cada pàgina en una franja blanca (entre línies) perquè cap text
// quedi partit per la meitat.
function pdfDesDeCanvas(canvas, filename) {
  var jsPDF = window.jspdf.jsPDF;
  var pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  var PW = 595.28, PH = 841.89, MARGE = 24;          // marge de dalt i de baix a partir de la 2a pàgina
  var ratio = PW / canvas.width;                     // punts per píxel de la captura
  var ctx = canvas.getContext('2d');
  // Dues files iguals (amb tolerància): no hi passa cap línia de text ni cap vora.
  function filesIguals(y1, y2) {
    var a = ctx.getImageData(0, y1, canvas.width, 1).data, b = ctx.getImageData(0, y2, canvas.width, 1).data;
    for (var i = 0; i < a.length; i += 8) { if (Math.abs(a[i] - b[i]) > 6 || Math.abs(a[i + 1] - b[i + 1]) > 6 || Math.abs(a[i + 2] - b[i + 2]) > 6) return false; }
    return true;
  }
  // Bon lloc per tallar: tres files seguides iguals (un espai entre línies).
  function filaBuida(y) { return y > 0 && y + 1 < canvas.height && filesIguals(y - 1, y) && filesIguals(y, y + 1); }
  // Zona sense contingut: totes les files iguals a la primera (només marge o fons).
  function zonaBuida(y0, alt) {
    for (var f = 1; f < alt; f += 2) { if (!filesIguals(y0, y0 + f)) return false; }
    return true;
  }
  var y = 0, pagina = 0;
  while (y < canvas.height - 2) {
    var dalt = pagina === 0 ? 0 : MARGE;
    var maxAlt = Math.floor((PH - dalt - MARGE) / ratio);
    var tall = Math.min(canvas.height, y + maxAlt);
    if (tall < canvas.height) {                      // busca cap amunt una fila en blanc (fins a un 25 % de la pàgina)
      for (var k = tall; k > tall - maxAlt * 0.25; k--) { if (filaBuida(k)) { tall = k; break; } }
    }
    var alt = tall - y;
    if (pagina > 0 && zonaBuida(y, alt)) break;        // només queda marge (sense text ni dibuix): no cal una pàgina més
    var tros = document.createElement('canvas');
    tros.width = canvas.width; tros.height = alt;
    var c2 = tros.getContext('2d');
    c2.fillStyle = '#ffffff'; c2.fillRect(0, 0, tros.width, alt);
    c2.drawImage(canvas, 0, y, canvas.width, alt, 0, 0, canvas.width, alt);
    if (pagina > 0) pdf.addPage();
    pdf.addImage(tros.toDataURL('image/jpeg', 0.9), 'JPEG', 0, dalt, PW, alt * ratio);
    y = tall; pagina++;
  }
  pdf.save(filename);
}

function abrirImprimibleFallback(titol, html) {
  var w = window.open('', '_blank');
  if (!w) { alert('El navegador ha bloquejat la finestra emergent. Permet les finestres emergents per descarregar el document.'); return; }
  w.document.open(); w.document.write(html); w.document.close();
  w.focus();
  setTimeout(function(){ try { w.print(); } catch(e){} }, 350);
}

function abrirImprimibleComanda(titol, html) {
  descargarPDFDirecto(titol.replace(/\s+/g, '_') + '.pdf', html);
}

function htmlComanda(inv, items, clientInfo) {
  var hiHaDescomptes = items.some(function(it){ return it.discountRate > 0; });
  var filesHTML = items.map(function(it, idx){
    var descompteCell = '';
    if (hiHaDescomptes) {
      descompteCell = it.discountRate > 0
        ? '<td class="num"><span class="pill">-' + Math.round(it.discountRate*100) + '%</span></td>'
        : '<td class="num muted">—</td>';
    }
    var preuUnitariBase = it.rawTotal ? (it.rawTotal / it.qty) : (it.total / it.qty);
    return '<tr class="' + (idx % 2 ? 'alt' : '') + '"><td class="pname">' + escHtml(it.name) + '</td><td class="num">' + it.qty + '</td><td class="num muted">' +
      preuUnitariBase.toFixed(2) + ' €</td>' + descompteCell + '<td class="num strong">' + it.total.toFixed(2) + ' €</td></tr>';
  }).join('');
  var totalDescompte = items.reduce(function(s,i){ return s + (i.discountRate > 0 ? (i.rawTotal - i.total) : 0); }, 0);
  var subtotal = items.reduce(function(s,i){ return s + i.total; }, 0);
  var transport = TRANSPORT || 0;
  var base = subtotal + transport;
  var iva = base * IVA_PCT;
  return '<!DOCTYPE html><html lang="ca"><head><meta charset="UTF-8"><title>Comanda ' + escHtml(inv.invoiceNum) + ' · HIGIENEX S.L.</title>' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'html{background:#EDEAE2}' +
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#16232E;background:#FBFAF7;font-size:13px;line-height:1.5;position:relative}' +
    '.sheet{max-width:760px;margin:0 auto;padding:46px 50px 38px;position:relative;overflow:hidden}' +
    '.watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:Georgia,\'Times New Roman\',serif;font-size:520px;font-weight:700;color:#0B3D6B;opacity:0.028;line-height:1;pointer-events:none;z-index:0;user-select:none}' +
    '.sheet > *:not(.watermark){position:relative;z-index:1}' +
    '.top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;margin-bottom:6px}' +
    '.brand{font-size:27px;font-weight:700;color:#0B3D6B;font-family:Georgia,\'Times New Roman\',serif;letter-spacing:.01em}.brand span{color:#F2A900}' +
    '.brand-sub{font-size:10.5px;color:#64748B;margin-top:7px;line-height:1.65}' +
    '.doc{text-align:right}' +
    '.doc .kicker{font-size:10px;letter-spacing:.12em;color:#B8860B;font-weight:700;margin-bottom:3px}' +
    '.doc h1{font-size:21px;font-weight:700;margin:0 0 6px 0;color:#16232E;font-family:Georgia,\'Times New Roman\',serif}' +
    '.doc .num{font-size:14px;font-weight:700;font-family:ui-monospace,Consolas,monospace;color:#0B3D6B;background:#EAF1F8;padding:3px 10px;border-radius:20px;display:inline-block}' +
    '.rule{height:1px;background:linear-gradient(90deg,#0B3D6B 0%,#0B3D6B 60%,#F2A900 100%);margin-bottom:26px}' +
    '.stamp{margin:12px 0 0 auto;width:78px;height:78px;border:2px solid #2E7D32;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(-10deg)}' +
    '.stamp .st{font-size:8.5px;font-weight:800;letter-spacing:.06em;color:#2E7D32;line-height:1.35;font-family:Georgia,serif}' +
    '.meta{display:flex;gap:0;margin-bottom:28px;border:1px solid #E3E8ED;border-radius:10px;overflow:hidden}' +
    '.box{flex:1;padding:14px 18px;background:#fff}' +
    '.box + .box{border-left:1px solid #E3E8ED}' +
    '.box h3{font-size:9.5px;letter-spacing:.1em;color:#B8860B;font-weight:700;margin:0 0 7px 0}' +
    '.box p{margin:0;line-height:1.65;color:#33424F}' +
    '.box p strong{color:#16232E}' +
    'table{width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:22px}' +
    'thead th{border-bottom:2px solid #16232E;padding:9px 4px;text-align:left;font-size:10px;letter-spacing:.07em;color:#16232E;font-weight:700}' +
    'tbody td{padding:11px 4px;border-bottom:1px solid #EDF1F4;vertical-align:middle}' +
    'tbody tr.alt td{background:#FAFBFC}' +
    'td.pname{font-weight:600;color:#16232E}' +
    'td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}' +
    'td.muted{color:#8A9BAC}td.strong{font-weight:700;color:#0B3D6B}' +
    '.pill{background:#FFF6E0;color:#B8860B;font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px}' +
    '.totwrap{display:flex;justify-content:flex-end}' +
    '.totbox{width:290px}' +
    '.totbox .l{display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;color:#4A5A6A}' +
    '.totbox .l.discount{color:#B8860B;font-weight:600}' +
    '.totbox .tot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding:14px 16px;background:#0B3D6B;border-radius:10px}' +
    '.totbox .tot span:first-child{color:#BFD4E8;font-size:11px;letter-spacing:.08em;font-weight:700}' +
    '.totbox .tot span:last-child{color:#fff;font-size:20px;font-weight:700;font-family:Georgia,serif}' +
    '.foot{margin-top:34px;padding-top:16px;border-top:1px solid #E3E8ED;display:flex;justify-content:space-between;align-items:flex-end;gap:20px}' +
    '.foot p{font-size:9.5px;color:#94A3B0;line-height:1.6;max-width:440px}' +
    '.foot .seal{font-family:Georgia,serif;font-size:11px;color:#0B3D6B;font-weight:700;text-align:right;white-space:nowrap}' +
    '.foot .seal small{display:block;font-family:-apple-system,Arial,sans-serif;font-weight:400;color:#94A3B0;font-size:9px;letter-spacing:.04em;margin-top:2px}' +
    'thead{display:table-header-group}tr{page-break-inside:avoid}.box{page-break-inside:avoid}.totwrap{page-break-inside:avoid}.foot{page-break-inside:avoid}' +
    '@media print{ html,body{background:#fff;font-size:12px} .sheet{padding:6px 2px} .watermark{font-size:440px} .top{padding-bottom:14px} .meta{margin-bottom:18px} table{margin-bottom:14px} tbody td{padding:7px 4px} .box{padding:10px 14px} .rule{margin-bottom:16px} .foot{margin-top:20px;padding-top:10px} @page{margin:12mm} }' +
    '</style></head><body>' +
    '<div class="sheet">' +
    '<div class="watermark">X</div>' +
    '<div class="top">' +
      '<div><div class="brand">HIGIENE<span>X</span></div>' +
      '<div class="brand-sub">HIGIENEX S.L. · CIF B12345678<br>Carrer de la Indústria, 25, 46010 València<br>contacto@higienexvalencia.es · 631 706 398</div></div>' +
      '<div class="doc"><div class="kicker">JUSTIFICANT DE COMANDA</div><h1>Comanda</h1><div class="num">' + escHtml(inv.invoiceNum) + '</div><div class="stamp"><div class="st">PAGAMENT<br>CONFIRMAT ✓</div></div></div>' +
    '</div>' +
    '<div class="rule"></div>' +
    '<div class="meta">' +
      '<div class="box"><h3 data-i18n-key="t171">CLIENT</h3><p><strong>' + escHtml(clientInfo.name || '') + '</strong>' +
        (clientInfo.company ? ('<br>' + escHtml(clientInfo.company)) : '') +
        (clientInfo.email ? ('<br>' + escHtml(clientInfo.email)) : '') + '</p></div>' +
      '<div class="box"><h3 data-i18n-key="t172">DETALLS</h3><p>Data: <strong>' + escHtml(inv.dateStr) + '</strong><br>Lliurament estimat: <strong>' + escHtml(inv.entregaStr) + '</strong></p></div>' +
    '</div>' +
    '<table><thead><tr><th data-i18n-key="t544">PRODUCTE</th><th class="num">UDS.</th><th class="num">PREU</th>' + (hiHaDescomptes ? '<th class="num">DESCOMPTE</th>' : '') + '<th class="num">IMPORT</th></tr></thead><tbody>' + filesHTML + '</tbody></table>' +
    '<div class="totwrap"><div class="totbox">' +
    '<div class="l"><span>Subtotal productes</span><span>' + subtotal.toFixed(2) + ' €</span></div>' +
    (totalDescompte > 0 ? ('<div class="l discount"><span>Descomptes per volum</span><span>-' + totalDescompte.toFixed(2) + ' €</span></div>') : '') +
    (transport ? ('<div class="l"><span>Transport</span><span>' + transport.toFixed(2) + ' €</span></div>') : '') +
    '<div class="l"><span>IVA (' + Math.round(IVA_PCT*100) + '%)</span><span>' + iva.toFixed(2) + ' €</span></div>' +
    '<div class="tot"><span>TOTAL</span><span>' + inv.total.toFixed(2) + ' €</span></div>' +
    '</div></div>' +
    '<div class="foot">' +
      '<p>Aquest document és un justificant de comanda, no una factura oficial. La factura es generarà un cop expedida la mercaderia. Per a qualsevol consulta, contacta amb nosaltres indicant el número de comanda.</p>' +
      '<div class="seal">HIGIENE<span style="color:#F2A900">X</span><small>' + new Date().toLocaleString('ca-ES') + '</small></div>' +
    '</div>' +
    '</div>' +
    '</body></html>';
}

function generateComanda() {
  var keys = Object.keys(cart);
  if (!keys.length) return null;

  // ── Dates ──
  var date  = new Date();
  var dd    = String(date.getDate()).padStart(2,'0');
  var mm    = String(date.getMonth()+1).padStart(2,'0');
  var yyyy  = date.getFullYear();
  var dateStr = dd + '/' + mm + '/' + yyyy;
  var entrega = new Date(date.getTime() + 5*24*60*60*1000); // lliurament estimat: 5 dies laborables
  var entregaStr = String(entrega.getDate()).padStart(2,'0') + '/' + String(entrega.getMonth()+1).padStart(2,'0') + '/' + entrega.getFullYear();
  var seq   = String(Math.floor(Math.random()*9000)+1000);
  var comandaNum = 'C' + yyyy + '-' + seq;

  // ── Client info ──
  var userName = (document.getElementById('userName') || {}).textContent || 'Client';
  var clientInfo = { dir:'-', cif:'-', cp:'-', email:'-', name: userName };
  function _findUser() {
    var srcs = [USERS, REGISTERED_USERS];
    for (var i=0; i<srcs.length; i++) {
      var ks = Object.keys(srcs[i]);
      for (var j=0; j<ks.length; j++) {
        if (srcs[i][ks[j]].name === userName) return { email: ks[j], data: srcs[i][ks[j]] };
      }
    }
    return null;
  }
  var fu = _findUser();
  if (!fu && window.HX_PROFILE) fu = { email: HX_PROFILE.email, data: HX_PROFILE };
  if (fu) {
    clientInfo.email   = fu.email;
    clientInfo.name    = fu.data.name    || userName;
    clientInfo.company = fu.data.company || '';
    clientInfo.cif     = fu.data.cif     || '-';
    clientInfo.dir     = fu.data.address || '-';
    clientInfo.cp      = fu.data.cp      || '-';
  }

  // Compra como invitado (invitado.js): nombre y correo que ha escrito
  if (!window.HX_USER && window.HX_GUEST && window.HX_GUEST.email) {
    clientInfo.email = HX_GUEST.email;
    clientInfo.name = HX_GUEST.name || clientInfo.name;
    clientInfo.company = HX_GUEST.company || '';
  }

  // ── Totals (BASE = productos + transporte) ──
  var products  = Object.values(cart).reduce(function(s,i){ return s+i.total; }, 0);
  var imp       = hxImports(products); // con el descuento de cliente, si lo tiene
  var total     = imp.total;

  // Ja no es genera cap PDF: nomes calculem les dades de la comanda per a
  // l'historial i per al cos de l'email de confirmació que rep el client.
  return {
    invoiceNum: comandaNum,
    total: total,
    dtoCliPct: imp.pct,
    dtoCliImp: imp.dteCli,
    email: (clientInfo.email && clientInfo.email !== '-') ? clientInfo.email : '',
    dateStr: dateStr,
    entregaStr: entregaStr
  };
}

// ── HISTORIAL DE COMANDES (per usuari, localStorage) ──────────────
function ordersKey() {
  var email = (window.HX_USER && window.HX_USER.email) ? window.HX_USER.email.toLowerCase() : '';
  return 'hx_orders_' + (email || 'convidat');
}
var HX_SERVER_ORDERS = null, _hxOrdersLoading = false;
function hxFetchOrders() {
  if (_hxOrdersLoading || !hxApiToken()) return;
  _hxOrdersLoading = true;
  hxPujarComandesLocals().then(function(){ return hxApi('/orders'); }).then(function(d){
    HX_SERVER_ORDERS = (d.orders || []).map(function(o){
      return { invoiceNum: o.invoiceNum, date: new Date(o.date).toLocaleString(hxLocaleData()), total: o.total, items: o.items, status: o.status, site: o.site || '' };
    });
    _hxOrdersLoading = false; renderOrderHistory();
  }).catch(function(){ _hxOrdersLoading = false; });
}
function hxLocaleData() {
  var l = 'ca'; try { l = localStorage.getItem('hx_lang') || 'ca'; } catch(e) {}
  return { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ar: 'ar-u-nu-latn' }[l] || 'ca-ES';
}
// Abans l'historial només es guardava al navegador. Si queden comandes antigues
// d'aquest compte, es pugen una sola vegada al servidor i s'esborra la còpia local.
function hxPujarComandesLocals() {
  var clau = ordersKey(), llista = [];
  if (!/^hx_orders_.+@/.test(clau)) return Promise.resolve();
  try { llista = JSON.parse(localStorage.getItem(clau) || '[]'); } catch(e) { llista = []; }
  if (!Array.isArray(llista) || !llista.length) { try { localStorage.removeItem(clau); } catch(e) {} return Promise.resolve(); }
  var data = function(t) {
    var m = String(t || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d{2})/);
    return m ? new Date(+m[3], m[2] - 1, +m[1], +m[4], +m[5]).toISOString() : '';
  };
  var cos = { orders: llista.slice(0, 30).map(function(o){
    return { invoiceNum: o.invoiceNum, total: o.total, date: data(o.date),
      items: (o.items || []).map(function(it){ return { name: it.name, qty: it.qty, total: it.total }; }) };
  }) };
  return hxApi('/orders/import', { method: 'POST', body: cos })
    .then(function(){ try { localStorage.removeItem(clau); } catch(e) {} })
    .catch(function(){ /* es tornarà a provar el pròxim cop */ });
}
function loadOrderHistory() {
  if (HX_SERVER_ORDERS) return HX_SERVER_ORDERS;
  try {
    var raw = localStorage.getItem(ordersKey());
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}
function saveOrderToHistory(inv, items) {
  var ambCompte = !!hxApiToken(), list0 = null;
  try {
    var list = loadOrderHistory();
    list.unshift(list0 = {
      invoiceNum: inv.invoiceNum,
      site: window.HX_SEDE_SEL || '',
      date: new Date().toLocaleString(hxLocaleData()),
      total: inv.total,
      items: items,
      status: 'Pendent de confirmació'
    });
    if (list.length > 30) list = list.slice(0, 30);
    // Amb compte, la llista és la del servidor (es veu des de qualsevol dispositiu);
    // la còpia al navegador només es fa servir sense compte.
    if (ambCompte) HX_SERVER_ORDERS = list;
    else localStorage.setItem(ordersKey(), JSON.stringify(list));
  } catch(e) { console.warn('No s\'ha pogut desar l\'historial de comandes:', e); }
  // Copia en la base de datos (accesible desde cualquier dispositivo y desde el ERP)
  var email = (window.HX_USER && window.HX_USER.email) || inv.email || '';
  // La promesa queda guardada: el correu amb el PDF espera que la comanda existeixi al servidor.
  window.HX_ORDER_SAVED = hxApi('/orders', { method: 'POST', body: { invoiceNum: inv.invoiceNum, total: inv.total, email: email, site: window.HX_SEDE_SEL || '',
    items: (items || []).map(function(it){ return { name: it.name, qty: it.qty, total: it.total }; }) } })
    .then(function(){ if (ambCompte) { HX_SERVER_ORDERS = null; renderOrderHistory(); } return email; })
    .catch(function(e){
      console.warn('No s\'ha pogut desar la comanda al servidor:', e);
      // Sense connexió: es guarda al navegador i es pujarà en el pròxim inici de sessió.
      if (ambCompte && list0) { try { var l = JSON.parse(localStorage.getItem(ordersKey()) || '[]'); l.unshift(list0); localStorage.setItem(ordersKey(), JSON.stringify(l.slice(0, 30))); } catch(x) {} }
      return null;
    });
}
function renderOrderHistory() {
  var box = document.getElementById('orderHistory');
  if (!box) return;
  if (!window.HX_USER) { box.innerHTML = ''; box.style.display = 'none'; return; }
  if (!HX_SERVER_ORDERS) hxFetchOrders();
  var list = loadOrderHistory();
  if (!list.length) {
    box.style.display = 'block';
    box.innerHTML = '<h3 style="color:#0B3D6B;font-size:0.95rem;font-weight:700;margin:1.6rem 0 0.6rem;">' + escHtml(typeof cpT === 'function' ? cpT('t173') : '📦 Les meves comandes') + '</h3>' +
      '<p style="color:#888;font-size:0.85rem;">' + escHtml(typeof cpT === 'function' ? cpT('t766') : 'Encara no has fet cap comanda') + '.</p>';
    return;
  }
  var rows = list.map(function(o, idx){
    var itemsTxt = o.items.map(function(it){ return it.name + ' ×' + it.qty; }).join(', ');
    return '<div style="border:1px solid #EEF2F5;border-radius:12px;padding:0.8rem 1rem;margin-bottom:0.6rem;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        '<strong style="color:#0B3D6B;font-size:0.9rem;">' + escHtml(o.invoiceNum) + '</strong>' +
        '<span style="font-size:0.78rem;color:#B8860B;background:#FFF6E0;padding:0.15rem 0.6rem;border-radius:20px;font-weight:700;">' + escHtml(o.status) + '</span>' +
      '</div>' +
      '<div style="font-size:0.8rem;color:#666;margin-top:0.3rem;">' + escHtml(o.date) + '</div>' +
      '<div style="font-size:0.82rem;color:#444;margin-top:0.3rem;">' + escHtml(itemsTxt) + '</div>' +
      (o.site ? '<div style="font-size:0.78rem;color:#0B3D6B;margin-top:0.3rem;">📍 ' + escHtml(o.site) + '</div>' : '') +
      '<div style="text-align:right;font-weight:800;color:#0B3D6B;margin-top:0.3rem;">' + hxFormatPrice(o.total) + '</div>' +
      (window.hxpBotonsComanda ? hxpBotonsComanda(idx) : '') +
    '</div>';
  }).join('');
  box.style.display = 'block';
  box.innerHTML = '<h3 style="color:#0B3D6B;font-size:0.95rem;font-weight:700;margin:1.6rem 0 0.6rem;">' + escHtml(typeof cpT === 'function' ? cpT('t173') : '📦 Les meves comandes') + '</h3>' + rows;
}
window.renderOrderHistory = renderOrderHistory;

// Correu de confirmació al client amb el justificant en PDF adjunt. Espera que la
// comanda estigui desada al servidor (el servidor ho comprova); si no hi ha PDF o
// no s'ha pogut desar, envia la confirmació de sempre, sense adjunt.
// Idioma triat a la web (inclòs l'àrab), per als correus que prepara el servidor.
// Els PDF de la web es fan amb HXT.idioma(), que per a l'àrab fa servir l'anglès.
function hxIdiomaWeb() {
  var l = 'ca';
  try { l = localStorage.getItem('hx_lang') || 'ca'; } catch (e) { /* sense emmagatzematge */ }
  return ['ca', 'es', 'en', 'fr', 'de', 'ar'].indexOf(l) >= 0 ? l : 'ca';
}
window.hxIdiomaWeb = hxIdiomaWeb;
function hxConfirmacioComanda(num, params, pdfBlob, liniaPdf, botoPdf) {
  var desada = window.HX_ORDER_SAVED || Promise.resolve(null);
  return desada.then(function(emailComanda){
    if (pdfBlob && emailComanda && emailComanda.toLowerCase() === String(params.email).toLowerCase()) {
      var fd = new FormData();
      Object.keys(params).forEach(function(k){ fd.append(k, params[k]); });
      fd.append('pdf_line', liniaPdf);
      fd.append('pdf_label', botoPdf || 'PDF');
      fd.append('num', num);
      fd.append('pdf', pdfBlob, hxNomPdf('comanda', num));
      return fetch(HX_API_BASE + '/notify-comanda', { method: 'POST', body: fd }).then(function(r){
        if (r.ok) return r.json();
        console.warn('Confirmació amb PDF no enviada (' + r.status + '), envio la de sempre.');
        return hxNotify('aviso', params);
      });
    }
    return hxNotify('aviso', params);
  });
}
window.hxConfirmacioComanda = hxConfirmacioComanda;

var _orderInFlight = false;
function sendOrder() {
  var keys = Object.keys(cart);
  if (!keys.length) { alert('Afegeix almenys un producte.'); return; }
  if (_orderInFlight) return; // evita duplicar la comanda amb un doble clic
  _orderInFlight = true;
  setTimeout(function(){ _orderInFlight = false; }, 5000);

  // Prepara les dades de la comanda (el justificant en PDF s'envia per email).
  var inv;
  try {
    inv = generateComanda();
  } catch(err) {
    console.warn('Error generant el PDF de la comanda:', err);
    inv = null;
  }
  if (!inv) {
    // PDF generation failed — abort sending the order
    _orderInFlight = false;
    return;
  }

  var historyItems = keys.map(function(k){ return { name: k, qty: cart[k].qty, total: cart[k].total, rawTotal: cart[k].rawTotal, discountRate: cart[k].discountRate || 0 }; });
  saveOrderToHistory(inv, historyItems);
  try { cpRegistrarComanda(inv, historyItems); } catch(err) { console.warn('No s\'ha pogut registrar la comanda al panel de client:', err); }

  // Es genera el justificant en PDF (sense descarregar-lo) per adjuntar-lo
  // al correu de confirmació.
  var pdfComandaBlob = null;
  try {
    var userNameForPdf = (document.getElementById('userName') || {}).textContent || 'Client no identificat';
    var clientInfoPdf = { name: userNameForPdf, email: inv.email, company: '' };
    var fuPdf = (function(){
      var srcs = [USERS, REGISTERED_USERS];
      for (var i=0; i<srcs.length; i++) {
        var ks = Object.keys(srcs[i]);
        for (var j=0; j<ks.length; j++) {
          if (srcs[i][ks[j]].name === userNameForPdf) return srcs[i][ks[j]];
        }
      }
      return null;
    })();
    if (fuPdf && fuPdf.company) clientInfoPdf.company = fuPdf.company;
    // El justificant no es descarrega: només s'envia per email al client.
    if (window.HXPDF_DOCS && HXPDF.disponible()) {
      window.HXPDF_SENSE_DESAR = true;
      try {
        var docComanda = HXPDF_DOCS.comanda(inv, historyItems, clientInfoPdf);
        if (docComanda) pdfComandaBlob = docComanda.output('blob');
      } finally { window.HXPDF_SENSE_DESAR = false; }
    }
  } catch(err) { console.warn('No s\'ha pogut generar el PDF de la comanda:', err); }

  // Enviar al client un email de confirmació amb el detall complet de la comanda
  try {
    var userName = (!window.HX_USER && window.HX_GUEST && HX_GUEST.name) || (document.getElementById('userName') || {}).textContent || 'Client no identificat';
    var filesHTML = keys.map(function(k){
      return '<tr>' +
        '<td style="padding:8px 4px;border-bottom:1px solid #EEF2F5;color:#333;">' + escHtml(k) + '</td>' +
        '<td style="padding:8px 4px;border-bottom:1px solid #EEF2F5;color:#333;text-align:center;">' + cart[k].qty + '</td>' +
        '<td style="padding:8px 4px;border-bottom:1px solid #EEF2F5;color:#0B3D6B;font-weight:600;text-align:right;">' + cart[k].total.toFixed(2) + ' €</td>' +
        '</tr>';
    }).join('');
    var cos =
      '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
        '<tr style="color:#0B3D6B;font-weight:700;border-bottom:2px solid #0B3D6B;font-size:12px;text-transform:uppercase;letter-spacing:.03em;">' +
          '<td style="padding:6px 4px;">Producte</td><td style="padding:6px 4px;text-align:center;">Uds.</td><td style="padding:6px 4px;text-align:right;">Import</td>' +
        '</tr>' +
        filesHTML +
      '</table>' +
      '<table style="width:100%;margin-top:14px;font-size:14px;">' +
        '<tr><td style="padding:3px 4px;color:#888;">Comanda</td><td style="padding:3px 4px;text-align:right;font-weight:600;color:#333;">' + escHtml(inv.invoiceNum) + '</td></tr>' +
        '<tr><td style="padding:3px 4px;color:#888;">Data de la comanda</td><td style="padding:3px 4px;text-align:right;color:#333;">' + escHtml(inv.dateStr || '') + '</td></tr>' +
        '<tr><td style="padding:3px 4px;color:#888;">Lliurament estimat</td><td style="padding:3px 4px;text-align:right;color:#333;">' + escHtml(inv.entregaStr || '') + '</td></tr>' +
        '<tr><td style="padding:8px 4px 3px;color:#0B3D6B;font-size:16px;font-weight:700;">Total</td><td style="padding:8px 4px 3px;text-align:right;font-size:18px;font-weight:800;color:#0B3D6B;">' + inv.total.toFixed(2) + ' €</td></tr>' +
      '</table>';
    // Un únic email (arriba sempre a NOTIFY_EMAIL, fixat dins la
    // plantilla d'EmailJS) amb el botó blau cap al panell per gestionar
    // la comanda. El client rep el justificant en PDF al seu propi correu
    // de confirmació, així que no calen dos emails.
    enviarNotificacioEmail({
      templateId: EMAILJS_TEMPLATE_ID_COMANDA,
      title: 'Nova comanda rebuda: ' + inv.invoiceNum + ' — ' + inv.total.toFixed(2) + ' €',
      name: userName,
      message: cos,
      email: inv.email,
      badge: 'NOVA COMANDA',
      subtitle: 'Un client acaba de fer una comanda a la web. Gestiona-la des del panell.',
      detailLabel: 'Detall de la comanda',
      data: { event: 'pedido',
        contact: { name: userName, email: inv.email, company: (window.HX_PROFILE && HX_PROFILE.company) || '' },
        items: keys.map(function(k){ return { name: k, qty: cart[k].qty, total: Math.round(cart[k].total * 100) / 100 }; }),
        order: { num: inv.invoiceNum, total: inv.total, date: inv.dateStr || '', delivery: inv.entregaStr || '' } }
    });
  } catch(e) { console.warn('No s\'ha pogut preparar l\'email de la comanda:', e); }

  // Email de confirmació per al client, en l'idioma que té triat a la web
  try {
    if (inv.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inv.email) && typeof hxNotify === 'function') {
      var Tc = function () { return window.HXT ? HXT.apply(null, arguments) : arguments[0]; };
      var locC = window.HXT ? HXT.locale() : 'ca-ES';
      var eurC = function (n) { return Number(n).toLocaleString(locC, { style: 'currency', currency: 'EUR' }); };
      // En el email sí se detalla el descuento por volumen (en pantalla no se muestra).
      var liniesC = keys.map(function(k){
        var it = cart[k], r = it.discountRate || 0;
        return it.qty + ' × ' + k + ' — ' + (r > 0 ? eurC(it.rawTotal) + ' (-' + Math.round(r * 100) + ' %) = ' : '') + eurC(it.total);
      }).join('\n');
      var dteC = keys.reduce(function(s,k){ var it = cart[k]; return s + (it.discountRate > 0 ? it.rawTotal - it.total : 0); }, 0);
      if (dteC > 0.004) liniesC += '\n' + Tc('Descompte per volum') + ': -' + eurC(dteC);
      if (inv.dtoCliPct) liniesC += '\n' + Tc('Descompte de client ({0} %)', inv.dtoCliPct) + ': -' + eurC(inv.dtoCliImp);
      var paramsC = {
        email: inv.email,
        name: (!window.HX_USER && window.HX_GUEST && HX_GUEST.name) || (document.getElementById('userName') || {}).textContent || '',
        title: Tc('Hem rebut la teva comanda {0} — HIGIENEX', inv.invoiceNum),
        badge: Tc('COMANDA CONFIRMADA'),
        subtitle: Tc('Gràcies per la teva comanda. Ja la estem preparant.'),
        detail_label: Tc('Detall de la comanda'),
        time: new Date().toLocaleString(locC),
        lang: hxIdiomaWeb(),
        delivery: inv.entregaStr || '',
        message: Tc('Comanda') + ': ' + inv.invoiceNum + '\n' +
          Tc('Data de comanda') + ': ' + (inv.dateStr || '') + '\n' +
          Tc('Lliurament estimat') + ': ' + (inv.entregaStr || '') + '\n\n' + liniesC + '\n\n' +
          Tc('Total (IVA inclòs)') + ': ' + eurC(inv.total) + '\n\n' +
          Tc('Pots seguir la comanda a la web, a «Seguiment de comanda», amb el número {0}.', inv.invoiceNum)
      };
      hxConfirmacioComanda(inv.invoiceNum, paramsC, pdfComandaBlob,
        Tc('Justificant de la comanda en PDF (descàrrega): {0}', '{PDF_URL}'), Tc('Descarregar el PDF de la comanda'))
        .catch(function(err){ console.warn('No s\'ha pogut enviar la confirmació al client:', err); });
    }
  } catch(e) { console.warn('No s\'ha pogut preparar la confirmació per al client:', e); }

  // Show success
  var s = document.getElementById('orderSuccess');
  if (s) {
    s.style.display = 'block';
    // Missatge en l'idioma de la web: el justificant ja no es descarrega, arriba per correu.
    var Tk = function (k) { return (typeof cpT === 'function' && cpT(k) !== k) ? cpT(k) : k; };
    s.innerHTML = '<strong>✅ ' + escHtml(Tk('t533')) + '</strong><br>' +
      escHtml(Tk('t167')) + ' <strong>' + escHtml(inv.invoiceNum) + '</strong>' + ' · ' + escHtml(Tk('t794')) + ': <strong>' + escHtml(hxFormatPrice(inv.total)) + '</strong><br>' +
      '<span style="font-size:0.82rem;color:#555;">' + escHtml(Tk('t339')) + '</span>';
  }
  cart = {};
  renderCart();
  renderOrderHistory();
  hxAvisComandaFeta(inv);
  setTimeout(function(){ var s=document.getElementById('orderSuccess'); if(s) s.style.display='none'; }, 10000);
}
// L'historial de la compte web és al cistell; el portal de client (usuari de l'ERP) només si ja hi ha sessió.
function hxVeureComandes() {
  if (CP_LOGGED_IN) { cpOpen(); return; }
  openCartDrawer();
  setTimeout(function () { var h = document.getElementById('orderHistory'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 350);
}
window.hxVeureComandes = hxVeureComandes;
// En pagar, el cistell ja s'ha tancat: la confirmació es mostra en una finestra pròpia
// perquè el client vegi sempre el número, el total i on seguir la comanda.
function hxAvisComandaFeta(inv) {
  try {
    var Tk = function (k) { return (typeof cpT === 'function' && cpT(k) !== k) ? cpT(k) : k; };
    var D = {
      ca: ['Data de lliurament prevista', 'Veure les meves comandes', 'Seguir comprant', 'Número de comanda'],
      es: ['Entrega prevista', 'Ver mis pedidos', 'Seguir comprando', 'Número de pedido'],
      en: ['Estimated delivery', 'View my orders', 'Continue shopping', 'Order number'],
      fr: ['Livraison prévue', 'Voir mes commandes', 'Continuer mes achats', 'Numéro de commande'],
      de: ['Voraussichtliche Lieferung', 'Meine Bestellungen', 'Weiter einkaufen', 'Bestellnummer'],
      ar: ['موعد التسليم المتوقع', 'عرض طلباتي', 'متابعة التسوق', 'رقم الطلب']
    };
    var t = D[(typeof cpLang === 'function' && cpLang()) || 'ca'] || D.ca;
    var fila = function (a, b) { return '<div style="display:flex;justify-content:space-between;gap:1rem;padding:0.55rem 0;border-bottom:1px solid #e3e9ee"><span style="color:#5a6b78">' + escHtml(a) + '</span><strong style="color:#0E2A3F;white-space:nowrap">' + escHtml(b) + '</strong></div>'; };
    var cos = '<div style="text-align:center;font-size:2.4rem;line-height:1;margin-bottom:0.6rem" aria-hidden="true">✅</div>' +
      fila(t[3], inv.invoiceNum) + fila(Tk('t794'), hxFormatPrice(inv.total)) + (inv.entregaStr ? fila(t[0], inv.entregaStr) : '') +
      '<p style="margin:1rem 0 0;font-size:0.9rem;color:#33424f;line-height:1.5">' + escHtml(Tk('t339')) + '</p>';
    var peu = '<button type="button" onclick="cpCloseModal()" style="padding:0.7rem 1.1rem;border-radius:10px;border:1.5px solid #c9d3db;background:#fff;color:#0E2A3F;font-weight:600;cursor:pointer">' + escHtml(t[2]) + '</button>' +
      '<button type="button" onclick="cpCloseModal();hxVeureComandes()" style="padding:0.7rem 1.1rem;border-radius:10px;border:0;background:#0E2A3F;color:#fff;font-weight:700;cursor:pointer">' + escHtml(t[1]) + '</button>';
    cpOpenModal(escHtml(Tk('t533')), cos, peu);
  } catch (e) { console.warn('No s\'ha pogut mostrar la confirmació:', e); }
}
window.sendOrder = sendOrder;
window.generateComanda = generateComanda;

function openAdminPanel() {
  var p=document.getElementById('adminPanel'); if(!p) return;
  p.classList.add('open'); document.body.style.overflow='hidden';
  renderAdminUsers(); renderAdminProducts(); hxRefreshAdminPanel();
  var su=document.getElementById('statUsers'), sp=document.getElementById('statProducts');
  if(su) su.textContent=Object.keys(USERS).length+Object.keys(REGISTERED_USERS).length;
  if(sp) sp.textContent=PRODUCTS.filter(function(p){return p.active;}).length;
}
window.openAdminPanel = openAdminPanel;
function closeAdminPanel() { var p=document.getElementById('adminPanel'); if(p) p.classList.remove('open'); document.body.style.overflow=''; }
window.closeAdminPanel = closeAdminPanel;

function renderAdminUsers() {
  var list=document.getElementById('adminUserList'); if(!list) return;
  var all=[];
  Object.keys(USERS).forEach(function(e){all.push({email:e,name:USERS[e].name,role:USERS[e].role});});
  Object.keys(REGISTERED_USERS).forEach(function(e){all.push({email:e,name:REGISTERED_USERS[e].name,role:'client'});});
  if(!all.length){list.innerHTML='<p style="color:#aaa;text-align:center;padding:1rem;">Sense usuaris.</p>';return;}
  list.innerHTML=all.map(function(u){
    var rc=u.role==='admin'?'#F2A900':'#0B3D6B';
    var rn=u.role==='admin'?'Admin':'Client';
    var canDel=u.role!=='admin';
    return '<div class="admin-user-row"><div><strong>'+u.name+'</strong><br><span style="font-size:0.75rem;color:#888;">'+u.email+'</span></div>'+
    '<div style="display:flex;align-items:center;gap:0.4rem;">'+
    '<span style="background:'+rc+';color:white;padding:0.2rem 0.6rem;border-radius:20px;font-size:0.72rem;font-weight:700;">'+rn+'</span>'+
    (canDel?'<button data-email="'+u.email+'" onclick="adminDelete(this)" style="background:#fee2e2;color:#dc2626;border:none;padding:0.25rem 0.6rem;border-radius:8px;cursor:pointer;font-size:0.75rem;" type="button">Eliminar</button>':'')+
    (u.role!=='admin'?'<button data-action="promote" data-email="'+u.email+'" onclick="adminAction(this)" style="background:#e0f2fe;color:#0369a1;border:none;padding:0.25rem 0.6rem;border-radius:8px;cursor:pointer;font-size:0.75rem;" type="button">Admin</button>':'')+
    (u.role==='admin'&&!(window.HX_USER&&u.email===HX_USER.email)?'<button data-action="demote" data-email="'+u.email+'" onclick="adminAction(this)" style="background:#fef9c3;color:#854d0e;border:none;padding:0.25rem 0.6rem;border-radius:8px;cursor:pointer;font-size:0.75rem;" type="button">Treure</button>':'')+
    '</div></div>';
  }).join('');
}
window.renderAdminUsers = renderAdminUsers;
async function deleteUser(email){if(!confirm('Eliminar usuari?'))return;
  try{ await hxApi('/admin/users?email='+encodeURIComponent(email),{method:'DELETE'}); }catch(e){ alert(e.message); return; }
  hxRefreshAdminPanel(); showToast('Usuari eliminat.','🗑');}
window.deleteUser=deleteUser;
function adminDelete(btn){deleteUser(btn.getAttribute('data-email'));}
window.adminDelete=adminDelete;
function adminAction(btn){var a=btn.getAttribute('data-action'),e=btn.getAttribute('data-email');if(a==='promote')promoteToAdmin(e);else demoteAdmin(e);}
window.adminAction=adminAction;
async function promoteToAdmin(e){
  try{ await hxApi('/admin/users',{method:'PATCH',body:{email:e,role:'admin'}}); }catch(err){ alert(err.message); return; }
  hxRefreshAdminPanel(); showToast(e+' ara es Admin!','⚙️');}
window.promoteToAdmin=promoteToAdmin;
async function demoteAdmin(e){
  try{ await hxApi('/admin/users',{method:'PATCH',body:{email:e,role:'client'}}); }catch(err){ alert(err.message); return; }
  hxRefreshAdminPanel(); showToast('Admin eliminat.','⚠️');}
window.demoteAdmin=demoteAdmin;
async function addAdminUser(){
  var n=document.getElementById('adminNewName').value.trim();
  var e=document.getElementById('adminNewEmail').value.trim();
  var p=document.getElementById('adminNewPass').value.trim();
  var r=document.getElementById('adminNewRole').value;
  var coEl=document.getElementById('adminNewCompany');
  var cifEl=document.getElementById('adminNewCif');
  var co=coEl?coEl.value.trim():'';
  var cif=cifEl?cifEl.value.trim():'';
  if(!n||!e||!p){alert('Omple tots els camps.');return;}
  try{ await hxApi('/admin/users',{method:'POST',body:{name:n,email:e,password:p,role:r,company:co,cif:cif}}); }
  catch(err){ alert(err.message); return; }
  hxRefreshAdminPanel();
  document.getElementById('adminNewName').value='';
  document.getElementById('adminNewEmail').value='';
  document.getElementById('adminNewPass').value='';
  if(coEl) coEl.value='';
  if(cifEl) cifEl.value='';
  showToast(n+' creat!','✅');
}
window.addAdminUser=addAdminUser;
function renderAdminProducts(){
  var list=document.getElementById('adminProductList');if(!list)return;
  list.innerHTML=PRODUCTS.map(function(p){
    return '<div class="admin-prod-row" id="prod-row-'+p.id+'">'+
    '<div style="flex:1;"><input id="pname-'+p.id+'" value="'+p.name+'" style="width:100%;border:1px solid #ddd;border-radius:6px;padding:0.4rem;font-size:0.85rem;margin-bottom:0.3rem;">'+
    '<input id="pprice-'+p.id+'" value="'+p.price+'" type="number" step="0.01" style="width:80px;border:1px solid #ddd;border-radius:6px;padding:0.4rem;font-size:0.85rem;"> e/L</div>'+
    '<div style="display:flex;gap:0.4rem;align-items:center;">'+
    '<button onclick="saveProduct('+p.id+')" style="background:#dcfce7;color:#16a34a;border:none;padding:0.3rem 0.7rem;border-radius:8px;cursor:pointer;font-size:0.78rem;" type="button">Guardar</button>'+
    '<button onclick="toggleProduct('+p.id+')" style="background:'+(p.active?'#fee2e2':'#dcfce7')+';color:'+(p.active?'#dc2626':'#16a34a')+';border:none;padding:0.3rem 0.7rem;border-radius:8px;cursor:pointer;font-size:0.78rem;" type="button">'+(p.active?'Desactivar':'Activar')+'</button>'+
    '</div></div>';
  }).join('');
}
window.renderAdminProducts=renderAdminProducts;
function saveProduct(id){var p=PRODUCTS.find(function(x){return x.id===id;});if(!p)return;p.name=document.getElementById('pname-'+id).value;p.price=parseFloat(document.getElementById('pprice-'+id).value);showToast('Producte guardat!','ok');}
window.saveProduct=saveProduct;
function toggleProduct(id){var p=PRODUCTS.find(function(x){return x.id===id;});if(!p)return;p.active=!p.active;renderAdminProducts();}
window.toggleProduct=toggleProduct;
function addNewProduct(){
  var n=document.getElementById('adminProdName').value.trim();
  var pr=parseFloat(document.getElementById('adminProdPrice').value);
  var d=document.getElementById('adminProdDesc').value.trim();
  if(!n||!pr){alert('Omple el nom i el preu.');return;}
  var newId=PRODUCTS.length?Math.max.apply(null,PRODUCTS.map(function(p){return p.id;}))+1:1;
  PRODUCTS.push({id:newId,name:n,desc:d||'Producte HIGIENEX.',price:pr,unit:'garrafes 5L',active:true});
  document.getElementById('adminProdName').value='';
  document.getElementById('adminProdPrice').value='';
  document.getElementById('adminProdDesc').value='';
  renderAdminProducts(); showToast(n+' afegit!','ok');
}
window.addNewProduct=addNewProduct;

var HX_PRODUCT_DESC = {
  'ECO Concentrat Pro': {
    ca: "Concentrat multiusos ×3 formulat amb tensioactius biodegradables d'origen vegetal. Un litre en genera fins a quatre de producte d'ús un cop diluït, reduint fins a un 70% els envasos, el transport i l'espai d'emmagatzematge respecte a un netejador convencional. Certificat ISO 14001, és la nostra opció més versàtil per a superfícies i sòls en qualsevol sector professional.",
    es: "Concentrado multiusos ×3 formulado con tensioactivos biodegradables de origen vegetal. Un litro genera hasta cuatro de producto de uso una vez diluido, reduciendo hasta un 70% los envases, el transporte y el espacio de almacenamiento frente a un limpiador convencional. Certificado ISO 14001, es nuestra opción más versátil para superficies y suelos en cualquier sector profesional.",
    en: "A ×3 multipurpose concentrate formulated with plant-based biodegradable surfactants. One liter yields up to four liters of ready-to-use product once diluted, cutting packaging, transport and storage space by up to 70% compared with a conventional cleaner. ISO 14001 certified, it's our most versatile option for surfaces and floors across any professional sector.",
    fr: "Concentré multi-usages ×3 formulé avec des tensioactifs biodégradables d'origine végétale. Un litre donne jusqu'à quatre litres de produit prêt à l'emploi une fois dilué, réduisant jusqu'à 70% les emballages, le transport et l'espace de stockage par rapport à un nettoyant classique. Certifié ISO 14001, c'est notre option la plus polyvalente pour les surfaces et sols dans tout secteur professionnel.",
    de: "Ein ×3-Mehrzweckkonzentrat auf Basis pflanzlicher, biologisch abbaubarer Tenside. Ein Liter ergibt nach Verdünnung bis zu vier Liter gebrauchsfertiges Produkt und reduziert Verpackung, Transport und Lagerraum im Vergleich zu einem herkömmlichen Reiniger um bis zu 70%. ISO-14001-zertifiziert, ist es unsere vielseitigste Option für Oberflächen und Böden in jeder Branche."
  },
  'Desinfectant HOSP-V': {
    ca: "Desinfectant d'ús directe amb eficàcia virucida i bactericida del 99,99%, registrat com a biocida a nivell europeu (TP2/TP4). Dissenyat per a entorns sanitaris crítics —quiròfans, UCI, sales d'aïllament—, actua en temps de contacte curts sense deixar residus agressius. Cada lot porta traçabilitat completa per facilitar auditories de control d'infeccions.",
    es: "Desinfectante de uso directo con eficacia virucida y bactericida del 99,99%, registrado como biocida a nivel europeo (TP2/TP4). Diseñado para entornos sanitarios críticos —quirófanos, UCI, salas de aislamiento—, actúa en tiempos de contacto cortos sin dejar residuos agresivos. Cada lote lleva trazabilidad completa para facilitar auditorías de control de infecciones.",
    en: "A ready-to-use disinfectant with 99.99% virucidal and bactericidal efficacy, registered as a biocide at EU level (TP2/TP4). Designed for critical healthcare settings — operating rooms, ICUs, isolation wards — it works in short contact times without leaving harsh residues. Every batch carries full traceability to support infection-control audits.",
    fr: "Désinfectant prêt à l'emploi avec une efficacité virucide et bactéricide de 99,99%, enregistré comme biocide au niveau européen (TP2/TP4). Conçu pour les environnements de soins critiques — blocs opératoires, USI, chambres d'isolement —, il agit en temps de contact courts sans laisser de résidus agressifs. Chaque lot bénéficie d'une traçabilité complète pour faciliter les audits de contrôle des infections.",
    de: "Ein gebrauchsfertiges Desinfektionsmittel mit 99,99% viruzider und bakterizider Wirksamkeit, EU-weit als Biozid registriert (TP2/TP4). Entwickelt für kritische Gesundheitsbereiche — Operationssäle, Intensivstationen, Isolierzimmer —, wirkt es bei kurzen Einwirkzeiten, ohne aggressive Rückstände zu hinterlassen. Jede Charge verfügt über vollständige Rückverfolgbarkeit zur Unterstützung von Infektionskontroll-Audits."
  },
  'Detergent ALIM-PRO': {
    ca: "Detergent desengreixant industrial homologat per a contacte alimentari, formulat per eliminar greixos cuits i residus orgànics en cuines i línies de producció sense necessitat d'aclarit posterior. Compatible amb els protocols HACCP, és la solució habitual dels nostres clients de restauració col·lectiva i indústria alimentària que necessiten rapidesa sense comprometre la seguretat.",
    es: "Detergente desengrasante industrial homologado para contacto alimentario, formulado para eliminar grasas cocidas y residuos orgánicos en cocinas y líneas de producción sin necesidad de aclarado posterior. Compatible con los protocolos HACCP, es la solución habitual de nuestros clientes de restauración colectiva e industria alimentaria que necesitan rapidez sin comprometer la seguridad.",
    en: "An industrial degreasing detergent approved for food contact, formulated to remove baked-on grease and organic residue in kitchens and production lines with no rinse required afterward. Compatible with HACCP protocols, it's the go-to solution for our catering and food-industry clients who need speed without compromising safety.",
    fr: "Détergent dégraissant industriel homologué pour le contact alimentaire, formulé pour éliminer les graisses cuites et résidus organiques dans les cuisines et lignes de production sans rinçage nécessaire. Compatible avec les protocoles HACCP, c'est la solution habituelle de nos clients de restauration collective et de l'industrie alimentaire qui recherchent rapidité sans compromettre la sécurité.",
    de: "Ein für Lebensmittelkontakt zugelassenes industrielles Entfettungsmittel, das eingebrannte Fette und organische Rückstände in Küchen und Produktionslinien entfernt, ohne dass anschließend gespült werden muss. Kompatibel mit HACCP-Protokollen, ist es die bevorzugte Lösung unserer Kunden aus Gemeinschaftsverpflegung und Lebensmittelindustrie, die Schnelligkeit ohne Sicherheitskompromisse benötigen."
  },
  'Net HOSTAL Premium': {
    ca: "Netejador multisuperfície d'aroma neutre, pensat per a la rotació diària d'habitacions i zones comunes en hoteleria. No deixa residus visibles ni vels a mobles ni miralls, i la seva alta tolerància a l'aigua calcària el fa fiable en qualsevol zona geogràfica. Certificat ISO 14001, combina rendiment i respecte ambiental sense penalitzar el temps de neteja del personal.",
    es: "Limpiador multisuperficie de aroma neutro, pensado para la rotación diaria de habitaciones y zonas comunes en hostelería. No deja residuos visibles ni velos en muebles ni espejos, y su alta tolerancia al agua calcárea lo hace fiable en cualquier zona geográfica. Certificado ISO 14001, combina rendimiento y respeto ambiental sin penalizar el tiempo de limpieza del personal.",
    en: "A neutral-scent multi-surface cleaner designed for the daily turnover of rooms and common areas in hospitality. It leaves no visible residue or streaking on furniture or mirrors, and its high tolerance to hard water makes it reliable across any region. ISO 14001 certified, it combines performance and environmental care without slowing down staff cleaning time.",
    fr: "Nettoyant multi-surfaces au parfum neutre, conçu pour la rotation quotidienne des chambres et espaces communs en hôtellerie. Il ne laisse ni résidus visibles ni voiles sur les meubles ou miroirs, et sa haute tolérance à l'eau calcaire le rend fiable dans toute zone géographique. Certifié ISO 14001, il allie performance et respect de l'environnement sans pénaliser le temps de nettoyage du personnel.",
    de: "Ein neutral duftender Mehrflächenreiniger für den täglichen Zimmer- und Gemeinschaftsbereichswechsel im Hotelgewerbe. Er hinterlässt keine sichtbaren Rückstände oder Schlieren auf Möbeln oder Spiegeln, und seine hohe Kalkwassertoleranz macht ihn in jeder Region zuverlässig. ISO-14001-zertifiziert, vereint er Leistung und Umweltschutz, ohne die Reinigungszeit des Personals zu verlängern."
  },
  'WorkSafe Antimicrobial': {
    ca: "Solució de recobriment antimicrobià per a superfícies de contacte freqüent, desenvolupada conjuntament amb OfiNova dins del projecte WorkSafe Smart Space. Redueix la càrrega microbiana entre neteges i s'integra amb sensors IoT que avisen quan cal reforcar la desinfecció, pensat per a oficines, coworkings i espais de treball compartit que volen anar més enllà de la neteja tradicional.",
    es: "Solución de recubrimiento antimicrobiano para superficies de contacto frecuente, desarrollada conjuntamente con OfiNova dentro del proyecto WorkSafe Smart Space. Reduce la carga microbiana entre limpiezas y se integra con sensores IoT que avisan cuando conviene reforzar la desinfección, pensado para oficinas, coworkings y espacios de trabajo compartido que quieren ir más allá de la limpieza tradicional.",
    en: "An antimicrobial coating solution for high-touch surfaces, co-developed with OfiNova as part of the WorkSafe Smart Space project. It reduces microbial load between cleanings and integrates with IoT sensors that flag when disinfection needs reinforcing — built for offices, coworking spaces and shared workspaces looking to go beyond traditional cleaning.",
    fr: "Solution de revêtement antimicrobien pour surfaces à contact fréquent, développée conjointement avec OfiNova dans le cadre du projet WorkSafe Smart Space. Elle réduit la charge microbienne entre les nettoyages et s'intègre à des capteurs IoT qui signalent quand renforcer la désinfection, pensée pour les bureaux, espaces de coworking et lieux de travail partagés qui veulent aller au-delà du nettoyage traditionnel.",
    de: "Eine antimikrobielle Beschichtungslösung für stark frequentierte Oberflächen, gemeinsam mit OfiNova im Rahmen des WorkSafe Smart Space-Projekts entwickelt. Sie reduziert die mikrobielle Belastung zwischen den Reinigungen und ist mit IoT-Sensoren verbunden, die anzeigen, wann eine verstärkte Desinfektion nötig ist — konzipiert für Büros, Coworking-Spaces und gemeinsam genutzte Arbeitsbereiche, die über die traditionelle Reinigung hinausgehen wollen."
  },
  'Gamma Superfícies QR': {
    ca: "Línia de productes de superfície amb codi QR individual per lot, pensada per a organitzacions que necessiten traçabilitat digital immediata: escanejant el codi s'accedeix a la fitxa tècnica, la fitxa de seguretat i la data de fabricació del lot concret. La dosificació ×3 garanteix un ús exacte i redueix el malbaratament de producte en aplicacions professionals d'alta rotació.",
    es: "Línea de productos de superficie con código QR individual por lote, pensada para organizaciones que necesitan trazabilidad digital inmediata: escaneando el código se accede a la ficha técnica, la ficha de seguridad y la fecha de fabricación del lote concreto. La dosificación ×3 garantiza un uso exacto y reduce el desperdicio de producto en aplicaciones profesionales de alta rotación.",
    en: "A surface-care line with an individual QR code per batch, designed for organizations that need instant digital traceability: scanning the code brings up the technical datasheet, safety datasheet and manufacturing date of that specific batch. The ×3 dosing ensures exact use and reduces product waste in high-turnover professional applications.",
    fr: "Gamme de produits de surface avec code QR individuel par lot, pensée pour les organisations ayant besoin d'une traçabilité numérique immédiate : scanner le code donne accès à la fiche technique, la fiche de sécurité et la date de fabrication du lot concerné. Le dosage ×3 garantit un usage exact et réduit le gaspillage de produit dans les applications professionnelles à forte rotation.",
    de: "Eine Oberflächenpflegeserie mit individuellem QR-Code pro Charge, konzipiert für Organisationen, die sofortige digitale Rückverfolgbarkeit benötigen: Das Scannen des Codes zeigt das technische Datenblatt, das Sicherheitsdatenblatt und das Herstellungsdatum der jeweiligen Charge an. Die ×3-Dosierung gewährleistet exakten Verbrauch und reduziert Produktverschwendung bei professionellen Anwendungen mit hohem Durchsatz."
  }
};
function hxProdDesc(name){
  var lang = 'ca'; try { lang = localStorage.getItem('hx_lang') || 'ca'; } catch(e) {}
  var entry = HX_PRODUCT_DESC[name];
  if (!entry) return '';
  return entry[lang] || entry.ca || '';
}

var PRODUCT_INFO = {
  'ECO Concentrat Pro':     {emoji:'🌿',price:'12,50 € / garrafa 5 L',desc:'Concentrat x3 biodegradable. Redueix un 70% els envasos. ISO 14001.'},
  'Desinfectant HOSP-V':    {emoji:'🏥',price:'18,00 € / garrafa 5 L',desc:'Virucida + Bactericida 99,99%. Biocida europeu. Per a quirofans i UCI.'},
  'Detergent ALIM-PRO':     {emoji:'🏭',price:'9,80 € / garrafa 5 L', desc:'Anti-greix industrial. Compatible HACCP. Homologat contacte alimentari.'},
  'Net HOSTAL Premium':     {emoji:'🏨',price:'11,20 € / garrafa 5 L',desc:'0 residus visibles. Aroma neutre. Per a hotels i allotjaments.'},
  'WorkSafe Antimicrobial': {emoji:'🤝',price:'22,00 € / garrafa 5 L',desc:'Superficies antimicrobianes. Col-lab. OfiNova. Per a oficines.'}
};
PRODUCT_INFO['Gamma Superfícies QR']={emoji:'📱',price:'14,00 € / garrafa 5 L',desc:'Tracabilitat digital de lot via QR. Dosi exacta garantida.'};

// ═══════════════════════════════════════════════════════════
// COMPARADOR DE PRODUCTES
// ═══════════════════════════════════════════════════════════
var CMP_DATA = {
  'ECO Concentrat Pro': {
    emoji:'🌿', price:'12,50 € / garrafa 5 L', sector:'General B2B',
    concentracio:'×3 (dilució 1:3)', certificacio:'ISO 14001',
    biodegradable:'Sí, 100%', envas:'-70% plàstic', us:'Superfícies i sòls generals'
  },
  'Desinfectant HOSP-V': {
    emoji:'🏥', price:'18,00 € / garrafa 5 L', sector:'Sanitari / Hospitals',
    concentracio:'Ús directe', certificacio:'Biocida UE (TP2/TP4)',
    biodegradable:'Parcial', envas:'Estàndard', us:'Quiròfans, UCI, sanitari crític'
  },
  'Detergent ALIM-PRO': {
    emoji:'🏭', price:'9,80 € / garrafa 5 L', sector:'Indústria alimentària',
    concentracio:'×2 (dilució 1:2)', certificacio:'HACCP · Contacte alimentari',
    biodegradable:'Sí', envas:'Estàndard', us:'Cuines industrials, línies de producció'
  },
  'Net HOSTAL Premium': {
    emoji:'🏨', price:'11,20 € / garrafa 5 L', sector:'Hostaleria / Hotels',
    concentracio:'×2 (dilució 1:2)', certificacio:'ISO 14001',
    biodegradable:'Sí', envas:'-40% plàstic', us:'Habitacions, zones comunes'
  },
  'Gamma Superfícies QR': {
    emoji:'📱', price:'14,00 € / garrafa 5 L', sector:'Oficines / Multisector',
    concentracio:'×3 (dilució 1:3)', certificacio:'ISO 14001 · QR traçabilitat',
    biodegradable:'Sí', envas:'-70% plàstic', us:'Superfícies amb traçabilitat de lot'
  },
  'WorkSafe Antimicrobial': {
    emoji:'🤝', price:'22,00 € / garrafa 5 L', sector:'Oficines / Coworking',
    concentracio:'Ús directe', certificacio:'Biocida UE · Col·lab. OfiNova',
    biodegradable:'Parcial', envas:'Estàndard', us:'Superfícies de contacte freqüent, IoT'
  }
};
var CMP_ROWS = [
  {key:'price',        label:{ca:'Preu',es:'Precio',en:'Price',fr:'Prix',de:'Preis'}},
  {key:'sector',       label:{ca:'Sector recomanat',es:'Sector recomendado',en:'Recommended sector',fr:'Secteur recommandé',de:'Empfohlene Branche'}},
  {key:'concentracio', label:{ca:'Concentració',es:'Concentración',en:'Concentration',fr:'Concentration',de:'Konzentration'}},
  {key:'certificacio', label:{ca:'Certificació',es:'Certificación',en:'Certification',fr:'Certification',de:'Zertifizierung'}},
  {key:'biodegradable',label:{ca:'Biodegradable',es:'Biodegradable',en:'Biodegradable',fr:'Biodégradable',de:'Biologisch abbaubar'}},
  {key:'envas',        label:{ca:'Reducció envàs',es:'Reducción envase',en:'Packaging reduction',fr:'Réduction emballage',de:'Verpackungsreduzierung'}},
  {key:'us',           label:{ca:'Ús principal',es:'Uso principal',en:'Main use',fr:'Usage principal',de:'Hauptanwendung'}}
];
var cmpSelected = [];

// ═══════════════════════════════════════════════════════════
// CALCULADORA D'ESTALVI ECO
// ═══════════════════════════════════════════════════════════
// Calculadora d'estalvi amb ECO Concentrat Pro.
//  · Preu: 12,50 € la garrafa de 5 L de concentrat = 2,50 €/L. Es dilueix 1:3
//    (1 L de concentrat + 3 L d'aigua = 4 L de producte d'ús) → 0,625 € per litre d'ús.
//  · Envasos: el producte convencional ve llest per usar en garrafes de 5 L;
//    amb el concentrat calen 4 vegades menys litres i, per tant, 4 vegades menys garrafes.
//  · CO₂ (orientatiu): ~0,45 kg per garrafa de plàstic de 5 L que no es fabrica i
//    ~0,027 kg per kg d'aigua que no es transporta (camió, ~300 km).
var CALC_ECO = { preuGarrafa: 12.50, litresGarrafa: 5, factor: 4, co2Garrafa: 0.45, co2KgTransportat: 0.027, garrafesMes: 0 };
function calcEcoRun(){
  var litresEl = document.getElementById('calcLitres');
  var preuEl = document.getElementById('calcPreuActual');
  if (!litresEl || !preuEl) return;
  var litres = Math.max(0, parseFloat(litresEl.value) || 0);
  var preuActual = Math.max(0, parseFloat(preuEl.value) || 0);

  var preuEcoPerLitreUs = CALC_ECO.preuGarrafa / CALC_ECO.litresGarrafa / CALC_ECO.factor;
  var costActualAnual = litres * preuActual * 12;
  var costEcoAnual = litres * preuEcoPerLitreUs * 12;
  var estalvi = Math.max(0, costActualAnual - costEcoAnual);
  var pct = costActualAnual > 0 ? Math.round((estalvi / costActualAnual) * 100) : 0;

  var garrafesSenseEco = (litres * 12) / CALC_ECO.litresGarrafa;
  var garrafesAmbEco = garrafesSenseEco / CALC_ECO.factor;
  var envasosEstalviats = Math.max(0, Math.round(garrafesSenseEco - garrafesAmbEco));
  var aiguaNoTransportada = litres * 12 * (1 - 1 / CALC_ECO.factor);   // kg ≈ litres
  var co2 = envasosEstalviats * CALC_ECO.co2Garrafa + aiguaNoTransportada * CALC_ECO.co2KgTransportat;
  CALC_ECO.garrafesMes = Math.max(1, Math.ceil(litres / CALC_ECO.factor / CALC_ECO.litresGarrafa));

  var fmt = function(n){ return Math.round(n).toLocaleString('es-ES'); };
  var set = function(id, v){ var el = document.getElementById(id); if (el) el.textContent = v; };
  set('calcOutAnual', fmt(estalvi) + ' €');
  set('calcOutEnvasos', fmt(envasosEstalviats));
  set('calcOutPct', (pct > 0 ? pct : 0) + '%');
  set('calcOutCo2', co2 >= 1000 ? (co2 / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' t' : fmt(co2) + ' kg');
  var txt = (typeof cpT === 'function' ? cpT('t921') : 'Afegir {n} garrafes al cistell');
  set('calcEcoCistellTxt', (txt === 't921' ? 'Afegir {n} garrafes al cistell' : txt).replace('{n}', CALC_ECO.garrafesMes));
  var boto = document.getElementById('calcEcoCistell'); if (boto) boto.disabled = litres <= 0;
}
function calcEcoAlCistell(){
  var n = CALC_ECO.garrafesMes || 1;
  cpAddDirectToCart('ECO Concentrat Pro', CALC_ECO.preuGarrafa, n);
  if (typeof renderCart === 'function') renderCart();
  if (typeof updateCartBadge === 'function') updateCartBadge();
  showToast((cpT('t922') === 't922' ? 'Afegides {n} garrafes d\'ECO Concentrat Pro al cistell' : cpT('t922')).replace('{n}', n), '🧴');
}
window.calcEcoAlCistell = calcEcoAlCistell;
document.addEventListener('DOMContentLoaded', calcEcoRun);

function cmpLang(){ try { return localStorage.getItem('hx_lang') || 'ca'; } catch(e){ return 'ca'; } }

function cmpRenderPicker(){
  var wrap = document.getElementById('cmpPicker');
  if (!wrap) return;
  wrap.innerHTML = '';
  Object.keys(CMP_DATA).forEach(function(name){
    var info = CMP_DATA[name];
    var active = cmpSelected.indexOf(name) !== -1;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = info.emoji + ' ' + name;
    btn.style.cssText = 'padding:0.55rem 1rem;border-radius:30px;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.15s;border:1.5px solid ' + (active ? 'var(--green-deep)' : 'var(--border)') + ';background:' + (active ? 'var(--green-deep)' : '#fff') + ';color:' + (active ? '#fff' : 'var(--charcoal)') + ';';
    btn.onclick = function(){ cmpToggle(name); };
    wrap.appendChild(btn);
  });
}

function cmpToggle(name){
  var idx = cmpSelected.indexOf(name);
  if (idx !== -1) {
    cmpSelected.splice(idx, 1);
  } else {
    if (cmpSelected.length >= 3) cmpSelected.shift(); // màxim 3: treu el més antic
    cmpSelected.push(name);
  }
  cmpRenderPicker();
  cmpRenderTable();
}
window.cmpToggle = cmpToggle;

function cmpRenderTable(){
  var wrap = document.getElementById('cmpTableWrap');
  var empty = document.getElementById('cmpEmpty');
  var table = document.getElementById('cmpTable');
  if (!wrap || !table) return;
  if (cmpSelected.length < 2) {
    wrap.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  wrap.style.display = 'block';
  var lang = cmpLang();

  var thead = table.querySelector('thead');
  var tbody = table.querySelector('tbody');
  var headHtml = '<tr><th style="text-align:left;padding:1rem;background:var(--green-deep);color:#fff;font-size:0.8rem;">&nbsp;</th>';
  cmpSelected.forEach(function(name){
    var info = CMP_DATA[name];
    headHtml += '<th style="text-align:left;padding:1rem;background:var(--green-deep);color:#fff;font-size:0.88rem;white-space:nowrap;">' + info.emoji + ' ' + name + '</th>';
  });
  headHtml += '</tr>';
  thead.innerHTML = headHtml;

  var bodyHtml = '';
  CMP_ROWS.forEach(function(row, i){
    var bg = i % 2 === 0 ? '#fff' : 'var(--warm-white)';
    bodyHtml += '<tr style="background:' + bg + ';"><td style="padding:0.9rem 1rem;font-weight:700;color:var(--green-deep);font-size:0.82rem;white-space:nowrap;">' + (row.label[lang] || row.label.ca) + '</td>';
    cmpSelected.forEach(function(name){
      var val = CMP_DATA[name][row.key];
      bodyHtml += '<td style="padding:0.9rem 1rem;font-size:0.86rem;color:var(--charcoal);">' + val + '</td>';
    });
    bodyHtml += '</tr>';
  });
  tbody.innerHTML = bodyHtml;
}

document.addEventListener('DOMContentLoaded', function(){
  cmpSelected = ['ECO Concentrat Pro', 'Desinfectant HOSP-V'];
  cmpRenderPicker();
  cmpRenderTable();
  hxRenderFDSButtons();
});
function hxRenderFDSButtons(){
  var wrap = document.getElementById('descarreguesFDS');
  if (!wrap) return;
  wrap.innerHTML = Object.keys(CMP_DATA).map(function(name){
    var info = CMP_DATA[name];
    return '<button type="button" onclick="fpDescarregarFDS(' + JSON.stringify(name).replace(/"/g, '&quot;') + ')" style="text-align:left;background:var(--warm-white);border:1.5px solid var(--border);border-radius:16px;padding:1.3rem;cursor:pointer;">' +
      '<div style="font-size:1.6rem;margin-bottom:0.4rem;">' + info.emoji + '</div>' +
      '<div style="font-weight:700;color:var(--green-deep);font-size:0.9rem;">FDS · ' + escHtml(name) + '</div>' +
      '<div style="font-size:0.76rem;color:var(--charcoal);opacity:0.7;margin-top:0.2rem;">' + escHtml(info.certificacio) + '</div>' +
      '</button>';
  }).join('');
}
// Recalcula els textos de la taula si l'usuari canvia d'idioma
document.addEventListener('click', function(e){
  if (e.target && e.target.closest && e.target.closest('#langDropdownMenu button')) {
    setTimeout(cmpRenderTable, 50);
    setTimeout(hxRefreshOpenProductDesc, 50);
  }
});
function hxRefreshOpenProductDesc(){
  var fpName = document.getElementById('fpName');
  if (fpName && fpName.textContent) {
    var fpDesc = document.getElementById('fpDesc');
    if (fpDesc) fpDesc.textContent = hxProdDesc(fpName.textContent) || fpDesc.textContent;
  }
  var popupName = document.getElementById('popupName');
  var popup = document.getElementById('productPopup');
  if (popup && popup.classList.contains('open') && popupName && popupName.textContent) {
    var popupDesc = document.getElementById('popupDesc');
    if (popupDesc) popupDesc.textContent = hxProdDesc(popupName.textContent) || popupDesc.textContent;
  }
}

function openProductPopup(name){
  hxTrackProductView(name);
  var info=PRODUCT_INFO[name]; if(!info) return;
  var pe=document.getElementById('popupEmoji');
  var pi=document.getElementById('popupImg');
  var pn=document.getElementById('popupName');  if(pn) pn.textContent=name;
  var pp=document.getElementById('popupPrice'); if(pp) pp.textContent=info.price;
  var pd=document.getElementById('popupDesc');  if(pd) pd.textContent=hxProdDesc(name)||info.desc;
  // La imatge del popup reutilitza el <img> ja carregat a la fitxa de producte
  // (mateix fitxer, sense duplicar-ne el base64 dins PRODUCT_INFO).
  var cardImg = document.querySelector('img.prod-img[alt="' + name + '"]');
  if(pi && cardImg){ pi.src=cardImg.src; pi.alt=name; pi.style.display='block'; if(pe) pe.style.display='none'; }
  else { if(pe){pe.textContent=info.emoji; pe.style.display='block';} if(pi){pi.style.display='none'; pi.alt='';} }
  var pop=document.getElementById('productPopup'); if(pop) pop.classList.add('open');
  _productPopupOpenedAt = Date.now();
  hxRenderProductRating(name, 'popupRating', null);
}
window.openProductPopup=openProductPopup;
function closeProductPopup(){var p=document.getElementById('productPopup');if(p)p.classList.remove('open');}
window.closeProductPopup=closeProductPopup;

function addProductFromPopup(){
  var nameEl = document.getElementById('popupName');
  var name = nameEl ? nameEl.textContent : '';
  var prod = null;
  for (var i=0; i<PRODUCTS.length; i++) { if (PRODUCTS[i].name === name) { prod = PRODUCTS[i]; break; } }
  closeProductPopup();
  if (!prod) return;
  if (cart[name]) { cart[name].qty += 1; }
  else { cart[name] = { qty: 1, price: prod.price }; }
  recalcCartLine(name);
  renderCart();
  showToast(name + ' afegit al cistell!', '✅');
  openCartDrawer();
}
window.addProductFromPopup = addProductFromPopup;

// ── FITXA DE PRODUCTE COMPLETA ────────────────────────────
var CP_FITXA_ACTUAL = null;
function obrirFitxaProducte(name) {
  CP_FITXA_ACTUAL = name;
  var info = PRODUCT_INFO[name]; if (!info) return;
  var prod = null;
  for (var i=0; i<PRODUCTS.length; i++) { if (PRODUCTS[i].name === name) { prod = PRODUCTS[i]; break; } }
  document.getElementById('fpName').textContent = name;
  document.getElementById('fpPrice').textContent = prod ? (hxFormatPrice(prod.price) + ' / garrafa 5 L') : info.price;
  document.getElementById('fpDesc').textContent = hxProdDesc(name)||info.desc;
  document.getElementById('fpBadge').textContent = prod ? prod.unit : 'Producte';
  var img = document.getElementById('fpImg'), emo = document.getElementById('fpEmoji');
  var cardImg = document.querySelector('img.prod-img[alt="' + name + '"]');
  if (img && cardImg) { img.src = cardImg.src; img.alt = name; img.style.display = 'block'; if (emo) emo.style.display = 'none'; }
  else { if (emo) { emo.textContent = info.emoji; emo.style.display = 'block'; } if (img) { img.style.display = 'none'; img.alt = ''; } }
  var addBtn = document.getElementById('fpAddBtn');
  if (addBtn) addBtn.setAttribute('data-name', name);
  fpMostrarDosificacio(name);
  fpMostrarTaulaVolum(prod);
  // Productes relacionats: la resta del catàleg actiu
  var rel = document.getElementById('fpRelacionats');
  if (rel) {
    rel.innerHTML = PRODUCTS.filter(function(p){ return p.active && p.name !== name; }).map(function(p){
      var pi = PRODUCT_INFO[p.name] || {};
      return '<div class="blog-card" onclick="obrirFitxaProducte(\'' + p.name.replace(/'/g,"\\'") + '\')" style="cursor:pointer;">' +
        '<div style="aspect-ratio:16/9;background:var(--warm-white);display:flex;align-items:center;justify-content:center;font-size:2.4rem;">' + (pi.emoji||'🧴') + '</div>' +
        '<div class="blog-content"><h3 class="blog-title">' + escHtml(p.name) + '</h3><p style="color:var(--accent);font-weight:700;font-size:0.9rem;margin-top:0.4rem;">' + (pi.price||'') + '</p></div></div>';
    }).join('');
  }
  navTo('fitxaproducte');
  hxRenderProductRating(name, 'fpRating', 'fpReviewsList');
  HX_CURRENT_REVIEW_STARS = 5;
  hxRenderReviewStarsPicker();
}
window.obrirFitxaProducte = obrirFitxaProducte;

// Calculadora de dosificació: llegeix el ràtio de dilució del producte
// (ex. "×3 (dilució 1:3)" -> ràtio 3) i calcula concentrat + aigua necessaris.
function hxParseRatioDilucio(concentracioStr) {
  if (!concentracioStr) return null;
  var m = concentracioStr.match(/×\s*(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return parseFloat(m[1].replace(',', '.'));
}
function fpMostrarDosificacio(name) {
  var wrap = document.getElementById('fpDosifWrap');
  if (!wrap) return;
  var cmp = (typeof CMP_DATA !== 'undefined') ? CMP_DATA[name] : null;
  var ratio = cmp ? hxParseRatioDilucio(cmp.concentracio) : null;
  if (!ratio) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  wrap.setAttribute('data-ratio', ratio);
  var lbl = document.getElementById('fpDosifRatioLabel');
  if (lbl) lbl.textContent = 'Dilució d\'aquest producte: ' + cmp.concentracio;
  fpCalcularDosi();
}
function fpCalcularDosi() {
  var wrap = document.getElementById('fpDosifWrap');
  if (!wrap || wrap.style.display === 'none') return;
  var ratio = parseFloat(wrap.getAttribute('data-ratio'));
  var litersInput = document.getElementById('fpDosifLiters');
  var out = document.getElementById('fpDosifResult');
  if (!ratio || !litersInput || !out) return;
  var totalLiters = parseFloat(litersInput.value);
  if (!totalLiters || totalLiters <= 0) { out.textContent = ''; return; }
  var concentrateLiters = totalLiters / ratio;
  var waterLiters = totalLiters - concentrateLiters;
  var concentrateMl = concentrateLiters * 1000;
  var concentrateText = concentrateMl < 1000
    ? Math.round(concentrateMl) + ' mL de concentrat'
    : concentrateLiters.toLocaleString('ca-ES', {maximumFractionDigits: 2}) + ' L de concentrat';
  out.innerHTML = '🧴 ' + concentrateText + ' + 💧 ' +
    waterLiters.toLocaleString('ca-ES', {maximumFractionDigits: 2}) + ' L d\'aigua';
}
window.fpCalcularDosi = fpCalcularDosi;
window.fpMostrarDosificacio = fpMostrarDosificacio;

// Taula de preus per volum a la fitxa de producte, reutilitzant el mateix
// barem de descomptes ja aplicat automàticament al cistell (volumeDiscountRate).
function fpMostrarTaulaVolum(prod) {
  var wrap = document.getElementById('fpVolumWrap');
  var body = document.getElementById('fpVolumTable');
  if (!wrap || !body || !prod || typeof prod.price !== 'number' || typeof volumeDiscountRate !== 'function') {
    if (wrap) wrap.style.display = 'none';
    return;
  }
  var trams = [
    {min: 1,  label: '1-4 unitats'},
    {min: 5,  label: '5-9 unitats'},
    {min: 10, label: '10-19 unitats'},
    {min: 20, label: '20+ unitats'}
  ];
  body.innerHTML = trams.map(function(t){
    var rate = volumeDiscountRate(t.min);
    var preuFinal = prod.price * (1 - rate);
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0;' +
      (rate > 0 ? 'border-top:1px dashed var(--border);' : '') + '">' +
      '<span>' + t.label + (rate > 0 ? ' <span style="color:#B8860B;font-weight:700;">(-' + Math.round(rate*100) + '%)</span>' : '') + '</span>' +
      '<span style="font-weight:700;color:var(--green-deep);">' + hxFormatPrice(preuFinal) + ' / u.</span>' +
    '</div>';
  }).join('');
  wrap.style.display = 'block';
}
window.fpMostrarTaulaVolum = fpMostrarTaulaVolum;

function fpAddToCart() {
  var name = document.getElementById('fpName').textContent;
  var prod = null;
  for (var i=0; i<PRODUCTS.length; i++) { if (PRODUCTS[i].name === name) { prod = PRODUCTS[i]; break; } }
  if (!prod) return;
  if (cart[name]) { cart[name].qty += 1; } else { cart[name] = { qty: 1, price: prod.price }; }
  recalcCartLine(name);
  renderCart();
  showToast(name + ' afegit al cistell!', '✅');
  openCartDrawer();
}
window.fpAddToCart = fpAddToCart;

// Fitxa de dades de seguretat (FDS) simplificada, generada com a document
// imprimible — mateix mecanisme que el PDF de comandes (window.print()).
function fpDescarregarFitxaTecnica() {
  var name = document.getElementById('fpName').textContent;
  if (window.HXPDF_DOCS && HXPDF.disponible()) return HXPDF_DOCS.fitxaTecnica(name);
  var info = PRODUCT_INFO[name] || {};
  if (typeof window.jspdf === 'undefined') { showToast('No s\'ha pogut carregar el generador de PDF.', '⚠️'); return; }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  var M=44, W=595.28;
  var y=48;
  doc.setFont('times','bold'); doc.setFontSize(19);
  doc.setTextColor(11,61,107);
  doc.text('HIGIENE', M, y);
  var w1=doc.getTextWidth('HIGIENE');
  doc.setTextColor(242,169,0);
  doc.text('X', M+w1, y);
  y += 22;
  doc.setFont('times','bold'); doc.setFontSize(15);
  doc.setTextColor(11,61,107);
  doc.text('Fitxa t\u00e8cnica: ' + name, M, y);
  y += 12;
  doc.setDrawColor(11,61,107); doc.setLineWidth(2.2);
  doc.line(M, y, W-M, y);
  y += 26;
  function seccio(titol){
    doc.setFont('helvetica','bold'); doc.setFontSize(10.5);
    doc.setTextColor(11,61,107);
    doc.text(titol, M, y);
    doc.setDrawColor(217,229,240); doc.setLineWidth(0.75);
    doc.line(M, y+4, W-M, y+4);
    y += 18;
  }
  function paragraf(text, opts){
    opts = opts || {};
    doc.setFont('helvetica','normal'); doc.setFontSize(opts.size||9);
    doc.setTextColor(22,35,46);
    var lines = doc.splitTextToSize(text, W-2*M-16);
    doc.setDrawColor(217,229,240); doc.setLineWidth(0.5);
    var boxH = lines.length*12+14;
    doc.rect(M, y, W-2*M, boxH);
    doc.text(lines, M+8, y+13);
    y += boxH + 16;
  }
  seccio('1. Identificaci\u00f3 del producte');
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.setTextColor(22,35,46);
  var camps = [['Nom comercial', name], ['Fabricant', 'HIGIENEX S.L. \u00b7 Carrer de la Ind\u00fastria, 25, 46010 Val\u00e8ncia'], ['Preu de refer\u00e8ncia', info.price||'\u2014']];
  camps.forEach(function(c){
    doc.setDrawColor(217,229,240); doc.setLineWidth(0.5);
    doc.rect(M, y, W-2*M, 22);
    doc.line(M+160, y, M+160, y+22);
    doc.setFillColor(245,250,255);
    doc.rect(M, y, 160, 22, 'F');
    doc.setDrawColor(217,229,240);
    doc.rect(M, y, 160, 22);
    doc.setFont('helvetica','bold'); doc.setFontSize(9);
    doc.text(c[0], M+8, y+14);
    doc.setFont('helvetica','normal');
    doc.text(String(c[1]), M+168, y+14);
    y += 22;
  });
  y += 16;
  seccio('2. Descripci\u00f3');
  paragraf(hxProdDesc(name) || info.desc || '\u2014');
  seccio("3. Mode d'\u00fas recomanat");
  paragraf("Diluir segons superf\u00edcie a tractar. Aplicar amb polvoritzador, mopa o bayeta microfibra. Deixar actuar el temps de contacte indicat a l'etiqueta abans d'aclarir si escau. Ventilar l'espai durant l'aplicaci\u00f3.");
  seccio('4. Precaucions i emmagatzematge');
  paragraf("Mantenir fora de l'abast dels infants. Emmagatzemar en lloc fresc i sec, protegit de la llum directa. No barrejar amb altres productes qu\u00edmics. Usar guants en manipulaci\u00f3 concentrada. Consultar la fitxa de seguretat completa (FDS) abans del primer \u00fas industrial.");
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  doc.setTextColor(148,163,176);
  var footLines = doc.splitTextToSize("Document generat autom\u00e0ticament des de la web d'HIGIENEX el " + new Date().toLocaleDateString('ca-ES') + ". Aquesta fitxa \u00e9s orientativa; per a la Fitxa de Dades de Seguretat (FDS) oficial reglament\u00e0ria, contacta amb el nostre equip t\u00e8cnic.", W-2*M);
  doc.text(footLines, M, y);
  doc.save('Fitxa_tecnica_' + name.replace(/\s+/g,'_') + '.pdf');
}
window.fpDescarregarFitxaTecnica = fpDescarregarFitxaTecnica;

// ── FITXA DE SEGURETAT (FDS) — versió orientativa amb estructura estàndard ──
function fpDescarregarFDS(name) {
  name = name || (document.getElementById('fpName') ? document.getElementById('fpName').textContent : '');
  if (window.HXPDF_DOCS && HXPDF.disponible()) return HXPDF_DOCS.fds(name);
  var info = CMP_DATA[name] || PRODUCT_INFO[name] || {};
  var html = '<!DOCTYPE html><html lang="ca"><head><meta charset="UTF-8"><title>FDS ' + escHtml(name) + ' · HIGIENEX</title>' +
    '<style>body{font-family:Arial,Helvetica,sans-serif;color:#0F1D2B;padding:36px;font-size:12.5px;max-width:780px;margin:0 auto}' +
    '.top{border-bottom:3px solid #0B3D6B;padding-bottom:16px;margin-bottom:22px}' +
    '.brand{font-size:22px;font-weight:800;color:#0B3D6B;font-family:Georgia,serif}.brand span{color:#F2A900}' +
    'h1{font-size:18px;color:#0B3D6B;margin:4px 0 0}.subt{color:#8A9BAC;font-size:11px;margin-top:2px}' +
    'h2{font-size:12.5px;color:#0B3D6B;border-bottom:1px solid #D9E5F0;padding-bottom:5px;margin:18px 0 8px}' +
    'table{width:100%;border-collapse:collapse;font-size:11.5px;margin-bottom:4px}td{border:1px solid #D9E5F0;padding:5px 8px}' +
    'td.k{background:#F5FAFF;font-weight:700;width:230px}.foot{margin-top:28px;font-size:9.5px;color:#8A9BAC;border-top:1px solid #D9E5F0;padding-top:10px}' +
    '@media print{@page{margin:15mm}}</style></head><body>' +
    '<div class="top"><div class="brand">HIGIENE<span>X</span></div><h1>Fitxa de Dades de Seguretat (FDS)</h1><div class="subt">' + escHtml(name) + ' — Document orientatiu, format simplificat</div></div>' +
    '<h2>Secció 1. Identificació de la substància i de la societat</h2>' +
    '<table><tr><td class="k">Nom del producte</td><td>' + escHtml(name) + '</td></tr>' +
    '<tr><td class="k">Ús recomanat</td><td>' + escHtml(info.us || hxProdDesc(name) || info.desc || '—') + '</td></tr>' +
    '<tr><td class="k">Fabricant</td><td>HIGIENEX S.L. · Carrer de la Indústria, 25, 46010 València · contacto@higienexvalencia.es</td></tr>' +
    '<tr><td class="k">Telèfon d\'emergència</td><td>631 706 398 (horari laboral i urgències 24/7)</td></tr></table>' +
    '<h2>Secció 2. Identificació de perills</h2>' +
    '<table><tr><td>Classificació segons Reglament (CE) 1272/2008 (CLP). ' + (info.certificacio ? 'Certificació: ' + escHtml(info.certificacio) + '.' : '') + ' Pot causar irritació ocular i cutània lleu en contacte perllongat. No ingerir. Evitar el contacte amb els ulls.</td></tr></table>' +
    '<h2>Secció 3. Composició / informació sobre els components</h2>' +
    '<table><tr><td>Tensioactius aniònics i no iònics (5-15%), agents desinfectants segons variant, aigua, conservants. Formulació pròpia HIGIENEX registrada. Composició exacta disponible sota petició per a auditories.</td></tr></table>' +
    '<h2>Secció 4. Primers auxilis</h2>' +
    '<table><tr><td><b>Contacte amb els ulls:</b> rentar abundantment amb aigua durant 15 minuts, mantenint les parpelles obertes. <b>Contacte amb la pell:</b> rentar amb aigua i sabó. <b>Ingestió:</b> no provocar el vòmit, beure aigua i contactar amb el Servei d\'Informació Toxicològica (915 620 420). <b>Inhalació:</b> traslladar a l\'aire lliure.</td></tr></table>' +
    '<h2>Secció 5. Mesures de lluita contra incendis</h2>' +
    '<table><tr><td>Producte no inflamable. En cas d\'incendi de l\'entorn, usar agents extintors adequats a l\'entorn (CO₂, pols seca, escuma). No es preveuen productes de descomposició perillosos en condicions normals d\'ús.</td></tr></table>' +
    '<h2>Secció 6. Mesures en cas d\'abocament accidental</h2>' +
    '<table><tr><td>Absorbir amb material inert (sorra, terra de diatomees). Recollir en recipient tancat per a la seva eliminació. Esbandir la zona amb aigua. Evitar l\'abocament a la xarxa de clavegueram sense diluir.</td></tr></table>' +
    '<h2>Secció 7. Manipulació i emmagatzematge</h2>' +
    '<table><tr><td>Emmagatzemar en lloc fresc, sec i ben ventilat, protegit de la llum directa, entre 5°C i 30°C. Mantenir el recipient ben tancat. No barrejar amb altres productes químics, especialment lleixius o àcids.</td></tr></table>' +
    '<h2>Secció 8. Controls d\'exposició / protecció individual</h2>' +
    '<table><tr><td>Ús recomanat de guants de nitril per a manipulació concentrada. Ventilar l\'espai durant l\'aplicació. No es requereix protecció respiratòria en ús normal diluït.</td></tr></table>' +
    '<h2>Secció 9. Propietats fisicoquímiques</h2>' +
    '<table><tr><td class="k">Estat físic</td><td>Líquid</td></tr><tr><td class="k">pH (concentrat)</td><td>6,5 – 8,5 aprox.</td></tr><tr><td class="k">Solubilitat en aigua</td><td>Total</td></tr></table>' +
    '<h2>Secció 11-12. Informació toxicològica i ecològica</h2>' +
    '<table><tr><td>' + (info.biodegradable ? 'Biodegradabilitat: ' + escHtml(info.biodegradable) + '. ' : '') + 'Formulació dissenyada per minimitzar l\'impacte en ecosistemes aquàtics. Consultar la Secció 4 en cas d\'exposició accidental.</td></tr></table>' +
    '<h2>Secció 15. Informació reglamentària</h2>' +
    '<table><tr><td>Producte fabricat de conformitat amb la normativa europea de detergents (Reglament (CE) 648/2004) i, si escau, Reglament de Biocides (UE) 528/2012. ' + (info.certificacio ? 'Certificacions: ' + escHtml(info.certificacio) + '.' : '') + '</td></tr></table>' +
    '<div class="foot">Document generat automàticament des de la web d\'HIGIENEX el ' + new Date().toLocaleDateString('ca-ES') + '. Aquest document és una FDS simplificada amb finalitat informativa i de projecte acadèmic; no substitueix la Fitxa de Dades de Seguretat oficial reglamentària (Reglament REACH 1907/2006, Annex II), disponible sota petició al departament tècnic.</div>' +
    '</body></html>';
  abrirImprimibleComanda('FDS ' + name, html);
}
window.fpDescarregarFDS = fpDescarregarFDS;

// ── CATÀLEG COMPLET EN PDF ──────────────────────────────────
function hxDescarregarCataleg() {
  if (window.HXPDF_DOCS && HXPDF.disponible()) return HXPDF_DOCS.cataleg();
  if (typeof window.jspdf === 'undefined') { showToast('No s\'ha pogut carregar el generador de PDF.', '⚠️'); return; }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  var M=40, W=595.28;
  var y=46;
  doc.setFont('times','bold'); doc.setFontSize(21);
  doc.setTextColor(11,61,107);
  doc.text('HIGIENE', M, y);
  var w1=doc.getTextWidth('HIGIENE');
  doc.setTextColor(242,169,0);
  doc.text('X', M+w1, y);
  y += 20;
  doc.setFont('times','bold'); doc.setFontSize(15);
  doc.setTextColor(22,35,46);
  doc.text('Cat\u00e0leg complet de productes', M, y);
  y += 13;
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.setTextColor(138,155,172);
  doc.text('Higiene professional sostenible \u00b7 Actualitzat ' + new Date().toLocaleDateString('ca-ES'), M, y);
  y += 14;
  doc.setDrawColor(11,61,107); doc.setLineWidth(2);
  doc.line(M, y, W-M, y);
  y += 20;
  var body = Object.keys(CMP_DATA).map(function(name){
    var info = CMP_DATA[name];
    return [name + '\n' + info.us, info.sector, info.price, info.certificacio];
  });
  doc.autoTable({
    startY:y,
    head:[['Producte','Sector recomanat','Preu','Certificaci\u00f3']],
    body: body,
    theme:'plain',
    margin:{left:M, right:M, bottom:34},
    styles:{font:'helvetica', fontSize:9, textColor:[22,35,46], lineColor:[217,229,240], lineWidth:0.5, cellPadding:{top:7,bottom:7,left:8,right:8}, valign:'top'},
    headStyles:{fillColor:[11,61,107], textColor:255, fontStyle:'bold', fontSize:8.5, halign:'left'},
    alternateRowStyles:{fillColor:[245,250,255]},
    columnStyles:{0:{cellWidth:210,fontStyle:'bold'},1:{cellWidth:130},2:{cellWidth:80},3:{cellWidth:'auto'}},
    didParseCell: function(data){
      if (data.section==='body' && data.column.index===0){
        data.cell.styles.fontStyle='normal';
      }
    }
  });
  var total = doc.internal.getNumberOfPages();
  for (var i=1;i<=total;i++){
    doc.setPage(i);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
    doc.setTextColor(138,155,172);
    var footLines = doc.splitTextToSize("HIGIENEX S.L. \u00b7 Carrer de la Ind\u00fastria, 25, 46010 Val\u00e8ncia \u00b7 contacto@higienexvalencia.es \u00b7 631 706 398. Preus orientatius, subjectes a confirmaci\u00f3 per part de l'equip comercial.", W-2*M);
    doc.text(footLines, M, 818);
  }
  doc.save('Cataleg_HIGIENEX.pdf');
}
window.hxDescarregarCataleg = hxDescarregarCataleg;

function hxDescarregarCatalegExcel() {
  if (!window.XLSX) { showToast('Encara es carrega el mòdul d\'Excel, torna-ho a provar en un segon.', '⚠️'); return; }
  var rows = [['Producte', 'Sector recomanat', 'Preu', 'Concentració', 'Certificació', 'Biodegradable', 'Reducció envàs', 'Ús principal']];
  Object.keys(CMP_DATA).forEach(function(name){
    var info = CMP_DATA[name];
    rows.push([name, info.sector, info.price, info.concentracio, info.certificacio, info.biodegradable, info.envas, info.us]);
  });
  try {
    var ws = XLSX.utils.aoa_to_sheet(rows);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Catàleg HIGIENEX');
    XLSX.writeFile(wb, 'cataleg-higienex-' + new Date().toISOString().slice(0,10) + '.xlsx');
  } catch(e) { showToast('No s\'ha pogut generar l\'Excel.', '⚠️'); }
}
window.hxDescarregarCatalegExcel = hxDescarregarCatalegExcel;

// ═══════════════════════════════════════════════════════════
// CÀRREGA MASSIVA DE COMANDA DES D'UN FITXER EXCEL/CSV
// ═══════════════════════════════════════════════════════════
function hxOpenBulkUpload() {
  var m = document.getElementById('bulkUploadModal');
  if (m) m.classList.add('open');
  document.body.style.overflow = 'hidden';
  var result = document.getElementById('bulkUploadResult');
  if (result) result.innerHTML = '';
  var input = document.getElementById('bulkUploadInput');
  if (input) input.value = '';
}
window.hxOpenBulkUpload = hxOpenBulkUpload;
function closeBulkUpload() {
  var m = document.getElementById('bulkUploadModal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeBulkUpload = closeBulkUpload;

function hxDownloadBulkTemplate() {
  if (!window.XLSX) { showToast('Encara es carrega el mòdul d\'Excel, torna-ho a provar en un segon.', '⚠️'); return; }
  var rows = [
    ['Producte', 'Quantitat'],
    ['ECO Concentrat Pro', 10],
    ['Desinfectant HOSP-V', 5],
    ['Detergent ALIM-PRO', 3]
  ];
  try {
    var ws = XLSX.utils.aoa_to_sheet(rows);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Comanda');
    XLSX.writeFile(wb, 'plantilla-comanda-higienex.xlsx');
  } catch(e) { showToast('No s\'ha pogut generar la plantilla.', '⚠️'); }
}
window.hxDownloadBulkTemplate = hxDownloadBulkTemplate;

function hxNormalitzaNomProducte(txt) {
  return String(txt || '').trim().toLowerCase();
}

function hxProcessBulkUpload(input) {
  var file = input.files && input.files[0];
  var resultBox = document.getElementById('bulkUploadResult');
  if (!file) return;
  if (!window.XLSX) { showToast('Encara es carrega el mòdul d\'Excel, torna-ho a provar en un segon.', '⚠️'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      var wb = XLSX.read(data, {type: 'array'});
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var rows = XLSX.utils.sheet_to_json(sheet, {header: 1});
      var mapaNorm = {};
      Object.keys(CP_PRODUCT_MAP).forEach(function(k){
        mapaNorm[hxNormalitzaNomProducte(k)] = CP_PRODUCT_MAP[k];
      });
      var afegits = [], noReconeguts = [], filesInvalides = 0;
      rows.forEach(function(row, idx){
        if (idx === 0) return;
        if (!row || row.length === 0) return;
        var nomCell = row[0], qtyCell = row[1];
        if (nomCell === undefined || nomCell === null || String(nomCell).trim() === '') return;
        var qty = parseInt(qtyCell, 10);
        if (!qty || qty <= 0) { filesInvalides++; return; }
        var match = mapaNorm[hxNormalitzaNomProducte(nomCell)];
        if (match) {
          cpAddDirectToCart(match.nom, match.preu, qty);
          afegits.push(match.nom + ' × ' + qty);
        } else {
          noReconeguts.push(String(nomCell));
        }
      });
      renderCart();
      var html = '';
      if (afegits.length) {
        html += '<div style="background:#E8F5E9;border-radius:10px;padding:0.8rem 1rem;margin-bottom:0.6rem;font-size:0.82rem;color:#2E7D32;"><strong>✅ ' + afegits.length + ' afegits al cistell:</strong><br>' + afegits.join('<br>') + '</div>';
      }
      if (noReconeguts.length) {
        html += '<div style="background:#FFF3E0;border-radius:10px;padding:0.8rem 1rem;margin-bottom:0.6rem;font-size:0.82rem;color:#B8621B;"><strong>⚠️ ' + noReconeguts.length + ' no reconeguts:</strong><br>' + noReconeguts.join('<br>') + '</div>';
      }
      if (filesInvalides > 0) {
        html += '<div style="font-size:0.78rem;color:#999;">' + filesInvalides + ' fila(es) amb quantitat no vàlida, ignorades.</div>';
      }
      if (!afegits.length && !noReconeguts.length) {
        html = '<div style="font-size:0.85rem;color:#999;">No s\'ha trobat cap fila amb dades. Comprova el format del fitxer.</div>';
      }
      if (resultBox) resultBox.innerHTML = html;
      if (afegits.length) showToast(afegits.length + ' productes afegits al cistell.', '✅');
    } catch(err) {
      if (resultBox) resultBox.innerHTML = '<div style="color:#B8621B;font-size:0.85rem;">No s\'ha pogut llegir el fitxer. Comprova que sigui un .xlsx o .csv vàlid.</div>';
    }
  };
  reader.readAsArrayBuffer(file);
}
window.hxProcessBulkUpload = hxProcessBulkUpload;

// ═══════════════════════════════════════════════════════════
// WIDGET "ÚLTIMA ACTUALITZACIÓ DE PREUS"
// ═══════════════════════════════════════════════════════════
var HX_PREUS_ACTUALITZATS = '2026-08-01'; // ← canvia aquesta data quan actualitzis preus
var HX_PRICE_BADGE_LABEL = {ca:'🕒 Preus actualitzats el',es:'🕒 Precios actualizados el',en:'🕒 Prices updated on',fr:'🕒 Prix mis à jour le',de:'🕒 Preise aktualisiert am'};
var HX_LOCALE_MAP = {ca:'ca-ES',es:'es-ES',en:'en-GB',fr:'fr-FR',de:'de-DE'};
function hxRenderPriceBadge(){
  var el = document.getElementById('hxPriceUpdatedBadge');
  if (!el) return;
  var lang = 'ca'; try { lang = localStorage.getItem('hx_lang') || 'ca'; } catch(e) {}
  var d = new Date(HX_PREUS_ACTUALITZATS + 'T00:00:00');
  var dateStr = d.toLocaleDateString(HX_LOCALE_MAP[lang] || 'ca-ES', {day:'numeric',month:'long',year:'numeric'});
  el.innerHTML = (HX_PRICE_BADGE_LABEL[lang] || HX_PRICE_BADGE_LABEL.ca) + ' ' + dateStr;
}
document.addEventListener('DOMContentLoaded', hxRenderPriceBadge);
document.addEventListener('click', function(e){
  if (e.target && e.target.closest && e.target.closest('#langDropdownMenu button')) {
    setTimeout(hxRenderPriceBadge, 60);
  }
});

// ── RESUM DE CERTIFICACIONS EN PDF ──────────────────────────────────
function hxDescarregarCertificats() {
  if (window.HXPDF_DOCS && HXPDF.disponible()) return HXPDF_DOCS.certificacions();
  var certs = [
    {name:'ISO 14001', desc:"Sistema de gesti\u00f3 ambiental certificat per una entitat independent. Vigent des de 2022."},
    {name:'Registre de Biocides UE', desc:'Desinfectants TP2 (superf\u00edcies) i TP4 (contacte alimentari) registrats segons el Reglament de Biocides (UE) 528/2012.'},
    {name:'Homologaci\u00f3 HACCP', desc:'Productes de la l\u00ednia ALIM homologats per a \u00fas en superf\u00edcies de contacte alimentari.'},
    {name:'19 patents pr\u00f2pies', desc:"Formulacions desenvolupades i patentades pel laboratori R+D independent d'HIGIENEX des de 2018."}
  ];
  if (typeof window.jspdf === 'undefined') { showToast('No s\'ha pogut carregar el generador de PDF.', '⚠️'); return; }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  var W=595.28, H=841.89, cx=W/2;
  var outX=40, outY=40, outW=W-80, outH=H-80;
  doc.setFillColor(243,239,228); doc.rect(0,0,W,H,'F');
  doc.setDrawColor(242,169,0); doc.setLineWidth(2);
  doc.setFillColor(255,255,255);
  doc.rect(outX, outY, outW, outH, 'FD');
  var inX=outX+10, inY=outY+10, inW=outW-20, inH=outH-20;
  doc.setDrawColor(11,61,107); doc.setLineWidth(1);
  doc.rect(inX, inY, inW, inH);
  var y = inY+56;
  doc.setFont('times','bold'); doc.setFontSize(20);
  doc.setTextColor(11,61,107);
  var wH=doc.getTextWidth('HIGIENE');
  doc.text('HIGIENE', cx-wH/2, y);
  doc.setTextColor(242,169,0);
  doc.text('X', cx-wH/2+wH, y);
  y += 20;
  doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.setTextColor(184,134,11);
  doc.text('DOCUMENT OFICIAL DE CERTIFICACIONS', cx, y, {align:'center'});
  y += 26;
  doc.setFont('times','bold'); doc.setFontSize(17);
  doc.setTextColor(22,35,46);
  doc.text('Resum de Certificacions i Garanties', cx, y, {align:'center'});
  y += 18;
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
  doc.setTextColor(138,155,172);
  var subLines = doc.splitTextToSize('Document per compartir amb el vostre departament de compres. Totes les certificacions estan verificades per entitats independents i disponibles per a consulta detallada.', 380);
  doc.text(subLines, cx, y, {align:'center'});
  y += subLines.length*11 + 26;
  var gap=16, cardW=(inW-40-gap)/2, cardH=92, gx0=inX+20;
  certs.forEach(function(c, i){
    var col = i%2, row = Math.floor(i/2);
    var cx2 = gx0 + col*(cardW+gap);
    var cy = y + row*(cardH+gap);
    doc.setDrawColor(237,230,211); doc.setLineWidth(0.75);
    doc.setFillColor(253,252,248);
    doc.roundedRect(cx2, cy, cardW, cardH, 8, 8, 'FD');
    doc.setFont('helvetica','bold'); doc.setFontSize(11);
    doc.setTextColor(11,61,107);
    doc.text(c.name, cx2+16, cy+24);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
    doc.setTextColor(85,85,85);
    var dLines = doc.splitTextToSize(c.desc, cardW-32);
    doc.text(dLines, cx2+16, cy+40);
  });
  y += cardH*2 + gap + 30;
  doc.setFont('times','bolditalic'); doc.setFontSize(24);
  doc.setTextColor(242,169,0);
  doc.text('X', cx, y, {align:'center'});
  y += 20;
  var dataStr = new Date().toLocaleDateString('ca-ES', {day:'numeric', month:'long', year:'numeric'});
  doc.setFont('helvetica','italic'); doc.setFontSize(9.5);
  doc.setTextColor(138,155,172);
  doc.text('Em\u00e8s digitalment per HIGIENEX S.L. \u00b7 ' + dataStr, cx, y, {align:'center'});
  y += 18;
  doc.setDrawColor(240,237,227); doc.setLineWidth(0.5);
  doc.line(inX+60, y, inX+inW-60, y);
  y += 14;
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  doc.setTextColor(176,184,192);
  doc.text('HIGIENEX S.L. \u00b7 Carrer de la Ind\u00fastria, 25, 46010 Val\u00e8ncia \u00b7 contacto@higienexvalencia.es \u00b7 631 706 398', cx, y, {align:'center'});
  doc.text('Certificats complets disponibles sota petici\u00f3 al departament t\u00e8cnic.', cx, y+11, {align:'center'});
  doc.save('Certificacions_HIGIENEX.pdf');
}
window.hxDescarregarCertificats = hxDescarregarCertificats;

// ── PLA D'EXPANSIÓ A PORTUGAL EN PDF (estil informe executiu) ──────
function hxDescarregarPlaPortugal() {
  var timeline = [
    {any:'2025', titol:'Consolidaci\u00f3 nacional', desc:"Refor\u00e7 de la posici\u00f3 al mercat espanyol. Xarxa de distribuci\u00f3 optimitzada. Preparaci\u00f3 del pla Portugal i adaptaci\u00f3 d'etiquetatge."},
    {any:'2026', titol:'Entrada a Portugal', desc:'Estrat\u00e8gia indirecta via distribu\u00efdors locals especialitzats. Inversi\u00f3: 15.000-23.000 \u20ac/any. Sectors objectiu: hosteleria, sanitari i alimentari.'},
    {any:'2027', titol:'Filial comercial pr\u00f2pia', desc:"Un cop consolidada la base de clients a Portugal, establiment d'una filial per augmentar el control sobre la distribuci\u00f3 i la marca."},
    {any:'2028+', titol:'Expansi\u00f3 UE: Fran\u00e7a i Alemanya', desc:'Mercats on el concepte de wellbeing corporatiu \u00e9s molt avan\u00e7at. WorkSafe Smart Space com a producte de bandera per a l\'entrada.'}
  ];
  var kpis = [
    ['180.000 \u20ac', 'Facturaci\u00f3 objectiu any 1'],
    ['12-15', 'Clients actius objectiu any 1'],
    ['2', 'Distribu\u00efdors (Lisboa i Porto)'],
    ['18-24', "Mesos fins a punt d'equilibri"]
  ];
  var pressupost = [
    ["Adaptaci\u00f3 d'etiquetatge i documentaci\u00f3 (PT)", 3500],
    ['Prospecci\u00f3 i acords amb distribu\u00efdors', 4000],
    ['Log\u00edstica i primer estoc a Portugal', 8500],
    ['M\u00e0rqueting i fires sectorials (Lisboa/Porto)', 4500],
    ['Assessoria legal i fiscal transfronterera', 2500]
  ];
  var totalPressupost = pressupost.reduce(function(s,p){ return s+p[1]; }, 0);
  var riscos = [
    {tit:'Depend\u00e8ncia del distribu\u00efdor', desc:'Acord de distribuci\u00f3 no exclusiu els primers 12 mesos i objectius de venda revisables trimestralment.'},
    {tit:'Difer\u00e8ncies normatives locals', desc:'Assessoria especialitzada en registre de biocides a Portugal abans del lla\u00e7ament comercial.'},
    {tit:'Costos log\u00edstics transfronterers', desc:'Consolidaci\u00f3 de comandes i \u00fas de la mateixa flota que ja cobreix Extremadura per reduir el cost per enviament.'}
  ];
  if (typeof window.jspdf === 'undefined') { showToast('No s\'ha pogut carregar el generador de PDF.', '⚠️'); return; }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  var M=44, W=595.28, H=841.89;
  function espai(y, minim){ if (y > H-40-minim) { doc.addPage(); return 40; } return y; }
  // Capçalera navy
  doc.setFillColor(11,61,107);
  doc.rect(0,0,W,118,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
  doc.setTextColor(255,255,255);
  doc.text('CONFIDENCIAL \u00b7 \u00daS INTERN', W-M, 26, {align:'right'});
  doc.setFont('times','bold'); doc.setFontSize(14);
  doc.text('HIGIENE', M, 34);
  var wH=doc.getTextWidth('HIGIENE');
  doc.setTextColor(242,169,0);
  doc.text('X', M+wH, 34);
  doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.setTextColor(242,169,0);
  doc.text('PLA ESTRAT\u00c8GIC \u00b7 HORITZ\u00d3 2025-2028', M, 56);
  doc.setFont('times','bold'); doc.setFontSize(21);
  doc.setTextColor(255,255,255);
  doc.text("Pla d'Expansi\u00f3 a Portugal 2026", M, 80);
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.setTextColor(210,222,234);
  var headDesc = doc.splitTextToSize('Mercat atractiu per proximitat, similitud cultural i estructura de demanda similar. Entrada via distribu\u00efdors locals especialitzats en higiene professional.', 420);
  doc.text(headDesc, M, 98);
  doc.setFillColor(4,106,56); doc.rect(0,118,W*0.38,4,'F');
  doc.setFillColor(218,2,14); doc.rect(W*0.38,118,W*0.62,4,'F');
  var y = 150;
  doc.setDrawColor(242,169,0); doc.setLineWidth(3);
  doc.line(M, y-8, M, y+34);
  doc.setDrawColor(237,241,244); doc.setLineWidth(0.75);
  doc.roundedRect(M+6, y-8, W-2*M-6, 44, 6, 6);
  doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.setTextColor(11,61,107);
  doc.text('Resum executiu:', M+16, y+6);
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
  doc.setTextColor(74,90,106);
  var sumLines = doc.splitTextToSize("entrada gradual i de risc controlat al mercat portugu\u00e8s mitjan\u00e7ant distribu\u00efdors especialitzats, amb un pressupost d'any 1 de 23.000 \u20ac i un objectiu de facturaci\u00f3 de 180.000 \u20ac, com a primer pas cap a una filial pr\u00f2pia i l'expansi\u00f3 posterior a Fran\u00e7a i Alemanya.", W-2*M-32);
  doc.text(sumLines, M+16, y+18);
  y += 60;
  function seccioTitol(text){
    y = espai(y, 50);
    doc.setFont('helvetica','bold'); doc.setFontSize(10.5);
    doc.setTextColor(11,61,107);
    doc.text(text.toUpperCase(), M, y);
    doc.setDrawColor(242,169,0); doc.setLineWidth(2);
    doc.line(M, y+5, M+doc.getTextWidth(text.toUpperCase()), y+5);
    y += 22;
  }
  // Full de ruta (timeline en 4 columnes)
  seccioTitol('Full de ruta');
  var tlW=(W-2*M-3*12)/4;
  var tlH=110;
  y = espai(y, tlH);
  timeline.forEach(function(t,i){
    var x = M + i*(tlW+12);
    doc.setFillColor(245,248,250);
    doc.setDrawColor(11,61,107); doc.setLineWidth(1.2);
    doc.circle(x+13, y+11, 12, 'FD');
    doc.setFont('times','bold'); doc.setFontSize(12.5);
    doc.setTextColor(242,169,0);
    doc.text(t.any, x, y+38);
    doc.setFont('helvetica','bold'); doc.setFontSize(9);
    doc.setTextColor(22,35,46);
    var titLines = doc.splitTextToSize(t.titol, tlW);
    doc.text(titLines, x, y+50);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.8);
    doc.setTextColor(102,102,102);
    var descLines = doc.splitTextToSize(t.desc, tlW);
    doc.text(descLines, x, y+50+titLines.length*10+8);
  });
  y += tlH + 20;
  // KPIs
  seccioTitol('Objectius clau');
  var kW=(W-2*M-3*10)/4, kH=64;
  y = espai(y, kH);
  kpis.forEach(function(k,i){
    var x = M + i*(kW+10);
    doc.setFillColor(247,249,251);
    doc.setDrawColor(237,241,244); doc.setLineWidth(0.75);
    doc.roundedRect(x, y, kW, kH, 8, 8, 'FD');
    doc.setFont('times','bold'); doc.setFontSize(15);
    doc.setTextColor(11,61,107);
    doc.text(k[0], x+kW/2, y+26, {align:'center'});
    doc.setFont('helvetica','normal'); doc.setFontSize(7);
    doc.setTextColor(138,155,172);
    var lblLines = doc.splitTextToSize(k[1], kW-10);
    doc.text(lblLines, x+kW/2, y+40, {align:'center'});
  });
  y += kH + 24;
  // Pressupost
  seccioTitol('Pressupost estimat \u00b7 Any 1');
  y = espai(y, pressupost.length*24+40);
  pressupost.forEach(function(p){
    var pct = p[1]/totalPressupost;
    doc.setFont('helvetica','normal'); doc.setFontSize(9);
    doc.setTextColor(51,51,51);
    doc.text(p[0], M, y);
    doc.setFont('helvetica','bold');
    doc.setTextColor(11,61,107);
    doc.text(p[1].toLocaleString('ca-ES')+' \u20ac', W-M, y, {align:'right'});
    y += 8;
    doc.setFillColor(238,242,245);
    doc.roundedRect(M, y, W-2*M, 5, 2.5, 2.5, 'F');
    doc.setFillColor(242,169,0);
    doc.roundedRect(M, y, (W-2*M)*pct, 5, 2.5, 2.5, 'F');
    y += 18;
  });
  doc.setFillColor(11,61,107);
  doc.roundedRect(M, y, W-2*M, 32, 8, 8, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.setTextColor(191,212,232);
  doc.text('TOTAL ESTIMAT', M+16, y+20);
  doc.setFont('times','bold'); doc.setFontSize(15);
  doc.setTextColor(242,169,0);
  doc.text(totalPressupost.toLocaleString('ca-ES')+' \u20ac', W-M-16, y+21, {align:'right'});
  y += 32 + 24;
  // Riscos
  seccioTitol('Riscos i mitigaci\u00f3');
  var rW=(W-2*M-2*12)/3, rH=100;
  y = espai(y, rH);
  riscos.forEach(function(r,i){
    var x = M + i*(rW+12);
    doc.setFillColor(251,246,235);
    doc.setDrawColor(201,138,0); doc.setLineWidth(2.2);
    doc.roundedRect(x, y, rW, rH, 6, 6, 'FD');
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
    doc.setTextColor(138,89,0);
    var titLines = doc.splitTextToSize(r.tit, rW-20);
    doc.text(titLines, x+12, y+18);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.8);
    doc.setTextColor(102,102,102);
    var descLines = doc.splitTextToSize(r.desc, rW-20);
    doc.text(descLines, x+12, y+18+titLines.length*11+10);
  });
  y += rH + 30;
  y = espai(y, 40);
  doc.setDrawColor(238,238,238); doc.setLineWidth(0.5);
  doc.line(M, y, W-M, y);
  y += 14;
  doc.setFont('helvetica','bold'); doc.setFontSize(8);
  doc.setTextColor(201,178,122);
  doc.text('REF: HX-PT2026-V1', W/2, y, {align:'center'});
  y += 12;
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  doc.setTextColor(176,184,192);
  doc.text('HIGIENEX S.L. \u00b7 Carrer de la Ind\u00fastria, 25, 46010 Val\u00e8ncia \u00b7 contacto@higienexvalencia.es \u00b7 631 706 398', W/2, y, {align:'center'});
  doc.text('Document intern de planificaci\u00f3 estrat\u00e8gica \u00b7 Generat el '+new Date().toLocaleDateString('ca-ES',{day:'numeric',month:'long',year:'numeric'}), W/2, y+11, {align:'center'});
  doc.save('Pla_Expansio_Portugal_HIGIENEX.pdf');
}
window.hxDescarregarPlaPortugal = hxDescarregarPlaPortugal;


// ── FILTRE DEL BLOG PER CATEGORIA ──────────────────────────────────
function hxFilterBlog(cat){
  var cards = document.querySelectorAll('#nlGrid .blog-card');
  cards.forEach(function(card){
    var show = (cat === 'all') || (card.getAttribute('data-cat') === cat);
    card.style.display = show ? '' : 'none';
  });
  document.querySelectorAll('#nlFilters .nl-filter-btn').forEach(function(btn){
    btn.classList.toggle('active', btn.getAttribute('data-filter') === cat);
  });
}
window.hxFilterBlog = hxFilterBlog;

// ═══════════════════════════════════════════════════════════
// SIMULADOR DE COMANDA RECURRENT
// ═══════════════════════════════════════════════════════════
function hxRecurrentInit(){
  var sel = document.getElementById('recProducte');
  if (!sel) return;
  sel.innerHTML = PRODUCTS.map(function(p){
    return '<option value="' + escHtml(p.name) + '">' + escHtml(p.name) + '</option>';
  }).join('');
  hxRecurrentRun();
}

function hxRecurrentDescompte(qty){
  if (qty >= 20) return 0.15;
  if (qty >= 10) return 0.10;
  if (qty >= 5) return 0.05;
  return 0;
}

function hxRecurrentRun(){
  var sel = document.getElementById('recProducte');
  var qtyEl = document.getElementById('recQty');
  var freqEl = document.getElementById('recFreq');
  if (!sel || !qtyEl || !freqEl) return;
  var name = sel.value;
  var qty = Math.max(1, parseInt(qtyEl.value, 10) || 1);
  var freqMesos = parseInt(freqEl.value, 10) || 1;
  var prod = PRODUCTS.find(function(p){ return p.name === name; });
  if (!prod) return;

  var descompte = hxRecurrentDescompte(qty);
  var preuUnitari = prod.price * (1 - descompte);
  var importComanda = preuUnitari * qty;
  var comandesPerAny = Math.round(12 / freqMesos);
  var costAnualAmbSub = importComanda * comandesPerAny;
  var costAnualSenseSub = prod.price * qty * comandesPerAny; // mateix volum, sense descompte
  var estalviAnual = Math.max(0, costAnualSenseSub - costAnualAmbSub);

  var outDesc = document.getElementById('recOutDescompte');
  var outCom = document.getElementById('recOutComanda');
  var outAnual = document.getElementById('recOutAnual');
  if (outDesc) outDesc.textContent = descompte > 0 ? ('-' + Math.round(descompte*100) + '%') : '—';
  if (outCom) outCom.textContent = importComanda.toFixed(2) + ' €';
  if (outAnual) outAnual.textContent = estalviAnual.toFixed(2) + ' €';
}
window.hxRecurrentRun = hxRecurrentRun;

function hxRecurrentAfegir(){
  var sel = document.getElementById('recProducte');
  var qtyEl = document.getElementById('recQty');
  if (!sel || !qtyEl) return;
  var name = sel.value;
  var qty = Math.max(1, parseInt(qtyEl.value, 10) || 1);
  var prod = PRODUCTS.find(function(p){ return p.name === name; });
  if (!prod) return;
  if (cart[name]) { cart[name].qty += qty; }
  else { cart[name] = { qty: qty, price: prod.price }; }
  if (typeof recalcCartLine === 'function') recalcCartLine(name);
  if (typeof renderCart === 'function') renderCart();
  var msgId = 'recAfegitMsg';
  var existing = document.getElementById(msgId);
  if (existing) existing.remove();
  var btn = document.querySelector('#simulador-recurrent button[onclick="hxRecurrentAfegir()"]');
  if (btn) {
    var msg = document.createElement('p');
    msg.id = msgId;
    msg.style.cssText = 'color:#2E7D32;font-size:0.82rem;font-weight:700;margin-top:0.8rem;text-align:center;';
    msg.textContent = '✅ ' + qty + '× ' + name + ' — afegit al teu cistell.';
    btn.parentNode.appendChild(msg);
    setTimeout(function(){ if (msg.parentNode) msg.remove(); }, 4000);
  }
}
window.hxRecurrentAfegir = hxRecurrentAfegir;

document.addEventListener('DOMContentLoaded', hxRecurrentInit);


// ═══════════════════════════════════════════════════════════
// VALORACIONS DE PRODUCTES (estrelles)
// ═══════════════════════════════════════════════════════════
var HX_REVIEWS_KEY = 'hx_reviews';
var HX_REVIEWS_SEED = {
  'ECO Concentrat Pro': [
    {n:'Marta S.', s:5, t:'Reduïm molt l\'espai d\'emmagatzematge des que fem servir els concentrats. Molt recomanable.'},
    {n:'Josep R.', s:4, t:'Bon rendiment, encara que el primer cop cal ajustar-se bé a la dilució.'}
  ],
  'Desinfectant HOSP-V': [
    {n:'Dra. Elena V.', s:5, t:'El que fem servir a planta des de fa un any. Eficàcia demostrada.'}
  ],
  'Detergent ALIM-PRO': [
    {n:'Responsable de cuina', s:5, t:'Compleix HACCP sense complicacions i el rendiment és molt bo.'}
  ],
  'Net HOSTAL Premium': [
    {n:'Direcció Hotel', s:4, t:'Bona relació qualitat-preu per a ús diari a habitacions.'}
  ]
};
function hxReviewsLoad(){
  try {
    var raw = localStorage.getItem(HX_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}
function hxReviewsSave(data){
  try { localStorage.setItem(HX_REVIEWS_KEY, JSON.stringify(data)); } catch(e) {}
}
function hxReviewsFor(name){
  var stored = hxReviewsLoad();
  var seed = HX_REVIEWS_SEED[name] || [];
  var user = stored[name] || [];
  return seed.concat(user);
}
function hxStarsHtml(score, size){
  size = size || '1rem';
  var full = Math.round(score);
  var html = '';
  for (var i=1; i<=5; i++) html += '<span style="font-size:' + size + ';color:' + (i<=full ? '#F2A900' : '#DDD') + ';">★</span>';
  return html;
}
var HX_CURRENT_REVIEW_STARS = 5;
function hxRenderProductRating(name, targetRatingId, targetListId){
  var reviews = hxReviewsFor(name);
  var ratingEl = document.getElementById(targetRatingId);
  if (ratingEl) {
    if (!reviews.length) {
      ratingEl.innerHTML = '<span style="color:var(--charcoal);opacity:0.55;font-size:0.82rem;">Encara sense valoracions</span>';
    } else {
      var avg = reviews.reduce(function(s,r){ return s+r.s; },0) / reviews.length;
      ratingEl.innerHTML = hxStarsHtml(avg) + ' <span style="color:var(--charcoal);opacity:0.65;font-size:0.8rem;margin-left:0.3rem;">' + avg.toFixed(1) + ' (' + reviews.length + ')</span>';
    }
  }
  var listEl = targetListId ? document.getElementById(targetListId) : null;
  if (listEl) {
    if (!reviews.length) {
      listEl.innerHTML = '<p style="color:var(--charcoal);opacity:0.6;font-size:0.85rem;">Encara no hi ha valoracions d\'aquest producte. Sigues el primer a opinar!</p>';
    } else {
      listEl.innerHTML = reviews.map(function(r){
        return '<div style="background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:0.9rem 1.1rem;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">' +
          '<span style="font-weight:700;color:var(--green-deep);font-size:0.85rem;">' + escHtml(r.n||'Client anònim') + '</span>' +
          '<span>' + hxStarsHtml(r.s, '0.85rem') + '</span></div>' +
          '<p style="margin:0;font-size:0.83rem;color:var(--charcoal);opacity:0.85;">' + escHtml(r.t||'') + '</p></div>';
      }).join('');
    }
  }
}
function hxRenderReviewStarsPicker(){
  var el = document.getElementById('fpReviewStars');
  if (!el) return;
  el.innerHTML = [1,2,3,4,5].map(function(i){
    return '<span onclick="hxSetReviewStars(' + i + ')" style="cursor:pointer;color:' + (i<=HX_CURRENT_REVIEW_STARS ? '#F2A900' : '#DDD') + ';">★</span>';
  }).join('');
}
function hxSetReviewStars(n){
  HX_CURRENT_REVIEW_STARS = n;
  hxRenderReviewStarsPicker();
}
window.hxSetReviewStars = hxSetReviewStars;
function fpEnviarValoracio(){
  var name = document.getElementById('fpName').textContent;
  var nameInput = document.getElementById('fpReviewName');
  var textInput = document.getElementById('fpReviewText');
  var text = textInput ? textInput.value.trim() : '';
  if (!text) { showToast('Escriu un breu comentari abans d\'enviar.', '⚠️'); return; }
  var data = hxReviewsLoad();
  if (!data[name]) data[name] = [];
  data[name].push({ n: (nameInput && nameInput.value.trim()) || 'Client anònim', s: HX_CURRENT_REVIEW_STARS, t: text });
  hxReviewsSave(data);
  if (nameInput) nameInput.value = '';
  if (textInput) textInput.value = '';
  HX_CURRENT_REVIEW_STARS = 5;
  hxRenderReviewStarsPicker();
  hxRenderProductRating(name, 'fpRating', 'fpReviewsList');
  showToast('Gràcies per la teva valoració!', '⭐');
}
window.fpEnviarValoracio = fpEnviarValoracio;

// ═══════════════════════════════════════════════════════════
// COMPARTIR ENTRADES DEL BLOG A XARXES SOCIALS
// ═══════════════════════════════════════════════════════════
function hxShareUrl(){
  return 'https://ossama450298-commits.github.io/Higienexweb/';
}
function hxShareBlog(network, title){
  // Se lee el título al compartir, en el idioma que se ve ahora (antes se guardaba en catalán)
  if (title && title.closest) { var t = title.closest('.blog-card'); t = t && t.querySelector('.blog-title'); title = t ? t.textContent.trim() : ''; }
  var url = encodeURIComponent(hxShareUrl());
  var text = encodeURIComponent(title + ' — HIGIENEX');
  var links = {
    whatsapp: 'https://wa.me/?text=' + text + '%20' + url,
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
    twitter: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
    email: 'mailto:?subject=' + text + '&body=' + encodeURIComponent(title + '\n\n' + hxShareUrl())
  };
  if (links[network]) window.open(links[network], '_blank', 'noopener,noreferrer');
}
window.hxShareBlog = hxShareBlog;

function hxInjectBlogShareButtons(){
  var cards = document.querySelectorAll('.blog-card');
  cards.forEach(function(card){
    if (card.querySelector('.hx-share-row')) return; // ja té botons
    var content = card.querySelector('.blog-content');
    var titleEl = card.querySelector('.blog-title');
    if (!content || !titleEl) return;
    var title = titleEl.textContent.trim();
    var row = document.createElement('div');
    row.className = 'hx-share-row';
    row.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.7rem;';
    row.innerHTML =
      '<button type="button" onclick="event.stopPropagation();hxShareBlog(\'whatsapp\',this)" title="Compartir a WhatsApp" aria-label="Compartir a WhatsApp" style="background:none;border:none;cursor:pointer;font-size:1rem;opacity:0.65;">💬</button>' +
      '<button type="button" onclick="event.stopPropagation();hxShareBlog(\'linkedin\',this)" title="Compartir a LinkedIn" aria-label="Compartir a LinkedIn" style="background:none;border:none;cursor:pointer;font-size:1rem;opacity:0.65;">💼</button>' +
      '<button type="button" onclick="event.stopPropagation();hxShareBlog(\'twitter\',this)" title="Compartir a X" aria-label="Compartir a X" style="background:none;border:none;cursor:pointer;font-size:1rem;opacity:0.65;">🐦</button>' +
      '<button type="button" onclick="event.stopPropagation();hxShareBlog(\'email\',this)" title="Compartir per email" aria-label="Compartir per email" style="background:none;border:none;cursor:pointer;font-size:1rem;opacity:0.65;">✉️</button>';
    content.appendChild(row);
  });
}
document.addEventListener('DOMContentLoaded', hxInjectBlogShareButtons);
// Cada vegada que naveguem (les cards del blog es mostren en diferents pàgines) tornem a injectar
var _hxOrigNavTo = navTo;
navTo = function(id){ _hxOrigNavTo(id); setTimeout(hxInjectBlogShareButtons, 60); };
window.navTo = navTo;

// ═══════════════════════════════════════════════════════════
// DETECCIÓ DE CONNEXIÓ (mode offline de la PWA)
// ═══════════════════════════════════════════════════════════
function hxUpdateOfflineBanner(){
  var banner = document.getElementById('hxOfflineBanner');
  if (!banner) return;
  banner.style.display = navigator.onLine ? 'none' : 'block';
  document.body.style.paddingTop = navigator.onLine ? '' : '2.1rem';
}
window.addEventListener('online', hxUpdateOfflineBanner);
window.addEventListener('offline', hxUpdateOfflineBanner);
document.addEventListener('DOMContentLoaded', hxUpdateOfflineBanner);

// Accessibilitat: tancar amb la tecla Escape qualsevol modal/desplegable obert
document.addEventListener('keydown', function(e){
  if (e.key !== 'Escape') return;
  var closed = false;
  var langMenu = document.getElementById('langDropdownMenu');
  if (langMenu && langMenu.classList.contains('open')) { hxToggleLangMenu(false); closed = true; }
  var navDropdown = document.getElementById('navDropdown');
  if (navDropdown && navDropdown.classList.contains('open')) {
    navDropdown.classList.remove('open');
    var bd = document.getElementById('navBackdrop'); if (bd) bd.classList.remove('open');
    var icon = document.getElementById('menuIcon'); if (icon) icon.textContent = '☰';
    closed = true;
  }
  var samplePop = document.getElementById('samplePopup');
  if (samplePop && getComputedStyle(samplePop).display !== 'none' && typeof closeSamplePopup === 'function') { closeSamplePopup(); closed = true; }
  var authModal = document.getElementById('authModal');
  if (authModal && authModal.classList.contains('open') && typeof closeAuthModal === 'function') { closeAuthModal(); closed = true; }
  var prodPopup = document.getElementById('productPopup');
  if (prodPopup && prodPopup.classList.contains('open') && typeof closeProductPopup === 'function') { closeProductPopup(); closed = true; }
});

// ═══════════════════════════════════════════════════════════
// ANALÍTICA BÀSICA (sense servidor — es guarda al navegador i
// es pot consultar des del panell d'administració del ERP,
// ja que comparteixen el mateix localStorage de domini)
// ═══════════════════════════════════════════════════════════
var HX_ANALYTICS_KEY = 'hx_analytics';
var HX_ANALYTICS_MAX_EVENTS = 500; // evita que el localStorage creixi sense límit

function hxAnalyticsLoad(){
  try {
    var raw = localStorage.getItem(HX_ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : { pageViews: {}, productViews: {}, events: [] };
  } catch(e) { return { pageViews: {}, productViews: {}, events: [] }; }
}
function hxAnalyticsSave(data){
  try { localStorage.setItem(HX_ANALYTICS_KEY, JSON.stringify(data)); } catch(e) {}
}
function hxTrackPageView(pageId){
  if (!pageId) return;
  hxStat({ k: 'v', p: String(pageId).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40) });
  var data = hxAnalyticsLoad();
  data.pageViews[pageId] = (data.pageViews[pageId] || 0) + 1;
  data.events.push({ t: Date.now(), type: 'page', id: pageId });
  if (data.events.length > HX_ANALYTICS_MAX_EVENTS) data.events = data.events.slice(-HX_ANALYTICS_MAX_EVENTS);
  hxAnalyticsSave(data);
}
function hxTrackProductView(name){
  if (!name) return;
  var data = hxAnalyticsLoad();
  data.productViews[name] = (data.productViews[name] || 0) + 1;
  data.events.push({ t: Date.now(), type: 'product', id: name });
  if (data.events.length > HX_ANALYTICS_MAX_EVENTS) data.events = data.events.slice(-HX_ANALYTICS_MAX_EVENTS);
  hxAnalyticsSave(data);
}
// Primera càrrega de la web = una visita a "home"
document.addEventListener('DOMContentLoaded', function(){ hxTrackPageView('home'); });

// ── SEGUIMENT DE COMANDA ──────────────────────────────────
// Consulta la comanda a la base de datos (servidor). Si no hi ha connexió,
// mira l'historial guardat en aquest navegador.
function hxTrackOrder(e) {
  e.preventDefault();
  var email = document.getElementById('trackEmail').value.trim().toLowerCase();
  var num = document.getElementById('trackNum').value.trim().toUpperCase();
  var box = document.getElementById('trackResult');
  if (!box) return false;
  box.innerHTML = '<div style="color:#888;font-size:0.85rem;padding:0.5rem 0;">Cercant…</div>';
  hxApi('/orders/track', { method: 'POST', body: { email: email, num: num } })
    .then(function(d){ hxShowTrackedOrder(box, { invoiceNum: d.order.invoiceNum, date: new Date(d.order.date).toLocaleString('ca-ES'),
      total: d.order.total, items: d.order.items, status: d.order.status }); })
    .catch(function(){ hxShowTrackedOrder(box, hxLocalTrack(email, num)); });
  return false;
}
function hxLocalTrack(email, num) {
  var list = [];
  try { var raw = localStorage.getItem('hx_orders_' + email); list = raw ? JSON.parse(raw) : []; } catch(err) { list = []; }
  return list.find(function(o){ return (o.invoiceNum||'').toUpperCase() === num; }) || null;
}
var HX_ESTATS_WEB = ['Pendent de confirmació', 'Confirmada', 'En preparació', 'Enviada', 'Entregada'];
function hxShowTrackedOrder(box, found) {
  if (!found) {
    box.innerHTML = '<div style="background:#FFF3E0;border-radius:10px;padding:1rem;color:#B8621B;font-size:0.85rem;">' +
      '⚠️ No hem trobat cap comanda amb aquest email i número. Revisa les dades o escriu-nos per WhatsApp i t\'ajudem.' +
      '</div>';
    return false;
  }
  var itemsTxt = found.items.map(function(it){ return escHtml(it.name) + ' ×' + it.qty; }).join(', ');
  var estat = found.status || HX_ESTATS_WEB[0];
  var cancel = estat === 'Cancel·lada';
  var idx = Math.max(0, HX_ESTATS_WEB.indexOf(estat));
  var progres = [0, 0.06, 0.2, 0.6, 1][idx];
  var eta = cancel ? cpT('t929') : idx === 4 ? cpT('t927') : idx === 3 ? cpT('t925') : cpT('t924');
  var passos = HX_ESTATS_WEB.map(function(e, i){
    var fet = !cancel && i <= idx;
    return '<div class="hx-pas' + (fet ? ' fet' : '') + (i === idx && !cancel ? ' ara' : '') + '"><span>' + (fet ? '✓' : (i + 1)) + '</span><small>' + escHtml(e) + '</small></div>';
  }).join('<div class="hx-pas-linia' + '"></div>');
  box.innerHTML = '<div class="hx-seguiment">' +
    '<div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px">' +
      '<strong style="font-size:1rem;color:#0B3D6B">📦 Comanda ' + escHtml(found.invoiceNum) + '</strong>' +
      '<span style="font-size:0.85rem;color:#555">' + escHtml(found.date) + ' · <b>' + Number(found.total).toFixed(2) + ' €</b></span></div>' +
    '<div class="hx-passos">' + passos + '</div>' +
    hxMapaRuta(progres, cpT('t928'), eta, cancel) +
    '<div style="font-size:0.82rem;color:#555;margin-top:0.6rem">Productes: ' + itemsTxt + '</div>' +
  '</div>';
  return false;
}
window.hxTrackOrder = hxTrackOrder;

// ── SELECTOR D'IDIOMA (CA/ES) ─────────────────────────────
// Abast honest: tradueix el menú, l'hero i les capçaleres de secció (el
// que es llegeix primer). Els paràgrafs llargs de contingut queden en
// català — traduir-los tots amb garanties requeriria una revisió a part.
// El sistema d'idiomes (desplegable, traduccions, detecció de l'idioma
// guardat) viu ara al fitxer separat i18n.js, carregat just abans de
// tancar el body de la pàgina.

// ── PWA: registre del Service Worker + botó d'instal·lació ───────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw-web.js').catch(function(err) {
      console.warn('No s\'ha pogut registrar el Service Worker:', err);
    });
  });
}
var _hxInstallPromptEvent = null;
function hxIsStandalone() {
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // Safari iOS
}
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  if (hxIsStandalone()) return; // ja instal·lada i oberta com a app: no cal oferir-ho
  _hxInstallPromptEvent = e;
  var btn = document.getElementById('hxInstallBtn');
  if (btn) btn.style.display = 'inline-flex';
});
function hxInstallApp() {
  if (!_hxInstallPromptEvent) return;
  _hxInstallPromptEvent.prompt();
  _hxInstallPromptEvent.userChoice.then(function() {
    _hxInstallPromptEvent = null;
    var btn = document.getElementById('hxInstallBtn');
    if (btn) btn.style.display = 'none';
  });
}
window.hxInstallApp = hxInstallApp;
window.addEventListener('appinstalled', function() {
  var btn = document.getElementById('hxInstallBtn');
  if (btn) btn.style.display = 'none';
});

function closeWelcome(){var m=document.getElementById('welcomeMsg');if(m)m.style.display='none';}
window.closeWelcome=closeWelcome;

var _am2=document.getElementById('authModal');
if(_am2) _am2.addEventListener('click',function(e){
  if(e.target===this && (Date.now() - _authModalOpenedAt) > 350) closeAuthModal();
});
var _productPopupOpenedAt = 0;
var _pp2=document.getElementById('productPopup');
if(_pp2) _pp2.addEventListener('click',function(e){
  if(e.target===this && (Date.now() - _productPopupOpenedAt) > 350) closeProductPopup();
});

// ═══════════════════════════════════════
// Barra d'administració avançada
// ═══════════════════════════════════════

function initSuperadmin() {
  // Create the superadmin bar
  var bar = document.createElement('div');
  bar.id = 'superadminBar';
  bar.innerHTML =
    '<div>' +
      '<div class="sa-title">👑 ADMINISTRACIÓ AVANÇADA</div>' +
      '<div class="sa-stats" id="saStats">' +
        '<span>Usuaris: <strong id="saStat1">-</strong></span>' +
        '<span>Productes: <strong id="saStat2">-</strong></span>' +
        '<span>Admins: <strong id="saStat3">-</strong></span>' +
      '</div>' +
    '</div>' +
    '<div class="sa-actions">' +
      '<button class="sa-btn" onclick="saResetCart()" type="button">🗑 Buidar carrets</button>' +
      '<button class="sa-btn" onclick="saBroadcast()" type="button">📢 Missatge global</button>' +
      '<button class="sa-btn" onclick="saExportUsers()" type="button">📋 Exportar usuaris</button>' +
      '<button class="sa-btn" onclick="saResetAllUsers()" type="button">👥 Reset usuaris</button>' +
      '<button class="sa-btn danger" onclick="saMaintenanceMode()" type="button">🔧 Mode manteniment</button>' +
    '</div>';

  // Insert at top of admin panel body
  var adminBody = document.querySelector('.admin-body');
  if (adminBody) adminBody.insertBefore(bar, adminBody.firstChild);
  // Hide duplicate stats grid (Usuaris/Productes already shown in superadmin bar)
  var statsGrid = document.getElementById('adminStatsGrid');
  if (statsGrid) statsGrid.style.display = 'none';
  updateSaStats();
}

function updateSaStats() {
  var total = Object.keys(USERS).length + Object.keys(REGISTERED_USERS).length;
  var admins = Object.values(USERS).filter(function(u){ return u.role === 'admin'; }).length;
  var prods  = PRODUCTS.filter(function(p){ return p.active; }).length;
  var s1 = document.getElementById('saStat1');
  var s2 = document.getElementById('saStat2');
  var s3 = document.getElementById('saStat3');
  if(s1) s1.textContent = total;
  if(s2) s2.textContent = prods;
  if(s3) s3.textContent = admins;
}
window.updateSaStats = updateSaStats;

// Buidar tots els carrets (en sessio actual)
function saResetCart() {
  cart = {};
  renderCart();
  showToast('Tots els carrets buidats!', '🗑');
}
window.saResetCart = saResetCart;

// Missatge global — apareix com toast a tothom
function saBroadcast() {
  var msg = prompt('Escriu el missatge global per a tots els usuaris:');
  if (!msg) return;
  showToast(msg, '📢');
  alert('Missatge enviat: "' + msg + '"');
}
window.saBroadcast = saBroadcast;

// Exportar llista d usuaris com text
function saExportUsers() {
  var lines = ['=== USUARIS HIGIENEX ===', ''];
  Object.keys(USERS).forEach(function(e) {
    var u = USERS[e];
    lines.push('[' + u.role.toUpperCase() + '] ' + u.name + ' — ' + e);
  });
  Object.keys(REGISTERED_USERS).forEach(function(e) {
    var u = REGISTERED_USERS[e];
    lines.push('[CLIENT] ' + u.name + ' — ' + e + ' (' + (u.company||'') + ')');
  });
  lines.push('');
  lines.push('Total: ' + (Object.keys(USERS).length + Object.keys(REGISTERED_USERS).length) + ' usuaris');
  alert(lines.join('\n'));
}
window.saExportUsers = saExportUsers;

// Reset tots els usuaris registrats (no els predefinits)
async function saResetAllUsers() {
  if (!confirm('Eliminar TOTS els usuaris registrats? (Els admins predefinits es mantenen)')) return;
  try { await hxApi('/admin/users?all=clients', { method: 'DELETE' }); } catch(e) { alert(e.message); return; }
  hxRefreshAdminPanel();
  showToast('Usuaris registrats eliminats!', '⚠️');
}
window.saResetAllUsers = saResetAllUsers;

// Mode manteniment — bloqueja tota la web
function saMaintenanceMode() {
  if (!confirm('Activar mode manteniment? La web quedara bloquejada per a tothom excepte tu.')) return;
  var overlay = document.getElementById('maintenanceOverlay');
  if (overlay) overlay.classList.add('active');
  showToast('Mode manteniment activat!', '🔧');
}
window.saMaintenanceMode = saMaintenanceMode;

function deactivateMaintenance() {
  var overlay = document.getElementById('maintenanceOverlay');
  if (overlay) overlay.classList.remove('active');
  showToast('Web reactiva. Tot OK!', '✅');
}
window.deactivateMaintenance = deactivateMaintenance;

// Barra d'administració avançada per als administradors (el servidor ja comprova els permisos)
var _origOpenAdmin = openAdminPanel;
window.openAdminPanel = function() {
  _origOpenAdmin();
  if (window.HX_USER && HX_USER.role === 'admin' && !document.getElementById('superadminBar')) {
    setTimeout(initSuperadmin, 100);
  }
};


// ════════════ COOKIES ════════════
function hgCookieChoice() {
  try { return localStorage.getItem('hx_cookie_prefs'); } catch(e) { return null; }
}
function hgSaveCookieChoice(pref, analytics) {
  try { localStorage.setItem('hx_cookie_prefs', JSON.stringify({ necessary: true, preferences: pref, analytics: analytics })); } catch(e) {}
}
function hgInitCookies() {
  // Barra inferior que no bloqueja la web. Només surt si encara no s'ha triat.
  window._hgCookiesPending = false;
  if (hgCookieChoice()) return;
  var m = document.getElementById('hgCookieModal');
  if (m) m.classList.add('active');
}
function hgAcceptCookies() {
  hgSaveCookieChoice(true, true);
  var m = document.getElementById('hgCookieModal'); if (m) m.classList.remove('active');
}
function hgRejectCookies() {
  // Rebutjar les cookies opcionals no impedeix navegar: només queden les necessàries.
  hgSaveCookieChoice(false, false);
  var m = document.getElementById('hgCookieModal'); if (m) m.classList.remove('active');
}
function hgGoCookiesPolicy() {
  // Només tanquem el modal per poder llegir la política — NO acceptem les
  // cookies. Quan l'usuari torni (botó "Tornar" de la pàgina legal),
  // l'avís de cookies ha de tornar a sortir igualment.
  var m = document.getElementById('hgCookieModal'); if (m) m.classList.remove('active');
  legalOpen('page-cookies');
}
window.hgAcceptCookies = hgAcceptCookies;
window.hgRejectCookies = hgRejectCookies;
window.hgGoCookiesPolicy = hgGoCookiesPolicy;
window.hgInitCookies = hgInitCookies;

function hgTogglePersonalitzar(){
  var box = document.getElementById('hgCookiePersonalitzar');
  if (box) box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
}
window.hgTogglePersonalitzar = hgTogglePersonalitzar;
function hgSavePersonalitzat(){
  var pref = document.getElementById('hgCookiePref');
  var analytics = document.getElementById('hgCookieAnalytics');
  try {
    localStorage.setItem('hx_cookie_prefs', JSON.stringify({
      necessary: true,
      preferences: pref ? pref.checked : true,
      analytics: analytics ? analytics.checked : true
    }));
  } catch(e) {}
  var m = document.getElementById('hgCookieModal'); if (m) m.classList.remove('active');
  showToast('Preferències de cookies guardades.', '🍪');
}
window.hgSavePersonalitzat = hgSavePersonalitzat;

// ════════════ PÀGINES LEGALS ════════════
function legalOpen(id) {
  // Tancar el menú si està obert
  var dd = document.getElementById('navDropdown'); if (dd) dd.classList.remove('open');
  var icon = document.getElementById('menuIcon'); if (icon) icon.textContent = '☰';
  // Amagar altres pàgines legals i mostrar la nova
  var pages = document.querySelectorAll('.legal-page');
  for (var i=0; i<pages.length; i++) pages[i].classList.remove('active');
  var p = document.getElementById(id);
  if (p) {
    p.classList.add('active');
    p.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
}
function legalClose() {
  var pages = document.querySelectorAll('.legal-page');
  for (var i=0; i<pages.length; i++) pages[i].classList.remove('active');
  document.body.style.overflow = '';
  // Si l'usuari ha entrat a llegir la política de cookies sense haver
  // acceptat/rebutjat encara de veritat, en tornar a la web li hem de
  // tornar a mostrar l'avís perquè no pugui saltar-se'l.
  var cookieModal = document.getElementById('hgCookieModal');
  if (cookieModal && !hgCookieChoice()) cookieModal.classList.add('active');
}
window.legalOpen = legalOpen;
window.legalClose = legalClose;

// (L'avís de cookies ja es mostra directament des d'enterWeb(), més amunt,
// amb protecció contra crides duplicades — no cal cap "hook" addicional aquí.)
