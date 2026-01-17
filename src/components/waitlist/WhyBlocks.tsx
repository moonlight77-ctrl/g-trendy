export default function WhyBlocks() {
  const items = [
    {
      eyebrow: "RÊVE · CRÉATIVITÉ",
      title: "Une infinité de looks",
      text: "Ton dressing devient une source d’inspiration, pas une contrainte.",
    },
    {
      eyebrow: "CONFIANCE · SÉRÉNITÉ",
      title: "Pour chaque occasion, toute l’année",
      text: "Travail, sorties, événements, saisons… tu sais toujours quoi porter.",
    },
    {
      eyebrow: "SOULAGEMENT · INTELLIGENCE",
      title: "Mieux s’habiller, sans se ruiner",
      text: "Moins d’achats inutiles. Plus de cohérence, plus de style.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Titre */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[24px] md:text-[32px] font-semibold tracking-[-0.5px] text-[#111]">
            S’habiller sans jamais se poser de questions
          </h2>
        </div>

        {/* Grille */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {items.map((item) => (
            <div key={item.title} className="text-left">
              <p className="text-xs tracking-[0.12em] uppercase text-black/60">
                {item.eyebrow}
              </p>

              <h3 className="mt-2 text-[16px] md:text-[18px] font-medium text-[#111]">
                {item.title}
              </h3>

              <p className="mt-2 text-[14px] md:text-[15px] leading-[1.6] text-[#444]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Baseline */}
        <div className="mt-10 md:mt-12 flex justify-center">
          <p className="text-sm text-black/60">
            Créativité · Sérénité · Liberté
          </p>
        </div>
      </div>
    </section>
  );
}
