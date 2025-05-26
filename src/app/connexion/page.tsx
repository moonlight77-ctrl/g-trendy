'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Connexion réussie !');
      router.push('/profil');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Connexion</h1>
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
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleLogin}>
        Se connecter
      </button>
      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </main>
  );
}
