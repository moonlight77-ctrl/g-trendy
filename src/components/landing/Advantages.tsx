export default function Advantages() {
  const items = [
    { icon: "✅", text: "Sans engagement" },
    { icon: "🚚", text: "Livraison & pressing inclus" },
    { icon: "👗", text: "Sélection luxe & créateurs locaux" },
    { icon: "🎁", text: "Fidélité & friperie intégrée" },
  ];
  return (
    <section className="bg-emerald-50/40 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Les avantages GranDressing</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-slate-800">
          {items.map((i) => (
            <li key={i.text} className="flex items-start gap-3 rounded-2xl bg-white p-4 border border-slate-200">
              <span className="text-xl">{i.icon}</span>
              <span>{i.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}