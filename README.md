# BobApp

Clone project:

> git clone XXXXX

## Front-end 

Go inside folder the front folder:

> cd front

Install dependencies:

> npm install

Launch Front-end:

> npm run start;

### Docker

Build the container:

> docker build -t bobapp-front .  

Start the container:

> docker run -p 8080:8080 --name bobapp-front -d bobapp-front

## Back-end

Go inside folder the back folder:

> cd back

Install dependencies:

> mvn clean install

Launch Back-end:

>  mvn spring-boot:run

Launch the tests:

> mvn clean install


### Docker

Build the container:

> docker build -t bobapp-back .  

Start the container:

> docker run -p 8080:8080 --name bobapp-back -d bobapp-back 

## Sonar 

Lien vers le sonar du projet :
https://sonarcloud.io/summary/overall?id=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&branch=main

#### Qualité du projet

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=coverage)](https://sonarcloud.io/component_measures?id=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=coverage)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=code_smells)](https://sonarcloud.io/component_measures?id=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=code_smells)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=bugs)](https://sonarcloud.io/component_measures?id=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=bugs)
[![Sécurité](https://sonarcloud.io/api/project_badges/measure?project=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=security_rating)](https://sonarcloud.io/component_measures?id=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=security_rating)



L'indicateur de sécurité n'est pour l'instant pas fiable, aucune sécurité n'est réellement présente dans l'application.

Par contre il existe des hotspot sur la partie sécurité :
[Consulter les Security Hotspots sur SonarCloud](https://sonarcloud.io/component_measures?id=Yann-Rethore_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD&metric=security_hotspots)
