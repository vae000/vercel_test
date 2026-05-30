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
      setMessage(payload.message ?? "提交失败，请稍后重试。");
      return;
    }

    form.reset();
    setState("success");
    setMessage(payload.message ?? "已加入名单。");
  }

  return (
    <main>
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Vercel + Next.js + Supabase</p>
          <h1>上线笔记</h1>
          <p className="lead">
            一个最小可用的落地页示例：通过 Next.js API 收集预约信息，
            并写入 Supabase 数据表。
          </p>
          <div className="metrics" aria-label="产品能力">
            <span>Serverless API</span>
            <span>Supabase 数据库</span>
            <span>Vercel 一键部署</span>
          </div>
        </div>

        <form className="signup" onSubmit={onSubmit}>
          <h2>加入预约名单</h2>
          <label>
            姓名
            <input name="name" autoComplete="name" placeholder="张三" />
          </label>
          <label>
            邮箱
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>
          <button type="submit" disabled={state === "loading"}>
            {state === "loading" ? "提交中..." : "申请体验"}
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
