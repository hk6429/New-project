import type { BorrowedWordsQuestion } from "@/domain/questions/types";

type Seed = readonly [string, BorrowedWordsQuestion["type"], BorrowedWordsQuestion["difficulty"], string, string, string, string, string];

const seeds: Seed[] = [
  ["M001", "context-match", "basic", "全校都在等白宮回應這項政策。", "白宮", "美國政府", "場所代機構", "句中的白宮代稱什麼？"],
  ["M002", "context-match", "basic", "今天行政大樓宣布校慶流程。", "行政大樓", "學校行政單位", "場所代機構", "誰宣布了校慶流程？"],
  ["M003", "context-match", "basic", "裁判一吹哨，紅衫立刻展開反攻。", "紅衫", "穿紅色球衣的隊伍", "服飾特徵代群體", "紅衫指的是誰？"],
  ["M004", "context-match", "basic", "放學鐘響，整排藍白制服湧向校門。", "藍白制服", "本校學生", "服飾代人物", "藍白制服代稱什麼？"],
  ["M005", "context-match", "intermediate", "議場內朝野仍未取得共識。", "朝野", "執政黨與在野黨", "位置稱謂代政治群體", "朝野在此指哪些人？"],
  ["M006", "context-match", "intermediate", "記者會上，鏡頭全對準新科金馬。", "金馬", "金馬獎得主", "獎項代得獎者", "新科金馬代稱誰？"],
  ["M007", "relation", "intermediate", "這支球隊需要更多年輕的血液。", "血液", "年輕新成員", "身體成分代人才", "血液與新成員最接近哪種關係？"],
  ["M008", "relation", "intermediate", "班上有幾張新面孔，是這學期的轉學生。", "新面孔", "新同學", "身體部分代人物", "面孔代人物屬於哪種關係？"],
  ["M009", "relation", "intermediate", "社團需要一雙巧手修復道具。", "巧手", "擅長手作的人", "身體部分代人物", "巧手如何形成借代？"],
  ["M010", "relation", "advanced", "這場公共議題需要更多理性的聲音。", "聲音", "意見或主張", "表達媒介代意見", "聲音與意見的關係為何？"],
  ["M011", "application", "intermediate", "學生會希望邀請校長參加成果展。", "校長室", "校長", "場所代人物", "哪一句適合用借代改寫原句？"],
  ["M012", "application", "intermediate", "籃球隊終場前靠主力球員得分。", "王牌", "主力球員", "標誌稱謂代人物", "哪一句能自然使用「王牌」？"],
  ["M013", "application", "intermediate", "畢業生回校分享各行各業的經驗。", "學長姐", "畢業校友", "身分稱謂代群體", "哪一句借代最符合原意？"],
  ["M014", "application", "advanced", "市府必須回應居民對交通的意見。", "市府大樓", "市政府", "場所代機構", "如何改寫才能使用借代且不改變原意？"],
  ["M015", "application", "advanced", "新聞媒體關注這次校園公投。", "鏡頭", "新聞媒體", "器材代媒體工作者", "哪個改寫最精確？"],
  ["M016", "application", "advanced", "這篇貼文得到許多網路使用者支持。", "鍵盤", "網路使用者", "工具代使用者", "哪一句以「鍵盤」借代網友？"],
  ["M017", "application", "intermediate", "志工為偏鄉孩子送來閱讀資源。", "書香", "閱讀資源與風氣", "感官特徵代閱讀文化", "哪句使用「書香」最合理？"],
  ["M018", "application", "advanced", "議員應傾聽基層勞工的需要。", "汗水", "勞動者", "勞動特徵代人物", "哪句用「汗水」表達且不物化人物？"],
  ["M019", "application", "intermediate", "冠軍隊回到母校接受表揚。", "金盃", "冠軍隊伍", "獎盃代獲獎群體", "哪句借代最貼合語境？"],
  ["M020", "application", "advanced", "校刊希望刊登不同立場的文章。", "筆", "作者或文章力量", "工具代創作者", "哪一句以「筆」表達多元觀點？"],
  ["M021", "distinction", "intermediate", "那位短跑選手是操場上的閃電。", "閃電", "速度極快的選手", "相似性形成借喻", "此句為借代還是借喻？"],
  ["M022", "distinction", "intermediate", "教室裡的眼鏡都加入科學社。", "眼鏡", "戴眼鏡的學生", "相關特徵代人物", "「眼鏡」與學生的關係是相關還是相似？"],
  ["M023", "distinction", "intermediate", "她是班上的小太陽，總能鼓舞大家。", "小太陽", "溫暖開朗的同學", "相似性形成借喻", "判斷修辭並說明依據。"],
  ["M024", "distinction", "advanced", "臺下有許多雙耳朵等待新作品。", "耳朵", "聽眾", "身體部分代人物", "耳朵在此是否構成借代？"],
  ["M025", "distinction", "advanced", "烏雲吞沒了原本明亮的天空。", "吞沒", "遮蔽", "動作相似形成轉化", "此句是否為借代？"],
  ["M026", "distinction", "intermediate", "直播間湧入上千雙眼睛。", "眼睛", "觀眾", "身體部分代人物", "眼睛的用法屬於哪種修辭？"],
  ["M027", "distinction", "advanced", "他一上場，就成了全隊的定海神針。", "定海神針", "穩定軍心的核心人物", "相似性形成借喻", "此處是否為借代？"],
  ["M028", "distinction", "advanced", "校門口的黃背心協助學生過馬路。", "黃背心", "交通導護志工", "服飾代人物", "黃背心與本體是否具有相關性？"],
  ["M029", "distinction", "intermediate", "留言區出現不少鍵盤，熱烈討論新規定。", "鍵盤", "網路留言者", "工具代使用者", "此句是借代還是單純寫物？"],
  ["M030", "distinction", "advanced", "這位投手是球隊的銅牆鐵壁。", "銅牆鐵壁", "防守穩固的投手", "相似性形成借喻", "這個稱呼為何不是借代？"],
  ["M031", "application", "intermediate", "導護志工每天守護校門安全。", "黃背心", "導護志工", "服飾代人物", "選出自然且尊重人物的借代句。"],
  ["M032", "application", "advanced", "攝影記者記錄災區重建進度。", "鏡頭", "攝影記者", "器材代工作者", "哪句新聞標題使用借代但不誇大？"],
  ["M033", "application", "intermediate", "畢業典禮上，學生向老師致謝。", "粉筆", "教師", "教具代職業人物", "哪句用「粉筆」借代教師最自然？"],
  ["M034", "application", "advanced", "第一線醫護人員持續照顧病患。", "白袍", "醫護人員", "服飾代職業人物", "哪句使用借代且避免英雄化壓力？"],
  ["M035", "application", "advanced", "地方居民要求中央政府重視水資源。", "中央", "中央政府", "方位稱謂代機構", "哪個改寫語意最精確？"],
  ["M036", "application", "intermediate", "樂團開始演奏，觀眾安靜聆聽。", "弦管", "音樂演奏", "樂器代音樂", "哪句適合放入校慶報導？"],
  ["M037", "application", "advanced", "出版社宣布暫停發行該作者作品。", "書架", "出版市場或出版品", "陳列處代出版品", "哪句使用「書架」而不造成歧義？"],
  ["M038", "application", "intermediate", "新生加入社團，帶來新的想法。", "新血", "新成員", "身體成分代人物", "哪句可用於社團招募文案？"],
  ["M039", "application", "advanced", "地方創作者用作品記錄社區故事。", "在地的筆", "地方創作者", "工具代創作者", "哪句借代兼顧清楚與文采？"],
  ["M040", "application", "advanced", "多家媒體在法院外等待判決結果。", "麥克風", "採訪媒體", "器材代媒體工作者", "哪句是中性、不預設立場的報導？"],
  ["M041", "context-match", "basic", "升旗時，全校目光都朝向國旗。", "目光", "注意力", "身體動作代抽象關注", "目光在此代稱什麼？"],
  ["M042", "context-match", "intermediate", "新制度上路前，校方先蒐集第一線的聲音。", "第一線", "直接執行工作的人員", "位置代工作群體", "第一線是指哪些人？"],
  ["M043", "context-match", "intermediate", "社群平台宣布清除惡意假帳號。", "平台", "經營平台的公司", "服務空間代營運機構", "平台在此代稱什麼？"],
  ["M044", "context-match", "advanced", "一紙公文改變了社團場地的使用方式。", "一紙公文", "行政命令", "載體代內容", "一紙公文代稱什麼？"],
  ["M045", "context-match", "intermediate", "選舉過後，新面孔進入議會。", "新面孔", "新任民意代表", "身體部分代人物", "新面孔在此是誰？"],
  ["M046", "relation", "basic", "全場掌聲送給完成演出的同學。", "掌聲", "觀眾的肯定", "動作聲響代抽象肯定", "掌聲和肯定是什麼關係？"],
  ["M047", "relation", "intermediate", "學校需要更多願意傾聽的耳朵。", "耳朵", "願意傾聽的人", "身體部分代人物", "耳朵如何代稱人物？"],
  ["M048", "relation", "advanced", "這項提案仍在中央與地方之間協調。", "中央與地方", "中央及地方政府", "方位代行政機構", "此借代建立在哪種相關性？"],
  ["M049", "distinction", "intermediate", "考前的教室像一座安靜的圖書館。", "圖書館", "安靜的教室", "相似性形成明喻", "這句是否使用借代？"],
  ["M050", "distinction", "advanced", "幾頂學士帽回到母校分享升學經驗。", "學士帽", "大學畢業校友", "服飾標誌代人物", "學士帽在此屬於借代嗎？"],
  ["M051", "distinction", "intermediate", "那篇文章是一把刺破謠言的刀。", "刀", "揭露真相的文章", "功能相似形成借喻", "刀和文章之間是相關還是相似？"],
  ["M052", "distinction", "advanced", "校門外聚集許多麥克風等待受訪者。", "麥克風", "採訪記者", "器材代工作者", "麥克風是否只是實物描寫？"],
  ["M053", "application", "intermediate", "聽眾專心等待演講開始。", "耳朵", "聽眾", "身體部分代人物", "哪一句以借代呈現現場氣氛？"],
  ["M054", "application", "advanced", "民眾希望媒體追查公共工程問題。", "第四權", "新聞媒體", "社會角色稱謂代機構", "哪句使用「第四權」且立場中性？"],
  ["M055", "application", "intermediate", "學生用文章替弱勢議題發聲。", "筆尖", "寫作者及文字力量", "工具部分代創作行動", "哪句改寫保留行動主體？"],
  ["M056", "application", "advanced", "教育政策應重視教室現場的需求。", "講臺", "教師與教學現場", "場所物件代群體與現場", "哪句用「講臺」仍能清楚表意？"],
  ["M057", "distinction", "intermediate", "社團裡的老鳥主動帶領新生。", "老鳥", "資深成員", "相似性形成借喻", "老鳥是借代還是借喻？"],
  ["M058", "distinction", "advanced", "白袍正在會議室討論輪班制度。", "白袍", "醫護人員", "服飾代職業人物", "白袍的替代依據是什麼？"],
  ["M059", "application", "advanced", "社區長者保存許多地方記憶。", "白髮", "年長居民", "外貌特徵代人物", "哪句使用「白髮」且語氣尊重？"],
  ["M060", "application", "advanced", "青年代表參與城市規劃討論。", "年輕的聲音", "青年意見與代表", "特徵與表達代群體意見", "哪句能避免把青年視為單一立場？"],
];

