const ALLOWED_ORIGIN = "https://diamond-shop.p2opcnymwrvsjo3mmroimjhu.workers.dev";
const ORDER_EXPIRY_MINUTES = 180;
const GUILD_ID = "1551236517442224319";
const DISCORD_CLIENT_ID = "1557796189422755952";
const DISCORD_CLIENT_SECRET = "haZNe0sJ5hB9zbG00ZVMfgsHM7KA65VD";
const DISCORD_REDIRECT_URI = "https://diamond-shop.p2opcnymwrvsjo3mmroimjhu.workers.dev/api/auth/callback";
const ADMIN_USERNAME = "elyas";
const ADMIN_PASSWORD = "elyas_gang_11766";
const TESTER_USERNAME = "elyas";
const TESTER_PASSWORD = "elyas_gang_11766";
const FAR_FUTURE = "2077-01-01T00:00:00.000Z";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": ALLOWED_ORIGIN, "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS, DELETE", "Access-Control-Allow-Headers": "Content-Type, Authorization" },
  });
}

function isBotAuthorized(request, env) {
  const expected = String(env.SHOP_API_KEY || "");
  const supplied = String(request.headers.get("Authorization") || "");
  return Boolean(expected) && supplied === `Bearer ${expected}`;
}
function isAdminAuthorized(username, password) { return username === ADMIN_USERNAME && password === ADMIN_PASSWORD; }
function generateToken() { const array = new Uint8Array(32); crypto.getRandomValues(array); return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join(""); }
async function safeJson(request) { try { const raw = await request.text(); if (!raw || !raw.trim()) return {}; return JSON.parse(raw); } catch { return {}; } }
async function findOrder(db, value) { let row = await db.prepare("SELECT * FROM shop_orders WHERE token = ?").bind(value).first(); if (!row) row = await db.prepare("SELECT * FROM shop_orders WHERE id = ?").bind(value).first(); return row; }

