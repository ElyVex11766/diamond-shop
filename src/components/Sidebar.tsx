import { useState, useEffect } from "react";

const sections = [
  { id: "top", label: "خانه" },
  { id: "products", label: "محصولات" },
  { id: "why-us", label: "چرا ما" },
  { id: "testimonials", label: "نظرات" },
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
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className="group relative flex items-center justify-center"
          aria-label={section.label}
        >
          <div
            className={`transition-all duration-300 rounded-full ${
              activeSection === section.id
                ? "w-3 h-10 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                : "w-3 h-3 bg-gray-600 hover:bg-gray-400"
            }`}
          />
          <span className="absolute left-8 text-sm text-white bg-[#0a0a0a] px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
            {section.label}
          </span>
        </button>
      ))}
    </div>
  );
}
