# Instrucciones para Claude

## Enlaces
Cuando el usuario escriba «enlace» o «enlaces», responde directamente con estos dos enlaces:

- **Web pública:** https://ossama450298-commits.github.io/Higienexweb/
- **ERP** (pide contraseña): https://higienexweb2.ossama450298.workers.dev/erp/

## Correos guardados: nunca enviarles nada
El Centro de control del ERP tiene una lista «Correos guardados» (ver el CLAUDE.md del repositorio higienex-erp). Claude no debe enviar nunca ningún email a esas direcciones, con ninguna herramienta ni en ninguna tarea programada. Solo el usuario les escribe, a mano.

## Informe de la web y el ERP (actualizarlo siempre)
El informe profesional del proyecto está en el repositorio higienex-erp, en `docs/informe/` (`informe.html` y el PDF `Informe_web_y_ERP_HIGIENEX.pdf`). La carpeta `docs` no se publica (está en `.assetsignore`).
- **Cada vez que se haga un cambio en la web pública o en el ERP**, añadir una fila arriba del todo en la tabla «Actualizaciones recientes» de `docs/informe/informe.html` (justo debajo del comentario `NUEVAS ACTUALIZACIONES AQUÍ`), sin fechas, con «Dónde» (Web, ERP, Servidor…) y el cambio explicado en una frase.
- Si el cambio afecta a lo que cuenta un apartado del informe, actualizar también ese apartado (y la captura si hace falta, en `docs/informe/img/`).
- Después, regenerar el PDF con `node scripts/informe-pdf.mjs` (desde higienex-erp) y hacer commit y push de higienex-erp junto con el cambio.
- Copia en Google Drive: Mi unidad › HIGIENEX › Informes › «Informe web y ERP - HIGIENEX.pdf». Si la sesión tiene conexión con Drive, generar la versión ligera con `node scripts/informe-pdf.mjs --ligero` (menos de 3 MB) y sustituir esa copia; si no, avisar al usuario de que la copia de Drive se ha quedado sin actualizar.
- En el informe no van datos reales: ni los correos guardados, ni el email del usuario, ni nombres de personas en las capturas.
