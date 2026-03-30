# BobApp — Document d'analyse CI/CD

## 0. Mise en œuvre de la pipeline — Étapes de construction

Cette section retrace chronologiquement les travaux réalisés pour aboutir à une pipeline CI/CD fonctionnelle, en partant du projet brut fourni jusqu'à l'exécution complète et automatisée sur GitHub Actions.

---

### 0.1 Analyse du projet initial

Avant toute automatisation, le projet a été analysé dans son état d'origine :

- **Structure** : le dépôt contient deux applications distinctes, `back/` (Spring Boot, Java 11, Maven) et `front/` (Angular, Node.js, npm), ainsi que des `Dockerfile` pour chacune.
- **Tests back-end** : `mvn clean install` exécuté localement — les tests passent, mais aucun rapport de couverture n'est généré (JaCoCo absent du `pom.xml`).
- **Tests front-end** : `npm test` échoue en environnement sans interface graphique, car Karma est configuré pour lancer un Chrome classique (`browsers: ['Chrome']`), incompatible avec un runner CI.
- **Conclusion** : deux blocages principaux identifiés avant même de rédiger le moindre workflow.

---

### 0.2 Correction des prérequis avant automatisation

#### Back-end — Ajout de JaCoCo dans `pom.xml`

Le projet ne produisait aucun rapport de couverture. Le plugin `jacoco-maven-plugin` (version 0.8.11) a été ajouté dans la section `<build><plugins>` du `pom.xml` avec deux exécutions :

- `prepare-agent` : instrumente la JVM avant l'exécution des tests.
- `report` (phase `test`) : génère le rapport HTML et XML dans `target/site/jacoco/` à l'issue des tests.

Après modification, la commande `mvn clean verify` produit le fichier `target/site/jacoco/jacoco.xml`, nécessaire à SonarCloud pour calculer la couverture back-end.

#### Front-end — Ajout du support ChromeHeadless dans `karma.conf.js`

En environnement CI (GitHub Actions, Ubuntu sans écran), Karma ne peut pas ouvrir un navigateur graphique. Deux modifications ont été apportées à `karma.conf.js` :

1. **Déclaration d'un launcher personnalisé** `ChromeHeadlessCI` basé sur `ChromeHeadless` avec le flag `--no-sandbox` (requis dans les conteneurs Linux sans privilèges) :

```js
customLaunchers: {
  ChromeHeadlessCI: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
}
```

2. **Ajout du reporter `lcovonly`** dans la section `coverageReporter.reporters`, afin de générer le fichier `coverage/bobapp/lcov.info` attendu par SonarCloud pour calculer la couverture front-end :

```js
reporters: [
  { type: 'html' },
  { type: 'text-summary' },
  { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
]
```

Sans ce reporter, SonarCloud reçoit le rapport HTML mais ne peut pas en extraire les taux de couverture par fichier.

---

### 0.3 Création des comptes externes et préparation

#### SonarCloud

- Création d'un compte SonarCloud lié au compte GitHub via OAuth.
- Création automatique du projet **back-end** depuis l'interface SonarCloud (détection du dépôt GitHub) : clé de projet `steflebelge_Gerez-un-projet-collaboratif-en-int-grant-une-demarche-CI-CD`, organisation `steflebelge`.
- Création **manuelle** du projet **front-end** (les projets Angular ne sont pas auto-détectés comme projets Java) : clé `steflebelge_bobapp-front-angular`.
  - **Problème rencontré** : SonarCloud crée par défaut une branche principale nommée `master`. Comme le dépôt GitHub utilise `main`, la Quality Gate ne s'appliquait pas. Correction : renommage de la branche principale dans les paramètres du projet SonarCloud (`master` → `main`).
  - **Problème rencontré** : la notion de *New Code* n'était pas définie, rendant la Quality Gate non calculable. Correction : configuration de la période *New Code* dans SonarCloud (réglée à partir du premier commit d'analyse).
- Génération d'un token SonarCloud pour le back-end et d'un second token dédié au front-end (les deux projets étant distincts dans SonarCloud).

#### Docker Hub

- Création d'un compte Docker Hub (`steflebelge`).
- Création des deux repositories publics : `bobapp-back` et `bobapp-front`.
- Génération d'un token d'accès Docker Hub (préféré au mot de passe, révocable indépendamment).

---

### 0.4 Ajout des secrets dans GitHub

Cinq secrets ont été déclarés dans **Settings → Secrets and variables → Actions** du dépôt GitHub :

| Nom du secret | Contenu |
|---------------|---------|
| `SONAR_TOKEN` | Token SonarCloud pour le projet back-end |
| `SONAR_TOKEN_FRONT` | Token SonarCloud pour le projet front-end |
| `DOCKERHUB_USERNAME` | Nom d'utilisateur Docker Hub (`steflebelge`) |
| `DOCKERHUB_TOKEN` | Token d'accès Docker Hub |

