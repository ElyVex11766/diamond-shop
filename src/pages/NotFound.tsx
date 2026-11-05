import { LinkButton } from "../components/Button";
import { useLang } from "../i18n/LanguageContext";

export function NotFound() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-5xl font-extrabold text-white">404</h1>
      <p className="mt-3 text-diamond-muted">{t.common.error}</p>
      <div className="mt-6">
        <LinkButton to="/">{t.common.back}</LinkButton>
      </div>
    </div>
  );
}