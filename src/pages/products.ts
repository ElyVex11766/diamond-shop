export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  tag: string | null;
  category: string;
  capeTexture?: string;
  no3D?: boolean;
  unit?: string;
  isSingle?: boolean;
}

export const allProducts: Product[] = [
  { id: "v2ray-1", name: "کانفیگ | V2Ray", nameEn: "V2Ray Config", price: 1500, image: "/images/v2ray.png", tag: null, category: "network", unit: "گیگ" },
  { id: "v2ray-2", name: "V2Ray یک سال نامحدود", nameEn: "V2Ray Unlimited", price: 398000, image: "/images/v2ray-year.png", tag: "پرفروش", category: "network", isSingle: true },
  { id: "mc-fa", name: "اکانت فول اکسس", nameEn: "Minecraft Full Access", price: 1700000, image: "/images/mc-account.png", tag: null, category: "accounts", isSingle: true },
  { id: "mc-nfa", name: "اکانت NFA", nameEn: "Minecraft NFA", price: 5000, image: "/images/mc-account-nfa.png", tag: null, category: "accounts", isSingle: true },

  { id: "cape-builder", name: "کیپ ماینکرفت | Builder", nameEn: "Builder Cape", price: 30000, image: "/images/builder.png", tag: null, category: "capes", capeTexture: "https://vrc.lol/cape?hash=2c579968c64c1719740fd8c2a451461879b238002574fce48f7d1a7c36a1c7d4", unit: "عدد" },
  { id: "cape-copper", name: "کیپ ماینکرفت | Copper", nameEn: "Copper Cape", price: 45000, image: "/images/copper.png", tag: null, category: "capes", capeTexture: "https://vrc.lol/cape?hash=5e6f3193e74cd16cdd6637d9bae5484e3a37ff2a14c2d157c659a07810b1bdca", unit: "عدد" },
  { id: "cape-exp", name: "کیپ ماینکرفت | Experience", nameEn: "Experience Cape", price: 6700000, image: "/images/experience.png", tag: "افسانه‌ای", category: "capes", capeTexture: "https://vrc.lol/cape?hash=7658c5025c77cfac7574aab3af94a46a8886e3b7722a895255fbf22ab8652434", unit: "عدد" },
  { id: "cape-hero", name: "کیپ ماینکرفت | Hero", nameEn: "Hero Cape", price: 1800000, image: "/images/hero.png", tag: "کمیاب", category: "capes", capeTexture: "https://vrc.lol/cape?hash=bb384a1079b9a6f2811520c7991b6e8150d02e5a96457e44509e30822f72f38e", unit: "عدد" },
  { id: "cape-home", name: "کیپ ماینکرفت | Home", nameEn: "Home Cape", price: 65000, image: "/images/home.png", tag: null, category: "capes", capeTexture: "https://vrc.lol/cape?hash=1de21419009db483900da6298a1e6cbf9f1bc1523a0dcdc16263fab150693edd", unit: "عدد" },
  { id: "cape-menace", name: "کیپ ماینکرفت | Menace", nameEn: "Menace Cape", price: 220000, image: "/images/menace.png", tag: null, category: "capes", capeTexture: "https://vrc.lol/cape?hash=dbc21e222528e30dc88445314f7be6ff12d3aeebc3c192054fba7e3b3f8c77b1", unit: "عدد" },
  { id: "cape-twisted", name: "کیپ ماینکرفت | Twisted", nameEn: "Twisted Cape", price: 2100000, image: "/images/twisted.png", tag: null, category: "capes", capeTexture: "https://vrc.lol/cape?hash=24aafc451aa2cc34ddc7265211678585c0ef4da4d32edb75ecec1bd8b5408381", unit: "عدد" },
  { id: "cape-purple", name: "کیپ ماینکرفت | Purple Heart", nameEn: "Purple Heart Cape", price: 1800000, image: "/images/purple-heart.png", tag: "کمیاب", category: "capes", capeTexture: "https://vrc.lol/cape?hash=cb40a92e32b57fd732a00fc325e7afb00a7ca74936ad50d8e860152e482cfbde", unit: "عدد" },
  { id: "cape-tiktok", name: "کیپ ماینکرفت | Followers [ NFA ]", nameEn: "TikTok Cape", price: 5000, image: "/images/tiktok.png", tag: null, category: "capes", capeTexture: "https://vrc.lol/cape?hash=569b7f2a1d00d26f30efe3f9ab9ac817b1e6d35f4f3cfb0324ef2d328223d350", unit: "عدد" },
  { id: "cape-twitch", name: "کیپ ماینکرفت | Twitch [ NFA ]", nameEn: "Twitch Cape", price: 5000, image: "/images/twitch-cape.png", tag: null, category: "capes", capeTexture: "https://vrc.lol/cape?hash=cb40a92e32b57fd732a00fc325e7afb00a7ca74936ad50d8e860152e482cfbde", unit: "عدد" },
  { id: "cape-optifine", name: "کیپ ماینکرفت | Optifine", nameEn: "Optifine Cape", price: 8000, image: "/images/op-cape.png", tag: null, category: "capes", no3D: true, unit: "عدد" },
  { id: "cape-corrupted", name: "کیپ ماینکرفت | Corrupted", nameEn: "Corrupted Cape", price: 150000, image: "/images/corrupte.png", tag: null, category: "capes", no3D: true, unit: "عدد" },

  { id: "donut-money", name: "پول دونات اس ام پی", nameEn: "Donut SMP Money", price: 3000, image: "/images/donut.png", tag: null, category: "donut", unit: "ملیون" },
  { id: "discord-bot", name: "ساخت ربات | دیسکورد", nameEn: "Custom Bot", price: 400000, image: "/images/discord-bot.png", tag: null, category: "discord", isSingle: true },
  { id: "discord-server", name: "ساخت سرور | دیسکورد", nameEn: "Custom Server", price: 250000, image: "/images/discord-server.png", tag: null, category: "discord", isSingle: true },
  { id: "boost-2", name: "۲ سرور بوست | دیسکورد", nameEn: "2x Boost", price: 150000, image: "/images/boost.png", tag: null, category: "discord", isSingle: true },
  { id: "boost-4", name: "۴ سرور بوست | دیسکورد", nameEn: "4x Boost", price: 260000, image: "/images/boost.png", tag: null, category: "discord", isSingle: true },
  { id: "boost-6", name: "۶ سرور بوست | دیسکورد", nameEn: "6x Boost", price: 360000, image: "/images/boost.png", tag: null, category: "discord", isSingle: true },
  { id: "boost-8", name: "۸ سرور بوست | دیسکورد", nameEn: "8x Boost", price: 450000, image: "/images/boost.png", tag: null, category: "discord", isSingle: true },
  { id: "boost-10", name: "۱۰ سرور بوست | دیسکورد", nameEn: "10x Boost", price: 550000, image: "/images/boost.png", tag: null, category: "discord", isSingle: true },
  { id: "boost-12", name: "۱۲ سرور بوست | دیسکورد", nameEn: "12x Boost", price: 600000, image: "/images/boost.png", tag: "به‌صرفه‌ترین", category: "discord", isSingle: true },
  { id: "boost-14", name: "۱۴ سرور بوست | دیسکورد", nameEn: "14x Boost", price: 700000, image: "/images/boost.png", tag: "به‌صرفه‌ترین", category: "discord", isSingle: true },

  { id: "skin-50", name: "ساخت اسکین ۵۰٪ | ماینکرفت", nameEn: "Skin 50%", price: 50000, image: "/images/skin50.png", tag: null, category: "other", isSingle: true },
  { id: "skin-100", name: "ساخت اسکین ۱۰۰٪ | ماینکرفت", nameEn: "Skin 100%", price: 120000, image: "/images/skin100.png", tag: null, category: "other", isSingle: true },
  { id: "photoshop", name: "پکیج فوتوشاپ", nameEn: "Photoshop Pack", price: 120000, image: "/images/photoshop.png", tag: null, category: "other", isSingle: true },
];
