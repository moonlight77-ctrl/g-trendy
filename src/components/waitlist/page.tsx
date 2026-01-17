import NavbarLanding from "../NavbarLanding"; // Attention, supprimez ça si géré par le layout
import HeroWaitlist from "./HeroWaitlist";
import WhyBlocks from "./WhyBlocks";
import SignupForm from "./SignupForm";
import CtaBottom from "./CtaBottom";
import FooterMini from "./FooterMini";
import HashScroll from "./HashScroll";

export default function WaitlistPage() {
  return (
    <main className="w-full">
      {/* Si HashScroll gère le scroll JS manuellement, il peut entrer en conflit avec le CSS. 
          Essayez de le commenter si le problème persiste : 
          {/* <HashScroll /> */} 
      <HashScroll />

      {/* HERO - id="top" */}
      <section id="top" /*className="scroll-mt-[150px]"*/>
        <HeroWaitlist />
      </section>

      {/* WHY / EDITION - id="edition" */}
      <section id="edition" /*className="scroll-mt-[150px]"*/>
        <WhyBlocks />
      </section>

      {/* WAITLIST - id="waitlist" */}
      <section id="waitlist" /* className="scroll-mt-[150px]"*/>
        <SignupForm />
      </section>

      {/* CTA FINAL */}
      <section >
        <CtaBottom />
      </section>

      {/* FOOTER */}
      <FooterMini />
    </main>
  );
}