'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
interface Props {
  prixBase: number;
  prix_apres_location: number;
  est_en_location: boolean;
}

export default function PrixAvecReduction({
  prixBase,
  prix_apres_location,
  est_en_location,
}: Props) {
  const [niveau, setNiveau] = useState<'non' | 'standard' | 'premium'>('non');

  useEffect(() => {
    const fetchAbonnement = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data } = await supabase
        .from('abonnements')
        .select('niveau')
        .eq('user_id', userData.user.id)
        .single();

      if (data?.niveau === 'Premium') setNiveau('premium');
      else if (data?.niveau === 'Standard') setNiveau('standard');
      else setNiveau('non');
    };

    fetchAbonnement();
  }, []);

  const reductionAbonnement =
    niveau === 'premium' ? 0.75 : niveau === 'standard' ? 0.9 : 1;

  const prixFinal = prix_apres_location * reductionAbonnement;
  const economie = prixBase - prixFinal;

  return (
    <div className="mt-2">
      {/* Prix + icône alignés */}
      <div className="flex items-center gap-1">
        {prixBase !== prixFinal && (
          <p className="text-sm text-gray-400 line-through">
            {prixBase.toFixed(2)} €
          </p>
        )}
        <p className="text-green-600 font-bold text-lg">
          {prixFinal.toFixed(2)} €
        </p>
        <span
          title={
            est_en_location
              ? 'Article actuellement loué — prix potentiellement en baisse'
              : 'Article disponible — prix stable'
          }
          className={`text-lg ${
            est_en_location ? 'text-yellow-600' : 'text-gray-400'
          }`}
        >
          {est_en_location ? '🔻' : '⏸️'}
        </span>
      </div>

      {/* Message d’abonnement */}
      {niveau === 'standard' && (
        <p className="text-xs text-purple-600 mt-1">
            <a
          href="/fidelite"
          className="underline text-purple-600 hover:text-purple-900" 
          >
          👑 Passe Premium : économisez {economie.toFixed(2)} €
          </a>
        </p>
      )}

      {niveau === 'non' && (
        <p className="text-xs text-blue-600 mt-1">
          <a
            href='/fidelite'
            className='underline text-purple-600 hover:text-purple-900'>
          💡 Abonne-toi pour profiter de réductions exclusives
          </a>
        </p>
      )}
    </div>
  );
}
