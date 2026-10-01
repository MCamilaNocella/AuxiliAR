# Builds and runs the AuxiliAR API (Spring Boot). Used by Railway and docker-compose.

# --- Build: compiles the jar with Maven ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Dependencies first: this layer is cached while pom.xml doesn't change
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# --- Run: only the JRE and the jar ---
FROM eclipse-temurin:21-jre
WORKDIR /app
# Not as root
RUN useradd --system --uid 1001 auxiliar
COPY --from=build /app/target/*.jar app.jar
USER auxiliar
# Railway sets PORT; the app reads it (server.port), 8080 by default
EXPOSE 8080
# Use most of the container's memory limit instead of a fixed heap
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
ENTRYPOINT ["java", "-jar", "app.jar"]
