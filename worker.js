export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      try {
        const data = await request.json();
        
        const discordPayload = {
          content: "🛒 **سفارش جدید از سایت!**",
          embeds: [{
            title: "جزئیات سفارش",
            color: 0x2f81f7,
            fields: [
              { name: "محصول", value: data.product || "نامشخص", inline: true },
              { name: "تعداد", value: String(data.amount || 1), inline: true },
              { name: "آیدی کاربر", value: data.contact || "نامشخص", inline: true },
              { name: "شماره تماس", value: data.phone || "ندارد", inline: false },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Diamond Shop" }
          }]
        };

        const response = await fetch(env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload),
        });

        if (!response.ok) throw new Error(`Discord API error: ${response.status}`);

        return new Response(JSON.stringify({ success: true }), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          },
          status: 200,
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          },
          status: 500,
        });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  },
};
