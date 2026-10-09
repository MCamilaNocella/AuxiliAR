# Demo del miércoles 14 de octubre: cómo ejecutarla, recorrido de 5 minutos y aprobaciones pendientes

Rama candidata: `release/demo-candidate-2026-10-14` (local; sin push, PR ni merge). Capturas de la compilación de demo a 320, 390 y 1280 px: [capturas/](capturas/).

## Cómo ejecutar la demo localmente

Necesita Node 24 (se probó con 24.19) e internet (el mapa carga las teselas de OpenStreetMap). **No hace falta el servidor ni ninguna clave.**

```powershell
cd "C:\Users\Familia\Repo AuxiliAR\AuxiliAR"
git checkout release/demo-candidate-2026-10-14
cd client
npm install          # solo si falta la carpeta node_modules
npm run build        # compila la versión de demo (comprueba tipos y construye)
npm run preview      # sirve la compilación en http://localhost:4173
```

Abrir `http://localhost:4173`. Para detenerla: `Ctrl+C` en esa terminal.

- **Use la compilación (`preview`), no `npm run dev`:** en desarrollo siguen abiertas las pantallas de prototipo (`/login`, `/auxi-modelos`, `/boceto-chat-personas`); en la compilación muestran la página 404 propia.
- **Auxi sin servidor:** el chat abre, hace la pregunta de emergencia y, a cualquier consulta, responde «Perdón, no me pude conectar…». Es el comportamiento esperado: Auxi está en desarrollo y no se conectó ninguna IA.
- **Antes de salir:** abrir la demo una vez con internet para comprobar que se ve el mapa; revisar que `git status` esté limpio.

## Recorrido sugerido de 5 minutos

| Min | Pantalla | Qué mostrar y decir |
|---|---|---|
| 0:00 | **Inicio** | «AuxiliAR: información de salud verificada y gratuita para Argentina.» La barra de emergencias arriba (sin tocar los números) y las seis categorías. Mencionar Auxi: «el asistente, todavía en desarrollo; hoy no responde consultas de salud». |
| 0:45 | **Encontrar atención › mapa** | 7 lugares verificados de la Ciudad. Filtro **Salud animal** (1) y casilla **Solo gratuidad verificada** (6). Buscar «**castrar a mi perro**». |
| 1:45 | **Detalle del Centro Fijo Veterinario Costanera Sur** | «Gratuita con condiciones»: turno previo online con miBA, acompañante mayor de 18 años, preparación del animal. **«Fuentes oficiales»** con la fecha de consulta. La nota «ubicación aproximada». Frase clave: «no confirma que haya turnos disponibles». |
| 2:30 | **Un CeSAC** (CeSAC 3, vacunación) | La condición está atribuida solo a la vacunación («Condiciones de esta prestación»); la clínica médica figura «Gratuita» y el resto «Gratuidad no confirmada»: «si no está verificado, no lo decimos». |
| 3:15 | **Salud animal** | «Una campaña gratuita no es atención veterinaria gratuita.» |
| 3:45 | **Salud mental** o **Salud sexual y ESI** | Una sección con fuentes oficiales. |
| 4:15 | **Primeros auxilios › RCP** (o Atragantamiento) | Guía paso a paso. **Evitar las guías «Posibles fracturas» y «Golpes y caídas»**: están pendientes de validación clínica. |
| 4:40 | **Pestaña Emergencia** y **Sobre AuxiliAR** | Los números siempre a mano; cómo se verifican los datos. Cierre. |

Qué evitar en vivo: escribir consultas de salud en el chat de Auxi; abrir las guías de fracturas y de golpes y caídas; afirmar que hay turnos o que algo es gratis sin condiciones; mencionar rutas de prototipo.

## Aprobaciones humanas pendientes

1. **Camila:** la fusión de `origin/main` (pie y `EmergencyBar`). Resumen breve: [resumen-footer-para-camila.md](../../pendientes/resumen-footer-para-camila.md).
2. **Validación clínica** de las guías de lesiones (criterio «puede caminar sin ayuda») y decisión sobre la corrección propuesta: [validacion-clinica-criterio-caminar-fracturas.md](../../pendientes/validacion-clinica-criterio-caminar-fracturas.md).
3. **Quien mantiene Auxi:** la propuesta «Auxi — En desarrollo» y que la burbuja no tape texto en móvil: [auxi-en-desarrollo.md](../../pendientes/auxi-en-desarrollo.md). Sin esa aprobación la burbuja sigue como está.
4. **Contenidos sanitarios señalados** del mapa: la carga del Centro de Costanera Sur (ya aprobada en rondas anteriores, con agenda de turnos que **vence el 17/10**: revisar antes) y los textos «Gratuita» / «Gratuita con condiciones».
5. **Reposición del enlace de fracturas** de argentina.gob.ar cuando la sección abra (hoy devuelve error).
6. **Integración a `main`:** no se hizo ni se pidió; requiere revisión y aprobación explícita de ustedes.
7. Pendiente técnico aparte: `contextLoads` de Java sin credenciales de IA.
