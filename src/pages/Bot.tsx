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
      
      {/* بخش معرفی ربات */}
      <SectionTitle title={t.botPage.title} subtitle={t.botPage.subtitle} />
      
      <div className="grid gap-6 md:grid-cols-2 items-center mt-10 mb-20">
        <div className="rounded-2xl border border-diamond-cyan/30 bg-diamond-panel p-8 text-center shadow-glow-sm">
          <h3 className="text-xl font-bold text-white mb-4">{t.botPage.invite}</h3>
          <p className="text-sm text-diamond-muted mb-6">برای افزودن ربات به سرور، روی دکمه زیر کلیک کنید.</p>
          <LinkButton to="/login" className="w-full">{t.botPage.invite}</LinkButton>
        </div>

        <div className="rounded-2xl border border-diamond-border bg-diamond-panel p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">{t.botPage.status}</h3>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.botPage.online}
          </div>
        </div>
      </div>

      {/* بخش امکانات ربات (Features) */}
      <section className="mb-20">
        <SectionTitle title={t.features.title} subtitle={t.features.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <div className="text-3xl mb-3" aria-hidden>{f.icon}</div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-diamond-muted">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* بخش آمار (Stats) */}
      <section className="mb-20">
        <SectionTitle title={t.stats.title} subtitle={t.stats.placeholder} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t.stats.members, value: "—" },
            { label: t.stats.online, value: "—" },
            { label: t.stats.servers, value: "—" },
            { label: t.stats.status, value: t.stats.onlineStatus },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-diamond-cyan">{s.value}</div>
              <div className="mt-2 text-sm text-diamond-muted">{s.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* بخش CTA */}
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-diamond-cyan/30 bg-gradient-to-br from-diamond-panel to-diamond-bg p-10 md:p-14 text-center shadow-glow-sm">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">{t.cta.title}</h2>
          <p className="mt-3 text-diamond-muted">{t.cta.subtitle}</p>
          <div className="mt-6 flex justify-center">
            <LinkButton to="/login">{t.cta.button}</LinkButton>
          </div>
        </div>
      </section>

    </div>
  );
}