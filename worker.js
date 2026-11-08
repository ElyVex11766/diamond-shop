const ALLOWED_ORIGIN = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev";
const ORDER_EXPIRY_MINUTES = 30;
const GUILD_ID = "1551236517442224319";
const DISCORD_CLIENT_ID = "1557796189422755952"; // 👈 اینجا آیدی اپلیکیشن دیسکوردت رو بذار
const DISCORD_CLIENT_SECRET = "haZNe0sJ5hB9zbG00ZVMfgsHM7KA65VD"; // 👈 اینجا Client Secret رو بذار
const DISCORD_REDIRECT_URI = "https://diamond-bot.p2opcnymwrvsjo3mmroimjhu.workers.dev/api/auth/callback";

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

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

async function ensureUsersTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      discord_id TEXT,
      discord_username TEXT,
      discord_avatar TEXT,
      created_at TEXT NOT NULL
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

    // =========================================================
    // 1. Health Check
    // =========================================================
    if (url.pathname === "/api/health" && method === "GET") {
      return jsonResponse({ ok: true, status: "operational", database: Boolean(env.DB) });
    }

    // =========================================================
    // 2. آمار سرور (Status)
    // =========================================================
    if (url.pathname === "/api/stats" && method === "GET") {
      try {
        if (!env.BOT_KEY) return jsonResponse({ ok: false, error: "BOT_KEY missing" }, 500);

        const guildResponse = await fetch(
          `https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`,
          { headers: { "Authorization": `Bot ${env.BOT_KEY}` } }
        );
        if (!guildResponse.ok) {
          const err = await guildResponse.text();
          return jsonResponse({ ok: false, error: `Discord error: ${err}` }, 500);
        }

        const guildData = await guildResponse.json();
        const totalMembers = guildData.approximate_member_count || 0;
        const onlineMembers = guildData.approximate_presence_count || 0;

        const botResponse = await fetch(
          "https://discord.com/api/v10/users/@me",
          { headers: { "Authorization": `Bot ${env.BOT_KEY}` } }
        );
        const botOnline = botResponse.ok;
        let botAvatar = null;
        if (botOnline) {
          const botData = await botResponse.json();
          botAvatar = botData.avatar
            ? `https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/0.png`;
        }

        return jsonResponse({
          ok: true,
          stats: {
            totalMembers,
            onlineMembers,
            totalServers: 1,
            botStatus: botOnline ? "online" : "offline",
            serverName: "Diamond BOT",
            botAvatar,
          },
        });
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // =========================================================
    // 3. ثبت‌نام (Register)
    // =========================================================
    if (url.pathname === "/api/register" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { username, password } = await request.json();

        if (!username || !password || username.length < 3 || password.length < 6) {
          return jsonResponse({ ok: false, error: "اطلاعات نامعتبر است (نام کاربری ۳+ و رمز ۶+ کاراکتر)" }, 400);
        }

        await ensureUsersTable(env.DB);
        const passwordHash = await sha256(password);
        const userId = `user-${crypto.randomUUID()}`;

        try {
          await env.DB.prepare(
            "INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)"
          ).bind(userId, username, passwordHash, new Date().toISOString()).run();
        } catch (e) {
          return jsonResponse({ ok: false, error: "این نام کاربری قبلاً ثبت شده است" }, 409);
        }

        return jsonResponse({ ok: true, user_id: userId, username }, 201);
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // =========================================================
    // 4. ورود (Login)
    // =========================================================
    if (url.pathname === "/api/login" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { username, password } = await request.json();

        if (!username || !password) {
          return jsonResponse({ ok: false, error: "اطلاعات نامعتبر است" }, 400);
        }

        await ensureUsersTable(env.DB);
        const passwordHash = await sha256(password);

        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE username = ? AND password_hash = ?"
        ).bind(username, passwordHash).first();

        if (!user) {
          return jsonResponse({ ok: false, error: "نام کاربری یا رمز عبور اشتباه است" }, 401);
        }

        return jsonResponse({
          ok: true,
          user: {
            id: user.id,
            username: user.username,
            discord_id: user.discord_id,
            discord_username: user.discord_username,
            discord_avatar: user.discord_avatar,
          },
        });
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // =========================================================
    // 5. اتصال دیسکورد به اکانت (Link Discord)
    // =========================================================
    if (url.pathname === "/api/link-discord" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { user_id, discord_data } = await request.json();

        if (!user_id || !discord_data) {
          return jsonResponse({ ok: false, error: "اطلاعات نامعتبر" }, 400);
        }

        await ensureUsersTable(env.DB);
        await env.DB.prepare(
          "UPDATE users SET discord_id = ?, discord_username = ?, discord_avatar = ? WHERE id = ?"
        ).bind(
          discord_data.id,
          discord_data.username,
          discord_data.avatar || null,
          user_id
        ).run();

        return jsonResponse({ ok: true, message: "دیسکورد متصل شد" });
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // =========================================================
    // 6. هدایت به صفحه لاگین دیسکورد (OAuth2)
    // =========================================================
    if (url.pathname === "/api/auth/discord" && method === "GET") {
      const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: DISCORD_REDIRECT_URI,
        response_type: "code",
        scope: "identify",
      });
      return Response.redirect(
        `https://discord.com/api/oauth2/authorize?${params.toString()}`,
        302
      );
    }

    // =========================================================
    // 7. Callback دیسکورد (دریافت کد و گرفتن توکن)
    // =========================================================
    if (url.pathname === "/api/auth/callback" && method === "GET") {
      const code = url.searchParams.get("code");
      if (!code) {
        return Response.redirect(`${ALLOWED_ORIGIN}/login?error=no_code`, 302);
      }

      try {
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: DISCORD_REDIRECT_URI,
          }),
        });

        if (!tokenRes.ok) {
          return Response.redirect(`${ALLOWED_ORIGIN}/login?error=token_failed`, 302);
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        const userRes = await fetch("https://discord.com/api/v10/users/@me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userRes.ok) {
          return Response.redirect(`${ALLOWED_ORIGIN}/login?error=user_failed`, 302);
        }

        const userData = await userRes.json();

        const avatarUrl = userData.avatar
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;

        // ذخیره در دیتابیس (اگه کاربر با سایت لاگین کرده باشه)
        await ensureUsersTable(env.DB);
        await env.DB.prepare(
          "UPDATE users SET discord_id = ?, discord_username = ?, discord_avatar = ? WHERE discord_id = ? OR discord_id IS NULL LIMIT 1"
        ).bind(userData.id, userData.username, avatarUrl, userData.id).run();

        // هدایت به داشبورد با اطلاعات دیسکورد در URL
        const redirectUrl = new URL(`${ALLOWED_ORIGIN}/dashboard`);
        redirectUrl.searchParams.set("discord_id", userData.id);
        redirectUrl.searchParams.set("discord_username", userData.username);
        redirectUrl.searchParams.set("discord_avatar", avatarUrl);

        return Response.redirect(redirectUrl.toString(), 302);

      } catch (error) {
        return Response.redirect(`${ALLOWED_ORIGIN}/login?error=server_error`, 302);
      }
    }

    // =========================================================
    // 8. ثبت سفارش
    // =========================================================
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

        await env.DB.prepare(
          "INSERT INTO shop_orders (id, token, payload, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(orderId, token, JSON.stringify(order), "pending", order.created_at, expiresAt).run();

        return jsonResponse({ 
          ok: true, order_id: orderId, token, expires_at: expiresAt, order_url: `/order/${token}`
        }, 201);
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // =========================================================
    // 9. دریافت سفارش با توکن
    // =========================================================
    const orderGetMatch = url.pathname.match(/^\/api\/order\/([a-f0-9]{64})$/);
    if (orderGetMatch && method === "GET") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB);

        const token = orderGetMatch[1];
        const row = await env.DB.prepare("SELECT * FROM shop_orders WHERE token = ?").bind(token).first();

        if (!row) return jsonResponse({ ok: false, error: "Not found" }, 404);
        if (new Date(row.expires_at) < new Date()) {
          return jsonResponse({ ok: false, expired: true, error: "لینک منقضی شده است." }, 410);
        }

        return jsonResponse({ ok: true, order: JSON.parse(row.payload) });
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // =========================================================
    // 10. ویرایش یک‌باره
    // =========================================================
    if (orderGetMatch && method === "PATCH") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB);

        const token = orderGetMatch[1];
        const data = await request.json();
        const row = await env.DB.prepare("SELECT * FROM shop_orders WHERE token = ?").bind(token).first();

        if (!row) return jsonResponse({ ok: false, error: "Not found" }, 404);
        if (new Date(row.expires_at) < new Date()) {
          return jsonResponse({ ok: false, expired: true, error: "لینک منقضی شده" }, 410);
        }

        const order = JSON.parse(row.payload);
        if (order.edited_at) {
          return jsonResponse({ ok: false, error: "فقط یک بار امکان ویرایش وجود دارد" }, 403);
        }

        const oldContact = `${order.platform}: ${order.platform_user_id}`;
        const newContact = data.contact || "";

        order.platform = newContact.split(":")[0]?.trim() || order.platform;
        order.platform_user_id = newContact.split(":")[1]?.trim() || order.platform_user_id;
        order.edited_at = new Date().toISOString();
        order.edit_history = JSON.stringify({ old: oldContact, new: newContact });

        await env.DB.prepare(
          "UPDATE shop_orders SET payload = ?, edited_at = ?, edit_history = ? WHERE token = ?"
        ).bind(JSON.stringify(order), order.edited_at, order.edit_history, token).run();

        return jsonResponse({ ok: true, message: "ویرایش انجام شد", order });
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message }, 500);
      }
    }

    // =========================================================
    // 11. API ربات
    // =========================================================
    if (url.pathname === "/api/bot/orders" && method === "GET") {
      if (!isBotAuthorized(request, env)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
      if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
      await ensureOrdersTable(env.DB);

      const result = await env.DB.prepare(
        "SELECT * FROM shop_orders WHERE status = 'pending' ORDER BY created_at ASC LIMIT 100"
      ).all();

      const orders = (result.results || []).map(row => JSON.parse(row.payload));

      if (orders.length > 0) {
        const placeholders = orders.map(() => "?").join(",");
        await env.DB.prepare(
          `UPDATE shop_orders SET status = 'processing' WHERE id IN (${placeholders})`
        ).bind(...orders.map(o => o.id)).run();
      }

      return jsonResponse({ ok: true, orders });
    }

    // =========================================================
    // 12. تایید ساخت تیکت
    // =========================================================
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

    // =========================================================
    // 13. فایل‌های استاتیک
    // =========================================================
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return jsonResponse({ ok: false, error: "Not found" }, 404);
  },
};