const relationOptions = ["場所或物件代人物／機構", "特徵或部分代人物", "工具或媒介代使用者／內容", "因相似性形成借喻"];

function optionsFor(seed: Seed): string[] {
  const [, type, , , , referent, relation] = seed;
  if (type === "distinction") return relation.includes("借喻") || relation.includes("明喻") || relation.includes("轉化")
    ? ["借喻或其他相似性修辭", "借代", "排比", "設問"]
    : ["借代", "借喻", "排比", "設問"];
  if (type === "relation") return [relation, ...relationOptions.filter((item) => item !== relation).slice(0, 3)];
  if (type === "application") return [
    `恰當：以「${seed[4]}」代稱「${referent}」，且保留原句重點。`,
    `誤用：把「${seed[4]}」當成與本體相似的比喻。`,
    `歧義：句中同時把「${seed[4]}」當作實物與人物。`,
    `離題：改寫後不再表達原情境的主要訊息。`,
  ];
  return [referent, "事件發生的地點", "句中出現的實物", "與語境無關的旁觀者"];
}

export const modernQuestions: BorrowedWordsQuestion[] = seeds.map((seed) => {
  const [id, type, difficulty, context, metonym, referent, relation, prompt] = seed;
  const options = optionsFor(seed);
  const correctAnswer = type === "distinction"
    ? (relation.includes("借喻") || relation.includes("明喻") || relation.includes("轉化") ? options[0] : "借代")
    : type === "relation" ? relation : type === "application" ? options[0] : referent;
  const wrongOptions = options.filter((option) => option !== correctAnswer);
  return {
    id,
    coreTopicId: `modern-${metonym}`,
    type,
    grade: difficulty === "advanced" ? [8, 9] : [7, 8, 9],
    difficulty,
    prompt,
    options,
    correctAnswers: [correctAnswer],
    metonym,
    referent,
    relation,
    rationale: `語境中的「${metonym}」指向「${referent}」；判斷關鍵是兩者的${relation.includes("借喻") || relation.includes("明喻") ? "相似性" : "實際相關性"}。`,
    context,
    clues: [metonym, referent, relation],
    distractorRationales: Object.fromEntries(wrongOptions.map((option, index) => [option, [
      `此選項忽略「${metonym}」與「${referent}」在語境中的實際連結。`,
      `此選項混淆了相關性與相似性，無法解釋本句的替代依據。`,
      `此選項改變原句重點，未能保留人物、機構或意見的指涉。`,
    ][index % 3]])),
    source: null,
    license: "CC BY 4.0；原創短情境，作者授權借代偵探學院使用與改作",
    creator: "借代偵探學院原創題庫",
    checkers: [],
    disputeNote: null,
    statistics: { attempts: 0, correct: 0, optionCounts: {} },
    version: 1,
    createdAt: "2026-07-12",
    updatedAt: "2026-07-12",
    reviewers: [],
    status: "pending-review",
  };
});
