import { LinkButton } from "../components/Button";
import { useLang } from "../i18n/LanguageContext";
import { Sidebar } from "../components/Sidebar";

export function Home() {
  const { t } = useLang();

  return (
    <>
      <Sidebar />
      
      {/* Hero */}
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
            {/* 👇 اینجا لوگوی خودت رو بذار (عکس رو توی پوشه public/images بذار) */}
            <img src="/images/zylox-logo.png" alt="Zylox" className="w-64 h-64 object-contain animate-float-slow" />
          </div>
        </div>
      </section>

      {/* بخش محصولات */}
      <section id="products" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">محصولات Zylox</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>

      {/* بخش چرا ما */}
      <section id="why-us" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">چرا Zylox؟</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">تحویل سریع</h3>
              <p className="text-gray-400 text-sm">سفارش شما در کمترین زمان ممکن تحویل داده می‌شود.</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-white mb-2">امنیت بالا</h3>
              <p className="text-gray-400 text-sm">اطلاعات شما با بهترین روش‌ها محافظت می‌شود.</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-white mb-2">کیفیت پریمیوم</h3>
              <p className="text-gray-400 text-sm">محصولات با بالاترین کیفیت و بهترین قیمت.</p>
            </div>
          </div>
        </div>
      </section>

      {/* بخش نظرات */}
      <section id="testimonials" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">نظرات کاربران</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>

      {/* بخش قوانین */}
      <section id="rules" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">قوانین</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>
    </>
  );
}
