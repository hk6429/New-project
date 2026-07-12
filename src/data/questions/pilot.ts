import type { BorrowedWordsQuestion, QuestionSource } from "@/domain/questions/types";

const moeSource: QuestionSource = {
  title: "教育部《重編國語辭典修訂本》：借代",
  url: "https://dict.revised.moe.edu.tw/dictView.jsp?ID=90837&la=0&powerMode=0",
  citation: "借代定義及「杜康」例證",
};

const learningSource: QuestionSource = {
  title: "國語文學科中心：借代",
  url: "https://cerclearning.tp.edu.tw/grammar/datapage/29",
  citation: "借代定義、類型及例句",
};

const schoolSource: QuestionSource = {
  title: "南投縣立水里商工教學檔案：修辭",
  url: "https://www.slvs.ntct.edu.tw/ischool/publish_page/79/?cid=6911",
  citation: "借代例句及借代、借喻辨析",
};

function pilot(
  id: string,
  prompt: string,
  referent: string,
  context: string,
  relation: string,
  rationale: string,
  source: QuestionSource,
  difficulty: BorrowedWordsQuestion["difficulty"] = "basic",
): BorrowedWordsQuestion {
  const distractors = ["音樂", "平民", "書信", "船", "父母", "老人", "兒童", "戰爭"]
    .filter((item) => item !== referent)
    .slice(0, 3);

  return {
    id,
    type: "term-match",
    grade: [7, 8, 9],
    difficulty,
    prompt,
    options: [referent, ...distractors],
    correctAnswers: [referent],
    metonym: prompt,
    referent,
    relation,
    rationale,
    context,
    source,
    reviewers: [],
    status: "pending-review",
  };
}

export const pilotQuestions: BorrowedWordsQuestion[] = [
  pilot("Q001", "杜康", "酒", "何以解憂？唯有杜康。", "人物或專名代相關事物", "杜康相傳善於造酒，後世以其名代稱酒。", moeSource),
  pilot("Q002", "黃髮", "老人", "黃髮垂髫，並怡然自樂。", "特徵代本體", "古人以老人髮色轉黃的特徵代稱老人。", schoolSource),
  pilot("Q003", "垂髫", "兒童", "黃髮垂髫，並怡然自樂。", "特徵代本體", "古代兒童未束髮，頭髮下垂，因此以垂髫代稱兒童。", schoolSource),
  pilot("Q004", "絲竹", "音樂", "無絲竹之亂耳，無案牘之勞形。", "器物或材料代活動", "絲弦與竹管都是傳統樂器的材料，合用時可代稱音樂。", schoolSource),
  pilot("Q005", "管弦", "音樂", "舉酒欲飲無管弦。", "器物代活動", "管樂器與弦樂器合稱管弦，在此代稱音樂。", schoolSource),
  pilot("Q006", "布衣", "平民", "布衣之怒，亦免冠徒跣，以頭搶地爾。", "衣著特徵代身分", "古代平民多穿布衣，因此用布衣代稱平民。", learningSource),
  pilot("Q007", "黔首", "平民", "蘇秦本一介黔首，而後佩六國相印。", "特徵或稱謂代身分", "黔首原指以黑巾覆頭的百姓，後用來代稱平民。", schoolSource, "intermediate"),
  pilot("Q008", "孤帆", "船", "孤帆遠影碧山盡，唯見長江天際流。", "部分代全體", "帆是船的一部分，詩中以帆代稱遠去的船。", learningSource),
  pilot("Q009", "高堂", "父母", "不能回家拜高堂，遊子淚漣漣。", "相關場所或稱謂代人物", "高堂原指父母居處，語境中用來敬稱父母。", schoolSource, "intermediate"),
  pilot("Q010", "手筆", "文章作品", "這篇擲地有聲的文章，是誰的手筆？", "工具或動作代成品", "手筆原與書寫相關，語境中代稱文章作品。", schoolSource),
  pilot("Q011", "雙鯉魚", "書信", "客從遠方來，遺我雙鯉魚。", "相關物件代事物", "古代有以鯉魚形木盒藏書信的說法，詩中雙鯉魚代稱書信。", schoolSource, "intermediate"),
  pilot("Q012", "麵包", "生計", "我為了明天的麵包及昨日的債務辛勞地工作。", "具體事物代抽象概念", "麵包是維持生活的食物，語境中代稱生計。", learningSource),
  pilot("Q013", "松柏", "墳墓", "墓園裡松柏長青，令人追念故人。", "相關植物代場所", "傳統墓地常植松柏，特定語境中可用松柏代稱墳墓或墓地。", schoolSource, "advanced"),
  pilot("Q014", "鳥跡", "文字", "先民仰觀天象，俯察鳥跡，創製文字。", "形貌相關事物代成品", "傳說古人觀察鳥獸足跡而造字，因此鳥跡可代稱文字。", schoolSource, "advanced"),
  pilot("Q015", "宮錦", "做官", "既披宮錦，益尊禮樂之道。", "服飾代身分或行為", "宮錦為仕宦服飾，穿上宮錦在此代稱入仕做官。", schoolSource, "advanced"),
  pilot("Q016", "相印", "宰相權位", "而後佩六國相印，權傾一時。", "器物代職位權力", "官印是職位與權力的標誌，相印在此代稱宰相的權位。", schoolSource, "intermediate"),
];

