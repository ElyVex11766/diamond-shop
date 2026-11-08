// =========================================================
// CONSTANTS
// =========================================================
const ALLOWED_ORIGIN = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev";
const ORDER_EXPIRY_MINUTES = 30;

// =========================================================
// HELPERS
// =========================================================
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function isBotAuthorized(request, env) {
  const expected = String(env.SHOP_API_KEY || "");
  const supplied = String(request.headers.get("Authorization") || "");
  return Boolean(expected) && supplied === `Bearer ${expected}`;
}

async function ensureOrdersTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS shop_orders (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      discord_channel_id TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      edited_at TEXT,
      edit_history TEXT
    )
  `).run();
}

function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeOrder(data, id, token, expiresAt) {
  const contact = data.contact || "";
  const [platform, platformUserId] = contact.includes(":") 
    ? contact.split(":").map(s => s.trim()) 
    : ["discord", contact];

  return {
    id,
    token,
    product: data.product || "Item",
    amount: Number(data.amount) || 1,
    unit_price: Number(data.unit_price) || 0,
    total: Number(data.total) || 0,
    platform: platform,
    platform_user_id: platformUserId,
    phone: data.phone || "",
    status: "pending",
    discord_channel_id: null,
    created_at: new Date().toISOString(),
    expires_at: expiresAt,
    edited_at: null,
    edit_history: null,
  };
}

// =========================================================
// MAIN FETCH
// =========================================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // 📌 Health Check
    if (url.pathname === "/api/health" && method === "GET") {
      return jsonResponse({ ok: true, status: "operational", database: Boolean(env.DB) });
    }

    // 📌 ثبت سفارش جدید (POST /api/order)
    if (url.pathname === "/api/order" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);

        const data = await request.json();
        const { product, amount, contact } = data;

        if (!product || !amount || !contact) {
          return jsonResponse({ ok: false, error: "Missing fields" }, 400);
        }

        await ensureOrdersTable(env.DB);

        const orderId = `ORD-${crypto.randomUUID()}`;
        const token = generateToken();
        const expiresAt = new Date(Date.now() + ORDER_EXPIRY_MINUTES * 60 * 1000).toISOString();

        const order = normalizeOrder(data, orderId, token, expiresAt);

        await env.DB.prepare(`
          INSERT INTO shop_orders (id, token, payload, status, created_at, expires_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          orderId, token, JSON.stringify(order), "pending", order.created_at, expiresAt
        ).run();

        return jsonResponse({ 
          ok: true, 
          order_id: orderId, 
          token: token,
          expires_at: expiresAt,
          order_url: `/order/${token}`
        }, 201);

      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // 📌 دریافت اطلاعات سفارش با توکن (GET /api/order/:token)
    const orderGetMatch = url.pathname.match(/^\/api\/order\/([a-f0-9]{64})$/);
    if (orderGetMatch && method === "GET") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB);

        const token = orderGetMatch[1];
        const row = await env.DB.prepare(
          "SELECT * FROM shop_orders WHERE token = ?"
        ).bind(token).first();

        if (!row) return jsonResponse({ ok: false, error: "Not found" }, 404);

        const order = JSON.parse(row.payload);

        // بررسی انقضا (سمت سرور)
        if (new Date(row.expires_at) < new Date()) {
          return jsonResponse({ 
            ok: false, 
            expired: true, 
            error: "لینک منقضی شده است." 
          }, 410);
        }

        return jsonResponse({ ok: true, order });

      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // 📌 ویرایش یک‌باره اطلاعات (PATCH /api/order/:token)
    if (orderGetMatch && method === "PATCH") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB);

        const token = orderGetMatch[1];
        const data = await request.json();
        const row = await env.DB.prepare(
          "SELECT * FROM shop_orders WHERE token = ?"
        ).bind(token).first();

        if (!row) return jsonResponse({ ok: false, error: "Not found" }, 404);
        if (new Date(row.expires_at) < new Date()) {
          return jsonResponse({ ok: false, expired: true, error: "لینک منقضی شده" }, 410);
        }

        const order = JSON.parse(row.payload);

        // بررسی محدودیت ویرایش یک‌باره
        if (order.edited_at) {
          return jsonResponse({ ok: false, error: "فقط یک بار امکان ویرایش وجود دارد" }, 403);
        }

        const oldContact = `${order.platform}: ${order.platform_user_id}`;
        const newContact = data.contact || "";

        // بروزرسانی
        order.platform = newContact.split(":")[0]?.trim() || order.platform;
        order.platform_user_id = newContact.split(":")[1]?.trim() || order.platform_user_id;
        order.edited_at = new Date().toISOString();
        order.edit_history = JSON.stringify({ old: oldContact, new: newContact });

        await env.DB.prepare(`
          UPDATE shop_orders SET payload = ?, edited_at = ?, edit_history = ? WHERE token = ?
        `).bind(JSON.stringify(order), order.edited_at, order.edit_history, token).run();

        return jsonResponse({ ok: true, message: "ویرایش انجام شد", order });

      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // 📌 APIهای ربات (با احراز هویت)
    if (url.pathname === "/api/bot/orders" && method === "GET") {
      if (!isBotAuthorized(request, env)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
      if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
      await ensureOrdersTable(env.DB);

      const result = await env.DB.prepare(
        "SELECT * FROM shop_orders WHERE status = 'pending' ORDER BY created_at ASC LIMIT 100"
      ).all();

      const orders = (result.results || []).map(row => JSON.parse(row.payload));
      return jsonResponse({ ok: true, orders });
    }

    // 📌 تایید ساخت تیکت توسط ربات (POST /api/bot/orders/:id/ack)
    const ackMatch = url.pathname.match(/^\/api\/bot\/orders\/([^/]+)\/ack$/);
    if (ackMatch && method === "POST") {
      if (!isBotAuthorized(request, env)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
      if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
      await ensureOrdersTable(env.DB);

      const orderId = decodeURIComponent(ackMatch[1]);
      const body = await request.json();
      const channelId = body.channel_id || "";

      await env.DB.prepare(
        "UPDATE shop_orders SET status = 'processing', discord_channel_id = ? WHERE id = ?"
      ).bind(channelId, orderId).run();

      return jsonResponse({ ok: true, acknowledged: true });
    }

    // 📌 بقیه درخواست‌ها (فایل‌های استاتیک)
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return jsonResponse({ ok: false, error: "Not found" }, 404);
  },
};
