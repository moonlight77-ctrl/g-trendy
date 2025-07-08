'use client';

import { useEffect, useState } from 'react';

export interface ArticlePanier {
  id: string;
  titre: string;
  image_url: string;
  valeur_jeton: number;
  taille: string;
}

const PANIER_KEY = 'grandressing_panier';

export function usePanier() {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);

  // Charger au démarrage
  useEffect(() => {
    const data = localStorage.getItem(PANIER_KEY);
    if (data) {
      setArticles(JSON.parse(data));
    }
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem(PANIER_KEY, JSON.stringify(articles));
  }, [articles]);

  const ajouterArticle = (article: ArticlePanier) => {
    setArticles((prev) => [...prev, article]);
  };

  const supprimerArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const viderPanier = () => {
    setArticles([]);
  };

  return {
    articles,
    ajouterArticle,
    supprimerArticle,
    viderPanier,
  };
}
