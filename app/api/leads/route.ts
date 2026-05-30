import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type LeadRequest = {
  name?: unknown;
  email?: unknown;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return createClient(url, publishableKey, {
    auth: {
      persistSession: false
    }
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LeadRequest | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { message: "请输入有效的邮箱地址。" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase 环境变量尚未配置。" },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("landing_leads").insert({
    name: name || null,
    email
  });

  if (error) {
    const duplicateEmail = error.code === "23505";
    return NextResponse.json(
      {
        message: duplicateEmail
          ? "这个邮箱已经在名单中。"
          : "暂时无法保存预约信息。"
      },
      { status: duplicateEmail ? 409 : 500 }
    );
  }

  return NextResponse.json({ message: "已加入预约名单。" });
}
