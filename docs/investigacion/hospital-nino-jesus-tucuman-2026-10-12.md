# Hospital del Niño Jesús (Tucumán): lectura y estado (12/10/2026)

**Estado: NO cargado en el mapa ni en la lista.** Es un candidato con dos bloqueos que son reglas del proyecto (ver abajo). Lectura documental de las páginas oficiales; nada se confirmó por teléfono ni en el lugar.

## Qué dicen las páginas oficiales (Ministerio de Salud Pública de Tucumán, leídas el 12/10/2026)
Páginas: `msptucuman.gov.ar/hospitales/hospital-del-nino-jesus/`, `…/servicios-prestacionales/` e `…/infraestructura/`. Ninguna tiene fecha de la ficha (hay noticias de septiembre de 2026 en la misma página).

- **Qué es:** «Hospital Pediátrico de 3º Nivel», «monovalente, único exclusivo para la atención pediátrica en la provincia».
- **Dirección:** Sabín 750, San Miguel de Tucumán.
- **A quién atiende:** «niños y adolescentes con patologías agudas y crónicas (menores de 14 años)», ambulatorio e internación.
- **Servicios nombrados:** internación (210 camas, 40 de área crítica), sala de inmunodeprimidos, centro quirúrgico, vacunatorio, estimulación temprana, seguimiento del prematuro y una larga lista de especialidades, entre ellas Salud Mental y Psicología («psicología y psiquiatría» en la ficha principal), Odontología (24 hs), SIA con guardia de 24 hs y «Guardia de Emergencia de 24 hs».
- **Turnos:** solo dice que el Servicio de Referencia y Contrarreferencia asigna «Turnos Programados» a hospitales del interior. No explica cómo pide turno una persona.

## Lo que las páginas NO dicen
- **Costo / gratuidad:** no mencionan que la atención sea gratuita ni dan precios.
- **Teléfono, correo y horarios de consultorios:** no figuran (los números de la barra del sitio son del Ministerio, no del hospital).
- **Cómo se pide un turno propio:** no figura.

## Por qué no se cargó
1. **Gratuidad sin documentar.** La regla del mapa exige que una fuente oficial diga que la prestación es gratuita; sin eso la prestación no se muestra como gratuita ni se lista (por eso el Garrahan entró con su frase de gratuidad). La búsqueda no encontró una página oficial vigente de Tucumán que la diga para este hospital; las notas halladas son de 2012 a 2015.
2. **Coordenadas sin método aprobado.** Georef (datos abiertos) no tiene «Sabín 750» en San Miguel de Tucumán (solo calles «Alberto Sabin» en Yerba Buena). Sin coordenadas verificadas el lugar iría solo en la lista, nunca en el mapa.
3. **Primera provincia fuera de CABA.** Cargarlo crea `places/ar-t.json`, cambia pruebas que fijan «solo CABA» y suma un establecimiento al catálogo que lee Auxi (ver `cobertura-provincial-propuesta-tecnica.md`, §3 y §4). Es una decisión del equipo.

## Qué falta para cargarlo
- Una frase oficial de gratuidad para el hospital (o decidir que una norma general de Tucumán alcanza, como la Ley 153 en la Ciudad).
- Dirección con coordenadas verificadas por un método aprobado para Tucumán.
- Un teléfono publicado por el hospital y sus horarios.
- Decidir la carga de la primera provincia fuera de CABA.

Mientras tanto, la información sirve para la sección «Otras provincias» de Salud mental, donde los datos van sin afirmar costo (por ejemplo, Salud Mental y Psicología de este hospital, con la nota «la página no informa el costo»).
