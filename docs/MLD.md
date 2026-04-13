# MODÈLE LOGIQUE DE DONNÉES (MLD)

**Projet:** Prestige Gentlemen  
**Type:** Site e-commerce de costumes de mariage  
**SGBD:** MySQL 8.x  
**Encodage:** UTF-8 (utf8mb4_unicode_ci)  
**Date:** Avril 2026

---

## DESCRIPTION

Le Modèle Logique de Données (MLD) traduit le Modèle Conceptuel de Données (MCD) en une structure de tables adaptée au système de gestion de base de données MySQL. Il spécifie les types de données, les contraintes d'intégrité et les index nécessaires à l'implémentation physique.

Ce modèle permet de :
- Définir précisément la structure des tables
- Spécifier les types de données SQL adaptés
- Établir les contraintes d'intégrité référentielle
- Optimiser les performances avec des index
- Préparer l'implémentation dans schema.sql

---

## SCHÉMA RELATIONNEL

```
categories (id, name, slug, created_at)
    PK: id
    UNIQUE: slug

products (id, category_id, name, slug, description, base_price, image_url, 
          is_featured, is_active, created_at, updated_at)
    PK: id
    FK: category_id → categories(id) ON DELETE RESTRICT
    UNIQUE: slug
    INDEX: category_id, is_featured, is_active

variants (id, product_id, size, color, stock_quantity, price_modifier, 
          sku, created_at, updated_at)
    PK: id
    FK: product_id → products(id) ON DELETE CASCADE
    UNIQUE: sku
    INDEX: product_id, stock_quantity

users (id, name, email, password, address, phone, is_admin, created_at)
    PK: id
    UNIQUE: email
    INDEX: email, is_admin

orders (id, user_id, total_amount, shipping_address, status, created_at)
    PK: id
    FK: user_id → users(id) ON DELETE RESTRICT
    INDEX: user_id, status, created_at

order_items (id, order_id, product_id, product_name, variant_id, size, color,
             unit_price, quantity, subtotal)
    PK: id
    FK: order_id → orders(id) ON DELETE CASCADE
    FK: product_id → products(id) ON DELETE RESTRICT
    FK: variant_id → variants(id) ON DELETE RESTRICT
    INDEX: order_id, product_id, variant_id
```

---

## TABLES DÉTAILLÉES

### Table: categories

**Description:** Catégories de produits (Costumes, Smokings, Chemises, Accessoires, Chaussures)

| Colonne    | Type         | Contraintes                    | Description                    |
|------------|--------------|--------------------------------|--------------------------------|
| id         | INT          | PRIMARY KEY, AUTO_INCREMENT    | Identifiant unique             |
| name       | VARCHAR(100) | NOT NULL                       | Nom de la catégorie            |
| slug       | VARCHAR(100) | NOT NULL, UNIQUE               | Identifiant URL-friendly       |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Date de création               |

**Index:**
- PRIMARY KEY (id)
- UNIQUE INDEX (slug)

**Notes:**
- Le slug est utilisé pour les URLs SEO-friendly (ex: /products/costumes-3-pieces)
- Pas de suppression en cascade car les produits doivent rester liés à une catégorie

---

### Table: products

**Description:** Produits disponibles à la vente (costumes, chemises, accessoires)

| Colonne      | Type          | Contraintes                              | Description                        |
|--------------|---------------|------------------------------------------|------------------------------------|
| id           | INT           | PRIMARY KEY, AUTO_INCREMENT              | Identifiant unique                 |
| category_id  | INT           | NOT NULL, FOREIGN KEY → categories(id)   | Référence catégorie                |
| name         | VARCHAR(200)  | NOT NULL                                 | Nom du produit                     |
| slug         | VARCHAR(200)  | NOT NULL, UNIQUE                         | Identifiant URL-friendly           |
| description  | TEXT          | NOT NULL                                 | Description détaillée              |
| base_price   | DECIMAL(10,2) | NOT NULL, CHECK (base_price > 0)         | Prix de base en euros              |
| image_url    | VARCHAR(255)  | NOT NULL                                 | Chemin vers l'image                |
| is_featured  | TINYINT(1)    | DEFAULT 0                                | Mis en avant (0=non, 1=oui)        |
| is_active    | TINYINT(1)    | DEFAULT 1                                | Actif (0=non, 1=oui)               |
| created_at   | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP                | Date de création                   |
| updated_at   | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Date de modification |

