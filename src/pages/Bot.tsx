import { LinkButton } from "../components/Button";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";

export function Bot() {
  const { t } = useLang();

  const features = [
    { title: t.features.giveaway, desc: t.features.giveawayDesc, icon: "🎉" },
    { title: t.features.moderation, desc: t.features.moderationDesc, icon: "🛡️" },
    { title: t.features.antilink, desc: t.features.antilinkDesc, icon: "🔗" },
    { title: t.features.security, desc: t.features.securityDesc, icon: "🚨" },
    { title: t.features.polls, desc: t.features.pollsDesc, icon: "📊" },
    { title: t.features.auto, desc: t.features.autoDesc, icon: "🤖" },
    { title: t.features.server, desc: t.features.serverDesc, icon: "⚙️" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionTitle title="Diamond BOT" subtitle="بهترین ربات برای سرور دیسکورد شما." />

      <div className="grid gap-6 md:grid-cols-2 items-stretch mb-16">
        <div className="glass-card-hover p-8 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">
            🤖
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{t.botPage.invite}</h3>
          <p className="text-sm text-gray-400 mb-6">برای افزودن ربات به سرور، روی دکمه زیر کلیک کنید.</p>
          <LinkButton to="/login" className="w-full">{t.botPage.invite}</LinkButton>
        </div>

        <div className="glass-card-hover p-8 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{t.botPage.status}</h3>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.botPage.online}
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          با Diamond BOT سرورت رو به سطح بعد ببر
        </h2>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Diamond BOT یه جعبه‌ابزار کامله که مدیریت سرور، امنیت، سرگرمی و رشد جامعه‌ت رو یکجا برات فراهم می‌کنه. با امکانات قدرتمند و رابط کاربری ساده، دیگه نیازی نیست نگران هیچی باشی.
        </p>
      </div>

      <section className="mb-20">
        <SectionTitle title={t.features.title} subtitle={t.features.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <div className="text-3xl mb-3" aria-hidden>{f.icon}</div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
