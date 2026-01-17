export default function FeaturedCategories() {
  const cards = [
    { title: "Sacs & maroquinerie", img: "", href: "/catalogue?type=accessoires" },
    { title: "Bijoux", img: "", href: "/catalogue?type=bijoux" },
    { title: "Chaussures", img: "", href: "/catalogue?type=chaussure" },
  ];
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Plus que des vêtements</h2>
        <p className="mt-2 text-slate-600">Complétez vos looks avec nos accessoires tendance.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <a key={c.title} href={c.href} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
              <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-emerald-700">{c.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}