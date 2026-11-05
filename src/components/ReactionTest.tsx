import { useState, useEffect, useRef } from "react";
import { Button } from "./Button";

// اینترفیس برای رکوردهای لیدربورد
interface LeaderboardEntry {
  userId: string;
  name: string;
  contact: string; // پلتفرم ارتباطی
  time: number;
  date: string;
}

// اینترفیس برای ذخیره اطلاعات کاربر (کد و تعداد بازی امروز)
interface UserSession {
  userId: string;
  dailyPlays: number;
  lastPlayDate: string;
}

export function ReactionTest() {
  const [step, setStep] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState("discord");
  const [result, setResult] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // ۱. لود کردن اطلاعات کاربر و لیدربورد
  useEffect(() => {
    let session: UserSession;
    const savedSession = localStorage.getItem("diamond_user_session");
    
    if (savedSession) {
      session = JSON.parse(savedSession);
    } else {
      session = {
        userId: "user_" + Math.random().toString(36).substr(2, 9),
        dailyPlays: 0,
        lastPlayDate: new Date().toDateString(),
      };
      localStorage.setItem("diamond_user_session", JSON.stringify(session));
    }

    const today = new Date().toDateString();
    if (session.lastPlayDate !== today) {
      session.dailyPlays = 0;
      session.lastPlayDate = today;
      localStorage.setItem("diamond_user_session", JSON.stringify(session));
    }

    setUserSession(session);

    // لود کردن لیدربورد
    const savedLb = localStorage.getItem("diamond_reaction_lb");
    if (savedLb) {
      try {
        const parsed = JSON.parse(savedLb);
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const lastReset = localStorage.getItem("diamond_reaction_reset");
        
        if (lastReset && Date.now() - parseInt(lastReset) > oneWeek) {
          localStorage.removeItem("diamond_reaction_lb");
          localStorage.setItem("diamond_reaction_reset", Date.now().toString());
          setLeaderboard([]);
        } else {
          setLeaderboard(parsed);
          if (!lastReset) localStorage.setItem("diamond_reaction_reset", Date.now().toString());
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("diamond_reaction_reset", Date.now().toString());
    }
  }, []);

  // ۲. شروع تست
  const startTest = () => {
    if (!name.trim()) {
      setErrorMsg("لطفاً آیدی خود را وارد کنید.");
      return;
    }

    if (userSession && userSession.dailyPlays >= 5) {
      setErrorMsg("⛔ شما امروز ۵ بار تست داده‌اید. فردا دوباره تلاش کنید!");
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

  // ۳. مدیریت کلیک
  const handleClickReady = () => {
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

      if (userSession) {
        const updatedSession = { ...userSession, dailyPlays: userSession.dailyPlays + 1 };
        setUserSession(updatedSession);
        localStorage.setItem("diamond_user_session", JSON.stringify(updatedSession));

        // آپدیت لیدربورد
        const newEntry: LeaderboardEntry = {
          userId: userSession.userId,
          name: name.trim(),
          contact: contactType,
          time: reactionTime,
          date: new Date().toLocaleDateString("fa-IR"),
        };

        let updatedLb = [...leaderboard];
        const existingUserIndex = updatedLb.findIndex(entry => entry.userId === userSession.userId);

        if (existingUserIndex !== -1) {
          if (reactionTime < updatedLb[existingUserIndex].time) {
            updatedLb[existingUserIndex] = newEntry;
          }
        } else {
          updatedLb.push(newEntry);
        }

        // مرتب سازی و برش ۱۰ نفر اول
        updatedLb = updatedLb.sort((a, b) => a.time - b.time).slice(0, 10);
        
        setLeaderboard(updatedLb);
        localStorage.setItem("diamond_reaction_lb", JSON.stringify(updatedLb));
      }
    }
  };

  const resetGame = () => {
    setStep("idle");
    setResult(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 relative z-20">
      
      {/* فرم اولیه */}
      {step === "idle" && (
        <div className="bg-diamond-panel border border-diamond-border rounded-xl p-6 text-center relative z-20">
          <h3 className="text-xl font-bold text-white mb-2">🏆 تست سرعت واکنش</h3>
          <p className="text-sm text-diamond-muted mb-6">برای شرکت در مسابقه، اطلاعات خود را وارد کنید.</p>
          
          <div className="space-y-4">
            {/* انتخاب پلتفرم و آیدی */}
            <div className="flex gap-2">
              <select 
                value={contactType} 
                onChange={(e) => setContactType(e.target.value)}
                className="w-1/3 bg-diamond-bg border border-diamond-border rounded-lg px-2 py-3 text-white focus:outline-none focus:border-diamond-cyan text-sm relative z-30"
              >
                <option value="discord">دیسکورد</option>
                <option value="telegram">تلگرام</option>
                <option value="rubika">روبیکا</option>
              </select>
              <input 
                type="text" 
                placeholder="آیدی خود را وارد کنید" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-2/3 bg-diamond-bg border border-diamond-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-diamond-cyan text-center font-bold relative z-30"
              />
            </div>
            
            {userSession && (
              <p className="text-xs text-diamond-cyan font-bold">
                بازی‌های امروز شما: {userSession.dailyPlays} از ۵
              </p>
            )}

            {errorMsg && <p className="text-red-400 text-sm relative z-30">{errorMsg}</p>}
            
            <Button onClick={startTest} className="w-full py-3 relative z-30">
              شروع تست
            </Button>
          </div>
        </div>
      )}

      {/* صفحه بازی (قرمز/سبز) */}
      {(step === "waiting" || step === "ready") && (
        <div 
          onClick={handleClickReady}
          className={`w-full h-64 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-200 select-none relative z-20 ${
            step === "waiting" 
              ? "bg-red-500/20 border-2 border-red-500" 
              : "bg-emerald-500/80 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          }`}
        >
          <span className="text-2xl font-extrabold text-white pointer-events-none">
            {step === "waiting" ? "منتظر بمان..." : "الان کلیک کن!"}
          </span>
        </div>
      )}

      {/* نمایش نتیجه */}
      {step === "result" && (
        <div className="bg-diamond-panel border border-diamond-cyan/30 rounded-xl p-6 text-center relative z-20">
          <h3 className="text-xl font-bold text-white mb-2">⚡ زمان واکنش شما:</h3>
          <div className="text-5xl font-extrabold text-diamond-cyan mb-4">{result} <span className="text-xl">ms</span></div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={resetGame} variant="secondary" className="px-6">تلاش دوباره</Button>
          </div>
        </div>
      )}

      {/* لیدربورد و جوایز */}
      <div className="bg-diamond-panel border border-diamond-border rounded-xl p-6 relative z-20">
        
        {/* جوایز */}
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
              <div className="text-xl mb-1">🥉</div>
              <div className="text-[10px] text-amber-500 font-bold mb-1">نفر سوم</div>
              <div className="text-xs text-white font-bold">۱۰ گیگ V2Ray</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>📊</span> ۱۰ نفر برتر
          </h3>
          
          {leaderboard.length === 0 ? (
            <p className="text-sm text-diamond-muted text-center py-2">هنوز کسی رکوردی ثبت نکرده است.</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => (
                <div key={entry.userId} className="flex items-center justify-between bg-diamond-bg/50 p-2.5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-bold ${idx === 0 ? "text-yellow-400" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-amber-600" : "text-diamond-muted"}`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{entry.name}</div>
                      <div className="text-[9px] text-diamond-muted">
                        {entry.contact === "discord" ? "Discord" : entry.contact === "telegram" ? "Telegram" : "Rubika"} • {entry.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-diamond-cyan">{entry.time} ms</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}