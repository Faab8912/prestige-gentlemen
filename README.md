# PRESTIGE GENTLEMEN

Site e-commerce de costumes de mariage et accessoires pour hommes

---

## TABLE DES MATIÈRES

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Utilisation](#utilisation)
- [API REST](#api-rest)
- [Base de données](#base-de-données)
- [Sécurité](#sécurité)
- [Design](#design)
- [Compétences développées](#compétences-développées)
- [Auteur](#auteur)

---

## DESCRIPTION

Prestige Gentlemen est une application web full-stack de vente en ligne spécialisée dans les costumes de mariage haut de gamme et accessoires pour hommes. Ce projet a été développé dans le cadre de la formation **Titre Professionnel Développeur Web et Web Mobile** dispensée par le Centre Européen de Formation.

L'application permet aux utilisateurs de consulter un catalogue de produits, de sélectionner des articles avec leurs variantes (taille, couleur), de gérer un panier d'achat et de passer des commandes en ligne après authentification.

**Contexte:** Projet de certification professionnelle  
**Période de développement:** Janvier - Avril 2026  
**Durée:** 3 mois  
**Type:** Projet individuel

---

## FONCTIONNALITÉS

### Espace Client

- Consultation du catalogue de produits (12 produits)
- Filtrage par catégorie (Costumes 3 pièces, Smokings, Chemises, Accessoires, Chaussures)
- Fiche produit détaillée avec :
  - Images haute qualité
  - Description complète
  - Sélection de variantes (taille, couleur)
  - Indication du stock disponible
  - Prix
- Gestion du panier d'achat :
  - Ajout/modification/suppression d'articles
  - Calcul automatique du total
  - Persistance des données
- Authentification utilisateur :
  - Inscription avec validation des données
  - Connexion sécurisée
  - Gestion de session
- Passation de commande avec enregistrement en base de données
- Interface responsive adaptée à tous les écrans

### Espace Administration

- Accès sécurisé réservé aux administrateurs
- Gestion du catalogue produits

### Fonctionnalités Techniques

- API REST complète et documentée
- Authentification par token JWT
- Architecture MVC côté serveur
- Gestion d'état globale avec Context API
- Routage côté client avec React Router
- Requêtes asynchrones avec Axios
- Hashage des mots de passe avec bcrypt
- Gestion des erreurs centralisée
- Base de données hybride (SQL + NoSQL)

---

## TECHNOLOGIES UTILISÉES

### Frontend

| Technologie      | Version | Utilisation                                          |
| ---------------- | ------- | ---------------------------------------------------- |
| React            | 18.x    | Bibliothèque JavaScript pour l'interface utilisateur |
| React Router DOM | 6.x     | Gestion du routage côté client                       |
| React Bootstrap  | 2.x     | Framework CSS et composants UI                       |
| Bootstrap        | 5.x     | Framework CSS responsive                             |
| Axios            | 1.x     | Client HTTP pour les appels API                      |
| Context API      | -       | Gestion d'état globale (panier)                      |

### Backend

| Technologie  | Version | Utilisation                            |
| ------------ | ------- | -------------------------------------- |
| Node.js      | 14+     | Environnement d'exécution JavaScript   |
| Express.js   | 4.x     | Framework web pour Node.js             |
| MySQL        | 8.x     | Base de données relationnelle          |
| MongoDB      | 4+      | Base de données NoSQL                  |
| jsonwebtoken | 9.x     | Génération et validation de tokens JWT |
| bcrypt       | 5.x     | Hashage des mots de passe              |
| cors         | 2.x     | Gestion des requêtes cross-origin      |
| dotenv       | 16.x    | Gestion des variables d'environnement  |

### Outils de développement

- Visual Studio Code
- Git / GitHub
- phpMyAdmin
- MongoDB Compass
- Postman (tests API)
- npm

---

## ARCHITECTURE

L'application suit une architecture client-serveur avec séparation claire des responsabilités :

**Frontend (Port 3000)**

- Interface utilisateur développée en React
- Communication avec le backend via API REST
- Gestion d'état avec Context API pour le panier
- Routage client-side avec React Router

**Backend (Port 8000)**

- Serveur Express.js suivant le pattern MVC
- API REST pour toutes les opérations CRUD
- Authentification stateless avec JWT
- Connexion à deux bases de données (MySQL et MongoDB)

**Base de données**

- MySQL : données relationnelles (produits, commandes, utilisateurs, variantes)
- MongoDB : données non-relationnelles (avis clients)

---

## STRUCTURE DU PROJET

prestige-gentlemen/
├── frontend/ # APPLICATION REACT
│ ├── public/
│ │ ├── images/ # Images des produits
│ │ │ ├── costume-marine.jpg
│ │ │ ├── costume-blanc.jpg
│ │ │ ├── costume-noir.jpg
│ │ │ ├── costume-gris.jpg
│ │ │ ├── costume-vert.jpg
│ │ │ ├── costume-bleu-fonce.jpg
│ │ │ ├── smoking.jpg
│ │ │ ├── costume-bleu-roi.jpg
│ │ │ ├── chemise-blanche.jpg
│ │ │ ├── cravate.jpg
│ │ │ ├── noeud-papillon.jpg
│ │ │ └── chaussures.jpg
│ │ ├── favicon.ico
│ │ └── index.html # Point d'entrée HTML
│ │
│ ├── src/
│ │ ├── components/ # Composants réutilisables
│ │ │ ├── Header.js # En-tête avec navigation
│ │ │ └── Footer.js # Pied de page
│ │ │
│ │ ├── pages/ # Pages de l'application
│ │ │ ├── HomePage.js # Page d'accueil avec produits mis en avant
│ │ │ ├── ProductsPage.js # Catalogue complet avec filtres
│ │ │ ├── ProductDetailPage.js # Détails produit avec variantes
│ │ │ ├── CartPage.js # Panier d'achat
│ │ │ ├── LoginPage.js # Authentification
│ │ │ ├── RegisterPage.js # Inscription
│ │ │ └── AdminPage.js # Interface administration
│ │ │
│ │ ├── context/ # Gestion d'état global
│ │ │ └── CartContext.js # Context API pour le panier
│ │ │
│ │ ├── services/ # Services API
│ │ │ └── api.js # Configuration Axios et endpoints
│ │ │ # - productAPI (CRUD produits)
│ │ │ # - orderAPI (création commandes)
│ │ │ # - authAPI (authentification)
│ │ │ # - reviewAPI (avis clients)
│ │ │
│ │ ├── App.js # Composant racine et routage
│ │ ├── index.js # Point d'entrée React
│ │ └── index.css # Styles globaux
│ │
│ ├── package.json # Dépendances et scripts npm
│ ├── package-lock.json
│ └── .env # Variables d'environnement
│
├── backend/ # SERVEUR EXPRESS
│ ├── config/
│ │ ├── database.js # Configuration connexion MySQL
│ │ └── mongodb.js # Configuration connexion MongoDB
│ │
│ ├── models/ # Modèles de données (MVC)
│ │ ├── ProductModel.js # Gestion produits (MySQL)
│ │ ├── OrderModel.js # Gestion commandes (MySQL)
│ │ ├── UserModel.js # Gestion utilisateurs (MySQL)
│ │ ├── VariantModel.js # Gestion variantes (MySQL)
│ │ └── ReviewModel.js # Gestion avis (MongoDB)
│ │
│ ├── controllers/ # Contrôleurs (MVC)
│ │ ├── ProductController.js # Logique métier produits
│ │ ├── OrderController.js # Logique métier commandes
│ │ ├── AuthController.js # Logique authentification
│ │ └── ReviewController.js # Logique avis clients
│ │
│ ├── routes/ # Routes API (MVC)
│ │ ├── products.js # Endpoints produits
│ │ ├── orders.js # Endpoints commandes
│ │ ├── auth.js # Endpoints authentification
│ │ ├── reviews.js # Endpoints avis
│ │ └── index.js # Centralisation des routes
│ │
│ ├── middleware/ # Middlewares Express
│ │ ├── auth.js # Vérification JWT
│ │ └── errorHandler.js # Gestion centralisée des erreurs
│ │
│ ├── database/ # Scripts base de données
│ │ └── schema.sql # Script création tables MySQL
│ │ # - categories (6 catégories)
│ │ # - products (12 produits)
│ │ # - users (clients + admin)
│ │ # - orders (commandes)
│ │ # - order_items (lignes de commande)
│ │ # - variants (tailles, couleurs, stock)
│ │
│ ├── server.js # Point d'entrée serveur Express
│ ├── package.json # Dépendances et scripts npm
│ ├── package-lock.json
│ └── .env # Variables d'environnement
│
├── docs/ # DOCUMENTATION
│ └── README.md # Ce fichier
│
└── .gitignore # Fichiers exclus du versioning

---

## PRÉREQUIS

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- **Node.js** : version 14.x ou supérieure
- **npm** : version 6.x ou supérieure
- **MySQL** : version 8.x ou supérieure
- **MongoDB** : version 4.x ou supérieure
- **Git** : pour le clonage du dépôt

Vérification des installations :

    node --version
    npm --version
    mysql --version
    mongod --version

---

## INSTALLATION

### 1. Cloner le dépôt

    git clone https://github.com/Faab8912/prestige-gentlemen.git
    cd prestige-gentlemen

### 2. Installation des dépendances Backend

    cd backend
    npm install

Les dépendances suivantes seront installées :

- express
- mysql2
- mongodb
- jsonwebtoken
- bcrypt
- cors
- dotenv

### 3. Installation des dépendances Frontend

    cd ../frontend
    npm install

Les dépendances suivantes seront installées :

- react
- react-dom
- react-router-dom
- react-bootstrap
- bootstrap
- axios

### 4. Configuration de la base de données MySQL

Démarrez MySQL et créez la base de données :

    mysql -u root -p

Puis exécutez le script de création :

    CREATE DATABASE prestige_gentlemen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    USE prestige_gentlemen;
    SOURCE backend/database/schema.sql;

Le script créera automatiquement :

- 6 tables (categories, products, users, orders, order_items, variants)
- Les données initiales (catégories, produits, variantes, compte admin)

### 5. Configuration de MongoDB

Démarrez le service MongoDB :

    mongod

La collection `reviews` sera créée automatiquement au premier démarrage de l'application.

---

## CONFIGURATION

### Configuration Backend

Créer un fichier `.env` dans le dossier `backend/` :

    # Base de données MySQL
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=prestige_gentlemen

    # Base de données MongoDB
    MONGO_URI=mongodb://localhost:27017/prestige_gentlemen

    # JWT
    JWT_SECRET=votre_secret_jwt_tres_securise_ici

    # Serveur
    PORT=8000

**Important :** Remplacez `votre_secret_jwt_tres_securise_ici` par une chaîne aléatoire sécurisée.

### Configuration Frontend

Créer un fichier `.env` dans le dossier `frontend/` :

    REACT_APP_API_URL=http://localhost:8000

---

## DÉMARRAGE

### Démarrer le serveur Backend

Dans un terminal :

    cd backend
    npm start

Le serveur démarre sur `http://localhost:8000`

Console de confirmation :

    Serveur démarré sur le port 8000
    Connexion MySQL réussie
    Connexion MongoDB réussie

### Démarrer l'application Frontend

Dans un nouveau terminal :

    cd frontend
    npm start

L'application s'ouvre automatiquement sur `http://localhost:3000`

---

Serveur démarré sur le port 8000
Connexion MySQL réussie
Connexion MongoDB réussie

### Démarrer l'application Frontend

Dans un nouveau terminal :

    cd frontend
    npm start

L'application s'ouvre automatiquement sur `http://localhost:3000`

---

## UTILISATION

### Accès à l'application

- **URL** : http://localhost:3000
- **Compte administrateur** :
  - Email : `admin@prestige-gentlemen.com`
  - Mot de passe : `admin123`

### Parcours utilisateur type

1. **Page d'accueil** : Consultation des 3 produits mis en avant
2. **Catalogue** : Navigation dans l'ensemble des produits avec filtres par catégorie
3. **Fiche produit** : Sélection d'un produit, choix de la taille et couleur
4. **Panier** : Ajout au panier et modification des quantités
5. **Inscription/Connexion** : Création de compte ou authentification
6. **Commande** : Validation et enregistrement de la commande

### Catalogue produits

**8 Costumes :**

1. Costume Élégance Marine - 599€
2. Costume Élégance Blanc - 699€
3. Costume 3 pièces Élégance Noire - 549€
4. Costume 3 pièces Gris Anthracite - 529€
5. Costume Élégance Vert - 749€
6. Costume Élégance Bleu Foncé - 449€
7. Smoking Classique Noir - 699€
8. Costume Élégance Bleu Roi - 599€

**4 Accessoires :** 9. Chemise Blanche Premium - 89€ 10. Cravate Soie Collection - 49€ 11. Nœud Papillon Noir Satin - 39€ 12. Richelieu Cuir Noir - 189€

Chaque costume propose 3 tailles (48, 50, 52) avec gestion du stock en temps réel.

---

## API REST

### Endpoints Produits

| Méthode | Endpoint                       | Description             | Authentification |
| ------- | ------------------------------ | ----------------------- | ---------------- |
| GET     | `/api/products`                | Liste tous les produits | Non              |
| GET     | `/api/products/:id`            | Détails d'un produit    | Non              |
| GET     | `/api/products?featured=true`  | Produits mis en avant   | Non              |
| GET     | `/api/products?categoryId=:id` | Produits par catégorie  | Non              |

### Endpoints Authentification

| Méthode | Endpoint             | Description             | Authentification |
| ------- | -------------------- | ----------------------- | ---------------- |
| POST    | `/api/auth/register` | Inscription utilisateur | Non              |
| POST    | `/api/auth/login`    | Connexion utilisateur   | Non              |

**Corps de requête - Register :**

    {
      "name": "Jean Dupont",
      "email": "jean.dupont@email.com",
      "password": "motdepasse123",
      "address": "10 rue de la Paix, 75001 Paris",
      "phone": "0612345678"
    }

**Corps de requête - Login :**

    {
      "email": "jean.dupont@email.com",
      "password": "motdepasse123"
    }

**Réponse - Login :**

    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "Jean Dupont",
        "email": "jean.dupont@email.com"
      }
    }

### Endpoints Commandes

| Méthode | Endpoint      | Description        | Authentification |
| ------- | ------------- | ------------------ | ---------------- |
| POST    | `/api/orders` | Créer une commande | Oui (JWT)        |

**Corps de requête :**

    {
      "items": [
        {
          "productId": 1,
          "productName": "Costume Élégance Noire",
          "variantId": 1,
          "size": "50",
          "color": "Noir",
          "price": 549.00,
          "quantity": 1
        }
      ],
      "totalAmount": 549.00,
      "shippingAddress": "10 rue de la Paix, 75001 Paris"
    }

### Endpoints Avis

| Méthode | Endpoint                  | Description       | Authentification |
| ------- | ------------------------- | ----------------- | ---------------- |
| GET     | `/api/reviews/:productId` | Avis d'un produit | Non              |

---

## BASE DE DONNÉES

### MySQL - Structure relationnelle

**Table : categories**
| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique (PK) |
| name | VARCHAR(100) | Nom de la catégorie |
| slug | VARCHAR(100) | URL-friendly identifier |
| created_at | TIMESTAMP | Date de création |

**Table : products**
| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique (PK) |
| category_id | INT | Référence catégorie (FK) |
| name | VARCHAR(200) | Nom du produit |
| slug | VARCHAR(200) | URL-friendly identifier |
| description | TEXT | Description détaillée |
| base_price | DECIMAL(10,2) | Prix de base |
| image_url | VARCHAR(255) | Chemin de l'image |
| is_featured | TINYINT(1) | Produit mis en avant |
| is_active | TINYINT(1) | Produit actif |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de modification |

**Table : users**
| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique (PK) |
| name | VARCHAR(100) | Nom complet |
| email | VARCHAR(100) | Email (unique) |
| password | VARCHAR(255) | Mot de passe hashé |
| address | TEXT | Adresse complète |
| phone | VARCHAR(20) | Téléphone |
| is_admin | TINYINT(1) | Statut administrateur |
| created_at | TIMESTAMP | Date d'inscription |

**Table : orders**
| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique (PK) |
| user_id | INT | Référence utilisateur (FK) |
| total_amount | DECIMAL(10,2) | Montant total |
| shipping_address | TEXT | Adresse de livraison |
| status | VARCHAR(50) | Statut (pending, completed) |
| created_at | TIMESTAMP | Date de commande |

**Table : order_items**
| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique (PK) |
| order_id | INT | Référence commande (FK) |
| product_id | INT | Référence produit (FK) |
| product_name | VARCHAR(200) | Nom du produit |
| variant_id | INT | Référence variante (FK) |
| size | VARCHAR(10) | Taille |
| color | VARCHAR(50) | Couleur |
| unit_price | DECIMAL(10,2) | Prix unitaire |
| quantity | INT | Quantité |
| subtotal | DECIMAL(10,2) | Sous-total |

**Table : variants**
| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique (PK) |
| product_id | INT | Référence produit (FK) |
| size | VARCHAR(10) | Taille |
| color | VARCHAR(50) | Couleur |
| stock_quantity | INT | Stock disponible |
| price_modifier | DECIMAL(10,2) | Modificateur de prix |
| sku | VARCHAR(50) | Référence unique |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de modification |

### MongoDB - Structure NoSQL

**Collection : reviews**

    {
      "_id": ObjectId,
      "productId": Number,
      "userId": Number,
      "userName": String,
      "rating": Number,
      "comment": String,
      "createdAt": Date
    }

### Relations entre tables

- `products.category_id` → `categories.id` (Many-to-One)
- `variants.product_id` → `products.id` (One-to-Many)
- `orders.user_id` → `users.id` (Many-to-One)
- `order_items.order_id` → `orders.id` (One-to-Many)
- `order_items.product_id` → `products.id` (Many-to-One)
- `order_items.variant_id` → `variants.id` (Many-to-One)

---

## SÉCURITÉ

### Authentification JWT

- Génération de token lors de la connexion
- Durée de validité : 24 heures
- Stockage côté client : localStorage
- Vérification par middleware sur routes protégées
- Format : `Authorization: Bearer <token>`

### Protection des mots de passe

- Hashage avec bcrypt (salt rounds : 10)
- Pas de stockage en clair
- Validation côté serveur

### Sécurité des requêtes

- Validation des données d'entrée
- Protection CORS configurée
- Gestion centralisée des erreurs
- Requêtes préparées (prévention injection SQL)

### Variables sensibles

- Stockage dans fichiers .env (exclus du versioning)
- JWT_SECRET non exposé
- Credentials base de données protégés

---

## DESIGN

### Charte graphique

**Palette de couleurs :**

- Bleu principal : `#00497c` (header, liens, boutons secondaires)
- Bleu clair : `#0074c7` (titre hero, boutons principaux)
- Noir : `#000000` (hero section, texte, bordures)
- Blanc : `#FFFFFF` (fond, texte sur fond sombre)
- Or : `#D4AF37` (badges "Recommandé")
- Gris clair : `#f8f9fa` (fond images en mode contain)

### Typographie

- Police principale : Système par défaut (Bootstrap)
- Tailles : Responsive selon Bootstrap

### Interface responsive

- Mobile first approach
- Breakpoints Bootstrap :
  - xs : < 576px
  - sm : ≥ 576px
  - md : ≥ 768px
  - lg : ≥ 992px
  - xl : ≥ 1200px

### Composants UI

- Navigation : Navbar Bootstrap
- Cards produits : Bootstrap Cards
- Formulaires : Bootstrap Forms
- Boutons : Bootstrap Buttons
- Grilles : Bootstrap Grid System

---

## COMPÉTENCES DÉVELOPPÉES

Ce projet couvre l'intégralité des compétences requises pour le Titre Professionnel Développeur Web et Web Mobile :

### CCP 1 - Développer la partie front-end d'une application web ou web mobile sécurisée

**Compétences mises en œuvre :**

1. **Installer et configurer son environnement de travail**
   - Installation Node.js, npm, React
   - Configuration VS Code
   - Gestion des dépendances avec npm

2. **Maquetter des interfaces utilisateur**
   - 8 pages complètes (Home, Products, ProductDetail, Cart, Login, Register, Admin, NotFound)
   - Wireframing et conception UI
   - Respect de la charte graphique

3. **Réaliser des interfaces utilisateur statiques**
   - HTML5 sémantique
   - CSS3 et Bootstrap 5
   - Composants React réutilisables
   - Design responsive

4. **Développer la partie dynamique des interfaces utilisateur**
   - React (hooks : useState, useEffect)
   - Context API pour gestion d'état globale
   - React Router pour navigation
   - Appels API asynchrones avec Axios
   - Gestion des formulaires
   - Affichage conditionnel

### CCP 2 - Développer la partie back-end d'une application web ou web mobile sécurisée

**Compétences mises en œuvre :**

1. **Mettre en place une base de données relationnelle**
   - Conception du modèle de données (6 tables)
   - Création du schéma MySQL
   - Relations entre tables (clés étrangères)
   - Normalisation des données
   - Index pour optimisation

2. **Développer des composants d'accès aux données SQL et NoSQL**
   - Requêtes SQL (SELECT, INSERT, UPDATE, DELETE)
   - Requêtes préparées pour sécurité
   - Jointures entre tables
   - Connexion MongoDB
   - Opérations CRUD NoSQL

3. **Développer des composants métier côté serveur**
   - Architecture MVC (Models, Controllers, Routes)
   - API REST complète
   - Logique métier (calculs, validations)
   - Authentification JWT
   - Hashage bcrypt
   - Middleware de sécurité
   - Gestion des erreurs

4. **Documenter le déploiement d'une application**
   - README.md complet
   - Instructions d'installation
   - Configuration requise
   - Documentation API
   - Schéma de base de données

---

## AUTEUR

Fabrice Manho - Titre Professionnel Développeur Web et Web Mobile  
Centre Européen de Formation - Promotion Avril 2025 - 2026

---

## LICENCE

Projet pédagogique - CEF 2026  
Images: Pexels.com, Unsplash.com
