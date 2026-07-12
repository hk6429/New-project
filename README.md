# 借代偵探學院

給臺灣七至九年級學生使用的借代修辭卡牌遊戲。學生可免登入自主闖關，教師可用活動代碼建立課堂挑戰。

## 目前里程碑

- 已完成：專業視覺首頁、六區地圖、詞義配對、語境判讀、關係分類、錯題復習，以及 Supabase 教師 Email 登入與課堂活動碼建立。
- 試行題庫：48 題，已有來源與解析，狀態統一為「待兩名國文教師複核」。
- 已建立：Supabase 題庫、教師、課堂、參與者、作答與雙人複核資料表，全部啟用資料列權限控管（RLS）。
- 已完成程式：學生以六位活動碼與暱稱加入、雲端安全判分、作答後解析，以及教師端即時人數、作答量與正確率。
- 教師題庫審核臺：逐題查看來源、答案、借代關係與解析；每位教師每題限審一次，兩位都核准才發布。
- 尚需在 Supabase 控制臺啟用 Anonymous Sign-Ins，學生免 Email 加入流程才會正式開放。
- 尚未冒充完成：目前仍是 48 題待複核試行題；題庫將逐批擴充並人工複核至 240 題以上。

## 線上預覽

- [Vercel Preview](https://borrowed-words-preview-20260712-ghbv0ve4d-hk6429s-projects.vercel.app)
- [GitHub repository](https://github.com/hk6429/New-project)

## 核心特色

- 借代詞與實際所指配對
- 完整語境判讀與借代、借喻辨析
- 六區冒險地圖、錯題簿與卡牌圖鑑
- 匿名班級活動與教師學習報告
- 題目來源、解析、版本及雙人複核流程

## 本機執行

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

教師控制臺另需依 `.env.example` 設定 Supabase 專案網址與 Publishable Key。教師第一次以 Email 登入後，須由專案管理者核准教師身分，才可建立課堂活動。

## 品質檢查

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
```

## 題庫原則

借代以事物之間的「相關性」為判斷核心；借喻則依據「相似性」。所有正式題目必須包含完整語境、答案、解析、來源或原創標記，並經兩名具國文教學背景者複核後才能發布。

## 專案文件

- [正式設計規格](docs/superpowers/specs/2026-07-12-borrowed-words-card-game-design.md)
- [開發計畫](docs/superpowers/plans/2026-07-12-borrowed-words-card-game-plan.md)

## 部署

預設使用 Vercel Preview。預覽版完成內容、功能、無障礙與多裝置驗收後，再決定是否發布到正式環境。
