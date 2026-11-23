/* HIGIENEX — codi de la web (abans dins d'index.html) */
// ═══════════════════════════════════════════════
// HIGIENEX — Script principal (sense IIFE)
// ═══════════════════════════════════════════════

// ── NOTIFICACIONS PER EMAIL ─────────────
// Els emails (avisos, comandes, pressupostos i candidatures) els envia el
// servidor (/api/notify). Les claus d'EmailJS ja no són a la web.

// ═══════════════════════════════════════════════════════════
// PORTAL DE CLIENT — dades fictícies i funcions auxiliars
// ═══════════════════════════════════════════════════════════
var CP_EUR = function(n){ return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(Number(n)||0); };
var CP_NUM = function(n){ return new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0); };
var CP_FD  = function(d){ if(!d) return '—'; var p=d.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; };
var CP_TODAY = '2026-07-27';

function svgEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function svgHBarChart(items, opts){
  opts = opts || {};
  var w = opts.width || 480, rowH = opts.rowH || 34;
  var padL = 130, padR = 105, padT = 8, padB = 8;
  var h = padT + padB + rowH*items.length;
  var maxV = Math.max.apply(null, items.map(function(it){ return Math.abs(it.value); }).concat([1]));
  var plotW = w - padL - padR;
  var rows='';
  items.forEach(function(it,i){
    var y = padT + i*rowH;
    var barW = Math.abs(it.value)/maxV*plotW;
    rows += '<text x="'+(padL-10)+'" y="'+(y+rowH/2+4)+'" font-size="11" text-anchor="end" fill="#3C5063">'+svgEsc(it.label)+'</text>';
    rows += '<rect x="'+padL+'" y="'+(y+7)+'" width="'+Math.max(barW,2)+'" height="'+(rowH-14)+'" rx="5" fill="'+it.color+'"><title>'+svgEsc(it.label)+': '+svgEsc(it.valueLabel||it.value)+'</title></rect>';
    rows += '<text x="'+(padL+barW+8)+'" y="'+(y+rowH/2+4)+'" font-size="9.5" fill="#0F1D2B" font-family="IBM Plex Mono, monospace" font-weight="600">'+svgEsc(it.valueLabel!==undefined?it.valueLabel:it.value)+'</text>';
  });
  return '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block">'+rows+'</svg>';
}

