# BobApp

## 📦 Cloner le projet

> git clone https://github.com/jodt/P-10-Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD.git

## 🔹 Front-end

Accéder au dossier front:

> cd front

Installer les dépendances:

> npm install

Lancer le front-end :

> npm run start;

## 🔹 Back-end

Accéder au dossier du back:

> cd back

Installer les dépendances:

> mvn clean install

Lancer le back-end:

>  mvn spring-boot:run

Pour exécuter les tests back-end:

> mvn clean install

### Docker

Vous pouvez lancer l’application complète (front + back) avec:
> docker-compose up

Taper ensuite l'url http://localhost:4200 dans votre navigateur.

Pour la stopper: 
> docker-compose down

## ✅ Analyse de la qualité du code (SonarCloud)

L’analyse statique du code est automatisée grâce à SonarCloud à chaque pull request ou push sur la branche main.
SonarCloud évalue la qualité du nouveau code à l’aide de plusieurs indicateurs : bugs, vulnérabilités, couverture de tests, duplications, etc.

Les badges ci-dessous indiquent le statut de la Quality Gate pour le front-end et le back-end :

### 🔎 Front-end

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=P-10-Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD-Front&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=P-10-Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD-Front)

➡️ [Voir l’analyse globale du code](https://sonarcloud.io/summary/overall?id=P-10-Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD-Front)

### 🔎 Back-end

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=P-10-Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD-Back&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=P-10-Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD-Back)

➡️ [Voir l’analyse globale du code](https://sonarcloud.io/summary/overall?id=P-10-Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD-Back)

## 📄 CI/CD Documentation

Le fonctionnement du pipeline CI/CD, les indicateurs de qualité (KPI), les rapports de couverture, et les décisions techniques sont détaillés dans le document suivant :

📘 [Document explicatif (PDF)](./assets/ci-cd-documentation.pdf)


## Auteur
Joel DUMORTIER