Les secrets sont référencés dans les workflows via `${{ secrets.NOM_SECRET }}` et ne sont jamais exposés dans les logs GitHub.

---

### 0.5 Création du workflow CI (`.github/workflows/ci.yml`)

Le fichier CI a été créé pour s'exécuter sur chaque `pull_request` ciblant `main`. Il comporte deux jobs parallèles :

**Job `test-back`** :
- `actions/setup-java@v4` avec Java 11 (version cible du projet)
- `mvn clean verify` dans `back/` — compile, teste et génère le rapport JaCoCo
- Upload de `back/target/site/jacoco/` comme artifact GitHub (téléchargeable depuis l'interface PR)

**Job `test-front`** :
- `actions/setup-node@v4` avec Node.js 18
- `npm install` puis `npx ng test --watch=false --code-coverage --browsers=ChromeHeadlessCI`
- Upload de `front/coverage/` comme artifact GitHub

L'échec de l'un ou l'autre job bloque le merge grâce à la règle de protection de branche configurée dans GitHub (**Settings → Branches → Branch protection rules → "Require status checks to pass before merging"**).

---

### 0.6 Création du workflow CD (`.github/workflows/cd.yml`)

Le fichier CD s'exécute sur chaque `push` vers `main` (c'est-à-dire après chaque merge de PR). Il est structuré en deux chaînes séquentielles indépendantes (back et front) via `needs:`.

**Points techniques spécifiques résolus lors de la mise en œuvre :**

#### Java 17 pour le job SonarCloud back-end

Le plugin `sonar-maven-plugin` version 4.x (utilisé via `mvn sonar:sonar`) requiert Java 17 minimum, alors que l'application compile et tourne en Java 11. Le job `sonar-back` utilise donc `java-version: '17'` (via `actions/setup-java@v4`), tandis que les jobs de test conservent Java 11. Les deux environnements coexistent sans conflit car chaque job GitHub Actions démarre dans un runner vierge.

#### `fetch-depth: 0` pour les jobs SonarCloud

SonarCloud a besoin de l'historique git complet pour calculer le différentiel entre le nouveau code et l'existant. Sans cette option, un `actions/checkout@v4` par défaut ne récupère qu'un *shallow clone* (profondeur 1), ce qui empêche le calcul correct des métriques sur le *New Code*.

#### Scanner front : `npx sonarqube-scanner@3` (pas @4)

Lors des premiers essais avec `sonarqube-scanner@4`, une erreur `Project not found` était retournée au moment de la soumission des résultats à SonarCloud. Ce comportement est lié au moteur d'analyse SCA (Software Composition Analysis) embarqué dans la version 12.x du scanner engine, qui tente de contacter une API non disponible pour ce projet. Deux corrections ont été appliquées :

1. Utilisation de `npx sonarqube-scanner@3` (version du scanner compatible)
2. Ajout de `sonar.sca.enabled=false` dans `front/sonar-project.properties` pour désactiver explicitement l'analyse SCA

#### `sonar.qualitygate.wait=true`

Sans ce paramètre, les jobs SonarCloud terminent sans attendre le résultat de la Quality Gate, et le pipeline CD continuerait vers la publication Docker même en cas d'échec qualité. Ce paramètre force le job à attendre la réponse de SonarCloud (bloquant entre 10 s et 2 min selon la charge) et à échouer si la Quality Gate n'est pas respectée.

#### Fichier `front/sonar-project.properties`

Pour éviter de surcharger la commande du workflow, les paramètres SonarCloud front-end stables ont été centralisés dans ce fichier (clé de projet, organisation, chemins sources/tests, chemin du rapport lcov, désactivation SCA). Seuls les paramètres variables (token, `qualitygate.wait`) sont passés en ligne de commande.

---

### 0.7 Validation de bout en bout

Une branche de test a été créée, puis une Pull Request ouverte vers `main`. Le workflow CI s'est déclenché automatiquement :

- Les deux jobs (back et front) ont été exécutés avec succès
- Les artifacts de couverture ont été générés et mis à disposition dans l'interface GitHub

Après merge de la PR, le workflow CD s'est déclenché :

- `test-back` et `test-front` repassent en premier
- `sonar-back` et `sonar-front` transmettent les métriques à SonarCloud et attendent la Quality Gate
- `docker-back` et `docker-front` construisent et publient les images sur Docker Hub (`steflebelge/bobapp-back:latest` et `steflebelge/bobapp-front:latest`)

La séquentialité a été vérifiée : en simulant un échec de test, les jobs Docker suivants ne se sont pas exécutés.

---

## 1. Étapes du workflow CI/CD

