import { useState, useEffect } from "react";

export interface FavoriteConversionItem {
  id: string;
  fromUnitId: string;
  fromUnitSymbol: string;
  toUnitId: string;
  toUnitSymbol: string;
  categoryId: string;
  categoryName: string;
  slug: string;
}

export function useFavoriteConversions() {
  const [favorites, setFavorites] = useState<FavoriteConversionItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("conversion_favorites");
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse favorites:", e);
        }
      }
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (item: Omit<FavoriteConversionItem, "id">) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.fromUnitId === item.fromUnitId && f.toUnitId === item.toUnitId
      );
      let updated;
      if (exists) {
        // Remove it
        updated = prev.filter(
          (f) => !(f.fromUnitId === item.fromUnitId && f.toUnitId === item.toUnitId)
        );
      } else {
        // Add it
        const newItem: FavoriteConversionItem = {
          ...item,
          id: `${item.fromUnitId}-to-${item.toUnitId}`,
        };
        updated = [newItem, ...prev].slice(0, 10); // Limit to 10 favorites
      }
      localStorage.setItem("conversion_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (fromUnitId: string, toUnitId: string) => {
    return favorites.some((f) => f.fromUnitId === fromUnitId && f.toUnitId === toUnitId);
  };

  return {
    favorites: isMounted ? favorites : [],
    toggleFavorite,
    isFavorite,
    isMounted,
  };
}
