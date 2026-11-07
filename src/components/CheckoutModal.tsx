import { useState, useEffect } from "react";
import { Button } from "./Button";
import { type Product } from "../pages/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

// ✅ شماره کارت و نام صاحب کارت
const CARD_NUMBER = "6037-6976-2938-7157";
const CARD_OWNER = "جعفری"; 
const COUNTDOWN_SECONDS = 120; // ۲ دقیقه

// ✅ آدرس اصلی سایت (Cloudflare Worker)
const WORKER_URL = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev";

export function CheckoutModal({ isOpen, onClose, product }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(1);
  const [contactType, setContactType] = useState("discord");
  const [contactId, setContactId] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount(1);
      setContactType("discord");
      setContactId("");
      setPhone("");
      setTimeLeft(COUNTDOWN_SECONDS);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen || !product) return null;

  const totalPrice = product.price * amount;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId.trim()) {
      alert("لطفاً آیدی خود را وارد کنید.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft === 0) return;

    setIsSubmitting(true);

    try {
      // 👇 درخواست به مسیر /api/order
      const response = await fetch(`${WORKER_URL}/api/order`, {
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-diamond-panel border border-diamond-border rounded-2xl p-6 shadow-glow">
        <button onClick={onClose} className="absolute top-4 right-4 text-diamond-muted hover:text-white text-2xl z-10">×</button>
        
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          {step === 1 ? `سفارش: ${product.name}` : "تکمیل سفارش و پرداخت"}
        </h3>

        {step === 1 && (
          <form onSubmit={handleContinue} className="space-y-4">
            {!product.isSingle && (
              <div className="bg-[#05070d] p-4 rounded-xl border border-white/5">
                <label className="block text-sm text-diamond-muted mb-2">
                  {product.unit === "گیگ" ? "چند گیگ نیاز دارید؟" : product.unit === "عدد" ? "چند عدد نیاز دارید؟" : "چند ملیون می‌خواهید؟"}
                </label>
                <input 
                  type="number" 
                  min="1" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan"
                />
              </div>
            )}

            <div className="bg-[#05070d] p-4 rounded-xl border border-white/5">
              <label className="block text-sm text-diamond-muted mb-2">راه ارتباطی برای ارسال سفارش:</label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                  <input type="radio" name="contact" checked={contactType === "discord"} onChange={() => setContactType("discord")} className="accent-diamond-cyan" />
                  دیسکورد
                </label>
                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                  <input type="radio" name="contact" checked={contactType === "telegram"} onChange={() => setContactType("telegram")} className="accent-diamond-cyan" />
                  تلگرام
                </label>
                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                  <input type="radio" name="contact" checked={contactType === "rubika"} onChange={() => setContactType("rubika")} className="accent-diamond-cyan" />
                  روبیکا
                </label>
              </div>
              <input 
                type="text" 
                placeholder={`آیدی ${contactType} خود را وارد کنید (مثلاً @username)`}
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                required
                className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan"
              />
            </div>

            <div>
              <input 
                type="tel" 
                placeholder="شماره تماس (اختیاری)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan text-sm"
              />
            </div>

            <div className="bg-diamond-bg border border-diamond-cyan/30 rounded-xl p-4 flex justify-between items-center shadow-glow-sm">
              <span className="text-sm text-diamond-muted">مبلغ قابل پرداخت:</span>
              <span className="text-xl font-bold text-diamond-cyan">{totalPrice.toLocaleString('fa-IR')} تومان</span>
            </div>

            <Button type="submit" className="w-full py-3 text-lg">
              ادامه سفارش
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#05070d] p-6 rounded-xl border border-diamond-cyan/30 text-center">
              <h4 className="text-sm text-diamond-muted mb-3">لطفاً مبلغ زیر را به شماره کارت زیر واریز کنید:</h4>
              <div className="text-2xl font-mono font-bold text-white tracking-widest mb-2" dir="ltr">
                {CARD_NUMBER}
              </div>
              <p className="text-xs text-diamond-muted mb-4">به نام: {CARD_OWNER}</p>
              
              <div className="bg-diamond-cyan/10 border border-diamond-cyan/30 p-3 rounded-lg">
                <p className="text-sm text-diamond-cyan font-bold">مبلغ: {totalPrice.toLocaleString('fa-IR')} تومان</p>
              </div>
            </div>

            <div className={`text-center p-3 rounded-lg border ${timeLeft > 0 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {timeLeft > 0 ? (
                <p className="text-sm font-bold">⏳ زمان باقی‌مانده برای ثبت نهایی: <span dir="ltr">{formatTime(timeLeft)}</span></p>
              ) : (
                <p className="text-sm font-bold">⏰ زمان به پایان رسید. لطفاً از اول تلاش کنید.</p>
              )}
            </div>

            <div className="text-center space-y-3">
              <p className="text-xs text-diamond-muted">
                پس از واریز، دکمه زیر را بزنید. سفارش شما پس از تایید مدیریت ثبت می‌شود.
              </p>
              <Button 
                type="submit" 
                disabled={isSubmitting || timeLeft === 0} 
                className={`w-full py-3 text-lg ${timeLeft === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "در حال ثبت..." : timeLeft === 0 ? "زمان تمام شد" : "ثبت نهایی سفارش"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
