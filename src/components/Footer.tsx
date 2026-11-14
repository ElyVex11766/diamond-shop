import { Link } from "react-router-dom";
import { ZyloxLogo } from "./ZyloxLogo";
import { useLang } from "../i18n/LanguageContext";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#070707]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <ZyloxLogo />
          <p className="mt-4 text-sm text-gray-500 max-w-xs leading-relaxed">
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">{t.footer.product}</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><Link to="/features" className="hover:text-white transition">{t.nav.features}</Link></li>
            <li><Link to="/shop" className="hover:text-white transition">{t.nav.shop}</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">{t.nav.dashboard}</Link></li>
            <li><Link to="/status" className="hover:text-white transition">{t.nav.status}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">{t.footer.resources}</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><Link to="/docs" className="hover:text-white transition">{t.nav.docs}</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">سوالات متداول</Link></li>
            <li><Link to="/#support" className="hover:text-white transition">{t.footer.support}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">{t.footer.legal}</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><span className="opacity-50">{t.footer.tos}</span></li>
            <li><span className="opacity-50">{t.footer.privacy}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-gray-600">
        © {year} Zylox. {t.footer.rights}
      </div>
    </footer>
  );
}
