🎨 Front-end

Le projet Front-end est un module Angular géré via le pipeline CI/CD GitHub Actions.

Install dependencies (si nécessaire pour modifications locales) :
cd front
npm install
⚠️ Les builds et déploiements sont automatisés via GitHub Actions et Docker Hub.


⚙️ Back-end
Le projet Back-end est un module Spring Boot géré via le pipeline CI/CD GitHub Actions.

Install dependencies (si nécessaire pour modifications locales) :

cd back
mvn clean install
⚠️ Les builds, tests, analyses SonarCloud et déploiements Docker sont automatisés via GitHub Actions.

📝 Fichier de configuration
Le projet Back utilise un fichier application.properties pour la configuration du pipeline et de SonarCloud :

# Projet global
sonar.projectKey=...
sonar.organization=...
sonar.host.url=https://sonarcloud.io
sonar.modules=back,front


# BACK
back.sonar.projectBaseDir=back
back.sonar.sources=src/main/java
back.sonar.tests=src/test/java
back.sonar.java.binaries=target/classes
back.sonar.java.coveragePlugin=jacoco
back.sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml


# FRONT
front.sonar.projectBaseDir=front
front.sonar.sources=src/app
front.sonar.tests=src
front.sonar.test.inclusions=**/*.spec.ts
front.sonar.javascript.lcov.reportPaths=coverage/lcov.info

⚠️ Ce fichier configure les paramètres d’analyse SonarCloud pour les deux modules.

⚡ CI/CD & Docker Hub

Le pipeline GitHub Actions automatise la construction, les tests, l’analyse Sonar et le déploiement Docker pour Front et Back de manière indépendante.

🛠️ Étapes du workflow

# Frontend

Build Angular et installation des dépendances

Tests unitaires avec Karma et génération du coverage

Analyse qualité sur SonarCloud

Build et push Docker Hub (latest et SHA commit)

# Backend

Build Spring Boot et installation des dépendances

Tests unitaires avec Maven et génération du coverage Jacoco

Analyse qualité sur SonarCloud

Build et push Docker Hub (latest et SHA commit)

Pipeline simplifié :
Frontend + Tests ---> SonarCloud ---> Docker Hub
Backend + Tests ---> SonarCloud ---> Docker Hub

🔑 GitHub Actions secrets

DOCKERHUB_USERNAME → username Docker Hub

DOCKERHUB_TOKEN → token avec droits Read/Write/Delete

SONAR_TOKEN → token SonarCloud

📊 KPIs & Analyse des métriques
KPI	Module	Source	Objectif
Couverture tests	        Back	Jacoco XML	≥ 80%
Couverture tests	        Front	Karma / lcov	≥ 80%
Bugs / Vulnérabilités	    Back / Front	SonarCloud	Niveau A
Temps de build	Global	    GitHub Actions	≤ 10 min
Disponibilité Docker	    Back / Front	Docker Hub	100%

📝 Analyse des métriques et retours des utilisateurs

Front et Back déployés et analysés indépendamment → flexibilité maximale

Pipeline automatisé → moins d’erreurs manuelles

Images Docker fiables sur Docker Hub

Possibilité de rollback grâce au tag SHA unique

Temps moyen du pipeline : ~5 min


💡 Recommandations

Surveiller régulièrement la couverture et la qualité du code via SonarCloud

Ajouter des tests e2e pour le Front et le Back

Mettre en place notifications GitHub en cas d’échec du pipeline

Le fichier application.properties doit être correctement configuré pour le pipeline

