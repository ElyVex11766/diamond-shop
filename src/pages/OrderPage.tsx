import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";

const WORKER_URL = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev";

export function OrderPage() {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${WORKER_URL}/api/order/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setOrder(data.order);
          setNewContact(`${data.order.platform}: ${data.order.platform_user_id}`);
        } else {
          setError(data.error || "خطا در دریافت سفارش");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleEdit = async () => {
    setEditError(null);
    try {
      const res = await fetch(`${WORKER_URL}/api/order/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: newContact }),
      });
      const data = await res.json();
      if (data.ok) {
        setOrder(data.order);
        setIsEditing(false);
      } else {
        setEditError(data.error || "خطا در ویرایش");
      }
    } catch (err: any) {
      setEditError(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("کپی شد!");
  };

  if (loading) return <div className="text-center py-20 text-white">در حال بارگذاری...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12" dir="rtl">
      <div className="bg-diamond-panel border border-diamond-border rounded-2xl p-6 shadow-glow space-y-6">
        
        {/* شماره سفارش */}
        <div className="text-center border-b border-diamond-border pb-4">
          <p className="text-sm text-diamond-muted">شماره سفارش</p>
          <h1 className="text-2xl font-bold text-yellow-400 font-mono">{order.id}</h1>
        </div>

        {/* جزئیات محصول */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">محصول:</span> <span className="text-white">{order.product}</span></div>
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">تعداد:</span> <span className="text-white">{order.amount}</span></div>
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">قیمت واحد:</span> <span className="text-white">{order.unit_price.toLocaleString('fa-IR')} تومان</span></div>
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">مبلغ کل:</span> <span className="text-white">{order.total.toLocaleString('fa-IR')} تومان</span></div>
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">پلتفرم:</span> <span className="text-white">{order.platform}</span></div>
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">آیدی:</span> <span className="text-white">{order.platform_user_id}</span></div>
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">شماره تماس:</span> <span className="text-white">{order.phone || "ندارد"}</span></div>
          <div className="bg-diamond-bg p-4 rounded-lg"><span className="text-diamond-muted">وضعیت:</span> <span className="text-white">{order.status}</span></div>
        </div>

        {/* دکمه ویرایش یک‌باره */}
        {!order.edited_at && (
          <div className="bg-[#05070d] p-4 rounded-xl border border-diamond-cyan/30">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="w-full">ویرایش آیدی (فقط یک بار)</Button>
            ) : (
              <div className="space-y-2">
                <input 
                  type="text" value={newContact} onChange={(e) => setNewContact(e.target.value)}
                  className="w-full bg-diamond-bg border border-diamond-border rounded-lg px-4 py-2 text-white"
                />
                {editError && <p className="text-red-400 text-sm">{editError}</p>}
                <div className="flex gap-2">
                  <Button onClick={handleEdit} className="flex-1">ذخیره تغییرات</Button>
                  <Button onClick={() => setIsEditing(false)} variant="secondary" className="flex-1">انصراف</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* هشدار زمان تحویل */}
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center">
          <p className="text-red-400 font-bold">Delivery Time: 1 - 96 Hours</p>
          <p className="text-xs text-diamond-muted mt-1">زمان تحویل سفارش بین ۱ تا ۹۶ ساعت خواهد بود.</p>
        </div>

        {/* بخش پشتیبانی */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">📞 پشتیبانی</h3>
          {[
            { label: "Rubika", id: "@MissMyPrime" },
            { label: "Telegram", id: "@MisssMyPrime" },
            { label: "Discord", id: "@ielyas." },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between bg-diamond-bg p-3 rounded-lg">
              <div><span className="text-diamond-muted text-sm">{item.label}:</span> <span className="text-white font-mono">{item.id}</span></div>
              <Button onClick={() => copyToClipboard(item.id)} variant="secondary" className="text-xs px-3 py-1">Copy</Button>
            </div>
          ))}
          {order.discord_channel_id && (
            <div className="flex items-center justify-between bg-diamond-bg p-3 rounded-lg">
              <div><span className="text-diamond-muted text-sm">Discord Ticket ID:</span> <span className="text-white font-mono">{order.discord_channel_id}</span></div>
              <Button onClick={() => copyToClipboard(order.discord_channel_id)} variant="secondary" className="text-xs px-3 py-1">Copy</Button>
            </div>
          )}
        </div>

        {/* قوانین */}
        <div className="border-t border-diamond-border pt-4">
          <h4 className="text-sm font-bold text-white mb-2">Terms & Conditions</h4>
          <ul className="text-xs text-diamond-muted space-y-1 list-disc list-inside">
            <li>زمان تحویل سفارش بین ۱ تا ۹۶ ساعت است.</li>
            <li>اطلاعات واردشده باید صحیح باشند.</li>
            <li>کاربر فقط یک بار اجازه تغییر پلتفرم و آیدی را دارد.</li>
            <li>تغییر محصول، تعداد و مبلغ امکان‌پذیر نیست.</li>
            <li>سوءاستفاده از سیستم موجب محدودیت دسترسی می‌شود.</li>
            <li>انقضای لینک به معنی حذف سفارش نیست.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
