import { useState, useEffect } from "react";

const sections = [
  { id: "top", label: "خانه" },
  { id: "products", label: "محصولات" },
  { id: "stats", label: "آمار" },
  { id: "rules", label: "قوانین" },
];

export function Sidebar() {
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className="group relative flex items-center"
          aria-label={section.label}
        >
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-125"
                : "bg-gray-600 hover:bg-gray-400"
            }`}
          />
          <span className="absolute left-6 text-sm text-white bg-[#0a0a0a] px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
            {section.label}
          </span>
        </button>
      ))}
    </div>
  );
}
