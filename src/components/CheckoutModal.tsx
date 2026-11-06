import { useState } from "react";
import { Button } from "./Button";
import { type Product } from "../pages/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CheckoutModal({ isOpen, onClose, product }: Props) {
  const [amount, setAmount] = useState(1);
  const [contactType, setContactType] = useState("discord");
  const [contactId, setContactId] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const totalPrice = product.price * amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const WORKER_URL = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev/?v=2";

      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.name,
          amount: amount,
          contact: `${contactType}: ${contactId}`,
          phone: phone,
        }),
      });

      if (!response.ok) throw new Error("خطا در ارسال سفارش");

      setIsSubmitting(false);
      alert("سفارش شما با موفقیت ثبت شد! به زودی با شما تماس می‌گیریم.");
      onClose();
    } catch (error) {
      console.error("Error sending order:", error);
      setIsSubmitting(false);
      alert("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-diamond-panel border border-diamond-border rounded-2xl p-6 shadow-glow">
        <button onClick={onClose} className="absolute top-4 right-4 text-diamond-muted hover:text-white text-2xl z-10">×</button>
        <h3 className="text-xl font-bold text-white mb-6 text-center">سفارش: {product.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!product.isSingle && (
            <div className="bg-[#05070d] p-4 rounded-xl border border-white/5">
              <label className="block text-sm text-diamond-muted mb-2">{product.unit === "گیگ" ? "چند گیگ نیاز دارید؟" : product.unit === "عدد" ? "چند عدد نیاز دارید؟" : "چند ملیون می‌خواهید؟"}</label>
              <input type="number" min="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan" />
            </div>
          )}
          <div className="bg-[#05070d] p-4 rounded-xl border border-white/5">
            <label className="block text-sm text-diamond-muted mb-2">راه ارتباطی برای ارسال سفارش:</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="radio" name="contact" checked={contactType === "discord"} onChange={() => setContactType("discord")} className="accent-diamond-cyan" />دیسکورد</label>
              <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="radio" name="contact" checked={contactType === "telegram"} onChange={() => setContactType("telegram")} className="accent-diamond-cyan" />تلگرام</label>
              <label className="flex items-center gap-2 text-white text-sm cursor-pointer"><input type="radio" name="contact" checked={contactType === "rubika"} onChange={() => setContactType("rubika")} className="accent-diamond-cyan" />روبیکا</label>
            </div>
            <input type="text" placeholder={`آیدی ${contactType} خود را وارد کنید (مثلاً @username)`} value={contactId} onChange={(e) => setContactId(e.target.value)} required className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan" />
          </div>
          <div><input type="tel" placeholder="شماره تماس (اختیاری)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan text-sm" /></div>
          <div className="bg-diamond-bg border border-diamond-cyan/30 rounded-xl p-4 flex justify-between items-center shadow-glow-sm">
            <span className="text-sm text-diamond-muted">مبلغ قابل پرداخت:</span>
            <span className="text-xl font-bold text-diamond-cyan">{totalPrice.toLocaleString('fa-IR')} تومان</span>
          </div>
          <div className="text-center space-y-3">
            <p className="text-xs text-red-400 font-medium">⚠️ لطفاً در وارد کردن آیدی خود دقت کنید. تحویل سفارش بین ۱ تا ۷۲ ساعت زمان می‌برد.</p>
            <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-lg">{isSubmitting ? "در حال ثبت..." : "ثبت سفارش"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
