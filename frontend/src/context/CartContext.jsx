import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.food === food._id);
      if (existing) {
        return prev.map((i) =>
          i.food === food._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          food: food._id,
          name: food.name,
          image: food.image,
          price: food.discountPrice > 0 ? food.discountPrice : food.price,
          quantity,
        },
      ];
    });
    toast.success(`${food.name} added to cart`);
  };

  const removeFromCart = (foodId) => {
    setItems((prev) => prev.filter((i) => i.food !== foodId));
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.food === foodId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
