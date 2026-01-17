
'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useSideCartStore } from '@/store/useSideCartStore';
import Recapitulatif from '@/components/PanierPage/Recapitulatif';
import CoordonneesForm from '@/components/PanierPage//CoordonneesForm';
import PaiementForm from '@/components/PanierPage//PaiementForm';
import Resume from '@/components/PanierPage//Resume';

export default function PanierPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [abonnement, setAbonnement] = useState<any>(null);
  const [step, setStep] = useState(1);
  const containerRef = useRef(null);
  const router = useRouter()



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
      setUserId(user.id);

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
}, [step, totalEuros, jetonsUtilisés]);


  const handleCoordonneesSubmit = (data: any) => {
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
