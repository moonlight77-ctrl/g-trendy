'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';


export default function Inscription() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Vérifie ta boîte mail pour confirmer ton compte.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <input
        className="border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSignUp}>
        Sn&apos;inscrire
      </button>
      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </main>
  );
}
