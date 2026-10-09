# Pendiente técnico: `ServerApplicationTests.contextLoads` falla sin credenciales del proveedor de IA

Registrado el 9/10/2026. **No se corrige en esta etapa** (no se toca el servidor ni el chatbot).

- **Qué pasa:** `mvn test` pasa 58 de 59 pruebas. Falla `ServerApplicationTests.contextLoads`: el contexto de Spring no arranca con «At least one credential source must be specified: credential (apiKey), workloadIdentity, or adminApiKey» (bean `openAiChatModel`).
- **Causa:** la prueba levanta el contexto completo, que crea el cliente del proveedor de IA y necesita `NVIDIA_API_KEY` (o `OPENROUTER_API_KEY` con `AI_PROVIDER=openrouter`) reales en el entorno. Con claves ficticias por variable de entorno o por propiedades de JVM tampoco arranca.
- **Desde cuándo:** falla igual en los registros anteriores a los cambios del mapa; no depende de ellos. `ResourceCatalogTest` (28 pruebas) y el resto pasan con los datos actuales.
- **Propuesta (otra tarea):** que la prueba use una configuración de prueba (clave ficticia y modelo simulado) o que se excluya de la corrida sin credenciales, para que `mvn test` pueda ser un control de calidad completo.
