export default function EcoBlock() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Mode circulaire, impact positif</h2>
          <p className="mt-4 text-white/90">
            Chaque pièce louée prolonge sa durée de vie et évite la production de vêtements neufs. Ensemble, économisons
            des milliers de litres d’eau et réduisons nos émissions de CO₂. 🌿 Zéro encombrement, zéro gaspillage.
          </p>
        </div>
        <div className="rounded-3xl bg-emerald-600/20 p-6 border border-emerald-400/30">
          <ul className="space-y-2">
            <li>• Entretien bas carbone</li>
            <li>• Emballages réutilisables</li>
            <li>• Partenaires locaux</li>
          </ul>
        </div>
      </div>
    </section>
  );
}