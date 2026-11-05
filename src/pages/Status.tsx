import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";

export function Status() {
  const { t } = useLang();
  const services = [
    { name: t.status.api, state: t.status.operational },
    { name: t.status.gateway, state: t.status.operational },
    { name: t.status.dashboardSvc, state: t.status.operational },
    { name: t.status.db, state: t.status.operational },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <SectionTitle title={t.status.title} subtitle={t.status.subtitle} />
      <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
        {t.status.allSystems}
      </div>
      <div className="grid gap-4">
        {services.map((s) => (
          <Card key={s.name} className="flex items-center justify-between">
            <span className="text-white">{s.name}</span>
            <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {s.state}
            </span>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-diamond-muted">{t.status.noLive}</p>
    </div>
  );
}