// Los datos del portal de clientes (empresa, facturas, pedidos y accesos) están en
// el servidor: se descargan solo después de iniciar sesión en el portal.
var CP_DB = { cliente: { team: [] }, productos: {}, facturas: [], comandes: [] };
function hxPortalToken(){ try { return localStorage.getItem('hx_cp_token') || ''; } catch(e) { return ''; } }
function hxSetPortalToken(t){ try { if (t) localStorage.setItem('hx_cp_token', t); else localStorage.removeItem('hx_cp_token'); } catch(e) {} }
async function hxPortal(path, opts){
  opts = opts || {};
  var headers = { 'Content-Type': 'application/json' };
  var tok = hxPortalToken(); if (tok) headers['X-Portal-Token'] = tok;
  var r = await fetch(HX_API_BASE + '/portal' + path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  var d = {}; try { d = await r.json(); } catch(e) {}
  if (!r.ok) { var err = new Error(d.error || ('Error ' + r.status)); err.status = r.status; throw err; }
  return d;
}
function cpAplicarPortal(p){
  if (!p || !p.data) return;
  if (p.token) hxSetPortalToken(p.token);
  CP_DB.cliente = p.data.cliente || { team: [] };
  CP_DB.productos = p.data.productos || {};
  CP_DB.facturas = p.data.facturas || [];
  CP_DB.comandes = p.data.comandes || [];
  if (p.member) CP_CURRENT_USER = (CP_DB.cliente.team || []).find(function(m){ return m.id === p.member.id; }) || p.member;
  CP_LOGGED_IN = true;
  try { localStorage.setItem('hx_cp_logged_in', '1'); if (CP_CURRENT_USER) localStorage.setItem('hx_cp_current_user', CP_CURRENT_USER.id); } catch(e) {}
  if (typeof cpTouchSession === 'function') cpTouchSession();
  if (typeof cpUpdateNavState === 'function') cpUpdateNavState();
}


// ═══════════════════════════════════════════════════════════
// PORTAL DE CLIENT — lògica del panell
// ═══════════════════════════════════════════════════════════
var CP_LOGGED_IN = false;

function cpNavAction(){
  if (CP_LOGGED_IN) { cpOpen(); }
  else { cpOpenLoginModal(); }
}
window.cpNavAction = cpNavAction;

function cpUpdateNavState(){
  var btn = document.getElementById('navClientBtn');
  var lbl = document.getElementById('navClientDditemLabel');
  if (CP_LOGGED_IN) {
    if (btn) btn.title = cpT('t727');
    if (btn) btn.textContent = '📊';
    if (lbl) lbl.textContent = '📊 ' + cpT('t727');
  } else {
    if (btn) btn.title = cpT('t726');
    if (btn) btn.textContent = '👤';
    if (lbl) lbl.textContent = '👤 ' + cpT('t726');
  }
}
window.cpUpdateNavState = cpUpdateNavState;

var CP_SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hores d'inactivitat
function cpTouchSession(){
  try { localStorage.setItem('hx_session_expiry', String(Date.now() + CP_SESSION_DURATION_MS)); } catch(e) {}
}
window.cpTouchSession = cpTouchSession;
function cpSessionExpired(){
  try {
    var exp = localStorage.getItem('hx_session_expiry');
    if (!exp) return false;
    return Date.now() > parseInt(exp, 10);
  } catch(e) { return false; }
}

function cpRestoreSession(){
  try {
    if (cpSessionExpired()) {
      localStorage.removeItem('hx_user_session');
      localStorage.removeItem('hx_cp_logged_in');
      localStorage.removeItem('hx_session_expiry');
      return;
    }
    var raw = localStorage.getItem('hx_user_session');
    if (raw) {
      var s = JSON.parse(raw);
      if (s && s.name) {
        setLoggedInUser(s.name, s.avatar||'', s.role||'client', s.email||'', true);
        if (hxApiToken()) {
          hxApi('/me').then(function(d){ window.HX_PROFILE = d.user; if (typeof renderOrderHistory === 'function') renderOrderHistory(); })
            .catch(function(e){ if (e.status === 401) { logout(); showToast('La sessió ha caducat. Torna a iniciar sessió.', '🔒'); } });
        } else if (s.role === 'admin') { logout(); }
      }
    }
    if (localStorage.getItem('hx_cp_logged_in') === '1' && hxPortalToken()) {
      CP_LOGGED_IN = true; cpUpdateNavState();
      hxPortal('/me').then(cpAplicarPortal).catch(function(e){
        if (e.status === 401) { hxSetPortalToken(''); CP_LOGGED_IN = false; CP_CURRENT_USER = null;
          try { localStorage.removeItem('hx_cp_logged_in'); localStorage.removeItem('hx_cp_current_user'); } catch(err) {}
          cpUpdateNavState(); }
      });
    } else if (localStorage.getItem('hx_cp_logged_in') === '1') {
      try { localStorage.removeItem('hx_cp_logged_in'); localStorage.removeItem('hx_cp_current_user'); } catch(e) {}
    }
    if (raw || CP_LOGGED_IN) cpTouchSession();
  } catch(e) {}
}
window.addEventListener('DOMContentLoaded', cpRestoreSession);

function cpLang(){
  try { return localStorage.getItem('hx_lang') || 'ca'; } catch(e) { return 'ca'; }
}
window.cpLang = cpLang;
function cpT(key){
  var entry = (typeof HX_I18N !== 'undefined') ? HX_I18N[key] : null;
  if (!entry) return key;
  var lang = cpLang();
  return entry[lang] || entry.ca || key;
}
window.cpT = cpT;

function cpOpenLoginModal(){
  var m=document.getElementById('hxClientLoginModal'); if(!m) return;
  document.getElementById('cpLoginErr').style.display='none';
  document.getElementById('cpLoginUser').value='';
  document.getElementById('cpLoginPass').value='';
  m.style.display='flex';
  document.body.style.overflow='hidden';
}
window.cpOpenLoginModal=cpOpenLoginModal;
function cpCloseLoginModal(){
  var m=document.getElementById('hxClientLoginModal'); if(m) m.style.display='none';
  document.body.style.overflow='';
}
window.cpCloseLoginModal=cpCloseLoginModal;

function cpForgotPassword(){
  var userInput = document.getElementById('cpLoginUser');
  var val = (userInput ? userInput.value : '').trim();
  var subject = encodeURIComponent('Recuperació d\'accés al Portal de Client - HIGIENEX');
  var body = encodeURIComponent(
    'Hola,\n\nHe oblidat el meu usuari o contrasenya d\'accés al Portal de Client d\'HIGIENEX.' +
    (val ? ('\nEl meu usuari és: ' + val) : '') +
    '\n\nSi us plau, ajudeu-me a recuperar-lo o restablir-lo.\n\nGràcies.'
  );
  window.location.href = 'mailto:contacto@higienexvalencia.es?subject=' + subject + '&body=' + body;
  showToast('Obrint el teu correu per demanar la recuperació…', '✉️');
}
window.cpForgotPassword = cpForgotPassword;

var CP_CURRENT_USER = null;
function cpNomRol(rol) {
  return rol === 'admin' ? 'Administrador' : rol === 'comprador' ? 'Comprador' : 'Nom\u00e9s lectura';
}
async function cpTryLogin(){
  var user=(document.getElementById('cpLoginUser').value||'').trim().toLowerCase();
  var pass=document.getElementById('cpLoginPass').value||'';
  var res;
  try { res = await hxPortal('/login', { method: 'POST', body: { user: user, password: pass } }); }
  catch(e) { document.getElementById('cpLoginErr').style.display='block'; return; }
  cpAplicarPortal(res);
  var membre = CP_CURRENT_USER;
  if (!window.HX_USER) setLoggedInUser(membre.nom, '', 'client', membre.email);
  cpCloseLoginModal();
  var dd=document.getElementById('navDropdown'); if(dd) dd.classList.remove('open');
  showToast('Sessi\u00f3 iniciada com a ' + membre.nom + ' (' + cpNomRol(membre.rol) + ').', '\u2705');
}
window.cpTryLogin=cpTryLogin;

var CP_TAB='inici', CP_FILTER='totes', CP_SEARCH='', CP_PERIOD='6m';
var CP_NAV=[
  ['inici','🏠','t717'],
  ['comandes','📦','t718'],
  ['factures','🧾','t719'],
  ['empresa','👤','t720'],
  ['equip','👥','Equip'],
  ['impacte','🌱','t958'],
  ['referits','🎁','t966'],
  ['suport','📞','t721'],
  ['botiga','🛍️','t722'],
  ['fosc','🌙','t723'],
  ['sortir','↩','t725']
];

var CP_PRODUCT_MAP = {
  'ECO Concentrat Pro': { nom:'ECO Concentrat Pro', preu:12.50 },
  'ECO Concentrat Pro 5 L': { nom:'ECO Concentrat Pro', preu:12.50 },
  'Desinfectant HOSP-V': { nom:'Desinfectant HOSP-V', preu:18.00 },
  'Desinfectant HOSP-V 5 L': { nom:'Desinfectant HOSP-V', preu:18.00 },
  'Detergent ALIM-PRO': { nom:'Detergent ALIM-PRO', preu:9.80 },
  'Det ALIM-PRO 10 L': { nom:'Detergent ALIM-PRO', preu:9.80 },
  'Net HOSTAL Premium': { nom:'Net HOSTAL Premium', preu:11.20 },
  'Net HOSTAL 5 L': { nom:'Net HOSTAL Premium', preu:11.20 },
  'Gamma Superfícies QR': { nom:'Gamma Superfícies QR', preu:14.00 },
  'WorkSafe Antimicrobial': { nom:'WorkSafe Antimicrobial', preu:22.00 },
  'WorkSafe Antimicrobial 1 L': { nom:'WorkSafe Antimicrobial', preu:22.00 }
};

function cpAddDirectToCart(name, price, qty){
  if (cart[name]) { cart[name].qty += qty; }
  else { cart[name] = { qty: qty, price: price }; }
  recalcCartLine(name);
}

function cpTornarAComprar(lineas){
  if (CP_CURRENT_USER && CP_CURRENT_USER.rol === 'lector') {
    showToast('El teu accés és només de lectura: no pots fer comandes. Demana-ho a un administrador de l\'equip.', '🔒');
    return;
  }
  var afegits = 0, omesos = [];
  (lineas || []).forEach(function(l){
    var nomOriginal = l.nom || (CP_DB.productos[l.art] ? CP_DB.productos[l.art].nom : l.art);
    var map = CP_PRODUCT_MAP[nomOriginal];
    if (map) {
      cpAddDirectToCart(map.nom, map.preu, l.cant);
      afegits++;
    } else {
      omesos.push(nomOriginal);
    }
  });
  if (afegits > 0) {
    renderCart();
    if (typeof updateCartBadge === 'function') updateCartBadge();
  }
  if (afegits > 0 && omesos.length === 0) {
    showToast(cpT('t886') + ' (' + afegits + ').', '🔁');
  } else if (afegits > 0 && omesos.length > 0) {
    showToast(afegits + ' ' + cpT('t887') + '. ' + omesos.length + ' ' + cpT('t888') + ': ' + omesos.join(', '), '⚠️');
  } else {
    cpOpenModal('🔁', '<p style="font-size:13.5px;color:var(--charcoal);line-height:1.6">'+cpT('t890')+'</p>',
      '<button class="cp-btn ghost" onclick="cpCloseModal()" type="button">'+cpT('t796')+'</button>'+
      '<button class="cp-btn" onclick="cpCloseModal();cpAnarABotiga()" type="button">'+cpT('t891')+'</button>');
  }
}
window.cpTornarAComprar = cpTornarAComprar;

function cpRegistrarComanda(inv, items){
  if (!CP_LOGGED_IN) return;
  var now = new Date();
  var fecha = now.toISOString().slice(0,10);
  var venc  = new Date(now.getTime() + 30*24*60*60*1000).toISOString().slice(0,10);
  var lineas = items.map(function(it){ return { nom: it.name, cant: it.qty, precio: it.qty ? (it.total/it.qty) : 0 }; });
  var base = items.reduce(function(s,it){ return s + it.total; }, 0);
  var cuota = Math.round((inv.total - base) * 100) / 100;
  CP_DB.facturas.unshift({
    num: inv.invoiceNum, fecha: fecha, lineas: lineas,
    base: Math.round(base*100)/100, cuota: cuota, total: inv.total,
    estado: 'Pendiente', venc: venc
  });
  var lineasComanda = items.map(function(it){ return { nom: it.name, cant: it.qty }; });
  CP_DB.comandes.unshift({
    num: 'C' + inv.invoiceNum.replace('FE-',''), fecha: fecha, lineas: lineasComanda,
    total: inv.total, estat: 'Processant'
  });
  cpAfegirNotificacio('🆕', 't756', {num: inv.invoiceNum});
}
window.cpRegistrarComanda = cpRegistrarComanda;

function cpOpen(){
  if (!CP_LOGGED_IN) { cpOpenLoginModal(); return; }
  CP_TAB='inici'; CP_FILTER='totes'; CP_SEARCH=''; CP_PERIOD='6m';
  document.getElementById('hxClientApp').style.display='block';
  var nav=document.getElementById('mainNav'); if(nav) nav.style.display='none';
  document.body.style.overflow='hidden';
  try { if (localStorage.getItem('hx_cp_dark')==='1') document.getElementById('hxClientApp').classList.add('cp-dark'); } catch(e) {}
  cpRenderNav(); cpRenderUser(); cpGo('inici');
  if (CP_SESSION_WATCH) clearInterval(CP_SESSION_WATCH);
  CP_SESSION_WATCH = setInterval(function(){
    if (cpSessionExpired()) {
      clearInterval(CP_SESSION_WATCH);
      cpLogout();
      showToast(cpT('t892'), '⏰');
    }
  }, 60000);
  setTimeout(cpMaybeShowTour, 400);
}
window.cpOpen=cpOpen;
var CP_SESSION_WATCH = null;

var CP_TOUR_STEP = 0;
function cpMaybeShowTour(){
  try { if (localStorage.getItem('hx_cp_tour_seen') === '1') return; } catch(e) {}
  CP_TOUR_STEP = 0;
  cpShowTourStep();
}
function cpShowTourStep(){
  var steps = [
    {t:'t899', d:'t900'},
    {t:'t901', d:'t902'},
    {t:'t903', d:'t904'}
  ];
  var s = steps[CP_TOUR_STEP];
  var isLast = CP_TOUR_STEP === steps.length - 1;
  var dots = steps.map(function(_,i){ return '<span style="width:6px;height:6px;border-radius:50%;background:'+(i===CP_TOUR_STEP?'var(--green-deep)':'#D9E5F0')+';display:inline-block;margin:0 3px"></span>'; }).join('');
  cpOpenModal('👋 ' + cpT(s.t),
    '<p style="font-size:13.5px;color:var(--charcoal);line-height:1.6;margin-bottom:14px">'+cpT(s.d)+'</p>'+
    '<div style="text-align:center">'+dots+'</div>',
    '<button class="cp-btn ghost" onclick="cpSkipTour()" type="button">'+cpT('t907')+'</button>'+
    '<button class="cp-btn" onclick="cpTourNext()" type="button">'+(isLast?cpT('t905'):cpT('t906'))+'</button>');
}
function cpTourNext(){
  CP_TOUR_STEP++;
  var steps = 3;
  if (CP_TOUR_STEP >= steps) { cpSkipTour(); return; }
  cpShowTourStep();
}
window.cpTourNext = cpTourNext;
function cpSkipTour(){
  try { localStorage.setItem('hx_cp_tour_seen', '1'); } catch(e) {}
  cpCloseModal();
}
window.cpSkipTour = cpSkipTour;

function cpToggleDarkMode(){
  var app=document.getElementById('hxClientApp');
  var isDark = app.classList.toggle('cp-dark');
  try { localStorage.setItem('hx_cp_dark', isDark ? '1' : '0'); } catch(e) {}
  cpRenderNav();
}
window.cpToggleDarkMode = cpToggleDarkMode;

function cpGoFaq(){ cpLogout(); navTo("faq"); }
window.cpGoFaq=cpGoFaq;
function cpAnarABotiga(){
  document.getElementById('hxClientApp').style.display='none';
  var nav=document.getElementById('mainNav'); if(nav) nav.style.display='';
  document.body.style.overflow='';
  navTo('productes');
  showToast('Segueixes amb la sessió de client oberta.', '🛍️');
}
window.cpAnarABotiga = cpAnarABotiga;

function cpLogout(){
  if (hxPortalToken()) { hxPortal('/logout', { method: 'POST' }).catch(function(){}); }
  hxSetPortalToken('');
  CP_DB.cliente = { team: [] }; CP_DB.facturas = []; CP_DB.comandes = []; CP_DB.productos = {};
  CP_LOGGED_IN = false;
  CP_CURRENT_USER = null;
  window.HX_USER = null;
  try { localStorage.removeItem('hx_user_session'); localStorage.removeItem('hx_cp_logged_in'); localStorage.removeItem('hx_cp_current_user'); localStorage.removeItem('hx_session_expiry'); } catch(e) {}
  if (CP_SESSION_WATCH) { clearInterval(CP_SESSION_WATCH); CP_SESSION_WATCH = null; }
  cpUpdateNavState();
  var ab=document.getElementById('authBtns'); if(ab) ab.style.display='flex';
  var uEl=document.getElementById('userName'); if(uEl) uEl.textContent='Client';
  var ub=document.getElementById('userNavBtn'); if(ub) ub.remove();
  document.getElementById('hxClientApp').style.display='none';
  var nav=document.getElementById('mainNav'); if(nav) nav.style.display='';
  document.body.style.overflow='';
}
window.cpLogout=cpLogout;

function cpRenderNav(){
  var isDark = document.getElementById('hxClientApp').classList.contains('cp-dark');
  document.getElementById('cpNav').innerHTML = CP_NAV.map(function(n){
    if (n[0]==='fosc') {
      return '<button type="button" onclick="cpToggleDarkMode()"><span class="ic">'+(isDark?'☀️':'🌙')+'</span><span>'+(isDark?cpT('t724'):cpT('t723'))+'</span></button>';
    }
    return '<button type="button" class="'+(CP_TAB===n[0]?'active':'')+'" onclick="cpGo(\''+n[0]+'\')"><span class="ic">'+n[1]+'</span><span>'+cpT(n[2])+'</span></button>';
  }).join('');
}
function cpRenderUser(){
  var u = CP_CURRENT_USER || CP_DB.cliente;
  var inicials=u.nom.split(' ').map(function(w){return w[0];}).slice(0,2).join('').toUpperCase();
  document.getElementById('cpUserBox').innerHTML =
    '<div class="av">'+inicials+'</div><div class="nm"><b>'+escHtml(u.nom)+'</b><span>'+escHtml((u.email||u.mail)||'')+'</span></div>';
}

function cpGo(tab){
  if(tab==='botiga'){ cpAnarABotiga(); return; }
  if(tab==='sortir'){ cpLogout(); return; }
  cpTouchSession();
  CP_TAB=tab; cpRenderNav();
  var main=document.getElementById('cpMain');
  if(tab==='inici') main.innerHTML=cpViewInici();
  else if(tab==='comandes') main.innerHTML=cpViewComandes();
  else if(tab==='factures') main.innerHTML=cpViewFactures();
  else if(tab==='empresa') main.innerHTML=cpViewEmpresa();
  else if(tab==='equip') main.innerHTML=cpViewEquip();
  else if(tab==='impacte') main.innerHTML=cpViewImpacte();
  else if(tab==='referits') main.innerHTML=cpViewReferits();
  else if(tab==='suport') main.innerHTML=cpViewSuport();
  main.scrollTop=0;
  if(tab==='inici') cpBindPeriodButtons();
}
window.cpGo=cpGo;

function cpEstatFactura(f){
  var pagada = f.estado==='Pagada'||f.estado==='Cobrada';
  if(pagada) return 'pagada';
  if(f.venc && f.venc<CP_TODAY) return 'vencida';
  return 'pendent';
}
function cpEstatColor(e){ return e==='pagada'?'#0B7256':e==='vencida'?'#8C281E':'#8A5900'; }
function cpEstatLabel(e){ return e==='pagada'?cpT('t773'):e==='vencida'?cpT('t774'):cpT('t775'); }

function cpViewInici(){
  var c=CP_DB.cliente, fac=CP_DB.facturas.slice().sort(function(a,b){return b.fecha.localeCompare(a.fecha);});
  var saldo=fac.filter(function(f){return f.estado==='Pendiente';}).reduce(function(s,f){return s+f.total;},0);
  var totalAny=fac.filter(function(f){return f.fecha.slice(0,4)===CP_TODAY.slice(0,4);}).reduce(function(s,f){return s+f.total;},0);
  var vencudes=fac.filter(function(f){return cpEstatFactura(f)==='vencida';}).length;
  var pendents=fac.filter(function(f){var e=cpEstatFactura(f);return e==='pendent'||e==='vencida';}).length;
  var properaPendent=fac.filter(function(f){return cpEstatFactura(f)!=='pagada';}).sort(function(a,b){return a.venc.localeCompare(b.venc);})[0];

  var vencudesTxt = (vencudes===1 ? cpT('t728') : cpT('t729')).replace('{n}', vencudes);
  var pendentsTxt = (pendents===1 ? cpT('t730') : cpT('t731')).replace('{n}', pendents);

  var banner;
  if(vencudes>0){
    banner='<div class="cp-banner" style="background:rgba(140,40,30,.1)"><div class="ic" style="background:#8C281E;color:#fff">⚠️</div><div><h3 style="color:#8C281E">'+vencudesTxt+'</h3><p>'+cpT('t732')+'</p></div></div>';
  } else if(pendents>0){
    banner='<div class="cp-banner" style="background:rgba(138,89,0,.1)"><div class="ic" style="background:#8A5900;color:#fff">🟠</div><div><h3 style="color:#8A5900">'+pendentsTxt+'</h3><p>'+cpT('t733')+'</p></div></div>';
  } else {
    banner='<div class="cp-banner" style="background:rgba(11,114,86,.1)"><div class="ic" style="background:#0B7256;color:#fff">✓</div><div><h3 style="color:#0B7256">'+cpT('t734')+'</h3><p>'+cpT('t735')+'</p></div></div>';
  }
  var statusPill = vencudes>0
    ? '<span class="cp-status-pill" style="background:rgba(140,40,30,.12);color:#8C281E">🔴 '+vencudesTxt+'</span>'
    : pendents>0
    ? '<span class="cp-status-pill" style="background:rgba(138,89,0,.12);color:#8A5900">🟠 '+pendentsTxt+'</span>'
    : '<span class="cp-status-pill" style="background:rgba(11,114,86,.12);color:#0B7256">🟢 '+cpT('t734')+'</span>';

  var kpis =
    '<div class="cp-kpis">'+
      '<div class="cp-kpi"><div class="cp-kpi-ic" style="background:rgba(138,89,0,.12);color:#8A5900">💰</div>'+
        '<div class="cp-kpi-val">'+CP_EUR(saldo)+'</div><div class="cp-kpi-lbl">'+cpT('t736')+'</div>'+
        '<div class="cp-kpi-sub" style="color:'+(saldo>0?'#8A5900':'#0B7256')+'">'+(saldo>0?cpT('t737'):'🟢 '+cpT('t738'))+'</div></div>'+
      '<div class="cp-kpi"><div class="cp-kpi-ic" style="background:rgba(21,101,168,.12);color:var(--green-deep)">📈</div>'+
        '<div class="cp-kpi-val">'+CP_EUR(totalAny)+'</div><div class="cp-kpi-lbl">'+cpT('t739')+'</div>'+
        '<div class="cp-kpi-sub" style="color:var(--cp-muted,rgba(26,26,26,.55))">'+cpT('t740')+'</div></div>'+
      '<div class="cp-kpi"><div class="cp-kpi-ic" style="background:rgba(21,101,168,.12);color:var(--green-deep)">🧾</div>'+
        '<div class="cp-kpi-val">'+fac.length+'</div><div class="cp-kpi-lbl">'+cpT('t719')+'</div>'+
        '<div class="cp-kpi-sub" style="color:var(--cp-muted,rgba(26,26,26,.55))">'+cpT('t741')+'</div></div>'+
      '<div class="cp-kpi"><div class="cp-kpi-ic" style="background:rgba(138,89,0,.12);color:#8A5900">📅</div>'+
        '<div class="cp-kpi-val" style="font-size:15px">'+(properaPendent?CP_FD(properaPendent.venc):cpT('t743'))+'</div><div class="cp-kpi-lbl">'+cpT('t742')+'</div>'+
        '<div class="cp-kpi-sub" style="color:var(--cp-muted,rgba(26,26,26,.55))">'+(properaPendent?properaPendent.num:cpT('t734'))+'</div></div>'+
    '</div>';

  var chart=cpChartHTML(fac);
  var notifs=cpNotifsHTML(fac);
  var reorderCard=cpReorderCardHTML();

  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>'+cpT('t744')+', '+escHtml(c.nom.split(' ')[0])+' 👋</h2>'+
      '<p>'+cpT('t745')+'</p>'+statusPill+
      '<div class="cp-updated">'+cpT('t746')+'</div></div></div>'+
    banner+kpis+cpEstocBaixHTML()+reorderCard+
    '<div class="cp-card" style="margin-bottom:20px">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'+
        '<div class="cp-section-title" style="margin:0">'+cpT('t747')+'</div>'+
        '<div class="cp-period-row" id="cpPeriodRow">'+
          ['7d','30d','6m','any'].map(function(p){return '<button type="button" class="cp-period-btn '+(CP_PERIOD===p?'active':'')+'" data-p="'+p+'">'+p.toUpperCase()+'</button>';}).join('')+
        '</div>'+
      '</div>'+chart+
    '</div>'+
    '<div class="cp-card"><div class="cp-section-title">'+cpT('t748')+'</div>'+notifs+'</div>';
}

// Avís d'estoc baix per producte: a partir de les comandes del client es calcula
// el seu ritme de consum (unitats/dia) i quant li deu quedar des de l'última
// compra. Si s'acabarà en 10 dies o menys, s'avisa amb un botó per demanar-ne.
var CP_NO_CONSUMIBLES = /dispensador|accessori|suport/i;
function cpEstocBaix(){
  var dies = function(a, b){ return (new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000; };
  var compres = {};
  (CP_DB.comandes || []).forEach(function(c){
    (c.lineas || []).forEach(function(l){
      var map = CP_PRODUCT_MAP[l.nom];
      if (!map || CP_NO_CONSUMIBLES.test(l.nom)) return;
      (compres[map.nom] = compres[map.nom] || []).push({ f: c.fecha, q: +l.cant || 0 });
    });
  });
  var avisos = [];
  Object.keys(compres).forEach(function(nom){
    var llista = compres[nom].sort(function(a, b){ return a.f.localeCompare(b.f); });
    if (llista.length < 3) return;
    var periode = dies(llista[0].f, llista[llista.length - 1].f);
    if (periode < 14) return;
    var ritme = llista.slice(0, -1).reduce(function(s, x){ return s + x.q; }, 0) / periode;   // unitats/dia
    if (!(ritme > 0)) return;
    var ultima = llista[llista.length - 1];
    var queden = (ultima.q - ritme * dies(ultima.f, CP_TODAY)) / ritme;
    if (queden <= 10 && queden > -45) avisos.push({ nom: nom, dies: Math.round(queden), mes: Math.max(1, Math.round(ritme * 30)), ultima: ultima.f });
  });
  return avisos.sort(function(a, b){ return a.dies - b.dies; }).slice(0, 3);
}
function cpEstocBaixHTML(){
  var avisos = cpEstocBaix();
  if (!avisos.length) return '';
  var files = avisos.map(function(a){
    var titol = a.dies <= 0 ? cpT('t932').replace('{p}', a.nom) : cpT('t931').replace('{d}', a.dies).replace('{p}', a.nom);
    var color = a.dies <= 0 ? '#8C281E' : a.dies <= 5 ? '#8A5900' : '#0B3D6B';
    return '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 0;border-top:1px solid rgba(0,0,0,.06)">' +
      '<div style="min-width:220px;flex:1"><div style="font-weight:700;font-size:14px;color:' + color + '">' + (a.dies <= 0 ? '🔴 ' : '🟠 ') + escHtml(titol) + '</div>' +
      '<div style="font-size:12px;color:var(--cp-muted,rgba(26,26,26,.55));margin-top:2px">' + escHtml(cpT('t933').replace('{u}', a.mes).replace('{f}', CP_FD(a.ultima))) + '</div></div>' +
      '<button type="button" class="cp-btn" style="padding:8px 14px;font-size:12.5px" data-nom="' + escHtml(a.nom) + '" data-n="' + a.mes + '" onclick="cpDemanarEstoc(this)">🛒 ' + escHtml(cpT('t934').replace('{n}', a.mes)) + '</button>' +
    '</div>';
  }).join('');
  return '<div class="cp-card" style="margin-bottom:20px;border-left:4px solid #F2A900">' +
    '<div class="cp-section-title" style="margin:0 0 4px">⏳ ' + escHtml(cpT('t930')) + '</div>' + files + '</div>';
}
function cpDemanarEstoc(boto){
  cpTornarAComprar([{ nom: boto.getAttribute('data-nom'), cant: +boto.getAttribute('data-n') || 1 }]);
}
window.cpDemanarEstoc = cpDemanarEstoc;

function cpReorderCardHTML(){
  var com=CP_DB.comandes.slice().sort(function(a,b){return b.fecha.localeCompare(a.fecha);});
  if(!com.length) return '';
  var last=com[0];
  var linies=last.lineas.map(function(l){ return l.nom+' ×'+l.cant; }).join(', ');
  var smart='';
  if(com.length>=3){
    var dates=com.map(function(c){return c.fecha;}).sort();
    var gaps=[];
    for(var i=1;i<dates.length;i++){
      gaps.push((new Date(dates[i]+'T00:00:00')-new Date(dates[i-1]+'T00:00:00'))/86400000);
    }
    var avg=Math.round(gaps.reduce(function(s,g){return s+g;},0)/gaps.length);
    var desdeLast=Math.round((new Date(CP_TODAY+'T00:00:00')-new Date(last.fecha+'T00:00:00'))/86400000);
    if(avg>=5 && desdeLast>=avg*0.8){
      smart='<p style="font-size:12px;color:#8A5900;font-weight:600;margin-top:4px">'+cpT('t896')+' '+avg+' '+cpT('t897')+' '+desdeLast+' '+cpT('t898')+'</p>';
    }
  }
  return '<div class="cp-card" style="margin-bottom:20px;background:linear-gradient(135deg,var(--green-deep),var(--green-mid));color:#fff;border:none">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">'+
      '<div><h3 style="margin:0 0 4px;font-size:15px">🔁 '+cpT('t893')+'</h3>'+
      '<p style="margin:0;font-size:12.5px;opacity:.9">'+cpT('t894')+'</p>'+
      '<p style="margin:6px 0 0;font-size:11.5px;opacity:.75">'+escHtml(last.num)+' · '+CP_FD(last.fecha)+' · '+escHtml(linies)+'</p>'+
      smart+
      '</div>'+
      '<button type="button" onclick="cpTornarAComprarComanda(\''+last.num+'\')" style="background:var(--accent);color:#1A1A1A;border:none;padding:10px 18px;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap">'+cpT('t895')+'</button>'+
    '</div>'+
  '</div>';
}

var CP_MESOS = {
  ca: ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'],
  es: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  fr: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
  de: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']
};
function cpChartHTML(fac){
  if(!fac.length) return '<div class="cp-empty"><div class="ic">📊</div><b>'+cpT('t749')+'</b><span>'+cpT('t750')+'</span></div>';
  var now=new Date(CP_TODAY+'T00:00:00');
  var cutoff=new Date(now);
  if(CP_PERIOD==='7d') cutoff.setDate(cutoff.getDate()-7);
  else if(CP_PERIOD==='30d') cutoff.setDate(cutoff.getDate()-30);
  else if(CP_PERIOD==='6m') cutoff.setMonth(cutoff.getMonth()-6);
  else cutoff=new Date(now.getFullYear(),0,1);
  var cutoffStr=cutoff.toISOString().slice(0,10);
  var enRang=fac.filter(function(f){return f.fecha>=cutoffStr;});
  if(!enRang.length) return '<div class="cp-empty"><div class="ic">📊</div><b>'+cpT('t751')+'</b><span>'+cpT('t752')+'</span></div>';
  var grupPerDia = CP_PERIOD==='7d'||CP_PERIOD==='30d';
  var buckets={};
  enRang.forEach(function(f){ var k = grupPerDia ? f.fecha : f.fecha.slice(0,7); buckets[k]=(buckets[k]||0)+f.total; });
  var claus=Object.keys(buckets).sort();
  var nomsCurts=CP_MESOS[cpLang()] || CP_MESOS.ca;
  var items=claus.map(function(k){
    return { label: grupPerDia ? CP_FD(k) : (nomsCurts[parseInt(k.slice(5,7),10)-1]+' '+k.slice(2,4)), value: buckets[k], valueLabel: CP_EUR(buckets[k]), color:'#0B3D6B' };
  });
  return '<div style="margin-top:10px">'+svgHBarChart(items,{width:600,rowH:28})+'</div>';
}
function cpBindPeriodButtons(){
  var row=document.getElementById('cpPeriodRow'); if(!row) return;
  row.querySelectorAll('.cp-period-btn').forEach(function(b){ b.onclick=function(){ CP_PERIOD=this.dataset.p; cpGo('inici'); }; });
}

var CP_NOTIF_KEY = 'hx_cp_notifs';

function cpLoadNotifs(){
  try {
    var raw = localStorage.getItem(CP_NOTIF_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}
function cpSaveNotifs(list){
  try { localStorage.setItem(CP_NOTIF_KEY, JSON.stringify(list)); } catch(e) {}
}
function cpSeedNotifsIfNeeded(fac){
  var existing = cpLoadNotifs();
  if (existing) return existing;
  var items = [];
  var pagades = fac.filter(function(f){ return cpEstatFactura(f)==='pagada'; });
  pagades.forEach(function(f){
    items.push({ id:'pag-'+f.num, icon:'✅', key:'t753', params:{num:f.num}, date:f.fecha, read:true });
  });
  var propVenc = fac.filter(function(f){return cpEstatFactura(f)==='pendent';}).sort(function(a,b){return a.venc.localeCompare(b.venc);})[0];
  if (propVenc) {
    var dies=Math.round((new Date(propVenc.venc+'T00:00:00')-new Date(CP_TODAY+'T00:00:00'))/86400000);
    if (dies>=0) items.push({ id:'venc-'+propVenc.num, icon:'⏳', key:'t754', params:{num:propVenc.num, dies:dies}, date:'', read:false });
  }
  if (fac[0]) items.push({ id:'nova-'+fac[0].num, icon:'🆕', key:'t755', params:{num:fac[0].num}, date:fac[0].fecha, read:false });
  items.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
  cpSaveNotifs(items);
  return items;
}
function cpAfegirNotificacio(icon, key, params){
  var list = cpLoadNotifs() || [];
  list.unshift({ id:'n'+Date.now(), icon:icon, key:key, params:params||{}, date:new Date().toISOString().slice(0,10), read:false });
  cpSaveNotifs(list);
}
window.cpAfegirNotificacio = cpAfegirNotificacio;
function cpMarkNotifRead(id){
  var list = cpLoadNotifs() || [];
  var n = list.find(function(x){ return x.id===id; });
  if (n) n.read = true;
  cpSaveNotifs(list);
  if (CP_TAB==='inici') { document.getElementById('cpMain').innerHTML = cpViewInici(); cpBindPeriodButtons(); }
}
window.cpMarkNotifRead = cpMarkNotifRead;
function cpMarkAllNotifsRead(){
  var list = cpLoadNotifs() || [];
  list.forEach(function(n){ n.read = true; });
  cpSaveNotifs(list);
  if (CP_TAB==='inici') { document.getElementById('cpMain').innerHTML = cpViewInici(); cpBindPeriodButtons(); }
}
window.cpMarkAllNotifsRead = cpMarkAllNotifsRead;

function cpNotifTitle(n){
  var txt = cpT(n.key || 't757');
  var params = n.params || {};
  Object.keys(params).forEach(function(k){ txt = txt.replace('{'+k+'}', params[k]); });
  return txt;
}
function cpNotifsHTML(fac){
  var items = cpSeedNotifsIfNeeded(fac);
  if(!items.length) return '<div class="cp-empty" style="padding:18px 10px"><div class="ic">🔔</div><span>'+cpT('t757')+'</span></div>';
  var noLlegides = items.filter(function(n){ return !n.read; }).length;
  var header = noLlegides > 0
    ? '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:11.5px;color:#8A5900;font-weight:700">'+noLlegides+' '+cpT('t758')+'</span><button type="button" onclick="cpMarkAllNotifsRead()" style="background:none;border:none;color:var(--green-deep);font-size:11.5px;font-weight:700;cursor:pointer;text-decoration:underline">'+cpT('t759')+'</button></div>'
    : '';
  var rows = items.map(function(n){
    var unreadStyle = n.read ? '' : 'background:#F5FAFF;';
    return '<div class="cp-notif" style="'+unreadStyle+'align-items:center">'+
      (n.read ? '' : '<span style="width:7px;height:7px;border-radius:50%;background:var(--green-deep);flex-shrink:0;margin-right:2px"></span>')+
      '<span class="ic">'+n.icon+'</span><div style="flex:1"><b>'+escHtml(cpNotifTitle(n))+'</b>'+(n.date?'<span>'+CP_FD(n.date)+'</span>':'')+'</div>'+
      (n.read ? '' : '<button type="button" onclick="cpMarkNotifRead(\''+n.id+'\')" style="background:none;border:1px solid var(--border);border-radius:8px;padding:4px 9px;font-size:10.5px;color:var(--green-deep);cursor:pointer;flex-shrink:0">'+cpT('t760')+'</button>')+
    '</div>';
  }).join('');
  return header + rows;
}

var CP_ESTATS_COMANDA = ['Processant','Enviat','En repartiment','Entregat'];
var CP_ESTATS_ICONS = {Processant:'📋', Enviat:'📦', 'En repartiment':'🚚', Entregat:'✅'};
var CP_ESTATS_KEY = {Processant:'t761', Enviat:'t762', 'En repartiment':'t763', Entregat:'t764'};

function cpEstatComandaColor(estat){
  var i = CP_ESTATS_COMANDA.indexOf(estat);
  return i===3 ? '#0B7256' : i===2 ? 'var(--green-mid)' : i===1 ? '#8A5900' : '#666';
}

function cpStepperHTML(estatActual){
  var idxActual = CP_ESTATS_COMANDA.indexOf(estatActual);
  return '<div style="display:flex;align-items:center;margin-top:14px">' +
    CP_ESTATS_COMANDA.map(function(estat, i){
      var done = i <= idxActual;
      var isLast = i === CP_ESTATS_COMANDA.length - 1;
      var circle = '<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:64px">' +
        '<div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;background:'+(done?'var(--green-deep)':'#E8ECEF')+';color:'+(done?'#fff':'#999')+';box-shadow:'+(i===idxActual?'0 0 0 4px rgba(11,61,107,.15)':'none')+';">'+(done?'✓':(i+1))+'</div>' +
        '<span style="font-size:9.5px;color:'+(done?'var(--charcoal)':'#999')+';font-weight:'+(done?'700':'500')+';margin-top:5px;text-align:center;line-height:1.2">'+cpT(CP_ESTATS_KEY[estat])+'</span>' +
      '</div>';
      var line = isLast ? '' : '<div style="flex:1;height:3px;background:'+(i<idxActual?'var(--green-deep)':'#E8ECEF')+';margin:0 -4px;margin-bottom:19px"></div>';
      return circle + line;
    }).join('') +
  '</div>';
}

// ── MAPA DE SEGUIMENT DE LA COMANDA ───────────────────────
// Il·lustració de la ruta (no és un mapa extern: no carrega res de fora ni
// posa galetes): magatzem de València → destinació, amb la furgoneta a la
// posició que toca segons l'estat i l'arribada estimada.
var HX_RUTA = { x0: 110, y0: 124, cx: 300, cy: 18, x1: 500, y1: 116 };
function hxPuntRuta(f){
  // Punt de la corba a la fracció f de la seva LONGITUD (no del paràmetre).
  var R = HX_RUTA, pts = [], llarg = [0];
  for (var i = 0; i <= 60; i++) {
    var u = i / 60, a = (1-u)*(1-u), b = 2*(1-u)*u, c = u*u;
    pts.push([a*R.x0 + b*R.cx + c*R.x1, a*R.y0 + b*R.cy + c*R.y1]);
    if (i) llarg.push(llarg[i-1] + Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]));
  }
  var objectiu = Math.max(0, Math.min(1, f)) * llarg[60];
  for (var k = 1; k <= 60; k++) if (llarg[k] >= objectiu) {
    var r = (objectiu - llarg[k-1]) / ((llarg[k] - llarg[k-1]) || 1);
    return [pts[k-1][0] + (pts[k][0]-pts[k-1][0])*r, pts[k-1][1] + (pts[k][1]-pts[k-1][1])*r];
  }
  return pts[60];
}
function hxMapaRuta(progres, desti, eta, cancel){
  var R = HX_RUTA, cami = 'M' + R.x0 + ',' + R.y0 + ' Q' + R.cx + ',' + R.cy + ' ' + R.x1 + ',' + R.y1;
  var p = Math.max(0, Math.min(1, progres)), fet = (p * 100).toFixed(1), pos = hxPuntRuta(p);
  var lliurat = p >= 1, color = cancel ? '#B4B9BE' : '#0B3D6B';
  var furgo = cancel ? '' : lliurat
    ? '<g transform="translate(' + R.x1 + ',' + (R.y1 - 44) + ')"><circle r="15" fill="#0B7256"/><path d="M-6 0l4 4 8-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>'
    : '<g class="hx-furgo" transform="translate(' + pos[0].toFixed(1) + ',' + (pos[1] - 4).toFixed(1) + ')">' +
        '<rect x="-17" y="-12" width="22" height="14" rx="3" fill="#F2A900"/><path d="M5-8h7l5 6v4H5z" fill="#F2A900"/>' +
        '<rect x="7" y="-6" width="5" height="4" rx="1" fill="#0B3D6B" opacity=".55"/>' +
        '<circle cx="-10" cy="3" r="3.2" fill="#0B3D6B"/><circle cx="11" cy="3" r="3.2" fill="#0B3D6B"/></g>';
  return '<div class="hx-mapa' + (cancel ? ' cancel' : '') + '">' +
    '<svg viewBox="0 0 600 170" role="img" aria-label="' + escHtml(eta) + '">' +
      '<defs><linearGradient id="hxMar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#EAF4FC"/><stop offset="1" stop-color="#F7FBFF"/></linearGradient></defs>' +
      '<rect width="600" height="170" rx="16" fill="url(#hxMar)"/>' +
      '<path d="M0 150 C120 138 190 160 300 150 S480 140 600 152 V170 H0Z" fill="#DCEBF7"/>' +
      '<path d="' + cami + '" fill="none" stroke="#C9D6E2" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 10"/>' +
      '<path d="' + cami + '" pathLength="100" fill="none" stroke="' + color + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + fet + ' 100" class="' + (lliurat || cancel ? '' : 'hx-ruta-viva') + '"/>' +
      '<g transform="translate(' + R.x0 + ',' + R.y0 + ')"><circle r="9" fill="#0B3D6B"/><path d="M-4 3v-5l4-3 4 3v5z" fill="#fff"/></g>' +
      '<text x="' + R.x0 + '" y="' + (R.y0 + 30) + '" text-anchor="middle" class="hx-mapa-txt">' + escHtml(cpT('t923')) + '</text>' +
      '<text x="' + R.x0 + '" y="' + (R.y0 + 44) + '" text-anchor="middle" class="hx-mapa-sub">València</text>' +
      '<g transform="translate(' + R.x1 + ',' + R.y1 + ')"><circle r="16" fill="' + (lliurat ? '#0B7256' : '#1565A8') + '" opacity=".18" class="' + (lliurat || cancel ? '' : 'hx-pols') + '"/>' +
        '<circle r="9" fill="' + (lliurat ? '#0B7256' : '#1565A8') + '"/><circle r="3.5" fill="#fff"/></g>' +
      '<text x="' + R.x1 + '" y="' + (R.y1 + 30) + '" text-anchor="middle" class="hx-mapa-txt">' + escHtml(desti) + '</text>' +
      furgo +
    '</svg>' +
    '<div class="hx-mapa-eta">' + (cancel ? '⛔ ' : lliurat ? '✅ ' : '🕒 ') + escHtml(eta) + '</div>' +
  '</div>';
}

function cpTornarAComprarComanda(num){
  var c = CP_DB.comandes.find(function(x){ return x.num===num; });
  if (c) cpTornarAComprar(c.lineas);
}
window.cpTornarAComprarComanda = cpTornarAComprarComanda;
function cpTornarAComprarFactura(num){
  var f = CP_DB.facturas.find(function(x){ return x.num===num; });
  if (f) cpTornarAComprar(f.lineas);
}
window.cpTornarAComprarFactura = cpTornarAComprarFactura;

function cpViewComandes(){
  var com=CP_DB.comandes.slice().sort(function(a,b){return b.fecha.localeCompare(a.fecha);});
  if(!com.length){
    return '<div class="cp-topbar"><div class="cp-greet"><h2>'+cpT('t718')+'</h2><p>'+cpT('t765')+'</p></div></div>'+
      '<div class="cp-empty"><div class="ic">📦</div><b>'+cpT('t766')+'</b><span>'+cpT('t767')+'</span></div>';
  }
  var cards=com.map(function(c){
    var color=cpEstatComandaColor(c.estat);
    var linies=c.lineas.map(function(l){ return escHtml(l.nom)+' ×'+l.cant; }).join(', ');
    return '<div class="cp-card" style="margin-bottom:16px">'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">'+
        '<div><div style="font-weight:700;font-size:14.5px;color:var(--charcoal)">'+escHtml(c.num)+'</div>'+
        '<div style="font-size:11.5px;color:var(--cp-muted,rgba(26,26,26,.55));margin-top:2px">'+CP_FD(c.fecha)+' · '+linies+'</div></div>'+
        '<div style="text-align:right"><div class="cp-inv-amt" style="font-size:15px">'+CP_EUR(c.total)+'</div>'+
        '<span class="cp-tag" style="color:'+color+';border-color:'+color+'44;background:'+color+'18">'+CP_ESTATS_ICONS[c.estat]+' '+cpT(CP_ESTATS_KEY[c.estat])+'</span></div>'+
      '</div>'+
      cpStepperHTML(c.estat)+
      hxMapaRuta([0.04, 0.35, 0.75, 1][Math.max(0, CP_ESTATS_COMANDA.indexOf(c.estat))], CP_DB.cliente.pob || cpT('t928'),
        c.estat==='Entregat' ? cpT('t927') + ' · ' + CP_FD(c.fecha) : c.estat==='En repartiment' ? cpT('t926') : c.estat==='Enviat' ? cpT('t925') : cpT('t924'))+
      '<div style="text-align:right;margin-top:14px"><button type="button" onclick="cpTornarAComprarComanda(\''+c.num+'\')" class="cp-btn ghost" style="padding:7px 14px;font-size:12px">'+cpT('t768')+'</button></div>'+
    '</div>';
  }).join('');
  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>'+cpT('t718')+'</h2><p>'+cpT('t765')+'</p></div></div>'+
    cards;
}

/* =========================================================
   VERI*FACTU — SIMULACIÓN DIDÁCTICA (sin conexión real con la AEAT)
   Reproduce el funcionamiento del sistema VERI*FACTU (RD 1007/2023):
   cada factura emitida genera un registro de alta con una huella
   SHA-256 encadenada con la del registro anterior, se "remite" a la
   AEAT y lleva un código QR de cotejo. Todo es ficticio: la empresa,
   el CSV y la respuesta de la AEAT son inventados.
   ========================================================= */
(function(){
  var NIF='B12345678', RAZON='HIGIENEX S.L.';

  function sha256(ascii){
    ascii=unescape(encodeURIComponent(ascii));
    function rr(v,a){return (v>>>a)|(v<<(32-a));}
    var mp=Math.pow, mw=mp(2,32), r='', words=[], abl=ascii.length*8, hash=[], k=[], pc=0, isC={}, i, j;
    for(var cand=2; pc<64; cand++){ if(!isC[cand]){ for(i=0;i<313;i+=cand) isC[i]=cand; hash[pc]=(mp(cand,.5)*mw)|0; k[pc++]=(mp(cand,1/3)*mw)|0; } }
    ascii+='\x80'; while(ascii.length%64-56) ascii+='\x00';
    for(i=0;i<ascii.length;i++){ j=ascii.charCodeAt(i); words[i>>2]|=j<<((3-i)%4)*8; }
    words[words.length]=((abl/mw)|0); words[words.length]=abl;
    for(j=0;j<words.length;){
      var w=words.slice(j,j+=16), oh=hash; hash=hash.slice(0,8);
      for(i=0;i<64;i++){
        var w15=w[i-15], w2=w[i-2], a=hash[0], e=hash[4];
        var t1=hash[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&hash[5])^((~e)&hash[6]))+k[i]
          +(w[i]=(i<16)?w[i]:(w[i-16]+(rr(w15,7)^rr(w15,18)^(w15>>>3))+w[i-7]+(rr(w2,17)^rr(w2,19)^(w2>>>10)))|0);
        var t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
        hash=[(t1+t2)|0].concat(hash); hash[4]=(hash[4]+t1)|0;
      }
      for(i=0;i<8;i++) hash[i]=(hash[i]+oh[i])|0;
    }
    for(i=0;i<8;i++) for(j=3;j+1;j--){ var b=(hash[i]>>(j*8))&255; r+=((b<16)?'0':'')+b.toString(16); }
    return r;
  }
  function p2(n){ return (n<10?'0':'')+n; }
  function dmy(iso){ var p=String(iso||'').split('-'); return p.length===3?p[2]+'-'+p[1]+'-'+p[0]:String(iso||''); }
  function n2(x){ return (Math.round((+x||0)*100)/100).toFixed(2); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  /* Cadena de registros: ordenados por fecha y número, cada huella
     incluye la del registro anterior (primer registro: Huella vacía). */
  function cadena(lista){
    var ord=(lista||[]).slice().sort(function(a,b){ return String(a.fecha).localeCompare(String(b.fecha))||String(a.num).localeCompare(String(b.num)); });
    var prev='', out={}, arr=[];
    ord.forEach(function(f,i){
      var ts=f.fecha+'T'+p2(9+(i%9))+':'+p2((i*17+7)%60)+':'+p2((i*31+12)%60)+'+01:00';
      var cad='IDEmisorFactura='+NIF+'&NumSerieFactura='+f.num+'&FechaExpedicionFactura='+dmy(f.fecha)+
              '&TipoFactura=F1&CuotaTotal='+n2(f.cuota)+'&ImporteTotal='+n2(f.total)+'&Huella='+prev+'&FechaHoraHusoGenRegistro='+ts;
      var h=sha256(cad).toUpperCase();
      var rec={orden:i+1, num:f.num, fechaISO:f.fecha, fecha:dmy(f.fecha), cuota:n2(f.cuota), importe:n2(f.total), base:n2(f.base),
               ts:ts, huella:h, anterior:prev, cadena:cad,
               csv:'A-'+h.slice(0,4)+h.slice(-4)+'-'+sha256('csv'+h).slice(0,6).toUpperCase(),
               estado:'Correcto'};
      out[f.num]=rec; arr.push(rec); prev=h;
    });
    return {map:out, lista:arr};
  }

  function urlCotejo(r){
    var base='index.html';
    try{ base=location.href.split('#')[0].split('?')[0].replace(/[^\/]*$/,'')+'index.html'; }catch(e){}
    return base+'?verifactu=1&nif='+NIF+'&numserie='+encodeURIComponent(r.num)+'&fecha='+r.fecha+'&importe='+r.importe;
  }

  /* Matriz del QR: con la librería qrcode si está cargada; si no, un
     patrón falso (pero con aspecto de QR) generado a partir de la huella. */
  function matriz(text){
    try{
      if(window.QRCode && typeof QRCode.create==='function'){
        var q=QRCode.create(text,{errorCorrectionLevel:'M'}), n=q.modules.size, d=q.modules.data;
        return {n:n, get:function(x,y){ return !!d[y*n+x]; }, real:true};
      }
    }catch(e){}
    var N=29, bits=[], seed='', i;
    for(i=0;bits.length<N*N;i++){ seed=sha256(text+'#'+i); for(var c=0;c<seed.length;c++){ var v=parseInt(seed[c],16); bits.push(v&1,(v>>1)&1,(v>>2)&1,(v>>3)&1); } }
    function finder(x,y,ox,oy){ var dx=x-ox, dy=y-oy; if(dx<-1||dy<-1||dx>7||dy>7) return null; if(dx<0||dy<0||dx>6||dy>6) return false;
      return (dx===0||dy===0||dx===6||dy===6)||(dx>=2&&dx<=4&&dy>=2&&dy<=4); }
    return {n:N, real:false, get:function(x,y){
      var f=finder(x,y,0,0); if(f===null) f=finder(x,y,N-7,0); if(f===null) f=finder(x,y,0,N-7);
      if(f!==null) return f;
      if(y===6) return x%2===0; if(x===6) return y%2===0;
      return !!bits[y*N+x];
    }};
  }
  function qrSVG(text, px, color){
    var m=matriz(text), q=4, n=m.n, d='';
    for(var y=0;y<n;y++) for(var x=0;x<n;x++) if(m.get(x,y)) d+='M'+(x+q)+' '+(y+q)+'h1v1h-1z';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+px+'" height="'+px+'" viewBox="0 0 '+(n+2*q)+' '+(n+2*q)+'" shape-rendering="crispEdges" role="img" aria-label="QR VeriFactu">'+
      '<rect width="100%" height="100%" fill="#fff"/><path d="'+d+'" fill="'+(color||'#0B3D6B')+'"/></svg>';
  }
  function qrPDF(doc, text, x, y, size){
    var m=matriz(text), n=m.n, s=size/(n+2), ox=x+s, oy=y+s;
    doc.setFillColor(255,255,255); doc.rect(x,y,size,size,'F');
    doc.setFillColor(11,61,107);
    for(var j=0;j<n;j++){ var i=0; while(i<n){ if(m.get(i,j)){ var st=i; while(i<n&&m.get(i,j)) i++; doc.rect(ox+st*s, oy+j*s, (i-st)*s+0.05, s+0.05, 'F'); } else i++; } }
  }

  var TXT={
    ca:{tit:'VERI*FACTU', leyenda:'Factura verificable a la seu electrònica de l\u2019AEAT', huella:'Empremta (SHA-256)', anterior:'Empremta anterior', csv:'CSV de l\u2019AEAT', reg:'Registre', enviado:'Remès a l\u2019AEAT', estado:'Estat', ok:'Acceptat', xml:'Veure el registre remès (XML)', aviso:'Simulació didàctica · sense validesa fiscal', escanea:'Escaneja per cotejar la factura', primero:'(primer registre de la cadena)'},
    es:{tit:'VERI*FACTU', leyenda:'Factura verificable en la sede electrónica de la AEAT', huella:'Huella (SHA-256)', anterior:'Huella anterior', csv:'CSV de la AEAT', reg:'Registro', enviado:'Remitido a la AEAT', estado:'Estado', ok:'Aceptado', xml:'Ver el registro remitido (XML)', aviso:'Simulación didáctica · sin validez fiscal', escanea:'Escanea para cotejar la factura', primero:'(primer registro de la cadena)'},
    en:{tit:'VERI*FACTU', leyenda:'Invoice verifiable at the AEAT e-office', huella:'Hash (SHA-256)', anterior:'Previous hash', csv:'AEAT CSV code', reg:'Record', enviado:'Sent to AEAT', estado:'Status', ok:'Accepted', xml:'View submitted record (XML)', aviso:'Educational simulation · no tax validity', escanea:'Scan to verify the invoice', primero:'(first record in the chain)'}
  };
  function t(k, lang){ var L=TXT[lang]||TXT.es; return L[k]||TXT.es[k]; }
  function fmtTs(ts){ return dmy(ts.slice(0,10))+' '+ts.slice(11,19); }

  function xmlRegistro(r){
    return '<sum1:RegistroAlta>\n'+
      '  <sum1:IDVersion>1.0</sum1:IDVersion>\n'+
      '  <sum1:IDFactura>\n    <sum1:IDEmisorFactura>'+NIF+'</sum1:IDEmisorFactura>\n    <sum1:NumSerieFactura>'+r.num+'</sum1:NumSerieFactura>\n    <sum1:FechaExpedicionFactura>'+r.fecha+'</sum1:FechaExpedicionFactura>\n  </sum1:IDFactura>\n'+
      '  <sum1:NombreRazonEmisor>'+RAZON+'</sum1:NombreRazonEmisor>\n  <sum1:TipoFactura>F1</sum1:TipoFactura>\n'+
      '  <sum1:Desglose><sum1:DetalleDesglose>\n    <sum1:ClaveRegimen>01</sum1:ClaveRegimen><sum1:CalificacionOperacion>S1</sum1:CalificacionOperacion>\n    <sum1:TipoImpositivo>21.00</sum1:TipoImpositivo><sum1:BaseImponibleOimporteNoSujeto>'+r.base+'</sum1:BaseImponibleOimporteNoSujeto><sum1:CuotaRepercutida>'+r.cuota+'</sum1:CuotaRepercutida>\n  </sum1:DetalleDesglose></sum1:Desglose>\n'+
      '  <sum1:CuotaTotal>'+r.cuota+'</sum1:CuotaTotal>\n  <sum1:ImporteTotal>'+r.importe+'</sum1:ImporteTotal>\n'+
      '  <sum1:Encadenamiento>'+(r.anterior?'<sum1:RegistroAnterior><sum1:Huella>'+r.anterior+'</sum1:Huella></sum1:RegistroAnterior>':'<sum1:PrimerRegistro>S</sum1:PrimerRegistro>')+'</sum1:Encadenamiento>\n'+
      '  <sum1:SistemaInformatico><sum1:NombreSistemaInformatico>HIGIENEX ERP</sum1:NombreSistemaInformatico><sum1:IdSistemaInformatico>HX</sum1:IdSistemaInformatico><sum1:Version>2026.1</sum1:Version></sum1:SistemaInformatico>\n'+
      '  <sum1:FechaHoraHusoGenRegistro>'+r.ts+'</sum1:FechaHoraHusoGenRegistro>\n  <sum1:TipoHuella>01</sum1:TipoHuella>\n  <sum1:Huella>'+r.huella+'</sum1:Huella>\n'+
      '</sum1:RegistroAlta>';
  }

  /* Bloque para los modales de factura (ERP y portal de cliente) */
  function panelHTML(r, lang){
    var url=urlCotejo(r);
    return '<div style="margin-top:20px;border:1px solid #D6E0EA;border-radius:12px;padding:16px;display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;background:#F7FAFC">'+
      '<a href="'+esc(url)+'" target="_blank" rel="noopener" title="'+esc(t('escanea',lang))+'" style="flex:0 0 auto;line-height:0;border:1px solid #D6E0EA;border-radius:8px;overflow:hidden">'+qrSVG(url,118)+'</a>'+
      '<div style="flex:1;min-width:220px;font-size:12.5px;color:#33424F;line-height:1.55">'+
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px"><b style="font-size:14px;color:#0B3D6B;letter-spacing:.02em">'+t('tit',lang)+'</b>'+
          '<span style="font-size:11px;font-weight:700;color:#0B7256;background:#E5F3EE;border-radius:20px;padding:2px 9px">✓ '+esc(t('ok',lang))+'</span></div>'+
        '<div style="margin-bottom:8px">'+esc(t('leyenda',lang))+'</div>'+
        '<div style="font-size:11.5px"><b>'+esc(t('huella',lang))+':</b> <span style="font-family:ui-monospace,Menlo,Consolas,monospace;word-break:break-all">'+r.huella+'</span></div>'+
        '<div style="font-size:11.5px"><b>'+esc(t('anterior',lang))+':</b> <span style="font-family:ui-monospace,Menlo,Consolas,monospace;word-break:break-all">'+(r.anterior?r.anterior.slice(0,24)+'…':esc(t('primero',lang)))+'</span></div>'+
        '<div style="font-size:11.5px"><b>'+esc(t('csv',lang))+':</b> <span style="font-family:ui-monospace,Menlo,Consolas,monospace">'+r.csv+'</span> · <b>'+esc(t('reg',lang))+'</b> nº '+r.orden+' · '+esc(t('enviado',lang))+' '+fmtTs(r.ts)+'</div>'+
        '<details style="margin-top:8px"><summary style="cursor:pointer;font-size:12px;color:#0B3D6B;font-weight:600">'+esc(t('xml',lang))+'</summary>'+
          '<pre style="margin:8px 0 0;max-height:220px;overflow:auto;background:#fff;border:1px solid #E3E8ED;border-radius:8px;padding:10px;font-size:10.5px;line-height:1.45;white-space:pre">'+esc(xmlRegistro(r))+'</pre></details>'+
        '<div style="margin-top:8px;font-size:10.5px;color:#8A97A3">'+esc(t('aviso',lang))+'</div>'+
      '</div></div>';
  }

  /* Bloque para los PDF de factura. Devuelve la nueva coordenada y. */
  function bloquePDF(doc, r, M, W, H, y, lang){
    var hBox=96;
    if(y > H - hBox - 40){ doc.addPage(); y=46; }
    var url=urlCotejo(r);
    doc.setDrawColor(214,224,234); doc.setLineWidth(0.75);
    doc.setFillColor(247,250,252); doc.roundedRect(M, y, W-2*M, hBox, 6, 6, 'FD');
    qrPDF(doc, url, M+10, y+10, hBox-20);
    var tx=M+hBox+6, tw=W-M-14-tx;
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(11,61,107);
    doc.text('VERI*FACTU', tx, y+20);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(22,35,46);
    doc.text(t('leyenda',lang), tx, y+33);
    doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(122,135,148);
    doc.text(t('huella',lang).toUpperCase(), tx, y+47);
    doc.setFont('courier','normal'); doc.setFontSize(7.2); doc.setTextColor(51,66,79);
    doc.text(doc.splitTextToSize(r.huella, tw), tx, y+56);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(51,66,79);
    doc.text(t('csv',lang)+': '+r.csv+'   \u00b7   '+t('reg',lang)+' n\u00ba '+r.orden+'   \u00b7   '+t('enviado',lang)+' '+fmtTs(r.ts), tx, y+75);
    doc.setFontSize(6.8); doc.setTextColor(148,163,176);
    doc.text(t('aviso',lang), tx, y+86);
    return y+hBox+14;
  }

  window.HXVF={NIF:NIF, sha256:sha256, cadena:cadena, urlCotejo:urlCotejo, qrSVG:qrSVG, qrPDF:qrPDF,
               panelHTML:panelHTML, bloquePDF:bloquePDF, xmlRegistro:xmlRegistro, t:t, fmtTs:fmtTs, esc:esc};
})();

/* Página de cotejo simulada: se abre al escanear el QR VeriFactu
   (index.html?verifactu=1&nif=…&numserie=…&fecha=…&importe=…). */
(function(){
  function abrir(){
    var q; try{ q=new URLSearchParams(location.search); }catch(e){ return; }
    if(q.get('verifactu')!=='1') return;
    var E=window.HXVF.esc, num=q.get('numserie')||'', fecha=q.get('fecha')||'', imp=q.get('importe')||'', nif=q.get('nif')||'';
    var lista=(window.CP_DB&&CP_DB.facturas)||[], r=null;
    if(lista.length){ var ch=HXVF.cadena(lista); r=ch.map[num]||null; }
    var coincide=!r || (r.importe===imp && r.fecha===fecha);
    var filas=[['NIF del emisor',nif+' · HIGIENEX S.L.'],['Número de factura',num],['Fecha de expedición',fecha],['Importe total',imp+' €']];
    var ov=document.createElement('div');
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
    ov.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(6,20,38,.55);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
    ov.innerHTML='<div style="background:#fff;max-width:480px;width:100%;border-radius:14px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)">'+
      '<div style="background:#0B3D6B;color:#fff;padding:16px 20px"><div style="font-size:12px;opacity:.75">Agencia Tributaria · sede electrónica (simulación)</div>'+
      '<div style="font-size:18px;font-weight:700;margin-top:2px">Cotejo de factura VERI*FACTU</div></div>'+
      '<div style="padding:18px 20px">'+
        '<div style="display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:10px;margin-bottom:14px;background:'+(coincide?'#E5F3EE':'#F7E6E4')+';color:'+(coincide?'#0B7256':'#8C281E')+';font-weight:600;font-size:14px">'+
          (coincide?'✓ La factura consta como registrada y sus datos coinciden.':'✕ Los datos del QR no coinciden con ningún registro.')+'</div>'+
        '<table style="width:100%;border-collapse:collapse;font-size:13px">'+filas.map(function(f){return '<tr><td style="padding:6px 0;color:#7A8794;width:42%;vertical-align:top">'+E(f[0])+'</td><td style="padding:6px 0;color:#16232E">'+E(f[1])+'</td></tr>';}).join('')+'</table>'+
        '<p style="font-size:11px;color:#8A97A3;margin:14px 0 0">Página ficticia creada para el proyecto HIGIENEX. No consulta la AEAT ni tiene validez fiscal.</p>'+
        '<div style="text-align:right;margin-top:14px"><button type="button" style="background:#0B3D6B;color:#fff;border:0;border-radius:8px;padding:9px 16px;font-size:13px;cursor:pointer">Cerrar</button></div>'+
      '</div></div>';
    ov.querySelector('button').onclick=function(){ ov.remove(); try{ history.replaceState(null,'',location.pathname); }catch(e){} };
    document.body.appendChild(ov);
    ov.querySelector('button').focus();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ setTimeout(abrir,300); }); else setTimeout(abrir,300);
})();

function cpVFLang(){ var l=cpLang(); return (l==='ca'||l==='es'||l==='en')?l:'es'; }
function cpViewFactures(){
  var fac=CP_DB.facturas.slice().sort(function(a,b){return b.fecha.localeCompare(a.fecha);});
  if(CP_FILTER!=='totes') fac=fac.filter(function(f){return cpEstatFactura(f)===CP_FILTER;});
  if(CP_SEARCH) fac=fac.filter(function(f){return f.num.toLowerCase().indexOf(CP_SEARCH.toLowerCase())>=0;});

  var chips=[['totes','t769'],['pagada','t770'],['pendent','t771'],['vencida','t772']].map(function(ch){
    return '<button type="button" class="cp-chip '+(CP_FILTER===ch[0]?'active':'')+'" onclick="cpFiltrar(\''+ch[0]+'\')">'+cpT(ch[1])+'</button>';
  }).join('');

  var VFC=HXVF.cadena(CP_DB.facturas).map;
  var rows=fac.map(function(f){
    var e=cpEstatFactura(f);
    return '<div class="cp-inv-row" onclick="cpVeureFactura(\''+f.num+'\')">'+
      '<span class="cp-inv-dot" style="background:'+cpEstatColor(e)+'"></span>'+
      '<div style="flex:1;min-width:0"><div class="cp-inv-num">'+escHtml(f.num)+'</div><div class="cp-inv-date">'+CP_FD(f.fecha)+' · '+cpT('t776')+(VFC[f.num]?' · <span style="color:#0B7256;font-weight:700" title="'+VFC[f.num].huella+'">✓ VERI*FACTU</span>':'')+'</div></div>'+
      '<div style="text-align:right"><div class="cp-inv-amt">'+CP_EUR(f.total)+'</div><span class="cp-tag" style="color:'+cpEstatColor(e)+';border-color:'+cpEstatColor(e)+'44;background:'+cpEstatColor(e)+'18">'+cpEstatLabel(e)+'</span></div>'+
      '<div class="cp-inv-actions" onclick="event.stopPropagation()">'+
        '<button type="button" title="'+cpT('t777')+'" onclick="cpVeureFactura(\''+f.num+'\')">👁</button>'+
        '<button type="button" title="'+cpT('t778')+'" onclick="cpDescarregarFactura(\''+f.num+'\')">⬇</button>'+
        '<button type="button" title="'+escHtml(cpTx('Enviar-me-la per email'))+'" onclick="cpEnviarFacturaEmail(\''+f.num+'\', this)">✉</button>'+
        '<button type="button" title="'+cpT('t768').replace('🔁 ','')+'" onclick="cpTornarAComprarFactura(\''+f.num+'\')">🔁</button>'+
      '</div>'+
    '</div>';
  }).join('');

  var empty='<div class="cp-empty"><div class="ic">🧾</div><b>'+cpT('t782')+'</b><span>'+cpT('t783')+'</span></div>';

  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>'+cpT('t719')+'</h2><p>'+cpT('t779')+'</p></div>'+
      '<button type="button" onclick="cpDescarregarExtracte()" class="cp-btn ghost">'+cpT('t780')+'</button>'+
    '</div>'+
    '<div class="cp-card">'+
      '<div class="cp-toolbar">'+
        '<input class="cp-search" placeholder="'+cpT('t781')+'" value="'+escHtml(CP_SEARCH)+'" oninput="cpCercar(this.value)">'+chips+
      '</div>'+(rows || empty)+
    '</div>';
}
function cpFiltrar(f){ CP_FILTER=f; cpGo('factures'); }
window.cpFiltrar=cpFiltrar;
function cpCercar(v){ CP_SEARCH=v; var main=document.getElementById('cpMain'); main.innerHTML=cpViewFactures(); var inp=main.querySelector('.cp-search'); if(inp){ inp.focus(); inp.selectionStart=inp.selectionEnd=inp.value.length; } }
window.cpCercar=cpCercar;

function cpVeureFactura(num){
  var f=CP_DB.facturas.find(function(x){return x.num===num;}); if(!f) return;
  var c=CP_DB.cliente, e=cpEstatFactura(f);
  var filas=(f.lineas||[]).map(function(l){
    var p=CP_DB.productos[l.art];
    var nomProd = l.nom || (p?p.nom:l.art);
    return '<tr><td style="padding:7px 4px;border-bottom:1px solid var(--border)">'+escHtml(nomProd)+'</td><td class="num" style="text-align:right;padding:7px 4px;border-bottom:1px solid var(--border)">'+CP_NUM(l.cant)+'</td><td class="num" style="text-align:right;padding:7px 4px;border-bottom:1px solid var(--border)">'+CP_EUR(l.precio)+'</td><td class="num" style="text-align:right;padding:7px 4px;border-bottom:1px solid var(--border)">'+CP_EUR(l.cant*l.precio)+'</td></tr>';
  }).join('');
  var body =
    '<div style="margin-bottom:16px"><span class="cp-tag" style="color:'+cpEstatColor(e)+';border-color:'+cpEstatColor(e)+'44;background:'+cpEstatColor(e)+'18">'+cpEstatLabel(e)+'</span></div>'+
    '<div style="display:flex;gap:24px;margin-bottom:18px;flex-wrap:wrap;font-size:13px">'+
      '<div><b style="font-size:11px;color:var(--cp-muted,rgba(26,26,26,.55));display:block">'+cpT('t784')+'</b>'+CP_FD(f.fecha)+'</div>'+
      '<div><b style="font-size:11px;color:var(--cp-muted,rgba(26,26,26,.55));display:block">'+cpT('t785')+'</b>'+CP_FD(f.venc)+'</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">'+
      '<div style="border:1px solid var(--border);border-radius:10px;padding:12px 14px">'+
        '<div style="font-size:9.5px;letter-spacing:.08em;color:#B8860B;font-weight:700;margin-bottom:6px">'+cpT('t786')+'</div>'+
        '<div style="font-size:12.5px;color:#33424F;line-height:1.7"><b style="display:block;color:var(--charcoal);font-size:13px">'+escHtml(c.nom)+'</b>NIF: '+escHtml(c.nif||'—')+'<br>'+escHtml(c.dir||'—')+'<br>'+escHtml(c.pob||'—')+'</div>'+
      '</div>'+
      '<div style="border:1px solid var(--border);border-radius:10px;padding:12px 14px">'+
        '<div style="font-size:9.5px;letter-spacing:.08em;color:#B8860B;font-weight:700;margin-bottom:6px">'+cpT('t787')+'</div>'+
        '<div style="font-size:12.5px;color:#33424F;line-height:1.7"><b style="display:block;color:var(--charcoal);font-size:13px">HIGIENEX S.L.</b>CIF: B12345678<br>Carrer de la Indústria, 25<br>46010 València</div>'+
      '</div>'+
    '</div>'+
    '<table style="width:100%;border-collapse:collapse;font-size:12.5px"><thead><tr><th style="text-align:left;border-bottom:2px solid var(--charcoal);padding:6px 4px">'+cpT('t788')+'</th><th style="text-align:right;border-bottom:2px solid var(--charcoal);padding:6px 4px">'+cpT('t789')+'</th><th style="text-align:right;border-bottom:2px solid var(--charcoal);padding:6px 4px">'+cpT('t790')+'</th><th style="text-align:right;border-bottom:2px solid var(--charcoal);padding:6px 4px">'+cpT('t791')+'</th></tr></thead><tbody>'+filas+'</tbody></table>'+
    '<div style="margin-left:auto;width:260px;margin-top:14px;font-size:13px">'+
      '<div style="display:flex;justify-content:space-between;padding:5px 0"><span>'+cpT('t792')+'</span><span>'+CP_EUR(f.base)+'</span></div>'+
      '<div style="display:flex;justify-content:space-between;padding:5px 0"><span>'+cpT('t793')+'</span><span>'+CP_EUR(f.cuota)+'</span></div>'+
      '<div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid var(--green-deep);font-weight:800;color:var(--green-deep)"><span>'+cpT('t794')+'</span><span>'+CP_EUR(f.total)+'</span></div>'+
    '</div>'+
    (function(){ var vr=HXVF.cadena(CP_DB.facturas).map[num]; return vr?HXVF.panelHTML(vr,cpVFLang()):''; })();
  cpOpenModal(cpT('t795')+' '+escHtml(num), body,
    '<button class="cp-btn ghost" onclick="cpCloseModal()" type="button">'+cpT('t796')+'</button>'+
    '<button class="cp-btn ghost" onclick="window.print()" type="button">'+cpT('t797')+'</button>'+
    '<button class="cp-btn ghost" onclick="cpTornarAComprarFactura(\''+num+'\')" type="button">'+cpT('t768')+'</button>'+
    '<button class="cp-btn ghost" onclick="cpEnviarFacturaEmail(\''+num+'\', this)" type="button">✉ '+escHtml(cpTx('Enviar-me-la per email'))+'</button>'+
    '<button class="cp-btn" onclick="cpDescarregarFactura(\''+num+'\')" type="button">'+cpT('t798')+'</button>');
}
window.cpVeureFactura=cpVeureFactura;

// Textos nous de l'àrea de clients, en l'idioma de la web (pdf-i18n.js).
function cpTx(){
  if (window.HXT) return HXT.apply(null, arguments);
  var a = arguments;
  return String(a[0]).replace(/\{(\d)\}/g, function(m, i){ return a[+i + 1]; });
}
// Envia la factura en PDF a l'email de l'usuari de l'àrea de clients (el servidor
// comprova que la factura és seva i l'envia només a la seva adreça).
function cpEnviarFacturaEmail(num, btn){
  if (!(window.HXPDF_DOCS && HXPDF.disponible())) { showToast(cpTx('No s’ha pogut enviar la factura. Torna-ho a provar més tard.'), '⚠️'); return; }
  var doc;
  window.HXPDF_SENSE_DESAR = true;
  try { doc = HXPDF_DOCS.factura(num); } finally { window.HXPDF_SENSE_DESAR = false; }
  if (!doc) return;
  var fd = new FormData();
  fd.append('num', num);
  fd.append('lang', hxIdiomaWeb());
  fd.append('pdf', doc.output('blob'), 'factura-' + num + '.pdf');
  var txt = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = '…'; }
  fetch(HX_API_BASE + '/portal/factura-email', { method: 'POST', headers: { 'X-Portal-Token': hxPortalToken() }, body: fd })
    .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(d){ if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; }); })
    .then(function(){
      var me = (typeof CP_CURRENT_USER !== 'undefined' && CP_CURRENT_USER && CP_CURRENT_USER.email) || (window.HX_USER && HX_USER.email) || '';
      showToast(cpTx('Factura {0} enviada a {1}', num, me || 'email'), '✅');
    })
    .catch(function(err){ console.warn('Factura per email:', err); showToast(cpTx('No s’ha pogut enviar la factura. Torna-ho a provar més tard.'), '⚠️'); })
    .then(function(){ if (btn) { btn.disabled = false; btn.innerHTML = txt; } });
}
window.cpEnviarFacturaEmail = cpEnviarFacturaEmail;

