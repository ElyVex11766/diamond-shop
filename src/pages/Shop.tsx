import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";
import { allProducts, type Product } from "./products";
import { CapeModal } from "../components/CapeModal";
import { CartSidebar } from "../components/CartSidebar";
import { useCart } from "../context/CartContext";

const formatPrice = (price: number, isEnglish: boolean) => {
  return isEnglish ? `${price.toLocaleString("en-US")}` : price.toLocaleString("fa-IR") + " تومان";
};

export function Shop() {
  const { t, lang } = useLang();
  const isEnglish = lang === "en";
  const [selectedCape, setSelectedCape] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addItem, removeItem, updateQuantity } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", title: isEnglish ? "All" : "همه" },
    { id: "accounts", title: "اکانت‌های ماینکرفت" },
    { id: "capes", title: "کیپ‌های ماینکرفت" },
    { id: "network", title: "سرویس‌های شبکه" },
    { id: "donut", title: "سرور دونات" },
    { id: "discord", title: "خدمات دیسکورد" },
    { id: "other", title: "سایر خدمات" },
  ];

  // منطق فیلتر کردن
  const filterProducts = () => {
    let filtered = allProducts;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q)
      );
    } else if (activeCategory !== "all") {
      filtered = allProducts.filter((p) => p.category === activeCategory);
    }

    return filtered;
  };

  const filteredProducts = filterProducts();
  const isSearching = searchQuery.trim() !== "";

  // گروه‌بندی محصولات برای حالت عادی
  const groupedProducts = () => {
    if (isSearching || activeCategory !== "all") {
      return [{ id: "filtered", title: isSearching ? (isEnglish ? "Search results" : "نتایج جستجو") : categories.find(c => c.id === activeCategory)?.title || "", products: filteredProducts }];
    }
    return categories
      .filter((c) => c.id !== "all")
      .map((c) => ({
        ...c,
        products: allProducts.filter((p) => p.category === c.id),
      }))
      .filter((c) => c.products.length > 0);
  };

  const displayGroups = groupedProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 relative">
      <SectionTitle title={t.shop.title} subtitle={t.shop.subtitle} />

      {/* نوار جستجو */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isEnglish ? "Search products..." : "جستجوی محصول..."}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30 transition"
        />
      </div>

      {/* دکمه‌های دسته‌بندی */}
      <div className="flex overflow-x-auto gap-2 mb-10 pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              if (cat.id !== "all") setSearchQuery(""); // اگر دسته بندی انتخاب شد، جستجو پاک شود
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeCategory === cat.id && !isSearching
                ? "bg-white text-black"
                : "border border-white/15 text-gray-400 hover:border-white/40 hover:text-white"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* نمایش محصولات */}
      {displayGroups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {isEnglish ? "No products found" : "محصولی یافت نشد"}
          </p>
        </div>
      ) : (
        <div className="space-y-16 pb-24">
          {displayGroups.map((group) => (
            <div key={group.id}>
              <div className="mb-6 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold text-white">{group.title}</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.products.map((item) => {
                  const cartItem = items.find((i) => i.id === item.id);

                  return (
                    <div
                      key={item.id}
                      className="product-card-frame flex flex-col relative overflow-hidden group p-3 rounded-2xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,255,255,0.06)] hover:border-white/25 border border-white/5"
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
                        {isEnglish ? item.nameEn : item.name}
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
            </div>
          ))}
        </div>
      )}

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
