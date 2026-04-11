import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = (product, variant, quantity = 1) => {
    const cartItem = {
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      variantSku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: parseFloat(product.base_price),
      quantity: quantity,
      image: product.image_url,
    };

    setCartItems((prevItems) => {
      // Vérifier si le produit (même variant) existe déjà
      const existingItemIndex = prevItems.findIndex(
        (item) => item.variantId === variant.id
      );

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Ajouter nouveau produit
        return [...prevItems, cartItem];
      }
    });
  };

  // Retirer un produit du panier
  const removeFromCart = (variantId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.variantId !== variantId)
    );
  };

  // Modifier la quantité d'un produit
  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity: quantity } : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculer le total
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Nombre total d'articles
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
