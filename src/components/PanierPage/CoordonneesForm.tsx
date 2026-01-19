'use client';

import { useState } from 'react';
import { Button } from '@/components/button';

// ✅ Création de l'interface pour les données du formulaire
interface CoordonneesData {
  prenom: string;
  nom: string;
  adresse: string;
  ville: string;
  cp: string;
  tel: string;
}

// ✅ Création de l'interface pour les props (remplace le typage inline avec any)
interface CoordonneesFormProps {
  onValid: (data: CoordonneesData) => void;
}

export default function CoordonneesForm({ onValid }: CoordonneesFormProps) {
  const [coordonnees, setCoordonnees] = useState<CoordonneesData>({
    prenom: '', nom: '', adresse: '', ville: '', cp: '', tel: ''
  });

  // Vérifie que tous les champs sont remplis (chaînes non vides)
  const isValid = Object.values(coordonnees).every((value) => value.trim() !== '');

  const handleSubmit = () => {
    if (isValid) {
      onValid(coordonnees);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Coordonnées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input 
          className="border p-2 rounded" 
          placeholder="Prénom" 
          value={coordonnees.prenom} 
          onChange={(e) => setCoordonnees({ ...coordonnees, prenom: e.target.value })} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Nom" 
          value={coordonnees.nom} 
          onChange={(e) => setCoordonnees({ ...coordonnees, nom: e.target.value })} 
        />
        <input 
          className="border p-2 rounded md:col-span-2" 
          placeholder="Adresse" 
          value={coordonnees.adresse} 
          onChange={(e) => setCoordonnees({ ...coordonnees, adresse: e.target.value })} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Code postal" 
          value={coordonnees.cp} 
          onChange={(e) => setCoordonnees({ ...coordonnees, cp: e.target.value })} 
        />
        <input 
          className="border p-2 rounded" 
          placeholder="Ville" 
          value={coordonnees.ville} 
          onChange={(e) => setCoordonnees({ ...coordonnees, ville: e.target.value })} 
        />
        <input 
          className="border p-2 rounded md:col-span-2" 
          placeholder="Téléphone" 
          value={coordonnees.tel} 
          onChange={(e) => setCoordonnees({ ...coordonnees, tel: e.target.value })} 
        />
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit} disabled={!isValid}>
        Suivant
      </Button>
    </div>
  );
}