function cpOpenModal(title, body, footer){
  var wrap=document.getElementById('cpModalWrap');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='cpModalWrap';
    wrap.style.cssText='display:none;position:fixed;inset:0;z-index:9999999;background:rgba(11,61,107,0.55);backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:1rem;';
    wrap.onclick=function(e){ if(e.target===wrap) cpCloseModal(); };
    document.body.appendChild(wrap);
  }
  wrap.innerHTML='<div style="background:var(--cp-surface,#fff);border-radius:16px;max-width:640px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 24px 70px rgba(0,0,0,0.3);">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:1.1rem 1.4rem;border-bottom:1px solid var(--border)"><h3 style="margin:0;font-size:1.05rem;color:var(--green-deep)">'+title+'</h3><button onclick="cpCloseModal()" type="button" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#888">✕</button></div>'+
    '<div style="padding:1.4rem">'+body+'</div>'+
    (footer?'<div style="padding:1rem 1.4rem;border-top:1px solid var(--border);display:flex;gap:0.6rem;justify-content:flex-end;flex-wrap:wrap">'+footer+'</div>':'')+
    '</div>';
  wrap.style.display='flex';
}
function cpCloseModal(){ var wrap=document.getElementById('cpModalWrap'); if(wrap) wrap.style.display='none'; }
window.cpCloseModal=cpCloseModal;

