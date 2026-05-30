"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email")
      })
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setState("error");
      setMessage(payload.message ?? "Something went wrong.");
      return;
    }

    form.reset();
    setState("success");
    setMessage(payload.message ?? "You are on the list.");
  }

  return (
    <main>
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Vercel + Next.js + Supabase</p>
          <h1>Launch Notes</h1>
          <p className="lead">
            A small landing page that captures early-access signups and stores
            them in Supabase through a Next.js API route.
          </p>
          <div className="metrics" aria-label="Product metrics">
            <span>Serverless API</span>
            <span>Supabase Postgres</span>
            <span>Vercel deploy ready</span>
          </div>
        </div>

        <form className="signup" onSubmit={onSubmit}>
          <h2>Join the waitlist</h2>
          <label>
            Name
            <input name="name" autoComplete="name" placeholder="Ada Lovelace" />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ada@example.com"
              required
            />
          </label>
          <button type="submit" disabled={state === "loading"}>
            {state === "loading" ? "Submitting..." : "Request access"}
          </button>
          {message ? (
            <p className={state === "error" ? "status status--error" : "status"}>
              {message}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
