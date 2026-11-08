import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";

// ⚠️ این آیدی رو بعد از ساخت اپلیکیشن، اینجا بذار
const DISCORD_CLIENT_ID = "1557796189422755952"; 
const REDIRECT_URI = "http://localhost:5173/";

export function Login() {
  const { t } = useLang();
  const navigate = useNavigate();

  // ۱. چک کردن اینکه آیا از دیسکورد برگشتیم یا نه (کد توی URL هست)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // در اینجا ما کد رو گرفتیم. حالا باید بفرستیم به یه بک‌اند تا توکن رو بگیره.
      // چون فعلاً بک‌اند نداریم، فقط پیام موفقیت نشون می‌دیم.
      console.log("Authorization Code:", code);
      alert("✅ ورود با موفقیت انجام شد! (کد دریافت شد: " + code.substring(0, 10) + "...)");
      
      // پاک کردن کد از URL
      window.history.replaceState({}, document.title, "/login");
      navigate("/dashboard");
    }
  }, [navigate]);

  // ۲. هدایت کاربر به صفحه دیسکورد
  const handleDiscordLogin = () => {
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    window.location.href = oauthUrl;
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <SectionTitle title={t.login.title} subtitle={t.login.subtitle} />
      <Card>
        <Button onClick={handleDiscordLogin} className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white">
          {t.login.button}
        </Button>
        <p className="mt-4 text-center text-xs text-diamond-muted">
          با کلیک روی دکمه بالا، به صفحه دیسکورد هدایت می‌شوید.
        </p>
      </Card>
    </div>
  );
}
