export default function Testimonials() {
  const items = [
    { q: "J’ai enfin un dressing qui change tout le temps, sans culpabiliser pour la planète.", a: "Sophie M." },
    { q: "Les pièces sont superbes, le service rapide, et je fais des économies !", a: "Clara L." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Ils ont adopté GranDressing</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((t) => (
          <figure key={t.a} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-amber-500">★★★★★</div>
            <blockquote className="mt-3 text-slate-800">“{t.q}”</blockquote>
            <figcaption className="mt-4 text-sm text-slate-600">— {t.a}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}