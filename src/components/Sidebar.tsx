import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";

export function Sidebar() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const navItems = useMemo(() => lang === "en"
    ? [
        { href: "/#products", label: "Products" },
        { href: "/#why-us", label: "Why Zylox?" },
        { href: "/#testimonials", label: "Reviews" },
        { href: "/#rules", label: "Rules" },
      ]
    : [
        { href: "/#products", label: "محصولات" },
        { href: "/#why-us", label: "چرا Zylox؟" },
        { href: "/#testimonials", label: "نظرات" },
        { href: "/#rules", label: "قوانین" },
      ], [lang]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .map((item) => document.getElementById(item.href.split("#")[1]))
        .filter((section): section is HTMLElement => Boolean(section));
      if (sections.length === 0) return;
      const current = sections.reduce(
        (nearest, section, index) =>
          Math.abs(section.getBoundingClientRect().top - 180) < Math.abs(sections[nearest].getBoundingClientRect().top - 180)
            ? index
            : nearest,
        0,
      );
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <aside className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:flex flex-col items-center gap-4">
      <div className="absolute top-0 bottom-0 w-px bg-white/15" aria-hidden />
      {navItems.map((item, index) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={() => setActive(index)}
          aria-label={item.label}
          title={item.label}
          className={`relative z-10 h-3 w-3 rounded-full border transition-all duration-300 ${
            active === index
              ? "scale-150 border-white bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]"
              : "border-gray-500 bg-gray-500 hover:scale-125 hover:border-white hover:bg-white"
          }`}
        />
      ))}
    </aside>
  );
}
