import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { DiamondLogo } from "./DiamondLogo";
import { useLang } from "../i18n/LanguageContext";
import { LinkButton } from "./Button";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);

  // لود کردن اطلاعات کاربر از localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("diamond_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [location.pathname]); // هر بار مسیر عوض شد چک کن

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/features", label: t.nav.features },
    { to: "/docs", label: t.nav.docs },
    { to: "/shop", label: t.nav.shop },
    { to: "/bot", label: t.nav.bot },
    { to: "/dashboard", label: t.nav.dashboard },
    { to: "/status", label: t.nav.status },
  ];

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
  }, [location.pathname, lang]);

  const handleLogout = () => {
    localStorage.removeItem("diamond_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-diamond-border/60 bg-diamond-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <NavLink to="/" aria-label="Diamond BOT home">
          <DiamondLogo />
        </NavLink>

        {/* منوی دسکتاپ */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative" aria-label="Main navigation">
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
              data-path={l.to}
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
          
          {/* 👇 تغییر مهم: اگر لاگین کرده بود، پروفایل نشون بده */}
          {user ? (
            <div className="flex items-center gap-3 bg-diamond-panel border border-diamond-border px-3 py-1.5 rounded-xl">
              {user.discord_avatar ? (
                <img src={user.discord_avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-diamond-cyan" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-diamond-border flex items-center justify-center text-xs">👤</div>
              )}
              <span className="text-sm font-bold text-white">{user.discord_username || user.username}</span>
              <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">خروج</button>
            </div>
          ) : (
            <LinkButton to="/login">{t.nav.login}</LinkButton>
          )}
        </div>

        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* منوی موبایل */}
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
            {user ? (
               <button onClick={handleLogout} className="text-sm text-red-400 py-2">خروج از حساب</button>
            ) : (
              <LinkButton to="/login" className="w-full" onClick={() => setOpen(false)}>
                {t.nav.login}
              </LinkButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
