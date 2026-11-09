import { useState, useEffect } from "react";
import { Button } from "./Button";
import { type Product } from "../pages/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const CARD_NUMBER = "6037-6976-2938-7157";
const CARD_OWNER = "جعفری"; 
const WAIT_SECONDS = 120; // ۲ دقیقه برای فعال شدن دکمه

const WORKER_URL = "https://diamond-shop.p2opcnymwrvsjo3mmroimjhu.workers.dev";

export function CheckoutModal({ isOpen, onClose, product }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(1);
  const [contactType, setContactType] = useState("discord");
  const [contactId, setContactId] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [countdown, setCountdown] = useState(WAIT_SECONDS);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount(1);
      setContactType("discord");
      setContactId("");
      setPhone("");
      setIsButtonActive(false);
      setCountdown(WAIT_SECONDS);
    }
  }, [isOpen]);

  // تایمر ۲ دقیقه‌ای برای فعال شدن دکمه ثبت نهایی
  useEffect(() => {
    if (step !== 2) return;
    if (countdown <= 0) {
      setIsButtonActive(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

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
    if (!isButtonActive || isSubmitting) return;

    // 👈 باز کردن تب جدید در همان لحظه کلیک (برای جلوگیری از Popup Blocker)
    const newTab = window.open("", "_blank");
    if (!newTab) {
      alert("لطفاً پاپ‌آپ را در مرورگر خود فعال کنید.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${WORKER_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.name,
          amount: amount,
          contact: `${contactType}: ${contactId}`,
          phone: phone,
          unit_price: product.price,
          total: totalPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "خطا در ارسال سفارش");

      // 👈 انتقال تب جدید به صفحه اختصاصی سفارش
      newTab.location.href = `${window.location.origin}/order/${data.token}`;
      
      // بستن مودال
      onClose();
    } catch (error) {
      console.error("Error sending order:", error);
      newTab.close(); // بستن تب جدید در صورت خطا
      alert("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
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
                  type="number" min="1" value={amount} 
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
                type="text" placeholder={`آیدی ${contactType} خود را وارد کنید`}
                value={contactId} onChange={(e) => setContactId(e.target.value)} required
                className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan"
              />
            </div>

            <div>
              <input 
                type="tel" placeholder="شماره تماس (اختیاری)" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan text-sm"
              />
            </div>

            <div className="bg-diamond-bg border border-diamond-cyan/30 rounded-xl p-4 flex justify-between items-center shadow-glow-sm">
              <span className="text-sm text-diamond-muted">مبلغ قابل پرداخت:</span>
              <span className="text-xl font-bold text-diamond-cyan">{totalPrice.toLocaleString('fa-IR')} تومان</span>
            </div>

            <Button type="submit" className="w-full py-3 text-lg">ادامه سفارش</Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#05070d] p-6 rounded-xl border border-diamond-cyan/30 text-center">
              <h4 className="text-sm text-diamond-muted mb-3">لطفاً مبلغ زیر را به شماره کارت زیر واریز کنید:</h4>
              <div className="text-2xl font-mono font-bold text-white tracking-widest mb-2" dir="ltr">{CARD_NUMBER}</div>
              <p className="text-xs text-diamond-muted mb-4">به نام: {CARD_OWNER}</p>
              <div className="bg-diamond-cyan/10 border border-diamond-cyan/30 p-3 rounded-lg">
                <p className="text-sm text-diamond-cyan font-bold">مبلغ: {totalPrice.toLocaleString('fa-IR')} تومان</p>
              </div>
            </div>

            <div className={`text-center p-3 rounded-lg border ${isButtonActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
              {isButtonActive ? (
                <p className="text-sm font-bold">✅ دکمه ثبت سفارش فعال شد</p>
              ) : (
                <p className="text-sm font-bold">⏳ لطفاً {formatTime(countdown)} صبر کنید...</p>
              )}
            </div>

            <div className="text-center space-y-3">
              <p className="text-xs text-diamond-muted">پس از واریز، دکمه زیر را بزنید.</p>
              <Button 
                type="submit" 
                disabled={!isButtonActive || isSubmitting} 
                className={`w-full py-3 text-lg ${!isButtonActive ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "در حال ثبت..." : isButtonActive ? "ثبت نهایی سفارش" : "لطفاً صبر کنید..."}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
