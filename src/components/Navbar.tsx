import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";

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
    } catch {
      // ignore
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
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
      try {
        await fetch(`/api/notifications/${notif.id}/read`, { method: "POST" });
      } catch {
        // ignore
      }
    }
    setShowNotif(false);
    if (notif.order_id) {
      // پیدا کردن token از لیست سفارش‌ها در صفحه بعد
      navigate(`/dashboard`);
    } else {
      fetchNotifications();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <NavLink to="/" aria-label="Zylox home">
            <img src="/ZyloxLogoRemoveBG.png" alt="Zylox Logo" className="h-8 w-auto object-contain" />
          </NavLink>

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

          <div className="flex items-center gap-2">
            {/* نوتیفیکیشن */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotif((v) => !v)}
                  className="relative p-2 rounded-xl hover:bg-white/10 transition"
                  title="Notifications"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute left-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-xl border border-white/15 bg-[#0a0a0a] shadow-2xl z-50">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-xs font-bold text-white">نوتیفیکیشن‌ها</p>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-gray-500">نوتیفیکیشنی نیست</p>
