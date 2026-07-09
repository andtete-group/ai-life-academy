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
    ".section-heading, .reason-grid, .split-layout, .guarantee-box, .comparison-table, .bonus-layout, .faq-layout, .company-layout, .briefing-panel, .legal-list, .policy-stack section, .curriculum-summary, .roadmap-panel, .deliverables-panel"
  ),
];

const staggerTargets = [
  ...document.querySelectorAll(".worry-grid, .level-stack, .chapter-grid, .bonus-list, .flow-diagram"),
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
const bookingSlotsContainer = document.querySelector("#bookingSlots");
const bookingZoomUrl = "https://us05web.zoom.us/j/87362640884?pwd=K1hsImx0aSZtk5du0V5NtHF1UwCAXs.1";
const bookingConfig = window.AI_LIFE_BOOKING_CONFIG || {};

function fetchJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `aiLifeBooking_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");
    const separator = url.includes("?") ? "&" : "?";
    script.src = `${url}${separator}callback=${encodeURIComponent(callbackName)}`;
    script.async = true;

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.addEventListener("error", () => {
      cleanup();
      reject(new Error("予約枠を読み込めませんでした。"));
    });

    document.head.append(script);
  });
}

function normalizeSlotGroups(weeks) {
  return (weeks || []).map((week) => ({
    label: week.label || "予約可能日程",
    slots: (week.slots || []).map((slot) => ({
      ...slot,
      id: slot.id || `${slot.date || ""}-${slot.time || ""}`,
      label: slot.label || `${slot.date || ""} ${slot.time || ""}`.trim(),
      capacity: Number(slot.capacity || 0),
      remaining: Number(slot.remaining ?? slot.capacity ?? 0),
    })),
  }));
}

function renderBookingSlots(weeksSource = window.AI_LIFE_BOOKING_WEEKS) {
  if (!bookingSlotsContainer) return;

  const weeks = Array.isArray(weeksSource) ? normalizeSlotGroups(weeksSource) : [];
  bookingSlotsContainer.replaceChildren();

  if (weeks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "slot-loading";
    empty.textContent = "現在、予約可能な日程は準備中です。";
    bookingSlotsContainer.append(empty);
    return;
  }

  let isFirstSlot = true;

  weeks.forEach((week) => {
    const group = document.createElement("div");
    group.className = "slot-week";

    const heading = document.createElement("h3");
    heading.textContent = week.label || "予約可能日程";
    group.append(heading);

    const list = document.createElement("div");
    list.className = "slot-week-list";

    (week.slots || []).forEach((slot) => {
      const value = slot.label || `${slot.date} ${slot.time}`;
      const remaining = Number(slot.remaining ?? slot.capacity ?? 0);
      const isFull = remaining <= 0;
      const label = document.createElement("label");
      label.className = "slot-option";
      if (isFull) label.classList.add("is-full");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "slot";
      input.value = value;
      input.dataset.slotId = slot.id || "";
      input.required = isFirstSlot && !isFull;
      input.disabled = isFull;

      const text = document.createElement("span");
      const main = document.createElement("strong");
      main.textContent = value;
      const note = document.createElement("small");
      note.textContent = slot.note || "オンラインZoom説明会";
      const seat = document.createElement("em");
      seat.className = isFull ? "slot-seat is-full" : "slot-seat";
      seat.textContent = isFull ? "満員御礼" : `残席 ${remaining}`;

      text.append(main, note, seat);
      label.append(input, text);
      list.append(label);
      if (!isFull) isFirstSlot = false;
    });

    group.append(list);
    bookingSlotsContainer.append(group);
  });
}

renderBookingSlots();

async function loadManagedBookingSlots() {
  const endpoint = bookingConfig.apiEndpoint || bookingForm?.dataset.bookingApi || "";
  if (!bookingSlotsContainer || !endpoint) return;

  try {
    const data = await fetchJsonp(`${endpoint}?action=slots`);
    if (data && data.ok && Array.isArray(data.weeks)) {
      renderBookingSlots(data.weeks);
    }
  } catch (error) {
    const warning = document.createElement("p");
    warning.className = "slot-loading";
    warning.textContent = "管理システムの日程を読み込めないため、仮の日程を表示しています。";
    bookingSlotsContainer.prepend(warning);
  }
}

loadManagedBookingSlots();

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
      const selectedSlot = bookingForm.querySelector('input[name="slot"]:checked');
      const bookingApi = bookingForm.dataset.bookingApi || bookingConfig.apiEndpoint || "";

      if (bookingApi) {
        const managedData = new URLSearchParams();
        managedData.append("action", "reserve");
        managedData.append("slotId", selectedSlot?.dataset.slotId || "");
        managedData.append("slot", data.get("slot") || "");
        managedData.append("name", data.get("name") || "");
        managedData.append("email", data.get("email") || "");
        managedData.append("phone", data.get("phone") || "");
        managedData.append("experience", data.get("experience") || "");
        managedData.append("interest", data.get("interest") || "");
        managedData.append("coupon", data.get("briefingCoupon") ? "FS20260701" : "");
        managedData.append("zoom", bookingZoomUrl);
        managedData.append("source", location.href);

        await fetch(bookingApi, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: managedData.toString(),
        });

        bookingForm.reset();
        await loadManagedBookingSlots();
        status.textContent =
          `予約内容を送信しました。Zoomリンクをメールでお送りします。クーポンコード: FS20260701`;
        return;
      }

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
