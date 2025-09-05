FROM maven:3.6.3-jdk-11-slim AS build

WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B clean package -DskipTests

FROM openjdk:11-jdk-slim

RUN useradd -m appuser

WORKDIR /home/appuser

COPY --from=build /workspace/target/*.jar app.jar

RUN chown -R appuser:appuser /home/appuser

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
