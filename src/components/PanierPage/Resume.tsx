
'use client';

import { useSideCartStore } from '@/store/useSideCartStore';

export default function Resume({ soldeEstimé }: { soldeEstimé: number | null }) {
  const { reservations, ventes } = useSideCartStore();

  const jetonsUtilisés = Array.isArray(reservations)
    ? reservations.reduce((sum, r) => sum + (r.articles?.valeur_jeton || 0), 0)
    : 0;

  const totalEuros = Array.isArray(ventes)
    ? ventes.reduce((sum, v) => sum + (v.prix_vente || 0), 0)
    : 0;

  const soldeClass =
    soldeEstimé !== null && soldeEstimé < 0 ? 'text-red-600' : 'text-gray-700';

  return (
    <aside className="bg-white p-4 rounded shadow h-fit sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Résumé</h2>
      <p className="text-sm text-gray-700 mb-2">
        Jetons à dépenser : <strong>{jetonsUtilisés}</strong>
      </p>
      {totalEuros > 0 && (
        <p className="text-sm text-gray-700 mb-2">
          Achats en euros : <strong>{totalEuros.toFixed(2)} €</strong>
        </p>
      )}
      {soldeEstimé !== null && (
        <p className={`text-sm font-medium ${soldeClass}`}>
          Solde estimé après paiement : {soldeEstimé} jetons
        </p>
      )}
    </aside>
  );
}
