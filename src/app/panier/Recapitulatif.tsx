
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useSideCartStore } from '@/store/useSideCartStore';
import { Button } from '@/components/button';

export default function Recapitulatif() {
  const { reservations, setReservations, ventes, setVentes } = useSideCartStore();
  const [articlesASupprimer, setArticlesASupprimer] = useState<string[]>([]);
  const [annulations, setAnnulations] = useState<Record<string, NodeJS.Timeout>>({});

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

  const supprimerVente = (id: string, avecDelai = true) => {
    if (!avecDelai) {
      supabase.from('ventes').delete().eq('id', id);
      setVentes((prev) => (Array.isArray(prev) ? prev.filter((v) => v.id !== id) : []));
      return;
    }

    setArticlesASupprimer((prev) => [...prev, id]);

    const timeout = setTimeout(async () => {
      await supabase.from('ventes').delete().eq('id', id);
      setVentes((prev) => (Array.isArray(prev) ? prev.filter((v) => v.id !== id) : []));
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
    <div className="space-y-6">
      {reservations.length > 0 && (
        <>
          <h3 className="text-md font-semibold text-gray-700">Réservations</h3>
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
        </>
      )}

      {ventes.length > 0 && (
        <>
          <h3 className="text-md font-semibold text-gray-700">Achats</h3>
          {ventes.map((v) => (
            <div key={v.id} className="flex items-start gap-4 bg-white p-4 rounded shadow relative">
              <Image
                src={v.articles?.image_url || '/placeholder.jpg'}
                alt={v.articles?.titre || ''}
                width={80}
                height={100}
                className="rounded object-cover w-[80px] h-[100px]"
              />
              <div className="flex-1">
                <p className="font-semibold">{v.articles?.titre}</p>
                <p className="text-sm text-gray-500">Taille : {v.taille}</p>
                <p className="text-sm text-gray-500">Prix : {v.prix_vente.toFixed(2)} €</p>
                {articlesASupprimer.includes(v.id) ? (
                  <p
                    onClick={() => annulerSuppression(v.id)}
                    className="text-xs text-orange-600 underline mt-1 cursor-pointer"
                  >
                    Article supprimé (cliquer pour annuler)
                  </p>
                ) : (
                  <Button
                    onClick={() => supprimerVente(v.id, true)}
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
