'use client';

import { useState } from 'react';
import Link from 'next/link';

const filtres = [
  {
    label: 'Femme',
    categorie: 'femme',
    sousCategories: ['robes', 'pantalons', 'tops', 'jupes'],
  },
  {
    label: 'Homme',
    categorie: 'homme',
    sousCategories: ['vestes', 'jeans', 't-shirts', 'costumes'],
  },
  {
    label: 'Chaussures',
    categorie: 'chaussures',
    sousCategories: ['sneakers', 'talons', 'bottines', 'sandales'],
  },
  {
    label: 'Accessoires',
    categorie: 'accessoires',
    sousCategories: ['sacs', 'bijoux', 'montres', 'ceintures'],
  },
];

export default function FiltreVertical() {
  const [ouvert, setOuvert] = useState<string | null>(null);

  const toggle = (cat: string) => {
    setOuvert(ouvert === cat ? null : cat);
  };

  return (
    <aside className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-md font-semibold mb-4">Catégories</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        {filtres.map((f) => (
          <li key={f.categorie}>
            <button
              onClick={() => toggle(f.categorie)}
              className="w-full text-left font-medium hover:text-blue-600"
            >
              {f.label}
            </button>
            {ouvert === f.categorie && (
              <ul className="ml-4 mt-2 space-y-1">
                {f.sousCategories.map((sous) => (
                  <li key={sous}>
                    <Link
                      href={`/catalogue?genre=${f.categorie}&categorie=${sous}`}
                      className="text-gray-600 hover:underline"
                    >
                      {sous}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
