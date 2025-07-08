interface Props {
  total: number;
  jetonsRestants: number;
}

export default function RecapitulatifCommande({ total, jetonsRestants }: Props) {
  const formatDate = (days: number) =>
    new Date(Date.now() + days * 86400000).toLocaleDateString();

  return (
    <div className="bg-white border rounded-lg p-6 mb-8 shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-[url('/zigzag-top.svg')] bg-repeat-x" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[url('/zigzag-bottom.svg')] bg-repeat-x" />
      <p className="font-semibold mb-2">🧾 Récapitulatif :</p>
      <p>Total dépensé : <span className="font-bold text-purple-600">{total} jetons</span></p>
      <p>Jetons restants : <span className="font-bold">{jetonsRestants}</span></p>
      <p className="mt-2 text-sm text-gray-600">
        📦 Livraison estimée entre <strong>{formatDate(4)}</strong> et <strong>{formatDate(7)}</strong>
      </p>
    </div>
  );
}