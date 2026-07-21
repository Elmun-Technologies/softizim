export const site = {
  name: "Softizim",
  tagline: "Zamonaviy dasturiy yechimlar platformasi",
  description:
    "Softizim — biznesingiz uchun veb, mobil va SaaS mahsulotlarini ishlab chiqadigan dasturiy injiniring studiyasi. G'oyadan ishga tushirishgacha.",
  url: "https://softizim.uz",
  email: "info@softizim.uz",
  phone: "+998 90 000 00 00",
  address: "Toshkent, O'zbekiston",
  social: {
    telegram: "https://t.me/softizim",
    github: "https://github.com/elmun-technologies",
    linkedin: "https://linkedin.com/company/softizim",
    instagram: "https://instagram.com/softizim",
  },
} as const;

export const nav = [
  { label: "Xizmatlar", href: "/xizmatlar" },
  { label: "Loyihalar", href: "/loyihalar" },
  { label: "Blog", href: "/blog" },
  { label: "Biz haqimizda", href: "/biz-haqimizda" },
  { label: "Aloqa", href: "/aloqa" },
] as const;

export type Service = {
  slug: string;
  icon: string;
  title: string;
  short: string;
  description: string;
  features: string[];
};

export const services: Service[] = [
  {
    slug: "veb-ishlab-chiqish",
    icon: "globe",
    title: "Veb ishlab chiqish",
    short: "Tez, xavfsiz va zamonaviy veb-saytlar hamda veb-ilovalar.",
    description:
      "Next.js va React asosida yuqori tezlikdagi, SEO-ga moslashgan va kengaytiriladigan veb-platformalar quramiz. Landing sahifadan tortib murakkab korporativ tizimlargacha.",
    features: [
      "Next.js / React / TypeScript",
      "SEO va tezlik optimizatsiyasi",
      "Responsive va moslashuvchan dizayn",
      "Admin panel va CMS integratsiyasi",
    ],
  },
  {
    slug: "mobil-ilovalar",
    icon: "phone",
    title: "Mobil ilovalar",
    short: "iOS va Android uchun bitta koddan ishlaydigan ilovalar.",
    description:
      "React Native va Flutter yordamida har ikki platformada bir xil sifatli, tez va chiroyli mobil ilovalar ishlab chiqamiz.",
    features: [
      "iOS va Android (cross-platform)",
      "Push bildirishnomalar",
      "Offline rejim va sinxronizatsiya",
      "App Store / Play Market chiqarish",
    ],
  },
  {
    slug: "saas-platformalar",
    icon: "layers",
    title: "SaaS platformalar",
    short: "Obuna asosidagi bulutli mahsulotlarni noldan quramiz.",
    description:
      "Ko'p ijarali (multi-tenant) arxitektura, to'lov tizimlari va analitika bilan to'liq SaaS mahsulotlarini yaratamiz va boshqaramiz.",
    features: [
      "Multi-tenant arxitektura",
      "To'lov va obuna (billing)",
      "Rol asosidagi ruxsatlar",
      "Analitika va hisobotlar",
    ],
  },
  {
    slug: "ui-ux-dizayn",
    icon: "sparkles",
    title: "UI/UX dizayn",
    short: "Foydalanuvchini o'ylagan, konversiyani oshiruvchi dizayn.",
    description:
      "Foydalanuvchi tadqiqotidan prototipgacha — mahsulotingizni tushunarli, chiroyli va sotuvchi qiladigan interfeyslar loyihalaymiz.",
    features: [
      "Foydalanuvchi tadqiqoti",
      "Interaktiv prototip (Figma)",
      "Dizayn tizimi (Design System)",
      "Foydalanuvchi testlari",
    ],
  },
  {
    slug: "ai-integratsiya",
    icon: "cpu",
    title: "AI integratsiya",
    short: "Biznesingizga sun'iy intellektni joriy qilamiz.",
    description:
      "Chatbotlar, hujjatlarni tahlil qilish, tavsiya tizimlari va avtomatlashtirish — zamonaviy AI modellarini mahsulotingizga ulaymiz.",
    features: [
      "Chatbot va yordamchilar",
      "Hujjat va matn tahlili",
      "Tavsiya tizimlari",
      "Jarayonlarni avtomatlashtirish",
    ],
  },
  {
    slug: "devops-bulut",
    icon: "server",
    title: "DevOps va bulut",
    short: "Barqaror, xavfsiz va avtomatlashtirilgan infratuzilma.",
    description:
      "CI/CD, konteynerlashtirish va bulutli infratuzilma bilan mahsulotingizni ishonchli va tez yetkazib beramiz.",
    features: [
      "CI/CD avtomatlashtirish",
      "Docker / Kubernetes",
      "Monitoring va loglar",
      "Xavfsizlik va zaxira nusxa",
    ],
  },
];

