FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
COPY /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
