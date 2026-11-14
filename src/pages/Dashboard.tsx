import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { Button } from "../components/Button";

// پروکسی برای عکس دیسکورد در داشبورد
const proxyImage = (url: string | null) => {
  if (!url) return "/images/dashboard1.png";
  if (url.startsWith("/")) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace("https://", ""))}`;
};

interface OrderItem { id: string; name: string; price: number; quantity: number; }
interface Order { id: string; token: string; items?: OrderItem[]; total: number; status: string; expires_at?: string | null; started_at?: string | null; completed_at?: string | null; created_at: string; order_url: string; }

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedUserStr = localStorage.getItem("diamond_user");
    if (!savedUserStr) { navigate("/login"); return; }
    const savedUser = JSON.parse(savedUserStr);

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
  }, [navigate, searchParams]);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders/my-orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (data.ok) setOrders(data.orders || []);
    } catch { /* ignore */ }
    setLoadingOrders(false);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user?.id, fetchOrders]);

  const handleLogout = () => {
    localStorage.removeItem("diamond_user");
    navigate("/login");
  };

  if (!user) return null;

  const getTimeLeft = (expiresAt?: string | null) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return "منقضی شده";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "pending": return { text: "در حال بررسی", color: "text-yellow-400" };
      case "confirmed": return { text: "در حال بررسی", color: "text-yellow-400" };
      case "processing": return { text: "در حال تکمیل", color: "text-indigo-400" };
      case "completed": return { text: "تکمیل شد", color: "text-emerald-400" };
      default: return { text: status, color: "text-gray-400" };
    }
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
              {/* 👈 عکس پروفایل با پروکسی */}
              <img src={proxyImage(user.discord_avatar)} alt="Avatar" className="w-16 h-16 rounded-full border border-white/20 object-cover" />
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

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">سفارش‌های من</h3>
              <button onClick={fetchOrders} className="text-xs text-gray-500 hover:text-white transition">🔄 به‌روزرسانی</button>
            </div>

            {loadingOrders ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500 py-6">هنوز سفارشی ثبت نکرده‌اید.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const st = statusLabel(order.status);
                  const timeLeft = ["pending", "confirmed"].includes(order.status) ? getTimeLeft(order.expires_at) : null;
                  const itemsText = order.items?.map((i) => `${i.name} × ${i.quantity}`).join("، ") || "—";
                  return (
                    <div key={order.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-bold text-sm truncate">سفارش {order.id}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleString("fa-IR")}</p>
                        </div>
                        <div className="text-left shrink-0 ml-3">
                          <p className="text-white font-bold text-sm">{order.total.toLocaleString("fa-IR")} تومان</p>
                          <p className={`text-xs font-semibold mt-0.5 ${st.color}`}>{st.text}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1 mb-2">{itemsText}</p>
                      {timeLeft && (
                        <p className={`text-xs font-bold ${timeLeft === "منقضی شده" ? "text-red-400" : "text-yellow-400"}`}>
                          ⏳ {timeLeft}
                        </p>
                      )}
                      <Link
                        to={`/order/${order.token}`}
                        className="inline-block mt-2 text-xs text-white underline decoration-white/30 hover:decoration-white"
                      >
                        جزئیات سفارش ←
                      </Link>
                    </div>
                  );
                })}
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
