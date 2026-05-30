import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type LeadRequest = {
  name?: unknown;
  email?: unknown;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
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
      { message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase environment variables are not configured." },
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
          ? "This email is already on the list."
          : "Could not save your signup."
      },
      { status: duplicateEmail ? 409 : 500 }
    );
  }

  return NextResponse.json({ message: "You are on the list." });
}
