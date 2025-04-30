# Questionnaire

### Objectif des tests unitaires

Quel est l'objectif principal des tests unitaires ?

- B) Vérifier le comportement d'une unité de code isolée

### Utilisation de Gherkin

Gherkin est principalement utilisé pour :

- B) Décrire le comportement attendu dans un format compréhensible par tous

### Principe d'isolation

Expliquez en quoi consiste le principe d'isolation dans les tests unitaires et pourquoi il est important.

L’isolation en test unitaire, c’est le fait de tester une seule fonction ou classe sans dépendre du reste. Si le test échoue, c'est uniquement à cause du code testé et pas à cause d'autre chose autour.

### Origine du BDD

Le BDD est une extension du :

- B) Test Driven Development

### Fonction des tests d'intégration

Les tests d'intégration vérifient principalement :

- B) L'interaction entre différents composants ou modules

### Structure Gherkin

Expliquez la structure d'un scénario Gherkin et donnez un exemple concret.
Un scénario Gherkin est une structure simple en langage naturel pour les devs pour décrire un comportement attendu d’un système. C'est souvent lié à la BDD.

Fonctionnalité: Emprunter un livre
Scénario: Un utilisateur emprunte un livre disponible
Étant donné qu'un utilisateur "Alice" est inscrit
Et qu'un livre de François Damiens est disponible
Quand elle emprunte le livre
Alors le livre doit être marqué comme emprunté
Et il doit apparaître dans la liste des prêts d’Alice

### Mocks en tests unitaires

Dans le contexte des tests unitaires, que sont les "mocks" ?

- B) Des objets qui simulent le comportement de dépendances réelles

### Objectif des tests end-to-end

Les tests end-to-end visent à :

- B) Tester l'application de bout en bout du point de vue de l'utilisateur

### Cycle TDD

Expliquez en détail le cycle Red-Green-Refactor du TDD et ce qui se passe à chaque étape.

Ce cycle permet de partir des tests avant de faire l'implémentation.
Red : tu écris un test qui échoue
Green : tu fais le minimum pour que le test passe
Refactor : tu clean et améliore le code sans casser le test

### Caractéristiques d'un bon test unitaire

Quelle est la caractéristique idéale d'un bon test unitaire ?

- B) Il doit être rapide à exécuter, isolé et répétable

### Mots-clés de Gherkin

Quels sont les mots-clés principaux de Gherkin ?

- C) Feature, Scenario, Given, When, Then

### Tests unitaires vs tests d'intégration

Quelles sont les principales différences entre les tests unitaires et les tests d'intégration ?
Le test unitaire test une fonction ou un composant isolé du code, c'est une seule fonction, une seule classe ou une seule méthode. Il n'y a pas de dépendances ou simulées avec des mocks.
Au contraire les tests d'intégration ont plusieurs vrais dépendances et ils testent plusieurs composants ensemble.
Les tests unitaires sont donc plus simple à maintenir que des tests d'intégrations

### Nom du cycle TDD

Le cycle TDD classique est connu sous le nom de :

- B) Red-Green-Refactor

### Focus des tests fonctionnels

Les tests fonctionnels se concentrent sur :

- C) Le comportement du système par rapport aux spécifications

### BDD et communication d'équipe

Comment le BDD peut-il améliorer la communication entre les équipes techniques et les équipes métier ?

Cela utilise un langage commun qui est clair, structuré et compréhensible par tous grâce a Gherkin notamment.

### Avantage principal du TDD

Quel est l'avantage principal du TDD ?

- C) Il favorise un design modulaire et des interfaces claires

### Avantages et défis des tests end-to-end

Quels sont les avantages et les défis spécifiques liés aux tests end-to-end par rapport aux autres types de tests ?

Avantages e2e :
Simulent le parcours réel d’un utilisateur
Vérifient toutes les couches du système (UI, backend, base de données)
Détectent les problèmes d’intégration globale
Défis e2e :
-Lents à exécuter
-Fragiles (cassent facilement après des changements UI)
-Difficiles à maintenir et à déboguer
-peut nécessité des envrionnements spécifiques pour tournée dans certains cas

### Format des scénarios BDD

Quel est le format typique d'un scénario BDD ?

- B) Étant donné-Quand-Alors

### Avantages et limites des tests unitaires

Décrivez les avantages et les limites des tests unitaires dans un projet de développement logiciel.

Avantages des tests unitaires :

- Rapides à exécuter
- Faciles à isoler et à déboguer
- Détectent les erreurs tôt dans le cycle de développement
  Limites des tests unitaires :
- Ne couvrent pas les interactions entre composants
- Peuvent donner un faux sentiment de sécurité si mal écrits
- N'identifient pas les problèmes d’intégration ou d’UX

### Fonctionnalité de réutilisation dans Gherkin

Quelle est la fonctionnalité de Gherkin qui permet de réutiliser des étapes communes à plusieurs scénarios ?

- B) Background

