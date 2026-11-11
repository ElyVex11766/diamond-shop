import { Link } from "react-router-dom";
import { ZyloxLogo } from "./ZyloxLogo";
import { useLang } from "../i18n/LanguageContext";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0a0a0a]/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <ZyloxLogo />
          <p className="mt-3 text-sm text-gray-400 max-w-xs">
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">{t.footer.product}</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/features" className="hover:text-white">{t.nav.features}</Link></li>
            <li><Link to="/shop" className="hover:text-white">{t.nav.shop}</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">{t.nav.dashboard}</Link></li>
            <li><Link to="/status" className="hover:text-white">{t.nav.status}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">{t.footer.resources}</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/docs" className="hover:text-white">{t.nav.docs}</Link></li>
            <li><Link to="/docs" className="hover:text-white">{t.footer.support}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">{t.footer.legal}</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><span className="opacity-60">{t.footer.tos}</span></li>
            <li><span className="opacity-60">{t.footer.privacy}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        © {year} Zylox. {t.footer.rights}
      </div>
    </footer>
  );
}
