export type Lang = "fa" | "en";

export interface Dict {
  nav: {
    home: string;
    features: string;
    docs: string;
    shop: string;
    bot: string;
    dashboard: string;
    status: string;
    login: string;
  };
  hero: {
    subtitle: string;
    add: string;
  };
  stats: {
    placeholder: string;
  };
  shop: {
    title: string;
    subtitle: string;
  };
  features: {
    title: string;
    subtitle: string;
    giveaway: string;
    giveawayDesc: string;
    moderation: string;
    moderationDesc: string;
    antilink: string;
    antilinkDesc: string;
    security: string;
    securityDesc: string;
    polls: string;
    pollsDesc: string;
    auto: string;
    autoDesc: string;
    server: string;
    serverDesc: string;
  };
  botPage: {
    invite: string;
    status: string;
    online: string;
  };
  footer: {
    tagline: string;
    product: string;
    resources: string;
    legal: string;
    support: string;
    tos: string;
    privacy: string;
    rights: string;
  };
}

const fa: Dict = {
  nav: {
    home: "خانه",
    features: "امکانات",
    docs: "مستندات",
    shop: "فروشگاه",
    bot: "ربات",
    dashboard: "داشبورد",
    status: "وضعیت",
    login: "ورود",
  },
  hero: {
    subtitle: "فروشگاه پریمیوم اکانت، کیپ، سرویس‌های شبکه و دیسکورد — تحویل سریع و خودکار.",
    add: "مشاهده محصولات",
  },
  stats: {
    placeholder: "تحویل خودکار • پشتیبانی ۲۴/۷",
  },
  shop: {
    title: "فروشگاه Zylox",
    subtitle: "محصولات پریمیوم برای گیمینگ و دیسکورد",
  },
  features: {
    title: "امکانات ربات",
    subtitle: "همه چیزی که سرور دیسکورد شما نیاز دارد",
    giveaway: "گیواوی",
    giveawayDesc: "برگزاری قرعه‌کشی خودکار و جذاب",
    moderation: "مدیریت",
    moderationDesc: "ابزارهای قدرتمند برای مدیریت سرور",
    antilink: "آنتی‌لینک",
    antilinkDesc: "جلوگیری از ارسال لینک‌های ناخواسته",
    security: "امنیت",
    securityDesc: "محافظت از سرور در برابر حملات",
    polls: "نظرسنجی",
    pollsDesc: "ساخت نظرسنجی پیشرفته",
    auto: "خودکارسازی",
    autoDesc: "پاسخ خودکار و مدیریت نقش‌ها",
    server: "تنظیمات سرور",
    serverDesc: "کنترل کامل کانال‌ها و نقش‌ها",
  },
  botPage: {
    invite: "دعوت ربات",
    status: "وضعیت ربات",
    online: "آنلاین",
  },
  footer: {
    tagline: "فروشگاه پریمیوم گیمینگ و دیسکورد با تحویل خودکار.",
    product: "محصولات",
    resources: "منابع",
    legal: "قوانین",
    support: "پشتیبانی",
    tos: "شرایط استفاده",
    privacy: "حریم خصوصی",
    rights: "تمام حقوق محفوظ است.",
  },
};

const en: Dict = {
  nav: {
    home: "Home",
    features: "Features",
    docs: "Docs",
    shop: "Shop",
    bot: "Bot",
    dashboard: "Dashboard",
    status: "Status",
    login: "Login",
  },
  hero: {
    subtitle: "Premium shop for accounts, capes, network services and Discord — fast automated delivery.",
    add: "View Products",
  },
  stats: {
    placeholder: "Auto delivery • 24/7 Support",
  },
  shop: {
    title: "Zylox Shop",
    subtitle: "Premium products for gaming and Discord",
  },
  features: {
    title: "Bot Features",
    subtitle: "Everything your Discord server needs",
    giveaway: "Giveaways",
    giveawayDesc: "Run automated and engaging giveaways",
    moderation: "Moderation",
    moderationDesc: "Powerful tools for server management",
    antilink: "Anti-Link",
    antilinkDesc: "Prevent unwanted link sharing",
    security: "Security",
    securityDesc: "Protect your server from attacks",
    polls: "Polls",
    pollsDesc: "Create advanced polls",
    auto: "Automation",
    autoDesc: "Auto replies and role management",
    server: "Server Settings",
    serverDesc: "Full control over channels and roles",
  },
  botPage: {
    invite: "Invite Bot",
    status: "Bot Status",
    online: "Online",
  },
  footer: {
    tagline: "Premium gaming and Discord shop with automated delivery.",
    product: "Products",
    resources: "Resources",
    legal: "Legal",
    support: "Support",
    tos: "Terms of Service",
    privacy: "Privacy Policy",
    rights: "All rights reserved.",
  },
};

export const translations: Record<Lang, Dict> = { fa, en };
