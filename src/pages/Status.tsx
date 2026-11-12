import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";

interface Stats {
  totalMembers: number;
  onlineMembers: number;
  totalServers: number;
  botStatus: string;
  serverName: string;
  botAvatar: string | null;
}

export function Status() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setStats(data.stats);
        } else {
          setError("دریافت اطلاعات ناموفق بود");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("ارتباط با سرور برقرار نشد");
        setLoading(false);
      });
  }, []);

  const cards = [
    { label: "اعضای کل", value: stats?.totalMembers, icon: "👥" },
    { label: "آنلاین", value: stats?.onlineMembers, icon: "🟢" },
    { label: "سرورها", value: stats?.totalServers, icon: "🖥️" },
    { label: "وضعیت ربات", value: stats?.botStatus === "online" ? "آنلاین" : "آفلاین", icon: "⚡" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionTitle title="وضعیت سرور" subtitle="آمار زنده سرور دیسکورد و ربات" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-gray-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {cards.map((c) => (
              <Card key={c.label} className="text-center">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="text-3xl font-black text-white">{c.value ?? "—"}</div>
                <div className="text-xs text-gray-500 mt-1">{c.label}</div>
              </Card>
            ))}
          </div>

          {stats?.botAvatar && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={stats.botAvatar}
                alt="Bot Avatar"
                className="w-20 h-20 rounded-2xl border border-white/15"
              />
              <p className="text-sm text-gray-400">{stats.serverName}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
