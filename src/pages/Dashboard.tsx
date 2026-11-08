import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { Button } from "../components/Button";

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // ۱. اطلاعات دیسکورد از URL رو بگیر (اگر وجود داشته باشه)
    const discordId = searchParams.get("discord_id");
    const discordUsername = searchParams.get("discord_username");
    const discordAvatar = searchParams.get("discord_avatar");

    // ۲. اطلاعات کاربر رو از localStorage بگیر
    const savedUserStr = localStorage.getItem("diamond_user");
    if (!savedUserStr) {
      navigate("/login");
      return;
    }

    const savedUser = JSON.parse(savedUserStr);

    // ۳. اگر اطلاعات دیسکورد از URL اومده بود، به کاربر اضافه کن
    if (discordId && discordUsername) {
      savedUser.discord_id = discordId;
      savedUser.discord_username = discordUsername;
      savedUser.discord_avatar = discordAvatar;
      
      // ذخیره در localStorage
      localStorage.setItem("diamond_user", JSON.stringify(savedUser));
      
      // پاک کردن URL
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-diamond-muted mb-3">پروفایل سایت</h3>
          <p className="text-white">نام کاربری: <strong>{user.username}</strong></p>
          <p className="text-white">شناسه: <strong>{user.id}</strong></p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-diamond-muted mb-3">اتصال دیسکورد</h3>
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
    </div>
  );
}
