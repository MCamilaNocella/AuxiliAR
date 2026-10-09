# Checklist para la presentación del miércoles 14/10/2026

Versión: rama `demo/content-round3-final`, **solo demo local** (no publicación ni integración a `main`). Guía general de la demo: [guia-demo-14-octubre.md](../demo-candidata/guia-demo-14-octubre.md).

## 0. Antes de empezar
- [ ] `npm run dev` en `client` y abrir `http://localhost:5174/`.
- [ ] **Cerrar la burbuja de Auxi con su ✕.** Queda cerrada mientras no se recargue la página; al recargar vuelve ([detalle](auxi-superposicion.md)).
- [ ] Decidir la opción 1 u opción 2 de la [propuesta de demo segura](propuesta-demo-segura.md).

## 1. Recorrido sugerido (≈ 8 minutos)

| # | Ruta | Qué mostrar | Estado |
|---|---|---|---|
| 1 | `/` | Las seis categorías, el botón Emergencia y la banda de Primeros auxilios. | Mostrar |
| 2 | `/centros` | Mapa AuxiliAR: solo prestaciones con gratuidad documentada; abrir una ficha; «Cómo verificamos los datos». | Mostrar |
| 3 | `/centros?vista=lista&filtro=mental-health` | Estado vacío transparente: «Todavía no tenemos… Eso no significa que no existan». | Mostrar |
| 4 | `/temas/salud-general?seccion=section-5` | Calendario por etapas: «Recién nacidos», «Hasta 2 años», «65 años o más». | **Con advertencia** (es un resumen; el PDF trae más notas) |
| 5 | `/recursos?seccion=section-2` | Cómo pedir turno en un CeSAC. | Mostrar |
| 6 | `/recursos?seccion=section-3` y `?seccion=section-4` | Preguntas frecuentes (sin la de no residentes) y Glosario. | Mostrar |
| 7 | `/temas/animales?seccion=section-4` | Qué hacer si muere tu perro o gato: servicio gratuito de Pasteur y sus límites. | **Con advertencia** (no abrir «¿mordió a alguien?») |
| 8 | `/temas/esi?seccion=section-1` y `?seccion=section-2` | Dónde buscar atención; en Anticoncepción, la lista de métodos **cerrada**. | **Con advertencia** |
| 9 | `/primeros-auxilios` | Guías de primeros auxilios (no abrir Fracturas ni Golpes y caídas). | Mostrar |
| 10 | `/mi-salud` | «En construcción»: decirlo así. | En desarrollo |

## 2. Se puede mostrar sin advertencia
Inicio; Mapa AuxiliAR y «Sobre los datos»; estados vacíos de salud mental, salud sexual y odontología; Más recursos › Trámites, Preguntas frecuentes (6 de 8) y Glosario; Salud animal › Servicios, Cuidado y Atención gratuita; Salud mental; Primeros auxilios (salvo dos guías).

## 3. Requiere advertencia o no abrirse hasta validar
Detalle en la [propuesta de demo segura](propuesta-demo-segura.md). Resumen: **no abrir** Embarazo, 5 años, 11 años y 15 a 64 años del calendario; AHE, PEP, preservativo vaginal, DIU, ligadura y vasectomía (ESI › Anticoncepción); «¿mordió a alguien?» (Salud animal); las tarjetas Ley 153 y Vacunas y la pregunta de no residentes (Más recursos); el estado vacío de oftalmología; ESI › Derechos y ESI (Ley 27.610); las guías Posibles fracturas y Golpes y caídas.

## 4. Frases para decir en voz alta
- «Todo lo que ven viene de fuentes oficiales; los textos de salud pasan por revisión profesional antes de publicarse.»
- «El mapa solo muestra lo que una fuente oficial confirma como gratuito; que algo no aparezca no quiere decir que no exista.»
- «El calendario es un resumen: el PDF oficial tiene notas y límites de edad por vacuna.»

## 5. Limitaciones conocidas
- La burbuja de Auxi tapa texto en móvil (documentado; se cierra con su ✕).
- Auxi no responde consultas de salud (sin credenciales de IA ni servidor) y no conoce las secciones nuevas.
- El mapa tiene 6 lugares y 9 prestaciones, solo CABA; no están Pasteur ni la consejería de los CeSAC.
- Las páginas oficiales no traen fecha de actualización; las fuentes se consultaron el 8 y 9/10/2026.
- Servidor Java: `contextLoads` falla sin credenciales de IA (solo importa si se muestra el servidor).
- Los enlaces externos abren pestañas nuevas; los 55 respondieron 200 el 9/10 (volver a verificar el día de la demo si hay internet).

## 6. Todavía en desarrollo (no mostrar como funcionando)
Mi salud; Auxi (chat); videos y audios integrados; Pasteur y CeSAC en el mapa; cobertura fuera de CABA; rutas de prototipo (solo en desarrollo, nunca públicas).

## 7. Antes de salir
- [ ] Recorrer los 10 pasos de la tabla en el equipo de la demo, en móvil y en escritorio.
- [ ] Confirmar quién presenta qué y quién responde las preguntas de salud.
- [ ] Tener a mano el [calendario contra el PDF](calendario-contra-pdf-2026.md) por si preguntan por una vacuna.
