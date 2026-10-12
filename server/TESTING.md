# Cómo correr las pruebas del servidor

```
cd server
mvn test
```

(En este repositorio el Maven Wrapper `./mvnw` está roto —pendiente aparte—, así que se usa un Maven instalado, con JDK 21.)

## Pendiente conocido: `ServerApplicationTests.contextLoads`

`contextLoads` levanta toda la aplicación, y **falla con la configuración de prueba actual** (`src/test/resources/application.properties`) por falta de valores, no por un error del código:

| Falta | Qué pasa sin eso |
|---|---|
| `spring.ai.openai.api-key` | El cliente de IA no se puede crear («At least one credential source must be specified») |
| `auxiliar.ai.provider` | No se resuelve el placeholder `${auxiliar.ai.provider}` |
| `auxiliar.chat.reasoning` | Ídem |
| `auxiliar.cors.allowed-origins` | No se resuelve el placeholder de `CorsConfig` |
| `spring.ai.openai.chat.model` | Falta el modelo del cliente de IA |

Las pruebas **unitarias** (el resto) no lo necesitan y pasan sin nada. Para correr **todo, incluido `contextLoads`**, con valores de relleno (no se llama a ningún modelo):

```
mvn test -Dspring.ai.openai.api-key=dummy -Dspring.ai.openai.chat.model=dummy \
         -Dauxiliar.ai.provider=nvidia -Dauxiliar.chat.reasoning=false \
         -Dauxiliar.cors.allowed-origins=http://localhost:5173
```

Con eso pasan las 59 pruebas (la última comprobación: 8-10-2026). `contextLoads` es útil porque arranca de verdad todo lo que se valida al iniciar: la copia de los recursos (`data/resources.json`), el índice de contenido y las instrucciones de Auxi.

**Por qué no está arreglado:** el arreglo correcto es dar esos valores en `src/test/resources/application.properties` (o con un `@TestPropertySource`), y es un cambio de configuración de pruebas separado de los números de ayuda. Tampoco están las pruebas de Java en el CI (`.github/workflows/node.js.yml` no corre Maven). Para comprobar a mano que la tabla de números del chat, la copia del servidor y lo que `SafetyRules.java` supone de PAMI están al día con `client/src/data/resources/lines`, está `npm run resources:check` (en `client/`).

## Lo que cambia cuando se tocan los números de ayuda

1. Se edita `client/src/data/resources/lines/nacional.json` (o `numeros.template.md`) y se corre `npm run resources:sync` en `client/`: eso regenera `src/main/resources/data/resources.json` y `src/main/resources/prompts/numeros.md`. **No se editan a mano.**
2. `HelpNumbersTest`, `SafetyRulesTest` y `ResourceCatalogTest` comprueban lo que el servidor lee de ahí.
3. La revisión periódica de las fechas: `client/src/data/resources/README.md`, «Revisión periódica de los números» (`npm run lines:due`).
