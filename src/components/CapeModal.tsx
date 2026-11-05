import { useState, useEffect } from "react";
import { SkinViewer3D } from "./SkinViewer3D";
import { Button } from "./Button";
import { type Product } from "../pages/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCape: Product | null;
}

export function CapeModal({ isOpen, onClose, selectedCape }: Props) {
  const [username, setUsername] = useState("");
  const [submittedUser, setSubmittedUser] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setSubmittedUser("");
    }
  }, [isOpen]);

  if (!isOpen || !selectedCape) return null;

  const isNo3D = selectedCape.no3D === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-diamond-panel border border-diamond-border rounded-2xl p-6 shadow-glow">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-diamond-muted hover:text-white text-2xl z-10">×</button>
        
        <h3 className="text-xl font-bold text-white mb-2 text-center">
          {isNo3D ? `کیپ ${selectedCape.name}` : `مشاهده ${selectedCape.name} روی اسکین شما`}
        </h3>

        {isNo3D ? (
          <div className="flex flex-col items-center mt-6">
            <div className="bg-[#05070d] border border-diamond-cyan/30 rounded-xl p-4 mb-6 w-full flex justify-center shadow-glow-sm relative">
               <div className="absolute -top-3 bg-diamond-cyan text-diamond-bg text-xs font-bold px-3 py-1 rounded-full">
                  تصویر اختصاصی
               </div>
               <img 
                 src={selectedCape.image} 
                 alt={selectedCape.name} 
                 className="max-h-[250px] object-contain animate-float-slow drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
               />
            </div>
            <p className="text-diamond-muted text-sm text-center mb-6">
              پیش‌نمایش سه‌بعدی برای این کیپ در دسترس نیست.
            </p>
            <Button onClick={onClose} variant="secondary" className="w-full">بستن</Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4 mt-4">
              <input 
                type="text" 
                placeholder="نام کاربری (خالی = استیو)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-diamond-bg border border-diamond-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-diamond-cyan"
              />
              <Button onClick={() => setSubmittedUser(username)} className="px-4">تایید</Button>
            </div>
            
            <SkinViewer3D 
              username={submittedUser} 
              capeUrl={selectedCape.capeTexture || selectedCape.image} 
            />
          </>
        )}
      </div>
    </div>
  );
}