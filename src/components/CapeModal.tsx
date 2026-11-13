import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import type { Product } from "../pages/products";
import { useLang } from "../i18n/LanguageContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCape: Product | null;
}

export function CapeModal({ isOpen, onClose, selectedCape }: Props) {
  const { lang } = useLang();
  const isEnglish = lang === "en";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState<"idle" | "walk" | "run" | "elytra">("idle");
  const [autoRotate, setAutoRotate] = useState(true);
  const [username, setUsername] = useState("ItzRealElyas");
  const [submittedUser, setSubmittedUser] = useState("ItzRealElyas");

  // 👇 متن‌های ترجمه شده
  const text = {
    stand: isEnglish ? "Stand" : "ایستاده",
    walk: isEnglish ? "Walk" : "راه رفتن",
    run: isEnglish ? "Run" : "دویدن",
    elytra: isEnglish ? "Elytra" : "الایترا",
    rotate: isEnglish ? "Rotate" : "چرخش",
    stop: isEnglish ? "Stop" : "توقف",
    close: isEnglish ? "Close" : "بستن",
    loading: isEnglish ? "Loading..." : "در حال بارگذاری...",
    usernamePlaceholder: isEnglish ? "Enter Minecraft username" : "نام کاربری ماینکرفت",
  };

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

        const viewer = new skinview3d.SkinViewer({
          width,
          height,
          skin: `https://mc-heads.net/skin/${submittedUser}`,
        });

        viewerRef.current = viewer;

        if (selectedCape.capeTexture) {
          viewer.loadCape(selectedCape.capeTexture).catch(() => {});
        }

        viewer.controls.enableRotate = true;
        viewer.controls.enableZoom = false;
        viewer.autoRotate = true;
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
  }, [isOpen, selectedCape, submittedUser]);

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
        // 👇 انیمیشن دویدن اصلاح شد (سرعت و حالت عادی)
        const runAnim = new skinview3d.RunningAnimation();
        runAnim.speed = 1; // سرعت عادی
        viewerRef.current.animation = runAnim;
        break;
      case "elytra":
        // 👇 برای شبیه‌سازی الایترا، فعلاً ایستاده می‌مونه
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

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSubmittedUser(username.trim());
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

        {/* 👇 فرم نام کاربری */}
        <form onSubmit={handleUserSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={text.usernamePlaceholder}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
          <Button type="submit" variant="secondary" className="text-xs px-4">
            {isEnglish ? "Load" : "لود"}
          </Button>
        </form>

        {selectedCape.no3D ? (
          <div className="flex items-center justify-center bg-[#050505] rounded-2xl border border-white/5 p-8 mb-6">
            <img
              src={selectedCape.image}
              alt={selectedCape.name}
              className="max-h-72 object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-6">
            
            {/* 👇 دکمه Rotate (بالا) */}
            <div className="flex justify-end px-2">
               <button
                onClick={toggleRotate}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  autoRotate ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                {text.rotate}
              </button>
            </div>

            {/* 👇 مدل سه بعدی + دکمه الایترا */}
            <div className="relative bg-[#050505] rounded-2xl border border-white/5 p-4 min-h-[350px] flex items-center justify-center">
              {loading && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs text-gray-500">{text.loading}</span>
                </div>
              )}
              <div ref={containerRef} className="w-full flex items-center justify-center" />
              
              {/* 👇 دکمه Elytra (سمت چپ اسکین) */}
              <button
                onClick={() => handleAnimationChange("elytra")}
                className={`absolute top-4 left-4 w-12 h-12 rounded-xl border transition flex items-center justify-center ${
                  animation === "elytra" ? "bg-white border-white" : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
                title={text.elytra}
              >
                <img src="/images/elytra.png" alt="Elytra" className="w-8 h-8 object-contain" />
              </button>
            </div>

            {/* 👇 دکمه‌های اصلی (پایین) */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleAnimationChange("idle")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  animation === "idle" ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                {text.stand}
              </button>
              <button
                onClick={() => handleAnimationChange("walk")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  animation === "walk" ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                {text.walk}
              </button>
              <button
                onClick={() => handleAnimationChange("run")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  animation === "run" ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                }`}
              >
                {text.run}
              </button>
              
              {/* 👇 دکمه Stop (وسط) */}
              <button
                onClick={() => {
                  if (viewerRef.current) {
                    viewerRef.current.autoRotate = false;
                    setAutoRotate(false);
                    handleAnimationChange("idle");
                  }
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-white/10 bg-white/5 text-gray-400 hover:border-white/30 transition"
              >
                {text.stop}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-black text-white">
            {selectedCape.price.toLocaleString(isEnglish ? "en-US" : "fa-IR")} {isEnglish ? "Toman" : "تومان"}
          </span>
          <Button variant="secondary" onClick={onClose}>
            {text.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