**Clés étrangères:**
- category_id REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE

**Index:**
- PRIMARY KEY (id)
- UNIQUE INDEX (slug)
- INDEX (category_id) - pour les requêtes de filtrage par catégorie
- INDEX (is_featured) - pour la page d'accueil
- INDEX (is_active) - pour le filtrage des produits actifs

**Notes:**
- RESTRICT empêche la suppression d'une catégorie si elle contient des produits
- Le prix doit être strictement positif (contrainte CHECK)
- is_featured permet de mettre en avant 3 produits sur la page d'accueil
- is_active = 0 permet de désactiver un produit sans le supprimer

---

### Table: variants

**Description:** Variantes de produits (tailles, couleurs, stock)

| Colonne        | Type          | Contraintes                           | Description                     |
|----------------|---------------|---------------------------------------|---------------------------------|
| id             | INT           | PRIMARY KEY, AUTO_INCREMENT           | Identifiant unique              |
| product_id     | INT           | NOT NULL, FOREIGN KEY → products(id)  | Référence produit               |
| size           | VARCHAR(10)   | NOT NULL                              | Taille (ex: 48, 50, 52)         |
| color          | VARCHAR(50)   | NOT NULL                              | Couleur                         |
| stock_quantity | INT           | NOT NULL, DEFAULT 0, CHECK (stock_quantity >= 0) | Stock disponible |
| price_modifier | DECIMAL(10,2) | DEFAULT 0.00                          | Modificateur de prix            |
| sku            | VARCHAR(50)   | NOT NULL, UNIQUE                      | Référence stock unique          |
| created_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP             | Date de création                |
| updated_at     | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Date de modification |

**Clés étrangères:**
- product_id REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE

**Index:**
- PRIMARY KEY (id)
- UNIQUE INDEX (sku)
- INDEX (product_id) - pour récupérer toutes les variantes d'un produit
- INDEX (stock_quantity) - pour filtrer les variantes en stock

**Notes:**
- CASCADE permet de supprimer automatiquement les variantes si le produit est supprimé
- Le stock ne peut être négatif (contrainte CHECK)
- Le SKU (Stock Keeping Unit) est unique pour chaque variante
- price_modifier permet des surcoûts (ex: +10€ pour grande taille)

---

### Table: users

**Description:** Utilisateurs de la plateforme (clients et administrateurs)

| Colonne    | Type         | Contraintes                    | Description                          |
|------------|--------------|--------------------------------|--------------------------------------|
| id         | INT          | PRIMARY KEY, AUTO_INCREMENT    | Identifiant unique                   |
| name       | VARCHAR(100) | NOT NULL                       | Nom complet                          |
| email      | VARCHAR(100) | NOT NULL, UNIQUE               | Email (login)                        |
| password   | VARCHAR(255) | NOT NULL                       | Mot de passe hashé (bcrypt)          |
| address    | TEXT         | NULL                           | Adresse complète                     |
| phone      | VARCHAR(20)  | NULL                           | Téléphone                            |
| is_admin   | TINYINT(1)   | DEFAULT 0                      | Administrateur (0=non, 1=oui)        |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Date d'inscription                   |

**Index:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email) - pour l'authentification unique
- INDEX (is_admin) - pour filtrer les administrateurs

**Notes:**
- L'email est unique et sert d'identifiant de connexion
- Le mot de passe est hashé avec bcrypt (salt rounds = 10) côté application
- VARCHAR(255) pour password car bcrypt génère des hashs de ~60 caractères
- is_admin = 1 pour le compte administrateur

---

### Table: orders

**Description:** Commandes passées par les utilisateurs

| Colonne          | Type          | Contraintes                        | Description                          |
|------------------|---------------|------------------------------------|--------------------------------------|
| id               | INT           | PRIMARY KEY, AUTO_INCREMENT        | Identifiant unique                   |
| user_id          | INT           | NOT NULL, FOREIGN KEY → users(id)  | Référence utilisateur                |
| total_amount     | DECIMAL(10,2) | NOT NULL, CHECK (total_amount >= 0)| Montant total en euros               |
| shipping_address | TEXT          | NOT NULL                           | Adresse de livraison                 |
| status           | VARCHAR(50)   | NOT NULL, DEFAULT 'pending'        | Statut (pending, completed, cancelled)|
| created_at       | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP          | Date de la commande                  |

