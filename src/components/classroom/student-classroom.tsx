"use client";

import { FormEvent, useState } from "react";
import { normalizeActivityCode, normalizeNickname } from "@/domain/classroom/join-input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/types/database";

type ClassroomQuestion = {
  question_id: string;
  prompt: string;
  options: Json;
  context: string;
  question_type: string;
  difficulty: string;
  question_position: number;
  total: number;
};

type AnswerResult = {
  is_correct: boolean;
  rationale: string;
  correct_answer: string;
  answered_count: number;
};

function optionsFromJson(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function StudentClassroom() {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState("");
  const [question, setQuestion] = useState<ClassroomQuestion | null>(null);
  const [position, setPosition] = useState(0);
  const [questionLimit, setQuestionLimit] = useState(10);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [score, setScore] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadQuestion(targetSessionId: string, targetPosition: number) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_classroom_question", {
      requested_session_id: targetSessionId,
      requested_position: targetPosition,
    });
    if (error || !data?.[0]) throw new Error(error?.message ?? "目前沒有可使用的題目");
    setQuestion(data[0]);
    setPosition(targetPosition);
    setResult(null);
    setStartedAt(Date.now());
  }

  async function joinClassroom(event: FormEvent) {
    event.preventDefault();
    const cleanCode = normalizeActivityCode(code);
    const cleanNickname = normalizeNickname(nickname);
    if (cleanCode.length !== 6 || !cleanNickname) return;
    setBusy(true);
    setMessage("");
    try {
      const supabase = getSupabaseBrowserClient();
      let { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          const disabled = error.message.toLowerCase().includes("anonymous");
          throw new Error(disabled ? "學生免登入功能尚待管理者啟用，請老師稍後再試。" : error.message);
        }
        authData = { session: data.session };
      }
      const user = authData.session?.user;
      if (!user) throw new Error("無法建立學生識別，請重新整理後再試");

      const { data: classroom, error: classroomError } = await supabase
        .from("classroom_sessions")
        .select("id,title,settings")
        .eq("code", cleanCode)
        .in("status", ["lobby", "active"])
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();
      if (classroomError || !classroom) throw new Error("找不到這個活動碼，請確認老師投影的六位數字");

      const { data: existing } = await supabase
        .from("participants")
        .select("id")
        .eq("session_id", classroom.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!existing) {
        const { error: joinError } = await supabase.from("participants").insert({
          session_id: classroom.id,
          user_id: user.id,
          nickname: cleanNickname,
        });
        if (joinError) throw new Error(joinError.message);
      }

      const settings = classroom.settings && typeof classroom.settings === "object" && !Array.isArray(classroom.settings)
        ? classroom.settings
        : {};
      const count = typeof settings.questionCount === "number" ? settings.questionCount : 10;
      setQuestionLimit(Math.min(Math.max(count, 1), 20));
      setSessionId(classroom.id);
      setSessionTitle(classroom.title);
      await loadQuestion(classroom.id, 0);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "加入失敗，請稍後再試");
    } finally {
      setBusy(false);
    }
  }

  async function submitAnswer(answer: string) {
    if (!sessionId || !question || result || busy) return;
    setBusy(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("submit_classroom_answer", {
      requested_session_id: sessionId,
      requested_question_id: question.question_id,
      submitted_answer: answer,
      submitted_duration_ms: Date.now() - startedAt,
    });
    if (error || !data?.[0]) {
      setMessage(error?.message ?? "答案送出失敗，請再試一次");
    } else {
      setResult(data[0]);
      if (data[0].is_correct) setScore((current) => current + 10);
    }
    setBusy(false);
  }

  async function nextQuestion() {
    if (!sessionId) return;
    if (position + 1 >= questionLimit) {
      setQuestion(null);
      return;
    }
    setBusy(true);
    try {
      await loadQuestion(sessionId, position + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "讀取下一題失敗");
    } finally {
      setBusy(false);
    }
  }

  if (!sessionId) {
    return (
      <section className="join-panel" aria-labelledby="join-title">
        <p className="eyebrow">學生課堂挑戰</p>
        <h1 id="join-title">輸入活動碼，加入借代快攻賽</h1>
        <p>不需要 Email，也不會顯示真實姓名。請使用老師指定的暱稱。</p>
        <form onSubmit={joinClassroom}>
          <label htmlFor="activity-code">六位數活動碼</label>
          <input id="activity-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(normalizeActivityCode(event.target.value))} placeholder="例如：482731" required pattern="[0-9]{6}" />
          <label htmlFor="nickname">課堂暱稱</label>
          <input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="例如：07 小明" required maxLength={24} />
          <button className="button primary" type="submit" disabled={busy}>{busy ? "加入中…" : "加入課堂"}</button>
        </form>
        {message && <p className="form-error" role="alert">{message}</p>}
      </section>
    );
  }

  if (!question) {
    return (
      <section className="classroom-complete">
        <p className="eyebrow">挑戰完成</p>
        <h1>{nickname}，你完成了！</h1>
        <strong>{score} 分</strong>
        <p>作答紀錄已送到「{sessionTitle}」的教師控制臺。</p>
        <button className="button secondary" type="button" onClick={() => window.location.reload()}>加入另一場</button>
      </section>
    );
  }

  const choices = optionsFromJson(question.options);
  return (
    <section className="live-quiz" aria-labelledby="live-question">
      <div className="live-quiz-head">
        <div><p className="eyebrow">{sessionTitle}</p><span>第 {position + 1} 題／共 {questionLimit} 題</span></div>
        <strong>{score} 分</strong>
      </div>
      <progress value={position + (result ? 1 : 0)} max={questionLimit}>{position + 1}/{questionLimit}</progress>
      <article className="live-question-card">
        <span>{question.difficulty}・{question.question_type}</span>
        {question.context && <p>{question.context}</p>}
        <h1 id="live-question">{question.prompt}</h1>
      </article>
      <div className="option-grid">
        {choices.map((choice) => (
          <button className="quiz-option" type="button" key={choice} onClick={() => submitAnswer(choice)} disabled={busy || Boolean(result)}>{choice}</button>
        ))}
      </div>
      {result && (
        <div className={`answer-explanation ${result.is_correct ? "is-correct" : ""}`} role="status">
          <strong>{result.is_correct ? "答對了！找到借代線索。" : `再注意一下，答案是「${result.correct_answer}」。`}</strong>
          <p>{result.rationale}</p>
          <button className="button primary" type="button" onClick={nextQuestion} disabled={busy}>{position + 1 >= questionLimit ? "查看成績" : "下一題"}</button>
        </div>
      )}
      {message && <p className="form-error" role="alert">{message}</p>}
    </section>
  );
}
