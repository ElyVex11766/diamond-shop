import { useState } from "react";
import { LinkButton } from "../components/Button";
import { SectionTitle } from "../components/SectionTitle";
import { useLang } from "../i18n/LanguageContext";
import { ReactionTest } from "../components/ReactionTest";

export function Bot() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"info" | "challenge">("info");

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      
      <SectionTitle title="Diamond BOT" subtitle="بهترین ربات برای سرور دیسکورد شما." />

      {/* تب‌ها */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center p-1 bg-diamond-panel rounded-xl border border-diamond-border">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "info" ? "bg-diamond-blue text-white" : "text-diamond-muted hover:text-white"
            }`}
          >
            اطلاعات ربات
          </button>
          <button
            onClick={() => setActiveTab("challenge")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "challenge" ? "bg-diamond-blue text-white" : "text-diamond-muted hover:text-white"
            }`}
          >
            چالش
          </button>
        </div>
      </div>

      {/* ============================================= */}
      {/* تب اول: اطلاعات ربات */}
      {/* ============================================= */}
      {activeTab === "info" && (
        <div className="space-y-12">
          {/* دکمه‌های دعوت و وضعیت */}
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="rounded-2xl border border-diamond-cyan/30 bg-diamond-panel p-8 text-center shadow-glow-sm">
              <h3 className="text-xl font-bold text-white mb-4">{t.botPage.invite}</h3>
              <p className="text-sm text-diamond-muted mb-6">برای افزودن ربات به سرور، روی دکمه زیر کلیک کنید.</p>
              <LinkButton to="/login" className="w-full">{t.botPage.invite}</LinkButton>
            </div>

            <div className="rounded-2xl border border-diamond-border bg-diamond-panel p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-4">{t.botPage.status}</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.botPage.online}
              </div>
            </div>
          </div>

          {/* 🎯 عنوان جذاب و توضیحات ربات */}
          <div className="text-center mt-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              با Diamond BOT سرورت رو به سطح بعد ببر
            </h2>
            <p className="text-lg text-diamond-muted max-w-3xl mx-auto leading-relaxed">
              Diamond BOT یه جعبه‌ابزار کامله که مدیریت سرور، امنیت، سرگرمی و رشد جامعه‌ت رو یکجا برات فراهم می‌کنه. با امکانات قدرتمند و رابط کاربری ساده، دیگه نیازی نیست نگران هیچی باشی.
            </p>
            <div className="mt-8 flex justify-center">
              <LinkButton to="/status" variant="secondary" className="px-8 py-3 text-lg">
                📊 مشاهده جامعه در یک نگاه
              </LinkButton>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* تب دوم: چالش (تست واکنش) */}
      {/* ============================================= */}
      {activeTab === "challenge" && (
        <div className="rounded-3xl border border-diamond-cyan/30 bg-gradient-to-b from-diamond-panel to-diamond-bg p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-diamond-cyan/20 blur-3xl rounded-full pointer-events-none"></div>

          <h2 className="text-2xl font-bold text-white mb-2 relative z-10 text-center">🎯 تست سرعت واکنش</h2>
          <p className="text-diamond-muted mb-6 relative z-10 text-center">سرعتت رو محک بزن و جزو ۳ نفر برتر هفته باش!</p>

          <ReactionTest />
        </div>
      )}

    </div>
  );
}
