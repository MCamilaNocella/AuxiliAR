# Demo integrada para el miércoles 14 de octubre: integración con `origin/main`, correcciones y propuestas

Fecha: 9/10/2026. Rama local `integration/demo-final-2026-10-14` (desde `integration/demo-2026-10-14`). Sin push, PR ni merge; `main` (4409451) y los dos stashes intactos. No se tocó Emergencias (números, lógica ni textos), el chatbot, su prompt, el servidor ni el componente de Auxi. No se conectaron credenciales de IA.

## 1. Integración con `origin/main`

`origin/main` (46f1a86) está **incluido** en la rama: commit de fusión `92289cd`. Trae el trabajo de Camila Nocella: ancho de página y layout, pie y encabezado, botón de accesibilidad y README. Nada de su trabajo se sobrescribió.

Un solo conflicto, en `Footer.tsx`, resuelto sin decidir información sanitaria:
- Se conservó **el diseño de Camila** completo (contenedor `page-container`, nombre de la app en su propia línea en móvil, frase de emergencia en una línea aparte, enlace «Sobre AuxiliAR» aparte).
- La frase de emergencia usa `GENERAL_EMERGENCY_NUMBER` de `@/data/emergency`, la fuente única ya aprobada (la misma que ya usaba el pie de la rama). Su versión tenía «911 o 107» escritos a mano: **no se incluyeron** esos números ni otros. El pie dice, como antes, solo el número único de emergencias.

Diff del Footer respecto de la rama (lo único que cambia son clases y la estructura de Camila; la frase y el número son los de la rama):

```diff
-    <div className="mx-auto flex max-w-360 flex-col items-center gap-1 px-4 pt-6 pb-24 text-center text-sm text-muted sm:px-6 lg:px-8">
+    <div className="page-container flex flex-col items-start gap-1 pt-6 pb-24 text-left text-sm sm:items-center sm:text-center lg:pb-6 text-muted">
       <p className="m-0">
-        <span className="font-display text-lg text-ink">AuxiliAR</span> · Recursos de salud gratuitos para Argentina
+        <span className="block font-display text-lg text-ink sm:inline">AuxiliAR</span>
+        <span className="hidden sm:inline"> · </span>
+        Recursos de salud gratuitos para Argentina
       </p>
       <p className="m-0 text-pretty">
-        AuxiliAR no reemplaza la atención médica ni psicológica profesional. Ante una emergencia, llamá al{" "}
-        <b className="text-ink">{GENERAL_EMERGENCY_NUMBER}</b>.
+        AuxiliAR no reemplaza la atención médica ni psicológica profesional.{" "}
+        <span className="block sm:inline">
+          Ante una emergencia, llamá al <b className="text-ink">{GENERAL_EMERGENCY_NUMBER}</b>.
+        </span>
       </p>
-        Información verificada de fuentes oficiales ·{" "}
-        <Link to={PATHS.about} className="font-bold">
+        Información verificada de fuentes oficiales
+        <span className="hidden sm:inline"> · </span>
+        <Link to={PATHS.about} className="block font-bold sm:inline">
```

Aviso para Camila: la fusión también trae su cambio de una línea en `EmergencyBar.tsx` (solo clases de ancho: `page-container`); el contenido del componente no cambia.

## 2. Correcciones autorizadas

1. **Página 404 propia** (`src/screens/NotFound`, ruta `*` al final, dentro del layout): título «No encontramos esta página», enlaces «Volver al inicio», «Encontrar atención» y «Primeros auxilios», sin números escritos a mano (la barra y la navegación del layout siguen). Probado a 320, 390 y 1280 px: «Volver al inicio» lleva a `/`.
2. **Enlaces:**
   - **Facultad de Veterinaria UBA** (`www.fvet.uba.ar/hospital/`): hoy responde 200 y la página sigue diciendo «Todos los servicios son arancelados» y «no atiende urgencias sin previa coordinación». Era intermitente: **se mantiene**.
   - **Fracturas** (`argentina.gob.ar/salud/primerosauxilios/situaciones/fracturas`): sigue fallando, y no solo ella: **toda la sección `/situaciones/`** devuelve la página de error («500 - Error», enviada como 403) con curl y con Chrome, aunque un buscador todavía la lista; `primerosauxilios`, `RCP` y `botiquin` sí abren. No hay un sustituto verificado de la misma página (la de «Accidentes hogareños» de la Ciudad dice solo una línea sobre fracturas). **Se retiró temporalmente de las dos guías que la citaban** (Golpes y caídas, Posibles fracturas), que conservan el Manual del Ministerio de Salud (DINESA), cuyo capítulo «Caídas – Fracturas» trata la inmovilización (comprobado en el PDF). El enlace queda documentado en `sources.ts` para reponerlo cuando la página abra. **No se cambió ningún paso de las guías.** Pendiente para Camila u otra persona: confirmar en el Manual los dos criterios que venían de la página retirada («si puede caminar sin ayuda, llevarla a un centro de salud; si no, llamar a emergencias»); la página retirada no se pudo volver a leer.
   - Resultado: los 48 enlaces externos de la aplicación responden 200 ([enlaces-externos.txt](enlaces-externos.txt)).
