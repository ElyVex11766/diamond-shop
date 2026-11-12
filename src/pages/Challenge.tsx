import { useEffect, useState, useCallback } from "react";
import { SectionTitle } from "../components/SectionTitle";
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

type ContactPlatform = "discord" | "rubika" | "telegram";

interface Entry {
  id: string;
  name: string;
  contact: string;
  time: number;
  created_at: string;
}

const formatTime = (ms: number) => (ms / 1000).toFixed(2) + " ثانیه";

export function Challenge() {
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [user] = useState(() => localStorage.getItem("diamond_user"));
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<ContactPlatform>("discord");
  const [contact, setContact] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Timer state
  const [phase, setPhase] = useState<"idle" | "waiting" | "result" | "tooEarly">("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Personal best from localStorage
  const [personalBest, setPersonalBest] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("zylox-challenge-best");
    if (saved) setPersonalBest(parseInt(saved));
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.ok) setAllEntries(data.entries || []);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleStartClick = () => {
    setError("");
    setMsg("");
    setReactionTime(null);
    setSubmitted(false);
    setPhase("waiting");
    setStartTime(null);

    const delay = 1500 + Math.random() * 3000;
    const timer = setTimeout(() => {
      setStartTime(Date.now());
      setPhase("result");
    }, delay);

    // Store timer to clear if clicked early
    (window as any).__challengeTimer = timer;
  };

  const handleReactionClick = () => {
    if (phase === "waiting") {
      // Clicked too early
      clearTimeout((window as any).__challengeTimer);
      setPhase("tooEarly");
      return;
    }
    if (phase === "result" && startTime) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setPhase("idle");

      // Update personal best
      if (personalBest === null || time < personalBest) {
        setPersonalBest(time);
        localStorage.setItem("zylox-challenge-best", String(time));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || reactionTime === null) return;
    setSubmitting(true);
    setError("");
    setMsg("");

    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact: `${platform}:${contact}`, time: reactionTime }),
      });
      const data = await res.json();

      if (data.ok) {
        setMsg("رکورد شما ثبت شد!");
        setSubmitted(true);
        await fetchLeaderboard();
      } else {
        setError(data.error || "خطا در ثبت");
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-400/10 text-4xl">⚡</div>
        <h1 className="text-3xl font-black text-white">ورود برای شرکت در چالش</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-gray-400">برای ثبت رکورد، مشاهده جدول امتیازات و ذخیره بهترین زمان خود ابتدا وارد حساب شوید.</p>
        <Link to="/login?redirect=/challenge" className="mt-7"><Button>ورود و شروع چالش</Button></Link>
      </div>
    );
  }

  // Top 5 (current challenge) - from all entries sorted, take 5
  const sortedEntries = [...allEntries].sort((a, b) => a.time - b.time);
  const top5 = sortedEntries.slice(0, 5);
  const allTimeTop10 = sortedEntries.slice(0, 10);

  const platformLabels: Record<ContactPlatform, string> = {
    discord: "Discord",
    rubika: "Rubika",
    telegram: "Telegram",
  };

  const platformIcons: Record<ContactPlatform, string> = {
    discord: "🎮",
    rubika: "💬",
    telegram: "✈️",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <SectionTitle title="چالش سرعت" subtitle="روی دکمه کلیک کن — هرچه سریع‌تر، بهتر!" />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Reaction timer + submit form */}
        <div className="space-y-6">
          {/* Personal Best */}
          {personalBest !== null && (
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-xs text-gray-500">بهترین رکورد شما</p>
                  <p className="text-lg font-black text-white">{formatTime(personalBest)}</p>
                </div>
              </div>
              <button
                onClick={() => { setPersonalBest(null); localStorage.removeItem("zylox-challenge-best"); }}
                className="text-xs text-gray-600 hover:text-red-400 transition"
              >
                بازنشانی
              </button>
            </div>
          )}

          {/* Reaction Timer */}
          <Card className="text-center">
            <h3 className="text-lg font-bold text-white mb-4">تست سرعت واکنش</h3>

            {phase === "idle" && reactionTime === null && (
              <button
                onClick={handleStartClick}
                className="w-full py-16 rounded-2xl border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition">⚡</div>
                <p className="text-sm font-bold text-white">برای شروع کلیک کن</p>
                <p className="text-xs text-gray-500 mt-1">وقتی سبز شد، سریع کلیک کن!</p>
              </button>
            )}

            {phase === "waiting" && (
              <button
                onClick={handleReactionClick}
                className="w-full py-16 rounded-2xl border-2 border-red-500/40 bg-red-500/10 transition-all"
              >
                <div className="text-4xl mb-3">⏳</div>
                <p className="text-sm font-bold text-red-300">صبر کن...</p>
                <p className="text-xs text-red-400/60 mt-1">هنوز کلیک نکن!</p>
              </button>
            )}

            {phase === "result" && (
              <button
                onClick={handleReactionClick}
                className="w-full py-16 rounded-2xl border-2 border-emerald-500/60 bg-emerald-500/15 transition-all animate-scale-in"
              >
                <div className="text-4xl mb-3">🟢</div>
                <p className="text-sm font-black text-emerald-300">کلیک کن!</p>
              </button>
            )}

            {phase === "tooEarly" && (
              <div className="py-16 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-sm font-bold text-amber-300">زیود تند کلیک کردی!</p>
                <button
                  onClick={handleStartClick}
                  className="mt-4 text-xs text-white border-b border-white/30 hover:border-white pb-0.5"
                >
                  دوباره امتحان کن
                </button>
              </div>
            )}

            {phase === "idle" && reactionTime !== null && (
              <div className="py-12 rounded-2xl border-2 border-white/15 bg-white/5">
                <p className="text-xs text-gray-500 mb-2">زمان واکنش شما</p>
                <p className="text-5xl font-black text-white mb-1">{reactionTime}<span className="text-2xl text-gray-500"> ms</span></p>
                {personalBest !== null && reactionTime <= personalBest && (
                  <p className="text-sm text-emerald-400 mt-3 font-semibold">🎉 رکورد جدید شخصی!</p>
                )}
                <div className="flex gap-2 mt-6 justify-center">
                  <Button onClick={handleStartClick} variant="secondary" className="text-xs">
                    دوباره
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Submit form */}
          {reactionTime !== null && !submitted && (
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">ثبت رکورد</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">نام</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
                    placeholder="نام شما"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">راه ارتباطی</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {(Object.keys(platformLabels) as ContactPlatform[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`py-2.5 rounded-xl text-xs font-semibold transition border ${
                          platform === p
                            ? "bg-white text-black border-white"
                            : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30"
                        }`}
                      >
                        <span className="block text-base mb-0.5">{platformIcons[p]}</span>
                        {platformLabels[p]}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
                    placeholder={`آیدی ${platformLabels[platform]} شما`}
                    required
                  />
                </div>

                {msg && <p className="text-sm text-emerald-400">{msg}</p>}
                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "در حال ثبت..." : `ثبت رکورد: ${reactionTime}ms`}
                </Button>
              </form>
            </Card>
          )}

          {submitted && (
            <Card className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-sm font-bold text-emerald-400 mb-4">رکورد شما ثبت شد!</p>
              <Button onClick={() => { setSubmitted(false); setReactionTime(null); }} variant="secondary" className="text-xs">
                دوباره امتحان کن
              </Button>
            </Card>
          )}
        </div>

        {/* Right: Leaderboards */}
        <div className="space-y-6">
          {/* Top 5 current challenge */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">۵ نفر برتر</h3>
              <span className="text-xs text-gray-600">چالش فعلی</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : top5.length === 0 ? (
              <p className="text-center text-gray-500 py-10">هنوز رکوردی ثبت نشده</p>
            ) : (
              <div className="space-y-2">
                {top5.map((e, i) => (
                  <div
                    key={e.id}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                      i === 0
                        ? "bg-gradient-to-l from-amber-500/15 to-transparent border border-amber-500/30"
                        : i === 1
                        ? "bg-gradient-to-l from-gray-400/10 to-transparent border border-gray-400/20"
                        : i === 2
                        ? "bg-gradient-to-l from-amber-700/10 to-transparent border border-amber-700/20"
                        : "bg-white/[0.02] border border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        i === 0 ? "bg-amber-400 text-black" : i === 1 ? "bg-gray-300 text-black" : i === 2 ? "bg-amber-700 text-white" : "bg-white/8 text-gray-400"
                      }`}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">{e.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-300">{formatTime(e.time)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* All-time Top 10 */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">رکورد همیشگی</h3>
              <span className="text-xs text-gray-600">۱۰ نفر برتر تاریخ</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : allTimeTop10.length === 0 ? (
              <p className="text-center text-gray-500 py-10">هنوز رکوردی ثبت نشده</p>
            ) : (
              <div className="space-y-1.5">
                {allTimeTop10.map((e, i) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black bg-white/8 text-gray-400">
                        {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-white">{e.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{formatTime(e.time)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
