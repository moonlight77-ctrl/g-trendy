'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSideCartStore, Reservation, Vente } from '@/store/useSideCartStore';

interface CartItemBase {
  id: string;
  user_id: string;
  article_id: string;
  taille: string;
  statut: string;
  articles: {
    titre: string;
    image_url: string;
  };
}

interface ReservationItem extends Reservation {
  type: 'reservation';
}

interface VenteItem extends Vente {
  type: 'vente';
}

type CartItem = ReservationItem | VenteItem;

export default function SideCart({
  open,
  onClose,
  userId,
  onHover,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  onHover: (isHovering: boolean) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { reservations, setReservations, ventes, setVentes } = useSideCartStore();

  useEffect(() => {
    if (!userId || !open) return;

    const fetchReservations = async () => {
      const { data } = await supabase
        .from('reservations')
        .select(`*, articles (titre, image_url, valeur_jeton)`)
        .eq('user_id', userId)
        .eq('statut', 'en_attente');
      if (data) setReservations(data as Reservation[]);
    };

    const fetchVentes = async () => {
      const { data } = await supabase
        .from('ventes')
        .select(`*, articles (titre, image_url)`)
        .eq('user_id', userId)
        .eq('statut', 'panier');
      if (data) setVentes(data as Vente[]);
    };

    fetchReservations();
    fetchVentes();
  }, [userId, open, setReservations, setVentes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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

  const allItems: CartItem[] = [
    ...reservations.map((r) => ({ ...r, type: 'reservation' as const })),
    ...ventes.map((v) => ({ ...v, type: 'vente' as const }))
  ];

  const totalJetons = reservations.reduce((sum, r) => sum + r.articles.valeur_jeton, 0);
  const totalEuros = ventes.reduce((sum, v) => sum + v.prix_vente, 0);

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
        {allItems.map((item, i) => (
          <div key={item.id + '-' + i} className="flex gap-3 border-b pb-3">
            <img
              src={item.articles.image_url}
              alt={item.articles.titre}
              className="w-16 h-20 object-cover rounded"
            />
            <div className="flex-1 text-sm">
              <p className="font-semibold">{item.articles.titre}</p>
              <p className="text-xs text-gray-600">Taille : {item.taille}</p>
              <p className={`text-xs font-semibold ${item.type === 'reservation' ? 'text-purple-600' : 'text-green-600'}`}>
                {item.type === 'reservation'
                  ? `${(item as Reservation).articles.valeur_jeton} jeton${(item as Reservation).articles.valeur_jeton > 1 ? 's' : ''}`
                  : `${(item as Vente).prix_vente.toFixed(2)} €`}
              </p>
            </div>
            <button
              onClick={async () => {
                if (item.type === 'reservation') {
                  await supabase.from('reservations').delete().eq('id', item.id);
                  setReservations((prev) => (prev.filter((r) => r.id !== item.id) as Reservation[]));
                } else {
                  await supabase.from('ventes').delete().eq('id', item.id);
                  setVentes((prev) => (prev.filter((v) => v.id !== item.id) as Vente[]));
                }
              }}
              className="text-sm text-red-500 hover:underline"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white shadow-lg z-10">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600 font-medium">PRIX TOTAL :</span>
          <div className="text-right">
            {totalJetons > 0 && (
              <p className="text-purple-600 font-semibold">{totalJetons} jeton{totalJetons > 1 ? 's' : ''}</p>
            )}
            {totalEuros > 0 && (
              <p className="text-green-600 font-semibold">{totalEuros.toFixed(2)} €</p>
            )}
          </div>
        </div>
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
