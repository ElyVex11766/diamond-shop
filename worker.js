
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
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function isAuthorized(request, env) {
  const expected = String(env.SHOP_API_KEY || "");
  const supplied = String(request.headers.get("Authorization") || "");
  return Boolean(expected) && supplied === `Bearer ${expected}`;
}

async function ensureOrdersTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS shop_orders (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();
}

function normalizeOrder(data, id) {
  const discordUser =
    data.discord_user ??
    data.discord_id ??
    data.discord_user_id ??
    data.contact ??
    "";

  const username =
    data.discord_username ??
    data.username ??
    data.customer_name ??
    "";

  const itemName =
    data.item_name ??
    data.product_name ??
    data.product ??
    data.item ??
    "Item";

  const quantity =
    data.quantity ??
    data.qty ??
    data.amount ??
    1;

  const total =
    data.total ??
    data.amount_toman ??
    data.total_price ??
    data.price ??
    0;

  const phone =
    data.phone ??
    data.phone_number ??
    data.mobile ??
    "";

  return {
    ...data,
    id,
    discord_user: String(discordUser),
    discord_username: String(
      username ||
      (discordUser
        ? `user-${discordUser}`
        : `customer-${id.slice(-6)}`)
    ),
    item_name: String(itemName),
    quantity,
    total,
    phone: String(phone),
    platform: String(
      data.platform ??
      data.user_platform ??
      data.account_platform ??
      "—"
    ),
    platform_user_id: String(
      data.platform_user_id ??
      data.external_user_id ??
      data.telegram_id ??
      data.rubika_id ??
      "—"
    ),
    status: "pending",
    created_at: new Date().toISOString(),
  };
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
        database: Boolean(env.DB),
      });
    }

    // Safe BOT_KEY diagnostics
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
              Authorization: `Bot ${env.BOT_KEY}`,
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

    // Website -> D1: Save order
    // Discord channel creation is handled by the Python bot.
    if (url.pathname === "/api/order" && method === "POST") {
      try {
        if (!env.DB) {
          return jsonResponse({
            ok: false,
            error: "D1 binding DB is missing",
          }, 500);
        }

        const data = await request.json();

        const product =
          data.product ??
          data.item_name ??
          data.product_name;

        const amount =
          data.amount ??
          data.quantity ??
          data.qty;

        const contact =
          data.contact ??
          data.discord_user ??
          data.discord_id ??
          data.discord_user_id;

        if (
          !product ||
          amount === undefined ||
          amount === null ||
          !contact
        ) {
          return jsonResponse({
            ok: false,
            error: "Missing fields: product, amount, contact",
          }, 400);
        }

        await ensureOrdersTable(env.DB);

        const orderId = `ORD-${crypto.randomUUID()}`;

        const order = normalizeOrder(
          {
            ...data,
            product,
            amount,
            contact,
          },
          orderId
        );

        await env.DB.prepare(`
          INSERT INTO shop_orders (id, payload, created_at)
          VALUES (?, ?, ?)
        `)
          .bind(
            orderId,
            JSON.stringify(order),
            order.created_at
          )
          .run();

        return jsonResponse({
          ok: true,
          order_id: orderId,
          status: "queued",
        }, 201);

      } catch (error) {
        return jsonResponse({
          ok: false,
          error: error.message || "Order could not be saved",
        }, 500);
      }
    }

    // Python bot -> Get pending orders
    if (
      url.pathname === "/api/bot/orders" &&
      method === "GET"
    ) {
      if (!isAuthorized(request, env)) {
        return jsonResponse({
          ok: false,
          error: "Unauthorized",
        }, 401);
      }

      if (!env.DB) {
        return jsonResponse({
          ok: false,
          error: "D1 binding DB is missing",
        }, 500);
      }

      try {
        await ensureOrdersTable(env.DB);

        const result = await env.DB.prepare(`
          SELECT payload
          FROM shop_orders
          ORDER BY created_at ASC
          LIMIT 100
        `).all();

        const orders = (result.results || [])
          .map((row) => {
            try {
              return JSON.parse(row.payload);
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        return jsonResponse({
          ok: true,
          orders,
        });

      } catch (error) {
        return jsonResponse({
          ok: false,
          error: error.message,
        }, 500);
      }
    }

    // Bot confirms successful channel creation.
    // Only after confirmation, delete the temporary order from D1.
    const ackMatch = url.pathname.match(
      /^\/api\/bot\/orders\/([^/]+)\/ack$/
    );

    if (ackMatch && method === "POST") {
      if (!isAuthorized(request, env)) {
        return jsonResponse({
          ok: false,
          error: "Unauthorized",
        }, 401);
      }

      if (!env.DB) {
        return jsonResponse({
          ok: false,
          error: "D1 binding DB is missing",
        }, 500);
      }

      try {
        await ensureOrdersTable(env.DB);

        const orderId = decodeURIComponent(ackMatch[1]);

        const result = await env.DB.prepare(`
          DELETE FROM shop_orders
          WHERE id = ?
        `)
          .bind(orderId)
          .run();

        return jsonResponse({
          ok: true,
          acknowledged: true,
          deleted: Number(result.meta?.changes || 0) > 0,
        });

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
