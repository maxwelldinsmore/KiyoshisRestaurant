import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kiyoshi.cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem("kiyoshi.cart", JSON.stringify(newItems));
    } catch {}
  };

  const addToCart = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      const updated = existing
        ? prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...item, qty: 1 }];
      try { localStorage.setItem("kiyoshi.cart", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const removeFromCart = (name) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.name !== name);
      try { localStorage.setItem("kiyoshi.cart", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Wired in qty updates in the cart page so I can use the same in checkout page without needing to add a separate update function there. 
  const updateItemQty = (name, nextQty) => {
    setItems((prev) => {
      const updated = prev
        .map((i) => (i.name === name ? { ...i, qty: Number(nextQty) } : i))
        .filter((i) => Number(i.qty) > 0);
      try { localStorage.setItem("kiyoshi.cart", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    try { localStorage.removeItem("kiyoshi.cart"); } catch {}
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateItemQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
