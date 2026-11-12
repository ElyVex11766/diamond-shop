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
  const [loading, setLoading] = useState(true);

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
    let viewer: any = null;
    let cancelled = false;

    (async () => {
      try {
        const skinview3d = await import("skinview3d");
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";
        const width = containerRef.current.clientWidth;
        const height = 400;
        viewer = new skinview3d.SkinViewer({
          width,
          height,
          skin: "https://assets.mojang.com/SkinTemplate/steve.png",
        });
        viewer.loadCape(selectedCape.capeTexture!);
        viewer.controls.enableRotate = true;
        viewer.controls.enableZoom = false;
        viewer.animation = new skinview3d.WalkingAnimation();
        viewer.animation.speed = 0.5;
        containerRef.current.appendChild(viewer.canvas);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (viewer?.dispose) viewer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [isOpen, selectedCape]);

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
          <div className="relative bg-[#050505] rounded-2xl border border-white/5 p-4 mb-6 min-h-[400px] flex items-center justify-center">
            {loading && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-xs text-gray-500">در حال بارگذاری...</span>
              </div>
            )}
            <div ref={containerRef} className="w-full flex items-center justify-center" />
            <img
              src="/images/3Dskin.png"
              alt="پیش‌نمایش اسکین"
              className="absolute bottom-3 right-3 h-16 w-16 rounded-xl border border-white/15 bg-black/60 object-contain p-1 shadow-lg"
              onError={(event) => { event.currentTarget.style.display = "none"; }}
            />
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
