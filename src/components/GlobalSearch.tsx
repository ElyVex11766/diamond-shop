import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allProducts } from "../pages/products";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // بستن منو وقتی بیرون کلیک شد
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // فیلتر کردن محصولات
  const filteredProducts = query.trim().length > 0
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5) // فقط ۵ مورد اول
    : [];

  const handleSelect = (productId: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/?q=${productId}#products`); // میره به محصولات و سرچ میکنه
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm hidden md:block">
      <div className="relative">
        <input
          type="text"
          placeholder="جستجوی محصول..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white/30 transition pr-10"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {/* لیست پیشنهادات */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden z-[100]">
          {filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">محصولی یافت نشد</div>
          ) : (
            filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition text-right border-b border-white/5 last:border-0"
              >
                <img src={p.image} alt={p.name} className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.src = "https://api.dicebear.com/7.x/identicon/svg?seed=" + p.id} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{p.name}</p>
                  <p className="text-[10px] text-gray-500">{p.price.toLocaleString("fa-IR")} تومان</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
