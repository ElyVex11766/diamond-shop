import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useCart } from "../context/CartContext";

const CARD_NUMBER = "6037-6976-2938-7157";
const CARD_OWNER = "جعفری";

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [timeLeft, setTimeLeft] = useState(120); // ۲ دقیقه
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate("/shop");
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [items, navigate]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = () => {
    const userStr = localStorage.getItem("diamond_user");
    if (!userStr) { navigate("/login"); return; }
    const user = JSON.parse(userStr);

    const orderId = `ORD-${Date.now()}`;
    const link = `/order/${orderId}`;

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleString("fa-IR"),
      items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
      total: total,
      status: "pending" as const,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // ۳۰ دقیقه
      link: link,
    };

    const savedOrders = localStorage.getItem(`diamond_orders_${user.id}`);
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(newOrder);
    localStorage.setItem(`diamond_orders_${user.id}`, JSON.stringify(orders));

    clearCart();
    navigate(link);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16" dir="rtl">
      <h1 className="text-3xl font-bold text-white text-center mb-8">تسویه حساب</h1>
      
      <Card className="p-8 space-y-6">
        <div className="bg-[#050505] p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-gray-400 mb-3">مبلغ قابل پرداخت:</p>
          <p className="text-4xl font-black text-white">{total.toLocaleString("fa-IR")} تومان</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-400">لطفاً مبلغ را به شماره کارت زیر واریز کنید:</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-xl font-mono font-bold text-white tracking-widest mb-2" dir="ltr">{CARD_NUMBER}</p>
            <p className="text-xs text-gray-500">به نام: {CARD_OWNER}</p>
          </div>
        </div>

        <div className={`text-center p-4 rounded-xl border ${isActive ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"}`}>
          {isActive ? (
            <p className="font-bold">✅ دکمه ثبت سفارش فعال شد</p>
          ) : (
            <p className="font-bold">⏳ لطفاً {formatTime(timeLeft)} صبر کنید...</p>
          )}
        </div>

        <Button onClick={handleSubmit} disabled={!isActive} className={`w-full py-4 text-lg ${!isActive ? "opacity-50 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"}`}>
          {isActive ? "ثبت نهایی سفارش" : "لطفاً صبر کنید..."}
        </Button>
      </Card>
    </div>
  );
}
