import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, type Lang, type Dict } from "./translations";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(() => {
    // زبان پیش‌فرض فارسی است، مگر اینکه کاربر قبلاً انگلیسی رو انتخاب کرده باشه
    const saved = localStorage.getItem("diamond-lang");
    if (saved === "en") return "en";
    return "fa"; // پیش‌فرض: فارسی
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("diamond-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}