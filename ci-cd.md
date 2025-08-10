# Documentation CI/CD - Application BobApp

Cette documentation présente la pipeline CI/CD mise en place pour l'application BobApp, comprenant une partie frontend (Angular) et backend (Java/Spring Boot).

## Architecture CI/CD

### Workflows GitHub Actions

1. **Workflow CI** : `pull-request-ci.yml` - Déclenché sur les Pull Requests
2. **Workflow CD** : `merge-deploy.yml` - Déclenché sur merge vers main

---

## CI - Intégration Continue (Pull Requests)

### Objectif
Valider la qualité du code avant integration sur la branche principale.

### Étapes du Workflow CI

#### **Frontend** (Job parallèle)

| Étape | Description | Objectif |
|-------|-------------|----------|
| **Checkout** | Récupération du code source | Accès au code pour les étapes suivantes |
| **Setup Node.js** | Installation Node.js 16.10.0 avec cache npm | Environnement d'exécution standardisé |
| **Install Dependencies** | `npm ci` - Installation des dépendances | Préparation de l'environnement de build |
| **Build Application** | `npm run build` - Compilation de l'application Angular | Vérification que l'application compile sans erreur |
| **Run Tests** | `npm test` avec Karma/ChromeHeadless + code coverage | Validation des fonctionnalités et calcul de couverture |
| **Test Reporting** | Génération du rapport de tests avec dorny/test-reporter | Visibilité des résultats dans GitHub |
| **Coverage Upload** | Upload des artefacts de couverture | Conservation des métriques pour analyse |
| **SonarCloud Scan** | Analyse de qualité du code frontend | Détection des code smells, bugs, vulnérabilités |

#### **Backend** (Job parallèle)

| Étape | Description | Objectif |
|-------|-------------|----------|
| **Checkout** | Récupération du code source | Accès au code pour les étapes suivantes |
| **Setup JDK 11** | Installation Java 11 (Temurin) | Environnement d'exécution standardisé |
| **Cache Maven** | Mise en cache des dépendances Maven | Optimisation des temps de build |
| **Run Tests** | `mvn clean verify` - Tests unitaires et d'intégration | Validation complète du backend |
| **Test Reporting** | Génération du rapport de tests JUnit | Visibilité des résultats dans GitHub |
| **Coverage Upload** | Upload des rapports JaCoCo | Conservation des métriques pour analyse |
| **SonarCloud Scan** | Analyse de qualité du code backend | Détection des code smells, bugs, vulnérabilités |

---

## CD - Déploiement Continu (Merge vers Main)

### Objectif
Automatiser la publication des conteneurs Docker sur Docker Hub après validation du code.

### Étapes du Workflow CD

| Étape | Description | Objectif |
|-------|-------------|----------|
| **Checkout** | Récupération du code source | Accès au code validé par la CI |
| **Docker Login** | Authentification sur Docker Hub | Accès en écriture au registry |
| **Build & Push Frontend** | Construction et publication de l'image frontend | Déploiement automatisé du frontend |
| **Build & Push Backend** | Construction et publication de l'image backend | Déploiement automatisé du backend |

### Images Docker Produites
- `fransmk/bobapp:frontend-latest` - Application Angular avec Nginx
- `fransmk/bobapp:backend-latest` - Application Spring Boot

---

## KPIs et Seuils de Qualité

### KPI 1 : Code Coverage (Couverture de Code)
- **Seuil Frontend** : ≥ 80% de couverture de code
- **Seuil Backend** : ≥ 85% de couverture de code
- **Mesure** : JaCoCo (Backend) et Karma (Frontend)
- **Objectif** : Garantir une couverture de tests suffisante pour limiter les régressions

### KPI 2 : Temps de Build
- **Seuil CI** : ≤ 10 minutes pour l'ensemble du pipeline
- **Seuil CD** : ≤ 5 minutes pour le déploiement
- **Mesure** : Durée totale des jobs GitHub Actions
- **Objectif** : Maintenir un feedback rapide pour les développeurs

### KPI 3 : Qualité SonarCloud
- **Seuil Bugs** : 0 bugs de type "Blocker" ou "Critical"
- **Seuil Security Hotspots** : 0 vulnérabilités critiques
- **Mesure** : Analyse SonarCloud sur chaque PR
- **Objectif** : Maintenir un code maintenable et sécurisé

---

## Métriques Actuelles

### Frontend
- **Tests** : 2 tests unitaires
- **Test Time** : moins d'une minute;

### Backend
- **Tests** : 1 tests unitaires
- **Build Time** : moins d'une minute

### CI/CD Performance
- **Temps moyen CI** : ~1 minute 40
- **Temps moyen CD** : ~1 minute 40

### Sonarqube analyse
- **Coverage** : Inférieur à 80%
- **New issues** : 5

---

## Retours Utilisateurs et Problèmes Identifiés

### Plan d'Action Correctif

### Phase 1 - Correction Urgente (24-48h)
- [ ] **Hotfix crash suggestions** - Debug + patch
- [ ] **Correction bug upload vidéo** - Investigation + fix
- [ ] **Rétablissement service email** - Configuration check

---

## Ressources et Documentation

- **Repository GitHub** : [Lien vers votre repo]
- **Docker Hub** : https://hub.docker.com/r/fransmk/bobapp
- **SonarCloud** : [Lien vers votre projet SonarCloud]
- **GitHub Actions** : `.github/workflows/`
