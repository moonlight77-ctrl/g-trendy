'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSideCartStore } from '@/store/useSideCartStore';

type Reservation = {
  id: string;
  taille: string;
  valeur_jeton: number;
  statut?: string;
  article_id?: string;
  user_id: string; // <--- Corrigé ici
  articles?: {
    titre: string;
    image_url: string;
    valeur_jeton: number;
  };
};

export default function SideCart({
  open,
  onClose,
  userId,
  onHover
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  onHover: (isHovering: boolean) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { reservations, setReservations } = useSideCartStore();

  useEffect(() => {
    if (!userId || !open) return;

    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          articles (
            titre,
            image_url,
            valeur_jeton
          )
        `)
        .eq('user_id', userId)
        .eq('statut', 'en_attente');

      if (!error && data) {
        setReservations(data as Reservation[]);
      } else {
        console.error("Erreur chargement réservations :", error?.message);
      }
    };

    fetchReservations();
  }, [userId, open, setReservations]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('realtime:reservations_sidecart')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations'
        },
        (payload) => {
          const data = payload.new as Reservation;
          const old = payload.old as Reservation;

          const concerneUser = (data?.user_id || old?.user_id) === userId;
          const statutActif = data?.statut === 'en_attente' || old?.statut === 'en_attente';

          if (!concerneUser || !statutActif) return;

          if (payload.eventType === 'INSERT') {
            setReservations((prev) => [...prev, data]);
          }

          if (payload.eventType === 'DELETE') {
            setReservations((prev) => prev.filter((r) => r.id !== old.id));
          }

          if (payload.eventType === 'UPDATE') {
            supabase
              .from('reservations')
              .select(`*, articles (titre, image_url, valeur_jeton)`)
              .eq('user_id', userId)
              .eq('statut', 'en_attente')
              .then(({ data, error }) => {
                if (!error && data) {
                  setReservations(data as Reservation[]);
                }
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, setReservations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`fixed top-0 right-0 w-[340px] h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">🛒 Ton panier</h2>
        <button onClick={onClose}><X size={20} /></button>
      </div>

      <div className="overflow-y-auto p-4 space-y-4">
        {!Array.isArray(reservations) || reservations.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun article réservé.</p>
        ) : (
          reservations.map((r, i) => (
            <div key={`${r.id}-${i}`} className="flex gap-3 border-b pb-3">
              <img
                src={r.articles?.image_url}
                alt={r.articles?.titre}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{r.articles?.titre}</p>
                <p className="text-xs text-gray-600">Taille : {r.taille}</p>
                <p className="text-xs text-purple-600 font-semibold">
                  {r.articles?.valeur_jeton ?? r.valeur_jeton} jeton
                  {(r.articles?.valeur_jeton ?? r.valeur_jeton) > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={async () => {
                  await supabase.from('reservations').delete().eq('id', r.id);
                  setReservations((prev) => prev.filter((res) => res.id !== r.id));
                }}
                className="text-sm text-red-500 hover:underline"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-white shadow-lg z-10">
        <button
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
          onClick={() => router.push('/panier')}
        >
          Commander
        </button>
      </div>
    </div>
  );
}
