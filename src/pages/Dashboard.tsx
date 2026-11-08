import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { Button } from "../components/Button";
import { useLang } from "../i18n/LanguageContext";

export function Dashboard() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);

  const sidebar = [
    t.dashboard.sidebar.overview,
    t.dashboard.sidebar.servers,
    t.dashboard.sidebar.settings,
    t.dashboard.sidebar.billing,
    t.dashboard.sidebar.support,
  ];

  useEffect(() => {
    // ۱. اطلاعات دیسکورد از URL
    const discordId = searchParams.get("discord_id");
    const discordUsername = searchParams.get("discord_username");
    const discordAvatar = searchParams.get("discord_avatar");

    // ۲. اطلاعات کاربر از localStorage
    const savedUserStr = localStorage.getItem("diamond_user");
    if (!savedUserStr) {
      navigate("/login");
      return;
    }

    const savedUser = JSON.parse(savedUserStr);

    // ۳. آپدیت اطلاعات دیسکورد
    if (discordId && discordUsername) {
      savedUser.discord_id = discordId;
      savedUser.discord_username = discordUsername;
      savedUser.discord_avatar = discordAvatar;
      localStorage.setItem("diamond_user", JSON.stringify(savedUser));
      navigate("/dashboard", { replace: true });
    }

    setUser(savedUser);
  }, [navigate, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("diamond_user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <SectionTitle title={`سلام، ${user.username}`} subtitle="به داشبورد خوش آمدید" />
        <Button onClick={handleLogout} variant="secondary">خروج</Button>
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
            {/* پروفایل سایت */}
            <Card>
              <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.profile}</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-diamond-border flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <p className="text-white font-bold">{user.username}</p>
                  <p className="text-xs text-diamond-muted mt-1">ID: {user.id}</p>
                </div>
              </div>
            </Card>

            {/* اتصال دیسکورد */}
            <Card>
              <h3 className="text-sm font-semibold text-diamond-muted mb-3">Discord Connection</h3>
              {user.discord_username ? (
                <div className="flex items-center gap-3">
                  {user.discord_avatar && (
                    <img src={user.discord_avatar} alt="Discord Avatar" className="w-10 h-10 rounded-full border border-diamond-cyan" />
                  )}
                  <div>
                    <p className="text-white font-bold">{user.discord_username}</p>
                    <p className="text-xs text-diamond-muted">ID: {user.discord_id}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-diamond-muted mb-3">هنوز دیسکورد متصل نیست.</p>
                  <Button onClick={() => window.location.href = "/api/auth/discord"} className="w-full">اتصال به دیسکورد</Button>
                </div>
              )}
            </Card>
          </div>

          {/* سرورها */}
          <Card>
            <h3 className="text-sm font-semibold text-diamond-muted mb-3">{t.dashboard.servers}</h3>
            <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-diamond-muted">
              {t.dashboard.noServers}
            </div>
          </Card>

          {/* تنظیمات */}
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
