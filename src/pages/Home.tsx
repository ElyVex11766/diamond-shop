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
  const { t } = useLang();
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
    { id: "accounts", title: "اکانت‌های ماینکرفت", subtitle: "اکانت‌های فول اکسس و NFA" },
    { id: "capes", title: "کیپ‌های ماینکرفت", subtitle: "کیپ‌های کمیاب و خاص" },
    { id: "network", title: "سرویس‌های شبکه", subtitle: "کانفیگ‌های V2Ray و VPN" },
    { id: "donut", title: "سرور دونات", subtitle: "پول و آیتم‌های Donut SMP" },
    { id: "discord", title: "خدمات دیسکورد", subtitle: "ربات، سرور و بوست" },
    { id: "other", title: "سایر خدمات", subtitle: "اسکین، فوتوشاپ و..." },
  ];

  return (
    <>
      <Sidebar />
      
      {/* Hero - بخش خانه */}
      <section id="top" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-32 grid gap-12 md:grid-cols-2 items-center w-full">
          
          <div className="space-y-6 z-10">
            <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300">
              {t.stats.placeholder}
            </span>
            
            {/* 👇 متن خوش‌آمدگویی با استایل خفن */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              <span className="block text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                به Zylox
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600 mt-2">
                Shop خوش آمدید
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <LinkButton to="/#products">{t.hero.add}</LinkButton>
              <LinkButton to="/bot" variant="secondary">
                {t.nav.bot}
              </LinkButton>
            </div>
          </div>

          {/* بخش لوگو - با اسم دقیق عکس تو */}
          <div className="relative flex justify-center z-10">
            <div className="absolute h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse-glow" aria-hidden />
            <div className="relative animate-float-slow">
              <img 
                src="/images/ZyloxLogoRemoveBG.png" // 👈 اسم دقیق عکس
                alt="Zylox Logo" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* بخش محصولات (فروشگاه) */}
      <div id="products" className="space-y-16 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">فروشگاه Zylox</h2>
          <p className="text-gray-400">محصولات پریمیوم برای گیمینگ و دیسکورد</p>
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

      {/* بقیه بخش‌ها */}
      <section id="why-us" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">چرا Zylox؟</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>

      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">نظرات کاربران</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>

      <section id="rules" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">قوانین</h2>
          <p className="text-gray-400">به زودی...</p>
        </div>
      </section>

      {/* دکمه شناور سبد خرید */}
      {items.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center transition-all hover:scale-110"
        >
          <img src="/images/cart-icon.png" alt="Cart" className="w-8 h-8 object-contain" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {items.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        </button>
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