3. **Áreas táctiles del mapa:** los enlaces de atribución de Leaflet/OpenStreetMap (16 px de alto) pasan a 24 px, y «Cómo verificamos los datos» (22 px) a 26 px. Quedan fuera, a propósito: la casilla de «Solo gratuidad verificada» (20×20, pero su etiqueta completa es el área táctil) y «Sobre AuxiliAR» del pie (20 px de alto, diseño de Camila).
4. **Rutas de prototipo:** ver sección 4.

## 3. Propuesta de presentación segura para Auxi (sin implementar)

Auxi, en esta demo, **es una funcionalidad en desarrollo**: no se conecta ninguna IA, no se simulan respuestas y no se toca el componente.

Sin servidor ni credenciales, el chat hoy abre con su saludo y la pregunta de emergencia, y a cualquier consulta responde «Perdón, no me pude conectar en este momento. Probá de nuevo en un rato. Si es una emergencia, llamá al 911.». Eso ya es honesto, pero **no dice que esté en desarrollo** y alguien puede leerlo como una falla. Propuesta de guion para la demostración, sin cambiar código:

1. **Qué decir:** «Auxi es el asistente de AuxiliAR y todavía está en desarrollo. En esta demo no responde consultas de salud. Toda la información verificada está en las categorías y en el mapa, y los números de emergencia están siempre visibles.»
2. **Qué mostrar:** el saludo, el botón «Sí/No» de emergencia y el mensaje de «no me pude conectar»; **no escribir consultas sanitarias** en el chat durante la presentación.
3. **Qué no afirmar:** que Auxi orienta, diagnostica, encuentra centros o confirma gratuidad. Aun con servidor, el prompt actual no recibe los datos del mapa y responde con conocimiento general cuando AuxiliAR no tiene la información (riesgo ya documentado en el informe anterior).
4. **Si quieren que lo diga la pantalla (requiere autorización):** reemplazar el texto del mensaje de error por uno que diga «Auxi todavía está en desarrollo y por ahora no responde consultas. Mirá las categorías o, si es una emergencia, llamá al 911» (número desde la fuente única), y/o un cartel «En desarrollo» en el encabezado del chat. Es un cambio en el componente/cliente del chat, que no está autorizado todavía.

## 4. Rutas de prototipo: documentación y cómo excluirlas de la demo

| Ruta | Qué es | Origen | ¿La enlaza algo? |
|---|---|---|---|
| `/auxi-modelos` | Comparador de modelos de la mascota (hay 21 variantes) | pantalla `AuxiModels`, trabajo de Milagros sobre la mascota | No |
| `/boceto-chat-personas` | Boceto de un chat entre personas | pantalla `PeerChatSketch` | No |
| `/login` | Página vacía con la palabra «login», sin zona principal ni navegación | pantalla `Login`, de la estructura inicial | No |

Ninguna tiene enlaces desde la aplicación: solo se abren si alguien escribe la dirección. No se borró ni se modificó nada de ellas.

**Cómo excluirlas sin borrar trabajo (propuesta, no aplicada):**
- **Opción A (recomendada, 5 minutos):** en el router, registrarlas solo en desarrollo, por ejemplo `...(import.meta.env.DEV ? [rutas de prototipo] : [])`. En la versión construida para la demo esas direcciones caerían en la nueva 404. El código y las pantallas se conservan.
- **Opción B:** dejarlas como están y no mencionarlas; es el riesgo menor porque nadie llega a ellas por navegación.
- No se recomienda borrar las pantallas: son trabajo de otras personas.

## 5. Capturas

[capturas/](capturas/): inicio, mapa, la 404 y las categorías (Cuidar mi salud, Salud mental, Salud sexual y ESI, Salud animal, Primeros auxilios, Encontrar atención y Sobre AuxiliAR) a 320, 390 y 1280 px, ya con el layout de Camila; más el inicio completo a 390 px.

## 6. Pruebas

| | Resultado |
|---|---|
| `npm run test:ci` (ahora con `demo:test`, 4 pruebas nuevas: 404, orden de rutas, fracturas, objetivos táctiles) | todo pasa; incluye mapa (130), curación (77), emergencias, líneas, `resources:check`, `curation:check` |
| `resources:test` | 33/33 |
| `tsc`, `lint`, `build` | sin errores ni advertencias |
| Auditoría Chrome 320/390/1280 (45 rutas) | 0 errores de página, 0 de consola, 0 desbordes, 0 peticiones fallidas; la ruta inexistente ya muestra la 404 propia |
| Recorrido de la demo (6 categorías, secciones, pie, ajustes, pestaña Emergencia) | sin errores; los números 107, 911, 144, 135 y 102 se muestran sin cambios |
| Enlaces externos | 48/48 responden 200 |
| Java | no se corrió de nuevo (servidor sin cambios); última corrida 58/59, falla solo `contextLoads` (pendiente aparte) |

## 7. Bloqueos reales para el miércoles

1. **Auxi:** decidir el guion (sección 3). Con la IA sin conectar, el único riesgo es lo que se diga o se escriba en el chat durante la presentación.
2. **Camila debe ver la fusión** (pie y `EmergencyBar`) antes de que la rama sirva de base común.
3. **Guías de fracturas:** confirmar los criterios con el Manual o reponer la página oficial cuando abra.

No hay bloqueos técnicos de navegación. Menores pendientes: la burbuja de saludo de Auxi tapa texto en móvil y la mascota tapa hasta 15 % de un enlace en una pantalla (componente de Auxi, no autorizado); agenda del Centro de Costanera Sur vence el 17/10; `contextLoads` de Java.
