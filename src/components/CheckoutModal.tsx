import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useCart } from "../context/CartContext";
import { useLang } from "../i18n/LanguageContext";

const PAYMENT_WAIT_SECONDS = 120;

export function Checkout() {
  const { items, total } = useCart();
  const { lang } = useLang();
  const isEnglish = lang === "en";
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_WAIT_SECONDS);
  const [orderLink, setOrderLink] = useState("");
  const formatPrice = (price: number) => isEnglish ? `$${price.toLocaleString("en-US")}` : `${price.toLocaleString("fa-IR")} تومان`;

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const timeLabel = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const createOrderLink = () => {
    const token = `local-${Date.now().toString(36)}`;
    localStorage.setItem(`zylox-order-${token}`, JSON.stringify({
      id: token,
      product: items.map((item) => item.name).join("، "),
      amount: items.reduce((sum, item) => sum + item.quantity, 0),
      unit_price: items[0]?.price ?? 0,
      total,
      status: "در انتظار بررسی پرداخت",
      created_at: new Date().toISOString(),
    }));
    setOrderLink(`${window.location.origin}/order/${token}`);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="text-2xl font-black text-white">{isEnglish ? "Your cart is empty" : "سبد خرید خالی است"}</h1>
        <Link to="/shop"><Button>{isEnglish ? "Browse products" : "مشاهده محصولات"}</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm text-gray-500">{isEnglish ? "Final step" : "مرحله نهایی"}</p>
        <h1 className="text-3xl font-black text-white">{isEnglish ? "Review your order" : "بررسی و پرداخت سفارش"}</h1>
        <p className="mt-2 text-sm leading-7 text-gray-500">{isEnglish ? "Review the items, then wait for the payment window to unlock your private order link." : "محصولات را بررسی کنید؛ پس از پایان زمان انتظار، لینک اختصاصی سفارش برای شما ساخته می‌شود."}</p>
      </div>

      <Card className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-contain" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-xs text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
            </div>
            <span className="text-sm font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-gray-400">مجموع</span>
          <span className="text-xl font-black text-white">{formatPrice(total)}</span>
        </div>
      </Card>

      <Card className="mt-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">اطلاعات پرداخت</h2>
          <p className="mt-2 text-sm leading-7 text-gray-400">شماره کارت مقصد پس از تأیید سفارش از طریق پشتیبانی اعلام می‌شود. اطلاعات کارت خود را در سایت وارد نکنید.</p>
        </div>
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-4 text-center">
          <p className="text-xs text-gray-400">زمان فعال‌شدن ساخت لینک اختصاصی</p>
          <p className="mt-2 text-3xl font-black tracking-widest text-sky-300">{timeLabel}</p>
        </div>
        <Button className="w-full" disabled={secondsLeft > 0 || Boolean(orderLink)} onClick={createOrderLink}>
          {orderLink ? "لینک سفارش ساخته شد" : secondsLeft > 0 ? "لطفاً تا پایان زمان صبر کنید" : "ساخت لینک اختصاصی سفارش"}
        </Button>
        {orderLink && (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-center">
            <p className="mb-2 text-sm font-semibold text-emerald-300">لینک اختصاصی آماده است</p>
            <Link to={orderLink.replace(window.location.origin, "")} className="break-all text-xs text-sky-300 underline">{orderLink}</Link>
          </div>
        )}
      </Card>
    </div>
  );
}