function cpOpenOrDownloadHtml(html, filename){
  descargarPDFDirecto(filename.replace(/\.html?$/i, '') + '.pdf', html);
}

function cpDescarregarExtracte(){
  if (window.HXPDF_DOCS && HXPDF.disponible()) return HXPDF_DOCS.extracte();
  var fac = CP_DB.facturas.slice().sort(function(a,b){ return a.fecha.localeCompare(b.fecha); });
  var c = CP_DB.cliente;
  if (!fac.length) { alert(cpT('t827')); return; }
  var totalFacturat = fac.reduce(function(s,f){ return s+f.total; }, 0);
  var totalPagat = fac.filter(function(f){ return cpEstatFactura(f)==='pagada'; }).reduce(function(s,f){ return s+f.total; }, 0);
  var totalPendent = totalFacturat - totalPagat;
  var primera = fac[0].fecha, ultima = fac[fac.length-1].fecha;
  if (typeof window.jspdf === 'undefined') { showToast('No se ha podido cargar el generador de PDF.', '⚠️'); return; }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  var M=42, W=595.28;
  var y=46;
  doc.setFont('times','bold'); doc.setFontSize(20);
  doc.setTextColor(11,61,107);
  doc.text('HIGIENE', M, y);
  var w1=doc.getTextWidth('HIGIENE');
  doc.setTextColor(242,169,0);
  doc.text('X', M+w1, y);
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  doc.setTextColor(122,135,148);
  doc.text('HIGIENEX S.L. \u00b7 CIF B12345678', M, y+14);
  doc.text('Carrer de la Ind\u00fastria, 25 \u00b7 46010 Val\u00e8ncia', M, y+24);
  doc.setFont('times','bold'); doc.setFontSize(15);
  doc.setTextColor(22,35,46);
  doc.text(cpT('t828'), W-M, y-4, {align:'right'});
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.setTextColor(122,135,148);
  doc.text(String(c.nom)+' \u00b7 NIF '+(c.nif||'\u2014'), W-M, y+11, {align:'right'});
  doc.text(cpT('t837')+' '+CP_FD(primera)+' \u2013 '+CP_FD(ultima), W-M, y+23, {align:'right'});
  y += 40;
  doc.setDrawColor(11,61,107); doc.setLineWidth(2.2);
  doc.line(M, y, W-M, y);
  y += 24;
  var cards = [
    [CP_EUR(totalFacturat), cpT('t829'), [11,61,107]],
    [CP_EUR(totalPagat), cpT('t830'), [11,114,86]],
    [CP_EUR(totalPendent), cpT('t831'), totalPendent>0?[138,89,0]:[11,114,86]],
    [String(fac.length), cpT('t832'), [22,35,46]]
  ];
  var gap=12, cardW=(W-2*M-gap*3)/4;
  cards.forEach(function(card, i){
    var x = M+i*(cardW+gap);
    doc.setDrawColor(227,232,237); doc.setLineWidth(0.75);
    doc.roundedRect(x, y, cardW, 54, 7, 7);
    doc.setFont('helvetica','bold'); doc.setFontSize(13.5);
    doc.setTextColor(card[2][0],card[2][1],card[2][2]);
    doc.text(card[0], x+cardW/2, y+24, {align:'center'});
    doc.setFont('helvetica','bold'); doc.setFontSize(6.8);
    doc.setTextColor(122,135,148);
    doc.text(String(card[1]).toUpperCase(), x+cardW/2, y+40, {align:'center', maxWidth:cardW-10});
  });
  y += 54+24;
  var body = fac.map(function(f){
    var e = cpEstatFactura(f);
    var label = cpEstatLabel(e);
    return [f.num, CP_FD(f.fecha), CP_FD(f.venc), CP_EUR(f.total), label];
  });
  var colores = fac.map(function(f){
    var e=cpEstatFactura(f);
    return e==='pagada'?[11,114,86]:e==='vencida'?[140,40,30]:[138,89,0];
  });
  doc.autoTable({
    startY:y,
    head:[[cpT('t833'), cpT('t834'), cpT('t835'), cpT('t791'), cpT('t836')]],
    body: body,
    theme:'plain',
    margin:{left:M, right:M, bottom:34},
    styles:{font:'helvetica', fontSize:8.5, textColor:[22,35,46], lineColor:[237,241,244], lineWidth:0.4, cellPadding:{top:6,bottom:6,left:8,right:8}},
    headStyles:{fillColor:[11,61,107], textColor:255, fontStyle:'bold', fontSize:8, halign:'left'},
    alternateRowStyles:{fillColor:[247,249,251]},
    columnStyles:{0:{cellWidth:'auto'},1:{cellWidth:66},2:{cellWidth:66},3:{cellWidth:70,halign:'right',fontStyle:'bold'},4:{cellWidth:70}},
    didParseCell: function(data){
      if (data.section==='body' && data.column.index===4){
        var col = colores[data.row.index];
        if (col){ data.cell.styles.textColor = col; data.cell.styles.fontStyle='bold'; }
      }
    }
  });
  var total = doc.internal.getNumberOfPages();
  for (var i=1;i<=total;i++){
    doc.setPage(i);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
    doc.setTextColor(148,163,176);
    doc.text('HIGIENEX S.L. \u00b7 '+cpT('t838')+' \u00b7 '+new Date().toLocaleString(cpLang()), W/2, 820, {align:'center'});
  }
  doc.save('extracte-de-compte.pdf');
}
window.cpDescarregarExtracte = cpDescarregarExtracte;


