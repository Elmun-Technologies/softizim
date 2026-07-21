import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Noto'g'ri so'rov formati." },
      { status: 400 }
    );
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Ism kamida 2 ta belgidan iborat bo'lishi kerak." },
      { status: 422 }
    );
  }
  if (!emailRe.test(email)) {
    return NextResponse.json(
      { error: "To'g'ri email manzilini kiriting." },
      { status: 422 }
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Xabar kamida 10 ta belgidan iborat bo'lishi kerak." },
      { status: 422 }
    );
  }

  // Ishlab chiqarishda bu yerda xabar email/CRM/Telegram'ga yuboriladi.
  // Hozircha so'rovni logga yozamiz.
  console.log("Yangi murojaat:", {
    name,
    email,
    phone: data.phone,
    service: data.service,
    message,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
