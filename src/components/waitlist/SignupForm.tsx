"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  // 1. AJOUT DU STATE POUR LE HONEYPOT
  const [website, setWebsite] = useState(""); 
  
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2. LOGIQUE HONEYPOT ANTI-SPAM
    // Si le champ caché 'website' est rempli, c'est un bot.
    // On simule un succès pour ne pas qu'il sache qu'il a été piégé.
    if (website.trim().length > 0) {
      setStatus("ok");
      setMessage("Merci ! Tu es bien inscrit·e sur la waitlist.");
      setEmail("");
      return; // On arrête tout ici, pas d'appel à Supabase
    }

    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({ email: normalizedEmail });

      if (error) {
        if (error.code === '23505') {
          console.log("Email déjà inscrit, on ignore."); 
        } else {
          throw error;
        }
      }

      setStatus("ok");
      setMessage("Merci ! Tu es bien inscrit·e sur la waitlist.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message ?? "Une erreur est survenue. Réessaie.");
    }
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[460px] text-center">
          <h2 className="text-[24px] md:text-[28px] font-semibold text-[#111]">
            Rejoins la waitlist
          </h2>

          <p className="mt-2 text-[14px] text-[#666]">
            Accès anticipé au lancement 2026.
          </p>

          <form onSubmit={onSubmit} className="mt-6 text-left">
            
            {/* 3. CHAMP CACHÉ HONEYPOT (Invisible pour l'humain) */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1} // Empêche la navigation au clavier (Tab) sur ce champ
                autoComplete="off"
              />
            </div>

            <label htmlFor="waitlist-email" className="block text-sm font-medium text-[#111]">
              Adresse email
            </label>

            <div className="mt-2 flex flex-col gap-3">
              <input
                id="waitlist-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="h-[52px] w-full rounded-lg border border-[#DDD] bg-white px-4 text-[#111]
                           placeholder:text-[#999]
                           focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#111]"
                aria-describedby="waitlist-help waitlist-status"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="h-[52px] w-full rounded-lg bg-black px-5 text-white font-medium
                           hover:bg-[#1a1a1a] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Envoi…" : "Rejoindre la waitlist"}
              </button>
            </div>

            <p id="waitlist-help" className="mt-3 text-sm text-[#666]">
              Pas de spam. Désinscription en un clic.
            </p>

            {message && (
              <p
                id="waitlist-status"
                role={status === "error" ? "alert" : "status"}
                className={`mt-3 text-sm ${status === "error" ? "text-rose-600" : "text-emerald-700"}`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}