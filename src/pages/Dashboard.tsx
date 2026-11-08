import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { LinkButton } from "../components/Button";
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
      
      {/* هشدار لاگین */}
      <div className="mb-6 rounded-xl border border-diamond-cyan/30 bg-diamond-cyan/5 px-4 py-3 text-sm text-diamond-cyan flex flex-col md:flex-row justify-between items-center gap-3">
        <span>{t.dashboard.notice}</span>
        <LinkButton to="/login" className="text-xs px-4 py-2">
          {t.nav.login}
        </LinkButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* سایدبار */}
        <aside className="rounded-2xl border border-diamond-border bg-diamond-panel/60 p-3 h-fit">
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

        {/* محتوای اصلی */}
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.profile}</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-diamond-border flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <p className="text-white font-bold">{t.dashboard.profilePlaceholder}</p>
                  <p className="text-xs text-diamond-muted mt-1">Discord ID: ---</p>
                </div>
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.botStatus}</h3>
              <div className="flex items-center gap-2 mt-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-emerald-400 font-bold">{t.status.botOnline}</p>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.servers}</h3>
            <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-diamond-muted">
              {t.dashboard.noServers}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.settings}</h3>
            <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-diamond-muted">
              {t.dashboard.settingsPlaceholder}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
