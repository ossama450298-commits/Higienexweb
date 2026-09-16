# Cómo redesplegar el Worker corregido

## Qué se ha arreglado
El prompt de sistema que se le enviaba a Gemini no delimitaba bien el papel de
la Mònica. Cuando alguien preguntaba algo fuera de productos/precios/horarios/
contacte/envíos, Gemini no sabía qué responder y "se refugiaba" hablando de la
historia de la empresa, porque era la información de contexto más genérica que
tenía a mano.

La nueva versión de `worker.js`:
1. Dice explícitamente que la info de empresa solo se da si se pregunta por ella.
2. Da una instrucción clara de qué hacer ante un tema totalmente ajeno: reconocerlo
   con naturalidad, ofrecer redirigir a WhatsApp/email, y ser breve — nunca usar
   otro tema como refugio.

## Pasos para redesplegarlo

1. Entra en el [dashboard de Cloudflare](https://dash.cloudflare.com) → **Workers & Pages**.
2. Abre el worker que ya tienes desplegado (el que responde en
   `https://higienexchat.ossama450298.workers.dev`).
3. Ve a la pestaña **Edit code** (o **Quick edit**).
4. Borra todo el contenido actual y pega el contenido completo del archivo
   `worker.js` que te adjunto.
5. Comprueba en **Settings → Variables** que la variable de entorno
   `GEMINI_API_KEY` sigue existiendo con tu clave de la API de Gemini (no se
   toca, solo hace falta que siga ahí).
6. Pulsa **Save and Deploy**.
7. Prueba el chat en la web preguntando algo fuera de tema (por ejemplo,
   "¿qué tiempo hace hoy?") y confirma que ya no responde con la historia de
   la empresa.

No hace falta tocar nada en `index.html` — el problema estaba solo en el
código del Worker, no en la web.
