import { useEffect, useRef, useState } from "react";
import * as skinview3d from "skinview3d";

interface Props {
  username: string;
  capeUrl?: string;
  width?: number;
  height?: number;
}

export function SkinViewer3D({ username, capeUrl, width = 300, height = 400 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<skinview3d.SkinViewer | null>(null);
  const [animation, setAnimation] = useState<"idle" | "walk">("idle");

  useEffect(() => {
    if (!canvasRef.current) return;

    // اگر یوزرنیم خالی بود، استیو بیاد
    const targetUsername = username.trim() === "" ? "Steve" : username;
    const skinUrl = `https://mc-heads.net/skin/${targetUsername}`;

    try {
      // ساخت ویوئر
      const viewer = new skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width: width,
        height: height,
        skin: skinUrl,
      });

      viewerRef.current = viewer;

      // لود کیپ
      if (capeUrl) {
        viewer.loadCape(capeUrl).catch((err) => {
          console.error("خطا در لود کیپ 3D:", err);
        });
      }

      // تنظیمات اولیه
      viewer.autoRotate = false;
      viewer.controls.enableZoom = false; // زوم رو غیر فعال کردیم
      viewer.controls.enableRotate = true;

      return () => {
        viewer.dispose();
      };
    } catch (error) {
      console.log("Error loading 3D viewer:", error);
    }
  }, [username, capeUrl, width, height]);

  const handleAutoRotate = () => {
    if (viewerRef.current) {
      viewerRef.current.autoRotate = !viewerRef.current.autoRotate;
    }
  };

  const handleWalk = () => {
    if (viewerRef.current) {
      viewerRef.current.animation = new skinview3d.WalkingAnimation();
      setAnimation("walk");
    }
  };

  const handleStand = () => {
    if (viewerRef.current) {
      viewerRef.current.animation = new skinview3d.IdleAnimation();
      setAnimation("idle");
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.autoRotate = false;
      viewerRef.current.animation = new skinview3d.IdleAnimation();
      viewerRef.current.camera.position.set(0, 0, 60);
      viewerRef.current.camera.rotation.set(0, 0, 0);
      setAnimation("idle");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* مدل سه بعدی */}
      <div className="flex justify-center items-center bg-[#05070d] rounded-xl p-4 border border-white/5 w-full min-h-[350px]">
        <canvas ref={canvasRef} />
      </div>

      {/* دکمه‌های زیر مدل */}
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        <button 
          onClick={handleAutoRotate} 
          className="bg-[#0a0f1c] border border-white/10 hover:border-diamond-cyan/50 text-white text-xs font-semibold py-2 rounded-lg transition"
        >
          Auto rotate
        </button>
        <button 
          onClick={handleWalk} 
          className="bg-[#0a0f1c] border border-white/10 hover:border-diamond-cyan/50 text-white text-xs font-semibold py-2 rounded-lg transition"
        >
          Walk
        </button>
        <button 
          onClick={handleStand} 
          className="bg-[#0a0f1c] border border-white/10 hover:border-diamond-cyan/50 text-white text-xs font-semibold py-2 rounded-lg transition"
        >
          Stand
        </button>
        <button 
          onClick={handleReset} 
          className="bg-[#0a0f1c] border border-white/10 hover:border-diamond-cyan/50 text-white text-xs font-semibold py-2 rounded-lg transition"
        >
          Reset view
        </button>
      </div>
      <p className="text-xs text-diamond-muted text-center mt-4">Drag to turn.</p>
    </div>
  );
}