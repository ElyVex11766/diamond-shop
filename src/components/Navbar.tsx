import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { GlobalSearch } from "./GlobalSearch"; // 👈 اضافه شد

interface Notification {
  id: string;
  order_id: string | null;
  type: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotif, setShowNotif] = useState(false);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("diamond_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    else setUser(null);
  }, [location.pathname]);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (data.ok) setNotifications(data.notifications || []);
    } catch { /* ignore */ }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/#products", label: "فروشگاه" },
    { to: "/#challenge", label: "چالش" },
    { to: "/#bot", label: t.nav.bot },
    { to: "/#support", label: "پشتیبانی" },
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

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read_at) {
      try { await fetch(`/api/notifications/${notif.id}/read`, { method: "POST" }); } catch {}
    }
    setShowNotif(false);
    if (notif.order_id) navigate(`/dashboard`);
    else fetchNotifications();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          
          <NavLink to="/" aria-label="Zylox home">
            <img src="/images/ZyloxLogoRemoveBG.png" alt="Zylox Logo" className="h-8 w-auto object-contain" />
          </NavLink>

          {/* 👇 منوی دسکتاپ */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1 relative" aria-label="Main navigation">
            <div className="absolute bottom-0 h-8 bg-white/10 rounded-md transition-all duration-300 ease-out pointer-events-none border-b-2 border-white" style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px`, opacity: indicatorStyle.opacity }} />
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} data-path={l.to} className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${location.pathname === l.to ? "text-white" : "text-gray-400 hover:text-white"}`} end={l.to === "/"}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* 👇 سرچ بار و دکمه‌های سمت راست */}
          <div className="flex items-center gap-4">
            <GlobalSearch /> {/* سرچ بار وسط قرار گرفت */}
            
            <div className="flex items-center gap-2">
              {user && (
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setShowNotif((v) => !v)} className="relative p-2 rounded-xl hover:bg-white/10 transition" title="Notifications">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center px-1">{unreadCount}</span>}
                  </button>
                  {showNotif && (
                    <div className="absolute left-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-xl border border-white/15 bg-[#0a0a0a] shadow-2xl z-50">
                      <div className="p-3 border-b border-white/10"><p className="text-xs font-bold text-white">نوتیفیکیشن‌ها</p></div>
                      {notifications.length === 0 ? <p className="p-4 text-center text-xs text-gray-500">نوتیفیکیشنی نیست</p> : notifications.map((n) => (
                        <button key={n.id} onClick={() => handleNotificationClick(n)} className={`w-full text-right p-3 border-b border-white/5 hover:bg-white/5 transition ${!n.read_at ? "bg-white/[0.03]" : ""}`}>
                          <p className={`text-xs ${!n.read_at ? "text-white font-semibold" : "text-gray-400"}`}>{n.message}</p>
                          <p className="text-[10px] text-gray-600 mt-1">{new Date(n.created_at).toLocaleString("fa-IR")}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button onClick={handleDashboardClick} className="p-2 rounded-xl hover:bg-white/10 transition" title="Dashboard">
                <img src={document.documentElement.classList.contains("light") ? "/images/dashboard.png" : "/images/dashboard1.png"} alt="Dashboard" className="w-6 h-6 object-contain" />
              </button>
              <button onClick={() => setLang(lang === "en" ? "fa" : "en")} className="hidden md:block rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white hover:border-white/50 transition">
                {lang === "en" ? "FA | فارسی" : "EN | English"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* منوی موبایل */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/10 bg-[#050505]/95 backdrop-blur-md">
        <div className="flex justify-around items-center py-2">
          <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? "text-white" : "text-gray-500"}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
            <span className="text-[10px] font-medium">{t.nav.home}</span>
          </NavLink>
          <NavLink to="/#products" className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" /></svg>
            <span className="text-[10px] font-medium">فروشگاه</span>
          </NavLink>
          <NavLink to="/#challenge" className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <span className="text-[10px] font-medium">چالش</span>
          </NavLink>
          <NavLink to="/#support" className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1 M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3 M10 1v3 M14 1v3" /></svg>
            <span className="text-[10px] font-medium">پشتیبانی</span>
          </NavLink>
        </div>
      </nav>
      <div className="h-16 lg:hidden" />
    </>
  );
}
