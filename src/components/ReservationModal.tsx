'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';
// Correction 1 : Suppression de useRouter inutilisé
// Correction : Ajout de l'import Image
import Image from 'next/image';
import { useSideCartStore } from '@/store/useSideCartStore';

// Correction 2 : Définition des interfaces pour remplacer 'any'
interface TailleArticle {
  taille: string;
  disponible: boolean;
}

interface Article {
  id: string;
  titre: string;
  image_url: string;
  description?: string;
  valeur_jeton: number;
  tailles_articles: TailleArticle[];
}

interface Props {
  article: Article; // Typage strict ici
  onClose: () => void;
  userId: string;
  preselectedTaille?: string;
}

export default function ReservationModal({ article, onClose, userId, preselectedTaille }: Props) {
  const [tailleSelectionnee, setTailleSelectionnee] = useState<string | null>(preselectedTaille || null);
  const [message, setMessage] = useState('');
  const [jetons, setJetons] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
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
    }).select().single();

    if (insertError || !data) {
      setMessage("Erreur lors de la réservation.");
      setLoading(false);
      return;
    }

    setReservations([
      ...reservations,
      {
        id: data.id,
        taille: tailleSelectionnee,
        statut: 'en_attente',
        user_id: userId,
        articles: {
          titre: article.titre,
          image_url: article.image_url,
          valeur_jeton: article.valeur_jeton
        }
      }
    ]);
    setMessage("Réservation ajoutée 🎉");
    setTimeout(onClose, 1500);
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
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-2 pr-6">{article.titre}</h2>
        
        {/* Correction 3 : Remplacement de <img> par <Image /> */}
        <div className="relative w-full h-48 mb-2">
          <Image 
            src={article.image_url} 
            alt={article.titre} 
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <p className="text-sm text-gray-600">{article.description}</p>
        <p className="text-sm mt-2 font-medium text-blue-600">
          Coût : {article.valeur_jeton} jeton(s) | Jetons restants : {jetons ?? '...'}
        </p>

        <label className="block mt-4 mb-2 text-sm font-medium">Choisir une taille :</label>
        <div className="flex flex-wrap gap-2">
          {/* Typage explicite dans le map */}
          {article.tailles_articles?.map((t: TailleArticle) => (
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