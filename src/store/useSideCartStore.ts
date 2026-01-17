// Nouveau useSideCartStore.ts (avec setters améliorés)
import { create } from 'zustand';

export interface Reservation {
  id: string;
  user_id: string;
  article_id: string;
  taille: string;
  statut: string;
  articles: {
    titre: string;
    image_url: string;
    valeur_jeton: number;
  };
}

export interface Vente {
  id: string;
  user_id: string;
  article_id: string;
  taille: string;
  statut: string;
  prix_vente: number;
  articles: {
    titre: string;
    image_url: string;
  };
}



interface SideCartState {
  reservations: Reservation[];
  ventes: Vente[];
  setReservations: (r: Reservation[] | ((prev: Reservation[]) => Reservation[])) => void;
  setVentes: (v: Vente[] | ((prev: Vente[]) => Vente[])) => void;
}

export const useSideCartStore = create<SideCartState>((set) => ({
  reservations: [],
  ventes: [],
  setReservations: (r) => set((state) => ({
    reservations: typeof r === 'function' ? r(state.reservations) : r
  })),
  setVentes: (v) => set((state) => ({
    ventes: typeof v === 'function' ? v(state.ventes) : v
  })),
}));
