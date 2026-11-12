import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";

export function Docs() {
  const sections = [
    { title: "شروع سریع", body: "بدون ساخت حساب می‌توانید محصولات را ببینید و به سبد اضافه کنید. برای ادامه سفارش و پشتیبانی، ابتدا وارد حساب خود شوید." },
    { title: "تحویل سریع", body: "تحویل سفارش‌ها معمولاً بین ۱ تا ۹۲ ساعت انجام می‌شود. زمان دقیق به نوع محصول، بررسی سفارش و صف تحویل بستگی دارد." },
    { title: "مهلت تست اکانت", body: "اکانت‌های پرمیوم تا ۲۴ ساعت بعد از تحویل مهلت تست دارند. ورود، تغییر رمز، اتصال و قابلیت‌های اصلی را در همین بازه بررسی کنید." },
    { title: "مدرک خرابی اکانت", body: "اگر اکانت خراب بود، باید ویدیو یا اسکرین‌شات کامل از خطا، زمان مشاهده و اطلاعات سفارش را ارائه کنید. بدون مدرک کافی، ادعای خرابی قابل تأیید نیست و تعویض یا بازپرداخت انجام نمی‌شود." },
    { title: "پشتیبانی و تحویل", body: "برای پیگیری سفارش از مسیر پشتیبانی استفاده کنید. تحویل سریع انجام می‌شود، اما زمان اعلام‌شده بازه تقریبی است و ممکن است به بررسی محصول و وضعیت سرویس وابسته باشد." },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <SectionTitle title="مستندات" subtitle="راهنمای استفاده از فروشگاه Zylox" />
      <div className="space-y-5">
        {sections.map((section, index) => (
          <Card key={section.title}>
            <h3 className="mb-2 flex items-center gap-3 text-lg font-bold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-black">{index + 1}</span>
              {section.title}
            </h3>
            <p className="pr-10 text-sm leading-8 text-gray-400">{section.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
