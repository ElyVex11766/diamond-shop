import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

interface User {
  id: string;
  username: string;
  phone?: string;
  email?: string;
  discord_id?: string;
  discord_username?: string;
  discord_avatar?: string;
}

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("diamond_user");
    if (saved) setUser(JSON.parse(saved));

    const searchParams = new URLSearchParams(window.location.search);
    const discordId = searchParams.get("discord_id");
    if (discordId && saved) {
      const currentUser = JSON.parse(saved) as User;
      const updatedUser: User = {
        ...currentUser,
        discord_id: discordId,
        discord_username: searchParams.get("discord_username") || currentUser.discord_username,
        discord_avatar: searchParams.get("discord_avatar") || currentUser.discord_avatar,
        email: searchParams.get("email") || currentUser.email,
      };
      localStorage.setItem("diamond_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-500">برای مشاهده حساب شخصی خود وارد شوید.</p>
        <Link to="/login"><Button>ورود به حساب</Button></Link>
      </div>
    );
  }

  const displayName = user.discord_username || user.username;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-3xl border border-white/15 bg-white/5 flex items-center justify-center">
            {user.discord_avatar ? (
              <img src={user.discord_avatar} alt={`تصویر ${displayName}`} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-500">حساب کاربری Zylox</p>
            <h1 className="text-2xl md:text-3xl font-black text-white">سلام، {displayName}</h1>
            <p className="mt-1 text-sm text-gray-500">اطلاعات حساب و سرویس‌های شما</p>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
          حساب شما فعال است
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="mb-4 text-base font-bold text-white">پروفایل شما</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><span className="text-gray-500">نام کاربری</span><span className="text-white">{user.username}</span></div>
            <div className="flex justify-between gap-4"><span className="text-gray-500">شماره موبایل</span><span className="text-white">{user.phone || "ثبت نشده"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-gray-500">ایمیل</span><span className="text-white">{user.email || "ثبت نشده"}</span></div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-white">اتصال دیسکورد</h2>
          {user.discord_id ? (
            <>
              <p className="text-sm text-gray-400">متصل به {user.discord_username || "حساب دیسکورد"}</p>
              <p className="mt-3 text-sm text-emerald-400">✓ اتصال با موفقیت انجام شده</p>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">برای تحویل خودکار سفارش‌ها، دیسکورد خود را متصل کنید.</p>
              <a href={`/api/auth/discord?user_id=${encodeURIComponent(user.id)}`} className="text-sm text-white border-b border-white/30 hover:border-white pb-1">
                اتصال دیسکورد ←
              </a>
            </>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-bold text-white">سفارش‌های شما</h2>
          <p className="text-sm leading-7 text-gray-500">سفارش‌های ثبت‌شده و لینک‌های تحویل شما در این قسمت نمایش داده می‌شوند.</p>
          <Link to="/#products" className="mt-4 inline-block text-sm text-white border-b border-white/30 hover:border-white pb-1">مشاهده محصولات ←</Link>
        </Card>
      </div>
    </div>
  );
}
