# MCD - Prestige Gentlemen

## Modèle Conceptuel de Données

### Vue d'ensemble

E-commerce de costumes de mariage haut de gamme avec architecture dual-database (MySQL + MongoDB).

---

## ENTITÉS MYSQL (Base relationnelle)

### USER

- id (PK)
- first_name
- last_name
- email (UNIQUE)
- password
- phone
- role (ENUM: client, admin)
- created_at
- updated_at

### CATEGORY

- id (PK)
- name (UNIQUE)
- slug (UNIQUE)
- description
- image_url
- display_order
- created_at

### PRODUCT

- id (PK)
- category_id (FK → CATEGORY)
- name
- slug (UNIQUE)
- description
- base_price
- image_url
- is_featured
- is_active
- created_at
- updated_at

### VARIANT

- id (PK)
- product_id (FK → PRODUCT)
- size
- color
- stock_quantity
- price_modifier
- sku (UNIQUE)
- created_at
- updated_at

### ORDER

- id (PK)
- user_id (FK → USER)
- order_number (UNIQUE)
- total_amount
- status (ENUM: pending, confirmed, shipped, delivered, cancelled)
- shipping_address
- shipping_city
- shipping_postal_code
- shipping_country
- payment_method
- payment_status (ENUM: pending, completed, failed)
- notes
- created_at
- updated_at

### ORDER_ITEM

- id (PK)
- order_id (FK → ORDER)
- variant_id (FK → VARIANT)
- product_name
- size
- color
- quantity
- unit_price
- subtotal
- created_at

---

## ENTITÉS MONGODB (Base NoSQL)

### REVIEW

- \_id (ObjectId)
- productId (référence PRODUCT.id)
- userId (référence USER.id)
- userName
- rating (1-5)
- comment
- verified
- createdAt

### LOG

- \_id (ObjectId)
- userId (référence USER.id)
- userEmail
- action (login, logout, register, order_created, etc.)
- details (objet JSON)
- ipAddress
- userAgent
- createdAt

### CART_SESSION

- \_id (ObjectId)
- userId (référence USER.id)
- items (tableau d'objets)
- totalAmount
- status (active, abandoned, converted)
- lastModified
- createdAt

---

## RELATIONS

### MySQL Relations

**USER → ORDER** (1,N)

- Un utilisateur peut passer plusieurs commandes
- Une commande appartient à un seul utilisateur

**CATEGORY → PRODUCT** (1,N)

- Une catégorie contient plusieurs produits
- Un produit appartient à une seule catégorie

**PRODUCT → VARIANT** (1,N)

- Un produit a plusieurs variants (tailles, couleurs)
- Un variant appartient à un seul produit

**ORDER → ORDER_ITEM** (1,N)

- Une commande contient plusieurs articles
- Un article appartient à une seule commande

**VARIANT → ORDER_ITEM** (1,N)

- Un variant peut être dans plusieurs commandes
- Un article de commande référence un variant

### MongoDB Relations (références)

**PRODUCT ← REVIEW** (1,N)

- Un produit peut avoir plusieurs avis
- Un avis concerne un seul produit

**USER ← REVIEW** (1,N)

- Un utilisateur peut écrire plusieurs avis
- Un avis est écrit par un seul utilisateur

**USER ← LOG** (1,N)

- Un utilisateur génère plusieurs logs
- Un log concerne un seul utilisateur

**USER ← CART_SESSION** (1,N)

- Un utilisateur peut avoir plusieurs sessions de panier
- Une session appartient à un seul utilisateur

---

## CARDINALITÉS RÉSUMÉES

```
USER (1,N) ─── ORDER
CATEGORY (1,N) ─── PRODUCT
PRODUCT (1,N) ─── VARIANT
PRODUCT (1,N) ─── REVIEW (MongoDB)
ORDER (1,N) ─── ORDER_ITEM
VARIANT (1,N) ─── ORDER_ITEM
USER (1,N) ─── REVIEW (MongoDB)
USER (1,N) ─── LOG (MongoDB)
USER (1,N) ─── CART_SESSION (MongoDB)
```

---

## CONTRAINTES D'INTÉGRITÉ

### Contraintes MySQL

- Clés primaires auto-incrémentées
- Clés étrangères avec CASCADE sur DELETE pour products, variants, order_items
- Clés étrangères avec RESTRICT pour variant dans order_item (éviter suppression si commandé)
- UNIQUE sur email (users), slug (products, categories), sku (variants), order_number
- CHECK: stock_quantity >= 0, quantity > 0, prices >= 0

### Contraintes MongoDB

- Index sur productId et userId pour performance
- Index composé (productId, createdAt) pour reviews
- Validation: rating entre 1 et 5, comment max 1000 caractères
- status ENUM pour cart_sessions

---

## JUSTIFICATION DUAL-DATABASE

### MySQL (Données structurées)

- Relations complexes entre entités
- Intégrité référentielle stricte
- Transactions ACID pour les commandes
- Jointures SQL efficaces

### MongoDB (Données flexibles)

- Reviews avec structure variable
- Logs avec détails JSON dynamiques
- Sessions de panier temporaires
- Performance lecture/écriture rapide
- Pas besoin de jointures
