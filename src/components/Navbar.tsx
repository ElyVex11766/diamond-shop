import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { DiamondLogo } from "./DiamondLogo";
import { useLang } from "../i18n/LanguageContext";
import { LinkButton } from "./Button";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // استیت برای موقعیت و عرض مربع متحرک
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/features", label: t.nav.features },
    { to: "/docs", label: t.nav.docs },
    { to: "/shop", label: t.nav.shop },
    { to: "/bot", label: t.nav.bot },
    { to: "/dashboard", label: t.nav.dashboard },
    { to: "/status", label: t.nav.status },
  ];

  // محاسبه موقعیت لینک فعال برای انیمیشن
  useEffect(() => {
    const activeLink = navRef.current?.querySelector(`[data-path="${location.pathname}"]`) as HTMLElement;
    if (activeLink && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, lang]); // با تغییر زبان یا مسیر آپدیت میشه

  return (
    <header className="sticky top-0 z-50 border-b border-diamond-border/60 bg-diamond-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <NavLink to="/" aria-label="Diamond BOT home">
          <DiamondLogo />
        </NavLink>

        {/* دسکتاپ */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative" aria-label="Main navigation">
          
          {/* مربع متحرک (Smooth Indicator) */}
          <div
            className="absolute bottom-0 h-8 bg-diamond-blue/20 rounded-md transition-all duration-300 ease-out pointer-events-none border-b-2 border-diamond-cyan"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
          />

          {links.map((l) => (
            <NavLink 
              key={l.to} 
              to={l.to} 
              data-path={l.to} // برای پیدا کردن موقعیت
              className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                location.pathname === l.to ? "text-white" : "text-diamond-muted hover:text-white"
              }`}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-diamond-muted hover:text-white hover:border-diamond-cyan/50 transition"
          >
            {lang === "en" ? "FA | فارسی" : "EN | English"}
          </button>
          <LinkButton to="/login">{t.nav.login}</LinkButton>
        </div>

        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* موبایل */}
      {open && (
        <div className="lg:hidden border-t border-diamond-border/60 bg-diamond-bg/95 px-4 py-4 space-y-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={`block py-2 text-sm font-medium ${
                location.pathname === l.to ? "text-diamond-cyan" : "text-diamond-muted"
              }`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="flex flex-col gap-2 pt-2">
             <LinkButton to="/login" className="w-full">
              {t.nav.login}
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
