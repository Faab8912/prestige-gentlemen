# Prestige Gentlemen

E-commerce de costumes de mariage haut de gamme

## Description

Prestige Gentlemen est une plateforme e-commerce spécialisée dans la vente de costumes de mariage, smokings et accessoires pour mariés. Application Full-Stack développée avec React et Node.js.

## Technologies utilisées

### Frontend

- React 18
- React Router DOM
- Bootstrap 5
- Axios

### Backend

- Node.js
- Express
- MySQL (base relationnelle)
- MongoDB (base NoSQL)
- JWT (authentification)
- Bcrypt (sécurité mots de passe)

## Prérequis

- Node.js >= 18.0
- MySQL >= 8.0
- MongoDB >= 6.0
- npm ou yarn

## Installation

### 1. Cloner le projet

git clone [url-du-repo]
cd prestige-gentlemen

### 2. Installer les dépendances backend

cd backend
npm install

### 3. Installer les dépendances frontend

cd ../frontend
npm install

### 4. Configurer les variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` avec:

PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prestige_gentlemen
MONGO_URI=mongodb://localhost:27017/prestige_gentlemen
JWT_SECRET=votre_secret_jwt

### 5. Créer la base de données MySQL

mysql -u root -p < database/schema.sql

### 6. Lancer l'application

Terminal 1 (Backend):

cd backend
npm run dev

Terminal 2 (Frontend):

cd frontend
npm start

## Fonctionnalités

### Client

- Catalogue produits avec filtres avancés (marque, taille, couleur, prix)
- Fiche produit détaillée
- Panier d'achat dynamique
- Système de favoris
- Authentification utilisateur
- Historique des commandes
- Avis et notes produits

### Admin

- Gestion produits (CRUD)
- Gestion stock par taille/couleur
- Gestion des commandes
- Dashboard statistiques

## Structure du projet

prestige-gentlemen/
├── backend/ # API Node.js + Express
├── frontend/ # Application React
├── database/ # Scripts SQL
├── documentation/ # MCD, MLD, Figma
└── README.md

## Palette de couleurs

- Primaire: #0074c7 (Bleu royal)
- Secondaire: #00497c (Bleu foncé)
- Accent: #D4AF37 (Or)
- Blanc: #FFFFFF
- Noir: #000000
- Gris clair: #F5F5F5

## Licence

Projet réalisé dans le cadre du Titre Professionnel Développeur Web et Web Mobile
