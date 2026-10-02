# ==========================================
# Etapa 1: Construcción del JAR con Maven Wrapper
# ==========================================
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copiar configuración de Maven Wrapper y dependencias para aprovechar cache
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copiar código fuente y compilar artefacto productivo
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ==========================================
# Etapa 2: Imagen de Ejecución (JRE 21 optimizado)
# ==========================================
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

# Crear usuario y grupo sin privilegios root por seguridad,
# y crear el directorio uploads asignándole permisos completos al usuario spring
RUN addgroup --system spring && adduser --system --ingroup spring spring && \
    mkdir -p /app/uploads && \
    chown -R spring:spring /app

USER spring:spring

# Copiar el ejecutable generado con permisos de spring
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE ${PORT}

# Soporte para puerto dinámico de Render y control de memoria para contenedor
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
