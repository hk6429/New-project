"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createActivityCode } from "@/domain/classroom/activity-code";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ClassroomSession = Database["public"]["Tables"]["classroom_sessions"]["Row"];

export function TeacherConsole() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [sessions, setSessions] = useState<ClassroomSession[]>([]);
  const [title, setTitle] = useState("借代快攻賽");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const refreshTeacherState = useCallback(async (currentUser: User | null) => {
    setUser(currentUser);
    if (!currentUser) {
      setIsTeacher(false);
      setSessions([]);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const { data: profile } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    const approved = Boolean(profile);
    setIsTeacher(approved);
    if (!approved) return;
    const { data } = await supabase
      .from("classroom_sessions")
      .select("*")
      .eq("owner_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(8);
    setSessions(data ?? []);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => refreshTeacherState(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void refreshTeacherState(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [refreshTeacherState]);

  async function requestLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/teacher` },
    });
    setMessage(error ? `登入信寄送失敗：${error.message}` : "登入連結已寄出，請到信箱完成驗證。");
    setBusy(false);
  }

  async function createSession(event: FormEvent) {
    event.preventDefault();
    if (!user || !isTeacher) return;
    setBusy(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { data, error } = await supabase
        .from("classroom_sessions")
        .insert({
          owner_id: user.id,
          code: createActivityCode(),
          title,
          settings: { grade: [7, 8, 9], questionCount: 10, mode: "mixed" },
        })
        .select()
        .single();
      if (data) {
        setSessions((current) => [data, ...current]);
        setMessage(`活動已建立，加入碼：${data.code}`);
        setBusy(false);
        return;
      }
      if (error?.code !== "23505") {
        setMessage(`活動建立失敗：${error?.message ?? "未知錯誤"}`);
        setBusy(false);
        return;
      }
    }
    setMessage("活動碼重複，請稍後再試一次。");
    setBusy(false);
  }

  if (!user) {
    return (
      <section className="teacher-auth" aria-labelledby="teacher-login-title">
        <p className="eyebrow">教師安全登入</p>
        <h1 id="teacher-login-title">用 Email 登入教師控制臺</h1>
        <p>系統會寄送一次性登入連結，不需要設定密碼。</p>
        <form onSubmit={requestLogin}>
          <label htmlFor="teacher-email">教師 Email</label>
          <input id="teacher-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <button className="button primary" type="submit" disabled={busy}>{busy ? "寄送中…" : "寄送登入連結"}</button>
        </form>
        {message && <p role="status" aria-live="polite">{message}</p>}
      </section>
    );
  }

  if (!isTeacher) {
    return (
      <section className="teacher-auth">
        <p className="eyebrow">等待教師身分核准</p>
        <h1>登入成功，尚未取得教師權限</h1>
        <p>目前帳號：{user.email}</p>
        <p>為避免學生自行取得題庫答案與審核權限，教師身分必須由專案管理者核准。</p>
        <button className="button secondary" type="button" onClick={() => getSupabaseBrowserClient().auth.signOut()}>登出</button>
      </section>
    );
  }

  return (
    <section className="teacher-console">
      <div className="teacher-console-head">
        <div><p className="eyebrow">教師控制臺</p><h1>建立課堂活動</h1></div>
        <button className="button secondary" type="button" onClick={() => getSupabaseBrowserClient().auth.signOut()}>登出</button>
      </div>
      <form className="create-session-form" onSubmit={createSession}>
        <label htmlFor="session-title">活動名稱</label>
        <input id="session-title" value={title} onChange={(event) => setTitle(event.target.value)} minLength={1} maxLength={80} required />
        <button className="button primary" type="submit" disabled={busy}>{busy ? "建立中…" : "建立六位數活動碼"}</button>
      </form>
      {message && <p className="console-message" role="status" aria-live="polite">{message}</p>}
      <div className="session-list">
        <h2>最近活動</h2>
        {sessions.length === 0 ? <p>尚未建立活動。</p> : sessions.map((session) => (
          <article key={session.id}>
            <div><strong>{session.title}</strong><span>{session.status}</span></div>
            <b>{session.code}</b>
          </article>
        ))}
      </div>
    </section>
  );
}
