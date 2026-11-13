import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LinkButton } from "../components/Button";
import { useLang } from "../i18n/LanguageContext";
import { Sidebar } from "../components/Sidebar";
import { ProductList } from "../components/ProductList";
import { allProducts } from "./products";
import { CartSidebar } from "../components/CartSidebar";
import { useCart } from "../context/CartContext";
import { ReactionTest } from "../components/ReactionTest";

export function Home() {
  const { t, lang } = useLang();
  const isEnglish = lang === "en";
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

  const categories = [
    { id: "accounts", title: isEnglish ? "Minecraft Accounts" : "اکانت‌های ماینکرفت", subtitle: isEnglish ? "Full Access & NFA" : "اکانت‌های فول اکسس و NFA" },
    { id: "capes", title: isEnglish ? "Minecraft Capes" : "کیپ‌های ماینکرفت", subtitle: isEnglish ? "Rare & Custom" : "کیپ‌های کمیاب و خاص" },
    { id: "network", title: isEnglish ? "Network Services" : "سرویس‌های شبکه", subtitle: isEnglish ? "V2Ray & VPN Configs" : "کانفیگ‌های V2Ray و VPN" },
    { id: "donut", title: isEnglish ? "Donut SMP" : "سرور دونات", subtitle: isEnglish ? "Money & Items" : "پول و آیتم‌های Donut SMP" },
    { id: "discord", title: isEnglish ? "Discord Services" : "خدمات دیسکورد", subtitle: isEnglish ? "Bots, Servers & Boosts" : "ربات، سرور و بوست" },
    { id: "other", title: isEnglish ? "Other Services" : "سایر خدمات", subtitle: isEnglish ? "Skins, Photoshop & More" : "اسکین، فوتوشاپ و..." },
  ];

  return (
    <>
      <Sidebar />
      
      {/* Hero */}
      <section id="top" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-32 grid gap-12 md:grid-cols-2 items-center w-full">
          
          <div className="space-y-6 z-10">
            
            {/* 👇 Search Bar بالای متن */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder={isEnglish ? "Search products..." : "جستجوی محصول..."}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-white/30 transition pr-12"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300">
              {t.stats.placeholder}
            </span>
            
            {/* 👇 این همون تگیه که خواستی */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600 mt-2">
                به
                </span>
              <span className="block text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                Zylox Shop
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600 mt-2">
                خوش آمدید
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <LinkButton to="/#products">{t.hero.add}</LinkButton>
              <LinkButton to="/#bot" variant="secondary">
                {t.nav.bot}
              </LinkButton>
            </div>
          </div>

          <div className="relative flex justify-center z-10">
            <div className="absolute h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse-glow" aria-hidden />
            <div className="relative animate-float-slow">
              <img src="/images/ZyloxLogoRemoveBG.png" alt="Zylox Logo" className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
            </div>
          </div>
        </div>
      </section>

      {/* بخش محصولات */}
      <div id="products" className="space-y-16 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">{isEnglish ? "Zylox Shop" : "فروشگاه Zylox"}</h2>
          <p className="text-gray-400">{isEnglish ? "Premium products for gaming and Discord" : "محصولات پریمیوم برای گیمینگ و دیسکورد"}</p>
        </div>
        {categories.map((cat) => {
          const catProducts = allProducts.filter(p => p.category === cat.id);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat.id} className="max-w-7xl mx-auto px-4">
              <div className="mb-6 border-b border-white/10 pb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.subtitle}</p>
                </div>
              </div>
              <ProductList products={catProducts} />
            </section>
          );
        })}
      </div>

      {/* بخش چالش */}
      <section id="challenge" className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🎯 {isEnglish ? "Challenge" : "چالش"}</h2>
          <p className="text-gray-400 mb-8">{isEnglish ? "Test your reaction speed!" : "سرعت واکنش خود را محک بزنید!"}</p>
          <ReactionTest />
        </div>
      </section>

      {/* بخش ربات */}
      <section id="bot" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Diamond BOT</h2>
          <p className="text-gray-400 mb-6">{isEnglish ? "The ultimate Discord bot" : "بهترین ربات دیسکورد"}</p>
          <LinkButton to="/login">{isEnglish ? "Add to Discord" : "افزودن به دیسکورد"}</LinkButton>
        </div>
      </section>

      {/* بخش پشتیبانی */}
      <section id="support" className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">{isEnglish ? "Support" : "پشتیبانی"}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <a href="https://rubika.ir/Zylox_Shop" target="_blank" rel="noopener noreferrer" className="group block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img src="/images/rubika.png" alt="Rubika" className="w-16 h-16 object-contain mb-4" />
                <span className="text-white font-bold">Rubika</span>
              </div>
            </a>
            <a href="https://t.me/Zylox_Shop" target="_blank" rel="noopener noreferrer" className="group block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img src="/images/telegramlogo.png" alt="Telegram" className="w-16 h-16 object-contain mb-4" />
                <span className="text-white font-bold">Telegram</span>
              </div>
            </a>
            <a href="https://discord.gg/aV7Q437hzs" target="_blank" rel="noopener noreferrer" className="group block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img src="/images/discordlogo.png" alt="Discord" className="w-16 h-16 object-contain mb-4" />
                <span className="text-white font-bold">Discord</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* دکمه شناور سبد خرید */}
      {items.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center transition-all hover:scale-110"
        >
          <img src="/images/ShoppingCard.png" alt="Cart" className="w-8 h-8 object-contain" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {items.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        </button>
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
