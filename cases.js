document.addEventListener("DOMContentLoaded", () => {
  const floating = document.querySelector("#floatingCta");
  const finalCard = document.querySelector(".experience-card");
  if (!floating || !finalCard || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(([entry]) => {
    floating.classList.toggle("is-hidden", entry.isIntersecting);
  }, { threshold: 0.15 });
  observer.observe(finalCard);

  const dialog = document.querySelector("#caseDialog");
  const dialogImage = dialog?.querySelector("img");
  document.querySelectorAll("[data-case-image]").forEach((card) => {
    card.addEventListener("click", () => {
      if (!dialog || !dialogImage) return;
      dialogImage.src = card.dataset.caseImage;
      dialogImage.alt = card.querySelector("img")?.alt || "実績者の詳細";
      dialog.showModal();
    });
  });
  dialog?.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});
