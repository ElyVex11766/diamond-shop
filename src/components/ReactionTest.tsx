import { useState, useEffect, useRef } from "react";
import { Button } from "./Button";

const WORKER_URL = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev";

interface LeaderboardEntry {
  id: string;
  name: string;
  contact: string;
  time: number;
  created_at: string;
}

export function ReactionTest() {
  const [step, setStep] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState("discord");
  const [result, setResult] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [remainingPlays, setRemainingPlays] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${WORKER_URL}/api/leaderboard`);
      const data = await res.json();
      if (data.ok) setLeaderboard(data.entries);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const startTest = async () => {
    if (!name.trim()) {
      setErrorMsg("لطفاً نام یا آیدی خود را وارد کنید.");
      return;
    }

    // 👇 چک کردن محدودیت ۵ بار در روز
    try {
      const res = await fetch(`${WORKER_URL}/api/check-limit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), contact: contactType }),
      });
      const data = await res.json();

      if (!data.ok) {
        setErrorMsg(data.error || "خطا در چک کردن محدودیت");
        return;
      }

      if (data.remaining <= 0) {
        setErrorMsg("⛔ شما امروز ۵ بار تست داده‌اید. فردا دوباره تلاش کنید!");
        return;
      }

      setRemainingPlays(data.remaining);
    } catch (err) {
      console.error("Error checking limit:", err);
      setErrorMsg("خطا در ارتباط با سرور");
      return;
    }

    setErrorMsg("");
    setStep("waiting");
    
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;
    timerRef.current = setTimeout(() => {
      setStep("ready");
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleClickReady = async () => {
    if (step === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setErrorMsg("⚠️ خیلی زود زدی! صبر کن تا صفحه سبز بشه.");
      setStep("idle");
      return;
    }

    if (step === "ready") {
      const reactionTime = Date.now() - startTimeRef.current;
      setResult(reactionTime);
      setStep("result");

      try {
        await fetch(`${WORKER_URL}/api/leaderboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            contact: contactType,
            time: reactionTime,
          }),
        });
        await fetchLeaderboard();
        
        // آپدیت تعداد بازی‌های باقی‌مانده
        if (remainingPlays !== null && remainingPlays > 0) {
          setRemainingPlays(remainingPlays - 1);
        }
      } catch (err) {
        console.error("Error saving score:", err);
      }
    }
  };

  const resetGame = () => {
    setStep("idle");
    setResult(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 relative z-20">
      {step === "idle" && (
        <div className="bg-diamond-panel border border-diamond-border rounded-xl p-6 text-center relative z-20">
          <h3 className="text-xl font-bold text-white mb-2">🏆 تست سرعت واکنش</h3>
          <p className="text-sm text-diamond-muted mb-6">برای شرکت در مسابقه، اطلاعات خود را وارد کنید.</p>
          <div className="space-y-4">
            <div className="flex gap-2">
              <select value={contactType} onChange={(e) => setContactType(e.target.value)} className="w-1/3 bg-diamond-bg border border-diamond-border rounded-lg px-2 py-3 text-white focus:outline-none focus:border-diamond-cyan text-sm relative z-30">
                <option value="discord">دیسکورد</option>
                <option value="telegram">تلگرام</option>
                <option value="rubika">روبیکا</option>
              </select>
              <input type="text" placeholder="آیدی خود را وارد کنید" value={name} onChange={(e) => setName(e.target.value)} className="w-2/3 bg-diamond-bg border border-diamond-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-diamond-cyan text-center font-bold relative z-30" />
            </div>
            {remainingPlays !== null && (
              <p className="text-xs text-diamond-cyan font-bold">
                بازی‌های باقی‌مانده امروز: {remainingPlays} از ۵
              </p>
            )}
            {errorMsg && <p className="text-red-400 text-sm relative z-30">{errorMsg}</p>}
            <Button onClick={startTest} className="w-full py-3 relative z-30">شروع تست</Button>
          </div>
        </div>
      )}

      {(step === "waiting" || step === "ready") && (
        <div onClick={handleClickReady} className={`w-full h-64 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-200 select-none relative z-20 ${step === "waiting" ? "bg-red-500/20 border-2 border-red-500" : "bg-emerald-500/80 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]"}`}>
          <span className="text-2xl font-extrabold text-white pointer-events-none">{step === "waiting" ? "منتظر بمان..." : "الان کلیک کن!"}</span>
        </div>
      )}

      {step === "result" && (
        <div className="bg-diamond-panel border border-diamond-cyan/30 rounded-xl p-6 text-center relative z-20">
          <h3 className="text-xl font-bold text-white mb-2">⚡ زمان واکنش شما:</h3>
          <div className="text-5xl font-extrabold text-diamond-cyan mb-4">{result} <span className="text-xl">ms</span></div>
          <div className="flex gap-3 justify-center">
            <Button onClick={resetGame} variant="secondary" className="px-6">تلاش دوباره</Button>
          </div>
        </div>
      )}

      {/* 🏆 لیدربورد هفتگی (با جایزه) */}
      <div className="bg-diamond-panel border border-diamond-border rounded-xl p-6 relative z-20 mt-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3 text-center">🏆 جوایز هفته</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">🥇</div>
              <div className="text-[10px] text-yellow-400 font-bold mb-1">نفر اول</div>
              <div className="text-xs text-white font-bold">کیپ Builder</div>
            </div>
            <div className="bg-gray-400/10 border border-gray-400/30 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">🥈</div>
              <div className="text-[10px] text-gray-300 font-bold mb-1">نفر دوم</div>
              <div className="text-xs text-white font-bold">کیپ Optifine</div>
            </div>
            <div className="bg-amber-700/10 border border-amber-700/30 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">🥉
