# BobApp — Documentation CI/CD

## 1. Étapes du workflow

Le projet BobApp dispose de **6 workflows GitHub Actions**, déclenchés sur `push` ou `pull_request` vers `main`.

---

### 1.1 Backend Test (`backend-test.yml`)

**Déclencheur :** push/PR sur `main` (tous fichiers)

| Étape | Objectif |
|---|---|
| Checkout code | Récupérer le code source avec l'historique complet |
| Set up Java 11 | Installer le JDK Temurin 11 avec cache Maven |
| Run backend tests | Exécuter `mvn clean test jacoco:report` — tests unitaires + rapport de couverture JaCoCo |
| Upload test reports | Archiver les rapports Surefire (résultats de tests) en artifact |
| Upload JaCoCo report | Archiver le rapport HTML de couverture en artifact |

---

### 1.2 Frontend Test (`frontend-test.yml`)

**Déclencheur :** push/PR sur `main` (tous fichiers)

| Étape | Objectif |
|---|---|
| Checkout code | Récupérer le code source |
| Set up Node.js 16 | Installer Node.js avec cache npm |
| Install dependencies | `npm ci` — installation reproductible des dépendances |
| Run tests | `ng test --watch=false --browsers=ChromeHeadless --code-coverage` — tests unitaires Angular avec couverture |
| Upload coverage report | Archiver le rapport de couverture LCOV en artifact |

---

### 1.3 SonarCloud Back (`sonarcloud-back.yml`)

**Déclencheur :** push/PR sur `main` — uniquement si `back/**` est modifié

| Étape | Objectif |
|---|---|
| Checkout code | Récupérer le code avec `fetch-depth: 0` (requis pour les annotations SonarCloud) |
| Set up Java 11 | Installer le JDK Temurin 11 |
| Run backend tests with JaCoCo | Générer le rapport de couverture Java |
| SonarCloud scan | Analyser la qualité du code Java : bugs, vulnérabilités, code smells, couverture |

---

### 1.4 SonarCloud Front (`sonarcloud-front.yml`)

**Déclencheur :** push/PR sur `main` — uniquement si `front/**` est modifié

| Étape | Objectif |
|---|---|
| Checkout code | Récupérer le code avec `fetch-depth: 0` |
| Set up Node.js 16 | Installer Node.js |
| Install dependencies | `npm ci` |
| Run frontend tests with coverage | Générer le rapport LCOV |
| SonarCloud scan | Analyser la qualité du code TypeScript/Angular : bugs, vulnérabilités, code smells, couverture |

---

### 1.5 Docker Back (`docker-back.yml`)

**Déclencheur :** push sur `main` + `workflow_dispatch` (manuel)

| Étape | Objectif |
|---|---|
| Checkout code | Récupérer le code source |
| Set up Docker Buildx | Activer le builder multi-plateforme |
| Login to Docker Hub | S'authentifier sur Docker Hub via secrets |
| Extract metadata | Générer automatiquement les tags (`latest` + SHA du commit) et labels OCI |
| Build and push backend image | Construire l'image depuis `back/Dockerfile` et la pousser sur `rahimizainab/bobapp-back` |

---

### 1.6 Docker Front (`docker-front.yml`)

**Déclencheur :** push sur `main` + `workflow_dispatch` (manuel)

| Étape | Objectif |
|---|---|
| Checkout code | Récupérer le code source |
| Set up Docker Buildx | Activer le builder multi-plateforme |
| Login to Docker Hub | S'authentifier sur Docker Hub via secrets |
| Extract metadata | Générer les tags (`latest` + SHA) et labels OCI |
| Build and push frontend image | Construire l'image depuis `front/Dockerfile` et la pousser sur `rahimizainab/bobapp-front` |

---

## 2. KPIs proposés

### KPI 1 — Couverture de code minimale : **80%**

La couverture de code mesure le pourcentage de lignes de code exécutées lors des tests automatisés.

- **Seuil minimum :** 80% (back-end et front-end)
- **Justification :** En dessous de 80%, des comportements non testés représentent un risque significatif de régression en production. Ce seuil est une pratique standard de l'industrie pour les applications critiques.
- **Outil de mesure :** JaCoCo (Java) + Karma/LCOV (Angular), remontés dans SonarCloud
- **Action si non respecté :** Le Quality Gate SonarCloud échoue, bloquant le merge de la PR

---

### KPI 2 — Zéro bug critique ou bloquant en production : **0 bug de sévérité High/Critical**

SonarCloud classe les bugs par sévérité : Info, Low, Medium, High, Critical.

