// src/app/waitlist/page.tsx
import {
  HeroWaitlist,
  SignupForm,
  WhyBlocks,
  CtaBottom,
  FooterMini,
} from "@/components/waitlist";

// Si HashScroll n'est pas utilisé ailleurs, vous pouvez l'enlever pour éviter les conflits
// import HashScroll from "@/components/HashScroll"; 

export const metadata = {
  title: "Rejoins la waitlist",
  description: "Inscris-toi pour être parmi les premiers.",
};

export default function WaitlistPage() {
  return (
    <main className="w-full">
      {/* <HashScroll /> */}

      {/* HERO */}
      <section id="top" className="scroll-mt-[120px]">
        <HeroWaitlist />
      </section>

      {/* WHY / EDITION */}
      <section id="edition" className="scroll-mt-[120px]">
        <WhyBlocks />
      </section>

      {/* WAITLIST - C'est ici que le bouton va scroller */}
      {/* Ajout de scroll-mt-[120px] pour compenser le Header Sticky */}
      <section id="waitlist" className="scroll-mt-[120px]">
        <SignupForm />
      </section>

      {/* CTA FINAL */}
      <section>
        <CtaBottom />
      </section>

      {/* FOOTER */}
      <FooterMini />
    </main>
  );
}