### 1.1 Workflow CI — Déclenchement sur Pull Request vers `main`

Le workflow CI (`ci.yml`) s'exécute automatiquement à chaque ouverture ou mise à jour d'une Pull Request ciblant la branche `main`. Son objectif est de **bloquer le merge si les tests échouent**, garantissant que seul du code validé intègre la branche principale.

| Étape | Job | Objectif |
|-------|-----|----------|
| Checkout du code | `test-back` / `test-front` | Récupérer le code source de la branche source |
| Configuration Java 11 | `test-back` | Préparer l'environnement d'exécution Maven |
| `mvn clean verify` | `test-back` | Compiler le back-end, exécuter les tests unitaires et générer le rapport de couverture JaCoCo |
| Upload artifact JaCoCo | `test-back` | Rendre le rapport de couverture téléchargeable depuis l'interface GitHub |
| Configuration Node.js 18 | `test-front` | Préparer l'environnement npm/Angular |
| `npm install` | `test-front` | Installer les dépendances Angular |
| `ng test --coverage` | `test-front` | Exécuter les tests unitaires Angular avec Karma/ChromeHeadless et générer la couverture lcov |
| Upload artifact coverage | `test-front` | Rendre le rapport de couverture front téléchargeable |

Les deux jobs (`test-back` et `test-front`) s'exécutent **en parallèle** et de façon **indépendante**. Un échec dans l'un ou l'autre bloque le merge de la PR grâce à la protection de branche GitHub.

---

### 1.2 Workflow CD — Déclenchement sur Push vers `main`

Le workflow CD (`cd.yml`) s'exécute à chaque merge sur `main`. Il est **séquentiel** : chaque étape dépend du succès de la précédente via `needs:`. Son objectif est de **déployer automatiquement les images Docker sur Docker Hub** après avoir validé la qualité du code.

```
test-back ──→ sonar-back ──→ docker-back
test-front ──→ sonar-front ──→ docker-front
```

| Étape | Job | Objectif | Dépend de |
|-------|-----|----------|-----------|
| Tests back | `test-back` | Re-valider les tests Maven (filet de sécurité post-merge) | — |
| Tests front | `test-front` | Re-valider les tests Angular | — |
| Analyse SonarCloud back | `sonar-back` | Envoyer métriques (coverage JaCoCo, bugs, code smells) à SonarCloud et attendre le résultat de la Quality Gate | `test-back` |
| Analyse SonarCloud front | `sonar-front` | Envoyer métriques (coverage lcov, bugs, code smells) à SonarCloud et attendre le résultat de la Quality Gate | `test-front` |
| Build & Push Docker back | `docker-back` | Construire l'image Docker Spring Boot et la publier sur Docker Hub (`steflebelge/bobapp-back:latest`) | `sonar-back` |
| Build & Push Docker front | `docker-front` | Construire l'image Docker Angular et la publier sur Docker Hub (`steflebelge/bobapp-front:latest`) | `sonar-front` |

Si la Quality Gate SonarCloud échoue (`sonar.qualitygate.wait=true`), les jobs Docker ne s'exécutent pas. Aucune image dégradée n'est publiée.

---

## 2. KPIs proposés et Quality Gate

Les KPIs suivants ont été définis pour assurer un niveau de qualité minimal acceptable sur le nouveau code introduit à chaque PR.

| KPI | Seuil | Justification |
|-----|-------|---------------|
| **Couverture de code (Coverage)** | ≥ 80 % | Seuil standard de l'industrie garantissant que la majorité des chemins d'exécution sont testés. Une couverture insuffisante augmente le risque de régressions non détectées. |
| **New Blocker Issues** | 0 | Les blockers représentent des défauts critiques susceptibles de provoquer des crashes ou des failles de sécurité majeures. Aucune tolérance. |
| **New Critical Issues** | 0 | Les critiques sont des problèmes graves pouvant impacter la fiabilité ou la sécurité en production. |
| **Duplications (code dupliqué)** | < 3 % | La duplication augmente le coût de maintenance et le risque d'incohérences. Un seuil de 3 % est réaliste pour une petite équipe. |
| **Reliability Rating** | ≥ A | Indique l'absence de bugs bloquants ou critiques dans le nouveau code. |
| **Security Rating** | ≥ A | Indique l'absence de vulnérabilités de sécurité dans le nouveau code. |
| **Maintainability Rating** | ≥ A | Indique une dette technique maîtrisée (temps de résolution < 5 % du temps de développement). |

La **couverture à 80 %** est le KPI le plus structurant car il impose d'écrire des tests au fur et à mesure du développement, plutôt qu'en rattrapage.

---

## 3. Métriques SonarCloud — État actuel

Les métriques ci-dessous ont été obtenues après la première exécution complète du pipeline CD.

### Back-end (Spring Boot)

