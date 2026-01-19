'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// Correction : Ajout de l'import Image pour remplacer <img> plus bas
import Image from 'next/image';
import FiltreVertical from '@/components/FiltreVertical';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import AchatModal from '@/components/AchatModal';
import PrixAvecReduction from '@/components/PrixAvecReduction';

// Interfaces principales
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
  categorie: string; 
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

// Correction : Interfaces pour typer le retour brut de Supabase (remplacement des 'any')
interface ReservationRaw {
  statut: string;
  date_location: string;
}

interface ArticleRaw extends Omit<Article, 'tailles_articles' | 'est_en_location' | 'nb_locations' | 'prix_apres_location'> {
  tailles_articles: TailleArticle[];
  reservations: ReservationRaw[];
}

export default function Friperie() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [marquesDispo, setMarquesDispo] = useState<string[]>([]);
  const [marquesActives, setMarquesActives] = useState<string[]>([]);
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
  const categorie = searchParams.get('categorie');

  // Reset filtres horizontaux
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

  // Synchronisation URL filtre horizontal
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
    const fetchData = async () => {
      // ... (Codes de récupération des filtres inchangés pour abréger) ...
      // Marques
      const { data: marquesData } = await supabase.from('articles').select('marque').neq('marque', null);
      if (marquesData) setMarquesDispo([...new Set(marquesData.map((a) => a.marque))]);

      // Couleurs
      const { data: couleursData } = await supabase.from('articles').select('couleur').neq('couleur', null);
      if (couleursData) setCouleursDispo([...new Set(couleursData.map((a) => a.couleur))]);

      // Matières
      const { data: matieresData } = await supabase.from('articles').select('matiere').neq('matiere', null);
      if (matieresData) setMatieresDispo([...new Set(matieresData.map((a) => a.matiere))]);

      // Tailles
      const { data: taillesData } = await supabase.from('tailles_articles').select('taille').neq('taille', null);
      if (taillesData) setTaillesDispo([...new Set(taillesData.map((a) => a.taille))]);

      // Abonnements
      const { data: niveauxData } = await supabase.from('articles').select('niveau').neq('niveau', null);
      if (niveauxData) setAbonnementsDispo([...new Set(niveauxData.map((a) => a.niveau))]);

      // Labels
      const { data: allLabelsData } = await supabase.from('articles').select('labels').not('labels', 'is', null);
      if (allLabelsData) {
        const allLabels = allLabelsData.flatMap(a => a.labels || []);
        setLabelsDispo([...new Set(allLabels)]);
      }

      // Articles avec tailles_articles et calcul location
      const { data: fullArticles } = await supabase
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

      if (fullArticles) {
        // Correction : Utilisation des types ArticleRaw et ReservationRaw au lieu de 'any'
        // Nous castons fullArticles car Supabase retourne un type générique
        const articlesRaw = fullArticles as unknown as ArticleRaw[];

        const mapped: Article[] = articlesRaw.map((article) => {
          const enLocation = article.reservations?.some((r) =>
            ['en_attente', 'confirmé'].includes(r.statut)
          );
          const nbLocations = article.reservations?.length || 0;
          const prixAvecLocations = article.prix_vente * Math.pow(0.95, nbLocations);

          // On retire 'reservations' de l'objet final pour correspondre à l'interface Article
          const { reservations, ...articleWithoutReservations } = article;

          return {
            ...articleWithoutReservations,
            est_en_location: enLocation,
            nb_locations: nbLocations,
            prix_apres_location: prixAvecLocations,
          };
        });
        setArticles(mapped);
      }
    };

    fetchData();
  }, []);

  // Synchronisation du state avec les params URL (inchangé)
  useEffect(() => {
    const initialMarques = searchParams.get('marque');
    const initialCouleurs = searchParams.get('couleur');
    const initialTailles = searchParams.get('taille');
    const initialJeton = searchParams.get('maxJeton');
    const initialLabels = searchParams.get('label');
    const initialAbonnement = searchParams.get('abonnement');

    if (initialMarques) setMarquesActives(initialMarques.split(','));
    if (initialCouleurs) setCouleursActives(initialCouleurs.split(','));
    if (initialTailles) setTaillesActives(initialTailles.split(','));
    if (initialLabels) setLabelsActifs(initialLabels.split(','));
    if (initialAbonnement) setAbonnementsActifs(initialAbonnement.split(','));
    if (initialJeton) setValeurMaxJeton(Number(initialJeton));
    if (searchParams.get('disponible') === '1') setFiltrerDisponibles(true);
    else setFiltrerDisponibles(false);
  }, [searchParams]);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Friperie</h1>
      <div className="grid grid-cols-[240px_1fr] gap-6">
        <FiltreVertical />

        <section>
          {/* ... Filtres horizontaux (inchangés) ... */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm relative">
            <MultiSelectDropdown
              label="Marque"
              options={marquesDispo}
              selected={marquesActives}
              onChange={(v) => { setMarquesActives(v); updateQuery('marque', v); }}
            />
             <MultiSelectDropdown
              label="Couleur"
              options={couleursDispo}
              selected={couleursActives}
              onChange={(v) => { setCouleursActives(v); updateQuery('couleur', v); }}
            />
            <MultiSelectDropdown
              label="Matière"
              options={matieresDispo}
              selected={matieresActives}
              onChange={(v) => { setMatieresActives(v); updateQuery('matiere', v); }}
            />
            <MultiSelectDropdown
              label="Taille"
              options={taillesDispo}
              selected={taillesActives}
              onChange={(v) => { setTaillesActives(v); updateQuery('taille', v); }}
            />
            <MultiSelectDropdown
              label="Abonnement"
              options={abonnementsDispo}
              selected={abonnementsActifs}
              onChange={(v) => { setAbonnementsActifs(v); updateQuery('abonnement', v); }}
            />
            <MultiSelectDropdown
              label="Label"
              options={labelsDispo}
              selected={labelsActifs}
              onChange={(v) => { setLabelsActifs(v); updateQuery('label', v); }}
            />

            {/* Filtre jetons */}
            <div className="relative">
              <button 
                className="border px-3 py-1 rounded"
                onClick={() => setMenuJetonsOuvert(!menuJetonsOuvert)}
              >
                Jetons
              </button>
              {menuJetonsOuvert && (
                <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow-md p-2">
                  {[null, 2, 4, 999].map((val) => (
                    <label key={val} className="block text-sm py-1 cursor-pointer">
                      <input
                        type="radio"
                        name="jetons"
                        checked={valeurMaxJeton === val}
                        onChange={() => {
                          setValeurMaxJeton(val);
                          const params = new URLSearchParams(searchParams);
                          if (val === null) params.delete('maxJeton');
                          else params.set('maxJeton', val.toString());
                          router.push(`${pathname}?${params.toString()}`);
                        }}
                      />
                      {val === null ? 'Tous' : val === 999 ? '5 jetons et +' : `${val - 1} à ${val} jetons`}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filtrerDisponibles}
                onChange={(e) => {
                  setFiltrerDisponibles(e.target.checked);
                  const params = new URLSearchParams(searchParams);
                  if (e.target.checked) {
                    params.set('disponible', '1');
                  } else {
                    params.delete('disponible');
                  }
                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
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
                (categorie === null || a.categorie === categorie) &&
                (!filtrerDisponibles || a.est_disponible === true)
              )
              .map((a) => (
                <div key={a.id} className="bg-white rounded shadow p-4">
                  {/* Correction : Remplacement de <img> par <Image> */}
                  {/* Nous ajoutons 'aspect-[3/4] w-full' au conteneur parent pour gérer la taille avec 'fill' */}
                  <div className="relative aspect-[3/4] w-full mb-2">
                    <Image 
                      src={a.image_url} 
                      alt={a.titre} 
                      fill
                      className="object-cover rounded"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {a.labels && a.labels.length > 0 && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
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