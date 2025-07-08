import { create } from 'zustand';

interface Article {
  id: string;
  titre: string;
  taille: string;
  valeur_jeton: number;
  image_url?: string;
}

interface ReservationStore {
  reservations: Article[];
  jetons: number;
  isModalOpen: boolean;
  preselectedTaille: string | null;

  setReservations: (data: Article[]) => void;
  addReservation: (article: Article) => void;
  removeReservation: (id: string) => void;
  clearReservations: () => void;

  setJetons: (val: number) => void;

  openModal: (taille?: string) => void;
  closeModal: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  jetons: 0,
  isModalOpen: false,
  preselectedTaille: null,

  setReservations: (data) => set({ reservations: data }),
  addReservation: (article) =>
    set((state) => ({
      reservations: [...state.reservations, article],
    })),
  removeReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((a) => a.id !== id),
    })),
  clearReservations: () => set({ reservations: [] }),

  setJetons: (val) => set({ jetons: val }),

  openModal: (taille = null) => set({ isModalOpen: true, preselectedTaille: taille }),
  closeModal: () => set({ isModalOpen: false, preselectedTaille: null }),
}));
