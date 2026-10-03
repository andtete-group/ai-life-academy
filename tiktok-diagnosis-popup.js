(() => {
  const ROOT = "https://ai-life-tiktok-prompt-box.fumiy88.chatgpt.site";
  const source = "tiktok-cases";
  const sessionKey = "ailifeDiagnosisSession";
  let session = localStorage.getItem(sessionKey);
  if (!session) {
    session = crypto.randomUUID();
    localStorage.setItem(sessionKey, session);
  }
  const track = (type) => fetch(`${ROOT}/api/diagnosis-events`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ eventType: type, source, sessionId: session, eventId: `${session}:${source}:${type}` }), keepalive: true,
  }).catch(() => {});
  const wrap = document.createElement("div");
  wrap.innerHTML = `<div class="tdp-backdrop" id="tdp"><aside class="tdp-card tdp-poster-card" role="dialog" aria-modal="true" aria-label="TikTok発信タイプ診断"><button class="tdp-close tdp-poster-close" aria-label="閉じる">×</button><a class="tdp-poster" href="${ROOT}/diagnosis?source=${source}" aria-label="60秒でTikTok発信タイプを無料診断する"><img src="tiktok-diagnosis-popup.jpg" alt="60秒でわかる、あなたに向いているTikTok発信タイプ。発信ジャンル、企画タイプ、収益化の進め方を無料診断"></a></aside></div><button class="tdp-chip" type="button"><i>60秒</i>私のTikTokタイプを診断</button>`;
  document.body.append(...wrap.children);
  const modal = document.getElementById("tdp");
  const open = () => { modal.classList.add("is-open"); track("popup_view"); };
  const close = () => modal.classList.remove("is-open");
  modal.querySelector(".tdp-close").onclick = close;
  modal.onclick = (event) => { if (event.target === modal) close(); };
  document.querySelector(".tdp-chip").onclick = open;
  if (!sessionStorage.getItem("tdpShown")) setTimeout(() => { sessionStorage.setItem("tdpShown", "1"); open(); }, 350);
})();
