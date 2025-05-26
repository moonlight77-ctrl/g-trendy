'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Article {
  id: string;
  titre: string;
  description: string;
  image_url: string;
  categorie: string;
  prix_location: number;
  niveau: string;
}

export default function Catalogue() {
  const [articles, setArticles] = useState<Article[]>([]);

 useEffect(() => {
  const fetchArticles = async () => {
    const { data, error } = await supabase.from('articles').select('*');
    console.log("data =>", data);
    console.log("error =>", error);
    if (!error && data) setArticles(data);
  };
  fetchArticles();
}, []);


  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Catalogue G-trendy</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((a) => (
          <div key={a.id} className="bg-white rounded shadow p-4">
            <img src={a.image_url} alt={a.titre} className="w-full h-60 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{a.titre}</h2>
            <p className="text-sm text-gray-600">{a.description}</p>
            <p className="text-sm mt-1"><strong>Catégorie :</strong> {a.categorie}</p>
            <p className="text-sm"><strong>Niveau :</strong> {a.niveau}</p>
            <p className="text-blue-600 font-bold mt-2">{a.prix_location} € / location</p>
          </div>
        ))}
      </div>
    </main>
  );
}