### Responsabilité des tests fonctionnels

Qui est généralement responsable de l'écriture et de l'exécution des tests fonctionnels ?

- C) Les développeurs et les testeurs QA

### Moment d'écriture du code en TDD

Dans le TDD, à quel moment écrit-on le code de production ?

- C) Après avoir exécuté les tests et constaté leur échec

### Outils pour tests end-to-end

Quel outil est couramment utilisé pour les tests end-to-end d'applications web ?

- C) Playwright

### Différences entre BDD et TDD

En quoi le BDD diffère-t-il du TDD en termes d'approche et d'objectifs ?
TDD est sur l'implémentation technique. on écrit d'abord des tests unitaires. l'objectif est que le code fonctionne comme prévu.
BDD c'est le comportement fonctionnel en langage naturel pour objectif de favoriser la communication entre les équipes

### Défis des tests d'intégration

Quels défis sont fréquemment rencontrés lors de la mise en place de tests d'intégration ?

- D) Toutes les réponses ci-dessus

### Caractéristiques d'un bon test end-to-end

Quelle est la caractéristique d'un bon test end-to-end ?

- B) Il doit simuler avec précision le comportement réel des utilisateurs

### Défis de l'adoption du TDD

Quels sont les défis couramment rencontrés lors de l'adoption du TDD dans une équipe, et comment pourriez-vous les surmonter ?
le temps de faire ça peut être perçu comme perdu, faut prouver que ça réduit les bugs et donc le temps de débogage.
manque d'adhésion et d'expérience avec l'approche il faudrait suivre les cours de Kristen Garnier pour ça.

### Frameworks de tests unitaires

Lequel de ces frameworks n'est PAS utilisé pour les tests unitaires ?

- A) JUnit
- B) NUnit
- D) Vitest

### Rôles dans le processus BDD

Quels rôles sont généralement impliqués dans le processus BDD ?

- D) Développeurs, testeurs, product owners et parties prenantes métier

### Maintenance des tests end-to-end

Comment géreriez-vous la maintenance des tests end-to-end pour une application qui évolue rapidement ?
Se concentrer sur les parcours critiques
Exécuter les tests dans une CI pour les détecter rapidement les problèmes et corrigé le text en fonction.

### Inconvénients des tests fonctionnels

Quel est le principal inconvénient des tests fonctionnels ?

- B) Ils sont généralement lents et coûteux à exécuter

### Intégration de Gherkin en agile

Comment intégreriez-vous Gherkin dans un processus de développement agile ? Quels seraient les avantages ?

Gherkin peut être intégré dans un processus agile en écrivant des scénarios clairs dès la définition des user stories, en collaboration avec les développeurs, testeurs et product owners et parties prenantes. Ces scénarios servent de critères d’acceptation et peuvent être automatisés avec des outils comme Cucumber, puis intégrés dans la CI/CD.

Cela améliore la communication, clarifie les attentes métier, sert de documentation et facilite la détection des régressions.

### Principes du TDD

Lequel des principes suivants n'est PAS associé au TDD ?

- D) Écrire tous les tests à la fin du développement

### Différences entre tests fonctionnels et autres tests

En quoi les tests fonctionnels diffèrent-ils des tests unitaires et d'intégration en termes d'approche et d'objectifs ?

Les tests fonctionnels se concentrent sur le comportement global du système du point de vue de l'utilisateur, en validant que l'application répond aux exigences métier. Contrairement aux tests unitaires, qui vérifient une fonction ou classe isolée, et aux tests d’intégration, qui valident l’interaction entre modules, les tests fonctionnels ignorent l’implémentation interne et se basent sur les résultats observables.

### Approche combinant TDD, BDD et Gherkin

Quelle approche combine naturellement TDD, BDD et Gherkin ?

- B) Specification By Example

### Organisation des tests fonctionnels

Décrivez comment vous organiseriez les tests fonctionnels pour une application web de e-commerce.
Navigation sur le catalogue, ajout d'un produit au panier, paiement, suivi de commande.

### Pyramide de tests

Quelle est la pyramide de tests classique, du bas vers le haut ?

- B) Tests unitaires, Tests d'intégration, Tests fonctionnels, Tests E2E

### Stratégie de test optimale

Comment détermineriez-vous la stratégie de test optimale pour un projet, en considérant les différents types de tests abordés dans ce questionnaire ?
ça dépend du projet, si c'est un projet seul, à plusieurs, entreprise etc..
Mais pour un petit projet je ferais des test unitaires en grande quantité pour la logique de base, des tests d'intégration pour vérifier la communication entre les modules clés. Et aussi des tests fonctionnels ciblés sur les fonctionnalités clés. les e2e ça dépends si je suis en mobile ou pas mais pour un projet web avec Playwright ça se fait bien.

### Quelle est l'erreur récurente qui peut être faite lors de test end 2 end ? (Je l'ai répété pas mal de fois)

oublié de mettre des expect !!!
