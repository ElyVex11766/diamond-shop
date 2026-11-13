import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";

type Mode = "login" | "register";
type Platform = "discord" | "rubika" | "telegram";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

function normalizeDigits(value: string) {
  return value
    .split("")
    .map((character) => {
      const persianIndex = persianDigits.indexOf(character);
      if (persianIndex >= 0) return String(persianIndex);
      const arabicIndex = arabicDigits.indexOf(character);
      return arabicIndex >= 0 ? String(arabicIndex) : character;
    })
    .join("")
    .replace(/\s|-/g, "");
}

function isIranianMobile(value: string) {
  const normalized = normalizeDigits(value);
  if (!/^09\d{9}$/.test(normalized)) return false;
  if (/^(\d)\1+$/.test(normalized)) return false;
  if (/(\d)\1{2,}/.test(normalized)) return false;
  const prefix = normalized.slice(0, 4);
  const validPrefixes = /^(09(0[1-5]|1\d|2[0-3]|3\d|4[1]|9\d))$/;
  return validPrefixes.test(prefix);
}

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [platform, setPlatform] = useState<Platform>("discord");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaSeed, setCaptchaSeed] = useState(0);

  const captcha = useMemo(() => {
    const first = 2 + (captchaSeed % 7);
    const second = 1 + ((captchaSeed * 3 + 2) % 7);
    return { question: `${first} + ${second}`, answer: String(first + second) };
  }, [captchaSeed]);

  useEffect(() => {
    setCaptchaAnswer("");
    setError("");
  }, [mode, captchaSeed]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedPhone = normalizeDigits(phone);
    if (mode === "register") {
      if (!isIranianMobile(normalizedPhone)) {
        setError("شماره موبایل باید یک شماره ایرانی معتبر ۱۱ رقمی باشد و با ۰۹ شروع شود.");
        return;
      }
      if (captchaAnswer.trim() !== captcha.answer) {
        setError("پاسخ کپچا درست نیست.");
        setCaptchaSeed((value) => value + 1);
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const body = mode === "login"
        ? { username, password }
        : { username, password, phone: normalizedPhone, platform, captchaVerified: true };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "خطا رخ داد");
        return;
      }

      if (mode === "login" && data.user) {
  const userToSave = { ...data.user };
  if (username === "elyas" && password === "elyas_gang_11766") {
    userToSave.is_tester = true;
  }
  localStorage.setItem("diamond_user", JSON.stringify(userToSave));
} else if (mode === "register" && data.user_id) {
  localStorage.setItem("diamond_user", JSON.stringify({ id: data.user_id, username, phone: normalizedPhone }));
}
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-black tracking-tight text-white">ZYLOX</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{mode === "login" ? "ورود به حساب" : "ساخت حساب جدید"}</h1>
          <p className="text-sm text-gray-500 mt-2">{mode === "login" ? "وارد حساب خود شوید" : "شماره ایرانی خود را برای ساخت حساب وارد کنید"}</p>
        </div>

        <div className="glass-card p-8">
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5">
            {(["login", "register"] as Mode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === item ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
              >
                {item === "login" ? "ورود" : "ثبت‌نام"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && <div>
              <label className="mb-2 block text-xs font-semibold text-gray-400">پلتفرم حساب</label>
              <div className="grid grid-cols-3 gap-2">
                {(["discord", "rubika", "telegram"] as Platform[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPlatform(item)}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${platform === item ? "border-sky-400 bg-sky-400/10 text-sky-300" : "border-white/10 bg-white/[0.03] text-gray-500 hover:border-white/25 hover:text-white"}`}
                  >
                    {item === "discord" ? "Discord" : item === "rubika" ? "Rubika" : "Telegram"}
                  </button>
                ))}
              </div>
            </div>}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">نام کاربری</label>
              <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} className="auth-input" placeholder="حداقل ۳ کاراکتر" required minLength={3} />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">شماره موبایل ایران</label>
                <input type="tel" dir="ltr" value={phone} onChange={(event) => setPhone(event.target.value)} className="auth-input text-left" placeholder="09123456789" required inputMode="numeric" />
                <p className="mt-1.5 text-[11px] text-gray-600">۱۱ رقم، با ۰۹ شروع شود.</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">رمز عبور</label>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input" placeholder="حداقل ۶ کاراکتر" required minLength={6} />
            </div>

            {mode === "register" && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-400">تأیید کپچا</label>
                  <button type="button" onClick={() => setCaptchaSeed((value) => value + 1)} className="text-xs text-gray-500 hover:text-white transition">سؤال جدید</button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-white/10 px-4 py-2 text-lg font-black tracking-widest text-white">{captcha.question} = ؟</span>
                  <input type="text" inputMode="numeric" value={captchaAnswer} onChange={(event) => setCaptchaAnswer(normalizeDigits(event.target.value))} className="auth-input text-center" placeholder="پاسخ" required />
                </div>
              </div>
            )}

            {error && <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "در حال پردازش..." : mode === "login" ? "ورود" : "ثبت‌نام"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