**Clés étrangères:**
- user_id REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE

**Index:**
- PRIMARY KEY (id)
- INDEX (user_id) - pour récupérer les commandes d'un utilisateur
- INDEX (status) - pour filtrer par statut
- INDEX (created_at) - pour trier par date

**Notes:**
- RESTRICT empêche la suppression d'un utilisateur ayant des commandes
- Le montant total est calculé comme la somme des subtotal de order_items
- Les statuts possibles: 'pending', 'completed', 'cancelled'
- shipping_address peut différer de l'adresse du profil utilisateur

---

### Table: order_items

**Description:** Lignes de commande (détail des produits commandés)

| Colonne      | Type          | Contraintes                            | Description                        |
|--------------|---------------|----------------------------------------|------------------------------------|
| id           | INT           | PRIMARY KEY, AUTO_INCREMENT            | Identifiant unique                 |
| order_id     | INT           | NOT NULL, FOREIGN KEY → orders(id)     | Référence commande                 |
| product_id   | INT           | NOT NULL, FOREIGN KEY → products(id)   | Référence produit                  |
| product_name | VARCHAR(200)  | NOT NULL                               | Nom produit (dénormalisé)          |
| variant_id   | INT           | NOT NULL, FOREIGN KEY → variants(id)   | Référence variante                 |
| size         | VARCHAR(10)   | NOT NULL                               | Taille (dénormalisé)               |
| color        | VARCHAR(50)   | NOT NULL                               | Couleur (dénormalisé)              |
| unit_price   | DECIMAL(10,2) | NOT NULL, CHECK (unit_price >= 0)      | Prix unitaire (dénormalisé)        |
| quantity     | INT           | NOT NULL, CHECK (quantity > 0)         | Quantité commandée                 |
| subtotal     | DECIMAL(10,2) | NOT NULL, CHECK (subtotal >= 0)        | Sous-total (unit_price × quantity) |

**Clés étrangères:**
- order_id REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
- product_id REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
- variant_id REFERENCES variants(id) ON DELETE RESTRICT ON UPDATE CASCADE

**Index:**
- PRIMARY KEY (id)
- INDEX (order_id) - pour récupérer toutes les lignes d'une commande
- INDEX (product_id) - pour statistiques de ventes par produit
- INDEX (variant_id) - pour statistiques de ventes par variante

**Notes:**
- CASCADE sur order_id: si la commande est supprimée, les lignes le sont aussi
- RESTRICT sur product_id et variant_id: empêche la suppression si référencés
- Les champs dénormalisés (product_name, size, color, unit_price) préservent l'historique
- subtotal = unit_price × quantity (calculé côté application)
- La quantité doit être strictement positive

---

## TYPES DE DONNÉES - JUSTIFICATIONS

### Types numériques

**INT (Integer)**
- Utilisé pour: id, quantities, stock
- Plage: -2,147,483,648 à 2,147,483,647
- AUTO_INCREMENT pour les clés primaires
- Justification: Suffisant pour des millions d'enregistrements

**DECIMAL(10,2)**
- Utilisé pour: prix, montants
- Précision: 10 chiffres dont 2 après la virgule
- Plage: -99,999,999.99 à 99,999,999.99
- Justification: Précision exacte pour calculs monétaires (pas de FLOAT)

**TINYINT(1)**
- Utilisé pour: booléens (is_featured, is_active, is_admin)
- Valeurs: 0 (false) ou 1 (true)
- Justification: Type standard MySQL pour les booléens

---

### Types chaînes de caractères

**VARCHAR(n)**
- Utilisé pour: noms, emails, slugs, couleurs, tailles
- Longueur variable jusqu'à n caractères
- Justification: Économise l'espace par rapport à CHAR

**TEXT**
- Utilisé pour: descriptions, adresses
- Longueur: jusqu'à 65,535 caractères
- Justification: Contenu de longueur variable et potentiellement long

**Choix des longueurs:**
- VARCHAR(10): size (ex: "52")
- VARCHAR(20): phone
- VARCHAR(50): color, status, sku
- VARCHAR(100): name (catégorie/utilisateur), email, slug (catégorie)
- VARCHAR(200): name (produit), slug (produit), product_name
- VARCHAR(255): password (hash bcrypt), image_url

---

### Types temporels

