'use client';

import { useEffect, useState, useRef } from 'react';
import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import SideCart from '@/components/SideCart';
import PanierIcon from '@/components/PanierIcon';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [jetons, setJetons] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartHovering, setCartHovering] = useState(false);
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
    }, 400); // délai de fermeture après sortie
  }
};

const handleCartClick = () => {
  router.push('/panier');
};

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      {/* Ligne haute */}
      <div className="flex justify-between items-center px-6 py-2 text-sm text-gray-700">
        <Link href="/comment-ca-marche" className="hover:underline hover:text-blue-600 transition">
          Comment ça marche ?
        </Link>

        <div className="text-xl font-extrabold tracking-wider text-blue-700 uppercase">
          GranDressing
        </div>

<div className="flex gap-6 items-center">
  {user ? (
    <>
      <span className="flex items-center text-gray-700 font-semibold">
        🪙 {jetons ?? '...'} jetons
      </span>

      <Menu as="div" className="relative">
        <Menu.Button className="text-gray-700 hover:text-blue-600 font-medium">
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
      <Link href="/inscription" className="hover:text-blue-600 transition">Inscription</Link>
      <Link href="/connexion" className="hover:text-blue-600 transition">Connexion</Link>
    </>
  )}
    {/* Panier toujours visible */}
<PanierIcon
  userId={user?.id}
  onClick={handleCartClick}
  onHover={handleCartHover}
/>



        </div>
      </div>

      {/* Ligne basse */}
      <div className="flex justify-center items-center gap-6 px-6 py-2 text-sm font-medium text-gray-700 border-t border-gray-100">
        <Link href="/catalogue" className="hover:text-blue-600 transition">Catalogue</Link>
        <Link href="/catalogue?genre=femme" className="hover:text-blue-600 transition">Femme</Link>
        <Link href="/catalogue?genre=homme" className="hover:text-blue-600 transition">Homme</Link>
        <Link href="ofm" className="hover:text-blue-600 transition">OFM</Link>
        <Link href="/catalogue?type=accessoires" className="hover:text-blue-600 transition">Accessoire</Link>
        <Link href="/catalogue?type=chaussure" className="hover:text-blue-600 transition">Chaussure</Link>
        <Link href="friperie" className="hover:text-blue-600 transition">Friperie</Link>
        <Link href="/communaute" className="hover:text-blue-600 transition">Communauté</Link>
      </div>

      <SideCart
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        userId={user?.id}
        onHover={handleCartHover}
      />

    </div>
  );
}
