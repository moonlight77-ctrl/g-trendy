export default function Plans() {
  const plans = [
    { name: "Dressing Léger", price: "29€", period: "/mois", features: ["2 pièces en simultané", "Échanges mensuels", "Entretien & retours inclus"], highlight: false },
    { name: "Quotidien Stylé", price: "59€", period: "/mois", features: ["5 pièces en simultané", "Échanges illimités", "Accès prioritaire aux nouveautés"], highlight: true },
    { name: "Dressing Illimité", price: "89€", period: "/mois", features: ["8 pièces en simultané", "Échanges illimités + express", "Assurance petits accrocs"], highlight: false },
  ];
  return (
    <section id="plans" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Formules flexibles</h2>
        <p className="mt-3 text-slate-600">Choisissez la formule qui s’adapte à votre rythme et à votre style.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-2xl border p-6 shadow-sm transition-all ${p.highlight ? "border-emerald-600 bg-white shadow-md ring-2 ring-emerald-600/10" : "border-slate-200 bg-white hover:shadow-md"}`}>
            {p.highlight && (<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">Populaire</span>)}
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="mt-4 flex items-end gap-2"><span className="text-4xl font-extrabold tracking-tight">{p.price}</span><span className="mb-1 text-slate-500">{p.period}</span></div>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">{p.features.map((f) => (<li key={f} className="flex items-center gap-2"><CheckIcon /> {f}</li>))}</ul>
            <a href="#cta" className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 ${p.highlight ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600" : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400"}`}>Choisir {p.name}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function CheckIcon() { return (<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>); }