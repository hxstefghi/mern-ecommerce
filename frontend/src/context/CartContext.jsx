import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../lib/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [synced, setSynced] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Sync server cart with local state when user is logged in
  const syncServerCart = async (cartData) => {
    if (!user) return;
    try {
      const payload = cartData.map((item) => ({ 
        product: item._id || item.product, 
        quantity: item.quantity 
      }));
      await api.put("/users/cart", { cart: payload });
    } catch (err) {
      console.error("Failed to sync cart to server:", err);
    }
  };

  // Sync local cart with user's server cart when user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (!user) {
        // user logged out: clear local cart
        setCart([]);
        localStorage.removeItem("cart");
        setSynced(false);
        return;
      }

      // Only sync once per login session
      if (synced) return;

      try {
        // If local cart has items, send to server to merge (on login)
        if (cart && cart.length > 0) {
          const payload = cart.map((item) => ({ product: item._id, quantity: item.quantity }));
          const res = await api.post("/users/cart/merge", { cart: payload });
          if (res.data?.cart) {
            // server returns populated cart (with product details)
            setCart(res.data.cart);
          }
        } else {
          // Local cart empty: fetch server cart and set locally
          const res = await api.get("/users/cart");
          if (res.data?.cart) {
            setCart(res.data.cart);
          }
        }
        setSynced(true);
      } catch (err) {
        console.error("Cart sync failed:", err);
      }
    };

    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      // Sync to server if logged in
      if (user) syncServerCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item._id !== productId);
      // Sync to server if logged in
      if (user) syncServerCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      // Sync to server if logged in
      if (user) syncServerCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    // Sync empty cart to server if logged in
    if (user) syncServerCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