function cpDescarregarFactura(num){
  if (window.HXPDF_DOCS && HXPDF.disponible()) return HXPDF_DOCS.factura(num);
  var f=CP_DB.facturas.find(function(x){return x.num===num;}); if(!f) return;
  var c=CP_DB.cliente;
  var e=cpEstatFactura(f);
  var estatColor = e==='pagada'?[11,114,86]:e==='vencida'?[140,40,30]:[140,89,0];
  var estatBg = e==='pagada'?[229,243,238]:e==='vencida'?[247,230,228]:[247,240,224];
  var estatLabel = cpEstatLabel(e).toUpperCase();
  if (typeof window.jspdf === 'undefined') { showToast('No se ha podido cargar el generador de PDF.', '⚠️'); return; }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  var M=42, W=595.28, H=841.89;
  doc.setFillColor(11,61,107); doc.rect(0,0,6,H,'F');
  var y=46;
  doc.setFont('times','bold'); doc.setFontSize(21);
  doc.setTextColor(11,61,107);
  doc.text('HIGIENE', M, y);
  var w1=doc.getTextWidth('HIGIENE');
  doc.setTextColor(242,169,0);
  doc.text('X', M+w1, y);
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  doc.setTextColor(122,135,148);
  doc.text('HIGIENEX S.L. \u00b7 CIF B12345678', M, y+14);
  doc.text('Carrer de la Ind\u00fastria, 25 \u00b7 46010 Val\u00e8ncia', M, y+24);
  doc.text('contacto@higienexvalencia.es \u00b7 631 706 398', M, y+34);
  doc.setFont('times','bold'); doc.setFontSize(16);
  doc.setTextColor(22,35,46);
  doc.text(cpT('t795'), W-M, y-4, {align:'right'});
  doc.setFont('helvetica','bold'); doc.setFontSize(10.5);
  doc.setTextColor(11,61,107);
  doc.text(num, W-M, y+10, {align:'right'});
  doc.setFont('helvetica','bold'); doc.setFontSize(8);
  var pillW=doc.getTextWidth(estatLabel)+16;
  doc.setFillColor(estatBg[0],estatBg[1],estatBg[2]);
  doc.roundedRect(W-M-pillW, y+16, pillW, 15, 7.5,7.5,'F');
  doc.setTextColor(estatColor[0],estatColor[1],estatColor[2]);
  doc.text(estatLabel, W-M-pillW/2, y+26, {align:'center'});
  y += 48;
  doc.setDrawColor(22,35,46); doc.setLineWidth(2);
  doc.line(M, y, W-M, y);
  y += 22;
  var colW=(W-2*M)/3;
  function metaItem(label, value, x){
    doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
    doc.setTextColor(122,135,148);
    doc.text(String(label).toUpperCase(), x, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(10);
    doc.setTextColor(22,35,46);
    doc.text(String(value), x, y+13);
  }
  metaItem(cpT('t799'), CP_FD(f.fecha), M);
  metaItem(cpT('t800'), CP_FD(f.venc), M+colW);
  metaItem(cpT('t801'), cpT('t802'), M+colW*2);
  y += 34;
  var boxW=(W-2*M-18)/2, boxH=80;
  function infoBox(x, titulo, lineas){
    doc.setDrawColor(227,232,237); doc.setLineWidth(0.75);
    doc.roundedRect(x, y, boxW, boxH, 6, 6);
    doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
    doc.setTextColor(184,134,11);
    doc.text(String(titulo).toUpperCase(), x+14, y+16);
    var ty=y+31;
    lineas.forEach(function(l, i){
      doc.setFont('helvetica', i===0?'bold':'normal');
      doc.setFontSize(i===0?10.5:9);
      if (i===0) doc.setTextColor(22,35,46); else doc.setTextColor(51,66,79);
      doc.text(String(l||'\u2014'), x+14, ty);
      ty += i===0?15:12;
    });
  }
  infoBox(M, cpT('t786'), [c.nom, 'NIF: '+(c.nif||'\u2014'), c.dir||'\u2014', c.pob||'\u2014', (c.mail||'')+' \u00b7 '+(c.tel||'')]);
  infoBox(M+boxW+18, cpT('t787'), ['HIGIENEX S.L.','CIF: B12345678','Carrer de la Ind\u00fastria, 25','46010 Val\u00e8ncia (Val\u00e8ncia)','contacto@higienexvalencia.es']);
  y += boxH + 20;
  var body=(f.lineas||[]).map(function(l){
    var p=CP_DB.productos[l.art];
    var nomProd=l.nom || (p?p.nom:l.art);
    return [nomProd, CP_NUM(l.cant), CP_EUR(l.precio), CP_EUR(l.cant*l.precio)];
  });
  doc.autoTable({
    startY:y,
    head:[[cpT('t788'), cpT('t789'), cpT('t790'), cpT('t791')]],
    body: body,
    theme:'plain',
    margin:{left:M, right:M},
    styles:{font:'helvetica', fontSize:9, textColor:[22,35,46], lineColor:[237,241,244], lineWidth:0.4, cellPadding:{top:6,bottom:6,left:8,right:8}},
    headStyles:{fillColor:[11,61,107], textColor:255, fontStyle:'bold', fontSize:8, halign:'left'},
    alternateRowStyles:{fillColor:[247,249,251]},
    columnStyles:{0:{cellWidth:'auto'},1:{cellWidth:56,halign:'right'},2:{cellWidth:68,halign:'right'},3:{cellWidth:78,halign:'right',fontStyle:'bold',textColor:[11,61,107]}}
  });
  y = doc.lastAutoTable.finalY + 20;
  if (y > H - 170) { doc.addPage(); y = 46; }
  var totW=220, totX=W-M-totW;
  doc.setDrawColor(227,232,237); doc.setLineWidth(0.75);
  doc.roundedRect(totX, y, totW, 76, 8, 8);
  doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
  doc.setTextColor(74,90,106);
  doc.text(cpT('t792'), totX+14, y+18);
  doc.text(CP_EUR(f.base), totX+totW-14, y+18, {align:'right'});
  doc.text(cpT('t793'), totX+14, y+34);
  doc.text(CP_EUR(f.cuota), totX+totW-14, y+34, {align:'right'});
  doc.setFillColor(11,61,107);
  doc.rect(totX, y+44, totW, 32, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.setTextColor(191,212,232);
  doc.text(String(cpT('t794')).toUpperCase(), totX+14, y+64);
  doc.setFont('times','bold'); doc.setFontSize(15);
  doc.setTextColor(255,255,255);
  doc.text(CP_EUR(f.total), totX+totW-14, y+64, {align:'right'});
  y += 76 + 20;
  var payTxt = cpT('t803')+' ES21 2100 4455 6612 3456 7890 (CaixaBank) \u2014 '+cpT('t804');
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
  var payLines = doc.splitTextToSize(payTxt, W-2*M-28);
  var payH = payLines.length*11+16;
  doc.setFillColor(247,249,251);
  doc.roundedRect(M, y, W-2*M, payH, 6, 6, 'F');
  doc.setTextColor(22,35,46);
  doc.text(payLines, M+14, y+16);
  y += payH + 16;
  (function(){ var vr=HXVF.cadena(CP_DB.facturas).map[num]; if(vr) y=HXVF.bloquePDF(doc, vr, M, W, H, y, cpVFLang()); })();
  doc.setDrawColor(227,232,237); doc.setLineWidth(0.5);
  doc.line(M, y, W-M, y);
  y += 12;
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
  doc.setTextColor(148,163,176);
  doc.text('HIGIENEX S.L. \u00b7 '+cpT('t805')+' \u00b7 '+new Date().toLocaleString(cpLang()), W/2, y, {align:'center'});
  doc.save('factura-'+num+'.pdf');
}
window.cpDescarregarFactura=cpDescarregarFactura;


function cpFidelitzacioHTML(){
  var fac=CP_DB.facturas;
  var totalHistoric=fac.reduce(function(s,f){return s+f.total;},0);
  var punts=Math.round(totalHistoric);
  var tiers=[
    {min:0, rate:0, key:'t910', icon:'🥉'},
    {min:1000, rate:0.05, key:'t911', icon:'🥈'},
    {min:3000, rate:0.10, key:'t912', icon:'🥇'},
    {min:7000, rate:0.15, key:'t913', icon:'💎'}
  ];
  var actual=tiers[0], seguent=null;
  for(var i=0;i<tiers.length;i++){
    if(punts>=tiers[i].min) actual=tiers[i];
  }
  for(var j=0;j<tiers.length;j++){
    if(tiers[j].min>punts){ seguent=tiers[j]; break; }
  }
  var estalvi=totalHistoric*actual.rate;
  var pct = seguent ? Math.min(100, Math.round((punts-actual.min)/(seguent.min-actual.min)*100)) : 100;
  var progresText = seguent
    ? '<div style="font-size:11.5px;color:var(--cp-muted,rgba(26,26,26,.55));margin-top:6px">'+cpT('t917')+' '+(seguent.min-punts)+' '+cpT('t918')+' '+cpT(seguent.key)+' '+seguent.icon+'</div>'
    : '<div style="font-size:11.5px;color:#0B7256;margin-top:6px;font-weight:600">'+cpT('t919')+'</div>';
  var savingsText = actual.rate>0
    ? '<p style="font-size:12.5px;color:var(--charcoal);margin:8px 0 0">'+cpT('t914')+' <b style="color:#0B7256">'+CP_EUR(estalvi)+'</b> '+cpT('t915')+'</p>'
    : '<p style="font-size:12.5px;color:var(--cp-muted,rgba(26,26,26,.55));margin:8px 0 0">'+cpT('t916')+'</p>';
  return '<div class="cp-card" style="max-width:560px;margin-top:20px">'+
    '<div class="cp-section-title">'+cpT('t908')+'</div>'+
    '<div style="display:flex;align-items:center;gap:14px;margin-top:8px">'+
      '<div style="font-size:34px">'+actual.icon+'</div>'+
      '<div style="flex:1"><div style="font-weight:700;font-size:15px;color:var(--charcoal)">'+cpT(actual.key)+'</div>'+
      '<div style="font-size:11.5px;color:var(--cp-muted,rgba(26,26,26,.55))">'+punts+' '+cpT('t909')+'</div></div>'+
    '</div>'+
    '<div style="background:#E8ECEF;border-radius:20px;height:8px;margin-top:12px;overflow:hidden"><div style="background:linear-gradient(90deg,var(--green-deep),var(--accent));width:'+pct+'%;height:100%"></div></div>'+
    progresText+savingsText+
  '</div>';
}

function cpViewEmpresa(){
  var c=CP_DB.cliente;
  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>'+cpT('t720')+'</h2><p>'+cpT('t807')+'</p></div></div>'+
    '<div class="cp-card" style="max-width:560px">'+
      '<div class="cp-info-row"><span>'+cpT('t808')+'</span><span>'+escHtml(c.nom)+'</span></div>'+
      '<div class="cp-info-row"><span>CIF/NIF</span><span>'+escHtml(c.nif||'—')+'</span></div>'+
      '<div class="cp-info-row"><span>'+cpT('t809')+'</span><span>'+escHtml(c.mail||'—')+'</span></div>'+
      '<div class="cp-info-row"><span>'+cpT('t810')+'</span><span>'+escHtml(c.tel||'—')+'</span></div>'+
      '<div class="cp-info-row"><span>'+cpT('t811')+'</span><span>'+escHtml(c.dir||'—')+'</span></div>'+
      '<div class="cp-info-row"><span>'+cpT('t812')+'</span><span>'+escHtml(c.pob||'—')+'</span></div>'+
      '<div class="cp-info-row"><span>'+cpT('t813')+'</span><span>'+(c.cond?c.cond+' '+cpT('t814'):cpT('t815'))+'</span></div>'+
      '<button class="cp-btn ghost" style="margin-top:16px" type="button" onclick="alert(\''+cpT('t817').replace(/'/g,"\\'")+'\')">'+cpT('t816')+'</button>'+
    '</div>'+
    cpFidelitzacioHTML();
}

function cpRolColor(rol){ return rol==='admin' ? '#0B3D6B' : rol==='comprador' ? '#0B7256' : '#8A5900'; }
function cpViewEquip(){
  var team = CP_DB.cliente.team || [];
  var esAdmin = CP_CURRENT_USER && CP_CURRENT_USER.rol === 'admin';
  var files = team.map(function(m){
    var esJoMateix = CP_CURRENT_USER && m.id === CP_CURRENT_USER.id;
    return '<div class="cp-info-row" style="align-items:center">'+
      '<span><b>'+escHtml(m.nom)+'</b>'+(esJoMateix?' <span style="color:var(--cp-muted,#888);font-size:11px">(tu)</span>':'')+
        '<br><span style="font-size:11.5px;color:var(--cp-muted,#888)">'+escHtml(m.email)+'</span></span>'+
      '<span style="display:flex;align-items:center;gap:10px">'+
        '<span class="cp-tag" style="color:'+cpRolColor(m.rol)+';border-color:'+cpRolColor(m.rol)+'55;background:'+cpRolColor(m.rol)+'14">'+escHtml(cpNomRol(m.rol))+'</span>'+
        (esAdmin && !esJoMateix ? '<button type="button" class="cp-btn ghost" style="padding:5px 10px;font-size:11px" onclick="cpEliminarMembre(\''+m.id+'\')">Elimina</button>' : '')+
      '</span></div>';
  }).join('');
  var formConvidar = esAdmin ? (
    '<div class="cp-card" style="max-width:560px;margin-top:16px">'+
      '<div style="font-weight:700;color:var(--green-deep);margin-bottom:10px">➕ Convidar company</div>'+
      '<div class="frow" style="display:grid;gap:10px">'+
        '<input id="cpEquipNom" type="text" placeholder="Nom i cognoms" style="padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);font-size:0.85rem;">'+
        '<input id="cpEquipEmail" type="email" placeholder="Correu electrònic" style="padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);font-size:0.85rem;">'+
        '<select id="cpEquipRol" style="padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);font-size:0.85rem;">'+
          '<option value="comprador">Comprador (pot fer comandes)</option>'+
          '<option value="lector">Només lectura (només consulta)</option>'+
          '<option value="admin">Administrador (gestiona l\'equip)</option>'+
        '</select>'+
      '</div>'+
      '<button class="cp-btn" style="margin-top:12px" type="button" onclick="cpConvidarMembre()">Enviar invitació</button>'+
    '</div>'
  ) : '<p style="color:var(--cp-muted,#888);font-size:12.5px;margin-top:14px">Només un administrador pot convidar o eliminar membres de l\'equip.</p>';
  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>👥 Equip</h2><p>Persones amb accés al portal d\'aquesta empresa.</p></div></div>'+
    '<div class="cp-card" style="max-width:560px">'+files+'</div>'+
    formConvidar;
}
async function cpConvidarMembre(){
  if (!CP_CURRENT_USER || CP_CURRENT_USER.rol !== 'admin') { showToast('Només un administrador pot convidar membres.', '⚠️'); return; }
  var nom = (document.getElementById('cpEquipNom').value||'').trim();
  var email = (document.getElementById('cpEquipEmail').value||'').trim();
  var rol = document.getElementById('cpEquipRol').value;
  if (!nom || !email) { showToast('Falta el nom o el correu.', '⚠️'); return; }
  try {
    var r = await hxPortal('/team', { method: 'POST', body: { nom: nom, email: email, rol: rol } });
    cpAplicarPortal({ data: r.data, member: CP_CURRENT_USER });
    showToast(nom + ' convidat com a ' + cpNomRol(rol) + '. Usuari: ' + r.user + ' · Contrasenya provisional: ' + r.password, '✅');
  } catch(e) { showToast(e.message, '⚠️'); return; }
  cpGo('equip');
}
window.cpConvidarMembre = cpConvidarMembre;
async function cpEliminarMembre(id){
  if (!CP_CURRENT_USER || CP_CURRENT_USER.rol !== 'admin') { showToast('Només un administrador pot eliminar membres.', '⚠️'); return; }
  if (!confirm('Vols eliminar aquesta persona de l\'equip?')) return;
  try {
    var r = await hxPortal('/team?id=' + encodeURIComponent(id), { method: 'DELETE' });
    cpAplicarPortal({ data: r.data, member: CP_CURRENT_USER });
    showToast('Membre eliminat de l\'equip.', '🗑️');
  } catch(e) { showToast(e.message, '⚠️'); return; }
  cpGo('equip');
}
window.cpEliminarMembre = cpEliminarMembre;

// ── Impacte ambiental personalitzat, calculat a partir de les comandes reals del client ──
function hxCalcularImpacteCliente() {
  var envasosEvitats = 0, litresConcentratComprats = 0;
  (CP_DB.comandes || []).forEach(function(c){
    (c.lineas || []).forEach(function(l){
      var mapa = CP_PRODUCT_MAP[l.nom];
      var nomCanonic = mapa ? mapa.nom : l.nom;
      var info = (typeof CMP_DATA !== 'undefined') ? CMP_DATA[nomCanonic] : null;
      var ratio = info ? hxParseRatioDilucio(info.concentracio) : null;
      if (ratio && ratio > 1) {
        envasosEvitats += l.cant * (ratio - 1);
        litresConcentratComprats += l.cant * 5;
      }
    });
  });
  var kgPlasticEvitat = envasosEvitats * 0.15;
  var kgCo2Evitat = envasosEvitats * 0.4;
  return {
    envasosEvitats: Math.round(envasosEvitats),
    kgPlasticEvitat: kgPlasticEvitat,
    kgCo2Evitat: kgCo2Evitat,
    litresConcentratComprats: Math.round(litresConcentratComprats)
  };
}
window.hxCalcularImpacteCliente = hxCalcularImpacteCliente;

function cpViewImpacte(){
  var d = hxCalcularImpacteCliente();
  var c = CP_DB.cliente;
  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>🌱 '+cpT('t958')+'</h2><p>'+cpT('t959')+'</p></div></div>'+
    (d.envasosEvitats > 0 ? (
      '<div class="cp-kpis" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.4rem;">'+
        '<div class="cp-card" style="text-align:center;padding:1.4rem;"><div style="font-size:1.9rem;font-weight:800;color:var(--green-deep,#0B3D6B);">'+d.envasosEvitats.toLocaleString('ca-ES')+'</div><div style="font-size:0.8rem;color:var(--cp-muted,#888);margin-top:0.3rem;">'+cpT('t960')+'</div></div>'+
        '<div class="cp-card" style="text-align:center;padding:1.4rem;"><div style="font-size:1.9rem;font-weight:800;color:var(--green-deep,#0B3D6B);">'+d.kgPlasticEvitat.toLocaleString('ca-ES',{maximumFractionDigits:1})+' kg</div><div style="font-size:0.8rem;color:var(--cp-muted,#888);margin-top:0.3rem;">'+cpT('t961')+'</div></div>'+
        '<div class="cp-card" style="text-align:center;padding:1.4rem;"><div style="font-size:1.9rem;font-weight:800;color:var(--green-deep,#0B3D6B);">'+d.kgCo2Evitat.toLocaleString('ca-ES',{maximumFractionDigits:1})+' kg</div><div style="font-size:0.8rem;color:var(--cp-muted,#888);margin-top:0.3rem;">'+cpT('t962')+'</div></div>'+
      '</div>'+
      '<div class="cp-card" style="max-width:560px;">'+
        '<p style="font-size:0.85rem;color:var(--cp-muted,#888);margin-bottom:1rem;">'+cpT('t963')+'</p>'+
        '<button class="cp-btn" type="button" onclick="cpDescarregarCertificatImpacte()">📜 '+cpT('t964')+'</button>'+
      '</div>'
    ) : (
      '<div class="cp-card" style="max-width:560px;text-align:center;padding:2rem;color:var(--cp-muted,#888);font-size:0.88rem;">'+cpT('t965')+'</div>'
    ));
}
window.cpViewImpacte = cpViewImpacte;

function cpDescarregarCertificatImpacte(){
  if (window.HXPDF_DOCS && HXPDF.disponible()) return HXPDF_DOCS.certificatImpacte();
  var d = hxCalcularImpacteCliente();
  var c = CP_DB.cliente;
  var data = new Date().toLocaleDateString('ca-ES', {year:'numeric', month:'long', day:'numeric'});
  if (typeof window.jspdf === 'undefined') { showToast('No se ha podido cargar el generador de PDF.', '⚠️'); return; }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  var W=595.28, H=841.89, cx=W/2;
  doc.setFillColor(237,234,226); doc.rect(0,0,W,H,'F');
  var sheetX=58, sheetY=64, sheetW=W-116, sheetH=470;
  doc.setFillColor(255,255,255);
  doc.roundedRect(sheetX, sheetY, sheetW, sheetH, 14, 14, 'F');
  doc.setFillColor(46,125,50);
  doc.rect(sheetX, sheetY, sheetW, 6, 'F');
  var y = sheetY+58;
  doc.setFont('times','bold'); doc.setFontSize(22);
  doc.setTextColor(11,61,107);
  var wH=doc.getTextWidth('HIGIENE');
  doc.text('HIGIENE', cx-wH/2, y);
  doc.setTextColor(242,169,0);
  doc.text('X', cx-wH/2+wH, y);
  y += 26;
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5);
  doc.setTextColor(46,125,50);
  doc.text('CERTIFICAT D\'IMPACTE AMBIENTAL', cx, y, {align:'center', charSpace:0.6});
  y += 22;
  doc.setFont('times','bold'); doc.setFontSize(19);
  doc.setTextColor(22,35,46);
  doc.text('Gr\u00e0cies per triar HIGIENEX ECO', cx, y, {align:'center'});
  y += 20;
  doc.setFont('helvetica','normal'); doc.setFontSize(11);
  doc.setTextColor(85,85,85);
  doc.text('Em\u00e8s per a '+c.nom+' \u00b7 '+data, cx, y, {align:'center'});
  y += 44;
  var stats = [
    [d.envasosEvitats.toLocaleString('ca-ES'), 'ENVASOS EVITATS'],
    [d.kgPlasticEvitat.toLocaleString('ca-ES',{maximumFractionDigits:1})+' kg', 'PL\u00c0STIC EVITAT'],
    [d.kgCo2Evitat.toLocaleString('ca-ES',{maximumFractionDigits:1})+' kg', 'CO2 EVITAT (EST.)']
  ];
  var statW=140;
  var startX = cx - (statW*3)/2;
  stats.forEach(function(s, i){
    var sx = startX + i*statW + statW/2;
    doc.setFont('times','bold'); doc.setFontSize(27);
    doc.setTextColor(46,125,50);
    doc.text(s[0], sx, y, {align:'center'});
    doc.setFont('helvetica','bold'); doc.setFontSize(8);
    doc.setTextColor(136,136,136);
    doc.text(s[1], sx, y+18, {align:'center'});
  });
  y += 56;
  doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.setTextColor(153,153,153);
  var noteLines = doc.splitTextToSize('C\u00e0lcul basat en l\'historial real de comandes de productes concentrats HIGIENEX enfront de l\'equivalent en producte ja dilu\u00eft. Xifres orientatives amb finalitat informativa i de comunicaci\u00f3 de sostenibilitat.', sheetW-100);
  doc.text(noteLines, cx, y, {align:'center'});
  y += noteLines.length*12 + 26;
  doc.setDrawColor(238,238,238); doc.setLineWidth(0.75);
  doc.line(sheetX+40, y, sheetX+sheetW-40, y);
  y += 18;
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
  doc.setTextColor(170,170,170);
  doc.text('HIGIENEX S.L. \u00b7 Carrer de la Ind\u00fastria, 25 \u00b7 46010 Val\u00e8ncia \u00b7 higienexvalencia.es', cx, y, {align:'center'});
  doc.save('certificat-impacte-higienex.pdf');
}
window.cpDescarregarCertificatImpacte = cpDescarregarCertificatImpacte;


// ── Programa de referits entre empreses ──
function hxCodiReferit() {
  var c = CP_CURRENT_USER || CP_DB.cliente;
  var base = (c.nom || 'HX').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'HX';
  return 'HX-' + base + '-2026';
}
window.hxCodiReferit = hxCodiReferit;
function hxEnllacReferit() {
  var url = window.location.origin + window.location.pathname;
  return url + '?ref=' + encodeURIComponent(hxCodiReferit());
}
window.hxEnllacReferit = hxEnllacReferit;
function hxLlistaReferits() {
  try { var raw = localStorage.getItem('hx_referits_fets'); return raw ? JSON.parse(raw) : []; }
  catch(e) { return []; }
}
function hxGuardarReferits(list) {
  try { localStorage.setItem('hx_referits_fets', JSON.stringify(list)); } catch(e) {}
}

function cpViewReferits(){
  var enllac = hxEnllacReferit();
  var referits = hxLlistaReferits();
  var filesReferits = referits.map(function(r){
    var fet = r.estat === 'Primera comanda feta';
    var estatColor = fet ? '#0B7256' : '#8A5900';
    var estatBg = fet ? '#E5F3EE' : '#F7F0E0';
    return '<div class="cp-info-row"><span><b>'+escHtml(r.empresa)+'</b><br><span style="font-size:11.5px;color:var(--cp-muted,#888)">'+escHtml(r.data)+'</span></span>'+
      '<span class="cp-tag" style="color:'+estatColor+';border-color:'+estatColor+'55;background:'+estatBg+'">'+escHtml(r.estat)+'</span></div>';
  }).join('');
  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>🎁 '+cpT('t966')+'</h2><p>'+cpT('t967')+'</p></div></div>'+
    '<div class="cp-card" style="max-width:560px;margin-bottom:16px;">'+
      '<div style="font-weight:700;color:var(--green-deep);margin-bottom:10px;">'+cpT('t968')+'</div>'+
      '<div style="display:flex;gap:8px;align-items:center;background:var(--warm-white,#FAF7F0);border-radius:10px;padding:0.7rem 0.9rem;margin-bottom:14px;">'+
        '<code id="cpReferralLink" style="flex:1;font-size:12px;color:var(--green-deep);overflow-x:auto;white-space:nowrap;">'+escHtml(enllac)+'</code>'+
        '<button type="button" class="cp-btn" style="padding:6px 12px;font-size:12px;white-space:nowrap;" onclick="cpCopiarEnllacReferit()">📋 '+cpT('t969')+'</button>'+
      '</div>'+
      '<div style="font-size:12.5px;color:var(--cp-muted,#888);margin-bottom:16px;">'+cpT('t970')+'</div>'+
      '<div style="font-weight:700;color:var(--green-deep);margin:16px 0 10px;">'+cpT('t971')+'</div>'+
      '<div style="display:grid;gap:10px;">'+
        '<input id="refEmpresaNom" type="text" placeholder="'+cpT('t972')+'" style="padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);font-size:0.85rem;">'+
        '<input id="refEmpresaEmail" type="email" placeholder="'+cpT('t973')+'" style="padding:0.6rem;border-radius:8px;border:1.5px solid var(--border);font-size:0.85rem;">'+
      '</div>'+
      '<button class="cp-btn" style="margin-top:12px;" type="button" onclick="cpEnviarReferit()">'+cpT('t974')+'</button>'+
    '</div>'+
    '<div class="cp-card" style="max-width:560px;">'+
      '<div style="font-weight:700;color:var(--green-deep);margin-bottom:10px;">'+cpT('t975')+'</div>'+
      (filesReferits || '<p style="color:var(--cp-muted,#888);font-size:12.5px;">'+cpT('t976')+'</p>')+
    '</div>';
}
window.cpViewReferits = cpViewReferits;

function cpCopiaFallback(text) {
  var el = document.getElementById('cpReferralLink');
  if (el) {
    var range = document.createRange();
    range.selectNode(el);
    var sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range);
    try { document.execCommand('copy'); showToast(cpT('t977'), '✅'); } catch(e) {}
    sel.removeAllRanges();
  }
}
function cpCopiarEnllacReferit() {
  var text = hxEnllacReferit();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function(){ showToast(cpT('t977'), '✅'); }).catch(function(){ cpCopiaFallback(text); });
  } else {
    cpCopiaFallback(text);
  }
}
window.cpCopiarEnllacReferit = cpCopiarEnllacReferit;

