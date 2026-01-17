import Image from "next/image";

export default function HeroImmersive() {
  return (
    <section className="relative isolate">
      {/* Visuel plein écran/large */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=2000&auto=format&fit=crop"
          alt="Personne portant une veste en cuir – ambiance urbaine"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/35 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-2xl text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/80 px-3 py-1 text-xs font-semibold mb-5">
            <span className="h-2 w-2 rounded-full bg-white" /> Nouveau • Mode circulaire
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.05]">
            Votre dressing illimité.<br />
            <span className="text-emerald-300">Plus créatif, plus éco, plus vous.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/90">
            Louez, portez, échangez, recommencez – tout en réduisant votre empreinte mode. Livraison,
            pressing et retours inclus. Sans engagement.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#pricing" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700">
              Je commence maintenant
            </a>
            <a href="#how" className="inline-flex items-center justify-center rounded-xl bg-white/90 px-6 py-3 font-semibold text-slate-900 hover:bg-white">
              Comment ça marche
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}