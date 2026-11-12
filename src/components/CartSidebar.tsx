import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLang } from "../i18n/LanguageContext";

const formatPrice = (price: number, isEnglish: boolean) => isEnglish ? `${price.toLocaleString("en-US")}` : price.toLocaleString("fa-IR") + " تومان";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();
  const { lang } = useLang();
  const isEnglish = lang === "en";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="absolute top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{isEnglish ? "Shopping Cart" : "سبد خرید"}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/40 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
            <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center text-2xl">
              <img src="/images/ShoppingCard.png" alt="سبد خرید خالی" className="h-9 w-9 object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} />
            </div>
            <p className="text-sm">{isEnglish ? "Your cart is empty" : "سبد خرید شما خالی است"}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3"
                >
                  <div className="w-16 h-16 rounded-lg bg-[#050505] border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price, isEnglish)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white/8 hover:bg-white/15 text-white text-sm font-bold flex items-center justify-center transition"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold text-white w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white/8 hover:bg-white/15 text-white text-sm font-bold flex items-center justify-center transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-400 hover:text-red-300 ml-auto"
                      >
                        {isEnglish ? "Remove" : "حذف"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{isEnglish ? "Total" : "مجموع"}</span>
                <span className="text-xl font-black text-white">{formatPrice(total, isEnglish)}</span>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onClose();
                  const isLoggedIn = Boolean(localStorage.getItem("diamond_user"));
                  if (isLoggedIn) {
                    navigate("/checkout");
                  } else {
                    localStorage.setItem("diamond_checkout_pending", "true");
                    navigate("/login?redirect=/checkout");
                  }
                }}
              >
                {isEnglish ? "Continue to checkout" : "ادامه سفارش"}
              </Button>
              <button
                onClick={clearCart}
                className="w-full text-xs text-gray-500 hover:text-red-400 transition"
              >
                {isEnglish ? "Clear cart" : "پاک کردن سبد"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
