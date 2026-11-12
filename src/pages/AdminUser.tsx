import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function AdminUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_username: adminUser,
          admin_password: adminPass,
          user_id: id,
          new_username: newUsername || undefined,
          new_password: newPassword || undefined,
        }),
      });
      const data = await res.json();

      if (data.ok) {
        setMsg("تغییرات ذخیره شد");
      } else {
        setError(data.error || "خطا");
      }
      setLoading(false);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 md:px-8 py-16">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/this-is-safe")}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          → بازگشت
        </button>
        <h1 className="text-xl font-bold text-white">ویرایش کاربر</h1>
      </div>

      <Card>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">آیدی کاربر</label>
            <input
              type="text"
              value={id}
              disabled
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">نام کاربری ادمین</label>
            <input
              type="text"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">رمز ادمین</label>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">نام کاربری جدید (اختیاری)</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">رمز جدید (اختیاری)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
            />
          </div>

          {msg && <p className="text-sm text-emerald-400">{msg}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : "ذخیره تغییرات"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
