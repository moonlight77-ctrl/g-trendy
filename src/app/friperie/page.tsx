'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import PrixAvecReduction from '@/components/PrixAvecReduction';
import AchatModal from '@/components/AchatModal';
import FiltreVertical from '@/components/FiltreVertical';
import Link from 'next/link';

interface Article {
  id: string;
  titre: string;
  image_url: string;
  marque: string;
  prix_vente: number;
  vendu: boolean;
  en_vente: boolean;
  taille: string;
  labels?: string[];
  couleur: string;
  matiere: string;
  genre: string;
  type: string;
  est_disponible: boolean;
  tailles_articles: TailleArticle[];
  nb_locations: number;
  est_en_location: boolean;
  prix_apres_location: number;
  valeur_jeton: number;
  niveau: string;
}

interface TailleArticle {
  taille: string;
  disponible: boolean;
}

export default function Friperie() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [marquesDispo, setMarquesDispo] = useState<string[]>([]);
  const [marquesActives, setMarquesActives] = useState<string[]>([]);
  const [userAbonnement, setUserAbonnement] = useState<'non' | 'standard' | 'premium'>('non');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [preselectedTaille, setPreselectedTaille] = useState<string | undefined>(undefined);

  const [valeurMaxJeton, setValeurMaxJeton] = useState<number | null>(null);
  const [couleursDispo, setCouleursDispo] = useState<string[]>([]);
  const [couleursActives, setCouleursActives] = useState<string[]>([]);
  const [matieresDispo, setMatieresDispo] = useState<string[]>([]);
  const [matieresActives, setMatieresActives] = useState<string[]>([]);
  const [taillesDispo, setTaillesDispo] = useState<string[]>([]);
  const [taillesActives, setTaillesActives] = useState<string[]>([]);
  const [filtrerDisponibles, setFiltrerDisponibles] = useState(false);
  const [abonnementsDispo, setAbonnementsDispo] = useState<string[]>([]);
  const [abonnementsActifs, setAbonnementsActifs] = useState<string[]>([]);
  const [menuJetonsOuvert, setMenuJetonsOuvert] = useState(false);
  const [labelsDispo, setLabelsDispo] = useState<string[]>([]);
  const [labelsActifs, setLabelsActifs] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const genre = searchParams.get('genre');
  const type = searchParams.get('type');

  const resetFiltres = () => {
    setMarquesActives([]);
    setCouleursActives([]);
    setMatieresActives([]);
    setTaillesActives([]);
    setValeurMaxJeton(null);
    setAbonnementsActifs([]);
    setLabelsActifs([]);
    setFiltrerDisponibles(false);
  };

  const updateQuery = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (values.length === 0) {
      params.delete(key);
    } else {
      params.set(key, values.join(','));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const fetchAbonnement = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data } = await supabase
        .from('abonnements')
        .select('niveau')
        .eq('user_id', userData.user.id)
        .single();

      if (data?.niveau === 'Premium') setUserAbonnement('premium');
      else if (data?.niveau === 'Standard') setUserAbonnement('standard');
      else setUserAbonnement('non');
    };

    fetchAbonnement();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          tailles_articles (
            taille,
            disponible
          ),
          reservations (
            statut,
            date_location
          )
        `)
        .eq('en_vente', true);

      if (!data) return;

      const mapped = data.map((article) => {
        const enLocation = article.reservations?.some((r: any) =>
          ['en_attente', 'confirmé'].includes(r.statut)
        );

        const nbLocations = article.reservations?.length || 0;
        const prixAvecLocations = article.prix_vente * Math.pow(0.95, nbLocations);

        return {
          ...article,
          est_en_location: enLocation,
          nb_locations: nbLocations,
          prix_apres_location: prixAvecLocations,
        };
      });

      setArticles(mapped);
    };

    fetchArticles();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Friperie</h1>

      <div className="grid grid-cols-[240px_1fr] gap-6">
        <FiltreVertical />

        <section>
          <div className="flex flex-wrap gap-4 mb-6 text-sm relative">
            <MultiSelectDropdown label="Marque" options={marquesDispo} selected={marquesActives} onChange={(v) => { setMarquesActives(v); updateQuery('marque', v); }} />
            <MultiSelectDropdown label="Couleur" options={couleursDispo} selected={couleursActives} onChange={(v) => { setCouleursActives(v); updateQuery('couleur', v); }} />
            <MultiSelectDropdown label="Matière" options={matieresDispo} selected={matieresActives} onChange={(v) => { setMatieresActives(v); updateQuery('matiere', v); }} />
            <MultiSelectDropdown label="Taille" options={taillesDispo} selected={taillesActives} onChange={(v) => { setTaillesActives(v); updateQuery('taille', v); }} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={filtrerDisponibles} onChange={(e) => {
                setFiltrerDisponibles(e.target.checked);
                const params = new URLSearchParams(searchParams);
                e.target.checked ? params.set('disponible', '1') : params.delete('disponible');
                router.push(`${pathname}?${params.toString()}`);
              }} />
              Disponible maintenant
            </label>
            <button onClick={resetFiltres} className="text-sm text-red-600 underline">Tout réinitialiser</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles
              .filter((a) =>
                (valeurMaxJeton === null || a.valeur_jeton <= valeurMaxJeton) &&
                (marquesActives.length === 0 || marquesActives.includes(a.marque)) &&
                (couleursActives.length === 0 || couleursActives.includes(a.couleur)) &&
                (matieresActives.length === 0 || matieresActives.includes(a.matiere)) &&
                (taillesActives.length === 0 || taillesActives.includes(a.taille)) &&
                (labelsActifs.length === 0 || (Array.isArray(a.labels) && labelsActifs.every(label => a.labels?.includes(label)))) &&
                (abonnementsActifs.length === 0 || abonnementsActifs.includes(a.niveau)) &&
                (genre === null || a.genre === genre) &&
                (type === null || a.type === type) &&
                (!filtrerDisponibles || a.est_disponible === true)
              )
              .map((a) => (
                <div key={a.id} className="bg-white rounded shadow p-4">
                  <div className="relative">
                    <img src={a.image_url} alt={a.titre} className="w-full aspect-[3/4] object-cover rounded" />
                    {a.labels && a.labels.length > 0 && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {a.labels.map((label) => (
                          <span key={label} className={`text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full shadow ${
                            label === 'nouveau' ? 'bg-green-600' : label === 'promo' ? 'bg-red-600' : 'bg-black/70'
                          }`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h2 className="mt-2 font-semibold">{a.titre}</h2>
                  <p className="text-sm text-gray-500 mb-1">{a.marque}</p>

                  {a.tailles_articles && a.tailles_articles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Tailles disponibles :</p>
                      {a.tailles_articles.filter(t => t.disponible).map(t => (
                        <span key={t.taille} className="inline-block bg-green-100 text-green-700 px-2 py-1 mr-2 mb-2 rounded text-xs font-medium">
                          {t.taille}
                        </span>
                      ))}
                    </div>
                  )}

                  <PrixAvecReduction
                    prixBase={a.prix_vente}
                    prix_apres_location={a.prix_apres_location}
                    est_en_location={a.est_en_location}
                  />

                  <button
                    onClick={() => {
                      setSelectedArticle(a);
                      setPreselectedTaille(a.tailles_articles.find(t => t.disponible)?.taille);
                    }}
                    className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Acheter cet article
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>

      {selectedArticle && (
        <AchatModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          preselectedTaille={preselectedTaille}
        />
      )}
    </main>
  );
}
