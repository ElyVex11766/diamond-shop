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

export function Shop() {
  const { t, lang } = useLang();
  const [selectedCape, setSelectedCape] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addItem, removeItem, updateQuantity } = useCart();

  const categories = [
    { id: "accounts", title: "اکانت‌های ماینکرفت", subtitle: "اکانت‌های فول اکسس و NFA" },
    { id: "capes", title: "کیپ‌های ماینکرفت", subtitle: "کیپ‌های کمیاب و خاص" },
    { id: "network", title: "سرویس‌های شبکه", subtitle: "کانفیگ‌های V2Ray و VPN" },
    { id: "donut", title: "سرور دونات", subtitle: "پول و آیتم‌های Donut SMP" },
    { id: "discord", title: "خدمات دیسکورد", subtitle: "ربات، سرور و بوست" },
    { id: "other", title: "سایر خدمات", subtitle: "اسکین، فوتوشاپ و..." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 relative">
      <SectionTitle title={t.shop.title} subtitle={t.shop.subtitle} />

      <div className="space-y-16 pb-24">
        {categories.map((cat) => {
          const catProducts = allProducts.filter(p => p.category === cat.id);
          if (catProducts.length === 0) return null;

          return (
            <div key={cat.id}>
              <div className="mb-6 border-b border-white/8 pb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.subtitle}</p>
                </div>
                <span className="text-xs text-gray-600">{catProducts.length} محصول</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catProducts.map((item) => {
                  const cartItem = items.find((i) => i.id === item.id);

                  return (
                    <Card key={item.id} className="flex flex-col relative overflow-hidden group p-3">
                      {item.tag && (
                        <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-bold px-2.5 py-1 rounded-bl-lg z-10">
                          {item.tag}
                        </div>
                      )}

                      <div className="h-28 w-full flex items-center justify-center bg-[#050505] rounded-xl mb-3 overflow-hidden border border-white/5 group-hover:border-white/20 transition">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1 group-hover:scale-110 transition duration-500"
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
                            className="w-full text-[11px] py-1.5"
                          >
                            {item.no3D ? "🖼️ مشاهده تصویر" : "👁️ مشاهده روی اسکین"}
                          </Button>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-white font-bold text-sm">
                            {formatPrice(item.price)}
                          </span>

                          {cartItem ? (
                            <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-1.5 border border-white/10">
                              <button
                                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-white bg-white/10 hover:bg-red-500/30 rounded-lg transition-colors text-lg font-bold"
                              >
                                -
                              </button>
                              <input
                                type="text"
                                inputMode="numeric"
                                defaultValue={cartItem.quantity}
                                key={`${item.id}-${cartItem.quantity}`}
                                onBlur={(e) => {
                                  const val = Number.parseInt(e.currentTarget.value, 10);
                                  if (Number.isFinite(val) && val > 0) updateQuantity(item.id, val);
                                  else e.currentTarget.value = String(cartItem.quantity);
                                }}
                                className="w-10 h-7 text-center bg-transparent border-none text-white text-sm font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-white bg-white/10 hover:bg-emerald-500/30 rounded-lg transition-colors text-lg font-bold"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-7 h-7 flex items-center justify-center text-red-400 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors text-sm"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addItem({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                quantity: 1,
                                image: item.image,
                              })}
                              className="text-[11px] px-4 py-2 h-9 bg-white text-black hover:bg-gray-200 border-none font-bold rounded-xl transition-all hover:scale-105"
                            >
                              افزودن به سبد
                            </Button>
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
