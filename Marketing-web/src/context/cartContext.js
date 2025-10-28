import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.product._id === product._id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.product._id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // If quantity <= 1, don't push the item (effectively removing it)
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