- **Seuil :** Aucun bug de sévérité **High** ou **Critical** sur la branche `main`
- **Justification :** Les bugs critiques indiquent des défauts qui peuvent provoquer des pannes en production ou des comportements imprévisibles (ex. : `new Random()` recréé à chaque appel au lieu d'être réutilisé). Ces anomalies doivent être résolues avant tout déploiement.
- **Outil de mesure :** SonarCloud — onglet Issues, filtre Reliability
- **Action si non respecté :** Ouverture d'un ticket prioritaire, correction avant le prochain déploiement

---

### KPI 3 (bonus) — Aucune vulnérabilité de sécurité : **Security Rating ≥ A**

- **Seuil :** Security Rating A (aucune vulnérabilité de sévérité Medium ou supérieure)
- **Justification :** BobApp gère des interactions utilisateur via une API REST exposée. Les failles de sécurité dans les ressources chargées sans contrôle d'intégrité (ex. : `index.html`) exposent les utilisateurs à des attaques XSS ou injection de script.

---

## 3. Métriques actuelles (analyse SonarCloud — juin 2026)

### 3.1 Couverture de code

| Composant | Couverture globale | Lignes couvertes | Conditions couvertes |
|---|---|---|---|
| **Back-end (Java)** | **38.8%** | 34/62 lignes | 2/4 conditions |
| **Front-end (Angular)** | **58.8%** | — | — |
| **Total projet** | **43.9%** | 27/62 lignes non couvertes | 2/4 conditions non couvertes |

> ⚠️ **Les deux composants sont en dessous du KPI de 80%.** Des efforts de tests sont nécessaires.

---

### 3.2 Bugs détectés

| Fichier | Sévérité | Description | Priorité |
|---|---|---|---|
| `JokeService.java` L22 | **Critical / High** | `new Random()` créé à chaque appel au lieu d'être réutilisé — peut provoquer une mauvaise distribution aléatoire | 🔴 P1 |

---

### 3.3 Vulnérabilités de sécurité

| Fichier | Sévérité | Description |
|---|---|---|
| `index.html` L10 | Minor | Script externe chargé sans attribut `integrity` (SRI) — risque d'injection |
| `index.html` L11 | Minor | Idem — second script externe sans SRI |

---

### 3.4 Code smells (maintenabilité)

| Fichier | Sévérité | Description |
|---|---|---|
| `Joke.java` L4 | Major | Champ `joke` devrait être `static final` ou encapsulé avec accesseurs |
| `Joke.java` L5 | Minor | Champ `response` devrait être `static final` ou encapsulé |
| `Joke.java` L4 | Major | Renommer le champ `joke` (nom identique à la classe) |
| `JsonReader.java` L16 | Info | Pattern Singleton détecté — vérifier si c'est intentionnel |
| `JsonReader.java` L29 | Minor | Ordre des modificateurs non conforme à la Java Language Specification |
| `app.component.ts` L15 | Major | `jokesService` devrait être `readonly` |
| `jokes.service.ts` L11 | Major | `pathService` devrait être `readonly` |
| `jokes.service.ts` L13 | Major | `subject` devrait être `readonly` |
| `jokes.service.ts` L15 | Major | `httpClient` devrait être `readonly` |
| `environment.ts` L16 | Major | Code commenté à supprimer |

---

## 4. Retours utilisateurs et problèmes prioritaires

### 4.1 Retours utilisateurs (Notes et avis)

Les retours suivants ont été remontés par les utilisateurs de BobApp :

- **"Lorsque je poste un commentaire ou une suggestion de blague, je n'ai aucun retour visuel indiquant que mon action a été prise en compte."**  
  → Absence de feedback UI (loader, confirmation, message d'erreur) lors des actions utilisateur.

- **"Parfois l'application ne répond plus et je dois recharger la page."**  
  → Probablement lié au bug `new Random()` dans `JokeService` ou à des erreurs non gérées dans les appels HTTP.

- **"Je ne vois jamais les mêmes blagues, il y en a une qui revient tout le temps."**  
  → Directement lié au bug critique : `new Random()` recréé à chaque appel produit une distribution non uniforme.

### 4.2 Problèmes à résoudre en priorité

| Priorité | Problème | Impact | Source |
|---|---|---|---|
| 🔴 P1 | Bug `new Random()` dans `JokeService` — distribution aléatoire non uniforme | Une seule blague revient en boucle | SonarCloud + retour utilisateur |
| 🔴 P1 | Couverture de code back-end à 38.8% (KPI = 80%) | Risque élevé de régression non détectée | SonarCloud |
| 🟠 P2 | Couverture de code front-end à 58.8% (KPI = 80%) | Tests insuffisants sur les services Angular | SonarCloud |
| 🟠 P2 | Absence de feedback visuel lors des actions utilisateur | Mauvaise expérience utilisateur | Retour utilisateur |
| 🟡 P3 | Champs publics non encapsulés dans `Joke.java` | Risque de modification accidentelle de l'état | SonarCloud |
| 🟡 P3 | Scripts HTML sans attribut `integrity` (SRI) | Vulnérabilité sécurité mineure | SonarCloud |
| 🟢 P4 | Code commenté dans `environment.ts` | Dette technique / lisibilité | SonarCloud |
