'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSideCartStore } from '@/store/useSideCartStore';


interface Props {
  article: any;
  onClose: () => void;
  userId: string;
  preselectedTaille?: string;
}

export default function ReservationModal({ article, onClose, userId, preselectedTaille }: Props) {
  const [tailleSelectionnee, setTailleSelectionnee] = useState<string | null>(preselectedTaille || null);
  const [message, setMessage] = useState('');
  const [jetons, setJetons] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setReservations, reservations } = useSideCartStore();



  const handleBackgroundClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

    useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);



  useEffect(() => {
    const fetchJetons = async () => {
      const { data, error } = await supabase
        .from('abonnements')
        .select('jetons_disponibles')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        setMessage("Erreur lors de la récupération des jetons.");
      } else {
        setJetons(data.jetons_disponibles);
      }
    };

    fetchJetons();
  }, [userId]);

  const handleReservation = async () => {
  if (!tailleSelectionnee) return setMessage("Choisis une taille.");
  if (jetons === null) return setMessage("Chargement des jetons...");
  if (jetons < article.valeur_jeton) {
    return setMessage("Jetons insuffisants pour cet article.");
  }

  setLoading(true);

  const { data, error: insertError } = await supabase.from('reservations').insert({
    article_id: article.id,
    user_id: userId,
    taille: tailleSelectionnee,
    statut: 'en_attente',
  }).select().single(); // 👈 pour récupérer l'objet inséré avec l'id

  if (insertError || !data) {
    setMessage("Erreur lors de la réservation.");
    setLoading(false);
    return;
  }

  const { error: updateError } = await supabase
    .from('abonnements')
    .update({ jetons_disponibles: jetons - article.valeur_jeton })
    .eq('user_id', userId);

  if (updateError) {
    setMessage("Erreur lors de la mise à jour des jetons.");
  } else {
    setReservations([
      ...reservations,
      {
        id: data.id, // ✅ ID réel Supabase
        taille: tailleSelectionnee,
        valeur_jeton: article.valeur_jeton,
        articles: {
          titre: article.titre,
          image_url: article.image_url,
          valeur_jeton: article.valeur_jeton
        }
      }
    ]);
    setMessage("Réservation confirmée 🎉");
    setTimeout(onClose, 1500);
  }

  setLoading(false);
};

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white p-6 rounded w-full max-w-md shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-2">{article.titre}</h2>
        <img src={article.image_url} alt={article.titre} className="w-full h-48 object-cover rounded mb-2" />
        <p className="text-sm text-gray-600">{article.description}</p>
        <p className="text-sm mt-2 font-medium text-blue-600">
          Coût : {article.valeur_jeton} jeton(s) | Jetons restants : {jetons ?? '...'}
        </p>
        <label className="block mt-4 mb-2 text-sm font-medium">Choisir une taille :</label>
        <div className="flex flex-wrap gap-2">
          {article.tailles_articles?.map((t: any) => (
            <button
              key={t.taille}
              disabled={!t.disponible}
              onClick={() => setTailleSelectionnee(t.taille)}
              className={`px-3 py-1 rounded border text-sm ${
                t.disponible
                  ? tailleSelectionnee === t.taille
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-100'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.taille}
            </button>
          ))}
        </div>

        <button
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
          onClick={handleReservation}
        >
          {loading ? 'Réservation...' : 'Ajouter au panier'}
        </button>

        {message && <p className="text-sm mt-2 text-center">{message}</p>}
        <button className="text-gray-500 text-sm mt-4 block mx-auto underline" onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}