export const stats = [
  { value: "50+", label: "Yakunlangan loyiha" },
  { value: "30+", label: "Mamnun mijoz" },
  { value: "8", label: "Yillik tajriba" },
  { value: "99.9%", label: "Tizim barqarorligi" },
];

export const features = [
  {
    icon: "rocket",
    title: "Tez ishga tushirish",
    text: "MVP mahsulotni haftalar ichida bozorga chiqaramiz — oylab kutish yo'q.",
  },
  {
    icon: "shield",
    title: "Xavfsizlik birinchi o'rinda",
    text: "Ma'lumotlaringiz shifrlangan, tizimlar xalqaro standartlarga mos.",
  },
  {
    icon: "code",
    title: "Toza va kengaytiriladigan kod",
    text: "Kelajakda oson rivojlantiriladigan, hujjatlashtirilgan arxitektura.",
  },
  {
    icon: "headset",
    title: "24/7 qo'llab-quvvatlash",
    text: "Ishga tushirgandan keyin ham yoningizdamiz — texnik yordam kafolatlangan.",
  },
];

export const process = [
  {
    step: "01",
    title: "Tahlil va reja",
    text: "Biznesingizni o'rganamiz, talablarni aniqlaymiz va aniq yo'l xaritasini tuzamiz.",
  },
  {
    step: "02",
    title: "Dizayn va prototip",
    text: "Interfeys va foydalanuvchi tajribasini loyihalab, prototipni tasdiqlaymiz.",
  },
  {
    step: "03",
    title: "Ishlab chiqish",
    text: "Chaqqon (Agile) uslubda kod yozamiz va har hafta natijani ko'rsatamiz.",
  },
  {
    step: "04",
    title: "Ishga tushirish",
    text: "Mahsulotni sinovdan o'tkazib, ishga tushiramiz va qo'llab-quvvatlaymiz.",
  },
];

export type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
};

