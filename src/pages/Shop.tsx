import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";
import { allProducts, type Product } from "./products";
import { CapeModal } from "../components/CapeModal";
import { CartSidebar } from "../components/CartSidebar";
import { useCart } from "../context/CartContext";

const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR') + " تومان";
};

// 👇 کامپوننت دکمه Orb
const OrbButton = ({ 
  variant, 
  onClick, 
  children, 
  ariaLabel = ""
}: { 
  variant: "teal" | "silver" | "mauve" | "red"; 
  onClick: () => void; 
  children: React.ReactNode;
  ariaLabel?: string;
}) => {
  const colorClass = {
    teal: "btn-teal",
    silver: "btn-silver",
    mauve: "btn-mauve",
    red: "btn-red",
  }[variant];

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`orb-btn ${colorClass}`}
    >
      {children}
    </button>
  );
};

export function Shop() {
  const { t, lang } = useLang();
  const [selectedCape, setSelectedCape] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addItem, removeItem, updateQuantity } = useCart();

  const categories = [
    { id: "network", title: "سرویس‌های شبکه / Network" },
    { id: "accounts", title: "اکانت‌های ماینکرفت / Minecraft Accounts" },
    { id: "capes", title: "کیپ‌های ماینکرفت / Minecraft Capes" },
    { id: "donut", title: "سرور دونات / Donut SMP" },
    { id: "discord", title: "دیسکورد / Discord" },
    { id: "other", title: "سایر خدمات / Other Services" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 relative">
      <SectionTitle title={t.shop.title} subtitle={t.shop.subtitle} />

      <div className="space-y-12 pb-24">
        {categories.map((cat) => {
          const catProducts = allProducts.filter(p => p.category === cat.id);
          if (catProducts.length === 0) return null;

          return (
            <div key={cat.id}>
              <h3 className="text-xl font-bold text-white mb-4 border-b border-diamond-border pb-2">
                {cat.title}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catProducts.map((item) => {
                  const cartItem = items.find((i) => i.id === item.id);
                  
                  return (
                    <Card key={item.id} className="flex flex-col relative overflow-hidden group p-3">
                      
                      {item.tag && (
                        <div className="absolute top-0 right-0 bg-diamond-cyan text-diamond-bg text-[9px] font-bold px-2 py-1 rounded-bl-lg z-10 shadow-glow-sm">
                          {item.tag}
                        </div>
                      )}

                      <div className="h-28 w-full flex items-center justify-center bg-[#0a0f1c] rounded-lg mb-3 overflow-hidden border border-white/5 group-hover:border-diamond-cyan/30 transition">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-contain p-1 group-hover:scale-110 transition duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "https://api.dicebear.com/7.x/identicon/svg?seed=" + item.id;
                          }}
                        />
                      </div>
                      
                      <h4 className="text-xs font-semibold text-white flex-1">
                        {lang === "fa" ? item.name : item.nameEn}
                      </h4>
                      
                      <div className="mt-3 flex flex-col gap-2">
                        {item.category === "capes" && (
                          <Button 
                            variant="secondary"
                            onClick={() => setSelectedCape(item)}
                            className="w-full text-[11px] py-1.5 border-white/10 text-white hover:bg-white/5"
                          >
                            {item.no3D ? "🖼️ مشاهده تصویر" : "👁️ مشاهده روی اسکین"}
                          </Button>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-diamond-cyan font-bold text-sm">
                            {formatPrice(item.price)}
                          </span>
                          
                          {cartItem ? (
                            <div className="flex items-center gap-1.5">
                              {/* 👇 دکمه کاهش تعداد (قرمز) */}
                              <OrbButton 
                                variant="red" 
                                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)} 
                                ariaLabel="کاهش تعداد"
                              >
                                <svg viewBox="0 0 24 24">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </OrbButton>

                              {/* تعداد */}
                              <input 
                                type="number"
                                min="1"
                                value={cartItem.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val > 0) updateQuantity(item.id, val);
                                }}
                                className="w-8 h-8 text-center bg-transparent border-none text-white text-sm font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />

                              {/* 👇 دکمه افزایش تعداد (فیروزه‌ای) */}
                              <OrbButton 
                                variant="teal" 
                                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)} 
                                ariaLabel="افزایش تعداد"
                              >
                                <svg viewBox="0 0 24 24">
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </OrbButton>

                              {/* 👇 دکمه حذف (بنفش) */}
                              <OrbButton 
                                variant="mauve" 
                                onClick={() => removeItem(item.id)} 
                                ariaLabel="حذف از سبد"
                              >
                                <svg viewBox="0 0 24 24">
                                  <path d="M5 13 L10 17.5 L19 7"></path>
                                </svg>
                              </OrbButton>
                            </div>
                          ) : (
                            /* 👇 دکمه افزودن به سبد (نقره‌ای) */
                            <OrbButton 
                              variant="silver" 
                              onClick={() => addItem({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                quantity: 1,
                                image: item.image,
                              })} 
                              ariaLabel="افزودن به سبد"
                            >
                              <svg viewBox="0 0 24 24">
                                <path d="M7 17 L17 7 M17 7 L9 7 M17 7 L17 15"></path>
                              </svg>
                            </OrbButton>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 👇 سبد خرید شناور با استایل Orb */}
      {items.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <OrbButton 
            variant="teal" 
            onClick={() => setIsCartOpen(true)} 
            ariaLabel="باز کردن سبد خرید"
          >
            <img src="/images/cart-icon.png" alt="Cart" className="w-6 h-6 object-contain" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </OrbButton>
        </div>
      )}

      <CapeModal 
        isOpen={!!selectedCape} 
        onClose={() => setSelectedCape(null)}
        selectedCape={selectedCape}
      />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
