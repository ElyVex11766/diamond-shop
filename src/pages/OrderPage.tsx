import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

interface Order {
  id: string;
  product: string;
  amount: number;
  unit_price: number;
  total: number;
  platform: string;
  platform_user_id: string;
  phone: string;
  status: string;
  created_at: string;
  expires_at: string;
  edited_at: string | null;
}

export function OrderPage() {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const localOrder = localStorage.getItem(`zylox-order-${token}`);
    if (localOrder) {
      try {
        const saved = JSON.parse(localOrder) as Partial<Order>;
        setOrder({
          id: saved.id || token,
          product: saved.product || "سفارش Zylox",
          amount: saved.amount || 1,
          unit_price: saved.unit_price || 0,
          total: saved.total || 0,
          platform: "پشتیبانی",
          platform_user_id: "-",
          phone: "-",
          status: saved.status || "در انتظار بررسی پرداخت",
          created_at: saved.created_at || new Date().toISOString(),
          expires_at: "",
          edited_at: null,
        });
      } catch {
        setError("لینک سفارش معتبر نیست");
      }
      setLoading(false);
      return;
    }

    fetch(`/api/order/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.expired) setExpired(true);
        else if (data.ok) setOrder(data.order);
        else setError(data.error || "سفارش پیدا نشد");
        setLoading(false);
      })
      .catch(() => {
        setError("ارتباط با سرور برقرار نشد");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-5xl mb-2">⏰</div>
        <h1 className="text-2xl font-bold text-white">لینک منقضی شده است</h1>
        <p className="text-gray-400">این لینک سفارش دیگر معتبر نیست.</p>
        <Link to="/"><Button>بازگشت به خانه</Button></Link>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-gray-400">{error || "سفارش پیدا نشد"}</p>
        <Link to="/"><Button>بازگشت به خانه</Button></Link>
      </div>
    );
  }

  const formatPrice = (n: number) => n.toLocaleString("fa-IR") + " تومان";

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          سفارش ثبت شد
        </div>
        <h1 className="text-3xl font-black text-white">جزئیات سفارش</h1>
        <p className="text-sm text-gray-500 mt-2">آیدی: {order.id}</p>
      </div>

      <Card className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">محصول</span>
          <span className="text-sm font-bold text-white">{order.product}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">تعداد</span>
          <span className="text-sm font-bold text-white">{order.amount}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">قیمت واحد</span>
          <span className="text-sm font-bold text-white">{formatPrice(order.unit_price)}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">پلتفرم</span>
          <span className="text-sm font-bold text-white">{order.platform}: {order.platform_user_id}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-semibold text-white">مجموع</span>
          <span className="text-2xl font-black text-white">{formatPrice(order.total)}</span>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          وضعیت سفارش پس از بررسی پرداخت از طریق پشتیبانی به‌روزرسانی می‌شود.
        </p>
      </div>
    </div>
  );
}