export const plans: Plan[] = [
  {
    name: "Start",
    price: "9 mln",
    period: "so'mdan",
    description: "Kichik biznes va startaplar uchun boshlang'ich yechim.",
    features: [
      "Landing yoki oddiy veb-sayt",
      "Responsive dizayn",
      "Asosiy SEO sozlamalari",
      "1 oy bepul qo'llab-quvvatlash",
    ],
    cta: "Boshlash",
  },
  {
    name: "Biznes",
    price: "29 mln",
    period: "so'mdan",
    description: "O'sib borayotgan bizneslar uchun to'liq veb-platforma.",
    popular: true,
    features: [
      "Ko'p sahifali veb-ilova",
      "Admin panel va CMS",
      "To'lov tizimi integratsiyasi",
      "AI chatbot integratsiyasi",
      "3 oy bepul qo'llab-quvvatlash",
    ],
    cta: "Buyurtma berish",
  },
  {
    name: "Korxona",
    price: "Kelishilgan",
    period: "narx",
    description: "Yirik loyihalar va maxsus SaaS mahsulotlari uchun.",
    features: [
      "Maxsus SaaS platforma",
      "Multi-tenant arxitektura",
      "DevOps va bulut infratuzilma",
      "Alohida menejer va SLA",
      "Doimiy qo'llab-quvvatlash",
    ],
    cta: "Bog'lanish",
  },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  year: string;
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "medcare-crm",
    title: "MedCare CRM",
    category: "SaaS / Sog'liqni saqlash",
    summary:
      "Klinikalar uchun bemorlar, navbatlar va to'lovlarni boshqaruvchi bulutli CRM tizimi.",
    tags: ["Next.js", "PostgreSQL", "Billing"],
    year: "2025",
    accent: "#6366f1",
  },
  {
    slug: "bozor-marketplace",
    title: "Bozor Marketplace",
    category: "E-commerce",
    summary:
      "Ko'p sotuvchili onlayn savdo maydonchasi — to'lov, yetkazib berish va analitika bilan.",
    tags: ["React", "Node.js", "Payments"],
    year: "2025",
    accent: "#06b6d4",
  },
  {
    slug: "logistika-track",
    title: "Logistika Track",
    category: "Mobil ilova",
    summary:
      "Yuk mashinalarini real vaqtda kuzatuvchi va marshrutlarni optimallashtiruvchi ilova.",
    tags: ["React Native", "Maps", "Realtime"],
    year: "2024",
    accent: "#4f46e5",
  },
  {
    slug: "edu-platform",
    title: "EduPlatform",
    category: "Ta'lim / SaaS",
    summary:
      "Onlayn kurslar, videodarslar va imtihonlarni boshqaruvchi ta'lim platformasi.",
    tags: ["Next.js", "Video", "AI"],
    year: "2024",
    accent: "#0891b2",
  },
  {
    slug: "fintech-wallet",
    title: "Fintech Wallet",
    category: "Fintech",
    summary:
      "Onlayn hamyon va to'lovlar tizimi — xavfsiz tranzaksiyalar va analitika bilan.",
    tags: ["Security", "Payments", "Analytics"],
    year: "2023",
    accent: "#3730a3",
  },
  {
    slug: "resto-pos",
    title: "Resto POS",
    category: "SaaS / HoReCa",
    summary:
      "Restoranlar uchun buyurtma, oshxona va omborni birlashtirgan POS tizimi.",
    tags: ["Next.js", "Realtime", "POS"],
    year: "2023",
    accent: "#0e7490",
  },
];

export const testimonials = [
  {
    name: "Dilshod Karimov",
    role: "MedCare, asoschisi",
    text: "Softizim jamoasi klinikamiz uchun CRM tizimini o'ylab topilgan darajada mukammal qildi. Navbatlar 40% ga qisqardi.",
  },
  {
    name: "Nigora Yusupova",
    role: "Bozor Marketplace, direktor",
    text: "Ular shunchaki dasturchi emas — biznes hamkor. Har bir bosqichda maslahat berishdi va muddatida yetkazishdi.",
  },
  {
    name: "Sardor Rahimov",
    role: "Logistika Track, IT rahbari",
    text: "Mobil ilovamiz benuqson ishlaydi. Qo'llab-quvvatlash xizmati esa haqiqatan ham 24/7 javob beradi.",
  },
];

export const faqs = [
  {
    q: "Loyiha qancha vaqtda tayyor bo'ladi?",
    a: "Landing sahifa 1–2 hafta, o'rtacha veb-ilova 4–8 hafta, murakkab SaaS platforma esa 2–4 oy ichida tayyor bo'ladi. Aniq muddat talablarga bog'liq.",
  },
  {
    q: "Narx qanday hisoblanadi?",
    a: "Narx loyiha hajmi, funksiyalar va murakkablikka qarab belgilanadi. Bepul konsultatsiyadan so'ng aniq taklif beramiz.",
  },
  {
    q: "Ishga tushirgandan keyin qo'llab-quvvatlaysizmi?",
    a: "Ha, barcha loyihalar bepul qo'llab-quvvatlash davri bilan keladi. So'ngra oylik texnik xizmat shartnomasini taklif qilamiz.",
  },
  {
    q: "Mavjud loyihamni rivojlantira olasizmi?",
    a: "Albatta. Mavjud kodni audit qilib, uni yaxshilash yoki yangi funksiyalar qo'shish bo'yicha ishlaymiz.",
  },
  {
    q: "Kodni menga topshirasizmi?",
    a: "Ha, to'liq manba kodi va hujjatlar sizga tegishli bo'ladi. Hech qanday bog'liqlik (vendor lock-in) yo'q.",
  },
];

