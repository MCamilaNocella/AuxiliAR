# Pendientes de equipo (registrados por separado)

Nada de esto se modificó en esta ronda. Cada pendiente tiene responsable, estado y qué lo desbloquea.

## 1. Footer y EmergencyBar: aprobación de Camila
- **Estado:** pendiente. La fusión de `origin/main` (su layout y accesibilidad) está en la rama de demo (commit `92289cd`); el pie conserva su diseño y el número sale de `GENERAL_EMERGENCY_NUMBER`. EmergencyBar solo cambió clases de ancho (`page-container`).
- **Qué falta:** que Camila mire el pie y la barra en 320, 390 y 1280 px y confirme (1) que su diseño quedó como lo pensó y (2) que está de acuerdo con la fuente única del número. Detalle: [resumen-footer-para-camila.md](../../pendientes/resumen-footer-para-camila.md).
- **Bloquea:** la integración a una rama compartida, no la demo local.
- Esta ronda **no tocó** `Footer.tsx` ni `EmergencyBar.tsx`.

## 2. Auxi
- **Estado:** pendiente de aprobación de quien mantiene Auxi. Propuesta «Auxi — En desarrollo»: [auxi-en-desarrollo.md](../../pendientes/auxi-en-desarrollo.md). No se tocó el componente, la burbuja, el prompt ni el servidor; no hay credenciales de IA conectadas; no se simulan respuestas.
- **Comprobado en esta revisión (móvil 390 px):** la burbuja «¡Hola! Soy Auxi, ¿necesitás ayuda?» **sigue tapando texto** en las páginas nuevas (calendario, trámites, «Si muere tu perro o gato»). Es el problema ya documentado en [auxi-superposicion-movil.md](../../pendientes/auxi-superposicion-movil.md): se cierra con su ✕.
- **Nuevo en esta ronda:** Auxi **no sabe de las secciones nuevas**. Las secciones sin resumen no entran en el índice de contenidos de Auxi (`content-index.json`, un recurso del servidor que no se regeneró). Cuando quien mantiene Auxi decida, correr `npm run content:index` con resúmenes escritos para: Calendario de vacunación, Si muere tu perro o gato, y las 4 secciones de Más recursos.
- **Java:** `contextLoads` falla sin credenciales de IA ([java-contextloads-sin-credenciales.md](../../pendientes/java-contextloads-sin-credenciales.md)).

## 3. Contenidos clínicos y legales pendientes de validación
- Lista exacta: [afirmaciones-pendientes-de-validacion.md](afirmaciones-pendientes-de-validacion.md) (anticoncepción de emergencia, PEP, preservativo vaginal, otros métodos, calendario, rabia, derechos, fracturas y textos propios de los estados vacíos).
- **Fracturas:** [validacion-clinica-criterio-caminar-fracturas.md](../../pendientes/validacion-clinica-criterio-caminar-fracturas.md). Sigue sin cambios.
- **Ley 27.610** (en Salud sexual y ESI › Derechos y ESI, desde antes de esta ronda): en revisión editorial y legal.
- **Hospital Rivadavia / preservativos vaginales:** sin fuente; no publicado.

## 4. Datos del mapa (sin cambios)
- Pasteur y «Consejería y métodos anticonceptivos» para CeSAC 3, 41 y 47: [propuestas-preparadas-no-publicadas.md](propuestas-preparadas-no-publicadas.md). Necesitan aprobación del modelo de datos (tipo de servicio nuevo para Pasteur) y del criterio de gratuidad general para los CeSAC.
- Agenda de Costanera Sur: vence el 17/10 (revisar antes del 8/11/2026).
- El enlace de fracturas de argentina.gob.ar se repone cuando abra.

## 5. Videos y audios
[videos-requisitos-para-integrar.md](videos-requisitos-para-integrar.md).
