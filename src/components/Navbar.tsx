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
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("diamond_user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedTheme = localStorage.getItem("zylox-theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.body.classList.add("light");
    }
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleTheme = () => {
    const newLight = !isLight;
    setIsLight(newLight);
    if (newLight) {
      document.body.classList.add("light");
      localStorage.setItem("zylox-theme", "light");
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("zylox-theme", "dark");
    }
  };

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/docs", label: t.nav.docs },
    { to: "/#products", label: t.nav.shop },
    { to: "/bot", label: t.nav.bot },
    { to: "/challenge", label: lang === "en" ? "Challenge" : "چالش" },
    { to: "/dashboard", label: t.nav.dashboard },
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

  const handleLogout = () => {
    localStorage.removeItem("diamond_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? isLight
            ? "border-black/10 bg-[#f5f5f7]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
            : "border-white/10 bg-[#050505]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : isLight
          ? "border-transparent bg-[#f5f5f7]/40 backdrop-blur-sm"
          : "border-transparent bg-[#050505]/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-8">
        {/* Logo image */}
        <NavLink to="/" aria-label="Zylox home" className="flex items-center gap-2">
          <img
            src="/images/ZyloxShopRemoveBG.png"
            alt="Zylox Shop"
            className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </NavLink>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative" aria-label="Main navigation">
          <div
            className={`absolute bottom-0 h-9 rounded-lg transition-all duration-300 ease-out pointer-events-none border-b ${
              isLight ? "bg-black/[0.04] border-black/30" : "bg-white/[0.06] border-white/30"
            }`}
            style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px`, opacity: indicatorStyle.opacity }}
          />

          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-path={l.to}
              className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                location.pathname === l.to
                  ? isLight ? "text-gray-900" : "text-white"
                  : isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-500 hover:text-white"
              }`}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isLight ? "bg-gray-200" : "bg-white/10"
            } border ${isLight ? "border-black/10" : "border-white/15"}`}
            aria-label="Toggle theme"
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${
                isLight
                  ? "left-0.5 bg-white shadow-md text-amber-500"
                  : "left-7 bg-gray-800 shadow-md text-blue-300"
              }`}
            >
              {isLight ? "☀" : "☾"}
            </div>
          </button>

          {/* Language button */}
          <button
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              isLight
                ? "border-black/15 text-gray-600 hover:text-gray-900 hover:border-black/40 hover:bg-black/5"
                : "border-white/15 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5"
            }`}
          >
            {lang === "en" ? "FA | فارسی" : "EN | ENGLISH"}
          </button>

          {/* Login / User */}
          {user ? (
            <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border ${
              isLight ? "bg-black/5 border-black/10" : "bg-white/5 border-white/10"
            }`}>
              {user.discord_avatar ? (
                <img src={user.discord_avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-white/20" />
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isLight ? "bg-black/10" : "bg-white/10"}`}>👤</div>
              )}
              <span className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{user.discord_username || user.username}</span>
              <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition">خروج</button>
            </div>
          ) : (
            <LinkButton
              to="/login"
              className={`!px-5 !py-2 !text-sm !font-bold !rounded-xl transition-all hover:scale-105 ${
                isLight
                  ? "!bg-gray-900 !text-white hover:!bg-gray-800"
                  : "!bg-white !text-black hover:!bg-gray-200"
              }`}
            >
              {t.nav.login}
            </LinkButton>
          )}
        </div>

        {/* Mobile menu button */}
        <button className={`lg:hidden text-2xl ${isLight ? "text-gray-900" : "text-white"}`} onClick={() => setOpen((o) => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`lg:hidden border-t px-4 py-4 space-y-1 backdrop-blur-xl ${
          isLight ? "border-black/10 bg-[#f5f5f7]/95" : "border-white/10 bg-[#050505]/95"
        }`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                location.pathname === l.to
                  ? isLight ? "text-gray-900 bg-black/5" : "text-white bg-white/5"
                  : isLight ? "text-gray-500 hover:text-gray-900 hover:bg-black/5" : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-3">
            <button
              onClick={toggleTheme}
              className={`text-sm py-2 px-3 rounded-lg transition flex items-center gap-2 ${
                isLight ? "text-gray-600 hover:bg-black/5" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              {isLight ? "☾ حالت تاریک" : "☀ حالت روشن"}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              className={`text-sm py-2 px-3 rounded-lg transition ${
                isLight ? "text-gray-600 hover:bg-black/5" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              {lang === "en" ? "فارسی" : "English"}
            </button>
            {user ? (
              <button onClick={handleLogout} className="text-sm text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/10 transition">خروج از حساب</button>
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
