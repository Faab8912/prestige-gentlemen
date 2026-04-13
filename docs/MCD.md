# MODÈLE CONCEPTUEL DE DONNÉES (MCD)

**Projet:** Prestige Gentlemen  
**Type:** Site e-commerce de costumes de mariage  
**Base de données:** MySQL (relationnelle)  
**Date:** Avril 2026

---

## DESCRIPTION

Le Modèle Conceptuel de Données (MCD) représente la structure logique de la base de données de Prestige Gentlemen. Il décrit les entités (objets métier), leurs attributs (propriétés) et les relations qui les lient, indépendamment de toute considération technique d'implémentation.

Ce modèle permet de :
- Comprendre l'organisation des données métier
- Identifier les dépendances entre entités
- Garantir la cohérence et l'intégrité des données
- Faciliter la communication entre développeurs et parties prenantes

---

## ENTITÉS

### 1. CATEGORY (Catégorie de produits)

**Description:** Regroupe les produits par type (Costumes 3 pièces, Smokings, Chemises, Accessoires, Chaussures)

**Attributs:**
- `id` : Identifiant unique de la catégorie (clé primaire)
- `name` : Nom de la catégorie
- `slug` : Identifiant URL-friendly pour le routage
- `created_at` : Date de création de la catégorie

**Exemples:** "Costumes 3 pièces", "Smokings", "Chemises", "Accessoires", "Chaussures"

---

### 2. PRODUCT (Produit)

**Description:** Représente un article en vente (costume, chemise, accessoire)

**Attributs:**
- `id` : Identifiant unique du produit (clé primaire)
- `category_id` : Référence vers la catégorie (clé étrangère)
- `name` : Nom du produit
- `slug` : Identifiant URL-friendly
- `description` : Description détaillée du produit
- `base_price` : Prix de base du produit
- `image_url` : Chemin vers l'image du produit
- `is_featured` : Indicateur de mise en avant (booléen)
- `is_active` : Indicateur de disponibilité (booléen)
- `created_at` : Date de création du produit
- `updated_at` : Date de dernière modification

**Exemples:** "Costume Élégance Marine", "Chemise Blanche Premium", "Cravate Soie Collection"

---

### 3. VARIANT (Variante de produit)

**Description:** Déclinaison d'un produit selon la taille et/ou la couleur avec stock spécifique

**Attributs:**
- `id` : Identifiant unique de la variante (clé primaire)
- `product_id` : Référence vers le produit (clé étrangère)
- `size` : Taille (48, 50, 52 pour les costumes)
- `color` : Couleur de la variante
- `stock_quantity` : Quantité en stock
- `price_modifier` : Modificateur de prix (surcoût éventuel)
- `sku` : Référence unique du stock (Stock Keeping Unit)
- `created_at` : Date de création de la variante
- `updated_at` : Date de dernière modification

**Exemples:** "Costume Marine - Taille 50 - Noir", "Chemise - Taille 42 - Blanc"

---

### 4. USER (Utilisateur)

**Description:** Compte client ou administrateur de la plateforme

**Attributs:**
- `id` : Identifiant unique de l'utilisateur (clé primaire)
- `name` : Nom complet de l'utilisateur
- `email` : Adresse email (unique, utilisée pour la connexion)
- `password` : Mot de passe hashé (bcrypt)
- `address` : Adresse complète de livraison
- `phone` : Numéro de téléphone
- `is_admin` : Indicateur de statut administrateur (booléen)
- `created_at` : Date d'inscription

**Rôles:** Client (is_admin = 0), Administrateur (is_admin = 1)

---

### 5. ORDER (Commande)

**Description:** Commande passée par un utilisateur

**Attributs:**
- `id` : Identifiant unique de la commande (clé primaire)
- `user_id` : Référence vers l'utilisateur (clé étrangère)
- `total_amount` : Montant total de la commande
- `shipping_address` : Adresse de livraison de la commande
- `status` : Statut de la commande (pending, completed, cancelled)
- `created_at` : Date et heure de la commande

