import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";

const WORKER_URL = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev";

interface Stats {
  totalMembers: number;
  onlineMembers: number;
  totalServers: number;
  botStatus: string;
  serverName: string;
  serverIcon: string | null;
}

export function Status() {
  const { t } = useLang();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${WORKER_URL}/api/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setStats(data.stats);
        } else {
          setError(data.error || "خطا در دریافت آمار");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <SectionTitle title={t.status.title} subtitle={t.status.subtitle} />
      
      {loading && (
        <p className="text-center text-diamond-muted">در حال دریافت آمار...</p>
      )}

      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {stats && !loading && (
        <>
          {/* هدر سرور */}
          <div className="mb-8 bg-diamond-panel border border-diamond-border rounded-2xl p-6 flex items-center gap-4">
            {stats.serverIcon && (
              <img src={stats.serverIcon} alt="Server" className="w-16 h-16 rounded-full border-2 border-diamond-cyan" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{stats.serverName}</h2>
              <p className="text-sm text-diamond-muted">Discord Server</p>
            </div>
          </div>

          {/* کارت‌های آمار */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="text-center">
              <div className="text-2xl font-extrabold text-diamond-cyan">{stats.totalMembers.toLocaleString('fa-IR')}</div>
              <div className="mt-2 text-sm text-diamond-muted">کل اعضای دیسکورد</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-extrabold text-emerald-400">{stats.onlineMembers.toLocaleString('fa-IR')}</div>
              <div className="mt-2 text-sm text-diamond-muted">اعضای آنلاین</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-extrabold text-diamond-cyan">{stats.totalServers.toLocaleString('fa-IR')}</div>
              <div className="mt-2 text-sm text-diamond-muted">سرورهای فعال</div>
            </Card>
            <Card className="text-center">
              <div className={`text-2xl font-extrabold ${stats.botStatus === "online" ? "text-emerald-400" : "text-red-400"}`}>
                {stats.botStatus === "online" ? "آنلاین" : "آفلاین"}
              </div>
              <div className="mt-2 text-sm text-diamond-muted">وضعیت ربات</div>
            </Card>
          </div>

          {/* وضعیت سیستم */}
          <div className="grid gap-4">
            <Card className="flex items-center justify-between">
              <span className="text-white">Bot API</span>
              <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Operational
              </span>
            </Card>
            <Card className="flex items-center justify-between">
              <span className="text-white">Database</span>
              <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Connected
              </span>
            </Card>
            <Card className="flex items-center justify-between">
              <span className="text-white">Dashboard</span>
              <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Operational
              </span>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
