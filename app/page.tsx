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
          <p className="eyebrow">AI Agent 落地咨询</p>
          <h1>把 Agent 用到真实业务里</h1>
          <p className="lead">
            面向销售、客服、运营和内部流程，帮你找到最适合落地的
            Agent 场景，做出可验证的试点方案。
          </p>
          <div className="metrics" aria-label="产品能力">
            <span>场景诊断</span>
            <span>自动化流程设计</span>
            <span>试点交付</span>
          </div>
        </div>

        <form className="signup" onSubmit={onSubmit}>
          <h2>获取 Agent 落地方案</h2>
          <label>
            姓名 / 公司
            <input
              name="name"
              autoComplete="organization"
              placeholder="张三 / 某某科技"
            />
          </label>
          <label>
            联系邮箱
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>
          <button type="submit" disabled={state === "loading"}>
            {state === "loading" ? "提交中..." : "预约沟通"}
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
