import { useState, useEffect } from 'react';
import { Favorite, Product } from '../types';
import toast from 'react-hot-toast';

const FAVORITES_KEY = 'favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const saveToLocalStorage = (items: Favorite[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  };

  const addToFavorites = (product: Product) => {
    if (favorites.some(fav => fav.id === product._id)) return;
    const newFav: Favorite = {
      id: product._id,
      productId: product._id,
      product,
    };
    const updated = [...favorites, newFav];
    setFavorites(updated);
    saveToLocalStorage(updated);
    toast.success('Added to favorites!');
  };

  const removeFromFavorites = (productId: string) => {
    const updated = favorites.filter(fav => fav.productId !== productId);
    setFavorites(updated);
    saveToLocalStorage(updated);
    toast.success('Removed from favorites');
  };

  const isFavorite = (productId: string) => favorites.some(fav => fav.productId === productId);

  return { favorites, addToFavorites, removeFromFavorites, isFavorite };
};
