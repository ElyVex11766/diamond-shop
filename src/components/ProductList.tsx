import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { type Product } from "../pages/products";
import { useCart } from "../context/CartContext";
import { CapeModal } from "./CapeModal";
import { useLang } from "../i18n/LanguageContext";

const formatPrice = (price: number, isEnglish: boolean) => {
  return isEnglish ? `${price.toLocaleString("en-US")}` : price.toLocaleString("fa-IR") + " تومان";
};

interface Props {
  products: Product[];
}

export function ProductList({ products }: Props) {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const { lang } = useLang();
  const isEnglish = lang === "en";
  const [selectedCape, setSelectedCape] = useState<Product | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((item) => {
          const cartItem = items.find((i) => i.id === item.id);

          return (
            <div
              key={item.id}
              className="product-card-frame flex flex-col relative overflow-hidden group p-3 rounded-2xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,255,255,0.06)] hover:border-white/25"
            >
              {item.tag && (
                <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-bold px-2 py-1 rounded-bl-lg z-10">
                  {item.tag}
                </div>
              )}

              <div className="h-28 w-full flex items-center justify-center bg-[#050505] rounded-lg mb-3 overflow-hidden border border-white/5 group-hover:border-white/20 transition">
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
                {item.name}
              </h4>

              <div className="mt-3 flex flex-col gap-2">
                {item.category === "capes" && (
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedCape(item)}
                    className="w-full text-[11px] py-1.5"
                  >
                    {item.no3D ? (isEnglish ? "View image" : "مشاهده تصویر") : (isEnglish ? "View on skin" : "مشاهده روی اسکین")}
                  </Button>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-white font-bold text-sm">
                    {formatPrice(item.price, isEnglish)}
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
                        className="w-10 h-7 text-center bg-transparent border-none text-white text-sm font-bold focus:outline-none"
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
                      className="text-[11px] px-4 py-2 h-9 bg-white text-black hover:bg-gray-200 border-none font-bold rounded-xl"
                    >
                      {isEnglish ? "Add to cart" : "افزودن به سبد"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CapeModal
        isOpen={!!selectedCape}
        onClose={() => setSelectedCape(null)}
        selectedCape={selectedCape}
      />
    </>
  );
}
