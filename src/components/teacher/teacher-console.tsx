"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createActivityCode } from "@/domain/classroom/activity-code";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ClassroomSession = Database["public"]["Tables"]["classroom_sessions"]["Row"];
type ClassroomStats = { participants: number; responses: number; correctRate: number };

export function TeacherConsole() {
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [sessions, setSessions] = useState<ClassroomSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ClassroomSession | null>(null);
  const [stats, setStats] = useState<ClassroomStats>({ participants: 0, responses: 0, correctRate: 0 });
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
    if (!configured) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => refreshTeacherState(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void refreshTeacherState(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [configured, refreshTeacherState]);

  const refreshStats = useCallback(async (sessionId: string) => {
    const supabase = getSupabaseBrowserClient();
    const [{ count: participantCount }, { data: answers }] = await Promise.all([
      supabase.from("participants").select("id", { count: "exact", head: true }).eq("session_id", sessionId),
      supabase.from("responses").select("is_correct").eq("session_id", sessionId),
    ]);
    const responseCount = answers?.length ?? 0;
    const correctCount = answers?.filter((answer) => answer.is_correct).length ?? 0;
    setStats({
      participants: participantCount ?? 0,
      responses: responseCount,
      correctRate: responseCount ? Math.round((correctCount / responseCount) * 100) : 0,
    });
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    const supabase = getSupabaseBrowserClient();
    const timer = window.setTimeout(() => void refreshStats(selectedSession.id), 0);
    const channel = supabase
      .channel(`teacher-session-${selectedSession.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "participants", filter: `session_id=eq.${selectedSession.id}` }, () => void refreshStats(selectedSession.id))
      .on("postgres_changes", { event: "*", schema: "public", table: "responses", filter: `session_id=eq.${selectedSession.id}` }, () => void refreshStats(selectedSession.id))
      .subscribe();
    return () => {
      window.clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [refreshStats, selectedSession]);

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
        setSelectedSession(data);
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

  if (!configured) {
    return <section className="teacher-auth" role="alert"><p className="eyebrow">系統設定提示</p><h1>教師控制臺尚未連接題庫</h1><p>請管理者在 Vercel 設定 Supabase 環境變數後重新部署。學生單機闖關仍可正常使用。</p></section>;
  }

  if (!user) {
    return (
      <section className="teacher-auth" aria-labelledby="teacher-login-title">
        <p className="eyebrow">教師安全登入</p>
        <h1 id="teacher-login-title">用 Email 登入教師控制臺</h1>
        <p>系統會寄送一次性登入連結，不需要設定密碼。</p>
        <div className="teacher-value-preview" role="region" aria-label="教師控制臺功能預覽">
          <article><strong>快速開課</strong><span>建立六位數活動碼，學生免 Email 加入。</span></article>
          <article><strong>即時掌握</strong><span>查看全班參與、作答量與整體正確率。</span></article>
          <article><strong>安心複核</strong><span>題目須經兩位教師核准，才會正式發布。</span></article>
        </div>
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
        <div className="teacher-console-actions"><a className="button primary" href="/teacher/review">進入題庫審核</a><button className="button secondary" type="button" onClick={() => getSupabaseBrowserClient().auth.signOut()}>登出</button></div>
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
            <button className="button secondary" type="button" onClick={() => setSelectedSession(session)}>查看即時統計</button>
          </article>
        ))}
      </div>
      {selectedSession && (
        <section className="live-dashboard" aria-labelledby="live-dashboard-title">
          <div className="panel-heading"><div><p className="eyebrow">即時課堂資料</p><h2 id="live-dashboard-title">{selectedSession.title}</h2></div><strong className="dashboard-code">{selectedSession.code}</strong></div>
          <div className="metric-grid">
            <article><span>已加入</span><strong>{stats.participants}</strong><small>位學生</small></article>
            <article><span>已收到</span><strong>{stats.responses}</strong><small>筆作答</small></article>
            <article><span>全班正確率</span><strong>{stats.correctRate}%</strong><small>即時更新</small></article>
          </div>
          <div className="class-mission" aria-label="全班共同偵查進度">
            <div><strong>全班共同線索</strong><span>不公開個人排名，每答一題都幫全班向前一步。</span></div>
            <progress max={Math.max(10, Math.ceil((stats.responses + 1) / 10) * 10)} value={stats.responses}>{stats.responses} 條線索</progress>
            <b>{stats.responses} 條</b>
          </div>
          <p className="privacy-note">學生加入或送出答案後，統計會自動更新；不顯示學生 Email 或其他個人資料。</p>
        </section>
      )}
    </section>
  );
}
