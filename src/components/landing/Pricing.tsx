export default function Pricing() {
  const plans = [
    { name: "Essentiel", price: "35,50 €", perks: ["1 article/catégorie/semaine", "Livraison & pressing inclus"] },
    { name: "Mode", price: "69,49 €", perks: ["3 vêtements + accessoires", "Échanges toutes les 2 semaines"] },
    { name: "Glamour", price: "149,99 €", perks: ["5 vêtements + accessoires & bijoux", "Avantages exclusifs & événements"] },
  ];
  return (
    <section id="pricing" className="bg-emerald-50/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Choisissez votre formule</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((p, idx) => (
            <div key={p.name} className={`rounded-2xl border p-6 bg-white ${idx===1?"border-emerald-600 ring-2 ring-emerald-600/10":"border-slate-200"}`}>
              {idx===1 && (<span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white mb-3">Populaire</span>)}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-3 text-4xl font-extrabold">{p.price}</div>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">{p.perks.map((x)=> (<li key={x}>• {x}</li>))}</ul>
              <a href="/inscription" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">Voir tous les détails</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}