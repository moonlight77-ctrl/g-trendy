'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ReservationModal from '../../components/ReservationModal';
import FiltreVertical from '@/components/FiltreVertical';
import { usePanier } from '@/hooks/usePanier';
import Link from 'next/link'; 
import MultiSelectDropdown from '@/components/MultiSelectDropdown';

interface Article {
id: string;
titre: string;
description: string;
image_url: string;
categorie: string;
prix_location: number;
niveau: string;
en_vente: boolean;
marque: string;
valeur_jeton: number; // ✅ À ajouter
couleur: string;
matiere: string;
taille: string;
est_disponible: boolean;
tailles_articles: TailleArticle[];
labels?: string[];
}
interface TailleArticle {
  taille: string;
  disponible: boolean;
}

export default function Catalogue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [preselectedTaille, setPreselectedTaille] = useState<string | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  //const { ajouterArticle } = usePanier();
  const [valeurMaxJeton, setValeurMaxJeton] = useState<number | null>(null);
  const [marquesDispo, setMarquesDispo] = useState<string[]>([]);
  const [marquesActives, setMarquesActives] = useState<string[]>([]);
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
  const genre = searchParams.get('genre');


  const resetFiltres = () => {
    setMarquesActives([]);
    setCouleursActives([]);
    setMatieresActives([]);
    setTaillesActives([]);
    setValeurMaxJeton(null);
    setAbonnementsActifs([]);
    setLabelsActifs([]);
    setFiltrerDisponibles(false);
    // Ajout d'autres filtres  ici
  };
  // synschronisation URL filtre 
  const updateQuery = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (values.length === 0) {
      params.delete(key);
    } else {
      params.set(key, values.join(','));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

useEffect( () => {
  // 1. Recuperation articles 
  const fetchData = async () => {

    // 2. Marques distinctes
    const { data: marquesData, error: errMarques } = await supabase
      .from('articles')
      .select('marque')
      .neq('marque', null); // on évite les marques vides

    if (!errMarques && marquesData) {
      const uniques = [...new Set(marquesData.map((a) => a.marque))];
      setMarquesDispo(uniques);
    }

    // 3. Couleur
    const { data: couleursData, error: errCouleurs } = await supabase
      .from('articles')
      .select('couleur')
      .neq('couleur', null);
    
    if (!errCouleurs && couleursData) {
        const uniques = [...new Set(couleursData.map((a) => a.couleur))];
        setCouleursDispo(uniques);
    }  

    // 4. Matière
    const { data: matieresData, error: errMatieres } = await supabase
      .from('articles')
      .select('matiere')
      .neq('matiere', null)

      if (!errMatieres && matieresData) {
        const uniques = [...new Set(matieresData.map((a) => a.matiere))];
        setMatieresDispo(uniques);
      }
    // 5. taille
    const { data: taillesData, error: errTailles } = await supabase
        .from('tailles_articles')
        .select('taille')
        .neq('taille', null);

      if (!errTailles && taillesData) {
        const uniques = [...new Set(taillesData.map((a) => a.taille))];
        setTaillesDispo(uniques);
      }

  // 6.Taille Bis 
  const { data: fullArticles, error: errFull } = await supabase
  .from('articles')
  .select(`
    *,
    tailles_articles (
      taille,
      disponible
    )
  `);
  if (!errFull && fullArticles) {
    console.log("Articles chargés avec tailles_articles :", fullArticles); // 👈
    setArticles(fullArticles);
  }

  // 6bis. Récupération des labels distincts
const { data: allLabelsData, error: errLabels } = await supabase
  .from('articles')
  .select('labels')
  .not('labels', 'is', null);

if (!errLabels && allLabelsData) {
  // Aplatir tous les tableaux de labels
  const allLabels = allLabelsData.flatMap(a => a.labels || []);
  const uniques = [...new Set(allLabels)];
  setLabelsDispo(uniques);
}


  // 7.Abonnement
  const { data: niveauxData, error: errNiveaux } = await supabase
        .from('articles')
        .select('niveau')
        .neq('niveau', null);

      if (!errNiveaux && niveauxData) {
        const uniques = [...new Set(niveauxData.map((a) => a.niveau))];
        setAbonnementsDispo(uniques);
  }

  // 8.Disponibilité 
 if (searchParams.get('disponible') === '1') {
        setFiltrerDisponibles(true);
      }
  // 9. Synchronisation URL 
  const initialMarques = searchParams.get('marque');
  const initialCouleurs = searchParams.get('couleur');
  const initialTailles = searchParams.get('taille');
  const initialJeton = searchParams.get('maxJeton');
  const initialLabels = searchParams.get('label');
  if (initialMarques) setMarquesActives(initialMarques.split(','));
  if (initialCouleurs) setCouleursActives(initialCouleurs.split(','));
  if (initialJeton) setValeurMaxJeton(Number(initialJeton));
  if (initialTailles) setTaillesActives(initialTailles.split(','));
  if (initialLabels) setLabelsActifs(initialLabels.split(','));


  // 10. Chargement de l'utilisateur
  const { data: { user } } = await supabase.auth.getUser();
  setUser(user);
  setLoadingUser(false);
 };

  fetchData();
}, []) ;

  return (
  <main className="p-6 bg-gray-50 min-h-screen">
    {loadingUser && (
      <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded px-4 py-2 mb-4 shadow w-fit mx-auto">
        Chargement de votre session...
      </div>
      )}
    <h1 className="text-3xl font-bold mb-6">Catalogue</h1>

    <div className="grid grid-cols-[240px_1fr] gap-6">
      {/* Sidebar verticale */}
      <FiltreVertical />

      {/* Section principale */}
      <section>
        {/* Filtres horizontaux */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm relative">
          <MultiSelectDropdown
            label="Marque"
            options={marquesDispo}
            selected={marquesActives}
            onChange={(values) => {
              setMarquesActives(values);
              updateQuery('marque', values);
            }}
          />
          <MultiSelectDropdown
            label="Couleur"
            options={couleursDispo}
            selected={couleursActives}
            onChange={(values) => {
              setCouleursActives(values);
              updateQuery('couleur', values);
            }}
          />
          <MultiSelectDropdown
            label="Matière"
            options={matieresDispo}
            selected={matieresActives}
            onChange={(values) => {
              setMatieresActives(values);
              updateQuery('matiere', values);
            }}
          />
          <MultiSelectDropdown
            label="Taille"
            options={taillesDispo}
            selected={taillesActives}
            onChange={(values) => {
              setTaillesActives(values);
              updateQuery('taille', values);
            }}
          />
          <MultiSelectDropdown
            label="Abonnement"
            options={abonnementsDispo}
            selected={abonnementsActifs}
            onChange={(values) => {
              setAbonnementsActifs(values);
              updateQuery('abonnement', values);
            }}
          />
          <MultiSelectDropdown
            label="Label"
            options={labelsDispo}
            selected={labelsActifs}
            onChange={(values) => {
              setLabelsActifs(values);
              updateQuery('label', values);
            }}
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
               {[null, 2, 4, 999].map((val, i) => (
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

          {/* Disponibilité */}
          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
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

          {/* Réinitialisation */}
          <button
            onClick={resetFiltres}
            className='text-sm text-red-600 underline hover:text-red-800'
          >
            Tout réinitialiser
          </button>
        </div>

        {/* Résultats */}
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
              (!filtrerDisponibles || a.est_disponible === true)
            )
            
            .map((a) => (
              <div key={a.id} className="bg-white rounded shadow p-4">
                <img 
                src={a.image_url}
                alt={a.titre}
                className="w-full aspect-[3/4] object-cover rounded"
                />
                <h2 className="text-xl font-semibold mt-2">{a.titre}</h2>
                {a.labels && a.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.labels.map((label) => (
                      <span
                        key={label}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                 {a.tailles_articles && a.tailles_articles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Tailles :</p>
                    {a.tailles_articles.map((t) => (
                      <button
                        key={t.taille}
                        disabled={!t.disponible}
                        onClick={() => {
                          if (!user) {
                            router.push('/connexion');
                          } else {
                            setSelectedArticle(a);
                            setPreselectedTaille(t.taille);
                          }
                        }}
                        className={`inline-block px-2 py-1 mr-2 mb-2 rounded text-xs font-medium ${
                          t.disponible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {t.taille}
                      </button>
                    ))}
                </div>
                 )}
                <p className="text-sm"><strong>Abonnement :</strong> {a.niveau}</p>
                <p className="text-purple-600 font-bold mt-2">{a.valeur_jeton} jeton{a.valeur_jeton > 1 ? 's' : ''}</p>


                {a.en_vente && (
                  <p className="mt-2 text-xs text-green-600 font-medium">
                    🏷️ Aussi dispo en <Link href="/friperie" className="underline">friperie</Link>
                  </p>
                )}

                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    if (loadingUser) return; // On attend que Supabase ait chargé l'utilisateur
                    
                    if (!user) {
                      router.push('/connexion');
                    } else {
                      setSelectedArticle(a);
                    }
                  }}
                >
                  Louer cet article
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>

    {/* Modale réservation */}
    {selectedArticle && (
      <ReservationModal
          article={selectedArticle}
          userId={user?.id}
          onClose={() => setSelectedArticle(null)}
          preselectedTaille={preselectedTaille}
        />
    )}
  </main>
);
}
