import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  token: string;
  items?: OrderItem[];
  total: number;
  status: string;
  expires_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  delivery_info?: string | null;
}

export function AdminUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_username: adminUser,
          admin_password: adminPass,
          user_id: id,
          new_username: newUsername || undefined,
          new_password: newPassword || undefined,
        }),
      });
      const data = await res.json();

      if (data.ok) {
        setMsg("تغییرات ذخیره شد");
      } else {
        setError(data.error || "خطا");
      }
      setLoading(false);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      setLoading(false);
    }
  };

  const fetchOrders = useCallback(async () => {
    if (!id || !adminUser || !adminPass) return;
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetch("/api/admin/user-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_username: adminUser,
          admin_password: adminPass,
          user_id: id,
        }),
      });
      const data = await res.json();
      if (data.ok) setOrders(data.orders || []);
      else setOrdersError(data.error || "خطا");
    } catch {
      setOrdersError("ارتباط با سرور برقرار نشد");
    }
    setOrdersLoading(false);
  }, [id, adminUser, adminPass]);

  useEffect(() => {
    if (adminUser && adminPass && id) fetchOrders();
  }, [adminUser, adminPass, id, fetchOrders]);

  const statusLabel = (status: string) => {
    switch (status) {
      case "pending": return { text: "در انتظار تأیید", color: "text-yellow-400" };
      case "confirmed": return { text: "تأیید شده", color: "text-sky-400" };
      case "processing": return { text: "در حال انجام", color: "text-indigo-400" };
      case "completed": return { text: "کامل شده", color: "text-emerald-400" };
      default: return { text: status, color: "text-gray-400" };
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-8 py-16">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/this-is-safe")}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          → بازگشت
        </button>
        <h1 className="text-xl font-bold text-white">ویرایش کاربر</h1>
      </div>

      <Card>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">آیدی کاربر</label>
            <input
              type="text"
              value={id}
              disabled
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">نام کاربری ادمین</label>
            <input
              type="text"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">رمز ادمین</label>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">نام کاربری جدید (اختیاری)</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">رمز جدید (اختیاری)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
            />
          </div>

          {msg && <p className="text-sm text-emerald-400">{msg}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : "ذخیره تغییرات"}
          </Button>
        </form>
      </Card>

      {/* سفارش‌های این کاربر */}
      <Card className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">سفارش‌های این کاربر</h2>
          <button
            onClick={fetchOrders}
            disabled={!adminUser || !adminPass || ordersLoading}
            className="text-xs text-gray-500 hover:text-white transition disabled:opacity-50"
          >
            🔄 به‌روزرسانی
          </button>
        </div>

        {!adminUser || !adminPass ? (
          <p className="text-xs text-gray-500 text-center py-6">برای دیدن سفارش‌ها، نام کاربری و رمز ادمین را بالا وارد کنید.</p>
        ) : ordersLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : ordersError ? (
          <p className="text-xs text-red-400 text-center py-6">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">این کاربر سفارشی ندارد.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const st = statusLabel(o.status);
              return (
                <div key={o.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-bold text-sm truncate">{o.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(o.created_at).toLocaleString("fa-IR")}</p>
                    </div>
                    <div className="text-left shrink-0 ml-3">
                      <p className="text-white font-bold text-sm">{o.total.toLocaleString("fa-IR")} تومان</p>
                      <p className={`text-xs font-semibold mt-0.5 ${st.color}`}>{st.text}</p>
                    </div>
                  </div>
                  {o.items && o.items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {o.items.map((it, idx) => (
                        <span key={idx} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
                          {it.name} × {it.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                  {o.delivery_info && (
                    <div className="mt-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2">
                      <p className="text-[10px] text-emerald-300 font-semibold mb-1">تحویل:</p>
                      <pre className="text-[10px] text-white whitespace-pre-wrap font-sans line-clamp-3">{o.delivery_info}</pre>
                    </div>
                  )}
                  <Link
                    to={`/order/${o.token}`}
                    className="inline-block mt-2 text-[11px] text-white underline decoration-white/30 hover:decoration-white"
                  >
                    مشاهده صفحه سفارش ←
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
