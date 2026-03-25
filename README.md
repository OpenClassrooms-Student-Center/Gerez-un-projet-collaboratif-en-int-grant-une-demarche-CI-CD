# 🚀 BobApp

BobApp is a web application that allows users to consult and share jokes.

The project is built with:
- 🖥️ Backend: Java Spring Boot  
- 🌐 Frontend: Angular  

This project demonstrates the implementation of a **CI/CD pipeline** using GitHub Actions, SonarCloud, and Docker.

---

## ⚙️ CI/CD Features

- ✅ Automated tests (backend & frontend)
- 📊 Code quality analysis with SonarCloud (Quality Gate)
- 📦 Docker image build (frontend & backend)
- 🚀 Automatic push to DockerHub

---

## 📥 Clone the project

```bash
git clone XXXXX
cd bobapp
```
---

## 🖥️ Run Frontend
```bash
cd front
npm install
npm run start
```
---
## ⚙️ Run Backend
```bash
cd back
mvn clean install
mvn spring-boot:run
```
---
## 🧪 Run tests
```bash
mvn clean verify
npm run test
```
---
## 🐳 Docker
**Build images**
```bash
docker build -t bobapp-front ./front
docker build -t bobapp-back ./back
```

**Run containers**
```bash
docker run -p 8080:8080 --name bobapp-front -d bobapp-front
docker run -p 8080:8080 --name bobapp-back -d bobapp-back
```
---

## 📄 Documentation

The project documentation is available here:

👉 [View documentation](docs/documentation.pdf)

---
## 📌 Notes

This project was developed as part of a training project to implement CI/CD practices and DevOps tools.

---
## 👤 Author
Julio Daniel GIL CANO
