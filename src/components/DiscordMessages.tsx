import { useEffect, useState } from "react";

// 👇 این تابع عکس‌های فیلتر شده دیسکورد رو با واسطه لود می‌کنه
const proxyImage = (url: string | null) => {
  if (!url) return "";
  return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace("https://", ""))}`;
};

export function DiscordMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/discord/messages")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setMessages(data.messages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-500 text-sm py-10">در حال دریافت...</div>;
  if (messages.length === 0) return <div className="text-center text-gray-500 text-sm py-10">پیامی یافت نشد.</div>;

  return (
    <div className="space-y-6">
      {messages.map((msg) => {
        const avatarUrl = msg.author.avatar 
          ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png` 
          : `https://cdn.discordapp.com/embed/avatars/0.png`;

        return (
          <div key={msg.id} className="flex gap-4 text-sm items-start">
            <img 
              src={proxyImage(avatarUrl)} 
              alt={msg.author.username}
              className="w-10 h-10 rounded-full shrink-0 bg-white/10 object-cover border border-white/5" 
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="font-bold text-white text-base">{msg.author.username}</span>
                <span className="text-[11px] text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-7 whitespace-pre-wrap">{msg.content}</p>
              
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-3">
                  <img src={proxyImage(msg.attachments[0].url)} alt="attachment" className="max-w-sm rounded-lg border border-white/10" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
