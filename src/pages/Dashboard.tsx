import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";

export function Dashboard() {
  const { t } = useLang();
  const sidebar = [
    t.dashboard.sidebar.overview,
    t.dashboard.sidebar.servers,
    t.dashboard.sidebar.settings,
    t.dashboard.sidebar.billing,
    t.dashboard.sidebar.support,
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionTitle title={t.dashboard.title} subtitle={t.dashboard.subtitle} />
      <div className="mb-6 rounded-xl border border-diamond-cyan/30 bg-diamond-cyan/5 px-4 py-3 text-sm text-diamond-cyan">
        {t.dashboard.notice}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-diamond-border bg-diamond-panel/60 p-3">
          <ul className="space-y-1">
            {sidebar.map((s, i) => (
              <li key={s}>
                <button
                  className={`w-full text-start rounded-lg px-3 py-2 text-sm ${
                    i === 0
                      ? "bg-diamond-blue/20 text-white"
                      : "text-diamond-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold text-diamond-muted">{t.dashboard.profile}</h3>
              <p className="mt-2 text-white">{t.dashboard.profilePlaceholder}</p>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-diamond-muted">{t.dashboard.botStatus}</h3>
              <p className="mt-2 text-diamond-cyan">{t.stats.onlineStatus}</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.servers}</h3>
            <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-diamond-muted">
              {t.dashboard.noServers}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.settings}</h3>
            <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-diamond-muted">
              {t.dashboard.settingsPlaceholder}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}