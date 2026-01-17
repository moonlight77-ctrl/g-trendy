export default function HowItWorks() {
  const steps = [
    { title: "Choisissez vos pièces", desc: "Parcourez le catalogue et ajoutez vos favoris.", icon: "🛍️" },
    { title: "Recevez-les chez vous", desc: "Livraison rapide, prêtes à porter.", icon: "📦" },
    { title: "Portez & échangez", desc: "Quand vous voulez, sans limite.", icon: "🔄" },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center">Comment ça marche ?</h2>
      <p className="mt-3 text-center text-slate-600">Recommencez sans limite, toute l’année.</p>
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s) => (
          <li key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl">{s.icon}</div>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-slate-600">{s.desc}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 text-center">
        <a href="#pricing" className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700">Découvrir nos formules</a>
      </div>
    </section>
  );
}