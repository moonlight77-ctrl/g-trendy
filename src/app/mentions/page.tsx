import NavbarLanding from "@/components/NavbarLanding"; // Ou NavbarSwitch selon votre structure
import FooterMini from "@/components/waitlist/FooterMini";

export default function MentionsLegales() {
  return (
    <main className="w-full bg-[#F9F5F0] min-h-screen text-[#2F2F2F]">
      {/* On remet la navbar pour la navigation */}
      <NavbarLanding editionLabel=" – retour à l&apos;accueil" />

      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="text-3xl font-bold mb-8 font-serif">Mentions Légales</h1>

        <div className="space-y-8 text-sm leading-relaxed">
          
          {/* SECTION 1 : ÉDITEUR */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-800">1. Éditeur du site</h2>
            <p>
              Le site <strong>GrandDressing</strong> est édité par :<br />
              <strong>[Nom de votre Société ou Votre Nom Prénom]</strong><br />
              [Forme Juridique : ex. SAS au capital de 1000€]<br />
              Immatriculée au RCS de [Ville] sous le numéro [Numéro SIREN]<br />
              Siège social : [Votre Adresse complète]<br />
              Numéro de TVA intracommunautaire : [Votre N° TVA]<br />
              Email : <a href="mailto:hello@grandressing.com" className="underline hover:text-emerald-700">hello@grandressing.com</a>
            </p>
          </section>

          {/* SECTION 2 : HÉBERGEUR */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-800">2. Hébergement</h2>
            <p>
              Le site est hébergé par la société <strong>Vercel Inc.</strong><br />
              Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
              (Ou indiquez OVH / AWS si vous n&apos;utilisez pas Vercel).
            </p>
          </section>

          {/* SECTION 3 : DONNÉES PERSONNELLES */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-800">3. Données personnelles & Waitlist</h2>
            <p>
              Les informations recueillies via le formulaire d&apos;inscription à la liste d&apos;attente (adresse email) sont enregistrées dans un fichier informatisé par <strong>GrandDressing</strong>.
            </p>
            <p className="mt-2">
              Elles sont conservées pendant la durée de lancement du projet et sont destinées exclusivement à l&apos;envoi d&apos;informations concernant l&apos;ouverture du service.
            </p>
            <p className="mt-2">
              Conformément à la loi « informatique et libertés » et au RGPD, vous pouvez exercer votre droit d&apos;accès, de rectification et de suppression des données vous concernant en contactant : hello@grandressing.com.
            </p>
          </section>
          
           {/* SECTION 4 : PROPRIÉTÉ INTELLECTUELLE */}
           <section>
            <h2 className="text-xl font-semibold mb-3 text-emerald-800">4. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

        </div>
      </div>

      <FooterMini />
    </main>
  );
}