export default function SocialProof() {
  const testimonials = [
    { quote: "J’ai renouvelé ma garde-robe pour un mariage sans rien acheter. Super simple et stylé !", author: "Camille", role: "Paris", rating: 5 },
    { quote: "Idéal pour tester des looks au bureau, la livraison est nickel et les échanges ultra flex.", author: "Yanis", role: "Lyon", rating: 5 },
  ];
  return (
    <section id="avis" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        <EcoBadge />
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1" aria-label={`${t.rating} sur 5`}>
                {Array.from({ length: t.rating }).map((_, k) => (<StarIcon key={k} />))}
              </div>
              <blockquote className="mt-3 text-slate-800">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-slate-600"><span className="font-semibold text-slate-800">{t.author}</span> • {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcoBadge() {
  return (
    <div className="rounded-3xl border border-emerald-600/30 bg-emerald-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white"><LeafIcon /></div>
        <div>
          <h3 className="text-xl font-bold">Badge écologique</h3>
          <p className="mt-2 text-slate-700">Réduction des impacts vs achat neuf : mutualisation des pièces, entretien à basse consommation, et logistique optimisée.</p>
          <ul className="mt-4 space-y-1 text-sm text-slate-700">
            <li className="flex items-center gap-2"><CheckIcon /> Neutralité carbone sur l’entretien</li>
            <li className="flex items-center gap-2"><CheckIcon /> Emballages réutilisables</li>
            <li className="flex items-center gap-2"><CheckIcon /> Partenaires locaux labellisés</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LeafIcon() { return (<svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12C3 6 9 3 21 3c0 12-3 18-9 18S3 18 3 12z" /><path d="M9 15c3-1 6-4 8-8" /></svg>); }
function CheckIcon() { return (<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>); }
function StarIcon() { return (<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-amber-500" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.9L18.18 22 12 18.56 5.82 22 7 14.17l-5-4.9 6.91-1.01L12 2z" /></svg>); }