'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// Correction 1 : Suppression de l'import Image inutilisé
import { useSideCartStore, Reservation } from '@/store/useSideCartStore';
import { Button } from '@/components/button';
import CommandeArticles from '@/components/confirmation/CommandeArticles';
import RecapitulatifCommande from '@/components/confirmation/RecapitulatifCommande';
import AvisCommande from '@/components/confirmation/AvisCommande';
import SuggestionsArticles from '@/components/confirmation/SuggestionsArticles';
import NewsDiapo from '@/components/confirmation/NewsDiapo';

interface ArticleSuggestion {
  id: string;
  titre: string;
  image_url: string;
  valeur_jeton: number;
}

// Correction 2 : Création d'une interface pour remplacer 'any'
interface AbonnementData {
  user_id: string;
  jetons_disponibles: number;
  [key: string]: any; // Permet de conserver les autres champs de la table si nécessaire
}

export default function ConfirmationCommande() {
  const [loading, setLoading] = useState(true);
  // Correction 2 : Utilisation de l'interface au lieu de any
  const [abonnement, setAbonnement] = useState<AbonnementData | null>(null);
  const [reservationsConfirmees, setReservationsConfirmees] = useState<Reservation[]>([]);
  const [suggestions, setSuggestions] = useState<ArticleSuggestion[]>([]);
  const router = useRouter();
  const { setReservations } = useSideCartStore();

  useEffect(() => {
    const confirmerReservations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data: currentReservations } = await supabase
        .from('reservations')
        .select('*, articles (titre, image_url, valeur_jeton)')
        .eq('user_id', user.id)
        .eq('statut', 'en_attente');

      if (!currentReservations || currentReservations.length === 0) {
        router.push('/friperie');
        return;
      }

      const totalJetons = currentReservations.reduce(
        (sum, r) => sum + (r.articles?.valeur_jeton ?? 0),
        0
      );

      const { data: aboData } = await supabase
        .from('abonnements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!aboData || aboData.jetons_disponibles < totalJetons) {
        router.push('/friperie');
        return;
      }

      await supabase
        .from('reservations')
        .update({ statut: 'confirmée' })
        .eq('user_id', user.id)
        .eq('statut', 'en_attente');

      await supabase
        .from('abonnements')
        .update({ jetons_disponibles: aboData.jetons_disponibles - totalJetons })
        .eq('user_id', user.id);

      setAbonnement({
        ...aboData,
        jetons_disponibles: aboData.jetons_disponibles - totalJetons,
      });

      setReservationsConfirmees(currentReservations as Reservation[]);
      setReservations([]);
      setLoading(false);
    };

    const fetchSuggestions = async () => {
      const { data } = await supabase
        .from('articles')
        .select('id, titre, image_url, valeur_jeton')
        .order('created_at', { ascending: false })
        .limit(3);
      setSuggestions(data || []);
    };

    confirmerReservations();
    fetchSuggestions();
    
    // Correction 3 : Ajout des dépendances manquantes (router et setReservations)
  }, [router, setReservations]);

  if (loading) return <p className="p-6">Chargement de la confirmation...</p>;

  const total = reservationsConfirmees.reduce(
    (sum, r) => sum + (r.articles?.valeur_jeton ?? 0),
    0
  );

  return (
    <main className="bg-gray-50 min-h-screen py-10 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        <section>
          <h1 className="text-2xl font-bold text-green-600 text-center mb-6">
            Merci pour ta commande 🎉
          </h1>

          <CommandeArticles reservations={reservationsConfirmees} />
          {/* Note : abonnement est typé maintenant, donc jetons_disponibles est reconnu */}
          <RecapitulatifCommande total={total} jetonsRestants={abonnement?.jetons_disponibles ?? 0} />
          <AvisCommande />
          <SuggestionsArticles suggestions={suggestions} />

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            <Button onClick={() => router.push('/friperie')} variant="secondary">
              Retour au catalogue
            </Button>
            <Button onClick={() => router.push('/mescommandes')}>
              Voir mes commandes
            </Button>
          </div>
        </section>

        <aside className="hidden md:block">
          <NewsDiapo />
        </aside>
      </div>
    </main>
  );
}