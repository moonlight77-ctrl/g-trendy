import Image from "next/image";


export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 text-xs font-semibold mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-600" /> Nouveau • Mode circulaire
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Explorez votre <span className="text-emerald-600">dressing illimité</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-xl">
            Louez, mixez et renouvelez votre style sans surconsommer. Accédez à un catalogue évolutif de pièces sélectionnées, livrées chez vous.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#cta" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
              Créer mon dressing
            </a>
            <a href="#how" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50">
              Comment ça marche
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <li className="flex items-center gap-2"><CheckIcon /> Sans engagement</li>
            <li className="flex items-center gap-2"><CheckIcon /> Livraison & retours inclus</li>
            <li className="flex items-center gap-2"><CheckIcon /> Entretien éco-responsable</li>
          </ul>
        </div>
        <HeroVisual />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-slate-200">
      <Image
        src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop"
        alt="Portes de dressing ouvertes avec une sélection de vêtements colorés"
        fill
        sizes="(min-width:1024px) 560px, 100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow">
          <SparklesIcon /> +4 000 pièces disponibles
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-emerald-700" fill="currentColor">
      <path d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L-1 9l4.5-1.5L5 3zm11 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
    </svg>
  );
}