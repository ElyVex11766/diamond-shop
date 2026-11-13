import { useCart } from "../context/CartContext";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`} dir="rtl">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">🛒 سبد خرید</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500">سبد خرید شما خالی است.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white text-lg">-</button>
                        <span className="text-white text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white text-lg">+</button>
                      </div>
                      <span className="text-white font-bold text-sm">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-sm self-start">حذف</button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="flex justify-between items-center mb-4 text-white font-bold">
                <span>مبلغ کل:</span>
                <span className="text-diamond-cyan">{totalPrice.toLocaleString('fa-IR')} تومان</span>
              </div>
              <Button onClick={() => { onClose(); navigate("/checkout"); }} className="w-full py-3 bg-white text-black hover:bg-gray-200">
                ادامه خرید
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
