const DISCORD_CHANNEL_ID = "YOUR_CHANNEL_ID_HERE";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (url.pathname === "/api/health" && method === "GET") {
      return new Response(JSON.stringify({ ok: true, status: "operational" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (url.pathname === "/api/order" && method === "POST") {
      try {
        const data = await request.json();
        const { product, amount, contact, phone } = data;

        if (!product || !amount || !contact) {
          return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }

        const orderId = `ORD-${Date.now()}`;

        const discordPayload = {
          content: "🛒 **سفارش جدید از سایت!**",
          embeds: [{
            title: `سفارش ${orderId}`,
            color: 0x2f81f7,
            fields: [
              { name: "محصول", value: String(product), inline: true },
              { name: "تعداد", value: String(amount), inline: true },
              { name: "آیدی کاربر", value: String(contact), inline: true },
              { name: "شماره تماس", value: String(phone || "ندارد"), inline: false },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Diamond Shop" }
          }]
        };

        const discordResponse = await fetch(
          `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bot ${env.BOT_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(discordPayload),
          }
        );

        if (!discordResponse.ok) {
          throw new Error(`Discord error: ${discordResponse.status}`);
        }

        return new Response(JSON.stringify({ ok: true, order_id: orderId, message: "سفارش با موفقیت ثبت شد" }), {
          status: 201,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });

      } catch (error) {
        return new Response(JSON.stringify({ ok: false, error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
