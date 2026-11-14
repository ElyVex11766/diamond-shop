import { useEffect, useState } from "react";

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

  if (loading) return <div className="text-center text-gray-500 text-xs py-4">در حال دریافت...</div>;
  if (messages.length === 0) return <div className="text-center text-gray-500 text-xs py-4">پیامی یافت نشد.</div>;

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold shrink-0">
            {msg.author.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{msg.author.username}</span>
              <span className="text-[10px] text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-gray-300 mt-1 whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
