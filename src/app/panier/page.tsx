'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSideCartStore, Reservation } from '@/store/useSideCartStore';
import { Button } from '@/components/button';

export default function PanierPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [abonnement, setAbonnement] = useState<any>(null);
  const [articlesASupprimer, setArticlesASupprimer] = useState<string[]>([]);
  const [annulations, setAnnulations] = useState<Record<string, NodeJS.Timeout>>({});
  const containerRef = useRef(null);
  const router = useRouter();

  const { reservations, setReservations } = useSideCartStore();
  const jetonsUtilisés = Array.isArray(reservations)
    ? reservations.reduce((sum, r) => sum + (r.articles?.valeur_jeton || 0), 0)
    : 0;
  const soldeEstimé = abonnement ? abonnement.jetons_disponibles - jetonsUtilisés : null;

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

      if (Array.isArray(resData)) setReservations(resData);
      else setReservations([]);

      const { data: aboData } = await supabase
        .from('abonnements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (aboData) setAbonnement(aboData);
    };

    fetchData();
  }, [setReservations]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('realtime:reservations_panier')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          const data = payload.new as Reservation;
          const old = payload.old as Reservation;

          const concerneUser = (data?.user_id || old?.user_id) === userId;
          const actif = data?.statut === 'en_attente' || old?.statut === 'en_attente';
          if (!concerneUser || !actif) return;

          if (payload.eventType === 'INSERT') {
            setReservations((prev) => [...(Array.isArray(prev) ? prev : []), data]);
          }

          if (payload.eventType === 'DELETE') {
            setReservations((prev) => (Array.isArray(prev) ? prev.filter((r) => r.id !== old.id) : []));
          }

          if (payload.eventType === 'UPDATE') {
            supabase
              .from('reservations')
              .select(`*, articles (titre, image_url, valeur_jeton)`)
              .eq('user_id', userId)
              .eq('statut', 'en_attente')
              .then(({ data, error }) => {
                if (!error && Array.isArray(data)) setReservations(data);
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const supprimerReservation = (id: string, avecDelai = true) => {
    if (!avecDelai) {
      supabase.from('reservations').delete().eq('id', id);
      setReservations((prev) => (Array.isArray(prev) ? prev.filter((r) => r.id !== id) : []));
      return;
    }

    setArticlesASupprimer((prev) => [...prev, id]);

    const timeout = setTimeout(async () => {
      await supabase.from('reservations').delete().eq('id', id);
      setReservations((prev) => (Array.isArray(prev) ? prev.filter((r) => r.id !== id) : []));
      setArticlesASupprimer((prev) => prev.filter((r) => r !== id));
      const updated = { ...annulations };
      delete updated[id];
      setAnnulations(updated);
    }, 1500);

    setAnnulations((prev) => ({ ...prev, [id]: timeout }));
  };

  const annulerSuppression = (id: string) => {
    clearTimeout(annulations[id]);
    setArticlesASupprimer((prev) => prev.filter((r) => r !== id));
    const updated = { ...annulations };
    delete updated[id];
    setAnnulations(updated);
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen" ref={containerRef}>
      <h1 className="text-3xl font-bold mb-6">Mon panier</h1>

      {!Array.isArray(reservations) || reservations.length === 0 ? (
        <p className="text-gray-600 text-sm">
          Votre panier est vide. <Link href="/friperie" className="text-blue-600 underline">Découvrez la friperie.</Link>
        </p>
      ) : (
        <div className="grid md:grid-cols-[3fr_1fr] gap-6">
          <div className="space-y-4">
            {reservations.map((r) => (
              <div key={r.id} className="flex items-start gap-4 bg-white p-4 rounded shadow relative">
                <Image
                  src={r.articles?.image_url || '/placeholder.jpg'}
                  alt={r.articles?.titre || ''}
                  width={80}
                  height={100}
                  className="rounded object-cover w-[80px] h-[100px]"
                />
                <div className="flex-1">
                  <p className="font-semibold">{r.articles?.titre}</p>
                  <p className="text-sm text-gray-500">Taille : {r.taille}</p>
                  <p className="text-sm text-gray-500">Jetons : {r.articles?.valeur_jeton}</p>
                  {articlesASupprimer.includes(r.id) ? (
                    <p
                      onClick={() => annulerSuppression(r.id)}
                      className="text-xs text-orange-600 underline mt-1 cursor-pointer"
                    >
                      Article supprimé (cliquer pour annuler)
                    </p>
                  ) : (
                    <Button
                      onClick={() => supprimerReservation(r.id, true)}
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-white p-4 rounded shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Résumé</h2>
            <p className="text-sm text-gray-700 mb-2">Jetons à dépenser : <strong>{jetonsUtilisés}</strong></p>
            {soldeEstimé !== null && (
              <p className={`text-sm font-medium ${soldeEstimé < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                Solde estimé après paiement : {soldeEstimé} jetons
              </p>
            )}
            <Button 
              className="w-full mt-4"
              onClick={() => router.push('/confirmation')}
              disabled={soldeEstimé !== null && soldeEstimé < 0}
            >
              Confirmer la réservation
            </Button>
            {soldeEstimé !== null && soldeEstimé < 0 && (
              <div className="mt-4 bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded">
                Il semble que tu n'aies pas assez de jetons.<br />
                <Link href="/acheter-jetons" className="underline font-semibold hover:text-red-800">
                  Acheter des jetons supplémentaires →
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
