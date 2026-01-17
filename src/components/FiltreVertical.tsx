'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type FiltreData = {
  type: string | null;
  categorie: string | null;
  genre: string | null;
};

export default function FiltreVertical() {
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [filtres, setFiltres] = useState<{[key: string]: string[]}>({});
  const [genres, setGenres] = useState<string[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extraction dynamique des types/catégories/genres
  useEffect(() => {
    const fetchFiltres = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('type, categorie, genre')
        .eq('est_disponible', true);

      if (error) {
        console.error(error);
        return;
      }
      // Création du mapping type => [catégories]
      const filtresTmp: {[key: string]: Set<string>} = {};
      const genresTmp: Set<string> = new Set();
      data?.forEach((item: FiltreData) => {
        if (item.type && item.categorie) {
          if (!filtresTmp[item.type]) filtresTmp[item.type] = new Set();
          filtresTmp[item.type].add(item.categorie);
        }
        if (item.genre) genresTmp.add(item.genre);
      });

      // Transformation en objets pour React
      const filtresFinal: {[key: string]: string[]} = {};
      Object.keys(filtresTmp).forEach(type => {
        filtresFinal[type] = Array.from(filtresTmp[type]);
      });

      setFiltres(filtresFinal);
      setGenres(Array.from(genresTmp));
    };

    fetchFiltres();
  }, []);

  // Génère l'URL correcte pour les liens selon la page
  const makeHref = (params: { type?: string; categorie?: string; genre?: string }) => {
    const url = new URLSearchParams(searchParams.toString());
    if (params.type) url.set('type', params.type);
    else url.delete('type');
    if (params.categorie) url.set('categorie', params.categorie);
    else url.delete('categorie');
    if (params.genre) url.set('genre', params.genre);
    else url.delete('genre');
    return `${pathname}?${url.toString()}`;
  };

  return (
    <aside className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-md font-semibold mb-4">Catégories</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        {Object.keys(filtres).map((type) => (
          <li key={type}>
            <button
              onClick={() => setOuvert(ouvert === type ? null : type)}
              className="w-full text-left font-medium hover:text-blue-600"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
            {ouvert === type && (
              <ul className="ml-4 mt-2 space-y-1">
                {filtres[type].map((cat) => (
                  <li key={cat}>
                    <Link
                      href={makeHref({ type, categorie: cat })}
                      className="text-gray-600 hover:underline"
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {/* Genre filter optionnel */}
      {genres.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Genre</h3>
          <ul className="space-y-1">
            {genres.map((g) => (
              <li key={g}>
                <Link
                  href={makeHref({ genre: g })}
                  className="text-gray-600 hover:underline"
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Réinitialisation des filtres verticaux */}
      {(searchParams.get('type') || searchParams.get('categorie') || searchParams.get('genre')) && (
        <button
          className="mt-4 text-xs text-red-600 underline"
          onClick={() => {
            window.location.href = pathname; // reset tous les filtres verticaux
          }}
        >
          Réinitialiser filtres catégorie
        </button>
      )}
    </aside>
  );
}
