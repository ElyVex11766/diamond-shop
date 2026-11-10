import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

const WORKER_URL = "https://diamond-shop.p2opcnymwrvsjo3mmroimjhu.workers.dev";

interface User {
  id: string;
  username: string;
  password: string;
  email: string | null;
  discord_id: string | null;
  discord_username: string | null;
  created_at: string;
  last_ip: string | null;
}

export function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // چک کردن اینکه آیا قبلاً لاگین کرده یا نه
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
    if (isLoggedIn) {
      setIsLoggedIn(true);
      const savedUsername = localStorage.getItem("admin_username") || "";
      const savedPassword = localStorage.getItem("admin_password") || "";
      setAdminUsername(savedUsername);
      setAdminPassword(savedPassword);
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${WORKER_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_username: adminUsername, admin_password: adminPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || "خطا در دریافت اطلاعات");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && adminUsername && adminPassword) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!adminUsername || !adminPassword) {
      setError("لطفاً نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    try {
      const res = await fetch(`${WORKER_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_username: adminUsername, admin_password: adminPassword }),
      });
      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("admin_username", adminUsername);
        localStorage.setItem("admin_password", adminPassword);
        setIsLoggedIn(true);
      } else {
        setError(data.error || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_password");
    setIsLoggedIn(false);
    setUsers([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-diamond-bg px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-6">🔐 پنل ادمین</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="نام کاربری ادمین"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white text-center focus:outline-none focus:border-diamond-cyan"
            />
            <input
              type="password"
              placeholder="رمز عبور ادمین"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white text-center focus:outline-none focus:border-diamond-cyan"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full">ورود</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">پنل مدیریت کاربران</h1>
        <Button onClick={handleLogout} variant="secondary">خروج</Button>
      </div>

      {loading ? (
        <p className="text-center text-diamond-muted">در حال دریافت اطلاعات...</p>
      ) : (
        <div className="bg-diamond-panel border border-diamond-border rounded-xl overflow-x-auto">
          <table className="w-full text-right text-sm whitespace-nowrap">
            <thead className="bg-diamond-bg border-b border-diamond-border text-diamond-muted">
              <tr>
                <th className="px-4 py-3">نام کاربری</th>
                <th className="px-4 py-3">رمز عبور</th>
                <th className="px-4 py-3">ایمیل</th>
                <th className="px-4 py-3">دیسکورد</th>
                <th className="px-4 py-3">آخرین IP</th>
                <th className="px-4 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-diamond-border/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{user.username}</td>
                  <td className="px-4 py-3 text-white font-mono">{user.password}</td>
                  <td className="px-4 py-3 text-diamond-muted font-mono text-xs">{user.email || "وارد نشده"}</td>
                  <td className="px-4 py-3 text-diamond-cyan">
                    {user.discord_username ? `${user.discord_username} (${user.discord_id})` : "متصل نیست"}
                  </td>
                  <td className="px-4 py-3 text-diamond-muted font-mono text-xs">{user.last_ip || "نامشخص"}</td>
                  <td className="px-4 py-3">
                    <Button
                      onClick={() => navigate(`/this-is-safe/user/${user.id}`)}
                      className="text-xs px-3 py-1 bg-diamond-blue/20 text-diamond-cyan hover:bg-diamond-blue/30"
                    >
                      مشاهده / ویرایش
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
