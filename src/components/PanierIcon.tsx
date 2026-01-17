'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag } from 'lucide-react';
import { useSideCartStore, Reservation, Vente } from '@/store/useSideCartStore';

interface Props {
  userId: string;
  onClick: () => void;
  onHover: (isHovering: boolean) => void;
}

export default function PanierIcon({ userId, onClick, onHover }: Props) {
  const { reservations, setReservations, ventes, setVentes } = useSideCartStore();

  useEffect(() => {
    if (!userId) return;

    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`*, articles (titre, image_url, valeur_jeton)`)
        .eq('user_id', userId)
        .eq('statut', 'en_attente');

      if (!error && data) setReservations(data);
    };

    const fetchVentes = async () => {
      const { data, error } = await supabase
        .from('ventes')
        .select(`*, articles (titre, image_url)`)
        .eq('user_id', userId)
        .eq('statut', 'en_attente');

      if (!error && data) setVentes(data);
    };

    fetchReservations();
    fetchVentes();
  }, [userId, setReservations, setVentes]);

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      className="relative cursor-pointer"
    >
      <ShoppingBag className="w-6 h-6" />
      {(reservations.length + ventes.length) > 0 && (
        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
          {reservations.length + ventes.length}
        </span>
      )}
    </div>
  );
}
