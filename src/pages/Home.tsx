import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LinkButton } from "../components/Button";
import { useLang } from "../i18n/LanguageContext";
import { Sidebar } from "../components/Sidebar";
import { ProductList } from "../components/ProductList";
import { allProducts } from "./products";
import { CartSidebar } from "../components/CartSidebar";
import { useCart } from "../context/CartContext";

export function Home() {
  const { t, lang } = useLang();
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const isEnglish = lang === "en";
  const categories = isEnglish
    ? [
        { id: "accounts", title: "Minecraft Accounts", subtitle: "Full-access and NFA accounts" },
        { id: "capes", title: "Minecraft Capes", subtitle: "Rare and exclusive capes" },
        { id: "network", title: "Network Services", subtitle: "V2Ray and VPN configurations" },
        { id: "donut", title: "Donut Server", subtitle: "Donut SMP money and items" },
        { id: "discord", title: "Discord Services", subtitle: "Bots, servers and boosts" },
        { id: "other", title: "Other Services", subtitle: "Skins, Photoshop and more" },
      ]
    : [
        { id: "accounts", title: "اکانت‌های ماینکرفت", subtitle: "اکانت‌های فول اکسس و NFA" },
        { id: "capes", title: "کیپ‌های ماینکرفت", subtitle: "کیپ‌های کمیاب و خاص" },
        { id: "network", title: "سرویس‌های شبکه", subtitle: "کانفیگ‌های V2Ray و VPN" },
        { id: "donut", title: "سرور دونات", subtitle: "پول و آیتم‌های Donut SMP" },
        { id: "discord", title: "خدمات دیسکورد", subtitle: "ربات، سرور و بوست" },
        { id: "other", title: "سایر خدمات", subtitle: "اسکین، فوتوشاپ و..." },
      ];

  const features = isEnglish
    ? [
        { icon: "⚡", title: "Fast Orders", desc: "A simple and quick buying experience" },
        { icon: "🔒", title: "Secure Payments", desc: "Transactions handled safely through Discord" },
        { icon: "💎", title: "Premium Products", desc: "Only trusted, high-quality products" },
        { icon: "🛡️", title: "Quality Guarantee", desc: "Free replacement if a product has an issue" },
      ]
    : [
        { icon: "⚡", title: "سفارش سریع", desc: "فرآیند خرید ساده و سریع برای شما" },
        { icon: "🔒", title: "پرداخت امن", desc: "تمام تراکنش‌ها از طریق دیسکورد و امن انجام می‌شود" },
        { icon: "💎", title: "محصولات پریمیوم", desc: "فقط بهترین و معتبرترین محصولات" },
        { icon: "🛡️", title: "ضمانت کیفیت", desc: "اگر محصول مشکل داشت، تعویض رایگان" },
      ];

  return (
    <>
      <Sidebar />

      {/* Hero */}
      <section id="top" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" aria-hidden />
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-32 grid gap-12 md:grid-cols-2 items-center w-full">

          <div className="space-y-6 z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isEnglish ? "24/7 Support • Secure and fast shopping" : "پشتیبانی ۲۴/۷ • خرید مطمئن و سریع"}
            </span>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
              <span className="block text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                {isEnglish ? "Welcome to" : "به"}
              </span>
              <span className="block text-gradient-brand mt-2">
                Zylox Shop
              </span>
              <span className="block text-white mt-2">
                {isEnglish ? "Shop" : "خوش آمدید"}
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <LinkButton to="/#products" className="btn-glow">{t.hero.add}</LinkButton>
              <LinkButton to="/bot" variant="secondary">
                {t.nav.bot}
              </LinkButton>
            </div>
          </div>

          {/* Logo */}
          <div className="relative flex justify-center z-10">
            <div className="absolute h-72 w-72 rounded-full bg-white/8 blur-3xl animate-pulse-glow" aria-hidden />
            <div className="relative animate-float-slow">
              <img
                src="/images/ZyloxLogoRemoveBG.png"
                alt="Zylox Shop"
                className="w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-sm font-bold text-white">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <div id="products" className="space-y-16 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-4">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/30" />
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">{isEnglish ? "Shop" : "فروشگاه"}</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/30" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{t.shop.title}</h2>
          <p className="text-gray-400">{t.shop.subtitle}</p>
        </div>

        {categories.map((cat) => {
          const catProducts = allProducts.filter(p => p.category === cat.id);
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id} className="max-w-7xl mx-auto px-4">
              <div className="mb-6 border-b border-white/8 pb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.subtitle}</p>
                </div>
                <span className="text-xs text-gray-600">{catProducts.length} {isEnglish ? "products" : "محصول"}</span>
              </div>
              <ProductList products={catProducts} />
            </section>
          );
        })}
      </div>

      {/* Why us */}
      <section id="why-us" className="py-20 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{isEnglish ? "Why Zylox?" : "چرا Zylox؟"}</h2>
          <div className="grid gap-6 md:grid-cols-3 mt-12">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl mx-auto mb-4">🚀</div>
              <h3 className="font-bold text-white mb-2">{isEnglish ? "Fast and simple" : "سریع و ساده"}</h3>
              <p className="text-sm text-gray-400">{isEnglish ? "A smooth shopping experience" : "تجربه خرید سریع و راحت"}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl mx-auto mb-4">💯</div>
              <h3 className="font-bold text-white mb-2">{isEnglish ? "Guaranteed quality" : "کیفیت تضمینی"}</h3>
              <p className="text-sm text-gray-400">{isEnglish ? "Every product is quality checked" : "تمام محصولات با ضمانت کیفیت"}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl mx-auto mb-4">🎯</div>
              <h3 className="font-bold text-white mb-2">{isEnglish ? "24/7 Support" : "پشتیبانی ۲۴/۷"}</h3>
              <p className="text-sm text-gray-400">{isEnglish ? "Always available through Discord" : "همیشه در دسترس از طریق دیسکورد"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{isEnglish ? "Customer Reviews" : "نظرات کاربران"}</h2>
          <p className="text-gray-400">{isEnglish ? "Coming soon..." : "به زودی..."}</p>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="py-20 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{isEnglish ? "Store rules" : "قوانین فروشگاه"}</h2>
          <div className="mx-auto grid max-w-5xl gap-4 text-start sm:grid-cols-2 lg:grid-cols-4">
            {(isEnglish ? [
              ["Fast delivery", "Delivery usually takes 1 to 92 hours depending on the product and queue."],
              ["Account testing", "Permanent accounts include up to 24 hours for testing after delivery."],
              ["Account issues", "If an account is broken, provide complete evidence. Without evidence, replacement or refund is not guaranteed."],
              ["Support", "Contact support before opening a dispute. Orders are reviewed using the delivery record and evidence."],
            ] : [
              ["تحویل سریع", "تحویل معمولاً بین ۱ تا ۹۲ ساعت و بر اساس محصول و صف سفارش انجام می‌شود."],
              ["تست اکانت", "اکانت‌های پرمیوم تا ۲۴ ساعت بعد از تحویل فرصت تست دارند."],
              ["مشکل اکانت", "برای اکانت خراب باید مدارک کامل ارائه شود؛ بدون مدرک تعویض یا بازپرداخت تضمین نمی‌شود."],
              ["پشتیبانی", "قبل از ثبت شکایت با پشتیبانی تماس بگیرید؛ سفارش با سابقه تحویل و مدارک بررسی می‌شود."],
            ]).map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-start">
                <h3 className="mb-2 font-bold text-white">{title}</h3>
                <p className="text-sm leading-7 text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating cart */}
      {items.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <img src="/images/ShoppingCard.png" alt="سبد خرید" className="h-8 w-8 object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {items.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        </button>
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