**États possibles:** "pending" (en attente), "completed" (validée), "cancelled" (annulée)

---

### 6. ORDER_ITEM (Ligne de commande)

**Description:** Détail d'une ligne de commande (produit commandé avec quantité)

**Attributs:**
- `id` : Identifiant unique de la ligne (clé primaire)
- `order_id` : Référence vers la commande (clé étrangère)
- `product_id` : Référence vers le produit (clé étrangère)
- `product_name` : Nom du produit (dénormalisé pour historique)
- `variant_id` : Référence vers la variante (clé étrangère)
- `size` : Taille commandée (dénormalisé)
- `color` : Couleur commandée (dénormalisé)
- `unit_price` : Prix unitaire au moment de la commande
- `quantity` : Quantité commandée
- `subtotal` : Sous-total de la ligne (unit_price × quantity)

**Note:** Les champs dénormalisés (product_name, size, color, unit_price) permettent de conserver l'historique exact même si le produit est modifié ou supprimé ultérieurement.

---

## RELATIONS ET CARDINALITÉS

### Relation 1 : CATEGORY ←→ PRODUCT

**Type:** Association binaire "appartient à"

**Description:** Une catégorie regroupe plusieurs produits. Chaque produit appartient à une seule catégorie.

**Cardinalités:**
- CATEGORY (1,n) ←→ (1,1) PRODUCT
- Une catégorie contient au minimum 1 produit, au maximum n produits
- Un produit appartient à exactement 1 catégorie

**Contrainte:** Un produit ne peut exister sans catégorie (intégrité référentielle)

---

### Relation 2 : PRODUCT ←→ VARIANT

**Type:** Association binaire "possède"

**Description:** Un produit peut avoir plusieurs variantes (tailles/couleurs). Une variante est liée à un seul produit.

**Cardinalités:**
- PRODUCT (1,1) ←→ (0,n) VARIANT
- Un produit possède au minimum 0 variante, au maximum n variantes
- Une variante appartient à exactement 1 produit

**Contrainte:** Si un produit est supprimé, ses variantes sont également supprimées (CASCADE)

---

### Relation 3 : USER ←→ ORDER

**Type:** Association binaire "passe"

**Description:** Un utilisateur peut passer plusieurs commandes. Chaque commande est liée à un utilisateur.

**Cardinalités:**
- USER (1,1) ←→ (0,n) ORDER
- Un utilisateur passe au minimum 0 commande, au maximum n commandes
- Une commande est passée par exactement 1 utilisateur

**Contrainte:** Un utilisateur ne peut être supprimé s'il a des commandes (RESTRICT)

---

### Relation 4 : ORDER ←→ ORDER_ITEM

**Type:** Association binaire "contient"

**Description:** Une commande contient plusieurs lignes de commande. Chaque ligne appartient à une seule commande.

**Cardinalités:**
- ORDER (1,1) ←→ (1,n) ORDER_ITEM
- Une commande contient au minimum 1 ligne, au maximum n lignes
- Une ligne de commande appartient à exactement 1 commande

**Contrainte:** Si une commande est supprimée, ses lignes sont également supprimées (CASCADE)

---

### Relation 5 : PRODUCT ←→ ORDER_ITEM

**Type:** Association binaire "est commandé dans"

**Description:** Un produit peut apparaître dans plusieurs lignes de commande. Chaque ligne référence un produit.

**Cardinalités:**
- PRODUCT (1,1) ←→ (0,n) ORDER_ITEM
- Un produit apparaît dans au minimum 0 ligne de commande, au maximum n lignes
- Une ligne de commande référence exactement 1 produit

**Note:** Le product_id est conservé pour traçabilité, mais product_name est dénormalisé

---

### Relation 6 : VARIANT ←→ ORDER_ITEM

**Type:** Association binaire "est sélectionné dans"

**Description:** Une variante peut être commandée dans plusieurs lignes. Chaque ligne référence une variante.

**Cardinalités:**
- VARIANT (1,1) ←→ (0,n) ORDER_ITEM
- Une variante apparaît dans au minimum 0 ligne de commande, au maximum n lignes
- Une ligne de commande référence exactement 1 variante

