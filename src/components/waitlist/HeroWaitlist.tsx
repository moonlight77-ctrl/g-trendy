'use client';

import Link from 'next/link'; // Import indispensable
import { smoothScrollTo } from '@/utils/scroll'; // Importez la fonction créée étape 1

export default function HeroWaitlist() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Fond vidéo pleine largeur */}
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/0" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            GrandDressing — la mode qui se partage
          </div>

          <h1 className="text-[40px] sm:text-6xl font-extrabold leading-[1.05]">
            Change ta garde-robe{" "}
            <span className="text-emerald-300">sans acheter</span>.
          </h1>

          <p className="mt-4 text-base sm:text-xl text-white/90 max-w-xl">
            Rejoins la liste d’attente et sois parmi les premiers à tester la plateforme.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">

            {/* BOUTON WAITLIST */}
            <a
              href="#waitlist"
              onClick={(e) => smoothScrollTo(e, 'waitlist')} // 130px de marge
              className="inline-flex h-[52px] items-center justify-center rounded-lg bg-white px-6
                         text-black font-medium hover:bg-white/90 transition w-full sm:w-auto cursor-pointer"
            >
              Rejoindre la waitlist
            </a>

            {/* BOUTON EDITION */}
            <a
              href="#edition"
              onClick={(e) => smoothScrollTo(e, 'edition')} // 130px de marge
              className="inline-flex h-[52px] items-center justify-center rounded-lg border border-white/35 px-6
                         text-white font-medium hover:bg-white/10 transition w-full sm:w-auto cursor-pointer"
            >
              Découvrir l’édition du moment
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <CheckIcon /> Inscription rapide
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon /> Pas de spam
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon /> Accès anticipé
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-emerald-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}