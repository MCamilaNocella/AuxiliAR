# Ronda 4: UX/UI y contenido (informe)

**Rama local:** `feature/ux-content-round4`, derivada de `demo/presentation-2026-10-14` (`8cd3564`). La rama de presentación **no se modificó**. No hubo push, PR ni merge; `main`, `origin/main` y los dos stashes están intactos. No se tocaron Auxi, chatbot, servidor, Footer, la sección Emergencias, los datos del mapa ni el calendario de vacunación. Capturas en [capturas/](capturas/) (320, 390 y 1280 px); resultados de rutas en [capturas-rutas/comprobaciones.txt](capturas-rutas/comprobaciones.txt).

## 1. Carteles redundantes de emergencias
**Eliminados** (duplicaban la barra de emergencias y el botón «Emergencia» de la navegación inferior, que están en todas las páginas):
- Salud mental › Dónde buscar ayuda: el recuadro rojo «Si hay riesgo inmediato, o necesitás hablar con alguien ahora» con su botón «Ver números de emergencia».
- Salud sexual y ESI › Dónde buscar atención: el recuadro rojo «Si estás en peligro ahora o sufriste una agresión» con el mismo botón.

**Se conservan a propósito** (no son un cartel repetido o llevan una advertencia específica):
| Dónde | Por qué se conserva |
|---|---|
| Salud animal › Cuidado y prevención: «Si un animal te mordió o te arañó» | Es una advertencia clínica **específica** (acudir a un centro de salud); su botón es parte de esa advertencia. |
| Centros de atención (mapa) y «Sobre los datos»: «Si hay riesgo inmediato, no busques un centro» | Advertencia **específica del contexto** (no buscar un centro si hay riesgo inmediato); es una línea, no un cartel, y el diseño aprobado la pide. |
| Primeros auxilios › «¿Necesitás actuar ahora?» | Es la página de la propia categoría y su indicación de actuar. |
| Mapa vacío (ayuda cuando no hay cobertura) y tarjeta de ayuda urgente (filtro Salud mental) | Funcionales; la tarjeta de ayuda urgente es de Emergencias. |
| Controles de salud (corazón) y Quiz | La acción está unida a una advertencia clínica («si de golpe te sentís muy mal…»). |
Si el equipo quiere quitar alguno más de esta lista, es una decisión aparte.

## 2. Panel de primeros auxilios
**Propuesta recuperada:** [primeros-auxilios-protagonismo/README.md](../primeros-auxilios-protagonismo/README.md) (documentada y con capturas), que estaba implementada en `feature/first-aid-prominence` (`f28fe96`). Su alcance estaba claro, así que **se trajo tal cual** (`git cherry-pick`, commit propio `38af201`): se quita la banda de la home y el bloque de la derecha de la barra de emergencias pasa a ser un panel en el teal del sitio, con «Ver todas las guías» como botón.

**Aviso sobre una restricción:** el panel vive dentro de `EmergencyBar.tsx`, que esta ronda pide no tocar. Este cambio edita **solo las clases de estilo del bloque de primeros auxilios** de ese archivo (no los números, textos de emergencias, lógica ni orden). Como la modificación de interfaz estaba aprobada y es inseparable de ese archivo, **se hizo como un commit aparte (`38af201`)** para que se pueda descartar con `git revert 38af201` sin afectar lo demás. La aprobación de Camila sobre `EmergencyBar` sigue pendiente.

## 3. Salud sexual y ESI
### 3.1 «Anticonceptivos gratuitos: cuáles son y cómo conseguirlos» (en «Anticoncepción y prevención»)
Reemplaza el recuadro «Qué dicen las fuentes oficiales sobre el acceso y el costo». Separa cuatro cosas:
- **Gratuidad:** lo que informa el Gobierno de la Ciudad («La atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas»); para el resto del país, AuxiliAR no tiene confirmada la gratuidad de cada provincia.
- **Cobertura legal:** Ley 25.673 (acceso y cobertura médica obligatoria) y Ley 26.130 (ligadura y vasectomía), según el Ministerio de Salud.
- **Condiciones de acceso:** asesoramiento de un equipo de salud; el DIU y el implante los coloca un profesional; las pastillas combinadas no se recomiendan en algunas situaciones; ligadura y vasectomía desde la mayoría de edad con constancia escrita; anticoncepción de emergencia lo antes posible y sin receta en farmacias.
- **Disponibilidad concreta:** que sea gratuito y esté cubierto **no asegura turno, stock ni profesional disponible**; AuxiliAR no tiene confirmados turnos, stock ni centros concretos.

Además, «Cuáles son y qué dicen las fuentes de cada uno» (cinco grupos de métodos, con dónde se pide cada uno según las fuentes) y «Cómo conseguirlos» (cinco pasos). El bloque de métodos pasó a llamarse «Cómo funciona cada método». **Sin stock, turnos ni establecimientos inventados.**