**Note:** Les attributs size et color sont dénormalisés dans ORDER_ITEM pour l'historique

---

## SCHÉMA CONCEPTUEL

```
┌─────────────┐
│  CATEGORY   │
├─────────────┤
│ id (PK)     │
│ name        │
│ slug        │
│ created_at  │
└──────┬──────┘
       │ (1,n)
       │ appartient
       │ (1,1)
       ▼
┌─────────────┐           ┌─────────────┐
│  PRODUCT    │           │   VARIANT   │
├─────────────┤           ├─────────────┤
│ id (PK)     │◄──(1,1)───┤ id (PK)     │
│ category_id │ possède   │ product_id  │
│ name        │  (0,n)    │ size        │
│ description │───────────┤ color       │
│ base_price  │           │ stock_qty   │
│ image_url   │           │ price_mod   │
│ is_featured │           │ sku         │
│ is_active   │           │ created_at  │
│ created_at  │           │ updated_at  │
│ updated_at  │           └──────┬──────┘
└──────┬──────┘                  │ (1,1)
       │ (1,1)                   │ est sélectionné
       │ est commandé            │ dans
       │ dans                    │ (0,n)
       │ (0,n)                   │
       │                         │
       ▼                         ▼
┌─────────────┐           ┌─────────────┐
│ ORDER_ITEM  │           │ ORDER_ITEM  │
├─────────────┤           ├─────────────┤
│ id (PK)     │           │ id (PK)     │
│ order_id    │           │ order_id    │
│ product_id  │           │ variant_id  │
│ variant_id  │           │ size        │
│ product_name│           │ color       │
│ size        │           │ unit_price  │
│ color       │           │ quantity    │
│ unit_price  │           │ subtotal    │
│ quantity    │           └─────────────┘
│ subtotal    │
└──────▲──────┘
       │ (1,n)
       │ contient
       │ (1,1)
       │
┌──────┴──────┐
│   ORDER     │
├─────────────┤
│ id (PK)     │
│ user_id     │
│ total_amount│
│ ship_address│
│ status      │
│ created_at  │
└──────▲──────┘
       │ (0,n)
       │ passe
       │ (1,1)
       │
┌──────┴──────┐
│    USER     │
├─────────────┤
│ id (PK)     │
│ name        │
│ email       │
│ password    │
│ address     │
│ phone       │
│ is_admin    │
│ created_at  │
└─────────────┘
```

---

## RÈGLES DE GESTION

### RG1 : Catégories
- Chaque catégorie doit avoir un nom unique
- Une catégorie ne peut être supprimée si elle contient des produits
- Le slug de la catégorie doit être URL-friendly (lowercase, sans espaces)

### RG2 : Produits
- Chaque produit doit appartenir à une catégorie
- Le prix de base d'un produit doit être supérieur à 0
- Un produit peut être mis en avant (is_featured = 1) pour apparaître en page d'accueil
- Un produit inactif (is_active = 0) n'apparaît pas dans le catalogue client
- Le slug du produit doit être unique

### RG3 : Variantes
- Une variante est obligatoirement liée à un produit
- Le stock d'une variante doit être >= 0
- Le SKU (Stock Keeping Unit) doit être unique
- Si le stock d'une variante est 0, elle ne peut être commandée
- Le price_modifier peut être positif (surcoût) ou 0 (aucun surcoût)

### RG4 : Utilisateurs
- L'email doit être unique dans la base de données
- Le mot de passe doit être hashé avec bcrypt (salt rounds = 10)
- Un utilisateur ne peut être supprimé s'il a passé des commandes
- Par défaut, is_admin = 0 (utilisateur standard)

### RG5 : Commandes
- Une commande doit contenir au minimum 1 ligne de commande
- Le total_amount est calculé comme la somme des subtotal de toutes les lignes
- Le statut par défaut d'une commande est "pending"
- Une commande "completed" ne peut plus être modifiée
- L'adresse de livraison peut différer de l'adresse du profil utilisateur

