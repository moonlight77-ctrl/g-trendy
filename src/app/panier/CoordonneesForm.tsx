
'use client';

import { useState } from 'react';
import { Button } from '@/components/button';

export default function CoordonneesForm({ onValid }: { onValid: (data: any) => void }) {
  const [coordonnees, setCoordonnees] = useState({
    prenom: '', nom: '', adresse: '', ville: '', cp: '', tel: ''
  });

  const isValid = Object.values(coordonnees).every(Boolean);

  const handleSubmit = () => {
    if (isValid) {
      onValid(coordonnees);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Coordonnées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="Prénom" value={coordonnees.prenom} onChange={(e) => setCoordonnees({ ...coordonnees, prenom: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Nom" value={coordonnees.nom} onChange={(e) => setCoordonnees({ ...coordonnees, nom: e.target.value })} />
        <input className="border p-2 rounded md:col-span-2" placeholder="Adresse" value={coordonnees.adresse} onChange={(e) => setCoordonnees({ ...coordonnees, adresse: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Code postal" value={coordonnees.cp} onChange={(e) => setCoordonnees({ ...coordonnees, cp: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Ville" value={coordonnees.ville} onChange={(e) => setCoordonnees({ ...coordonnees, ville: e.target.value })} />
        <input className="border p-2 rounded md:col-span-2" placeholder="Téléphone" value={coordonnees.tel} onChange={(e) => setCoordonnees({ ...coordonnees, tel: e.target.value })} />
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit} disabled={!isValid}>Suivant</Button>
    </div>
  );
}
