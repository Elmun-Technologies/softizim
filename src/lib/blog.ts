export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO
  readingMinutes: number;
  accent: string;
  content: BlogBlock[];
};

export const posts: Post[] = [
  {
    slug: "mvp-ni-tez-ishga-tushirish",
    title: "MVP'ni 6 haftada qanday ishga tushirish mumkin",
    excerpt:
      "Startap g'oyasini haftalar ichida real mahsulotga aylantirishning amaliy yo'l xaritasi va biz qo'llaydigan yondashuv.",
    category: "Mahsulot",
    author: "Softizim jamoasi",
    date: "2026-06-18",
    readingMinutes: 6,
    accent: "#6366f1",
    content: [
      {
        type: "p",
        text: "Ko'pchilik startaplar mukammal mahsulot qurishga urinib, oylab vaqt va budjetni yo'qotadi. Aslida esa bozor sizning g'oyangizni tasdiqlashini imkon qadar tez bilib olish muhimroq. Shu sababli biz MVP (Minimal Viable Product) yondashuvini qo'llaymiz.",
      },
      { type: "h2", text: "MVP nima va nima uchun kerak" },
      {
        type: "p",
        text: "MVP — bu mahsulotning eng muhim funksiyasini o'z ichiga olgan, foydalanuvchiga real qiymat beradigan eng sodda versiyasi. Uning maqsadi — g'oyani minimal xarajat bilan tekshirish.",
      },
      {
        type: "ul",
        items: [
          "Bozor talabini tez tasdiqlash",
          "Investorlarga real mahsulot ko'rsatish",
          "Foydalanuvchilardan erta fikr olish",
          "Budjetni tejash va xatarlarni kamaytirish",
        ],
      },
      { type: "h2", text: "6 haftalik jarayon" },
      {
        type: "p",
        text: "Biz jarayonni to'rt bosqichga ajratamiz: tahlil (1 hafta), dizayn va prototip (1 hafta), ishlab chiqish (3 hafta) va sinov hamda ishga tushirish (1 hafta). Har hafta oxirida mijoz aniq natijani ko'radi.",
      },
      {
        type: "quote",
        text: "Mukammallikni keyinroq quring. Avval mahsulotingiz kerakligini isbotlang.",
      },
      {
        type: "p",
        text: "Agar siz ham g'oyangizni tez sinab ko'rmoqchi bo'lsangiz, biz bilan bog'laning — bepul konsultatsiyada aniq reja tuzib beramiz.",
      },
    ],
  },
  {
    slug: "next-js-nega-tanlaymiz",
    title: "Nega veb-loyihalarimizda Next.js'ni tanlaymiz",
    excerpt:
      "Tezlik, SEO va rivojlantirish qulayligi — zamonaviy veb uchun Next.js'ning asosiy afzalliklari haqida.",
    category: "Muhandislik",
    author: "Softizim jamoasi",
    date: "2026-05-30",
    readingMinutes: 5,
    accent: "#06b6d4",
    content: [
      {
        type: "p",
        text: "Veb-texnologiyalar tez o'zgaradi, lekin ba'zi tanlovlar uzoq muddatda o'zini oqlaydi. Biz uchun Next.js aynan shunday vosita — u tezlik, xavfsizlik va rivojlantirish qulayligini birlashtiradi.",
      },
      { type: "h2", text: "Tezlik va SEO" },
      {
        type: "p",
        text: "Next.js sahifalarni serverda yoki build vaqtida oldindan generatsiya qila oladi. Bu foydalanuvchi uchun tez yuklanishni, qidiruv tizimlari uchun esa yaxshi indekslashni ta'minlaydi.",
      },
      {
        type: "ul",
        items: [
          "Statik generatsiya (SSG) — eng tez yuklanish",
          "Server render (SSR) — dinamik kontent uchun",
          "Rasm va shrift optimizatsiyasi built-in",
          "Avtomatik kod bo'lish (code splitting)",
        ],
      },
      { type: "h2", text: "Rivojlantirish qulayligi" },
      {
        type: "p",
        text: "TypeScript, App Router va boy ekotizim tufayli jamoa tez va xatosiz ishlaydi. Bu esa mijozga arzonroq va sifatliroq mahsulot degani.",
      },
      {
        type: "quote",
        text: "To'g'ri vosita tanlash — loyiha muvaffaqiyatining yarmi.",
      },
    ],
  },
  {
    slug: "biznes-uchun-ai",
    title: "Biznesingizga sun'iy intellektni qanday joriy qilish kerak",
    excerpt:
      "AI shov-shuvdan real qiymatga: qaysi vazifalarni avtomatlashtirish arziydi va nimadan boshlash kerak.",
    category: "AI",
    author: "Softizim jamoasi",
    date: "2026-05-12",
    readingMinutes: 7,
    accent: "#4f46e5",
    content: [
      {
        type: "p",
        text: "Sun'iy intellekt haqida ko'p gapiriladi, lekin ko'p bizneslar undan qanday foyda olishni bilmaydi. Muhimi — texnologiyadan boshlash emas, muammodan boshlashdir.",
      },
      { type: "h2", text: "Qaerdan boshlash kerak" },
      {
        type: "p",
        text: "Eng ko'p vaqt va resurs oladigan takrorlanuvchi vazifalarni aniqlang. Aynan shular avtomatlashtirish uchun eng yaxshi nomzodlardir.",
      },
      {
        type: "ul",
        items: [
          "Mijozlar bilan takroriy suhbatlar — chatbot",
          "Hujjatlarni tahlil qilish va saralash",
          "Mahsulot tavsiyalari",
          "Matn va kontent yaratishda yordam",
        ],
      },
      { type: "h2", text: "Real qiymatga e'tibor bering" },
      {
        type: "p",
        text: "AY loyihasi muvaffaqiyati aniq o'lchanadigan natijaga bog'liq: tejalgan vaqt, oshgan konversiya yoki kamaygan xarajat. Biz har doim shu ko'rsatkichlardan boshlaymiz.",
      },
      {
        type: "quote",
        text: "AI — maqsad emas, vosita. Muammoni hal qilsagina qiymatga ega.",
      },
    ],
  },
  {
    slug: "yaxshi-uiux-belgilari",
    title: "Yaxshi UI/UX dizaynning 5 ta belgisi",
    excerpt:
      "Foydalanuvchini o'ylagan interfeys qanday bo'ladi va u biznes ko'rsatkichlariga qanday ta'sir qiladi.",
    category: "Dizayn",
    author: "Softizim jamoasi",
    date: "2026-04-25",
    readingMinutes: 4,
    accent: "#0891b2",
    content: [
      {
        type: "p",
        text: "Chiroyli dizayn — bu shunchaki go'zallik emas. Yaxshi UI/UX foydalanuvchining maqsadiga tez yetishishiga yordam beradi va bu to'g'ridan-to'g'ri sotuvga ta'sir qiladi.",
      },
      { type: "h2", text: "Belgilar" },
      {
        type: "ul",
        items: [
          "Foydalanuvchi keyingi qadamni o'ylamasdan topadi",
          "Muhim harakatlar ko'zga tashlanadi (aniq CTA)",
          "Sahifa tez yuklanadi va silliq ishlaydi",
          "Har qanday qurilmada bir xil qulay (responsive)",
          "Xatolik holatlari tushunarli tarzda ko'rsatiladi",
        ],
      },
      {
        type: "quote",
        text: "Eng yaxshi interfeys — foydalanuvchi sezmaydigan interfeys.",
      },
      {
        type: "p",
        text: "Agar mahsulotingiz foydalanuvchilarni chalg'itayotgan bo'lsa, biz UX auditini o'tkazib, aniq yaxshilanish rejasini beramiz.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  const months = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
  ];
  const d = new Date(iso);
  return `${d.getUTCDate()}-${months[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}
