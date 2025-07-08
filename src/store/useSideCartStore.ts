import { create } from 'zustand';

export interface Reservation {
  id: string;
  user_id: string;
  taille: string;
  statut: string;
  articles?: {
    titre?: string;
    image_url?: string;
    valeur_jeton?: number;
  };
}

interface SideCartState {
  reservations: Reservation[];
  setReservations: (
    updater: Reservation[] | ((prev: Reservation[]) => Reservation[])
  ) => void;
}

export const useSideCartStore = create<SideCartState>((set) => ({
  reservations: [],
  setReservations: (updater) => {
    set((state) => ({
      reservations:
        typeof updater === 'function' ? updater(state.reservations) : updater,
    }));
  },
}));
