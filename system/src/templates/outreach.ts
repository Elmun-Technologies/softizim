import type { Lang } from '../config.js';

// Tayyor skelet shablonlar. Outreach agenti bularni kompaniyaga moslab boyitadi.
// {name}, {sector}, {event}, {city}, {booth} kabi joylar to'ldiriladi.

export const EMAIL_TEMPLATES: Record<Lang, { subject: string; body: string }> = {
  uz: {
    subject: 'Rasmiy taklif — {event}, Samarqand [{sector} yo\'nalishi]',
    body: `Assalomu alaykum!

Sof Expo — Ipak Yo'li poytaxti Samarqandda o'tadigan xalqaro ko'rgazma. {event} da
{sector} sohasidagi kompaniyalar 3 kun ichida yuzlab xaridor bilan uchrashadi.

Sizning {name} kompaniyangiz uchun 2-qatordagi burchak joyni 48 soatga ushlab turdim.
Yonida tegishli soha kompaniyalari turadi — birga mijoz almashasiz.

Early Bird narxi tez orada oshadi. Joy xaritasini yuboraymi?

Hurmat bilan, Sof Expo jamoasi`,
  },
  ru: {
    subject: 'Официальное приглашение — {event}, Самарканд [{sector}]',
    body: `Здравствуйте!

Sof Expo — международная выставка в Самарканде, столице Великого шёлкового пути.
На {event} компании отрасли «{sector}» за 3 дня встречают сотни покупателей.

Для вашей компании {name} я держу угловое место во 2-м ряду 48 часов.
Рядом — профильные компании, будете обмениваться клиентами.

Цена Early Bird скоро вырастет. Прислать интерактивную карту мест?

С уважением, команда Sof Expo`,
  },
  zh: {
    subject: '正式邀请 — {event}，撒马尔罕 [{sector}]',
    body: `您好！

Sof Expo 是在丝绸之路古都撒马尔罕举办的国际展会。在 {event}，
"{sector}" 行业的公司三天内可与数百名采购商面对面洽谈。

我为贵公司 {name} 预留了第二排的一个角位，保留 48 小时。
旁边都是同行公司，方便共享客户资源。

全包"丝绸之路套餐"含：展位 + 签证 + 报关 + 翻译 + 酒店 + 机场接送。
早鸟价即将上涨。需要我发送展位图吗？

此致，Sof Expo 团队`,
  },
};

// AI-video (HeyGen) uchun qisqa 20 soniyalik ssenariy skeleti
export const AI_VIDEO_HOOK: Record<Lang, string> = {
  uz: 'Salom {name}! Sizni shaxsan {event} ga taklif qilaman — burchak joyni ajratib qo\'ydim.',
  ru: 'Здравствуйте, {name}! Лично приглашаю вас на {event} — угловое место уже за вами.',
  zh: '{name} 您好！我个人邀请您参加 {event}，已为您预留角位展台。',
};

export function fill(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
