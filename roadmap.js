(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const form = $("#roadmapForm");
  const diagnosis = $("#diagnosis");
  const result = $("#result");
  const steps = $$(".rm-step");
  let currentStep = 1;
  let angle = 0;

  const labels = ["あなたについて", "最優先テーマ", "日常の負担", "仕事の課題", "あなたの強み", "副業の方向性", "時間と目標", "AI経験", "環境と発信", "自由回答"];
  const labelMap = {
    status: { employee: "会社員・公務員", owner: "経営者・個人事業", homemaker: "主婦・主夫", student: "学生・求職中" },
    priority: { time: "時間を増やす", work: "仕事の質を上げる", income: "収入を増やす", create: "形にする" },
    level: { beginner: "AI初心者", basic: "AI基礎経験あり", active: "AI実践経験あり" }
  };

  const dailyLibrary = {
    housework: ["献立・買い物を週1回で設計", "家族構成と予算から7日分の献立、買い物リスト、作り置き順をチャッピーにまとめてもらいます。"],
    schedule: ["頭の中の予定を15分で整理", "やることを箇条書きで渡し、重要度・期限・所要時間から今日の順番を作ります。"],
    family: ["家族の予定と旅行計画を一本化", "希望・予算・移動時間を整理し、全員が無理なく動ける日程表と持ち物リストを作ります。"],
    learning: ["難しい情報を自分向けに翻訳", "分からない文章やURLの要点を、前提知識に合わせた例えと確認問題付きで学びます。"],
    money: ["家計を責めずに改善", "支出項目を分類し、効果が大きく負担の小さい見直し候補から順番に提案してもらいます。"],
    writing: ["連絡文を考える時間を削減", "伝えたい要点と相手だけを入力し、失礼のない自然なLINE・メール文へ整えます。"]
  };

  const workLibrary = {
    email: ["返信・連絡文の下書き", "チャッピー", "受信内容から相手の意図、確認事項、返信案を作り、最終判断だけ自分で行います。"],
    document: ["資料・議事録の構造化", "チャッピー", "メモを結論・根拠・次の行動に整理し、読み手別の資料構成へ変換します。"],
    sales: ["提案内容と想定質問の準備", "チャッピー", "顧客の課題から提案の切り口、質問リスト、反論への回答を事前に作ります。"],
    marketing: ["1テーマから複数SNSへ展開", "チャッピー＋Codex", "企画をショート台本、投稿文、LPの見出しへ展開し、Codexで公開ページまで形にします。"],
    data: ["数字を意思決定に変える", "チャッピー＋Codex", "データの見るべき指標を決め、Codexで集計ツールや見やすい画面を作ります。"],
    system: ["繰り返し作業を小さなツール化", "Codex", "予約、見積り、顧客管理など、毎回同じ手順を入力フォームと自動処理に変えます。"]
  };

  const sideLibrary = {
    writing: { title: "AI文章・SNS投稿作成代行", tags: ["スマホ可", "初期費用ほぼ0円"], fit: ["write", "research", "content"], device: "phone", steps: ["知人または小規模店舗を1業種に絞る", "投稿案を無料サンプルとして3本作る", "月8〜12本の小さなプランを提案する"], chat: "企画、構成、文章の初稿、表現の調整", codex: "投稿管理表や簡単な紹介ページを作る" },
    research: { title: "AIリサーチ・資料整理代行", tags: ["顔出し不要", "経験を転用"], fit: ["research", "organize", "service"], device: "phone", steps: ["調査テーマと納品形式を1つに絞る", "比較表＋要約の見本を作る", "クラウドソーシングや知人へ提案する"], chat: "調査設計、論点整理、要約、抜け漏れ確認", codex: "情報整理用の検索・一覧ツールを作る" },
    support: { title: "AI事務・オンライン秘書", tags: ["継続契約向き", "裏方スキル"], fit: ["support", "organize", "service"], device: "phone", steps: ["できる業務を5つに限定する", "依頼受付テンプレと作業手順を作る", "週2時間のお試しプランを提案する"], chat: "メール、議事録、タスク整理、マニュアル作成", codex: "定型作業用フォームや管理画面を作る" },
    creator: { title: "顔出しなしAIコンテンツ制作", tags: ["発信型", "資産になる"], fit: ["design", "write", "content", "no"], device: "phone", steps: ["悩みが明確な1テーマを選ぶ", "ショート動画または図解を10本作る", "反応が良いテーマをテンプレ商品化する"], chat: "ネタ探し、台本、タイトル、投稿文", codex: "プレゼントサイトや販売ページを作る" },
    web: { title: "小規模事業者向けWeb制作", tags: ["Codex活用度大", "単価を上げやすい"], fit: ["design", "organize", "web", "pc"], device: "pc", steps: ["予約ページなど1商品に絞る", "架空店舗の見本サイトを1つ公開する", "近隣店舗へ改善案付きで提案する"], chat: "顧客ヒアリング、構成、文章、提案書", codex: "サイト、フォーム、簡易ツールを実装・公開" },
    template: { title: "実務テンプレ・ミニ教材販売", tags: ["在庫不要", "繰り返し販売"], fit: ["organize", "write", "digital"], device: "phone", steps: ["自分が解決した悩みを1つ選ぶ", "チェックリストとテンプレを5点作る", "無料版を配布し反応から有料版を改善する"], chat: "教材構成、テンプレ本文、購入者FAQ", codex: "配布ページ、検索サイト、販売導線を作る" },
    lesson: { title: "初心者向けAI活用サポート", tags: ["会話力を活かす", "地域でも販売可"], fit: ["talk", "support", "service", "ok"], device: "phone", steps: ["対象をスマホ初心者などに絞る", "60分でできる内容を3つに限定する", "知人1名へ体験してもらい声を集める"], chat: "説明資料、練習問題、相手別の教え方", codex: "予約ページや復習用ミニツールを作る" }
  };

  function values(name) { return $$(`[name="${name}"]:checked`, form).map(el => el.value); }
  function value(name) { return $(`[name="${name}"]:checked`, form)?.value || ""; }
  function text(name) { return ($(`[name="${name}"]`, form)?.value || "").trim(); }
  function data() { return { nickname: text("nickname"), status: value("status"), priority: value("priority"), daily: values("daily"), work: values("work"), strength: values("strength"), interest: values("interest"), time: value("time"), income: value("income"), level: value("level"), device: value("device"), face: value("face"), context: text("context"), goal: text("goal") }; }
  function escapeHtml(str) { return String(str).replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch])); }

  function showStep(step) {
    currentStep = Math.max(1, Math.min(10, step));
    steps.forEach(el => el.classList.toggle("is-active", Number(el.dataset.step) === currentStep));
    $("#stepLabel").textContent = `STEP ${currentStep} / 10`;
    $("#stepTitle").textContent = labels[currentStep - 1];
    $("#progressBar").style.width = `${currentStep * 10}%`;
    $("[data-prev]").hidden = currentStep === 1;
    $("[data-next]").hidden = currentStep === 10;
    $(".rm-generate").hidden = currentStep !== 10;
    $("#formError").textContent = "";
    diagnosis.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validStep() {
    const section = $(`.rm-step[data-step="${currentStep}"]`);
    const requiredGroups = [...new Set($$("[required]", section).map(el => el.name))];
    for (const name of requiredGroups) {
      const fields = $$(`[name="${name}"]`, section);
      if (fields[0]?.type === "radio" && !fields.some(el => el.checked)) return false;
      if (fields[0]?.type !== "radio" && !fields[0]?.value.trim()) return false;
    }
    return true;
  }

  function pickSide(d) {
    const scores = Object.fromEntries(Object.keys(sideLibrary).map(key => [key, 0]));
    for (const [key, item] of Object.entries(sideLibrary)) {
      item.fit.forEach(tag => { if (d.strength.includes(tag) || d.interest.includes(tag) || d.face === tag || d.device === tag) scores[key] += 3; });
      if (item.device === d.device) scores[key] += 2;
    }
    if (d.work.includes("marketing")) { scores.writing += 3; scores.creator += 3; }
    if (d.work.includes("system")) scores.web += 5;
    if (d.work.includes("document") || d.work.includes("data")) scores.research += 3;
    if (d.status === "homemaker") { scores.support += 2; scores.template += 2; }
    if (d.face === "no") { scores.creator += 2; scores.research += 2; }
    if (d.device === "phone") scores.web -= 4;
    if (d.time === "15") { scores.writing += 2; scores.template += 1; }
    const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a] || a.localeCompare(b));
    return ranked[(angle % 3 === 0 ? 0 : Math.min(angle, 2))];
  }

  function usageCard(title, tool, body, action) {
    return `<article class="rm-use-card"><span>${escapeHtml(tool)}</span><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p><b>最初の一歩</b><small>${escapeHtml(action)}</small></article>`;
  }

  function buildPrompt(title, tool, content) {
    return `<article class="rm-prompt-card"><div><span>${escapeHtml(tool)}</span><h4>${escapeHtml(title)}</h4></div><pre>${escapeHtml(content)}</pre><button type="button" data-copy>コピーする</button></article>`;
  }

  function generate() {
    const d = data();
    const sideKey = pickSide(d);
    const side = sideLibrary[sideKey];
    const dailyKeys = d.daily.length ? d.daily : ["schedule", "learning"];
    const workKeys = d.work.length ? d.work : ["email", d.device === "pc" ? "system" : "document"];
    const context = d.context || `${labelMap.status[d.status]}としての経験`;
    const goal = d.goal || `無理なく月${d.income}万円の収入を目指すこと`;
    const pace = d.time === "15" ? "毎日15〜30分" : d.time === "60" ? "平日1時間" : "1日2時間以上";
    const type = d.priority === "income" ? "収益化スターター" : d.priority === "create" ? "AIものづくり型" : d.priority === "work" ? "仕事アップデート型" : "時間創出型";

    $("#resultName").textContent = d.nickname;
    $("#resultType").textContent = type;
    $("#resultTypeNote").textContent = `${labelMap.level[d.level]} × ${pace}`;
    $("#resultSummary").textContent = `「${context}」という現在地を土台に、まず日常と仕事でAIに慣れ、同じ力を「${side.title}」へ転用するのが最短ルートです。あなたの場合は、機能を広く覚えるより、毎週ひとつ完成物を作る進め方が向いています。`;

    $("#dailyCards").innerHTML = dailyKeys.slice(0, 3).map((key, i) => {
      const item = dailyLibrary[key];
      const actions = ["今日の実際の情報を箇条書きで入力する", "一度使い、違う部分をチャッピーへ伝えて直す", "良かった回答をメモに保存して再利用する"];
      return usageCard(item[0], "チャッピー", item[1], actions[i]);
    }).join("");

    $("#workCards").innerHTML = workKeys.slice(0, 3).map((key, i) => {
      const item = workLibrary[key];
      const actions = ["過去の仕事を1件だけ題材に試す", "AIの案を自分の経験で確認・修正する", d.device === "pc" ? "繰り返す作業をCodexに画面化してもらう" : "パソコンが使える時にCodexで仕組み化する"];
      return usageCard(item[0], item[1], item[2], actions[i]);
    }).join("");

    $("#sideTitle").textContent = side.title;
    $("#sideReason").textContent = `${d.strength.length ? "「" + d.strength.map(x => ({talk:"話す力",write:"伝える力",design:"整える力",organize:"整理力",research:"調査力",support:"支援力"}[x])).join("・") + "」" : "これまでの経験"}と、${d.device === "pc" ? "パソコンを使える環境" : "スマホから小さく始めたい条件"}を活かしやすい提案です。最初から大きく稼ごうとせず、1人へ価値を届けて実績を作ります。`;
    $("#sideMeta").innerHTML = side.tags.map(tag => `<span>${tag}</span>`).join("") + `<span>目標 月${d.income}万円</span>`;
    $("#sideCards").innerHTML = side.steps.map((step, i) => usageCard(`${i + 1}. ${["商品を絞る", "見本を作る", "最初の1人へ提案"][i]}`, i === 0 ? "設計" : i === 1 ? "制作" : "販売", step, i === 0 ? "誰のどんな悩みを解決するか1文にする" : i === 1 ? "60点でも見せられる形にする" : "売り込まず、困りごとを聞く" )).join("");

    const weeks = [
      ["1〜3日目", "AIに自分を理解させる", `下の専用プロンプトを使い、${context}、得意・苦手、目標を整理。日常タスクを1つAIへ任せます。`],
      ["4〜7日目", "仕事で1つ時短する", `${workLibrary[workKeys[0]][0]}を実務で3回試し、修正指示も含めて自分の型として保存します。`],
      ["8〜14日目", "売れる形を調べる", `${side.title}を必要とする相手を10件観察。悩み・価格・既存サービスの不足をチャッピーと整理します。`],
      ["15〜21日目", "見本を完成させる", `Codexとチャッピーを補助に、${side.steps[1]}。説明できるURLまたはファイルを1つ完成させます。`],
      ["22〜30日目", "1人に届けて改善する", `${side.steps[2]}。反応を記録し、提案文・内容・価格のどこを直すかAIと振り返ります。`]
    ];
    $("#timeline").innerHTML = weeks.map((w, i) => `<article><b>${i + 1}</b><div><span>${w[0]}</span><h4>${w[1]}</h4><p>${w[2]}</p></div></article>`).join("");

    const strengthNames = d.strength.map(x => ({talk:"話す・聞く",write:"書く・伝える",design:"見た目を整える",organize:"整理・管理",research:"調査・比較",support:"支援・教育"}[x])).join("、") || "会話しながら見つけたい";
    const masterPrompt = `あなたは私専属のAI活用コーチです。\n私の状況：${context}\n最優先：${labelMap.priority[d.priority]}\n実現したいこと：${goal}\n使える時間：${pace}\nAI経験：${labelMap.level[d.level]}\n\n次のルールで支援してください。\n1. 最初に不足情報を最大3問だけ質問する\n2. 一般論ではなく、今日実行できる15〜60分の行動へ分解する\n3. 私が入力すべき内容は、質問形式で一つずつ聞く\n4. 出力は「結論・手順・完成例・確認項目」の順にする\n5. 難しい言葉を避け、判断が必要な箇所は選択肢を示す\n6. 最後に次の一歩を一つだけ提案する\n\nまず、私が今週AIで最も効果を出しやすい作業を3つ、理由と削減できそうな時間の目安付きで提案してください。`;
    const sidePrompt = `あなたは小さな副業の立ち上げに強い事業コーチです。私は「${side.title}」を0から始めます。\n背景：${context}\n目標：${goal}\n使える時間：${pace}\n強み：${strengthNames}\n\n誇張や収益保証をせず、最初の顧客1人を獲得する計画を作ってください。\n・対象顧客を具体的に3案\n・その人が今困っていること\n・最小の商品内容と納品物\n・無料サンプルの作り方\n・実績ゼロでも失礼にならない提案文\n・初回価格の考え方\n・7日間の行動表\n・失敗しやすい点と回避策\n最後に、私へ確認したい質問を一つずつしてください。`;
    const codexPrompt = `Codexへ：私が「${side.title}」の実績見本として使える、スマートフォン対応の1ページWebサイトを作ってください。\n目的：見込み客がサービス内容、納品物、依頼の流れを3分で理解できること。\n私の背景：${context}\n対象：私の経験を活かして支援できる小規模事業者または個人。\n掲載内容：悩み、提供サービス、納品例、3ステップの流れ、よくある質問、問い合わせボタン。\nデザイン：信頼感があり、読みやすく、派手すぎない。\n要件：HTML/CSS/JavaScriptで動作、スマホ最適化、入力内容を後から簡単に変更できる構造、個人情報や秘密鍵はコードへ含めない。\n進め方：最初に必要な質問を最大5つ聞き、その後に構成案を示し、確認後に実装してください。完成後は公開方法と修正方法も初心者向けに説明してください。`;
    const reviewPrompt = `今日行ったことを振り返るコーチになってください。\n私の30日目標：${goal}\n本日の作業：[ここに今日したことを貼る]\n結果・反応：[ここに結果を貼る]\n\n以下の順に、短く具体的に回答してください。\n1. 目標に近づいた点\n2. 時間を使いすぎた点\n3. 次回も残すべき手順\n4. AIまたはCodexへ任せられる部分\n5. 明日${d.time === "15" ? "15分" : d.time === "60" ? "60分" : "120分"}で行う最重要タスク1つ\n厳しい否定ではなく、事実と改善案を分けてください。`;
    $("#promptCards").innerHTML = [buildPrompt("専属AIコーチを作る", "チャッピー", masterPrompt), buildPrompt("0→1副業プランを具体化", "チャッピー", sidePrompt), buildPrompt("実績見本を制作する", "Codex", codexPrompt), buildPrompt("毎日の改善を続ける", "チャッピー", reviewPrompt)].join("");
    $("#firstAction").textContent = `下の「専属AIコーチを作る」プロンプトをコピーし、チャッピーへ貼り付けてください。回答が出たら、${dailyLibrary[dailyKeys[0]][0]}を今日1回だけ実行しましょう。`;

    diagnosis.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
    bindCopy();
  }

  function bindCopy() {
    $$('[data-copy]').forEach(button => button.addEventListener("click", async () => {
      const prompt = $("pre", button.closest(".rm-prompt-card")).textContent;
      try { await navigator.clipboard.writeText(prompt); button.textContent = "コピーしました ✓"; }
      catch { button.textContent = "長押ししてコピーしてください"; }
      setTimeout(() => { button.textContent = "コピーする"; }, 2200);
    }));
  }

  $$('[data-start]').forEach(button => button.addEventListener("click", () => { diagnosis.hidden = false; result.hidden = true; showStep(1); }));
  $("[data-next]").addEventListener("click", () => { if (!validStep()) { $("#formError").textContent = "選択または入力してから次へ進んでください。"; return; } showStep(currentStep + 1); });
  $("[data-prev]").addEventListener("click", () => showStep(currentStep - 1));
  form.addEventListener("submit", event => { event.preventDefault(); if (!validStep()) { $("#formError").textContent = "入力内容を確認してください。"; return; } generate(); });
  $$('[data-reset]').forEach(button => button.addEventListener("click", () => { form.reset(); angle = 0; result.hidden = true; diagnosis.hidden = false; showStep(1); }));
  $("[data-angle]").addEventListener("click", () => { angle += 1; generate(); });
  $("[data-print]").addEventListener("click", () => window.print());
  $$('[data-limit]').forEach(group => group.addEventListener("change", event => { const checked = $$('input:checked', group); if (checked.length > Number(group.dataset.limit)) { event.target.checked = false; $("#formError").textContent = `最大${group.dataset.limit}つまで選べます。`; } }));
})();
