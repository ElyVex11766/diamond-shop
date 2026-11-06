import { LinkButton } from "../components/Button";
import { DiamondLogo } from "../components/DiamondLogo";
import { useLang } from "../i18n/LanguageContext";
import { ReactionTest } from "../components/ReactionTest";

export function Home() {
  const { t } = useLang();

  return (
    <>
      {/* Hero - بخش فروشگاه */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 grid gap-12 md:grid-cols-2 items-center w-full">
          
          <div className="space-y-6 z-10">
            <span className="inline-block rounded-full border border-diamond-cyan/30 bg-diamond-cyan/10 px-3 py-1 text-xs font-semibold text-diamond-cyan">
              {t.stats.placeholder}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {t.hero.title}
            </h1>
            <p className="text-lg text-diamond-muted max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/shop">{t.hero.add}</LinkButton>
              <LinkButton to="/bot" variant="secondary">
                {t.nav.bot}
              </LinkButton>
            </div>
          </div>

          <div className="relative flex justify-center z-10">
            <div className="absolute h-72 w-72 rounded-full bg-diamond-blue/30 blur-3xl animate-pulse-glow" aria-hidden />
            <div className="relative animate-float-slow">
              <DiamondLogo size={220} withText={false} />
            </div>
          </div>
        </div>
      </section>

      {/* بخش مینی گیم (تست سرعت واکنش) */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-3xl border border-diamond-cyan/30 bg-gradient-to-b from-diamond-panel to-diamond-bg p-6 md:p-10 text-center shadow-glow-sm relative overflow-hidden">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-diamond-cyan/20 blur-3xl rounded-full pointer-events-none"></div>

          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">🎯 تست سرعت واکنش</h2>
          <p className="text-diamond-muted mb-6 relative z-10">سرعتت رو محک بزن و جزو ۳ نفر برتر هفته باش!</p>

          <ReactionTest />
        </div>
      </section>
    </>
  );
}
