import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl bg-white/5 rounded-full" />
        <h1 className="relative text-8xl md:text-9xl font-black text-white/10">404</h1>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">صفحه پیدا نشد</h2>
      <p className="text-gray-400 mb-8 max-w-sm">
        صفحه‌ای که دنبالش بودید وجود ندارد یا منتقل شده است.
      </p>
      <Link to="/">
        <Button>بازگشت به خانه</Button>
      </Link>
    </div>
  );
}
