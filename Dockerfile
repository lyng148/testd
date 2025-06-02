## -------- Stage 1: Build ứng dụng bằng Maven --------
#FROM maven:3.8-openjdk-8 AS builder
#
#WORKDIR /app
#
## Chép file pom.xml và tải dependencies (cache layer)
#COPY pom.xml .
#RUN mvn dependency:go-offline
#
## Chép toàn bộ source và build jar
#COPY src ./src
#RUN mvn clean package -DskipTests
#
## -------- Stage 2: Chạy ứng dụng bằng JRE nhẹ --------
#FROM openjdk:8-jre-alpine
#
## Tạo folder chứa jar (tùy ý)
#WORKDIR /app
#
## Copy file jar từ stage builder sang
#COPY --from=builder /app/target/*.jar app.jar
#
## Mở port 8080
#EXPOSE 8080
#
## Chạy ứng dụng
#ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
#
# -------- Stage 1: Build ứng dụng bằng Maven --------
FROM maven:3.8-openjdk-8 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# -------- Stage 2: Chạy ứng dụng bằng JRE nhẹ --------
FROM openjdk:8-jre-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
