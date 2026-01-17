'use client';

import Link from 'next/link';
import { MouseEvent } from 'react';

type NavbarLandingProps = {
  editionLabel?: string;
};

export default function NavbarLanding({ editionLabel = '🚀 Lancement 2026 · accès anticipé' }: NavbarLandingProps) {

  // Fonction de scroll fluide intégrée
  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault(); // Empêche le saut brutal par défaut
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F5F0] border-b border-[#A8C3A0]/60">
      
      {/* Zone principale de la nav */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 relative flex items-center justify-end">
        
        {/* LOGO */}
        <Link
          href="/waitlist"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     text-lg sm:text-2xl font-semibold tracking-[0.18em] text-[#111] uppercase whitespace-nowrap"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Grandressing
        </Link>

        {/* BOUTON D'ACTION */}
        <a
          href="#waitlist"
          onClick={(e) => handleScroll(e, 'waitlist')} // Appel de notre fonction locale
          className="inline-flex h-10 sm:h-11 items-center justify-center rounded-lg
                    border border-black px-3 sm:px-5
                    text-black text-xs sm:text-sm font-medium
                    hover:bg-black hover:text-white
                    transition-colors duration-200 cursor-pointer z-10 relative bg-[#F9F5F0] sm:bg-transparent"
        >
          {/* Texte mobile */}
          <span className="sm:hidden">Waitlist</span>
          
          {/* Texte Desktop */}
          <span className="hidden sm:inline">Rejoindre la waitlist</span>
        </a>
      </div>

      {/* Barre inférieure (Sous-header) */}
      <div className="bg-white border-t border-black/5">
        <div className="flex justify-center items-center px-6 py-2 text-sm font-medium text-[#2F2F2F] border-t border-[#A8C3A0]/40 bg-white">
          <a 
            href="#edition" 
            onClick={(e) => handleScroll(e, 'edition')}
            className="hover:text-[#A8C3A0] transition cursor-pointer text-center"
          >
            🚀 Lancement 2026 : <span className="font-semibold">{editionLabel}</span>
          </a>
        </div>
      </div>
    </header>
  );
}