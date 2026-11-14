import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useLang } from "../i18n/LanguageContext";

interface OrderItem { id: string; name: string; price: number; quantity: number; image?: string; }
interface Order { id: string; token: string; items?: OrderItem[]; product?: string; amount?: number; total: number; status: string; delivery_info?: string | null; completed_at?: string | null; expires_at?: string | null; started_at?: string | null; created_at: string; }

const CARD_NUMBER = "6037-6976-2938-7157";
const CARD_OWNER = "جعفری";
const CONFIRM_DELAY = 0; // بدون تایمر

export function OrderPage() {
  const { token } = useParams<{ token: string }>();
  const { lang } = useLang();
  const isEnglish = lang === "en";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [countdown, setCountdown] = useState("");

  const fetchOrder = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${token}`);
      const data = await res.json();
      if (!data.ok) {
        if (data.notFound) setNotFound(true);
        else setError(data.error || "خطا");
        setLoading(false); return;
      }
      setOrder(data.order); setLoading(false);
    } catch { setError("ارتباط با سرور برقرار نشد"); setLoading(false); }
  }, [token]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  useEffect(() => {
    // تایمر فقط برای وضعیت pending و confirmed
    if (!order || !["pending", "confirmed"].includes(order.status) || !order.expires_at) {
      setCountdown(""); return;
    }
    const update = () => {
      const diff = new Date(order.expires_at!).getTime() - Date.now();
      if (diff <= 0) { setCountdown("منقضی شده"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [order?.expires_at, order?.status]);

  const handleConfirm = async () => {
    if (!token) return;
    setConfirming(true); setError("");
    try {
      const res = await fetch(`/api/orders/${token}`, { method: "PATCH" });
      const data = await res.json();
      if (!data.ok) { if (data.notFound) setNotFound(true); else setError(data.error || "خطا"); setConfirming(false); return; }
      await fetchOrder(); setConfirming(false);
    } catch { setError("ارتباط با سرور برقرار نشد"); setConfirming(false); }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;
  if (notFound) return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4"><div className="text-5xl mb-2">⏰</div><h1 className="text-2xl font-bold text-white">لینک منقضی یا نامعتبر</h1><p className="text-gray-400">این لینک سفارش دیگر معتبر نیست.</p><Link to="/shop"><Button>بازگشت به فروشگاه</Button></Link></div>;
  if (error && !order) return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4"><p className="text-gray-400">{error}</p><Link to="/shop"><Button>بازگشت به فروشگاه</Button></Link></div>;
  if (!order) return null;

  const formatPrice = (n: number) => n.toLocaleString("fa-IR") + " تومان";

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "در حال بررسی سفارش";
      case "confirmed": return "در حال بررسی سفارش";
      case "processing": return "در حال تکمیل سفارش";
      case "completed": return "سفارش تکمیل شد";
      default: return status;
    }
  };

  if (order.status === "completed") {
    return (
      <div className="mx-auto max-w-2xl px-4 md:px-8 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold mb-4"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />{getStatusText(order.status)}</div>
          <h1 className="text-3xl font-black text-white">اطلاعات تحویل</h1>
          <p className="text-sm text-gray-500 mt-2">آیدی: {order.id}</p>
        </div>
        <Card className="space-y-4">
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
            <p className="text-xs text-emerald-300 mb-2 font-semibold">اطلاعات تحویل:</p>
            <pre className="text-sm text-white whitespace-pre-wrap font-sans leading-7">{order.delivery_info}</pre>
          </div>
          {order.completed_at && <p className="text-xs text-gray-500 text-center">تکمیل شده در: {new Date(order.completed_at).toLocaleString("fa-IR")}</p>}
        </Card>
        <div className="mt-8 text-center"><Link to="/dashboard"><Button>بازگشت به داشبورد</Button></Link></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white text-sm font-semibold mb-4"><span className="h-2 w-2 rounded-full bg-white animate-pulse" />{getStatusText(order.status)}</div>
        <h1 className="text-3xl font-black text-white">جزئیات سفارش</h1>
        <p className="text-sm text-gray-500 mt-2">آیدی: {order.id}</p>
        {countdown && <p className={`text-sm font-bold mt-3 ${countdown === "منقضی شده" ? "text-red-400" : "text-yellow-400"}`}>⏳ زمان باقی‌مانده: {countdown}</p>}
      </div>

      <Card className="space-y-4">
        {order.items && order.items.length > 0 ? (
          <div className="space-y-2 pb-4 border-b border-white/10">
            <p className="text-xs text-gray-500 font-semibold mb-2">محصولات:</p>
            {order.items.map((it, idx) => (<div key={idx} className="flex justify-between items-center text-sm"><span className="text-white">{it.name} × {it.quantity}</span><span className="text-gray-400">{formatPrice(it.price * it.quantity)}</span></div>))}
          </div>
        ) : (
          <><div className="flex justify-between items-center pb-4 border-b border-white/10"><span className="text-sm text-gray-400">محصول</span><span className="text-sm font-bold text-white">{order.product}</span></div><div className="flex justify-between items-center pb-4 border-b border-white/10"><span className="text-sm text-gray-400">تعداد</span><span className="text-sm font-bold text-white">{order.amount}</span></div></>
        )}
        <div className="flex justify-between items-center pt-2"><span className="text-base font-semibold text-white">مجموع</span><span className="text-2xl font-black text-white">{formatPrice(order.total)}</span></div>
      </Card>

      {order.status === "pending" && (
        <>
          <Card className="mt-6 space-y-3">
            <p className="text-sm text-gray-400">لطفاً مبلغ را به شماره کارت زیر واریز کنید:</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"><p className="text-xl font-mono font-bold text-white tracking-widest mb-2" dir="ltr">{CARD_NUMBER}</p><p className="text-xs text-gray-500">به نام: {CARD_OWNER}</p></div>
          </Card>
          <div className="mt-6 text-center p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300"><p className="font-bold text-sm">✅ دکمه تأیید فعال است</p></div>
          {error && <p className="text-sm text-red-400 mt-3 text-center">{error}</p>}
          <Button onClick={handleConfirm} disabled={confirming} className="w-full mt-4 py-4 text-lg bg-white text-black hover:bg-gray-200">{confirming ? "در حال تأیید..." : "تأیید سفارش"}</Button>
          <div className="border-t border-white/10 pt-8 mt-8">
            <h3 className="text-lg font-bold text-white mb-4">{isEnglish ? "Terms & Conditions" : "قوانین و شرایط"}</h3>
            <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside leading-relaxed">
              <li>{isEnglish ? "Delivery time is between 1 to 96 hours." : "زمان تحویل سفارش بین ۱ تا ۹۶ ساعت است."}</li>
              <li>{isEnglish ? "The information entered during the order must be correct." : "اطلاعات واردشده هنگام ثبت سفارش باید صحیح باشند."}</li>
              <li>{isEnglish ? "Changing the product, quantity, and price after placing the order is not possible." : "تغییر محصول، تعداد و مبلغ پس از ثبت سفارش امکان‌پذیر نیست."}</li>
              <li>{isEnglish ? "Orders must be claimed within 3 hours of creation. Unclaimed orders are automatically cancelled." : "سفارش‌ها باید حداکثر ۳ ساعت پس از ثبت، توسط پشتیبانی تأیید و آغاز شوند. سفارش‌های تأییدنشده به‌صورت خودکار لغو می‌شوند."}</li>
            </ul>
          </div>
        </>
      )}

      {order.status === "confirmed" && (
        <Card className="mt-6"><p className="text-sm text-gray-400 leading-8 text-center">سفارش شما تأیید شد و در صف بررسی قرار گرفت.<br />پس از تأیید پرداخت توسط پشتیبانی، سفارش شما در حال تکمیل قرار می‌گیرد.</p></Card>
      )}

      <div className="mt-6 text-center"><Link to="/dashboard" className="text-xs text-gray-500 hover:text-white transition">← بازگشت به داشبورد</Link></div>
    </div>
  );
}
