# ---- build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q clean package -DskipTests

# ---- run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Pass secrets at runtime, e.g.:
#   docker run -e APP_ADMIN_TOKEN=... -e MAIL_USERNAME=... -e MAIL_PASSWORD=... -p 8080:8080 portfolio-backend
ENTRYPOINT ["java", "-jar", "app.jar"]
