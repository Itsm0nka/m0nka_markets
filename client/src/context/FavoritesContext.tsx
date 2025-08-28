// context/FavoritesContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";

interface Favorite {
  id: string;
  product: Product;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product: Product) => {
    if (favorites.some((f) => f.id === product._id)) return;
    setFavorites((prev) => [...prev, { id: product._id, product }]);
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
};
