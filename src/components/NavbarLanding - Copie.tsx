'use client';

import Link from 'next/link';
import { smoothScrollTo } from '@/utils/scroll'; // Importez la fonction

type NavbarLandingProps = {
  editionLabel?: string;
};

export default function NavbarLanding({ editionLabel = '🚀 Lancement 2026 · accès anticipé' }: NavbarLandingProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F5F0] border-b border-[#A8C3A0]/60">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center">
          <div />

          <Link
            href="/waitlist"
            className="justify-self-center text-2xl font-semibold tracking-[0.18em] text-[#111] uppercase"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Grandressing
          </Link>

          <div className="justify-self-end">
            <a
              href="#waitlist"
              onClick={(e) => smoothScrollTo(e, 'waitlist')}
              className="inline-flex h-11 items-center justify-center rounded-lg
                        border border-black px-5
                        text-black text-sm font-medium
                        hover:bg-black hover:text-white
                        transition-colors duration-200 cursor-pointer"
            >
              Rejoindre la waitlist
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-black/5">
        <div className="flex justify-center items-center px-6 py-2 text-sm font-medium text-[#2F2F2F] border-t border-[#A8C3A0]/40 bg-white">
          <a 
            href="#edition" 
            onClick={(e) => smoothScrollTo(e, 'edition')}
            className="hover:text-[#A8C3A0] transition cursor-pointer"
          >
            🚀 Lancement 2026 : <span className="font-semibold">{editionLabel}</span>
          </a>
        </div>
      </div>
    </header>
  );
}