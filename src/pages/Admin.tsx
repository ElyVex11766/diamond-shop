import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

const WORKER_URL = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev";
const ADMIN_KEY = "elyas_gang_11766"; // 👈 همون کلیدی که توی worker.js گذاشتی

interface User {
  id: string;
  username: string;
  password: string;
  discord_id: string | null;
  discord_username: string | null;
  created_at: string;
  last_ip: string | null;
}

export function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enteredKey, setEnteredKey] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${WORKER_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${ADMIN_KEY}` },
      });
      const data = await res.json();
      if (data.ok) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchUsers();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-diamond-bg px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-6">🔐 پنل ادمین</h1>
          <input
            type="password"
            placeholder="کلید ادمین را وارد کنید"
            value={enteredKey}
            onChange={(e) => setEnteredKey(e.target.value)}
            className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white text-center mb-4 focus:outline-none focus:border-diamond-cyan"
          />
          <Button
            onClick={() => {
              if (enteredKey === ADMIN_KEY) setIsLoggedIn(true);
              else alert("کلید اشتباه است!");
            }}
            className="w-full"
          >
            ورود
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">پنل مدیریت کاربران</h1>
        <Button onClick={() => setIsLoggedIn(false)} variant="secondary">خروج</Button>
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
                <th className="px-4 py-3">دیسکورد</th>
                <th className="px-4 py-3">آخرین IP</th>
                <th className="px-4 py-3">تاریخ عضویت</th>
                <th className="px-4 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-diamond-border/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{user.username}</td>
                  <td className="px-4 py-3 text-white font-mono">{user.password}</td>
                  <td className="px-4 py-3 text-diamond-cyan">
                    {user.discord_username ? `${user.discord_username} (${user.discord_id})` : "متصل نیست"}
                  </td>
                  <td className="px-4 py-3 text-diamond-muted font-mono text-xs">{user.last_ip || "نامشخص"}</td>
                  <td className="px-4 py-3 text-diamond-muted">
                    {new Date(user.created_at).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      onClick={() => navigate(`/admin/user/${user.id}`)}
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
