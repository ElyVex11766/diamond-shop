import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  discord_avatar: string | null;
  created_at: string;
  last_ip: string | null;
  last_ip_country: string | null;
  last_login: string | null;
}

export function AdminUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  // گرفتن اطلاعات ادمین از localStorage
  const adminUsername = localStorage.getItem("admin_username") || "";
  const adminPassword = localStorage.getItem("admin_password") || "";

  useEffect(() => {
    if (!id) return;
    
    fetch(`${WORKER_URL}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_username: adminUsername, admin_password: adminPassword }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const found = data.users.find((u: User) => u.id === id);
          if (found) {
            setUser(found);
            setNewUsername(found.username);
            setNewPassword(found.password);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id, adminUsername, adminPassword]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${WORKER_URL}/api/admin/update-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          admin_username: adminUsername, 
          admin_password: adminPassword,
          user_id: user.id, 
          new_username: newUsername, 
          new_password: newPassword 
        }),
      });
      const data = await res.json();
      if (data.ok) { 
        alert("تغییرات با موفقیت ذخیره شد!"); 
        navigate("/this-is-safe"); 
      }
      else alert(data.error);
    } catch (err) { 
      alert("خطا در ذخیره تغییرات"); 
    }
  };

  if (loading) return <div className="text-center py-20 text-white">در حال بارگذاری...</div>;
  if (!user) return <div className="text-center py-20 text-red-400">کاربر پیدا نشد</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">مدیریت کاربر</h1>
        <Button onClick={() => navigate("/this-is-safe")} variant="secondary">بازگشت</Button>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-diamond-border pb-4">
          {user.discord_avatar ? (
            <img src={user.discord_avatar} className="w-16 h-16 rounded-full border border-diamond-cyan" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-diamond-border flex items-center justify-center text-2xl">👤</div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{user.discord_username || "بدون دیسکورد"}</h2>
            <p className="text-sm text-diamond-muted font-mono">{user.discord_id || "---"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-diamond-muted mb-1">نام کاربری</label>
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan" />
          </div>
          <div>
            <label className="block text-sm text-diamond-muted mb-1">رمز عبور</label>
            <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-diamond-cyan" />
          </div>
          <div>
            <label className="block text-sm text-diamond-muted mb-1">ایمیل</label>
            <div className="bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white font-mono text-sm">
              {user.email || "وارد نشده"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-diamond-muted mb-1">آخرین IP</label>
              <div className="bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white font-mono text-sm">{user.last_ip || "نامشخص"}</div>
            </div>
            <div>
              <label className="block text-sm text-diamond-muted mb-1">کشور (IP)</label>
              <div className="bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white font-mono text-sm">{user.last_ip_country || "نامشخص"}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-diamond-muted mb-1">تاریخ عضویت</label>
            <div className="bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white text-sm">{new Date(user.created_at).toLocaleString('fa-IR')}</div>
          </div>
          <Button onClick={handleSave} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500">ذخیره تغییرات</Button>
        </div>
      </Card>
    </div>
  );
}
