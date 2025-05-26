'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Profil() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/connexion');
      } else {
        setUser(user);
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white p-4">
      <h1 className="text-xl font-bold">Bienvenue {user.email} 👋</h1>
      <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleLogout}>
        Se déconnecter
      </button>
    </main>
  );
}
