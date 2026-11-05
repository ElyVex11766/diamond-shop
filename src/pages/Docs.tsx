import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";

export function Docs() {
  const { t } = useLang();
  const items = [
    { title: t.docs.gettingStarted, desc: t.docs.gettingStartedDesc },
    { title: t.docs.commands, desc: t.docs.commandsDesc },
    { title: t.docs.permissions, desc: t.docs.permissionsDesc },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionTitle title={t.docs.title} subtitle={t.docs.subtitle} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((i) => (
          <Card key={i.title}>
            <h3 className="text-lg font-semibold text-white">{i.title}</h3>
            <p className="mt-2 text-sm text-diamond-muted">{i.desc}</p>
          </Card>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-diamond-muted">{t.docs.placeholder}</p>
    </div>
  );
}