import React, { createContext, useContext, useEffect, useState } from "react";

const LikesContext = createContext(null);
const LIKES_KEY = "themet_liked_artworks";

export function LikesProvider({ children }) {
  const [likedArtworks, setLikedArtworks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(LIKES_KEY);
    if (stored) setLikedArtworks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likedArtworks));
  }, [likedArtworks]);

  const toggleLike = (artwork) => {
    setLikedArtworks((prev) => {
      const exists = prev.find((a) => a.id === artwork.id);
      if (exists) return prev.filter((a) => a.id !== artwork.id);
      return [...prev, { ...artwork }];
    });
  };

  const isLiked = (id) => likedArtworks.some((a) => a.id === id);

  return (
    <LikesContext.Provider value={{ likedArtworks, toggleLike, isLiked }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  return useContext(LikesContext);
}