### RG6 : Lignes de commande
- La quantité commandée doit être >= 1
- Le subtotal est calculé : unit_price × quantity
- Les données produit (name, size, color, unit_price) sont dénormalisées pour conserver l'historique
- Une ligne de commande référence obligatoirement un produit et une variante valides au moment de la commande
- Le stock de la variante est décrémenté de la quantité commandée lors de la validation

---

## CONTRAINTES D'INTÉGRITÉ

### Intégrité de domaine
- Les identifiants (id) sont des entiers positifs auto-incrémentés
- Les prix (base_price, unit_price, total_amount, subtotal) sont des décimaux positifs (DECIMAL 10,2)
- Les booléens (is_featured, is_active, is_admin) sont des TINYINT(1)
- Les emails respectent le format standard (validation côté application)
- Les dates (created_at, updated_at) sont des TIMESTAMP

### Intégrité référentielle
- `product.category_id` référence `category.id` (ON DELETE RESTRICT)
- `variant.product_id` référence `product.id` (ON DELETE CASCADE)
- `order.user_id` référence `user.id` (ON DELETE RESTRICT)
- `order_item.order_id` référence `order.id` (ON DELETE CASCADE)
- `order_item.product_id` référence `product.id` (ON DELETE RESTRICT)
- `order_item.variant_id` référence `variant.id` (ON DELETE RESTRICT)

### Intégrité de clé
- Chaque table possède une clé primaire (id) unique et non nulle
- `user.email` est unique (contrainte UNIQUE)
- `category.slug` est unique (contrainte UNIQUE)
- `product.slug` est unique (contrainte UNIQUE)
- `variant.sku` est unique (contrainte UNIQUE)

---

## DÉNORMALISATION

Certaines données sont volontairement dénormalisées dans la table `ORDER_ITEM` pour des raisons d'historique :

**Champs dénormalisés:**
- `product_name` : conserve le nom du produit au moment de la commande
- `size` : conserve la taille commandée
- `color` : conserve la couleur commandée
- `unit_price` : conserve le prix unitaire au moment de la commande

**Justification:**
- Permet de conserver un historique exact même si le produit est modifié ou supprimé
- Garantit que les factures et commandes passées restent cohérentes
- Évite les problèmes si les prix changent ultérieurement

**Trade-off:**
- Augmentation de la redondance des données
- Gain en traçabilité et intégrité historique

---

## ÉVOLUTIONS POSSIBLES

### Extensions futures du modèle

1. **Gestion des promotions**
   - Ajout d'une entité PROMOTION avec dates de validité et pourcentage de réduction
   - Relation PRODUCT ←→ PROMOTION

2. **Système d'avis clients**
   - Entité REVIEW avec note et commentaire
   - Relation USER ←→ PRODUCT (via REVIEW)
   - Actuellement implémenté en MongoDB (NoSQL)

3. **Gestion des favoris**
   - Table WISHLIST pour les produits favoris
   - Relation USER ←→ PRODUCT (via WISHLIST)

4. **Historique des prix**
   - Entité PRICE_HISTORY pour tracer l'évolution des prix
   - Relation PRODUCT ←→ PRICE_HISTORY

5. **Gestion des images multiples**
   - Entité PRODUCT_IMAGE pour plusieurs photos par produit
   - Relation PRODUCT ←→ PRODUCT_IMAGE (1,n)

---

## COHÉRENCE AVEC LE PROJET

Ce MCD est parfaitement aligné avec :
- **L'architecture MVC** du backend Express.js
- **Les 6 tables MySQL** implémentées dans `database/schema.sql`
- **Les modèles** (`ProductModel.js`, `OrderModel.js`, `UserModel.js`, `VariantModel.js`)
- **Les controllers** qui implémentent les règles de gestion
- **L'API REST** qui expose les opérations CRUD

---

**Auteur:** Fabrice Manho  
**Formation:** Titre Professionnel Développeur Web et Web Mobile  
**Organisme:** Centre Européen de Formation  
**Date:** Avril 2026
