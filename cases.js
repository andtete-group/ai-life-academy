document.addEventListener("DOMContentLoaded", () => {
  const cases = {
    aya: { image:"assets/cases/aya.jpg", job:"ハンドメイド作家", name:"ayaさん", result:"売上3倍・月100万円到達", before:"制作以外の販売管理や雑務に追われていた", action:"販売管理と日々の雑務をAI化", after:"作品づくりに集中。売上も大きく変化", quote:"好きなことに集中できる時間が増えて、売上も気持ちも変わりました。" },
    takuya: { image:"assets/cases/takuya.jpg", job:"温浴施設経営者", name:"Takuyaさん", result:"月間売上50万円以上UP", before:"現場と管理業務を一人で抱えていた", action:"LINE・売上管理・マニュアルを仕組み化", after:"離職率が改善。顧客満足と売上も向上", quote:"現場に立ちながらでも、運営の仕組み化を進められました。" },
    sanaInfluencer: { image:"assets/cases/sana-influencer.jpg", job:"インフルエンサー", name:"Sanaさん", result:"フォロワー8倍・月30万円達成", before:"投稿時間がなく、ネタも続かなかった", action:"企画・投稿作成・運用をAIで効率化", after:"発信量が増え、収益化まで到達", quote:"子どもとの時間を守りながら、自分の夢も進められました。" },
    sanaBar: { image:"assets/cases/sana-bar.jpg", job:"会社員・副業", name:"sanaさん", result:"月200万再生・月16万円達成", before:"シフト後の編集とネタ探しが負担だった", action:"ネタ出しと編集フローを半自動化", after:"毎日発信が続き、再生と収益が拡大", quote:"忙しい日でも投稿が止まらず、好きな発信を続けられています。" },
    daiki: { image:"assets/cases/daiki.jpg", job:"芸人・TikTok発信", name:"だいきさん", result:"収益化成功・月10万円", before:"バズる企画の型が分からなかった", action:"AIで企画を量産し、準備を自動化", after:"当たる型を発見し、発信が収益に", quote:"撮影に集中できて、発信のハードルが一気に下がりました。" },
    fourKicks: { image:"assets/cases/four-kicks.jpg", job:"サッカー系YouTuber", name:"FOUR KICKS", result:"13万人達成・収益化", before:"4人分の企画と準備が重かった", action:"企画・台本・編集準備をAIで分担", after:"撮影本数が増え、伸びる流れを構築", quote:"仲間と撮る時間に集中でき、発信を続ける仕組みができました。" },
    yuru: { image:"assets/cases/yuru.jpg", job:"専業主婦・TikTok発信", name:"ゆるさん", result:"1か月で1万人・初月7万円", before:"子育て中に編集時間を確保できなかった", action:"編集を自動化し、流行の型で発信", after:"好きなことが仕事になる一歩を実現", quote:"発信が続けやすくなり、仕事にする未来が見えてきました。" }
  };

  const floating = document.querySelector("#floatingCta");
  const finalCard = document.querySelector(".experience-card");
  if (floating && finalCard && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => floating.classList.toggle("is-hidden", entry.isIntersecting), { threshold: .15 }).observe(finalCard);
  }

  const slider = document.querySelector("#achieverSlider");
  const progress = document.querySelector(".slider-progress span");
  const updateFocusedCard = () => {
    if (!slider) return;
    const center = slider.getBoundingClientRect().left + slider.clientWidth / 2;
    let closest = null;
    let distance = Infinity;
    slider.querySelectorAll(".achiever-card").forEach(card => {
      const rect = card.getBoundingClientRect();
      const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
      if (nextDistance < distance) { closest = card; distance = nextDistance; }
    });
    slider.querySelectorAll(".achiever-card").forEach(card => card.classList.toggle("is-focus", card === closest));
  };
  document.querySelector(".slide-arrow.prev")?.addEventListener("click", () => slider?.scrollBy({left:-378,behavior:"smooth"}));
  document.querySelector(".slide-arrow.next")?.addEventListener("click", () => slider?.scrollBy({left:378,behavior:"smooth"}));
  slider?.addEventListener("scroll", () => {
    const max = slider.scrollWidth - slider.clientWidth;
    const ratio = max > 0 ? slider.scrollLeft / max : 0;
    if (progress) progress.style.transform = `translateX(${ratio * 455}%)`;
    window.requestAnimationFrame(updateFocusedCard);
  }, {passive:true});
  updateFocusedCard();
  window.addEventListener("resize", updateFocusedCard, {passive:true});

  const dialog = document.querySelector("#caseDialog");
  const set = (selector, value) => { const el = dialog?.querySelector(selector); if (el) el.textContent = value; };
  document.querySelectorAll("[data-case]").forEach(card => card.addEventListener("click", () => {
    const item = cases[card.dataset.case];
    if (!dialog || !item) return;
    const image = dialog.querySelector("img");
    image.src = item.image; image.alt = `${item.name}のAI活用実績`;
    set(".dialog-job", item.job); set(".dialog-name", item.name); set(".dialog-result", item.result);
    set(".dialog-before", item.before); set(".dialog-action", item.action); set(".dialog-after", item.after); set(".dialog-quote", `“${item.quote}”`);
    dialog.showModal();
  }));
  dialog?.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("in-view"); reveal.unobserve(entry.target); }
  }), {threshold:.12});
  document.querySelectorAll(".story,.story-card,.income-case,.achiever-card").forEach(el => { el.classList.add("reveal"); reveal.observe(el); });
});
