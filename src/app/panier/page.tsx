'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useSideCartStore } from '@/store/useSideCartStore';
import Recapitulatif from '@/components/PanierPage/Recapitulatif';
import CoordonneesForm from '@/components/PanierPage//CoordonneesForm';
import PaiementForm from '@/components/PanierPage//PaiementForm';
import Resume from '@/components/PanierPage//Resume';

// Correction 2 : Création de l'interface pour remplacer 'any'
interface AbonnementData {
  jetons_disponibles: number;
  user_id: string;
  // Permet d'accepter d'autres champs si nécessaire
  [key: string]: any;
}

// Correction 4 : Interface pour les données du formulaire
interface CoordonneesData {
  nom: string;
  email: string;
  adresse: string;
  [key: string]: any;
}

export default function PanierPage() {
  // Correction 1 : Suppression de [userId, setUserId] car la variable userId n'était jamais utilisée
  
  // Correction 2 : Utilisation de l'interface
  const [abonnement, setAbonnement] = useState<AbonnementData | null>(null);
  const [step, setStep] = useState(1);
  const containerRef = useRef(null);
  const router = useRouter();

  const { reservations, setReservations, ventes, setVentes } = useSideCartStore();

  const jetonsUtilisés = Array.isArray(reservations)
    ? reservations.reduce((sum, r) => sum + (r.articles?.valeur_jeton || 0), 0)
    : 0;

  const soldeEstimé = abonnement ? abonnement.jetons_disponibles - jetonsUtilisés : null;
  
  const totalEuros = ventes.reduce((sum, v) => sum + (v.prix_vente || 0), 0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Note : setUserId a été supprimé ici car inutile

      const { data: resData } = await supabase
        .from('reservations')
        .select('*, articles (*)')
        .eq('user_id', user.id)
        .eq('statut', 'en_attente');

      setReservations(Array.isArray(resData) ? resData : []);

      const { data: ventesData } = await supabase
        .from('ventes')
        .select('*, articles (*)')
        .eq('user_id', user.id)
        .eq('statut', 'panier');

      setVentes(Array.isArray(ventesData) ? ventesData : []);

      const { data: aboData } = await supabase
        .from('abonnements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (aboData) setAbonnement(aboData);
    };

    fetchData();
  }, [setReservations, setVentes]);
  
  useEffect(() => {
    if (step === 3 && totalEuros === 0 && jetonsUtilisés > 0) {
      router.push('/confirmation'); // Redirige automatiquement si uniquement jetons
    }
    // Correction 3 : Ajout de 'router' aux dépendances
  }, [step, totalEuros, jetonsUtilisés, router]);


  // Correction 4 : Typage de data et renommage en _data car non utilisé
  const handleCoordonneesSubmit = (_data: CoordonneesData) => {
    // Enregistrez ou utilisez les données si nécessaire
    setStep(3);
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen" ref={containerRef}>
      <h1 className="text-3xl font-bold mb-6">Mon panier</h1>
      {!Array.isArray(reservations) || reservations.length === 0 ? (
        <p className="text-gray-600 text-sm">
          Votre panier est vide. <a href="/friperie" className="text-blue-600 underline">Découvrez la friperie.</a>
        </p>
      ) : (
        <div className="grid md:grid-cols-[3fr_1fr] gap-6">
          <div className="space-y-6">
            {step === 1 && (
              <>
                <Recapitulatif />
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                  onClick={() => setStep(2)}
                >
                  Suivant
                </button>
              </>
            )}
            {step === 2 && <CoordonneesForm onValid={handleCoordonneesSubmit} />}
            {step === 3 && totalEuros > 0 && (
              <PaiementForm soldeEstimé={soldeEstimé} />
            )}
          </div>
          <Resume soldeEstimé={soldeEstimé} />
        </div>
      )}
    </main>
  );
}