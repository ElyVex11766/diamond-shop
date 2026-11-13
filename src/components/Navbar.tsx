import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const savedUser = localStorage.getItem("diamond_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [location.pathname]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/#products", label: t.nav.shop },
    { to: "/#bot", label: t.nav.bot },
    { to: "/#challenge", label: "چالش" },
    { to: "/#support", label: "پشتیبانی" },
    { to: "/status", label: t.nav.status },
  ];

  useEffect(() => {
    const activeLink = navRef.current?.querySelector(`[data-path="${location.pathname}"]`) as HTMLElement;
    if (activeLink && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({ left: linkRect.left - navRect.left, width: linkRect.width, opacity: 1 });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, lang]);

  const handleDashboardClick = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        
        {/* لوگو سمت راست */}
        <NavLink to="/" aria-label="Zylox home">
          <img src="/ZyloxLogoRemoveBG.png" alt="Zylox Logo" className="h-8 w-auto object-contain" />
        </NavLink>

        {/* منو در وسط */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative" aria-label="Main navigation">
          <div
            className="absolute bottom-0 h-8 bg-white/10 rounded-md transition-all duration-300 ease-out pointer-events-none border-b-2 border-white"
            style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px`, opacity: indicatorStyle.opacity }}
          />
          {links.map((l) => (
            <NavLink 
              key={l.to} 
              to={l.to} 
              data-path={l.to}
              className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                location.pathname === l.to ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* بخش سمت چپ */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* دکمه آدمک (Dashboard) */}
          <button onClick={handleDashboardClick} className="p-2 rounded-xl hover:bg-white/10 transition" title="Dashboard">
            {/* 👇 عکس آدمک بر اساس تم */}
            <img 
              src={document.documentElement.classList.contains("light") ? "/images/dashboard.png" : "/images/dashboard1.png"} 
              alt="Dashboard" 
              className="w-6 h-6 object-contain" 
            />
          </button>

          {/* زبان */}
          <button
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white hover:border-white/50 transition"
          >
            {lang === "en" ? "FA | فارسی" : "EN | English"}
          </button>
          
          {/* دکمه خروج/ورود */}
          {user && (
            <button onClick={() => { localStorage.removeItem("diamond_user"); setUser(null); navigate("/login"); }} className="text-xs text-red-400 hover:text-red-300">
              خروج
            </button>
          )}
        </div>

        <button className="lg:hidden text-white text-2xl" onClick={() => setOpen((o) => !o)}>
          {open ? "✕" : "🗙"}
        </button>
      </div>

      {/* منوی موبایل */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[#050505]/95 px-4 py-4 space-y-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={`block py-2 text-sm font-medium ${location.pathname === l.to ? "text-white" : "text-gray-400"}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <LinkButton to="/login" className="w-full" onClick={() => setOpen(false)}>
              {t.nav.login}
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
