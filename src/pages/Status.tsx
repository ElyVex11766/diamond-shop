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
  botAvatar: string | null;
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
          setError(data.error || t.status.statsError);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [t]);

  // کامپوننت دایره چشمک‌زن (Pulse Dot)
  const PulseDot = ({ color }: { color: string }) => (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
    </span>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <SectionTitle title={t.status.title} subtitle={t.status.subtitle} />
      
      {loading && (
        <p className="text-center text-diamond-muted">{t.status.loadStats}</p>
      )}

      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {stats && !loading && (
        <>
          {/* هدر سرور و پروفایل ربات */}
          <div className="mb-8 bg-diamond-panel border border-diamond-border rounded-2xl p-6 flex items-center gap-4">
            {stats.botAvatar && (
              <img src={stats.botAvatar} alt="Bot" className="w-16 h-16 rounded-full border-2 border-diamond-cyan shadow-glow-sm" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">Diamond BOT</h2>
              <p className="text-sm text-diamond-muted">Discord Server</p>
            </div>
          </div>

          {/* کارت‌های آمار */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="text-center">
              <div className="text-2xl font-extrabold text-diamond-cyan">{stats.totalMembers.toLocaleString('fa-IR')}</div>
              <div className="mt-2 text-sm text-diamond-muted">{t.status.totalMembers}</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-extrabold text-emerald-400">{stats.onlineMembers.toLocaleString('fa-IR')}</div>
              <div className="mt-2 text-sm text-diamond-muted">{t.status.onlineMembers}</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-extrabold text-diamond-cyan">{stats.totalServers.toLocaleString('fa-IR')}</div>
              <div className="mt-2 text-sm text-diamond-muted">{t.status.activeServers}</div>
            </Card>
            <Card className="text-center">
              <div className="flex justify-center items-center gap-2 mt-2">
                <PulseDot color={stats.botStatus === "online" ? "bg-emerald-400" : "bg-red-400"} />
                <span className={`text-xl font-extrabold ${stats.botStatus === "online" ? "text-emerald-400" : "text-red-400"}`}>
                  {stats.botStatus === "online" ? t.status.botOnline : t.status.botOffline}
                </span>
              </div>
              <div className="mt-2 text-sm text-diamond-muted">{t.status.botStatus}</div>
            </Card>
          </div>

          {/* وضعیت سیستم */}
          <div className="grid gap-4">
            <Card className="flex items-center justify-between">
              <span className="text-white">{t.status.botApi}</span>
              <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                <PulseDot color="bg-emerald-400" />
                {t.status.operational}
              </span>
            </Card>
            <Card className="flex items-center justify-between">
              <span className="text-white">{t.status.database}</span>
              <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                <PulseDot color="bg-emerald-400" />
                {t.status.connected}
              </span>
            </Card>
            <Card className="flex items-center justify-between">
              <span className="text-white">{t.status.dashboard}</span>
              <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                <PulseDot color="bg-emerald-400" />
                {t.status.operational}
              </span>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
