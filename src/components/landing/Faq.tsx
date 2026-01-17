export default function Faq() {
  const qas = [
    { q: "Comment fonctionne la location ?", a: "Vous choisissez vos pièces, les recevez chez vous, et les échangez quand vous voulez." },
    { q: "Et si l’article ne me va pas ?", a: "Échange sans frais supplémentaires." },
    { q: "Comment sont entretenus les vêtements ?", a: "Pressing professionnel écologique." },
    { q: "Puis-je acheter un article loué ?", a: "Oui, souvent à prix réduit via la friperie." },
    { q: "Puis-je arrêter mon abonnement ?", a: "Oui, à tout moment, sans pénalités." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Questions fréquentes</h2>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {qas.map((item) => (
          <details key={item.q} className="group p-5">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 flex items-center justify-between">
              {item.q}
              <span className="ml-4 text-slate-400 group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="mt-3 text-slate-700">{item.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a href="/faq" className="text-emerald-700 font-semibold hover:underline">Voir toutes les questions</a>
      </div>
    </section>
  );
}