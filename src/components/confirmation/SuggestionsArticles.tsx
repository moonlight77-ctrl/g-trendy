import Image from 'next/image';

interface ArticleSuggestion {
  id: string;
  titre: string;
  image_url: string;
  valeur_jeton: number;
}

interface Props {
  suggestions: ArticleSuggestion[];
}

export default function SuggestionsArticles({ suggestions }: Props) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
      <p className="font-semibold text-lg mb-4">🎁 Suggestions pour toi</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {suggestions.map((sugg) => (
          <div key={sugg.id} className="border rounded p-2 text-sm text-center shadow">
            <Image
              src={sugg.image_url || '/placeholder.jpg'}
              alt={sugg.titre}
              width={100}
              height={140}
              className="mx-auto rounded object-cover"
            />
            <p className="mt-2 font-medium">{sugg.titre}</p>
            <p className="text-purple-600 font-semibold">{sugg.valeur_jeton} jetons</p>
          </div>
        ))}
      </div>
    </div>
  );
}