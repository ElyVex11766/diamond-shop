import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

interface User {
  id: string;
  username: string;
  email: string;
  discord_id: string;
  discord_username: string;
  discord_avatar: string;
  created_at: string;
  last_ip: string;
  last_ip_country: string;
  last_login: string;
}

export function Admin() {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_username: adminUsername, admin_password: adminPassword }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "ورود ناموفق");
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const usersRes = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_username: adminUsername, admin_password: adminPassword }),
      });
      const usersData = await usersRes.json();
      if (usersData.ok) setUsers(usersData.users || []);
      setLoading(false);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">پنل مدیریت</h1>
          <Card>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="نام کاربری ادمین"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
                required
              />
              <input
                type="password"
                placeholder="رمز عبور"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
                required
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "..." : "ورود"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">مدیریت کاربران</h1>
        <span className="text-sm text-gray-500">{users.length} کاربر</span>
      </div>

      <div className="space-y-3">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-20">هیچ کاربری ثبت نشده است</p>
        ) : (
          users.map((u) => (
            <Card key={u.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {u.discord_avatar ? (
                  <img src={u.discord_avatar} alt="" className="w-10 h-10 rounded-full border border-white/15" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-sm">👤</div>
                )}
                <div>
                  <p className="text-sm font-bold text-white">{u.username}</p>
                  <p className="text-xs text-gray-500">{u.email || u.discord_username || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600">{u.last_ip_country}</span>
                <Button
                  variant="secondary"
                  className="text-xs px-3 py-1.5"
                  onClick={() => navigate(`/this-is-safe/user/${u.id}`)}
                >
                  ویرایش
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