| Métrique | Valeur | Statut |
|----------|--------|--------|
| Security Rating | A | ✅ |
| Reliability Rating | D | ❌ |
| Maintainability Rating | A | ✅ |
| Coverage | 38,8 % | ❌ (objectif : 80 %) |
| Bugs | 1 | ❌ |
| Code Smells | — | — |

**Observation** : Le back-end présente un bug identifié par SonarCloud (Reliability D), et une couverture de tests très insuffisante (38,8 %). Ces deux points sont les priorités d'amélioration.

### Front-end (Angular)

| Métrique | Valeur | Statut |
|----------|--------|--------|
| Security Rating | A | ✅ |
| Reliability Rating | A | ✅ |
| Maintainability Rating | A | ✅ |
| Coverage | 47,6 % | ❌ (objectif : 80 %) |
| Bugs | 0 | ✅ |

**Observation** : Le front-end est en meilleur état qualitativement (aucun bug), mais la couverture reste insuffisante (47,6 %).

---

## 4. Notes et avis utilisateurs — Analyse

Les retours suivants ont été publiés en ligne par les utilisateurs de BobApp (note globale : 2 étoiles) :

> ⭐ *"Je mets une étoile car je ne peux pas en mettre zéro ! Impossible de poster une suggestion de blague, le bouton tourne et fait planter mon navigateur !"*

> ⭐⭐ *"#BobApp j'ai remonté un bug sur le post de vidéo il y a deux semaines et il est encore présent ! Les dévs vous faites quoi ?????"*

> ⭐ *"Ça fait une semaine que je ne reçois plus rien, j'ai envoyé un email il y a 5 jours mais toujours pas de nouvelles..."*

> ⭐⭐ *"J'ai supprimé ce site de mes favoris ce matin, dommage, vraiment dommage."*

**Synthèse des problèmes identifiés** :

| # | Problème | Source | Catégorie | Priorité |
|---|----------|--------|-----------|----------|
| 1 | Crash du navigateur lors de la soumission d'une suggestion de blague | Avis #1 | Fiabilité / Fonctionnel | 🔴 Critique |
| 2 | Bug sur le post de vidéo non corrigé depuis 2 semaines | Avis #2 | Fiabilité / Réactivité équipe | 🔴 Critique |
| 3 | Absence de contenu reçu depuis une semaine, sans réponse au support | Avis #3 | Fonctionnel / Support | 🟠 Haute |
| 4 | Expérience utilisateur dégradée conduisant à l'abandon de l'app | Avis #4 | UX général | 🟠 Haute |

---

## 5. Actions correctives priorisées

Sur la base des métriques SonarCloud et des retours utilisateurs, voici les actions à mener par ordre de priorité :

### Priorité 1 — Corriger le bug de soumission de suggestion (crash navigateur)

Directement signalé par l'avis #1 et corrélé au bug back-end identifié par SonarCloud (Reliability D). Le bouton de suggestion qui fait planter le navigateur est probablement lié à une exception non gérée côté serveur.

**Action** : Localiser le bug dans SonarCloud, corriger le code incriminé, écrire un test de non-régression. Vérifier également le comportement front (gestion des erreurs HTTP côté Angular).

### Priorité 2 — Corriger le bug sur le post de vidéo

L'avis #2 signale explicitement un bug sur la fonctionnalité "post de vidéo" non corrigé depuis deux semaines, signe d'un manque de visibilité sur les régressions.

**Action** : Reproduire le bug, identifier la cause racine, corriger et ajouter un test. Mettre en place un suivi des issues pour éviter qu'un bug signalé reste sans réponse visible.

### Priorité 3 — Investiguer l'absence de contenu reçu

L'avis #3 indique ne plus recevoir de contenu depuis une semaine. Cela peut pointer vers une tâche planifiée (scheduler) en erreur silencieuse ou un problème de notifications.

**Action** : Vérifier les logs du service de distribution de blagues en production. Ajouter des tests sur le scheduler et les mécanismes de notification. Améliorer la supervision (alertes en cas d'erreur silencieuse).

### Priorité 4 — Augmenter la couverture de tests back-end (38,8 % → 80 %)

La faible couverture laisse une large surface non testée, ce qui explique les régressions répétées constatées dans les avis.

**Action** : Identifier les classes non couvertes via le rapport JaCoCo et écrire des tests unitaires/d'intégration, en priorisant les services métier (suggestions, vidéos, notifications).

### Priorité 5 — Augmenter la couverture de tests front-end (47,6 % → 80 %)

Même logique côté Angular : les composants non testés sont exposés aux régressions visibles par les utilisateurs.

**Action** : Utiliser le rapport lcov pour cibler les composants non couverts. Prioriser les services Angular gérant les appels API et les interactions utilisateur critiques.
