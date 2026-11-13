import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { Button } from "../components/Button";
import { useLang } from "../i18n/LanguageContext";

interface Order {
  id: string;
  date: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: "pending" | "paid";
  expiresAt: string;
  link: string;
}

export function Dashboard() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(Date.now());

  // به‌روزرسانی تایمر هر ثانیه
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedUserStr = localStorage.getItem("diamond_user");
    if (!savedUserStr) { navigate("/login"); return; }
    const savedUser = JSON.parse(savedUserStr);
    
    // آپدیت اطلاعات دیسکورد از URL
    const discordId = searchParams.get("discord_id");
    const discordUsername = searchParams.get("discord_username");
    const discordAvatar = searchParams.get("discord_avatar");
    if (discordId && discordUsername) {
      savedUser.discord_id = discordId;
      savedUser.discord_username = discordUsername;
      savedUser.discord_avatar = discordAvatar;
      localStorage.setItem("diamond_user", JSON.stringify(savedUser));
      navigate("/dashboard", { replace: true });
    }
    setUser(savedUser);

    // لود کردن سفارش‌ها
    const savedOrders = localStorage.getItem(`diamond_orders_${savedUser.id}`);
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, [navigate, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("diamond_user");
    navigate("/login");
  };

  if (!user) return null;

  // محاسبه زمان باقی‌مانده
  const getTimeLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return "منقضی شده";
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <SectionTitle title={`سلام، ${user.username}`} subtitle="به داشبورد خوش آمدید" />
        <Button onClick={handleLogout} variant="secondary">خروج</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-3 h-fit">
          <ul className="space-y-1">
            {["نمای کلی", "سفارش‌ها", "تنظیمات", "پشتیبانی"].map((s, i) => (
              <li key={s}>
                <button className={`w-full text-start rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="flex items-center gap-4">
              <img src={user.discord_avatar || "/images/dashboard1.png"} alt="Avatar" className="w-16 h-16 rounded-full border border-white/20 object-cover" />
              <div>
                <p className="text-white font-bold text-lg">{user.username}</p>
                <p className="text-xs text-gray-400 mt-1">{user.discord_username || "دیسکورد متصل نیست"}</p>
              </div>
            </Card>
            <Card className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">وضعیت ربات</p>
                <p className="text-emerald-400 font-bold mt-1">آنلاین</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            </Card>
          </div>

          {/* بخش سفارش‌ها */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">سفارش‌های من</h3>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-6">هنوز سفارشی ثبت نکرده‌اید.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-bold">سفارش {order.id}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-diamond-cyan font-bold">{order.total.toLocaleString("fa-IR")} تومان</p>
                        <p className="text-xs text-yellow-400">⏳ {getTimeLeft(order.expiresAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-md text-gray-300">
                          {it.name} × {it.quantity}
                        </span>
                      ))}
                    </div>
                    <a href={order.link} className="inline-block mt-3 text-sm text-white underline decoration-white/30 hover:decoration-white">
                      مشاهده جزئیات سفارش
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">تنظیمات سرور</h3>
            <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">
              پیش‌نمایش تنظیمات — برای ویرایش یک سرور متصل کنید.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