function cpEnviarReferit() {
  var nomEl = document.getElementById('refEmpresaNom');
  var emailEl = document.getElementById('refEmpresaEmail');
  var nom = (nomEl.value || '').trim();
  var email = (emailEl.value || '').trim();
  if (!nom || !email) { showToast(cpT('t978'), '⚠️'); return; }
  var c = CP_CURRENT_USER || CP_DB.cliente;
  try {
    enviarNotificacioEmail({
      title: 'Nova recomanació d\'empresa: ' + nom + ' — HIGIENEX',
      name: c.nom,
      email: email,
      badge: 'RECOMANACIÓ',
      subtitle: c.nom + ' ha recomanat HIGIENEX a una altra empresa.',
      detailLabel: 'Dades de la recomanació',
      message: 'Empresa recomanada: ' + nom + '\nEmail de contacte: ' + email + '\nRecomanada per: ' + c.nom + ' (' + (c.email||c.mail||'') + ')\nCodi de referit: ' + hxCodiReferit(),
      ctaButtonHtml: hxEmailCtaButton('Contactar amb l\'empresa →', 'mailto:' + email, 'gold'),
      data: { event: 'recomanacio', contact: { email: email }, recommender: c.nom, extra: nom,
        fields: [['Empresa recomanada', nom], ['Correu de contacte', email], ['Recomanada per', c.nom + ((c.email||c.mail) ? ' (' + (c.email||c.mail) + ')' : '')], ['Codi de referit', hxCodiReferit()]] }
    });
  } catch(err) { console.warn('No s\'ha pogut enviar la recomanació:', err); }
  var referits = hxLlistaReferits();
  referits.unshift({empresa: nom, data: new Date().toISOString().slice(0,10), estat: 'Pendent'});
  hxGuardarReferits(referits);
  nomEl.value = ''; emailEl.value = '';
  showToast(cpT('t979'), '🎁');
  cpGo('referits');
}
window.cpEnviarReferit = cpEnviarReferit;