export type Team = {
  name: string;
  role: string;
  initials: string;
  accent: string;
};

export const team: Team[] = [
  {
    name: "Nazirjon Elmurodov",
    role: "Asoschisi & CEO",
    initials: "NE",
    accent: "#6366f1",
  },
  {
    name: "Jasur Aliyev",
    role: "Bosh muhandis (CTO)",
    initials: "JA",
    accent: "#06b6d4",
  },
  {
    name: "Malika Tosheva",
    role: "Bosh dizayner",
    initials: "MT",
    accent: "#4f46e5",
  },
  {
    name: "Bekzod Rustamov",
    role: "Loyihalar menejeri",
    initials: "BR",
    accent: "#0891b2",
  },
];

export type Job = {
  slug: string;
  title: string;
  type: string;
  location: string;
  level: string;
  summary: string;
  requirements: string[];
};

export const jobs: Job[] = [
  {
    slug: "frontend-muhandis",
    title: "Frontend muhandis",
    type: "To'liq stavka",
    location: "Toshkent / Masofaviy",
    level: "Middle–Senior",
    summary:
      "React va Next.js asosida chiroyli, tez va foydalanuvchini o'ylagan interfeyslar quramiz. Jamoamizga tajribali frontend muhandis izlaymiz.",
    requirements: [
      "React va TypeScript'da 3+ yil tajriba",
      "Next.js bilan ishlagan bo'lish",
      "Tailwind CSS yoki zamonaviy CSS bilimi",
      "Toza kod va jamoada ishlash madaniyati",
    ],
  },
  {
    slug: "backend-muhandis",
    title: "Backend muhandis",
    type: "To'liq stavka",
    location: "Toshkent / Masofaviy",
    level: "Middle–Senior",
    summary:
      "Barqaror va kengaytiriladigan API va tizimlar quramiz. Node.js yoki boshqa zamonaviy stack'da tajribali muhandis kutamiz.",
    requirements: [
      "Node.js / Go / Python'da 3+ yil tajriba",
      "SQL va NoSQL ma'lumotlar bazalari",
      "REST / GraphQL API dizayni",
      "Bulut va CI/CD bilan tanishlik",
    ],
  },
  {
    slug: "mahsulot-dizayneri",
    title: "Mahsulot dizayneri (UI/UX)",
    type: "To'liq stavka",
    location: "Toshkent",
    level: "Middle",
    summary:
      "Foydalanuvchi tadqiqotidan tayyor interfeysgacha — mahsulotlarimiz dizaynini shakllantiruvchi ijodkor dizayner izlaymiz.",
    requirements: [
      "Figma'da yuqori darajada ishlash",
      "Dizayn tizimlari bilan tajriba",
      "Portfolio (real loyihalar)",
      "Foydalanuvchi tajribasiga e'tibor",
    ],
  },
];

export const perks = [
  { icon: "rocket", title: "O'sish imkoniyati", text: "Zamonaviy loyihalar va doimiy o'rganish muhiti." },
  { icon: "globe", title: "Masofaviy ish", text: "Moslashuvchan jadval va masofadan ishlash imkoniyati." },
  { icon: "headset", title: "Kuchli jamoa", text: "Tajribali va bir-birini qo'llab-quvvatlovchi jamoa." },
  { icon: "sparkles", title: "Raqobatbardosh maosh", text: "Bilim va natijaga yarasha munosib ish haqi." },
];