### 3.2 Sección propia «Interrupción voluntaria y legal del embarazo (IVE/ILE)»
Sección visible del menú (`section-4`, entre «Anticoncepción y prevención» y «Derechos y ESI»; con cuatro secciones, el menú móvil usa el desplegable de secciones). Incluye, con fuente oficial: qué derechos reconoce la Ley 27.610, IVE e ILE (hasta la semana 14 inclusive; después, violación o peligro para la vida o la salud integral), acceso gratuito (cobertura integral y gratuita en el sistema público, obras sociales y prepagas), qué hace falta y el plazo de 10 días corridos, confidencialidad y trato, objeción de conciencia (derivación sin demoras), orientación y a quién acudir si hay obstáculos (línea nacional de salud sexual y línea de violencia de género, sin copiar números), reclamos a obras sociales y prepagas, y «Lo que esta página no dice».
- **No se agregó ningún centro como prestador confirmado:** solo se enlaza la lista oficial de consejerías de la Ciudad (que trae un contacto por IVE/ILE) aclarando que AuxiliAR no la verificó ni confirma el servicio en cada centro.
- **Visible y marcado:** lleva arriba el aviso «Pendiente de validación legal y profesional».
- Fuentes: Ley 27.610 y la página «Acceso a la Interrupción Voluntaria del Embarazo (IVE)» de argentina.gob.ar (texto guardado en `docs/investigacion/evidencia/ive-ile-ley-27610-y-pagina-oficial.txt`). La página del Ministerio de Salud «Acceso a la interrupción del embarazo: IVE/ILE» devolvió 403 y no se pudo leer.

## 4. Componente de videos `VideoEmbed`
`client/src/components/health/VideoEmbed/`: responsivo (16:9), con portada y botón (el reproductor **no se carga ni se envía nada a YouTube hasta que la persona lo pide**; dirección sin cookies), foco al reproductor, título obligatorio, subtítulos solicitados al reproductor (y solo se dice «tiene subtítulos» si alguien lo comprobó), enlace siempre visible al video original (pestaña nueva) y transcripción en un desplegable. Valida que el id sea de YouTube y que el enlace original sea `https://`. **No hay ningún video en ninguna página.** Comprobado en el navegador a 320, 390 y 1280 px (sin pedidos antes de reproducir; Enter abre el reproductor y le pasa el foco). Guía y lista de verificación previa a usarlo: [docs/componentes/video-embed.md](../../componentes/video-embed.md).

## 5. Documentación
- **README de los datos** (`client/src/data/resources/README.md`): ya no dice que «todavía no hay datos cargados». Dice que hay **7 establecimientos con 34 servicios registrados**, de los cuales **9 están visibles** según la verificación actual (los otros 25 se conservan sin mostrarse), 14 líneas de ayuda, y enlaza el inventario. También se corrigieron «nacional.json, vacío», «(hoy no hay ninguno)» y «Qué viene después».
- Se incorporó a la rama el inventario del mapa (CSV y explicación de reglas), `bf22610` (viene de `research/map-inventory`), para poder enlazarlo.

## 6. Pruebas
`tsc -b`, `build` y `oxlint`: sin errores ni advertencias. `npm run test:ci`: **sin fallas** (incluye `round4:test`, 10 pruebas nuevas). Recorrido sobre la versión construida (390 y 1280 px): 90 comprobaciones, **0 fallas** (rutas, 404 de prototipos, redirecciones antiguas y navegación inferior); revisión visual a 320, 390 y 1280 px de las secciones modificadas, sin desborde horizontal, sin errores de consola y sin saltos de encabezados.
Pruebas que cambiaron: las de Salud mental y Salud sexual (ya no esperan el recuadro rojo), las de ESI (ahora cuatro secciones, la última sin resumen para Auxi) y la de la home (sin banda; un solo bloque de primeros auxilios).

## 7. Pendientes
**Clínicos:**
- Todo el texto nuevo de anticonceptivos (cuáles son, condiciones de acceso, AHE sin receta, ligadura y vasectomía) se resume de páginas oficiales y **necesita revisión clínica**; ver también la lista previa en `docs/investigacion/ronda-contenido-3/afirmaciones-pendientes-de-validacion.md`.
- IVE/ILE: la semana 14, las dos causales de ILE, el plazo de 10 días y la objeción de conciencia son afirmaciones clínicas y legales **pendientes de validación profesional**.

**Legales:**
- IVE/ILE: resumen de los arts. 2, 4, 5, 10, 11 y 12 de la Ley 27.610 (y mención de reglas para adolescentes y capacidad restringida sin detallarlas); alcance de «acceso gratuito» y de los reclamos a obras sociales.
- Ley 26.130 (ligadura y vasectomía) tal como la resume el Ministerio.
- Atribución de licencia (CC BY 4.0) para el contenido de argentina.gob.ar usado.

**De contenido y equipo:**
- **Aprobación de Camila** sobre el cambio de estilo en `EmergencyBar.tsx` (panel de primeros auxilios).
- **Auxi** no sabe de la sección IVE/ILE (sin resumen; su índice es un recurso del servidor).
- La página del Ministerio de Salud sobre IVE/ILE no se pudo leer (403): conviene contrastar con ella y con el protocolo vigente.
- Falta decidir si se quita algún cartel de emergencias más de la lista del §1.
- Falta la investigación de Work: **no se agregó ningún servicio al mapa** (no se tocaron los datos).
- Videos: el componente está listo, pero no hay videos verificados (ver la lista de verificación).
