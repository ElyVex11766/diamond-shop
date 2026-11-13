import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import type { Product } from "../pages/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCape: Product | null;
}

export function CapeModal({ isOpen, onClose, selectedCape }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState<"idle" | "walk" | "run" | "elytra">("idle");
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !selectedCape?.capeTexture || selectedCape.no3D) return;
    let cancelled = false;

    (async () => {
      try {
        const skinview3d = await import("skinview3d");
        if (cancelled || !containerRef.current) return;
        
        containerRef.current.innerHTML = "";
        const width = containerRef.current.clientWidth;
        const height = 400;

        // 👇 اسکین پیش‌فرض رو به ItzRealElyas تغییر دادم
        const viewer = new skinview3d.SkinViewer({
          width,
          height,
          skin: `https://mc-heads.net/skin/ItzRealElyas`, 
        });

        viewerRef.current = viewer;

        if (selectedCape.capeTexture) {
          viewer.loadCape(selectedCape.capeTexture).catch(() => {});
        }

        viewer.controls.enableRotate = true;
        viewer.controls.enableZoom = false;
        viewer.autoRotate = true;

        // 👇 تنظیم انیمیشن اولیه (ایستاده)
        viewer.animation = new skinview3d.IdleAnimation();
        
        containerRef.current.appendChild(viewer.canvas);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (viewerRef.current?.dispose) viewerRef.current.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [isOpen, selectedCape]);

  // 👇 تابع تغییر انیمیشن
  const handleAnimationChange = async (type: "idle" | "walk" | "run" | "elytra") => {
    if (!viewerRef.current) return;
    const skinview3d = await import("skinview3d");
    
    setAnimation(type);
    switch (type) {
      case "idle":
        viewerRef.current.animation = new skinview3d.IdleAnimation();
        break;
      case "walk":
        viewerRef.current.animation = new skinview3d.WalkingAnimation();
        break;
      case "run":
        viewerRef.current.animation = new skinview3d.RunningAnimation();
        break;
      case "elytra":
        // اگه انیمیشن الایترا توی کتابخانه بود، اینجا ست می‌شه (معمولاً به صورت دستی)
        viewerRef.current.animation = new skinview3d.IdleAnimation();
        break;
    }
  };

  const toggleRotate = () => {
    if (viewerRef.current) {
      viewerRef.current.autoRotate = !viewerRef.current.autoRotate;
      setAutoRotate(viewerRef.current.autoRotate);
    }
  };

  if (!isOpen || !selectedCape) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-scale-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0a0a0a] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/40 transition flex items-center justify-center"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-white mb-1">{selectedCape.name}</h3>
        <p className="text-sm text-gray-500 mb-6">{selectedCape.nameEn}</p>

        {selectedCape.no3D ? (
          <div className="flex items-center justify-center bg-[#050505] rounded-2xl border border-white/5 p-8 mb-6">
            <img
              src={selectedCape.image}
              alt={selectedCape.name}
              className="max-h-72 object-contain"
            />
          </div>
        ) : (
          <div className="relative flex gap-4 mb-6">
            {/* 👇 دکمه‌های کنترل سمت چپ */}
            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={() => handleAnimationChange("idle")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  animation === "idle" ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                Stand
              </button>
              <button
                onClick={() => handleAnimationChange("walk")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  animation === "walk" ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                Walk
              </button>
              <button
                onClick={() => handleAnimationChange("run")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  animation === "run" ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                Run
              </button>
              
              {/* 👇 دکمه Elytra با عکس خودت */}
              <button
                onClick={() => handleAnimationChange("elytra")}
                className={`px-2 py-1.5 rounded-lg border transition flex items-center justify-center ${
                  animation === "elytra" ? "bg-white border-white" : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <img src="/images/elytra.png" alt="Elytra" className="w-6 h-6 object-contain" />
              </button>

              <button
                onClick={toggleRotate}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 bg-white/5 text-gray-400 hover:border-white/30 transition"
              >
                {autoRotate ? "Stop" : "Rotate"}
              </button>
            </div>

            {/* 👇 مدل سه بعدی */}
            <div className="flex-1 relative bg-[#050505] rounded-2xl border border-white/5 p-4 min-h-[400px] flex items-center justify-center">
              {loading && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs text-gray-500">در حال بارگذاری...</span>
                </div>
              )}
              <div ref={containerRef} className="w-full flex items-center justify-center" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-white">
            {selectedCape.price.toLocaleString("fa-IR")} تومان
          </span>
          <Button variant="secondary" onClick={onClose}>
            بستن
          </Button>
        </div>
      </div>
    </div>
  );
}
