import Image from 'next/image';
import { Reservation } from '@/store/useSideCartStore';

interface Props {
  reservations: Reservation[];
}

export default function CommandeArticles({ reservations }: Props) {
  return (
    <div className="space-y-4 mb-8">
      {reservations.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-4 bg-white border rounded p-4 shadow-sm"
        >
          <Image
            src={r.articles?.image_url || '/placeholder.jpg'}
            alt={r.articles?.titre}
            width={60}
            height={80}
            className="rounded object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold">{r.articles?.titre}</p>
            <p className="text-sm text-gray-600">Taille : {r.taille}</p>
          </div>
          <div className="text-purple-600 font-semibold text-sm">
            {r.articles?.valeur_jeton} jetons
          </div>
        </div>
      ))}
    </div>
  );
}