'use client';

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSideCartStore } from '@/store/useSideCartStore';
// Correction : Import de Image
import Image from 'next/image';

// Correction : Définition des interfaces pour éviter le 'any'
interface TailleArticle {
  taille: string;
  disponible: boolean;
}

interface Article {
  id: string;
  titre: string;
  image_url: string;
  description?: string;
  prix_vente: number;
  prix_apres_location?: number;
  tailles_articles: TailleArticle[];
}

interface Props {
  article: Article; // Correction : Typage strict de l'article
  onClose: () => void;
  preselectedTaille?: string;
}

interface Vente {
  id: string;
  user_id: string;
  article_id: string;
  taille: string;
  prix_vente: number;
  statut: string;
  articles: {
    titre: string;
    image_url: string;
  };
}

export default function AchatModal({ article, onClose, preselectedTaille }: Props) {
  const [tailleSelectionnee, setTailleSelectionnee] = useState<string | null>(preselectedTaille || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { ventes, setVentes } = useSideCartStore();

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

  const handleAchat = async () => {
    if (!tailleSelectionnee) {
      setMessage("Choisis une taille pour continuer.");
      return;
    }

    setLoading(true);

    // Correction : Suppression de la variable d'erreur inutile
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      setMessage("Utilisateur non connecté.");
      setLoading(false);
      return;
    }

    // 🔍 Récupère l'abonnement pour appliquer la réduction
    const { data: aboData } = await supabase
      .from('abonnements')
      .select('niveau')
      .eq('user_id', userId)
      .single();

    const reduction =
      aboData?.niveau === 'Premium' ? 0.75 :
      aboData?.niveau === 'Standard' ? 0.9 :
      1;

    const prixReduit = ((article.prix_apres_location ?? article.prix_vente) * reduction);

    // 🛒 Insère la vente dans Supabase
    const { data, error } = await supabase
      .from('ventes')
      .insert({
        user_id: userId,
        article_id: article.id,
        taille: tailleSelectionnee,
        prix_vente: prixReduit,
        statut: 'panier',
      })
      .select();

    if (!error && data && data.length > 0) {
      const venteInseree = data[0];

      const nouvelleVente: Vente = {
        id: venteInseree.id,
        user_id: userId,
        article_id: article.id,
        taille: tailleSelectionnee,
        prix_vente: prixReduit,
        statut: 'panier',
        articles: {
          titre: article.titre,
          image_url: article.image_url,
        },
      };

      setVentes([...ventes, nouvelleVente]);
      setMessage("Achat confirmé 🎉");
      setTimeout(() => onClose(), 1500);
    } else {
      setMessage("Erreur lors de l’achat. Réessaie.");
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
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-2 pr-6">{article.titre}</h2>
        
        {/* Correction : Remplacement de <img> par <Image /> */}
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

        <p className="text-green-600 font-bold mt-2">
          {(article.prix_apres_location ?? article.prix_vente).toFixed(2)} €
        </p>

        <label className="block mt-4 mb-2 text-sm font-medium">Choisir une taille :</label>
        <div className="flex flex-wrap gap-2">
          {/* Correction : Utilisation du type TailleArticle au lieu de any */}
          {article.tailles_articles?.map((t: TailleArticle) => (
            <button
              key={t.taille}
              disabled={!t.disponible}
              onClick={() => setTailleSelectionnee(t.taille)}
              className={`px-3 py-1 rounded border text-sm ${
                t.disponible
                  ? tailleSelectionnee === t.taille
                    ? 'bg-green-600 text-white'
                    : 'hover:bg-green-100'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.taille}
            </button>
          ))}
        </div>

        <button
          disabled={loading}
          onClick={handleAchat}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Achat en cours...' : 'Confirmer l’achat'}
        </button>

        {message && <p className="text-sm mt-2 text-center">{message}</p>}

        <button className="text-gray-500 text-sm mt-4 block mx-auto underline" onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}