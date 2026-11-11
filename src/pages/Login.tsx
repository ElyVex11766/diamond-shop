import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { VirtualKeyboard } from "../components/VirtualKeyboard";

const WORKER_URL = "https://diamond-shop.p2opcnymwrvsjo3mmroimjhu.workers.dev";

export function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [activeField, setActiveField] = useState<"username" | "password">("username");
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("diamond_user");
    if (savedUser) navigate("/dashboard");
  }, [navigate]);

  const handleVirtualKeyPress = (key: string) => {
    if (activeField === "username") {
      if (key === "BACKSPACE") setUsername((prev) => prev.slice(0, -1));
      else if (key === "ENTER") setActiveField("password");
      else setUsername((prev) => prev + key);
    } else {
      if (key === "BACKSPACE") setPassword((prev) => prev.slice(0, -1));
      else if (key === "ENTER") {
        // با زدن Enter توی رمز، فرم ارسال می‌شه
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
      } else setPassword((prev) => prev + key);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const res = await fetch(`${WORKER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "خطا");
        return;
      }

      if (mode === "register") {
        alert("ثبت‌نام با موفقیت انجام شد! حالا وارد شوید.");
        setMode("login");
      } else {
        localStorage.setItem("diamond_user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-diamond-bg px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          {mode === "login" ? "ورود به حساب" : "ساخت حساب جدید"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-diamond-muted mb-1">نام کاربری</label>
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setActiveField("username")}
              required
              minLength={3}
              className={`w-full bg-diamond-bg border rounded-lg px-4 py-2 text-white focus:outline-none transition ${
                activeField === "username" ? "border-diamond-cyan" : "border-diamond-border"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm text-diamond-muted mb-1">رمز عبور</label>
            <input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveField("password")}
              required
              minLength={6}
              className={`w-full bg-diamond-bg border rounded-lg px-4 py-2 text-white focus:outline-none transition ${
                activeField === "password" ? "border-diamond-cyan" : "border-diamond-border"
              }`}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-3">
            {loading ? "در حال پردازش..." : mode === "login" ? "ورود" : "ثبت‌نام"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="text-sm text-diamond-cyan hover:underline"
          >
            {mode === "login" ? "حساب ندارید؟ ثبت‌نام کنید" : "حساب دارید؟ وارد شوید"}
          </button>
        </div>

        {/* کیبورد مجازی (فقط دسکتاپ) */}
        <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />
      </Card>
    </div>
  );
}
