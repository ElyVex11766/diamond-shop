import { useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartSidebar({ isOpen, onClose, items, onRemove, onUpdateQuantity }: Props) {
  const [isCheckout, setIsCheckout] = useState(false);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* پس‌زمینه تاریک */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      
      {/* پنل سبد خرید */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-diamond-panel border-l border-diamond-border shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          {/* هدر */}
          <div className="flex justify-between items-center p-6 border-b border-diamond-border">
            <h2 className="text-xl font-bold text-white">🛒 سبد خرید</h2>
            <button onClick={onClose} className="text-diamond-muted hover:text-white text-2xl">×</button>
          </div>

          {/* لیست آیتم‌ها */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-diamond-muted">سبد خرید شما خالی است.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-diamond-bg p-3 rounded-xl border border-white/5">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 bg-diamond-panel rounded-lg px-2 py-1">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="text-white text-lg">-</button>
                        <span className="text-white text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="text-white text-lg">+</button>
                      </div>
                      <span className="text-diamond-cyan font-bold text-sm">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-300 text-sm self-start">حذف</button>
                </div>
              ))
            )}
          </div>

          {/* فوتر */}
          {items.length > 0 && (
            <div className="p-6 border-t border-diamond-border bg-diamond-bg/50">
              {!isCheckout ? (
                <>
                  <div className="flex justify-between items-center mb-4 text-white font-bold">
                    <span>مبلغ کل:</span>
                    <span className="text-diamond-cyan">{totalPrice.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckout(true)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition"
                  >
                    ادامه خرید
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-diamond-panel p-4 rounded-xl border border-diamond-cyan/30 text-center mb-4">
                    <p className="text-sm text-diamond-muted mb-2">لطفاً مبلغ را به شماره کارت زیر واریز کنید:</p>
                    <div className="text-xl font-mono font-bold text-white tracking-widest mb-1" dir="ltr">6037-6976-2938-7157</div>
                    <p className="text-xs text-diamond-muted mb-3">به نام: جعفری</p>
                    <p className="text-sm text-diamond-cyan font-bold">مبلغ: {totalPrice.toLocaleString('fa-IR')} تومان</p>
                  </div>
                  <p className="text-xs text-yellow-400 text-center mb-4">⏳ زمان پرداخت: ۱:۳۰ دقیقه</p>
                  <button className="w-full py-3 bg-diamond-blue hover:bg-blue-500 text-white rounded-xl font-bold transition">
                    ثبت نهایی سفارش
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
