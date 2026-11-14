import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LinkButton } from "../components/Button";
import { useLang } from "../i18n/LanguageContext";
import { Sidebar } from "../components/Sidebar";
import { ProductList } from "../components/ProductList";
import { allProducts } from "./products";
import { CartSidebar } from "../components/CartSidebar";
import { useCart } from "../context/CartContext";
import { DiscordMessages } from "../components/DiscordMessages";

export function Home() {
  const { t, lang } = useLang();
  const isEnglish = lang === "en";
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const location = useLocation();

  const [discordStats, setDiscordStats] = useState({ totalMembers: 0, onlineMembers: 0, serverName: "", icon: "" });

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(data => {
      if (data.ok) setDiscordStats(data.stats);
    }).catch(() => {});
  }, []);

  const categories = [
    { id: "all", title: "همه" }, { id: "accounts", title: "اکانت ماینکرفت" },
    { id: "capes", title: "کیپ ماینکرفت" }, { id: "network", title: "کانفیگ و نتورک" },
    { id: "discord", title: "دیسکورد" }, { id: "donut", title: "دونات" },
  ];

  return (
    <>
      <Sidebar />
      
      {/* Hero */}
      <section id="top" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-32 grid gap-12 md:grid-cols-2 items-center w-full">
          <div className="space-y-6 z-10">
            <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300">{t.stats.placeholder}</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              <span className="block text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">به Zylox</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600 mt-2">Shop خوش آمدید</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <LinkButton to="/#products">{t.hero.add}</LinkButton>
              <LinkButton to="/#bot" variant="secondary">{t.nav.bot}</LinkButton>
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
      <div id="products" className="space-y-8 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">{isEnglish ? "Zylox Shop" : "فروشگاه Zylox"}</h2>
          <p className="text-gray-400">{isEnglish ? "Premium products" : "محصولات پریمیوم"}</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto gap-2 pb-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition ${activeCategory === cat.id ? "bg-white text-black" : "border border-white/15 text-gray-400 hover:border-white/40 hover:text-white"}`}>
              {cat.title}
            </button>
          ))}
        </div>
        <section className="max-w-7xl mx-auto px-4">
          <ProductList products={activeCategory === "all" ? allProducts : allProducts.filter(p => p.category === activeCategory)} />
        </section>
      </div>

      {/* بخش ربات */}
      <section id="bot" className="py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Diamond BOT</h2>
          <p className="text-gray-400 mb-6">{isEnglish ? "The ultimate Discord bot" : "بهترین ربات دیسکورد"}</p>
          <LinkButton to="/login">{isEnglish ? "Add to Discord" : "افزودن به دیسکورد"}</LinkButton>
        </div>
      </section>

      {/* بخش سرور دیسکورد */}
      <section id="discord" className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">سرور دیسکورد ما</h2>
            <p className="text-gray-400">به جامعه ما بپیوندید، اخبار و تخفیف‌ها را از دست ندهید.</p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            
            {/* سمت چپ: اطلاعات سرور + بخش ویچر (Vouch) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#5865F2]/10 to-transparent pointer-events-none" />
                <img src={discordStats.icon || "/images/ZyloxLogoRemoveBG.png"} alt="Zylox" className="w-24 h-24 mb-4 rounded-3xl bg-black/50 p-4 border border-white/10 shadow-2xl" />
                <h3 className="text-xl font-bold text-white mb-2">{discordStats.serverName || "Zylox Shop"}</h3>
                <p className="text-sm text-gray-400 mb-6">جامعه ما با اخبار، تخفیف‌ها و پشتیبانی</p>
                
                <div className="flex gap-6 mb-6">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-white">{discordStats.totalMembers.toLocaleString("fa-IR")}</span>
                    <span className="text-xs text-gray-500">عضو</span>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-emerald-400">{discordStats.onlineMembers.toLocaleString("fa-IR")}</span>
                    <span className="text-xs text-gray-500">آنلاین</span>
                  </div>
                </div>
                
                <a href="https://discord.gg/aV7Q437hzs" target="_blank" rel="noopener noreferrer" className="w-full max-w-[200px] bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-[#5865F2]/20">
                  عضویت در سرور
                </a>
              </div>

              {/* بخش ویچرها */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-white mb-4">✅ رضایت خریداران (Vouch)</h3>
                <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                  <div className="text-xs text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    "اکانت ماینکرفت فوق‌العاده بود سریع تحویل دادید." <span className="text-gray-500 block mt-1">— Ali</span>
                  </div>
                  <div className="text-xs text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    "کیپ Hero عالی بود ممنون از پشتیبانی." <span className="text-gray-500 block mt-1">— Reza</span>
                  </div>
                  <div className="text-xs text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    "پک کیپ خریدم ارزون تر از همه جا!" <span className="text-gray-500 block mt-1">— Sara</span>
                  </div>
                </div>
              </div>
            </div>

            {/* سمت راست: پیام‌های دیسکورد (بزرگ‌تر) */}
            <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 flex flex-col h-[600px]">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  آخرین اخبار و پیام‌های سرور
                </h3>
                <span className="text-xs text-gray-500">به صورت زنده</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <DiscordMessages />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* بخش نظرات */}
      <section id="reviews" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">نظرات کاربران</h2>
          <p className="text-gray-400 mb-10">تجربه خرید خود را با دیگران به اشتراک بگذارید.</p>
          
          <div className="grid gap-6 md:grid-cols-3 text-right">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-1 text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-300 leading-7">"خیلی سریع تحویل داده شد عالی بود. حتما بازم خرید می‌کنم."</p>
              <p className="text-xs text-gray-500 mt-4">— کاربر: Amir</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-1 text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-300 leading-7">"پشتیبانی خیلی خوبی دارن، تمام سوالاتمو جواب دادن."</p>
              <p className="text-xs text-gray-500 mt-4">— کاربر: Reza</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-1 text-yellow-400 mb-3">⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-300 leading-7">"قیمت‌ها منصفانه است، فقط کمی زمان تحویل طول کشید ولی در کل راضی‌ام."</p>
              <p className="text-xs text-gray-500 mt-4">— کاربر: Sara</p>
            </div>
          </div>
        </div>
      </section>

      {/* بخش پشتیبانی */}
      <section id="support" className="py-20 bg-white/5 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">{isEnglish ? "Support" : "پشتیبانی"}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <a href="https://rubika.ir/Zylox_Shop" target="_blank" rel="noopener noreferrer" className="group block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img src="/images/rubika.png" alt="Rubika" className="w-16 h-16 object-contain mb-4" />
                <span className="text-white font-bold mb-1">Rubika</span>
                <span className="text-xs text-gray-400">@MissMyPime</span>
              </div>
            </a>
            <a href="https://t.me/Zylox_Support" target="_blank" rel="noopener noreferrer" className="group block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img src="/images/TelegramLogo.png" alt="Telegram" className="w-16 h-16 object-contain mb-4" />
                <span className="text-white font-bold mb-1">Telegram</span>
                <span className="text-xs text-gray-400">@Zylox_Support</span>
              </div>
            </a>
            <a href="https://discord.gg/aV7Q437hzs" target="_blank" rel="noopener noreferrer" className="group block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img src="/images/discordllogo.png" alt="Discord" className="w-16 h-16 object-contain mb-4" />
                <span className="text-white font-bold mb-1">Discord</span>
                <span className="text-xs text-gray-400">@realelyas</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {items.length > 0 && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-white hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center transition-all hover:scale-110">
          <img src="/images/cart-icon.png" alt="Cart" className="w-8 h-8 object-contain" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
        </button>
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
