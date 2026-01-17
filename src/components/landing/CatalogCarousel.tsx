"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function CatalogCarousel() {
  const images = [
    { src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop", alt: "Tailleur beige", tag: "Tailleurs" },
    { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop", alt: "Robes colorées", tag: "Robes" },
    { src: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop", alt: "Chemises", tag: "Chemises" },
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop", alt: "Manteaux", tag: "Manteaux" },
  ];
  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Un aperçu de votre futur dressing</h2>
          <p className="mt-3 text-slate-600">De nouvelles pièces chaque mois : sacs, robes, vestes, etc.</p>
        </div>
        <CarouselControls targetId="catalog-track" />
      </div>
      <Carousel id="catalog-track">
        {images.map((img, i) => (
          <figure key={i} className="relative aspect-[4/5] w-64 shrink-0 overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200">
            <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 256px, 50vw" className="object-cover" />
            <figcaption className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow">{img.tag}</figcaption>
          </figure>
        ))}
      </Carousel>
      <div className="mt-6 text-center">
        <a href="/catalogue" className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50">Voir tout le catalogue</a>
      </div>
    </section>
  );
}

function Carousel({ children, id }: { children: React.ReactNode; id: string }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const childCount = Array.isArray(children) ? children.length : 1;
  useEffect(() => { const el = trackRef.current; if (el) el.scrollTo({ left: index * 280, behavior: "smooth" }); }, [index]);
  useEffect(() => { const t = setInterval(() => setIndex((i) => (i + 1) % childCount), 4000); return () => clearInterval(t); }, [childCount]);
  return (
    <div className="relative mt-8">
      <div id={id} ref={trackRef} className="flex gap-4 overflow-x-auto scroll-smooth p-2 [scrollbar-width:none] [-ms-overflow-style:none]">
        <style>{`#${id}::-webkit-scrollbar{ display:none }`}</style>
        {children}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: childCount }).map((_, i) => (
          <button key={i} aria-label={`Aller à l’élément ${i + 1}`} onClick={() => setIndex(i)} className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-emerald-600" : "bg-slate-300"}`} />
        ))}
      </div>
    </div>
  );
}

function CarouselControls({ targetId }: { targetId: string }) {
  const by = 280;
  const scroll = (dir: "prev" | "next") => {
    const el = document.getElementById(targetId); if (!el) return;
    el.scrollBy({ left: dir === "next" ? by : -by, behavior: "smooth" });
  };
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => scroll("prev")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">Précédent</button>
      <button onClick={() => scroll("next")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">Suivant</button>
    </div>
  );
}