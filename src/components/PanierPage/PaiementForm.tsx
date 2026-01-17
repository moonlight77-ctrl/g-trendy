
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/button';

export default function PaiementForm({ soldeEstimé }: { soldeEstimé: number | null }) {
  const [paiement, setPaiement] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Paiement</h2>
      <div className="flex gap-3 mb-4">
        {['visa', 'mastercard', 'paypal', 'applepay'].map((m) => (
          <button
            key={m}
            onClick={() => setPaiement(m)}
            className={
              'flex-1 p-3 rounded border ' +
              (paiement === m ? 'border-purple-600 bg-purple-50' : 'border-gray-300')
            }
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      <Button
        className="w-full"
        disabled={!paiement || (soldeEstimé !== null && soldeEstimé < 0)}
        onClick={() => router.push('/confirmation')}
      >
        Confirmer la réservation
      </Button>
      {soldeEstimé !== null && soldeEstimé < 0 && (
        <div className="mt-4 bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded">
          Il semble que tu n'aies pas assez de jetons.<br />
          <a href="/acheter-jetons" className="underline font-semibold hover:text-red-800">
            Acheter des jetons supplémentaires →
          </a>
        </div>
      )}
    </div>
  );
}
