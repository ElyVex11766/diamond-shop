import { Link } from "react-router-dom";
import { SectionTitle } from "../components/SectionTitle";
import { Card } from "../components/Card";
import { useLang } from "../i18n/LanguageContext";

export function Features() {
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
      <div className="text-center mt-12">
        <Link to="/bot" className="text-sm text-gray-400 hover:text-white transition border-b border-white/20 hover:border-white/50 pb-0.5">
          مشاهده ربات ←
        </Link>
      </div>
    </div>
  );
}
