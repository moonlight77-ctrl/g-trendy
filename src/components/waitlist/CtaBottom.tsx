export default function CtaBottom() {
  return (
    <section className="bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[800px] text-center">
          <p className="text-[20px] md:text-[22px] font-medium text-[#111] leading-[1.4]">
            Prêt(e) à ne plus jamais te demander quoi porter ?
          </p>

          <div className="mt-5 md:mt-6">
            <a
              href="#waitlist"
              className="inline-flex h-[52px] items-center justify-center rounded-lg bg-black px-5
                         text-white font-medium hover:bg-[#1a1a1a] transition
                         w-full sm:w-auto"
            >
              Fais partie des premiers à découvrir GRANDRESSING.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
