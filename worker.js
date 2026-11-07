
const OWNER_ID = "1520062981407375406";
const CATEGORY_ID = "1558052714028470282";
const GUILD_ID = "1551236517442224319";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Health check
    if (url.pathname === "/api/health" && method === "GET") {
      return jsonResponse({
        ok: true,
        status: "operational",
      });
    }

    // Safe BOT_KEY diagnostics (never exposes the token)
    if (url.pathname === "/api/discord-check" && method === "GET") {
      const key = env.BOT_KEY || "";

      return jsonResponse({
        exists: Boolean(key),
        length: key.length,
        startsWithBot: key.startsWith("Bot "),
        hasWhitespace: /\s/.test(key),
        hasQuotes: key.includes('"') || key.includes("'"),
        prefix: key.substring(0, 5),
      });
    }

    // Discord authentication test
    if (url.pathname === "/api/discord-auth" && method === "GET") {
      try {
        if (!env.BOT_KEY) {
          return jsonResponse({
            ok: false,
            error: "BOT_KEY is missing",
          }, 500);
        }

        const response = await fetch(
          "https://discord.com/api/v10/users/@me",
          {
            headers: {
              "Authorization": `Bot ${env.BOT_KEY}`,
            },
          }
        );

        const body = await response.text();

        return jsonResponse({
          ok: response.ok,
          discord_status: response.status,
          discord_response: body,
        }, response.ok ? 200 : 502);

      } catch (error) {
        return jsonResponse({
          ok: false,
          error: error.message,
        }, 500);
      }
    }

    // Create order
    if (url.pathname === "/api/order" && method === "POST") {
      try {
        if (!env.BOT_KEY) {
          throw new Error("BOT_KEY is missing");
        }

        const data = await request.json();
        const { product, amount, contact, phone } = data;

        if (!product || !amount || !contact) {
          return jsonResponse({
            ok: false,
            error: "Missing fields",
          }, 400);
        }

        const orderId = `ORD-${Date.now()}`;

        const channelResponse = await fetch(
          `https://discord.com/api/v10/guilds/${GUILD_ID}/channels`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bot ${env.BOT_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `order-${orderId}`,
              type: 0,
              parent_id: CATEGORY_ID,
              permission_overwrites: [
                {
                  id: GUILD_ID,
                  type: 0,
                  deny: "1024",
                },
                {
                  id: OWNER_ID,
                  type: 1,
                  allow: "1024",
                },
              ],
            }),
          }
        );

        if (!channelResponse.ok) {
          const error = await channelResponse.text();
          throw new Error(
            `Discord channel creation failed: ${error}`
          );
        }

        const channel = await channelResponse.json();

        const embedPayload = {
          content: `<@${OWNER_ID}> سفارش جدید از سایت!`,
          embeds: [{
            title: `سفارش ${orderId}`,
            color: 0x2f81f7,
            fields: [
              {
                name: "محصول",
                value: String(product),
                inline: true,
              },
              {
                name: "تعداد",
                value: String(amount),
                inline: true,
              },
              {
                name: "آیدی کاربر",
                value: String(contact),
                inline: true,
              },
              {
                name: "شماره تماس",
                value: String(phone || "ندارد"),
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: "Diamond Shop",
            },
          }],
        };

        const messageResponse = await fetch(
          `https://discord.com/api/v10/channels/${channel.id}/messages`,
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
          const error = await messageResponse.text();
          throw new Error(
            `Discord message failed: ${error}`
          );
        }

        return jsonResponse({
          ok: true,
          order_id: orderId,
          channel_id: channel.id,
        }, 201);

      } catch (error) {
        return jsonResponse({
          ok: false,
          error: error.message,
        }, 500);
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders,
    });
  },
};