async function ensureOrdersTable(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS shop_orders (id TEXT PRIMARY KEY, token TEXT UNIQUE NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', discord_channel_id TEXT, created_at TEXT NOT NULL, expires_at TEXT, edited_at TEXT, edit_history TEXT)`).run();
  const cols = await db.prepare("PRAGMA table_info(shop_orders)").all(); const existing = (cols.results || []).map(c => c.name);
  if (!existing.includes("user_id")) await db.prepare("ALTER TABLE shop_orders ADD COLUMN user_id TEXT").run();
  if (!existing.includes("delivery_info")) await db.prepare("ALTER TABLE shop_orders ADD COLUMN delivery_info TEXT").run();
  if (!existing.includes("completed_at")) await db.prepare("ALTER TABLE shop_orders ADD COLUMN completed_at TEXT").run();
  if (!existing.includes("admin_discord_id")) await db.prepare("ALTER TABLE shop_orders ADD COLUMN admin_discord_id TEXT").run();
  if (!existing.includes("started_at")) await db.prepare("ALTER TABLE shop_orders ADD COLUMN started_at TEXT").run();
}
async function ensureUsersTable(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, email TEXT, discord_id TEXT, discord_username TEXT, discord_avatar TEXT, created_at TEXT NOT NULL, last_ip TEXT, last_login TEXT, last_ip_country TEXT)`).run();
  const cols = await db.prepare("PRAGMA table_info(users)").all(); const existing = (cols.results || []).map(c => c.name);
  if (!existing.includes("email")) await db.prepare("ALTER TABLE users ADD COLUMN email TEXT").run();
  if (!existing.includes("last_ip_country")) await db.prepare("ALTER TABLE users ADD COLUMN last_ip_country TEXT").run();
  if (!existing.includes("phone")) await db.prepare("ALTER TABLE users ADD COLUMN phone TEXT").run();
  if (!existing.includes("ip_history")) await db.prepare("ALTER TABLE users ADD COLUMN ip_history TEXT").run();
}
async function ensureNotificationsTable(db) { await db.prepare(`CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, order_id TEXT, type TEXT NOT NULL, message TEXT NOT NULL, read_at TEXT, created_at TEXT NOT NULL)`).run(); }
async function ensureLeaderboardTable(db) { await db.prepare(`CREATE TABLE IF NOT EXISTS leaderboard (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT NOT NULL, time INTEGER NOT NULL, created_at TEXT NOT NULL)`).run(); }
async function ensureDailyPlaysTable(db) { await db.prepare(`CREATE TABLE IF NOT EXISTS daily_plays (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT NOT NULL, played_at TEXT NOT NULL)`).run(); }
async function cleanupExpiredOrders(db) { const now = new Date().toISOString(); await db.prepare(`DELETE FROM shop_orders WHERE expires_at IS NOT NULL AND expires_at < ? AND status IN ('pending', 'confirmed')`).bind(now).run(); }
function normalizeOrder(data, id, token, expiresAt, userId) { return { id, token, user_id: userId || null, product: data.product || "Item", amount: Number(data.amount) || 1, unit_price: Number(data.unit_price) || 0, total: Number(data.total) || 0, platform: "site", platform_user_id: "site", phone: "", status: "pending", discord_channel_id: null, created_at: new Date().toISOString(), expires_at: expiresAt, edited_at: null, edit_history: null, delivery_info: null, completed_at: null, started_at: null, admin_discord_id: null }; }
async function updateUserIp(db, userId, ip, country) {
  if (country !== "IR" || !ip || ip === "نامشخص") return; const user = await db.prepare("SELECT ip_history FROM users WHERE id = ?").bind(userId).first(); if (!user) return;
  let history = []; try { history = user.ip_history ? JSON.parse(user.ip_history) : []; } catch { history = []; }
  if (history.includes(ip)) { await db.prepare("UPDATE users SET last_ip = ?, last_ip_country = ?, last_login = ? WHERE id = ?").bind(ip, country, new Date().toISOString(), userId).run(); return; }
  history.push(ip); if (history.length > 6) history = history.slice(-6);
  await db.prepare("UPDATE users SET last_ip = ?, last_ip_country = ?, last_login = ?, ip_history = ? WHERE id = ?").bind(ip, country, new Date().toISOString(), JSON.stringify(history), userId).run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url); const method = request.method;
    if (method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN, "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS, DELETE", "Access-Control-Allow-Headers": "Content-Type, Authorization" } });

    if (url.pathname === "/api/health" && method === "GET") return jsonResponse({ ok: true, status: "operational", database: Boolean(env.DB) });

    if (url.pathname === "/api/stats" && method === "GET") {
      try {
        if (!env.BOT_KEY) return jsonResponse({ ok: false, error: "BOT_KEY missing" }, 500);
        const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`, { headers: { "Authorization": `Bot ${env.BOT_KEY}` } });
        if (!guildResponse.ok) return jsonResponse({ ok: false, error: "Discord error" }, 500);
        const guildData = await guildResponse.json();
        const iconUrl = guildData.icon ? `https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.png` : "/images/ZyloxLogoRemoveBG.png";
        const proxiedIcon = guildData.icon ? `https://images.weserv.nl/?url=${encodeURIComponent(iconUrl.replace("https://", ""))}` : iconUrl;
        return jsonResponse({ ok: true, stats: { totalMembers: guildData.approximate_member_count || 0, onlineMembers: guildData.approximate_presence_count || 0, serverName: "Zylox Shop", icon: proxiedIcon } });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    // 👈 اخبار (Announcement)
    if (url.pathname === "/api/discord/announcements" && method === "GET") {
      try {
        if (!env.BOT_KEY) return jsonResponse({ ok: false, error: "BOT_KEY missing" }, 500);
        const channelId = "1571163765888524469";
        const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=10`, { headers: { "Authorization": `Bot ${env.BOT_KEY}` } });
        if (!res.ok) return jsonResponse({ ok: false, error: "Discord error" }, 500);
        const messages = await res.json();
        const safeMessages = messages.map(m => {
          const avUrl = m.author.avatar ? `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/0.png`;
          return { ...m, author: { ...m.author, avatar_url: `https://images.weserv.nl/?url=${encodeURIComponent(avUrl.replace("https://", ""))}` } };
        });
        return jsonResponse({ ok: true, messages: safeMessages });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    // 👈 ویچرها (Vouch)
    if (url.pathname === "/api/discord/vouch" && method === "GET") {
      try {
        if (!env.BOT_KEY) return jsonResponse({ ok: false, error: "BOT_KEY missing" }, 500);
        const channelId = "1551310628860334140";
        const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=10`, { headers: { "Authorization": `Bot ${env.BOT_KEY}` } });
        if (!res.ok) return jsonResponse({ ok: false, error: "Discord error" }, 500);
        const messages = await res.json();
        const safeMessages = messages.map(m => {
          const avUrl = m.author.avatar ? `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/0.png`;
          return { ...m, author: { ...m.author, avatar_url: `https://images.weserv.nl/?url=${encodeURIComponent(avUrl.replace("https://", ""))}` } };
        });
        return jsonResponse({ ok: true, messages: safeMessages });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/register" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { username, password, phone } = await safeJson(request);
        const userIp = request.headers.get("CF-Connecting-IP") || "نامشخص"; const userIpCountry = String(request.cf?.country || "XX").toUpperCase();
        if (!username || !password || username.length < 3 || password.length < 6) return jsonResponse({ ok: false, error: "اطلاعات نامعتبر است" }, 400);
        await ensureUsersTable(env.DB); const userId = `user-${crypto.randomUUID()}`;
        const isIran = userIpCountry === "IR"; const ipHistory = isIran ? JSON.stringify([userIp]) : null;
        try { await env.DB.prepare("INSERT INTO users (id, username, password, phone, created_at, last_ip, last_ip_country, ip_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(userId, username, password, phone || null, new Date().toISOString(), isIran ? userIp : null, userIpCountry, ipHistory).run(); } catch (e) { return jsonResponse({ ok: false, error: "این نام کاربری قبلاً ثبت شده است" }, 409); }
        return jsonResponse({ ok: true, user_id: userId, username }, 201);
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/login" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { username, password } = await safeJson(request);
        const userIp = request.headers.get("CF-Connecting-IP") || "نامشخص"; const userIpCountry = String(request.cf?.country || "XX").toUpperCase();
        if (!username || !password) return jsonResponse({ ok: false, error: "اطلاعات نامعتبر است" }, 400);
        await ensureUsersTable(env.DB);
        const user = await env.DB.prepare("SELECT * FROM users WHERE username = ? AND password = ?").bind(username, password).first();
        if (!user) return jsonResponse({ ok: false, error: "نام کاربری یا رمز عبور اشتباه است" }, 401);
        await updateUserIp(env.DB, user.id, userIp, userIpCountry);
        const isTester = user.username === TESTER_USERNAME && user.password === TESTER_PASSWORD;
        return jsonResponse({ ok: true, user: { id: user.id, username: user.username, email: user.email, phone: user.phone, discord_id: user.discord_id, discord_username: user.discord_username, discord_avatar: user.discord_avatar, is_tester: isTester } });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/link-discord" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { user_id, discord_data } = await safeJson(request);
        if (!user_id || !discord_data) return jsonResponse({ ok: false, error: "اطلاعات نامعتبر" }, 400);
        await ensureUsersTable(env.DB);
        await env.DB.prepare("UPDATE users SET discord_id = ?, discord_username = ?, discord_avatar = ? WHERE id = ?").bind(discord_data.id, discord_data.username, discord_data.avatar || null, user_id).run();
        return jsonResponse({ ok: true, message: "دیسکورد متصل شد" });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/auth/discord" && method === "GET") {
      const userId = url.searchParams.get("user_id") || "";
      const params = new URLSearchParams({ client_id: DISCORD_CLIENT_ID, redirect_uri: DISCORD_REDIRECT_URI, response_type: "code", scope: "identify email guilds.join", state: userId });
      return Response.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`, 302);
    }

    if (url.pathname === "/api/auth/callback" && method === "GET") {
      const code = url.searchParams.get("code"); const state = url.searchParams.get("state");
      if (!code) return Response.redirect(`${ALLOWED_ORIGIN}/dashboard?error=no_code`, 302);
      try {
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: DISCORD_CLIENT_ID, client_secret: DISCORD_CLIENT_SECRET, grant_type: "authorization_code", code, redirect_uri: DISCORD_REDIRECT_URI }) });
        if (!tokenRes.ok) return Response.redirect(`${ALLOWED_ORIGIN}/dashboard?error=token_failed`, 302);
        const tokenData = await tokenRes.json();
        const userRes = await fetch("https://discord.com/api/v10/users/@me", { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
        if (!userRes.ok) return Response.redirect(`${ALLOWED_ORIGIN}/dashboard?error=user_failed`, 302);
        const userData = await userRes.json();
        const avatarUrl = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/0.png`;
        try { await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userData.id}`, { method: "PUT", headers: { "Authorization": `Bot ${env.BOT_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ access_token: tokenData.access_token }) }); } catch (err) { console.error(err); }
        if (state && env.DB) {
          await ensureUsersTable(env.DB);
          await env.DB.prepare("UPDATE users SET discord_id = ?, discord_username = ?, discord_avatar = ?, email = ? WHERE id = ?").bind(userData.id, userData.username, avatarUrl, userData.email || null, state).run();
        }
        const redirectUrl = new URL(`${ALLOWED_ORIGIN}/dashboard`);
        redirectUrl.searchParams.set("discord_id", userData.id);
        redirectUrl.searchParams.set("discord_username", userData.username);
        redirectUrl.searchParams.set("discord_avatar", avatarUrl);
        if (userData.email) redirectUrl.searchParams.set("email", userData.email);
        return Response.redirect(redirectUrl.toString(), 302);
      } catch (error) { return Response.redirect(`${ALLOWED_ORIGIN}/dashboard?error=server_error`, 302); }
    }

    if (url.pathname === "/api/orders/create" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const data = await safeJson(request); const userId = data.user_id;
        if (!userId) return jsonResponse({ ok: false, error: "ابتدا وارد حساب شوید" }, 401);
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) return jsonResponse({ ok: false, error: "سبد خرید خالی است" }, 400);
        await ensureOrdersTable(env.DB);
        const orderId = `ORD-${crypto.randomUUID()}`; const token = generateToken();
        const expiresAt = new Date(Date.now() + ORDER_EXPIRY_MINUTES * 60 * 1000).toISOString();
        const total = data.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
        const firstItem = data.items[0];
        const order = normalizeOrder({ product: firstItem?.name || "سفارش", amount: data.items.reduce((s, i) => s + (Number(i.quantity) || 1), 0), unit_price: Number(firstItem?.price) || 0, total }, orderId, token, expiresAt, userId);
        order.items = data.items.map((i) => ({ id: i.id, name: i.name, price: Number(i.price) || 0, quantity: Number(i.quantity) || 1, image: i.image }));
        await env.DB.prepare("INSERT INTO shop_orders (id, token, payload, status, created_at, expires_at, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(orderId, token, JSON.stringify(order), "pending", order.created_at, expiresAt, userId).run();
        return jsonResponse({ ok: true, order_id: orderId, token, expires_at: expiresAt, order_url: `/order/${token}` }, 201);
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/orders/my-orders" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { user_id } = await safeJson(request); if (!user_id) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        await ensureOrdersTable(env.DB); await cleanupExpiredOrders(env.DB);
        const result = await env.DB.prepare("SELECT * FROM shop_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").bind(user_id).all();
        const orders = (result.results || []).map((row) => {
          const payload = JSON.parse(row.payload);
          return { ...payload, status: row.status, delivery_info: row.delivery_info, completed_at: row.completed_at, expires_at: row.expires_at, started_at: row.started_at, token: row.token, order_url: `/order/${row.token}` };
        });
        return jsonResponse({ ok: true, orders });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    const orderGetMatch = url.pathname.match(/^\/api\/orders\/([a-zA-Z0-9-]+)$/);
    if (orderGetMatch && method === "GET") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB); await cleanupExpiredOrders(env.DB);
        const row = await findOrder(env.DB, orderGetMatch[1]);
        if (!row) return jsonResponse({ ok: false, error: "سفارش پیدا نشد", notFound: true }, 404);
        if (row.expires_at && new Date(row.expires_at) < new Date() && ["pending", "confirmed"].includes(row.status)) return jsonResponse({ ok: false, error: "لینک منقضی شده", notFound: true }, 404);
        const payload = JSON.parse(row.payload);
        return jsonResponse({ ok: true, order: { ...payload, status: row.status, delivery_info: row.delivery_info, completed_at: row.completed_at, expires_at: row.expires_at, started_at: row.started_at, token: row.token } });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (orderGetMatch && method === "PATCH") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB);
        const row = await findOrder(env.DB, orderGetMatch[1]);
        if (!row) return jsonResponse({ ok: false, error: "سفارش پیدا نشد", notFound: true }, 404);
        if (row.expires_at && new Date(row.expires_at) < new Date() && ["pending", "confirmed"].includes(row.status)) return jsonResponse({ ok: false, error: "لینک منقضی شده", notFound: true }, 404);
        if (row.status !== "pending") return jsonResponse({ ok: false, error: "این سفارش قبلاً تأیید شده است" }, 400);
        await env.DB.prepare("UPDATE shop_orders SET status = 'confirmed' WHERE token = ?").bind(row.token).run();
        return jsonResponse({ ok: true, message: "سفارش تأیید شد" });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/bot/orders" && method === "GET") {
      if (!isBotAuthorized(request, env)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
      if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
      await ensureOrdersTable(env.DB); await cleanupExpiredOrders(env.DB);
      const result = await env.DB.prepare("SELECT * FROM shop_orders WHERE status = 'confirmed' ORDER BY created_at ASC LIMIT 100").all();
      const orders = (result.results || []).map((row) => { const payload = JSON.parse(row.payload); return { ...payload, token: row.token, status: row.status }; });
      return jsonResponse({ ok: true, orders });
    }

    const startMatch = url.pathname.match(/^\/api\/bot\/orders\/([a-zA-Z0-9-]+)\/start$/);
    if (startMatch && method === "POST") {
      try {
        if (!isBotAuthorized(request, env)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB);
        const body = await safeJson(request); const adminDiscordId = body.admin_discord_id || "";
        const row = await findOrder(env.DB, startMatch[1]);
        if (!row) return jsonResponse({ ok: false, error: "سفارش پیدا نشد", notFound: true }, 404);
        await env.DB.prepare("UPDATE shop_orders SET status = 'processing', started_at = ?, expires_at = ?, admin_discord_id = ? WHERE token = ?").bind(new Date().toISOString(), FAR_FUTURE, adminDiscordId, row.token).run();
        return jsonResponse({ ok: true, message: "سفارش در حال انجام شد", order_url: `/order/${row.token}`, token: row.token });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    const completeMatch = url.pathname.match(/^\/api\/bot\/orders\/([a-zA-Z0-9-]+)\/complete$/);
    if (completeMatch && method === "POST") {
      try {
        if (!isBotAuthorized(request, env)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB); await ensureNotificationsTable(env.DB);
        const body = await safeJson(request);
        const deliveryInfo = body.delivery_info || ""; const adminDiscordId = body.admin_discord_id || "";
        if (!deliveryInfo) return jsonResponse({ ok: false, error: "اطلاعات تحویل خالی است" }, 400);
        const row = await findOrder(env.DB, completeMatch[1]);
        if (!row) return jsonResponse({ ok: false, error: "سفارش پیدا نشد", notFound: true }, 404);
        const now = new Date().toISOString();
        await env.DB.prepare("UPDATE shop_orders SET status = 'completed', delivery_info = ?, completed_at = ?, expires_at = ?, admin_discord_id = ? WHERE token = ?").bind(deliveryInfo, now, FAR_FUTURE, adminDiscordId, row.token).run();
        if (row.user_id) {
          await env.DB.prepare("INSERT INTO notifications (id, user_id, order_id, type, message, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(`notif-${crypto.randomUUID()}`, row.user_id, row.id, "order_completed", "سفارش شما کامل شد! برای مشاهده اطلاعات تحویل کلیک کنید.", now).run();
        }
        return jsonResponse({ ok: true, message: "سفارش تکمیل شد", order_url: `/order/${row.token}`, token: row.token });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/notifications" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { user_id } = await safeJson(request); if (!user_id) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        await ensureNotificationsTable(env.DB);
        const result = await env.DB.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30").bind(user_id).all();
        return jsonResponse({ ok: true, notifications: result.results || [] });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    const readMatch = url.pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
    if (readMatch && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureNotificationsTable(env.DB);
        await env.DB.prepare("UPDATE notifications SET read_at = ? WHERE id = ?").bind(new Date().toISOString(), decodeURIComponent(readMatch[1])).run();
        return jsonResponse({ ok: true });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/admin/login" && method === "POST") {
      try {
        const { admin_username, admin_password } = await safeJson(request);
        if (isAdminAuthorized(admin_username, admin_password)) return jsonResponse({ ok: true, message: "ورود موفق" });
        return jsonResponse({ ok: false, error: "نام کاربری یا رمز عبور اشتباه است" }, 401);
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/admin/users" && method === "POST") {
      try {
        const { admin_username, admin_password } = await safeJson(request);
        if (!isAdminAuthorized(admin_username, admin_password)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureUsersTable(env.DB);
        const result = await env.DB.prepare("SELECT id, username, email, phone, discord_id, discord_username, discord_avatar, created_at, last_ip, last_ip_country, last_login, ip_history FROM users ORDER BY created_at DESC").all();
        return jsonResponse({ ok: true, users: result.results || [] });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/admin/update-user" && method === "POST") {
      try {
        const { admin_username, admin_password, user_id, new_username, new_password } = await safeJson(request);
        if (!isAdminAuthorized(admin_username, admin_password)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        if (!user_id) return jsonResponse({ ok: false, error: "آیدی کاربر نامعتبر" }, 400);
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureUsersTable(env.DB);
        if (new_username && new_password) await env.DB.prepare("UPDATE users SET username = ?, password = ? WHERE id = ?").bind(new_username, new_password, user_id).run();
        else if (new_username) await env.DB.prepare("UPDATE users SET username = ? WHERE id = ?").bind(new_username, user_id).run();
        else if (new_password) await env.DB.prepare("UPDATE users SET password = ? WHERE id = ?").bind(new_password, user_id).run();
        return jsonResponse({ ok: true, message: "تغییرات ذخیره شد" });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/admin/user-orders" && method === "POST") {
      try {
        const { admin_username, admin_password, user_id } = await safeJson(request);
        if (!isAdminAuthorized(admin_username, admin_password)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
        if (!user_id) return jsonResponse({ ok: false, error: "آیدی کاربر نامعتبر" }, 400);
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureOrdersTable(env.DB); await cleanupExpiredOrders(env.DB);
        const result = await env.DB.prepare("SELECT * FROM shop_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100").bind(user_id).all();
        const orders = (result.results || []).map((row) => {
          const payload = JSON.parse(row.payload);
          return { ...payload, status: row.status, delivery_info: row.delivery_info, completed_at: row.completed_at, expires_at: row.expires_at, started_at: row.started_at, token: row.token, order_url: `/order/${row.token}` };
        });
        return jsonResponse({ ok: true, orders });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/leaderboard" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { name, contact, time } = await safeJson(request);
        if (!name || !time || time <= 0) return jsonResponse({ ok: false, error: "اطلاعات نامعتبر" }, 400);
        await ensureLeaderboardTable(env.DB); await ensureDailyPlaysTable(env.DB);
        const today = new Date().toISOString().split("T")[0];
        const countResult = await env.DB.prepare("SELECT COUNT(*) as count FROM daily_plays WHERE name = ? AND contact = ? AND played_at LIKE ?").bind(name, contact, `${today}%`).first();
        const dailyPlays = countResult?.count || 0;
        if (dailyPlays >= 5) return jsonResponse({ ok: false, limitReached: true, message: "شما امروز ۵ بار تست داده‌اید." }, 403);
        await env.DB.prepare("INSERT INTO daily_plays (id, name, contact, played_at) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), name, contact, new Date().toISOString()).run();
        const existing = await env.DB.prepare("SELECT * FROM leaderboard WHERE name = ? AND contact = ?").bind(name, contact).first();
        if (existing) { if (time < existing.time) await env.DB.prepare("UPDATE leaderboard SET time = ?, created_at = ? WHERE id = ?").bind(time, new Date().toISOString(), existing.id).run(); }
        else { await env.DB.prepare("INSERT INTO leaderboard (id, name, contact, time, created_at) VALUES (?, ?, ?, ?, ?)").bind(crypto.randomUUID(), name, contact, time, new Date().toISOString()).run(); }
        await env.DB.prepare(`DELETE FROM leaderboard WHERE id NOT IN (SELECT id FROM leaderboard ORDER BY time ASC LIMIT 10)`).run();
        return jsonResponse({ ok: true, message: "رکورد ثبت شد", remaining: 5 - dailyPlays - 1 }, 201);
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/leaderboard" && method === "GET") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        await ensureLeaderboardTable(env.DB);
        const result = await env.DB.prepare("SELECT * FROM leaderboard ORDER BY time ASC LIMIT 10").all();
        return jsonResponse({ ok: true, entries: result.results || [] });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (url.pathname === "/api/check-limit" && method === "POST") {
      try {
        if (!env.DB) return jsonResponse({ ok: false, error: "DB missing" }, 500);
        const { name, contact } = await safeJson(request);
        if (!name || !contact) return jsonResponse({ ok: false, error: "اطلاعات نامعتبر" }, 400);
        await ensureDailyPlaysTable(env.DB);
        const today = new Date().toISOString().split("T")[0];
        const countResult = await env.DB.prepare("SELECT COUNT(*) as count FROM daily_plays WHERE name = ? AND contact = ? AND played_at LIKE ?").bind(name, contact, `${today}%`).first();
        const dailyPlays = countResult?.count || 0;
        return jsonResponse({ ok: true, dailyPlays, remaining: Math.max(0, 5 - dailyPlays) });
      } catch (error) { return jsonResponse({ ok: false, error: error.message }, 500); }
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return jsonResponse({ ok: false, error: "Not found" }, 404);
  },
};
