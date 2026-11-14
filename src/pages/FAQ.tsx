import { useState } from "react";
import { SectionTitle } from "../components/SectionTitle";

const faqs = [
  { q: "چطور سفارش بدم؟", a: "کافیه محصول مورد نظر رو به سبد خرید اضافه کنید، به صفحه پرداخت برید و بعد از واریز مبلغ، دکمه تأیید رو بزنید." },
  { q: "زمان تحویل چقدره؟", a: "بسته به نوع محصول، بین ۱ تا ۹۶ ساعت زمان می‌بره. برای محصولات فوری معمولاً کمتر از ۱ ساعت تحویل داده می‌شه." },
  { q: "اگر اکانت خراب بود چی؟", a: "تا ۲۴ ساعت بعد از تحویل، مهلت تست دارید. اگر مشکل داشت، با مدرک (ویدیو یا اسکرین‌شات) از طریق تیکت پشتیبانی در دیسکورد پیام بدید." },
  { q: "روش‌های پرداخت چیه؟", a: "فعلاً پرداخت به صورت کارت به کارت انجام می‌شه. بعد از تأیید، به‌زودی درگاه پرداخت آنلاین اضافه می‌شه." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle title="سوالات متداول" subtitle="پاسخ به سوالات پرتکرار شما" />
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center p-5 text-left text-white font-semibold hover:bg-white/5 transition"
            >
              {faq.q}
              <span className="text-gray-500">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="p-5 pt-0 text-sm text-gray-400 leading-7">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