function hxDetectarReferit() {
  try {
    var params = new URLSearchParams(window.location.search);
    // Els QR antics de producte portaven ?producte=…&ref=REFERÈNCIA: aquest
    // "ref" és el codi de l'article, no un codi de recomanació.
    var ref = params.get('producte') ? null : params.get('ref');
    if (ref) {
      localStorage.setItem('hx_ref_code_actiu', ref);
      var banner = document.getElementById('hxRefBanner');
      var text = document.getElementById('hxRefBannerText');
      if (banner && text) {
        text.textContent = cpT('t980');
        banner.style.display = 'flex';
      }
    }
  } catch(e) {}
}
document.addEventListener('DOMContentLoaded', hxDetectarReferit);

// ── QR de producte generat a l'ERP: ?producte=Nom&art=REF ─────────
// Obre la fitxa del producte quan l'usuari entra a la web. Els noms de
// l'ERP porten el format (p. ex. "Net HOSTAL 5 L"), així que es busca el
// producte de la web que més s'hi assembla.
(function(){
  var q; try { q = new URLSearchParams(location.search); } catch(e) { return; }
  var nom = q.get('producte'); if (!nom) return;
  function norm(s) {
    return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/\(web\)/g,' ').replace(/\b\d+([.,]\d+)?\s*(l|ml|kg|g)\b/g,' ')
      .replace(/[^a-z0-9-]+/g,' ').replace(/\s+/g,' ').trim();
  }
  function buscar() {
    var n = norm(nom), toks = n.split(' ').filter(function(x){ return x.length >= 3; });
    var best = null, bs = 0;
    Object.keys(PRODUCT_INFO || {}).forEach(function(k){
      var kn = ' ' + norm(k) + ' ', s = 0;
      if (kn.trim() === n) s = 999;
      else toks.forEach(function(tk){ if (kn.indexOf(' ' + tk + ' ') >= 0) s += tk.length; });
      if (s > bs) { bs = s; best = k; }
    });
    return bs >= 4 ? best : null;
  }
  function obrir() {
    var p = buscar();
    if (p) {
      obrirFitxaProducte(p);
      setTimeout(function(){ var el = document.getElementById('fpName'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 350);
      return;
    }
    navTo('productes');
    var s = document.getElementById('catalogSearch');
    if (s) { s.value = norm(nom).split(' ')[0] || ''; filterCatalog(s.value); }
  }
  function esperar() {
    var sp = document.getElementById('splashScreen');
    var splashVisible = sp && getComputedStyle(sp).display !== 'none';
    if (splashVisible || window._hgCookiesPending) { setTimeout(esperar, 400); return; }
    obrir();
  }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(esperar, 800); });
  window.hxQrProducte = buscar;
})();
function hxCodiReferitActiu() {
  try { return localStorage.getItem('hx_ref_code_actiu') || ''; } catch(e) { return ''; }
}
window.hxCodiReferitActiu = hxCodiReferitActiu;

function cpViewSuport(){
  return ''+
    '<div class="cp-topbar"><div class="cp-greet"><h2>'+cpT('t818')+'</h2><p>'+cpT('t819')+'</p></div></div>'+
    '<div class="cp-support-grid">'+
      '<div class="cp-support-card" onclick="window.open(\'mailto:contacto@higienexvalencia.es\')"><div class="ic">📧</div><b>'+cpT('t820')+'</b><span>contacto@higienexvalencia.es</span></div>'+
      '<div class="cp-support-card" onclick="window.open(\'tel:631706398\')"><div class="ic">📞</div><b>'+cpT('t821')+'</b><span>631 706 398</span></div>'+
      '<div class="cp-support-card" onclick="alert(\''+cpT('t824').replace(/'/g,"\\'")+'\')"><div class="ic">💬</div><b>'+cpT('t822')+'</b><span>'+cpT('t823')+'</span></div>'+
      '<div class="cp-support-card" onclick="cpGoFaq()"><div class="ic">❓</div><b>'+cpT('t825')+'</b><span>'+cpT('t826')+'</span></div>'+
    '</div>';
}


// Plantilla SEPARADA només per a l'avís intern de comandes noves (amb el
// botó blau cap al ERP). Un cop la creïs a EmailJS, enganxa aquí el seu ID.
var EMAILJS_TEMPLATE_ID_COMANDA = 'comanda'; // tipus d'email per al servidor
// El destinatari dels avisos està fixat dins de la plantilla d'EmailJS (no es posa aquí).
var NOTIFY_EMAIL = '';
// URL del panell intern (ERP). Actualitza-la quan migris el panell a
// Cloudflare Pages amb el seu propi domini protegit.
var HX_ERP_URL = 'https://higienexweb2.ossama450298.workers.dev/erp/';

// Envia un email a través del servidor. kind: 'aviso', 'comanda' o 'pressupost'.
function hxNotify(kind, params){
  return fetch(HX_API_BASE + '/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind: kind, params: params }) })
    .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(d){ if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; }); });
}
window.hxNotify = hxNotify;

function enviarNotificacioEmail(opts) {
  opts = opts || {};
  var params = {
    title: opts.title || '',
    name: opts.name || '',
    message: opts.message || '',
    email: opts.email || NOTIFY_EMAIL,
    time: new Date().toLocaleString('ca-ES'),
    badge: opts.badge || 'NOU AVÍS',
    subtitle: opts.subtitle || 'S\'ha registrat automàticament aquesta informació des de la web.',
    detail_label: opts.detailLabel || 'Detall',
    erp_url: HX_ERP_URL
  };
  if (opts.data) { try { params.data = JSON.stringify(opts.data); } catch(e) {} }
  var kind = opts.templateId === EMAILJS_TEMPLATE_ID_COMANDA ? 'comanda' : 'aviso';
  hxNotify(kind, params).then(function(){
    // Notificació enviada correctament
  }).catch(function(err){
    console.warn('No s\'ha pogut enviar la notificació per email:', err);
  });
}
window.enviarNotificacioEmail = enviarNotificacioEmail;

// Genera el bloc HTML d'un botó d'acció per als emails (mateix estil que
// la plantilla d'EmailJS espera). 'style' és 'gold' (respondre a un lead)
// o 'blue' (accions internes, com gestionar una comanda al panell).
function hxEmailCtaButton(label, url, style) {
  var bg = style === 'blue' ? '#0B3D6B' : '#F2A900';
  var color = style === 'blue' ? '#ffffff' : '#1A1A1A';
  var shadow = style === 'blue' ? 'rgba(11,61,107,0.35)' : 'rgba(242,169,0,0.35)';
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 34px;">' +
    '<tr><td style="background-color:' + bg + ';border-radius:12px;box-shadow:0 10px 24px ' + shadow + ';">' +
    '<a href="' + url + '" style="display:inline-block;padding:14px 30px;font-size:14px;font-weight:800;color:' + color + ';text-decoration:none;">' + label + '</a>' +
    '</td></tr></table>';
}

// Petita utilitat per evitar que text escrit per l'usuari (formulari de
// contacte) trenqui l'HTML de l'email o hi injecti codi.
function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
  });
}

// ── SPLASH ───────────────────────────────────────
var _hgCookieTimer = null;
// ── WhatsApp: missatge predefinit segons la secció on estàs ──────
var WA_SECTION_MSG = {
  productes: 'Hola HIGIENEX! Tinc una consulta sobre els vostres productes.',
  casos: 'Hola HIGIENEX! Tinc una consulta sobre els vostres productes.',
  contacte: 'Hola HIGIENEX! M\'agradaria posar-me en contacte amb vosaltres.',
  faq: 'Hola HIGIENEX! Tinc un dubte que no he trobat a les preguntes freqüents.',
  rd: 'Hola HIGIENEX! Tinc una consulta sobre R+D o innovació.',
  innovacio: 'Hola HIGIENEX! Tinc una consulta sobre R+D o innovació.',
  logistica: 'Hola HIGIENEX! Tinc una consulta sobre logística o enviaments.',
  sostenibilitat: 'Hola HIGIENEX! Tinc una consulta sobre sostenibilitat.',
  rsc: 'Hola HIGIENEX! Tinc una consulta sobre sostenibilitat.',
  clients: 'Hola HIGIENEX! M\'agradaria saber-ne més sobre treballar amb vosaltres.'
};
var WA_DEFAULT_MSG = 'Hola HIGIENEX';
function updateWhatsappContext() {
  var btn = document.getElementById('whatsappBtn');
  if (!btn) return;
  var sections = Object.keys(WA_SECTION_MSG);
  var current = null;
  var viewportMid = window.innerHeight * 0.5;
  for (var i=0; i<sections.length; i++) {
    var el = document.getElementById(sections[i]);
    if (!el) continue;
    var r = el.getBoundingClientRect();
    if (r.top <= viewportMid && r.bottom >= viewportMid) { current = sections[i]; break; }
  }
  var msg = current ? WA_SECTION_MSG[current] : WA_DEFAULT_MSG;
  btn.href = 'https://wa.me/34631706398?text=' + encodeURIComponent(msg);
}
window.addEventListener('scroll', function(){
  window.requestAnimationFrame(updateWhatsappContext);
}, { passive: true });
window.addEventListener('load', updateWhatsappContext);

function enterWeb() {
  var splash = document.getElementById('splashScreen');
  if (splash) {
    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.5s ease';
    setTimeout(function() { splash.style.display = 'none'; splash.style.opacity = ''; }, 500);
  }
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  // Mostrar sempre l'avís de cookies en entrar. Evitem que es programi més
  // d'un cop (p. ex. si el clic i el touchend disparen enterWeb() dues
  // vegades seguides en mòbil), perquè no torni a aparèixer i a bloquejar
  // la pàgina més tard sense que l'usuari ho esperi.
  clearTimeout(_hgCookieTimer);
  _hgCookieTimer = setTimeout(function(){
    if (typeof hgInitCookies === 'function') hgInitCookies();
  }, 600);
}
window.enterWeb = enterWeb;

function goTop() {
  if (typeof navTo === 'function') navTo('home');
  window.scrollTo(0, 0);
}
window.goTop = goTop;

// iOS touch fix per al botó entrar (només toquem la pantalla, enterWeb ja és
// segur davant de crides duplicades gràcies al debounce de dalt)
document.addEventListener('DOMContentLoaded', function() {
  document.body.setAttribute('data-view','home');
  var splBtn = document.getElementById('splashBtn');
  if (splBtn) {
    splBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      enterWeb();
    }, { passive: false });
  }
  // Ja no hi ha pantalla de benvinguda: la web es mostra directament i
  // l'avís de cookies surt com una barra inferior que no bloqueja.
  var spl = document.getElementById('splashScreen'); if (spl) spl.style.display = 'none';
  document.body.style.overflow = '';
  setTimeout(function(){ if (typeof hgInitCookies === 'function') hgInitCookies(); }, 400);
  // Xarxa de seguretat: si per qualsevol motiu l'avís de cookies no s'ha
  // pogut mostrar uns segons després d'entrar (per exemple, per un error
  // de JavaScript en un altre punt de la pàgina), desbloquegem el scroll
  // perquè l'usuari no es quedi atrapat sense poder navegar ni veure cap avís.
  setTimeout(function(){
    var splash = document.getElementById('splashScreen');
    var modal = document.getElementById('hgCookieModal');
    var splashHidden = !splash || splash.style.display === 'none';
    var modalVisible = modal && modal.classList.contains('active');
    if (splashHidden && !modalVisible && document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }
  }, 4000);
});

// Funciones del menú
function toggleMenu() {
  var dd = document.getElementById('navDropdown');
  var bd = document.getElementById('navBackdrop');
  var icon = document.getElementById('menuIcon');
  if (!dd) return;
  var isOpen = dd.classList.contains('open');
  if (isOpen) {
    dd.classList.remove('open');
    if (bd) bd.classList.remove('open');
    if (icon) icon.textContent = '☰';
  } else {
    dd.classList.add('open');
    if (bd) bd.classList.add('open');
    if (icon) icon.textContent = '✕';
  }
}
window.toggleMenu = toggleMenu;

function navTo(id) {
  hxTrackPageView(id);
  hxSeccioURL(id);
  // Tancar el menú lateral
  var dd = document.getElementById('navDropdown');
  var bd = document.getElementById('navBackdrop');
  var icon = document.getElementById('menuIcon');
  if (dd) dd.classList.remove('open');
  if (bd) bd.classList.remove('open');
  if (icon) icon.textContent = '☰';

  // Amagar totes les pàgines de grup
  var pages = document.querySelectorAll('.hg-page');
  for (var i = 0; i < pages.length; i++) pages[i].classList.remove('hg-page-active');

  // INICI: vista neta amb hero + footer
  if (id === 'home' || id === 'inici') {
    document.body.setAttribute('data-view', 'home');
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  // Pàgina de grup: mostrar només la triada
  var page = document.getElementById('g-' + id);
  if (page) {
    document.body.setAttribute('data-view', 'page');
    page.classList.add('hg-page-active');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (id === 'newsletter' && typeof hxMaybeShowNewsletterPopup === 'function') {
      hxMaybeShowNewsletterPopup();
    }
    return;
  }

  // Sub-secció dins d'un grup
  var GROUP_OF = {
    sobre:'empresa', missio:'empresa', organitzacio:'empresa', rrhh:'empresa', casos:'empresa', treballa:'empresa',
    productes:'productes', rd:'productes', innovacio:'productes', digitalitzacio:'productes', futur:'productes',
    processos:'operacions', logistica:'operacions', internacionalitzacio:'operacions',
    sostenibilitat:'compromis', rsc:'compromis', clients:'compromis', marqueting:'compromis', competencia:'compromis', blog:'compromis',
    faq:'contacte', contacte:'contacte', cita:'contacte', calculadora:'productes', fidelitzacio:'contacte', garanties:'contacte', pressupost:'contacte', auditoria:'contacte'
  };
  var g = GROUP_OF[id];
  if (g) {
    var gp = document.getElementById('g-' + g);
    if (gp) {
      document.body.setAttribute('data-view', 'page');
      gp.classList.add('hg-page-active');
      setTimeout(function(){
        var sec = document.getElementById(id);
        if (sec) {
          var top = sec.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: top, behavior: 'auto' });
        }
      }, 100);
    }
  }
}
window.navTo = navTo;

// ── ENLLAÇ PROPI PER A CADA SECCIÓ (?seccio=productes) ─────────
// Cada secció té una adreça que es pot compartir i que surt al sitemap.xml.
// En obrir la web amb ?seccio=… es va directament a aquella secció.
var HX_SECCIONS_SENSE_URL = { fitxaproducte: 1 };
function hxSeccioValida(id) {
  if (!id || HX_SECCIONS_SENSE_URL[id] || !/^[a-z0-9-]{2,40}$/.test(id)) return false;
  if (document.getElementById('g-' + id)) return true;
  var el = document.getElementById(id);
  return !!(el && el.closest && el.closest('.hg-page'));
}
function hxSeccioURL(id) {
  try {
    var q = new URLSearchParams(location.search);
    q.delete('seccio');
    if (q.toString()) return; // enllaços especials (producte, verifactu…): no es toca l'adreça
    var base = location.pathname;
    var nova = (id === 'home' || id === 'inici' || !hxSeccioValida(id)) ? base : base + '?seccio=' + id;
    if (nova !== location.pathname + location.search) history.replaceState(history.state, '', nova + location.hash);
    var abs = 'https://ossama450298-commits.github.io/Higienexweb/' + (nova === base ? '' : '?seccio=' + id);
    var c = document.querySelector('link[rel="canonical"]'); if (c) c.setAttribute('href', abs);
    var og = document.querySelector('meta[property="og:url"]'); if (og) og.setAttribute('content', abs);
  } catch (e) {}
}
window.hxSeccioURL = hxSeccioURL;
(function(){
  var id; try { id = new URLSearchParams(location.search).get('seccio'); } catch(e) { return; }
  if (!id) return;
  function obrir(){ if (hxSeccioValida(id)) navTo(id); }
  if (document.readyState === 'complete') setTimeout(obrir, 50);
  else window.addEventListener('load', function(){ setTimeout(obrir, 50); });
})();

