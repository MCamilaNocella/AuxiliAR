# Pendiente de validación clínica: criterio «puede caminar sin ayuda» en las guías de lesiones

**Estado: pendiente de validación clínica.** No se cambió ninguna guía. Fecha: 9/10/2026. Texto original del Manual en [../investigacion/evidencia/manual-primeros-auxilios-fracturas.txt](../investigacion/evidencia/manual-primeros-auxilios-fracturas.txt).

## Dónde aparece exactamente

Archivo `client/src/content/firstAid/guides/injuries.ts`.

| Guía | Líneas | Texto |
|---|---|---|
| **Posibles fracturas** (`fracturas`) | 94 | «Si la lesión es en un brazo o una pierna, no se ve el hueso y la persona puede caminar sin ayuda, llevala a un centro de salud.» |
| **Posibles fracturas** (`fracturas`) | 95 | «Si no puede caminar sin ayuda, o la lesión no es en un brazo o una pierna, llamá al número de emergencias de tu localidad.» |
| **Golpes y caídas** (`golpes-y-caidas`) | 35 y 44 | Señal: «La persona no puede levantarse o caminar sin ayuda.» Paso: «Llamá al número de emergencias de tu localidad si no puede caminar sin ayuda o si el golpe fue en la cabeza, el cuello o la espalda.» |

Estas indicaciones venían de la página «Fracturas» de argentina.gob.ar (que hoy no abre; ver informe de la demo final). Ahora ambas guías citan solo el Manual.

## ¿Lo respalda el Manual de forma explícita?

El Manual (capítulo «Fracturas: Inmovilización de miembros») dice, textualmente:

> «Si se requiere trasladar a la persona, ante fracturas no complejas de miembros (brazos o piernas) es importante "inmovilizar" con objetos rígidos […]. Hay que trasladar a la persona siempre y cuando se movilice por sus propios medios. En caso contrario esperar al servicio de emergencias.»
> «Cuando la fractura es expuesta, es decir que se ve el hueso, no intente reintroducir los fragmentos óseos. Sólo cúbralo con gasas o telas limpias e inmovilice.»
> Y, en «Caídas – Fracturas»: «si ante una caída se produce una fractura, es importante no movilizar a la víctima, ni al miembro fracturado ya que puede agravar la lesión.»

| Parte de la indicación | ¿Respaldo en el Manual? |
|---|---|
| Si la fractura es de un brazo o una pierna y la persona se mueve por sus propios medios, se la puede trasladar (con la lesión inmovilizada) | **Sí, explícito** («se movilice por sus propios medios») |
| Si no puede moverse por sus propios medios, esperar al servicio de emergencias (por eso se llama) | **Sí, explícito** |
| «Caminar» como forma de decir «moverse por sus propios medios» | **Parcial**: el Manual no usa la palabra; es una paráfrasis razonable pero conviene decidirla |
| Que el destino sea «un centro de salud» | **No explícito**: el Manual dice «trasladar», sin decir adónde |
| «No se ve el hueso» como condición para llevarla por su cuenta | **No explícito**: para la fractura expuesta el Manual solo dice cubrir e inmovilizar; no dice ni que se la traslade ni que se llame |
| Si la lesión **no** es en un brazo o una pierna → llamar a emergencias | **No explícito**: el Manual trata solo fracturas de miembros; para el resto dice no movilizar |
| Golpe en cabeza, cuello o espalda → llamar a emergencias (Golpes y caídas) | **No hallado** en los capítulos de caídas y fracturas del Manual; puede estar respaldado en otra fuente (por ejemplo el capítulo de traumatismos de cabeza) que no se revisó |
| «No muevas a la persona si el golpe fue grave: puede haber lesión de la columna» (`dont` de fracturas) | **No hallado** con esa causa; el Manual dice no movilizar a la víctima con fractura |

**Conclusión:** el Manual respalda el núcleo (trasladar solo si se mueve por sus propios medios; si no, esperar a emergencias), pero **no respalda de forma explícita** las condiciones «no se ve el hueso», «la lesión es en un brazo o una pierna» ni el destino «centro de salud», ni la parte de cabeza, cuello y espalda de Golpes y caídas. Esas partes quedan **pendientes de validación clínica**.

## Propuesta de corrección (no aplicada; requiere aprobación de quien valide los contenidos sanitarios)

Principio: decir solo lo que el Manual dice, y nada más. No se agrega ninguna instrucción nueva; solo se quitan condiciones sin respaldo y se vuelve al texto del Manual.

**Posibles fracturas, pasos 5 y 6** (hoy líneas 94–95), reemplazar por:
5. «Si hay que llevar a la persona y puede moverse por sus propios medios, trasladala con el brazo o la pierna inmovilizados.»
6. «Si no puede moverse por sus propios medios, no la muevas: llamá al número de emergencias de tu localidad y esperá al servicio de emergencias.»

(El número lo sigue poniendo la fuente única de emergencias, sin cambios.) Quedan sin cambios el paso de «si se ve el hueso, cubrilo e inmovilizá», que sí está en el Manual.

**Para decidir por separado** (el Manual no los confirma): mantener o quitar, hasta validar, «no se ve el hueso» y «lesión que no es en un brazo o una pierna → emergencias», y la línea de cabeza, cuello y espalda de Golpes y caídas. Quitarlas hace la guía menos específica, pero ninguna instrucción conservada queda sin fuente. Si alguien prefiere conservarlas por prudencia (llamar a emergencias ante la duda es lo más seguro), debe decirlo quien valide, y se cita la fuente que la respalde.

**Tampoco se tocaron** las demás guías: no se revisó si otras indicaciones de lesiones dependían de la página retirada.
