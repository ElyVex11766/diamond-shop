import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";
import { allProducts, type Product } from "./products";
import { CapeModal } from "../components/CapeModal";
import { CheckoutModal } from "../components/CheckoutModal";
import { Tabs } from "../components/Tabs"; // 👈 اضافه شد

const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR') + " تومان";
};

export function Shop() {
  const { t, lang } = useLang();
  const [selectedCape, setSelectedCape] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  
  // 👈 استیت برای تب فعال
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", title: "همه / All" },
    { id: "network", title: "شبکه / Network" },
    { id: "accounts", title: "اکانت‌ها / Accounts" },
    { id: "capes", title: "کیپ‌ها / Capes" },
    { id: "donut", title: "دونات / Donut" },
    { id: "discord", title: "دیسکورد / Discord" },
    { id: "other", title: "سایر / Other" },
  ];

  // فیلتر محصولات بر اساس تب فعال
  const filteredProducts = allProducts.filter(p => 
    activeCategory === "all" ? true : p.category === activeCategory
  );

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <SectionTitle title={t.shop.title} subtitle={t.shop.subtitle} />
      
      {/* تب‌ها */}
      <div className="flex justify-center mb-10">
        <Tabs 
          tabs={categories} 
          activeTab={activeCategory} 
          onChange={setActiveCategory} 
        />
      </div>

      {/* نمایش محصولات */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-diamond-muted py-10">
            محصولی در این دسته یافت نشد.
          </div>
        ) : (
          filteredProducts.map((item) => (
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
                {/* دکمه مشاهده روی اسکین (بالا) */}
                {item.category === "capes" && (
                  <Button 
                    variant="secondary"
                    onClick={() => setSelectedCape(item)}
                    className="w-full text-[11px] py-1.5 border-white/10 text-white hover:bg-white/5"
                  >
                    {item.no3D ? "🖼️ مشاهده تصویر" : "👁️ مشاهده روی اسکین"}
                  </Button>
                )}

                {/* قیمت و دکمه خرید (پایین) */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-diamond-cyan font-bold text-sm">
                    {formatPrice(item.price)}
                  </span>
                  <Button 
                    onClick={() => setCheckoutProduct(item)}
                    className="text-[10px] px-3 py-1.5 h-8 bg-emerald-600 hover:bg-emerald-500 text-white border-none font-bold transition-colors"
                  >
                    خرید این محصول
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* مودال‌ها */}
      <CapeModal 
        isOpen={!!selectedCape} 
        onClose={() => setSelectedCape(null)}
        selectedCape={selectedCape}
      />

      <CheckoutModal 
        isOpen={!!checkoutProduct} 
        onClose={() => setCheckoutProduct(null)} 
        product={checkoutProduct} 
      />
    </div>
  );
}