**TIMESTAMP**
- Utilisé pour: created_at, updated_at
- Plage: 1970-01-01 à 2038-01-19
- DEFAULT CURRENT_TIMESTAMP: valeur automatique à la création
- ON UPDATE CURRENT_TIMESTAMP: mise à jour automatique
- Justification: Gestion automatique des dates, fuseau horaire

---

## CONTRAINTES D'INTÉGRITÉ

### Contraintes de domaine

**NOT NULL**
- Appliqué à: presque tous les champs sauf address, phone
- Garantit qu'une valeur est toujours présente
- Exceptions: address et phone peuvent être NULL (optionnels)

**CHECK**
- `base_price > 0`: le prix doit être strictement positif
- `stock_quantity >= 0`: le stock ne peut être négatif
- `total_amount >= 0`: le montant ne peut être négatif
- `unit_price >= 0`: le prix unitaire ne peut être négatif
- `subtotal >= 0`: le sous-total ne peut être négatif
- `quantity > 0`: la quantité doit être strictement positive

**DEFAULT**
- `is_featured DEFAULT 0`: produit non mis en avant par défaut
- `is_active DEFAULT 1`: produit actif par défaut
- `is_admin DEFAULT 0`: utilisateur standard par défaut
- `status DEFAULT 'pending'`: commande en attente par défaut
- `stock_quantity DEFAULT 0`: stock à zéro par défaut
- `price_modifier DEFAULT 0.00`: pas de surcoût par défaut

---

### Contraintes d'unicité

**PRIMARY KEY (id)**
- Sur toutes les tables
- AUTO_INCREMENT pour génération automatique
- Index automatique créé

**UNIQUE**
- `categories.slug`: chaque catégorie a un slug unique
- `products.slug`: chaque produit a un slug unique
- `variants.sku`: chaque variante a un SKU unique
- `users.email`: chaque email est unique (login)

---

### Contraintes référentielles (Foreign Keys)

**ON DELETE RESTRICT**
- `products.category_id → categories.id`
  - Empêche la suppression d'une catégorie si elle contient des produits
- `orders.user_id → users.id`
  - Empêche la suppression d'un utilisateur ayant des commandes
- `order_items.product_id → products.id`
  - Empêche la suppression d'un produit référencé dans des commandes
- `order_items.variant_id → variants.id`
  - Empêche la suppression d'une variante référencée dans des commandes

**ON DELETE CASCADE**
- `variants.product_id → products.id`
  - Supprime automatiquement les variantes si le produit est supprimé
- `order_items.order_id → orders.id`
  - Supprime automatiquement les lignes si la commande est supprimée

**ON UPDATE CASCADE**
- Toutes les clés étrangères
  - Propage automatiquement les modifications d'id (cas rare)

---

## INDEX ET PERFORMANCES

### Index primaires (PRIMARY KEY)
- Créés automatiquement sur les colonnes `id` de toutes les tables
- Type: BTREE (par défaut MySQL)
- Garantit l'unicité et optimise les recherches par id

### Index uniques (UNIQUE)
- `categories.slug`
- `products.slug`
- `variants.sku`
- `users.email`
- Garantit l'unicité et optimise les recherches par ces colonnes

### Index de performance

**Table products:**
- INDEX (category_id): pour `SELECT * FROM products WHERE category_id = ?`
- INDEX (is_featured): pour `SELECT * FROM products WHERE is_featured = 1 LIMIT 3`
- INDEX (is_active): pour `SELECT * FROM products WHERE is_active = 1`

**Table variants:**
- INDEX (product_id): pour `SELECT * FROM variants WHERE product_id = ?`
- INDEX (stock_quantity): pour `SELECT * FROM variants WHERE stock_quantity > 0`

**Table users:**
- INDEX (email): pour l'authentification rapide
- INDEX (is_admin): pour filtrer les administrateurs

**Table orders:**
- INDEX (user_id): pour `SELECT * FROM orders WHERE user_id = ?`
- INDEX (status): pour `SELECT * FROM orders WHERE status = 'pending'`
- INDEX (created_at): pour `ORDER BY created_at DESC`

**Table order_items:**
- INDEX (order_id): pour `SELECT * FROM order_items WHERE order_id = ?`
- INDEX (product_id): pour statistiques de ventes
- INDEX (variant_id): pour statistiques de ventes par variante

---

## DÉNORMALISATION

### Champs dénormalisés dans order_items

**Pourquoi dénormaliser?**

