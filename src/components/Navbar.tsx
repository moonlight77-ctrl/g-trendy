'use client';

import { useEffect, useState, useRef } from 'react';
import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

// Ajout de l'interface User
interface User {
  id: string;
  email?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // ✅ Remplacé any
  const [jetons, setJetons] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJetons = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('abonnements')
          .select('jetons_disponibles')
          .eq('user_id', user.id)
          .single();

        if (data && !error) setJetons(data.jetons_disponibles);
      }
    };

    fetchJetons();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleCartHover = (hovering: boolean) => {
    if (hovering) {
      if (cartTimeout.current) clearTimeout(cartTimeout.current);
      setIsCartOpen(true);
    } else {
      cartTimeout.current = setTimeout(() => {
        setIsCartOpen(false);
      }, 400);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-[#F9F5F0] shadow-sm border-b border-[#A8C3A0]">

      {/* Ligne haute */}
      <div className="flex justify-center items-center px-6 py-1 text-sm text-[#2F2F2F]">

        <div className="flex justify-between items-center w-full max-w-6xl">
          <Link href="/comment-ca-marche" className="hover:underline hover:text-[#A8C3A0] transition">
            Comment ça marche ?
          </Link>

          <div className="text-2xl font-extrabold tracking-wider text-[#2F2F2F] uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
            GranDressing
          </div>

          <div className="flex gap-6 items-center">
            {user ? (
              <>
                <span className="flex items-center text-[#2F2F2F] font-semibold">
                  🪙 {jetons ?? '...'} jetons
                </span>

                <Menu as="div" className="relative">
                  <Menu.Button className="text-[#2F2F2F] hover:text-[#D4B170] font-medium">
                    👤 Profil ▾
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-1 text-sm z-50">
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/profil" className={`block px-4 py-2 ${active ? 'bg-gray-100' : ''}`}>
                          Mon profil
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/commandes" className={`block px-4 py-2 ${active ? 'bg-gray-100' : ''}`}>
                          Mes commandes
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/favoris" className={`block px-4 py-2 ${active ? 'bg-gray-100' : ''}`}>
                          Favoris
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/fidelite" className={`block px-4 py-2 ${active ? 'bg-gray-100' : ''}`}>
                          Programme fidélité
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 text-red-600 ${active ? 'bg-gray-100' : ''}`}
                        >
                          Déconnexion
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/inscription" className="hover:text-[#D4B170] transition">
                  Inscription
                </Link>
                <Link href="/connexion" className="hover:text-[#D4B170] transition">
                  Connexion
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ligne basse */}
      <div className="flex justify-center items-center gap-6 px-6 py-1 text-sm font-medium text-[#2F2F2F] border-t border-[#A8C3A0]/40">
        <Link href="/catalogue" className="hover:text-[#A8C3A0] transition">Catalogue</Link>
        <Link href="/ofm" className="hover:text-[#A8C3A0] transition">OFM</Link>
        <Link href="/catalogue?type=accessoires" className="hover:text-[#A8C3A0] transition">Accessoire</Link>
        <Link href="/catalogue?type=chaussure" className="hover:text-[#A8C3A0] transition">Chaussure</Link>
        <Link href="/friperie" className="hover:text-[#A8C3A0] transition">Friperie</Link>
      </div>
    </div>
  );
}