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

# Crear usuario y grupo sin privilegios root por seguridad
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copiar el ejecutable generado
COPY --from=build /app/target/*.jar app.jar

# Variables de entorno y puerto por defecto
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
