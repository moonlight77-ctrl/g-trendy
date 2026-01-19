'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// ✅ Définition des interfaces pour remplacer les 'any'
interface User {
  id: string;
  email?: string;
}

interface Article {
  titre: string;
  image_url: string;
}

interface Reservation {
  id: string;
  taille: string;
  date_location: string;
  statut: string;
  user_id: string;
  articles: Article | null; // Peut être null si la jointure échoue ou l'article est supprimé
}

interface Abonnement {
  jetons_disponibles: number;
}

export default function Profil() {
  // ✅ Correction : Utilisation des interfaces définies
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        // On ne garde que les infos nécessaires définies dans l'interface User
        setUser({
          id: data.user.id,
          email: data.user.email
        });
      }
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

      if (!error && data) {
        // Cast des données reçues vers le type Reservation[]
        setReservations(data as unknown as Reservation[]);
      }
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
                alt={r.articles?.titre || 'Article'}
                width={80}
                height={100}
                className="rounded object-cover"
              />
              <div>
                <p className="font-semibold">{r.articles?.titre || 'Titre inconnu'}</p>
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