# 借代修辭卡牌遊戲開發計畫

依據：`docs/superpowers/specs/2026-07-12-borrowed-words-card-game-design.md`

## 執行原則

- 先測試、再實作；每個功能完成後立即驗證。
- 題庫內容與遊戲程式分離。
- 先完成學生端核心，再接課堂即時功能。
- 題目未完成來源查核與雙人複核前，不標記為正式發布。
- 不修改工作區內既有的 `outputs/`、`skills/` 與其他無關檔案。

## 任務一：建立專案骨架

建立或修改：

- `package.json`
- `README.md`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `vitest.config.ts`
- `playwright.config.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

驗證：

- 安裝 Next.js、React、TypeScript、Vitest、Testing Library、Playwright。
- `npm run lint`、`npm run typecheck`、`npm test` 可執行。
- README 記錄產品、安裝、指令、題庫原則與部署方式。

## 任務二：建立題庫領域模型

建立：

- `src/domain/questions/types.ts`
- `src/domain/questions/schema.ts`
- `src/domain/questions/validate-question.ts`
- `src/domain/questions/validate-question.test.ts`
- `src/data/questions/verified.ts`
- `src/data/questions/draft.ts`

測試先涵蓋：

- 題目缺來源、解析、借代詞或實際所指時驗證失敗。
- 發布題缺少兩名複核者時驗證失敗。
- 多重正解、重複選項及無效難度時驗證失敗。
- 借代與借喻辨析題必須記錄關係判斷依據。

第一批資料：

- 建立 40 至 60 題來源可追溯的試行題。
- 每題保留完整上下文、出處、答案、解析與審核狀態。
- 正式發布標籤僅用於已完成雙人複核的題目；其餘維持待複核。

## 任務三：建立遊戲引擎

建立：

- `src/domain/game/create-round.ts`
- `src/domain/game/score-round.ts`
- `src/domain/game/review-queue.ts`
- 對應的 `*.test.ts`

測試先涵蓋：

- 依題型與難度抽題且不重複。
- 卡牌洗牌後仍保留正確配對。
- 連擊、錯誤與時間獎勵計算一致。
- 錯題進入間隔復習佇列。
- 停用或爭議題不會被抽中。

## 任務四：完成學生端核心

建立：

- `src/app/adventure/page.tsx`
- `src/app/play/page.tsx`
- `src/app/review/page.tsx`
- `src/components/home/*`
- `src/components/map/*`
- `src/components/game/*`
- `src/components/review/*`

功能：

- 學生首頁三個主入口。
- 六區冒險地圖與解鎖狀態。
- 卡牌配對、例句判讀、分類辨析及 Boss 混合挑戰。
- 正誤短回饋、題組後完整解析。
- 錯題簿、圖鑑、等級與徽章。

驗證：

- 元件測試涵蓋卡牌選取、配對、回饋與鍵盤操作。
- Playwright 涵蓋首次使用者完成一局。
- 320px 至桌面寬度不溢位。

## 任務五：建立本機進度與離線功能

建立：

- `src/infrastructure/progress/progress-store.ts`
- `src/infrastructure/progress/indexeddb-store.ts`
- `src/infrastructure/progress/export-code.ts`
- `src/app/manifest.ts`
- Service Worker 相關設定。

測試：

- 重新整理後進度仍存在。
- 匯出後可在新瀏覽器匯入。
- 斷線作答可暫存，恢復後不重複計分。

## 任務六：擴充至 240 題

建立：

- `src/data/questions/classic.ts`
- `src/data/questions/modern.ts`
- `src/data/questions/original.ts`
- `scripts/audit-questions.mjs`
- `reports/question-audit.json`

驗證：

- 總數 240 題。
- 題型、難度與語料來源比例符合設計規格。
- 自動檢查重複題幹、重複選項、缺漏欄位及來源網址格式。
- 至少 200 題通過人工雙人複核後才能設定為發布。

## 任務七：建立 Supabase 資料與權限

建立：

- `supabase/migrations/*`
- `src/infrastructure/supabase/client.ts`
- `src/infrastructure/supabase/server.ts`
- `src/domain/classroom/*`

資料表：

- `questions`、`question_versions`、`question_reviews`
- `classroom_sessions`、`participants`、`responses`
- `question_reports`

驗證：

- 所有公開 schema 資料表啟用 RLS。
- 匿名學生只能加入有效活動並提交自己的臨時作答。
- 教師只能讀取自己建立活動的彙整資料。
- 公開使用者不能修改答案或審核狀態。

## 任務八：完成教師課堂模式

建立：

- `src/app/teacher/page.tsx`
- `src/app/teacher/session/[code]/page.tsx`
- `src/app/join/page.tsx`
- `src/components/teacher/*`
- `src/components/classroom/*`

功能：

- 依年級、題型、難度、題數及時間建立活動。
- 六位活動代碼、等候大廳、開始與結束控制。
- 即時進度、正確率、排行榜及共同迷思。
- 課後一頁式報告。

測試：

- 教師建立活動，30 名模擬學生加入並提交作答。
- 代碼失效、重複暱稱、斷線補送與教師中斷均有明確結果。
- 惡意暱稱與高頻請求被限制。

## 任務九：建立題庫審核介面

建立：

- `src/app/admin/questions/page.tsx`
- `src/app/admin/questions/[id]/page.tsx`
- `src/components/admin/*`

功能：

- 搜尋、篩選、版本比較、來源檢視及狀態修改。
- 草稿、待查核、已複核、已發布、有爭議及已停用流程。
- 爭議回報達門檻時停止計分。

驗證：

- 未驗證使用者無法進入後台。
- 缺少雙人複核的題目無法發布。
- 版本變更保留建立者、時間與差異。

## 任務十：整體品質與部署

執行：

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test:e2e`
- 題庫稽核腳本
- Lighthouse 與 axe 無障礙檢查

人工驗收：

- 手機、平板、Chromebook、筆電與投影。
- 200% 文字縮放、鍵盤、螢幕閱讀器與減少動態效果。
- 30 名學生課堂壓力測試。
- 兩位國文教師完成正式題目複核。

交付：

- 建立 GitHub 公開 repository，僅推送專案相關檔案。
- 先部署 Vercel preview。
- Preview 驗收通過後再決定是否切 production。