// ── CERCADOR GLOBAL (Ctrl+K) ──────────────────────────────────
var HX_SEARCH_INDEX = null;
function hxBuildSearchIndex(){
  var idx = [];
  // Productes
  if (typeof PRODUCTS !== 'undefined') {
    PRODUCTS.forEach(function(p){
      idx.push({ type:'Producte', icon:'🧴', title:p.name, sub:p.price.toFixed(2).replace('.', ',') + ' € / ' + p.unit,
        action:function(){ hxCloseSearch(); navTo('productes'); setTimeout(function(){ openProductPopup(p.name); }, 260); } });
    });
  }
  // Seccions principals (capçaleres h2 amb id de secció pare)
  document.querySelectorAll('section[id] > .container > h2, section[id] > h2').forEach(function(h){
    var sec = h.closest('section[id]');
    if (!sec || !sec.id) return;
    var text = h.textContent.trim();
    if (!text) return;
    idx.push({ type:'Secció', icon:'📍', title:text, sub:'', action:function(){ hxCloseSearch(); navTo(sec.id); } });
  });
  // Preguntes freqüents
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q span');
    if (!q) return;
    idx.push({ type:'FAQ', icon:'❓', title:q.textContent.trim(), sub:'',
      action:function(){ hxCloseSearch(); navTo('faq'); setTimeout(function(){
        if (!item.classList.contains('open')) toggleFaq(item.querySelector('.faq-q'));
        item.scrollIntoView({block:'center'});
      }, 260); } });
  });
  // Articles del blog
  document.querySelectorAll('.blog-card h3, .blog-card .blog-title').forEach(function(t){
    var text = t.textContent.trim();
    if (!text) return;
    idx.push({ type:'Blog', icon:'📰', title:text, sub:'', action:function(){ hxCloseSearch(); navTo('blog'); } });
  });
  return idx;
}
function hxOpenSearch(){
  if (!HX_SEARCH_INDEX) HX_SEARCH_INDEX = hxBuildSearchIndex();
  var ov = document.getElementById('hxSearchOverlay');
  if (!ov) return;
  ov.style.display = 'flex';
  var input = document.getElementById('hxSearchInput');
  if (input) { input.value = ''; setTimeout(function(){ input.focus(); }, 50); }
  hxRunSearch('');
}
window.hxOpenSearch = hxOpenSearch;
function hxCloseSearch(){
  var ov = document.getElementById('hxSearchOverlay');
  if (ov) ov.style.display = 'none';
}
window.hxCloseSearch = hxCloseSearch;
function hxRunSearch(query){
  var box = document.getElementById('hxSearchResults');
  if (!box || !HX_SEARCH_INDEX) return;
  var results = !query ? HX_SEARCH_INDEX.slice(0, 8) :
    HX_SEARCH_INDEX.filter(function(r){
      var hay = (r.title + ' ' + r.sub).toLowerCase();
      return hay.indexOf(query.toLowerCase()) !== -1;
    }).slice(0, 20);
  if (!results.length) {
    box.innerHTML = '<div style="padding:1.5rem 1rem;text-align:center;color:#8A9BAC;font-size:0.88rem;">Cap resultat per "' + escHtml(query) + '"</div>';
    return;
  }
  box.innerHTML = results.map(function(r, i){
    return '<button type="button" data-hxsr="' + i + '" style="display:flex;align-items:center;gap:0.7rem;width:100%;text-align:left;background:none;border:none;padding:0.65rem 0.7rem;border-radius:10px;cursor:pointer;font-family:Arial,sans-serif;">' +
      '<span style="font-size:1.15rem;flex-shrink:0;">' + r.icon + '</span>' +
      '<span style="flex:1;min-width:0;"><span style="display:block;font-weight:700;color:#0B2545;font-size:0.88rem;">' + escHtml(r.title) + '</span>' +
      (r.sub ? '<span style="display:block;font-size:0.75rem;color:#8A9BAC;">' + escHtml(r.sub) + '</span>' : '') + '</span>' +
      '<span style="font-size:0.68rem;color:#B7C2CD;text-transform:uppercase;flex-shrink:0;">' + r.type + '</span></button>';
  }).join('');
  Array.prototype.forEach.call(box.querySelectorAll('button[data-hxsr]'), function(btn){
    btn.onmouseenter = function(){ btn.style.background = '#F4F7FA'; };
    btn.onmouseleave = function(){ btn.style.background = 'none'; };
    btn.onclick = function(){ results[parseInt(btn.getAttribute('data-hxsr'), 10)].action(); };
  });
}
window.hxRunSearch = hxRunSearch;
document.addEventListener('keydown', function(e){
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    var ov = document.getElementById('hxSearchOverlay');
    if (ov && ov.style.display === 'flex') hxCloseSearch(); else hxOpenSearch();
  } else if (e.key === 'Escape') {
    var ov2 = document.getElementById('hxSearchOverlay');
    if (ov2 && ov2.style.display === 'flex') hxCloseSearch();
  } else if (e.key === 'Enter') {
    var ov3 = document.getElementById('hxSearchOverlay');
    if (ov3 && ov3.style.display === 'flex') {
      var first = document.querySelector('#hxSearchResults button[data-hxsr="0"]');
      if (first) first.click();
    }
  }
});
document.addEventListener('click', function(e) {
  var dd = document.getElementById('navDropdown');
  var btn = document.getElementById('menuToggleBtn');
  if (dd && dd.classList.contains('open') && btn && !btn.contains(e.target) && !dd.contains(e.target)) {
    dd.classList.remove('open');
    var icon = document.getElementById('menuIcon');
    if (icon) icon.textContent = '☰';
  }
});

// Ajuste scroll margin
document.querySelectorAll('section, #cinemaHero, footer').forEach(function(el) {
  el.style.scrollMarginTop = '75px';
});



// ── NAV SCROLL ───────────────────────────────────
function updateNav() {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  // Mostrar nav només després de passar el logo animat (#cinemaHero)
  var hero = document.getElementById('cinemaHero');
  var threshold = hero ? hero.offsetHeight * 0.85 : window.innerHeight;
  if (window.pageYOffset >= threshold) {
    nav.classList.add('nav-visible');
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('nav-visible');
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('resize', updateNav);
window.addEventListener('load', updateNav);
document.addEventListener('DOMContentLoaded', updateNav);

// ── CINEMA HERO SCROLL ───────────────────────────
var heroLogoInner = document.getElementById('heroLogoInner');
var cinemaHeroEl  = document.getElementById('cinemaHero');

function handleCinemaScroll() {
  if (!cinemaHeroEl || !heroLogoInner) return;
  var scrollY   = window.pageYOffset;
  var heroH     = cinemaHeroEl.offsetHeight;
  var progress  = Math.min(Math.max(scrollY / heroH, 0), 1);
  var opacity   = 0;
  var translateY = 50;

  // Cinema: apareix i desapareix una mica abans (avançat respecte al scroll)
  if (progress < 0.03) {
    opacity = 0; translateY = 50;
  } else if (progress < 0.13) {
    var t = (progress - 0.03) / 0.10;
    opacity = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    translateY = 50 * (1 - opacity);
  } else if (progress < 0.65) {
    opacity = 1; translateY = 0;
  } else if (progress < 0.78) {
    var t2 = (progress - 0.65) / 0.13;
    opacity = 1 - (t2 < 0.5 ? 2*t2*t2 : -1+(4-2*t2)*t2);
    translateY = -40 * (1 - opacity);
  } else {
    opacity = 0; translateY = -40;
  }
  heroLogoInner.style.opacity = opacity;
  heroLogoInner.style.transform = 'translateY(' + translateY + 'px)';
}
window.addEventListener('DOMContentLoaded', handleCinemaScroll);

// ── SCROLL DISPATCH (batejat a requestAnimationFrame) ────
// updateNav() i handleCinemaScroll() llegeixen offsetHeight/pageYOffset
// i escriuen estils; agrupar-los en un únic listener + rAF evita executar
// els dos càlculs de forma síncrona a cada event 'scroll' (que pot disparar-
// se desenes de vegades per frame) i redueix reflows innecessaris.
// Comportament visual i funcional idèntic a abans, només s'optimitza el timing.
var _scrollTicking = false;
function _onScrollFrame() {
  updateNav();
  handleCinemaScroll();
  _scrollTicking = false;
}
window.addEventListener('scroll', function() {
  if (!_scrollTicking) {
    _scrollTicking = true;
    window.requestAnimationFrame(_onScrollFrame);
  }
}, { passive: true });

// ── FADE-IN OBSERVER ─────────────────────────────
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in, .tl-item').forEach(function(el) { io.observe(el); });
} else {
  document.querySelectorAll('.fade-in, .tl-item').forEach(function(el) { el.classList.add('visible'); });
}

// ── FAQ ──────────────────────────────────────────
function toggleFaq(el) {
  var item = el.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}
window.toggleFaq = toggleFaq;

// ── FORMULARI ────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  var f = e.target;
  // Honeypot anti-spam: camp invisible que només un bot ompliria
  var honeypot = f.elements['website'];
  if (honeypot && honeypot.value) { return false; }
  // Evita l'enviament doble si algú clica dues vegades seguides
  var submitBtn = f.querySelector('button[type="submit"]');
  if (submitBtn) {
    if (submitBtn.disabled) return false;
    submitBtn.disabled = true;
    setTimeout(function(){ submitBtn.disabled = false; }, 4000);
  }
  var val = function(name){ var el = f.elements[name]; return el ? el.value.trim() : ''; };
  var nom      = val('nom');
  var empresa  = val('empresa');
  var email    = val('email');
  var telefon  = val('telefon');
  var sector   = val('sector');
  var missatge = val('missatge');

  try {
    var files = [
      ['Nom', nom],
      ['Empresa', empresa],
      ['Email', email]
    ];
    if (telefon) files.push(['Telèfon', telefon]);
    if (sector && sector.indexOf('Selecciona') !== 0) files.push(['Sector', sector]);
    var filesHTML = files.map(function(f){
      return '<tr><td style="padding:5px 4px;color:#888;width:110px;font-size:12px;text-transform:uppercase;letter-spacing:.03em;">' + escHtml(f[0]) + '</td>' +
        '<td style="padding:5px 4px;font-weight:600;color:#333;">' + escHtml(f[1]) + '</td></tr>';
    }).join('');
    var cos =
      '<table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">' + filesHTML + '</table>' +
      escHtml(missatge).replace(/\n/g, '<br>');
    enviarNotificacioEmail({
      title: 'Nou contacte web: ' + (empresa || nom) + ' — HIGIENEX',
      name: nom || 'Formulari de contacte',
      message: cos,
      email: email,
      badge: 'NOVA CONSULTA',
      subtitle: 'Algú ha enviat una nova consulta des del formulari de contacte.',
      detailLabel: 'Missatge',
      ctaButtonHtml: hxEmailCtaButton('Respondre al client →', 'mailto:' + email, 'gold'),
      data: { event: 'consulta', contact: { name: nom, email: email, company: empresa, phone: telefon },
        fields: files.filter(function(x){ return ['Nom','Empresa','Email','Telèfon'].indexOf(x[0]) < 0; }), message: missatge }
    });
  } catch(err) { console.warn('No s\'ha pogut preparar l\'email de contacte:', err); }

  var s = document.getElementById('formSuccess');
  if (s) { s.style.display = 'block'; setTimeout(function() { s.style.display = 'none'; }, 5000); }
  f.reset();
}
window.submitForm = submitForm;

function submitAuditoria(e) {
  e.preventDefault();
  var f = e.target;
  var honeypot = f.elements['website'];
  if (honeypot && honeypot.value) { return false; }
  var submitBtn = f.querySelector('button[type="submit"]');
  if (submitBtn) {
    if (submitBtn.disabled) return false;
    submitBtn.disabled = true;
    setTimeout(function(){ submitBtn.disabled = false; }, 4000);
  }
  var val = function(name){ var el = f.elements[name]; return el ? el.value.trim() : ''; };
  var nom      = val('nom');
  var empresa  = val('empresa');
  var email    = val('email');
  var telefon  = val('telefon');
  var sector   = val('sector');
  var franja   = val('franja');
  var mida     = val('mida');

  try {
    var files = [
      ['Nom', nom],
      ['Empresa', empresa],
      ['Email', email],
      ['Telèfon', telefon],
      ['Sector', sector],
      ['Franja preferida', franja || 'Indiferent']
    ];
    if (mida) files.push(['Mida instal·lacions', mida]);
    var filesHTML = files.map(function(f){
      return '<tr><td style="padding:5px 4px;color:#888;width:150px;font-size:12px;text-transform:uppercase;letter-spacing:.03em;">' + escHtml(f[0]) + '</td>' +
        '<td style="padding:5px 4px;font-weight:600;color:#333;">' + escHtml(f[1]) + '</td></tr>';
    }).join('');
    var cos = '<table style="width:100%;border-collapse:collapse;font-size:14px;">' + filesHTML + '</table>';
    enviarNotificacioEmail({
      title: 'Nova sol·licitud d\'auditoria gratuïta: ' + (empresa || nom) + ' — HIGIENEX',
      name: nom || 'Sol·licitud d\'auditoria',
      message: cos,
      email: email,
      badge: 'AUDITORIA GRATUÏTA',
      subtitle: 'Algú ha sol·licitat una visita tècnica gratuïta des de la web.',
      detailLabel: 'Dades de la sol·licitud',
      ctaButtonHtml: hxEmailCtaButton('Respondre al client →', 'mailto:' + email, 'gold'),
      data: { event: 'auditoria', contact: { name: nom, email: email, company: empresa, phone: telefon }, fields: files.filter(function(x){ return ['Nom','Empresa','Email','Telèfon'].indexOf(x[0]) < 0; }) }
    });
  } catch(err) { console.warn('No s\'ha pogut preparar l\'email d\'auditoria:', err); }

  var s = document.getElementById('auditoriaSuccess');
  if (s) { s.style.display = 'block'; setTimeout(function() { s.style.display = 'none'; }, 6000); }
  f.reset();
}
window.submitAuditoria = submitAuditoria;

function submitSafeStock(e) {
  e.preventDefault();
  var f = e.target;
  var honeypot = f.elements['website'];
  if (honeypot && honeypot.value) { return false; }
  var submitBtn = f.querySelector('button[type="submit"]');
  if (submitBtn) {
    if (submitBtn.disabled) return false;
    submitBtn.disabled = true;
    setTimeout(function(){ submitBtn.disabled = false; }, 4000);
  }
  var val = function(name){ var el = f.elements[name]; return el ? el.value.trim() : ''; };
  var nom      = val('nom');
  var empresa  = val('empresa');
  var email    = val('email');
  var telefon  = val('telefon');
  var naus     = val('naus');
  var m2       = val('m2');
  var missatge = val('missatge');

  try {
    var files = [
      ['Nom', nom],
      ['Empresa', empresa],
      ['Email', email],
      ['Telèfon', telefon],
      ['Naus a inspeccionar', naus]
    ];
    if (m2) files.push(['Superfície aprox.', m2]);
    if (missatge) files.push(['Detalls', missatge]);
    var filesHTML = files.map(function(f){
      return '<tr><td style="padding:5px 4px;color:#888;width:170px;font-size:12px;text-transform:uppercase;letter-spacing:.03em;">' + escHtml(f[0]) + '</td>' +
        '<td style="padding:5px 4px;font-weight:600;color:#333;">' + escHtml(f[1]) + '</td></tr>';
    }).join('');
    var cos = '<table style="width:100%;border-collapse:collapse;font-size:14px;">' + filesHTML + '</table>';
    enviarNotificacioEmail({
      title: 'Nova sol·licitud SafeStock: ' + (empresa || nom) + ' — HIGIENEX',
      name: nom || 'Sol·licitud SafeStock',
      message: cos,
      email: email,
      badge: 'SAFESTOCK · AUDITORIA',
      subtitle: 'Algú ha sol·licitat una auditoria d\'emmagatzematge químic des de la web.',
      detailLabel: 'Dades de la sol·licitud',
      ctaButtonHtml: hxEmailCtaButton('Respondre al client →', 'mailto:' + email, 'gold'),
      data: { event: 'safestock', contact: { name: nom, email: email, company: empresa, phone: telefon }, fields: files.filter(function(x){ return ['Nom','Empresa','Email','Telèfon'].indexOf(x[0]) < 0; }), message: missatge }
    });
  } catch(err) { console.warn('No s\'ha pogut preparar l\'email de SafeStock:', err); }

  var s = document.getElementById('safestockSuccess');
  if (s) { s.style.display = 'block'; setTimeout(function() { s.style.display = 'none'; }, 6000); }
  f.reset();
}
window.submitSafeStock = submitSafeStock;

function hxValidarCV(input){
  var file = input.files && input.files[0];
  if (!file) return;
  var mida = 5 * 1024 * 1024;
  if (file.size > mida) {
    alert('El fitxer supera els 5 MB. Si us plau, adjunta un CV més lleuger.');
    input.value = '';
    return;
  }
  var extensio = file.name.split('.').pop().toLowerCase();
  if (['pdf','doc','docx'].indexOf(extensio) === -1) {
    alert('Format no admès. Adjunta el CV en PDF o Word (.doc/.docx).');
    input.value = '';
  }
}
window.hxValidarCV = hxValidarCV;

// Nota tècnica: aquest formulari adjunta el CV com a fitxer real (no un
// enllaç), per la qual cosa envia el formulari sencer al servidor (/api/notify-form) en lloc del
// enviarNotificacioEmail() genèric — és l'única manera d'EmailJS d'enviar
// un adjunt binari real. Perquè arribi per correu, el peu de plantilla
// d'EmailJS ha de tenir activat "Attach files" (funcionalitat disponible
// segons el pla contractat). Si el compte no ho admet, el correu arribarà
// igualment amb la resta de dades, sense l'adjunt.
function submitTreballaForm(e) {
  e.preventDefault();
  var f = e.target;
  var honeypot = f.elements['website'];
  if (honeypot && honeypot.value) { return false; }
  var submitBtn = f.querySelector('button[type="submit"]');
  if (submitBtn) {
    if (submitBtn.disabled) return false;
    submitBtn.disabled = true;
    setTimeout(function(){ submitBtn.disabled = false; }, 4000);
  }
  var val = function(name){ var el = f.elements[name]; return el ? el.value.trim() : ''; };
  var nom      = val('nom');
  var email    = val('email');
  var telefon  = val('telefon');
  var posicio  = val('posicio');
  var missatge = val('missatge');
  var cvInput  = f.elements['cv'];
  var cvFile   = cvInput && cvInput.files && cvInput.files[0];
  if (!cvFile) { showToast('Adjunta el teu CV abans d\'enviar la candidatura.', '📎'); if (submitBtn) submitBtn.disabled = false; return false; }

  try {
    var files = [['Nom', nom], ['Lloc', posicio], ['Email', email], ['CV adjuntat', cvFile.name]];
    if (telefon) files.push(['Telèfon', telefon]);
    var filesHTML = files.map(function(row){
      return '<tr><td style="padding:5px 4px;color:#888;width:110px;font-size:12px;text-transform:uppercase;letter-spacing:.03em;">' + escHtml(row[0]) + '</td>' +
        '<td style="padding:5px 4px;font-weight:600;color:#333;">' + escHtml(row[1]) + '</td></tr>';
    }).join('');
    var cos =
      '<table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">' + filesHTML + '</table>' +
      escHtml(missatge).replace(/\n/g, '<br>');

    // Omplim camps ocults amb les mateixes variables que fa servir la resta
    // de plantilles de correu, perquè sendForm() els reculli junt amb el fitxer.
    var hidden = {
      title: 'Nova candidatura: ' + (posicio || nom) + ' — HIGIENEX',
      badge: 'NOVA CANDIDATURA',
      subtitle: 'S\'ha rebut una nova candidatura des de "Treballa amb nosaltres".',
      detail_label: 'Presentació',
      message: cos,
      time: new Date().toLocaleString('ca-ES'),
      erp_url: (typeof HX_ERP_URL !== 'undefined' ? HX_ERP_URL : '')
    };
    Object.keys(hidden).forEach(function(key){
      var inp = f.querySelector('input[data-hidden-param="' + key + '"]');
      if (!inp) {
        inp = document.createElement('input');
        inp.type = 'hidden';
        inp.name = key;
        inp.setAttribute('data-hidden-param', key);
        f.appendChild(inp);
      }
      inp.value = hidden[key];
    });

    fetch(HX_API_BASE + '/notify-form', { method: 'POST', body: new FormData(f) })
      .then(function(r){ if (!r.ok) throw new Error('Error ' + r.status); })
      .catch(function(err){ console.warn('No s\'ha pogut enviar la candidatura amb el CV adjunt:', err); });
  } catch(err) { console.warn('No s\'ha pogut preparar l\'email de candidatura:', err); }

  var s = document.getElementById('treballaSuccess');
  if (s) { s.style.display = 'block'; setTimeout(function() { s.style.display = 'none'; }, 5000); }
  f.reset();
}
window.submitTreballaForm = submitTreballaForm;
