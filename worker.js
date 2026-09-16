// ═══════════════════════════════════════════════════════════
// HIGIENEX — Worker de Cloudflare que connecta el xat de la web
// amb l'API de Gemini. Rep {message, history, context} des del
// navegador i retorna {reply}.
//
// BUG CORREGIT (setembre 2026): el prompt de sistema anterior no
// delimitava prou bé el paper de la Mònica, i quan Gemini no sabia
// respondre una pregunta concreta (fora de productes/preus/horaris/
// contacte/enviaments), acabava "refugiant-se" en explicar la
// història de l'empresa perquè és la informació de context més
// genèrica que rebia. Aquesta versió:
//   1) Deixa clar que la informació d'empresa NOMÉS s'ha de donar
//      si l'usuari pregunta explícitament per l'empresa.
//   2) Dona una instrucció explícita de què fer quan la pregunta és
//      d'un tema totalment aliè (respondre breu i honestament que
//      no ho pot ajudar en això, i redirigir a WhatsApp/l'equip).
//   3) Prohibeix explícitament "refugiar-se" en un altre tema quan
//      no sap la resposta.
// ═══════════════════════════════════════════════════════════

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `Ets la Mònica, l'assistent virtual d'HIGIENEX S.L., una empresa valenciana que fabrica i distribueix productes d'higiene professional sostenible per a hospitals, hotels, indústria alimentària i oficines.

EL TEU ÀMBIT D'AJUDA ÉS NOMÉS AQUEST:
- Productes, catàleg i disponibilitat
- Preus i descomptes per volum
- Horaris d'atenció
- Formes de contacte (telèfon, email, WhatsApp, adreça)
- Enviaments i terminis de lliurament
- Com fer o consultar una comanda
- Certificacions (ISO 14001, biocides, HACCP) i sostenibilitat
- Informació sobre l'empresa (història, equip, valors) — PERÒ NOMÉS quan l'usuari ho demana explícitament (per exemple "qui sou", "des de quan existiu", "parla'm de l'empresa"). No la donis mai com a resposta per defecte a altres preguntes.

REGLA MÉS IMPORTANT: si la pregunta de l'usuari és sobre un tema que NO és cap dels anteriors (per exemple política, notícies, un altre sector, una pregunta personal, matemàtiques, o qualsevol cosa aliena a HIGIENEX), NO responguis parlant de l'empresa ni de cap altre tema de la llista com a "refugi". En comptes d'això:
1. Reconeix amb naturalitat que això no és una cosa amb la qual puguis ajudar.
2. Ofereix redirigir la persona cap a l'equip humà (WhatsApp o email) si la pregunta sembla legítima però surt del teu àmbit.
3. Sigues breu (2-3 frases com a molt) i mai inventis dades sobre HIGIENEX que no coneguis.

TO: proper, càlid i directe, en el mateix idioma en què t'escriu l'usuari (català, castellà, anglès...). Frases curtes. Sense emojis excessius (com a molt un per missatge). No et presentis de nou si ja portes conversa.

Tens accés al catàleg de productes actual en el camp "context" de context addicional (JSON amb nom, preu, unitat i disponibilitat) — fes-lo servir per respondre amb dades reals, mai inventades.`;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json;charset=UTF-8'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '*';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Mètode no permès' }), { status: 405, headers: corsHeaders(origin) });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'JSON invàlid' }), { status: 400, headers: corsHeaders(origin) });
    }

    const userMessage = (body.message || '').toString().slice(0, 2000);
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const context = (body.context || '').toString().slice(0, 4000);

    if (!userMessage.trim()) {
      return new Response(JSON.stringify({ error: 'Missatge buit' }), { status: 400, headers: corsHeaders(origin) });
    }
    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Falta la clau de Gemini al Worker (GEMINI_API_KEY)' }), { status: 500, headers: corsHeaders(origin) });
    }

    // Construïm el contingut de la conversa per a Gemini: el prompt de
    // sistema + el context del catàleg van com a primer torn "user" i
    // una confirmació "model", seguits de l'historial real i el missatge nou.
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT + (context ? '\n\nContext addicional (catàleg actual, en JSON):\n' + context : '') }] },
      { role: 'model', parts: [{ text: 'Entesos, seguiré aquestes instruccions.' }] },
      ...history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: (m.content || '').toString().slice(0, 2000) }]
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    try {
      const geminiRes = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 400 }
        })
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        console.error('Error de Gemini:', geminiRes.status, errText);
        return new Response(JSON.stringify({ error: 'Error consultant Gemini' }), { status: 502, headers: corsHeaders(origin) });
      }

      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!reply) {
        return new Response(JSON.stringify({ error: 'Resposta buida de Gemini' }), { status: 502, headers: corsHeaders(origin) });
      }

      return new Response(JSON.stringify({ reply }), { headers: corsHeaders(origin) });
    } catch (err) {
      console.error('Error inesperat:', err);
      return new Response(JSON.stringify({ error: 'Error intern del Worker' }), { status: 500, headers: corsHeaders(origin) });
    }
  }
};
