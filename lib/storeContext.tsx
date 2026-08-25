"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DbService, Product, StoreConfig } from "./dbService";

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  categories: any[];
  settings: StoreConfig | null;
  loading: boolean;
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  mobileNavOpen: boolean;
  searchOpen: boolean;
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQty: (index: number, qty: number) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  checkoutWhatsApp: () => void;
  refreshCatalog: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch initial Firestore catalog and settings
  const refreshCatalog = async () => {
    try {
      const prodList = await DbService.getProducts(true);
      const catList = await DbService.getCategories();
      const config = await DbService.getSettings();
      setProducts(prodList);
      setCategories(catList);
      setSettings(config);
    } catch (e) {
      console.error("Error loading Firestore catalog:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCatalog();

    // Load Cart & Wishlist from localStorage
    try {
      const savedCart = localStorage.getItem("manusdrip_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWish = localStorage.getItem("manusdrip_wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch (e) {
      console.error("Error loading localStorage state:", e);
    }
  }, []);

  // Save Cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("manusdrip_cart", JSON.stringify(newCart));
  };

  // Save Wishlist to localStorage
  const saveWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem("manusdrip_wishlist", JSON.stringify(newWishlist));
  };

  const addToCart = (product: Product, size: string, color: string, qty = 1) => {
    if (product.status === "SOLD_OUT" || product.status === "SOLD OUT") {
      alert("Sorry, this item is sold out.");
      return;
    }

    const existingIdx = cart.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );

    const newCart = [...cart];
    if (existingIdx > -1) {
      newCart[existingIdx].quantity += qty;
    } else {
      newCart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: (product.images && product.images[0]) || "/images/logo/logo.png",
        size,
        color,
        quantity: qty
      });
    }
    saveCart(newCart);
    setCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  const updateCartQty = (index: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(index);
    } else {
      const newCart = [...cart];
      newCart[index].quantity = qty;
      saveCart(newCart);
    }
  };

  const toggleWishlist = (productId: string) => {
    const newWish = [...wishlist];
    const idx = newWish.indexOf(productId);
    if (idx > -1) {
      newWish.splice(idx, 1);
    } else {
      newWish.push(productId);
    }
    saveWishlist(newWish);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;

    const refId = `MD-${Date.now()}`;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const itemsText = cart.map((item, idx) => {
      const host = typeof window !== "undefined" ? window.location.origin : "https://manusdrip.vercel.app";
      const productLink = `${host}/product/${item.id}`;
      return `${idx + 1}. ${item.name}\nSize: ${item.size}\nColor: ${item.color}\nQuantity: ${item.quantity}\nPrice: ₹${item.price.toLocaleString()} each\nProduct Link: ${productLink}`;
    }).join('\n\n');

    const message = `Hi ManusDrip! 👋

I'd like to purchase:

Reference: ${refId}

${itemsText}

Estimated Total: ₹${subtotal.toLocaleString()}

I'm from Hospet and would like to purchase/collect these items directly from the store.

Please confirm availability.

Thank you!`;

    const whatsappNumber = settings?.whatsapp_number || "916366691845";
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      settings,
      loading,
      cart,
      wishlist,
      cartOpen,
      mobileNavOpen,
      searchOpen,
      addToCart,
      removeFromCart,
      updateCartQty,
      toggleWishlist,
      isInWishlist,
      clearCart,
      setCartOpen,
      setMobileNavOpen,
      setSearchOpen,
      checkoutWhatsApp,
      refreshCatalog
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
