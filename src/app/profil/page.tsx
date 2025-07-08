'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function Profil() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [abonnement, setAbonnement] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`*, articles (titre, image_url)`)  
        .eq('user_id', user.id);

      if (!error && data) setReservations(data);
    };

    const fetchAbonnement = async () => {
      const { data, error } = await supabase
        .from('abonnements')
        .select('jetons_disponibles')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setAbonnement(data);
      }
    };

    fetchReservations();
    fetchAbonnement();
  }, [user]);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Mon profil</h1>
      <h2 className="text-xl font-semibold mb-4">Mes réservations</h2>

      {reservations.length === 0 ? (
        <p className="text-gray-600">Aucune réservation pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow flex gap-4">
              <Image
                src={r.articles?.image_url || '/placeholder.jpg'}
                alt={r.articles?.titre}
                width={80}
                height={100}
                className="rounded object-cover"
              />
              <div>
                <p className="font-semibold">{r.articles?.titre}</p>
                <p className="text-sm text-gray-500">Taille : {r.taille}</p>
                <p className="text-sm text-gray-500">Réservé le : {new Date(r.date_location).toLocaleDateString()}</p>
                <p className="text-sm font-semibold mt-1">Statut : {r.statut}</p>
                {abonnement && (
                  <p className="text-sm mt-1 text-blue-600">
                    Jetons disponibles : {abonnement.jetons_disponibles}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
