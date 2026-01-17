export default function HowItWorksMini() {
const steps = [
{ t: "Choisis ton style" },
{ t: "Loue ou échange des vêtements" },
{ t: "Reçois, porte, renvoie" },
];
return (
<section className="bg-slate-50">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
<h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Comment ça marche</h2>
<p className="mt-1 text-slate-600">Simple, circulaire, responsable.</p>
<ol className="mt-6 grid gap-4 sm:grid-cols-3">
{steps.map((s, idx) => (
<li key={s.t} className="rounded-2xl border border-slate-200 bg-white p-5">
<div className="text-sm font-semibold text-emerald-700">Étape {idx + 1}</div>
<div className="mt-1 text-slate-800">{s.t}</div>
</li>
))}
</ol>
</div>
</section>
);
}