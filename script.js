const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

document.body.classList.add("is-loaded");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

const revealTargets = [
  ...document.querySelectorAll(
    ".section-heading, .reason-grid, .split-layout, .guarantee-box, .comparison-table, .bonus-layout, .faq-layout, .company-layout, .briefing-panel, .legal-list, .policy-stack section"
  ),
];

const staggerTargets = [
  ...document.querySelectorAll(".worry-grid, .level-stack, .bonus-list, .flow-diagram"),
];

revealTargets.forEach((element) => element.classList.add("reveal"));
staggerTargets.forEach((element) => element.classList.add("reveal-stagger"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  [...revealTargets, ...staggerTargets].forEach((element) => observer.observe(element));
} else {
  [...revealTargets, ...staggerTargets].forEach((element) => element.classList.add("is-visible"));
}

const bookingForm = document.querySelector("#bookingForm");
const bookingZoomUrl = "https://us05web.zoom.us/j/87362640884?pwd=K1hsImx0aSZtk5du0V5NtHF1UwCAXs.1";

if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let status = bookingForm.querySelector(".form-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      bookingForm.append(status);
    }

    const endpoint = bookingForm.dataset.endpoint || bookingForm.action;
    const googleFormEntries = {
      slot: bookingForm.dataset.entrySlot,
      name: bookingForm.dataset.entryName,
      email: bookingForm.dataset.entryEmail,
      phone: bookingForm.dataset.entryPhone,
      experience: bookingForm.dataset.entryExperience,
      interest: bookingForm.dataset.entryInterest,
      zoom: bookingForm.dataset.entryZoom,
      source: bookingForm.dataset.entrySource,
    };
    const hasAllEntries = Object.values(googleFormEntries).every(Boolean);
    if (!endpoint || !hasAllEntries || endpoint.includes("YOUR_")) {
      status.textContent =
        "予約フォームの保存先がまだ設定されていません。設定後、このフォームからスプレッドシート保存が動きます。";
      return;
    }

    const submitButton = bookingForm.querySelector('button[type="submit"]');
    status.textContent = "送信中です...";
    if (submitButton) submitButton.disabled = true;

    try {
      const data = new FormData(bookingForm);
      const googleFormData = new FormData();
      googleFormData.append(googleFormEntries.slot, data.get("slot") || "");
      googleFormData.append(googleFormEntries.name, data.get("name") || "");
      googleFormData.append(googleFormEntries.email, data.get("email") || "");
      googleFormData.append(googleFormEntries.phone, data.get("phone") || "");
      googleFormData.append(googleFormEntries.experience, data.get("experience") || "");
      googleFormData.append(googleFormEntries.interest, data.get("interest") || "");
      googleFormData.append(googleFormEntries.zoom, bookingZoomUrl);
      googleFormData.append(googleFormEntries.source, location.href);

      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData,
      });

      bookingForm.reset();
      status.textContent =
        `予約内容を送信しました。Zoomはこちらです: ${bookingZoomUrl}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (location.protocol === "file:") {
        status.textContent =
          "file://で直接開いたページからは送信できない場合があります。公開URLまたは http://127.0.0.1:4173/booking.html から開いて送信してください。";
      } else {
        status.textContent = `送信できませんでした。${message || "時間をおいて再度お試しください。"}`;
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
