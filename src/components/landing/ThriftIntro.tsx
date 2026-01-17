export default function ThriftIntro() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Notre friperie responsable</h2>
          <p className="mt-4 text-slate-700">
            Donnez une seconde vie à nos pièces. Dans la Friperie GranDressing, trouvez des vêtements et accessoires
            issus de notre dressing circulaire, à prix doux. Avantages abonnés : réductions exclusives, accès anticipé,
            et panier mixte pour combiner location et achat.
          </p>
          <a href="/friperie" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700">Voir la friperie</a>
        </div>
        <div className="aspect-[16/10] rounded-3xl bg-slate-100 ring-1 ring-slate-200" />
      </div>
    </section>
  );
}