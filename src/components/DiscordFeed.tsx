import { useEffect, useState } from "react";

interface Props {
  type: "announcements" | "vouch";
}

export function DiscordFeed({ type }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/discord/${type}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setMessages(data.messages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  if (loading) return <div className="text-center text-gray-500 text-sm py-10">در حال دریافت...</div>;
  if (messages.length === 0) return <div className="text-center text-gray-500 text-sm py-10">پیامی یافت نشد.</div>;

  return (
    <div className="space-y-5">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-3 text-sm items-start">
          <img
            src={msg.author.avatar_url} // آدرس پروکسی شده از سمت سرور
            alt={msg.author.username}
            className="w-9 h-9 rounded-full shrink-0 bg-white/10 object-cover border border-white/5"
          />
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-white text-sm">{msg.author.username}</span>
              <span className="text-[10px] text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-6 whitespace-pre-wrap">{msg.content}</p>
            
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-2">
                <img src={msg.attachments[0].url} alt="attachment" className="max-w-xs rounded-lg border border-white/10" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
