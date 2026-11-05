import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";

export function Features() {
  const { t } = useLang();
  const items = [
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
      <SectionTitle title={t.featuresPage.title} subtitle={t.featuresPage.subtitle} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <Card key={f.title}>
            <div className="text-3xl mb-3" aria-hidden>{f.icon}</div>
            <h3 className="text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-1 text-sm text-diamond-muted">{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}