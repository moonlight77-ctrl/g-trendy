'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag } from 'lucide-react';
import { useSideCartStore, Reservation } from '@/store/useSideCartStore';

interface Props {
  userId: string;
  onClick: () => void;
  onHover: (isHovering: boolean) => void;
}

export default function PanierIcon({ userId, onClick, onHover }: Props) {
  const { reservations, setReservations } = useSideCartStore();

  useEffect(() => {
    if (!userId) return;

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
        setReservations(data);
      }
    };

    fetchReservations();
  }, [userId, setReservations]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('realtime:reservations_icon')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          const data = payload.new as Reservation;
          const old = payload.old as Reservation;

          const concerneUser = (data?.user_id || old?.user_id) === userId;
          const isActive = data?.statut === 'en_attente' || old?.statut === 'en_attente';

          if (!concerneUser || !isActive) return;

          supabase
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
            .eq('statut', 'en_attente')
            .then(({ data, error }) => {
              if (!error && data) {
                setReservations(data);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, setReservations]);

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      className="relative cursor-pointer"
    >
      <ShoppingBag className="w-6 h-6" />
      {reservations.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
          {reservations.length}
        </span>
      )}
    </div>
  );
}
