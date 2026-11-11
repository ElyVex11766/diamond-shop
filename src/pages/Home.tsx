import { LinkButton } from "../components/Button";
import { ZyloxLogo } from "../components/ZyloxLogo";
import { useLang } from "../i18n/LanguageContext";
import { Sidebar } from "../components/Sidebar";

export function Home() {
  const { t } = useLang();

  return (
    <>
      <Sidebar />
      
      <section id="top" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-32 grid gap-12 md:grid-cols-2 items-center w-full">
          
          <div className="space-y-6 z-10">
            <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300">
              {t.stats.placeholder}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {t.hero.title}
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/shop">{t.hero.add}</LinkButton>
              <LinkButton to="/bot" variant="secondary">
                {t.nav.bot}
              </LinkButton>
            </div>
          </div>

          <div className="relative flex justify-center z-10">
            <div className="absolute h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse-glow" aria-hidden />
            <div className="relative animate-float-slow">
              <ZyloxLogo size={220} withText={false} />
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">محصولات Zylox</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>

      <section id="stats" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">آمار جامعه</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>

      <section id="rules" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">قوانین</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>
    </>
  );
}
