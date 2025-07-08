'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { usePanier } from '@/hooks/usePanier';

export default function Friperie() {
  const [articles, setArticles] = useState<any[]>([]);
  const { ajouterArticle } = usePanier();

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('en_vente', true);

      if (!error && data) setArticles(data);
    };

    fetchArticles();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Friperie G-trendy 🛍</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded shadow p-4">
            <img src={article.image_url} alt={article.titre} className="w-full h-60 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{article.titre}</h2>
            <p className="text-sm text-gray-600">{article.description}</p>
            <p className="text-blue-600 font-bold mt-2">{article.valeur_jeton} jetons (valeur indicative)</p>

            <button
              onClick={() =>
                ajouterArticle({
                  id: article.id,
                  titre: article.titre,
                  image_url: article.image_url,
                  valeur_jeton: article.valeur_jeton || 1,
                  taille: 'Unique',
                })
              }
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🛍 Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
