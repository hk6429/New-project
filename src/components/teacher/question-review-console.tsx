"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { parseQuestionOptions, parseQuestionSource } from "@/domain/questions/review-display";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ReviewQuestion = Database["public"]["Tables"]["questions"]["Row"];
type Verdict = "approved" | "rejected";

export function QuestionReviewConsole() {
  const [user, setUser] = useState<User | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadQueue = useCallback(async (currentUser: User) => {
    const supabase = getSupabaseBrowserClient();
    const { data: profile } = await supabase.from("teacher_profiles").select("user_id").eq("user_id", currentUser.id).maybeSingle();
    if (!profile) {
      setIsTeacher(false);
      setLoading(false);
      return;
    }
    setIsTeacher(true);
    const [{ data: questionRows, error: questionError }, { data: ownReviews }] = await Promise.all([
      supabase.from("questions").select("*").in("status", ["pending-review", "disputed"]).order("id"),
      supabase.from("question_reviews").select("question_id").eq("reviewer_id", currentUser.id),
    ]);
    if (questionError) {
      setMessage(`讀取題庫失敗：${questionError.message}`);
    } else {
      const reviewedIds = new Set((ownReviews ?? []).map((review) => review.question_id));
      setQuestions((questionRows ?? []).filter((question) => !reviewedIds.has(question.id)));
      setIndex(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) void loadQueue(data.user);
      else setLoading(false);
    });
  }, [loadQueue]);

  async function submitReview(verdict: Verdict) {
    const question = questions[index];
    if (!user || !question || busy) return;
    if (verdict === "rejected" && note.trim().length < 4) {
      setMessage("退回題目時，請留下至少四個字的修正理由。");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("question_reviews").insert({
      question_id: question.id,
      reviewer_id: user.id,
      verdict,
      note: note.trim(),
    });
    if (error) {
      setMessage(error.code === "23505" ? "這一題您已經審核過。" : `審核送出失敗：${error.message}`);
      setBusy(false);
      return;
    }
    setQuestions((current) => current.filter((item) => item.id !== question.id));
    setIndex(0);
    setNote("");
    setMessage(verdict === "approved" ? "已核准；累積兩位教師核准後才會正式發布。" : "已退回並標記為待修正。");
    setBusy(false);
  }

  if (loading) return <section className="review-console-state"><p>正在確認教師權限與題庫資料…</p></section>;
  if (!user) return <section className="review-console-state"><h1>請先登入教師控制臺</h1><p>題目答案、來源與審核功能只對已核准教師開放。</p></section>;
  if (!isTeacher) return <section className="review-console-state"><h1>尚未取得教師審核權限</h1><p>請由專案管理者核准教師身分後再進入。</p></section>;
  if (questions.length === 0) return <section className="review-console-state is-complete"><p className="eyebrow">本輪完成</p><h1>目前沒有待您審核的題目</h1><p>每位教師對同一題只能審核一次，避免重複計票。</p>{message && <p role="status">{message}</p>}</section>;

  const question = questions[index];
  const options = parseQuestionOptions(question.options);
  const answers = parseQuestionOptions(question.correct_answers);
  const source = parseQuestionSource(question.source);

  return (
    <section className="question-review-console">
      <header className="review-console-head">
        <div><p className="eyebrow">國文教師雙人複核</p><h1>借代題庫審核臺</h1></div>
        <div className="review-queue-count"><span>待您審核</span><strong>{questions.length}</strong></div>
      </header>

      <article className="review-question-card">
        <div className="review-meta"><span>{question.id}</span><span>{question.type}</span><span>{question.difficulty}</span><span>已核准 {question.review_count}/2</span></div>
        <p className="review-context">{question.context}</p>
        <h2>{question.prompt}</h2>
        <div className="review-options" aria-label="題目選項">
          {options.map((option) => <span className={answers.includes(option) ? "is-answer" : ""} key={option}>{option}{answers.includes(option) && <small>正解</small>}</span>)}
        </div>
        <dl className="review-details">
          <div><dt>借代詞</dt><dd>{question.metonym}</dd></div>
          <div><dt>實際所指</dt><dd>{question.referent}</dd></div>
          <div><dt>關係</dt><dd>{question.relation}</dd></div>
          <div><dt>解析</dt><dd>{question.rationale}</dd></div>
        </dl>
        {source ? (
          <div className="source-panel"><strong>資料來源</strong><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>{source.citation && <p>{source.citation}</p>}</div>
        ) : <div className="source-panel is-warning">此題缺少可查核來源，建議退回補充。</div>}
      </article>

      <div className="review-decision-panel">
        <label htmlFor="review-note">審核備註（退回時必填）</label>
        <textarea id="review-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder="例如：借代關係分類需改為「部分代全體」" />
        <div>
          <button className="button reject-button" type="button" onClick={() => submitReview("rejected")} disabled={busy}>退回修正</button>
          <button className="button primary" type="button" onClick={() => submitReview("approved")} disabled={busy}>內容正確，核准</button>
        </div>
        {message && <p role="status" className="console-message">{message}</p>}
      </div>
    </section>
  );
}