Les champs suivants sont volontairement dupliqués depuis d'autres tables:
- `product_name` (depuis products.name)
- `size` (depuis variants.size)
- `color` (depuis variants.color)
- `unit_price` (calculé depuis products.base_price + variants.price_modifier)

**Justification:**
1. **Historique immuable**: Une commande doit refléter l'état exact au moment de l'achat
2. **Indépendance**: Si un produit est modifié ou supprimé, la commande reste cohérente
3. **Performance**: Pas de JOIN nécessaire pour afficher les détails d'une commande
4. **Conformité légale**: Les factures doivent être inaltérables

**Trade-off:**
- Augmentation de la redondance (quelques Ko par commande)
- Simplification des requêtes et garantie d'intégrité historique

---

## ENCODAGE ET COLLATION

**Encodage:** utf8mb4  
**Collation:** utf8mb4_unicode_ci

**Justification:**
- `utf8mb4`: Support complet Unicode (4 bytes), y compris emojis
- `unicode_ci`: Comparaison insensible à la casse et aux accents
- Standard moderne pour applications internationales

**Configuration MySQL:**
```sql
CREATE DATABASE prestige_gentlemen 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

---

## SCRIPT SQL DE CRÉATION

Le MLD est implémenté dans le fichier `backend/database/schema.sql` avec:
- Définition de toutes les tables
- Toutes les contraintes (PK, FK, UNIQUE, CHECK, DEFAULT)
- Tous les index
- Insertion des données initiales (catégories, produits, variantes, admin)

**Commande d'exécution:**
```sql
SOURCE backend/database/schema.sql;
```

---

## NORMALISATION

Le modèle respecte la **3ème Forme Normale (3NF)**:

**1NF (Première Forme Normale):**
- Tous les attributs sont atomiques (pas de listes ou groupes répétés)
- Chaque table a une clé primaire
- Chaque colonne contient une seule valeur

**2NF (Deuxième Forme Normale):**
- Respecte 1NF
- Tous les attributs non-clés dépendent de la totalité de la clé primaire
- Pas de dépendances partielles

**3NF (Troisième Forme Normale):**
- Respecte 2NF
- Aucune dépendance transitive (attribut non-clé dépendant d'un autre attribut non-clé)
- Exception: dénormalisation volontaire dans order_items pour l'historique

---

## COHÉRENCE AVEC LE PROJET

Ce MLD est parfaitement aligné avec:
- **Le MCD** (transformation directe des entités et relations)
- **Le fichier schema.sql** (implémentation physique)
- **Les modèles Express.js** (ProductModel, OrderModel, UserModel, VariantModel)
- **L'API REST** (endpoints qui manipulent ces tables)
- **Les contraintes métier** (règles de gestion implémentées)

---

## REQUÊTES SQL COURANTES

### Récupérer tous les produits d'une catégorie
```sql
SELECT p.* FROM products p
WHERE p.category_id = ? AND p.is_active = 1;
```

### Récupérer un produit avec ses variantes
```sql
SELECT p.*, v.* FROM products p
LEFT JOIN variants v ON p.id = v.product_id
WHERE p.id = ?;
```

### Récupérer les produits mis en avant
```sql
SELECT * FROM products
WHERE is_featured = 1 AND is_active = 1
LIMIT 3;
```

### Récupérer les commandes d'un utilisateur
```sql
SELECT o.*, oi.* FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = ?
ORDER BY o.created_at DESC;
```

### Vérifier le stock avant commande
```sql
SELECT stock_quantity FROM variants
WHERE id = ? AND stock_quantity >= ?;
```

### Créer une commande avec ses lignes
```sql
-- 1. Créer la commande
INSERT INTO orders (user_id, total_amount, shipping_address, status)
VALUES (?, ?, ?, 'pending');

-- 2. Récupérer l'id
SET @order_id = LAST_INSERT_ID();

-- 3. Insérer les lignes
INSERT INTO order_items (order_id, product_id, product_name, variant_id, 
                         size, color, unit_price, quantity, subtotal)
VALUES (@order_id, ?, ?, ?, ?, ?, ?, ?, ?);

-- 4. Décrémenter le stock
UPDATE variants SET stock_quantity = stock_quantity - ?
WHERE id = ?;
```

---

**Auteur:** Fabrice Manho  
**Formation:** Titre Professionnel Développeur Web et Web Mobile  
**Organisme:** Centre Européen de Formation  
**Date:** Avril 2026
