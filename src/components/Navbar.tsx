import { useState } from "react";
import { NavLink } from "react-router-dom";
import { DiamondLogo } from "./DiamondLogo";
import { useLang } from "../i18n/LanguageContext";
import { LinkButton } from "./Button";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/features", label: t.nav.features },
    { to: "/docs", label: t.nav.docs },
    { to: "/shop", label: t.nav.shop },
    { to: "/dashboard", label: t.nav.dashboard },
    { to: "/status", label: t.nav.status },
    { to: "/bot", label: t.nav.bot }, // 👈 دکمه ربات اضافه شد
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive ? "text-diamond-cyan" : "text-diamond-muted hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-diamond-border/60 bg-diamond-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <NavLink to="/" aria-label="Diamond BOT home">
          <DiamondLogo />
        </NavLink>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-diamond-muted hover:text-white hover:border-diamond-cyan/50 transition"
            aria-label={t.nav.language}
          >
            {lang === "en" ? "FA | فارسی" : "EN | English"}
          </button>
          <LinkButton to="/login">{t.nav.login}</LinkButton>
        </div>

        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-diamond-border/60 bg-diamond-bg/95 px-4 py-4 space-y-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
            >
              <div className="py-1">{l.label}</div>
            </NavLink>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-diamond-muted hover:text-white"
            >
              {lang === "en" ? "Switch to فارسی" : "تغییر به English"}
            </button>
            <LinkButton to="/login" className="w-full">
              {t.nav.login}
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}