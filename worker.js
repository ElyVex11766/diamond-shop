const OWNER_ID = "1520062981407375406";
const CATEGORY_ID = "1558052714028470282";
const GUILD_ID = "1551236517442224319";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // مدیریت CORS
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

    // 📌 مدیریت مستقیم مسیر /api/order (بدون نیاز به run_worker_first)
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

        const channelResponse = await fetch(
          `https://discord.com/api/v10/guilds/${GUILD_ID}/channels`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bot ${env.MTU1Nzc5NjE4OTQyMjc1NTk1Mg.G7an7A.ovd65iaipXolaQpD7p-6wUTiC0GR0sfd2_C5qA}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `order-${orderId}`,
              type: 0,
              parent_id: CATEGORY_ID,
              permission_overwrites: [
                { id: GUILD_ID, type: 0, deny: "1024" },
                { id: OWNER_ID, type: 1, allow: "1024" },
              ],
            }),
          }
        );

        if (!channelResponse.ok) {
          const error = await channelResponse.text();
          throw new Error(`Discord channel creation failed: ${error}`);
        }

        const channel = await channelResponse.json();
        const channelId = channel.id;

        const embedPayload = {
          content: `<@${OWNER_ID}> سفارش جدید از سایت!`,
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

        const messageResponse = await fetch(
          `https://discord.com/api/v10/channels/${channelId}/messages`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bot ${env.BOT_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(embedPayload),
          }
        );

        if (!messageResponse.ok) {
          throw new Error(`Discord message failed: ${messageResponse.status}`);
        }

        return new Response(JSON.stringify({ ok: true, order_id: orderId, channel_id: channelId }), {
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

    // 📌 مسیر health
    if (url.pathname === "/api/health" && method === "GET") {
      return new Response(JSON.stringify({ ok: true, status: "operational" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 📌 بقیه درخواست‌ها (فایل‌های استاتیک)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
