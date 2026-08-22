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
    ".section-heading, .reason-grid, .split-layout, .guarantee-box, .comparison-table, .bonus-layout, .faq-layout, .company-layout, .briefing-panel, .legal-list, .policy-stack section, .curriculum-summary, .roadmap-panel, .deliverables-panel, .briefing-visual, .briefing-bonus-row, .briefing-program, .booking-calendar, .plan-grid"
  ),
];

const staggerTargets = [
  ...document.querySelectorAll(".worry-grid, .level-stack, .chapter-grid, .bonus-list, .flow-diagram, .calendar-grid, .plan-grid"),
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

const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
const reduceMotion = Boolean(motionQuery?.matches);
const saveData = Boolean(navigator.connection?.saveData);

function initHeroParticles() {
  const canvas = document.querySelector(".hero-particles");
  const hero = document.querySelector(".hero");
  if (!(canvas instanceof HTMLCanvasElement) || !hero || reduceMotion || saveData) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  const hardware = navigator.hardwareConcurrency || 4;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.35 : 1.6);
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, force: 0 };
  const ripples = [];
  let particles = [];
  let width = 0;
  let height = 0;
  let running = false;
  let visible = true;
  let frame = 0;
  let lastTime = performance.now();
  let quality = 1;

  const aiShape = [
    [0.20, 0.64], [0.24, 0.52], [0.28, 0.40], [0.32, 0.28], [0.36, 0.40], [0.40, 0.52], [0.44, 0.64],
    [0.27, 0.49], [0.37, 0.49],
    [0.56, 0.28], [0.56, 0.40], [0.56, 0.52], [0.56, 0.64],
    [0.50, 0.28], [0.62, 0.28], [0.50, 0.64], [0.62, 0.64],
  ];

  function getParticleCount() {
    const area = Math.max(1, width * height);
    const base = Math.round(area / (isCoarse ? 15000 : 11800));
    const cap = isCoarse ? (hardware <= 4 ? 54 : 72) : (hardware <= 4 ? 82 : 122);
    return Math.max(isCoarse ? 34 : 56, Math.min(cap, base));
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = getParticleCount();
    particles = Array.from({ length: count }, (_, index) => {
      const shape = aiShape[index % aiShape.length];
      const targetX = width * shape[0] + (Math.random() - 0.5) * 34;
      const targetY = height * shape[1] + (Math.random() - 0.5) * 28;
      return {
        x: targetX,
        y: targetY,
        homeX: width * (0.12 + Math.random() * 0.76),
        homeY: height * (0.14 + Math.random() * 0.72),
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: 0.75 + Math.random() * 1.25,
        hue: Math.random() > 0.62 ? "167, 224, 255" : Math.random() > 0.45 ? "160, 146, 255" : "255, 255, 255",
        shapeHold: 1,
      };
    });
  }

  function draw(now) {
    if (!running) return;
    const delta = Math.min(32, now - lastTime);
    lastTime = now;
    frame += 1;

    if (frame % 90 === 0 && delta > 28) quality = Math.max(0.58, quality - 0.12);

    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    pointer.force += ((pointer.active ? 1 : 0) - pointer.force) * 0.06;

    particles.forEach((particle) => {
      particle.shapeHold *= 0.988;
      const driftX = Math.sin((now * 0.00018) + particle.homeY * 0.02) * 18;
      const driftY = Math.cos((now * 0.00016) + particle.homeX * 0.02) * 14;
      const targetX = particle.homeX + driftX;
      const targetY = particle.homeY + driftY;
      const formation = Math.max(0, particle.shapeHold - 0.18);

      particle.vx += ((targetX - particle.x) * 0.0009 + (Math.random() - 0.5) * 0.008) * (1 - formation);
      particle.vy += ((targetY - particle.y) * 0.0009 + (Math.random() - 0.5) * 0.008) * (1 - formation);

      if (pointer.force > 0.02) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const range = isCoarse ? 120 : 150;
        if (distance < range) {
          const push = (1 - distance / range) * pointer.force * 0.055;
          particle.vx += (dx / distance) * push;
          particle.vy += (dy / distance) * push;
        }
      }

      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;
    });

    const maxLineDistance = (isCoarse ? 92 : 112) * quality;
    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance < maxLineDistance) {
          const alpha = (1 - distance / maxLineDistance) * 0.12 * quality;
          context.strokeStyle = `rgba(124, 232, 255, ${alpha})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    ripples.forEach((ripple, index) => {
      ripple.radius += delta * 0.09;
      ripple.alpha *= 0.94;
      context.strokeStyle = `rgba(124, 232, 255, ${ripple.alpha})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.stroke();
      if (ripple.alpha < 0.012) ripples.splice(index, 1);
    });

    particles.forEach((particle) => {
      context.fillStyle = `rgba(${particle.hue}, ${0.34 * quality})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(draw);
  }

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.tx = event.clientX - rect.left;
    pointer.ty = event.clientY - rect.top;
    pointer.active = true;
  }

  function releasePointer() {
    pointer.active = false;
  }

  function addRipple(event) {
    const rect = canvas.getBoundingClientRect();
    ripples.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      radius: 8,
      alpha: 0.32,
    });
  }

  hero.addEventListener("pointermove", updatePointer, { passive: true });
  hero.addEventListener("pointerleave", releasePointer, { passive: true });
  hero.addEventListener("pointercancel", releasePointer, { passive: true });
  hero.addEventListener("pointerup", releasePointer, { passive: true });
  hero.addEventListener("pointerdown", (event) => {
    updatePointer(event);
    addRipple(event);
  }, { passive: true });

  const visibilityObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      }, { threshold: 0.08 })
    : null;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener("resize", () => {
    resize();
    start();
  }, { passive: true });

  resize();
  visibilityObserver?.observe(hero);
  if (!visibilityObserver) start();
}

function initWorryTilt() {
  if (reduceMotion) return;
  const cards = [...document.querySelectorAll(".worry-card")];
  if (!cards.length) return;

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    const reset = () => {
      card.classList.remove("is-tilting");
      card.style.transform = "";
      card.style.setProperty("--tilt-glow", "0");
    };

    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" && Math.abs(event.movementY || 0) > Math.abs(event.movementX || 0)) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 5.2;
      const rotateX = (0.5 - y) * 4.6;
      card.classList.add("is-tilting");
      card.style.transform = `translateY(-3px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      card.style.setProperty("--tilt-x", `${Math.round(x * 100)}%`);
      card.style.setProperty("--tilt-y", `${Math.round(y * 100)}%`);
      card.style.setProperty("--tilt-glow", "1");
    }, { passive: true });

    card.addEventListener("pointerleave", reset, { passive: true });
    card.addEventListener("pointercancel", reset, { passive: true });
    card.addEventListener("pointerup", reset, { passive: true });
  });
}

function initPlanInteraction() {
  const cards = [...document.querySelectorAll("[data-plan-card]")];
  const canvas = document.querySelector(".plan-particles");
  const section = document.querySelector(".plan-section");

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    const reset = () => {
      card.classList.remove("is-active");
      card.style.transform = "";
      card.style.setProperty("--plan-glow", "0");
    };

    card.addEventListener("pointermove", (event) => {
      if (reduceMotion) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 3.2;
      const rotateX = (0.5 - y) * 2.8;
      card.classList.add("is-active");
      card.style.transform = `translateY(-4px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      card.style.setProperty("--plan-x", `${Math.round(x * 100)}%`);
      card.style.setProperty("--plan-y", `${Math.round(y * 100)}%`);
      card.style.setProperty("--plan-glow", "1");
    }, { passive: true });

    card.addEventListener("pointerleave", reset, { passive: true });
    card.addEventListener("pointercancel", reset, { passive: true });
    card.addEventListener("pointerup", reset, { passive: true });
  });

  if (!(canvas instanceof HTMLCanvasElement) || !section || reduceMotion || saveData) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.2 : 1.45);
  const dots = [];
  const pointer = { x: 0, y: 0, tx: -999, ty: -999, active: false };
  let width = 0;
  let height = 0;
  let running = false;
  let visible = true;

  function resize() {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(coarse ? 34 : 52, Math.max(24, Math.round((width * height) / 24000)));
    dots.length = 0;
    for (let i = 0; i < count; i += 1) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.8 + Math.random() * 1.6,
      });
    }
  }

  function draw() {
    if (!running) return;
    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    dots.forEach((dot, index) => {
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.x < -10) dot.x = width + 10;
      if (dot.x > width + 10) dot.x = -10;
      if (dot.y < -10) dot.y = height + 10;
      if (dot.y > height + 10) dot.y = -10;

      if (pointer.active) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < 150) {
          dot.x += (dx / distance) * 0.42;
          dot.y += (dy / distance) * 0.42;
        }
      }

      context.fillStyle = index % 3 === 0 ? "rgba(112, 88, 255, 0.18)" : "rgba(22, 135, 255, 0.16)";
      context.beginPath();
      context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(draw);
  }

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
  }

  section.addEventListener("pointermove", (event) => {
    const rect = section.getBoundingClientRect();
    pointer.tx = event.clientX - rect.left;
    pointer.ty = event.clientY - rect.top;
    pointer.active = true;
  }, { passive: true });
  section.addEventListener("pointerleave", () => {
    pointer.active = false;
  }, { passive: true });

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      }, { threshold: 0.05 })
    : null;

  window.addEventListener("resize", () => {
    resize();
    start();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  observer?.observe(section);
  if (!observer) start();
}

function initFinalCtaInteraction() {
  const panel = document.querySelector(".briefing-panel");
  const button = panel?.querySelector(".button.primary");
  if (!(panel instanceof HTMLElement) || !(button instanceof HTMLElement)) return;

  const sparkCount = 12;
  for (let i = 0; i < sparkCount; i += 1) {
    const spark = document.createElement("span");
    spark.className = "cta-spark";
    const x = 14 + Math.random() * 78;
    const y = 18 + Math.random() * 66;
    spark.style.setProperty("--spark-x", `${x}%`);
    spark.style.setProperty("--spark-y", `${y}%`);
    spark.style.setProperty("--spark-pull-x", `${(50 - x) * 0.8}px`);
    spark.style.setProperty("--spark-pull-y", `${(50 - y) * 0.5}px`);
    panel.append(spark);
  }

  if (reduceMotion) return;

  let ctaFrame = 0;
  let targetX = 82;
  let targetY = 42;
  let currentX = targetX;
  let currentY = targetY;
  let active = false;

  function animateLight() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    panel.style.setProperty("--cta-x", `${currentX.toFixed(2)}%`);
    panel.style.setProperty("--cta-y", `${currentY.toFixed(2)}%`);
    if (active) ctaFrame = requestAnimationFrame(animateLight);
  }

  function moveLight(event) {
    const rect = panel.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width) * 100;
    targetY = ((event.clientY - rect.top) / rect.height) * 100;
    panel.classList.add("is-active");
    if (!active) {
      active = true;
      ctaFrame = requestAnimationFrame(animateLight);
    }
  }

  function settleLight() {
    targetX = 82;
    targetY = 42;
    panel.classList.remove("is-active");
    window.setTimeout(() => {
      active = false;
      cancelAnimationFrame(ctaFrame);
    }, 520);
  }

  panel.addEventListener("pointermove", moveLight, { passive: true });
  panel.addEventListener("pointerleave", settleLight, { passive: true });
  panel.addEventListener("pointercancel", settleLight, { passive: true });

  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "button-ripple";
    const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
    const y = event.clientY ? event.clientY - rect.top : rect.height / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.append(ripple);
    panel.classList.add("is-rippling");
    window.setTimeout(() => ripple.remove(), 700);
    window.setTimeout(() => panel.classList.remove("is-rippling"), 460);
  });
}

initHeroParticles();
initWorryTilt();
initPlanInteraction();
initFinalCtaInteraction();

const bookingForm = document.querySelector("#bookingForm");
const bookingSlotsContainer = document.querySelector("#bookingSlots");
const bookingZoomUrl = "https://us05web.zoom.us/j/87362640884?pwd=K1hsImx0aSZtk5du0V5NtHF1UwCAXs.1";
const bookingConfig = window.AI_LIFE_BOOKING_CONFIG || {};
let bookingCalendarMonth = null;

function fetchJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `aiLifeBooking_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");
    const separator = url.includes("?") ? "&" : "?";
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("予約管理システムから応答がありません。"));
    }, 15000);
    const cleanup = () => {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    };

    script.src = `${url}${separator}callback=${encodeURIComponent(callbackName)}`;
    script.async = true;

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
    })).filter((slot) => !isExpiredSlot(slot)),
  })).filter((week) => week.slots.length > 0);
}

function flattenSlots(weeks) {
  return weeks.flatMap((week) => week.slots || []);
}

function getSlotDate(slot) {
  const idMatch = String(slot.id || "").match(/(\d{4})-(\d{2})-(\d{2})/);
  if (idMatch) {
    return new Date(Number(idMatch[1]), Number(idMatch[2]) - 1, Number(idMatch[3]));
  }

  const dateMatch = String(slot.date || "").match(/(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日/);
  if (!dateMatch) return null;
  const now = new Date();
  const year = Number(dateMatch[1] || now.getFullYear());
  return new Date(year, Number(dateMatch[2]) - 1, Number(dateMatch[3]));
}

function getSlotStartDateTime(slot) {
  const date = getSlotDate(slot);
  if (!date) return null;
  const timeMatch = String(slot.time || "").match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) return date;
  date.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
  return date;
}

function isExpiredSlot(slot) {
  const start = getSlotStartDateTime(slot);
  if (!start) return false;
  return start.getTime() <= Date.now();
}

function formatMonthTitle(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function formatDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function buildCalendarSlots(slots) {
  const grouped = new Map();
  slots.forEach((slot) => {
    const date = getSlotDate(slot);
    if (!date || Number.isNaN(date.getTime())) return;
    const key = formatDateKey(date);
    if (!grouped.has(key)) grouped.set(key, { date, slots: [] });
    grouped.get(key).slots.push(slot);
  });
  return grouped;
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getInitialCalendarMonth(slotMap) {
  const today = getMonthStart(new Date());
  const dates = [...slotMap.values()].map((item) => item.date).sort((a, b) => a - b);
  const upcoming = dates.find((date) => getMonthStart(date) >= today);
  return getMonthStart(upcoming || dates[0] || new Date());
}

function renderBookingSlots(weeksSource = window.AI_LIFE_BOOKING_WEEKS) {
  if (!bookingSlotsContainer) return;

  const weeks = Array.isArray(weeksSource) ? normalizeSlotGroups(weeksSource) : [];
  const slots = flattenSlots(weeks);
  bookingSlotsContainer.replaceChildren();

  if (slots.length === 0) {
    const empty = document.createElement("p");
    empty.className = "slot-loading";
    empty.textContent = "現在、予約可能な日程は準備中です。";
    bookingSlotsContainer.append(empty);
    return;
  }

  const calendar = document.createElement("div");
  calendar.className = "booking-calendar";

  const selected = document.createElement("p");
  selected.className = "calendar-selected";
  selected.textContent = "空き日程をタップしてください。";

  const slotMap = buildCalendarSlots(slots);
  if (!bookingCalendarMonth) bookingCalendarMonth = getInitialCalendarMonth(slotMap);
  const calendarStart = getMonthStart(bookingCalendarMonth);
  const daysInMonth = new Date(calendarStart.getFullYear(), calendarStart.getMonth() + 1, 0).getDate();
  const offset = calendarStart.getDay();

  const header = document.createElement("div");
  header.className = "calendar-header";
  const title = document.createElement("h3");
  title.textContent = formatMonthTitle(calendarStart);
  const legend = document.createElement("span");
  legend.textContent = "空き日程を選択";
  const controls = document.createElement("div");
  controls.className = "calendar-month-controls";
  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.textContent = "前の月";
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "次の月";
  const currentMonth = getMonthStart(new Date());
  previousButton.disabled = calendarStart <= currentMonth;
  previousButton.addEventListener("click", () => {
    bookingCalendarMonth = addMonths(calendarStart, -1);
    renderBookingSlots(weeksSource);
  });
  nextButton.addEventListener("click", () => {
    bookingCalendarMonth = addMonths(calendarStart, 1);
    renderBookingSlots(weeksSource);
  });
  controls.append(previousButton, nextButton);
  header.append(title, legend, controls);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  ["日", "月", "火", "水", "木", "金", "土"].forEach((day) => {
    const cell = document.createElement("span");
    cell.className = "calendar-weekday";
    cell.textContent = day;
    grid.append(cell);
  });

  for (let i = 0; i < offset; i += 1) {
    const blank = document.createElement("span");
    blank.className = "calendar-day is-blank";
    grid.append(blank);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(calendarStart.getFullYear(), calendarStart.getMonth(), day);
    const key = formatDateKey(date);
    const entry = slotMap.get(key);
    const daySlots = entry?.slots || [];
    const available = daySlots.find((slot) => Number(slot.remaining ?? slot.capacity ?? 0) > 0);
    const representative = available || daySlots[0];
    const isFull = daySlots.length > 0 && !available;
    const isAvailable = Boolean(available);
    const cell = representative ? document.createElement("label") : document.createElement("span");
    cell.className = "calendar-day";
    if (representative) cell.classList.add("has-slot");
    if (isFull) cell.classList.add("is-full");

    const dateText = document.createElement("strong");
    dateText.textContent = String(day);
    cell.append(dateText);

    if (representative) {
      const time = document.createElement("small");
      time.textContent = representative.time || "時間未定";
      const seat = document.createElement("em");
      const remaining = Number(representative.remaining ?? representative.capacity ?? 0);
      seat.textContent = isFull ? "満員御礼" : "受付中";
      cell.append(time, seat);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "slot";
      input.value = representative.label || `${representative.date || ""} ${representative.time || ""}`.trim();
      input.dataset.slotId = representative.id || "";
      input.required = isAvailable;
      input.disabled = !isAvailable;
      input.className = "calendar-radio";
      cell.append(input);

      if (isAvailable) {
        cell.addEventListener("click", () => {
          bookingSlotsContainer.querySelectorAll(".calendar-day.is-selected").forEach((element) => {
            element.classList.remove("is-selected");
          });
          input.checked = true;
          cell.classList.add("is-selected");
          selected.textContent = `選択中: ${input.value}`;
        });
      }
    }

    grid.append(cell);
  }

  const hasMonthSlots = [...slotMap.values()].some((entry) => {
    const month = getMonthStart(entry.date);
    return month.getTime() === calendarStart.getTime();
  });
  if (!hasMonthSlots) {
    selected.textContent = "この月の公開枠はまだありません。次の月も確認できます。";
  }

  calendar.append(header, grid, selected);
  bookingSlotsContainer.append(calendar);
}

renderBookingSlots();

async function loadManagedBookingSlots() {
  const endpoint = bookingConfig.apiEndpoint || bookingForm?.dataset.bookingApi || "";
  if (!bookingSlotsContainer || !endpoint) return;

  try {
    const data = await fetchJsonp(`${endpoint}?action=slots`);
    if (data && data.ok && Array.isArray(data.weeks)) {
      bookingCalendarMonth = null;
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

    const bookingApi = bookingForm.dataset.bookingApi || bookingConfig.apiEndpoint || "";
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
    if (!bookingApi && (!endpoint || !hasAllEntries || endpoint.includes("YOUR_"))) {
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
      if (!selectedSlot) throw new Error("希望日程を選択してください。");

      if (bookingApi) {
        const managedData = new URLSearchParams({
          action: "reserve",
          slotId: selectedSlot.dataset.slotId || "",
          slot: data.get("slot") || "",
          name: data.get("name") || "",
          email: data.get("email") || "",
          phone: data.get("phone") || "",
          experience: data.get("experience") || "",
          interest: data.get("interest") || "",
          zoom: bookingZoomUrl,
          source: location.href,
        });
        const result = await fetchJsonp(`${bookingApi}?${managedData.toString()}`);

        if (!result || !result.ok) {
          throw new Error(result?.error || "予約を保存できませんでした。");
        }

        bookingForm.reset();
        await loadManagedBookingSlots();
        status.textContent = "予約内容を送信しました。Zoomリンクをメールでお送りします。";
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

// Editorial motion layer for the AI LIFE homepage.
(() => {
  const homeHero = document.querySelector(".hero");
  if (!homeHero || reduceMotion) return;

  const progress = document.createElement("div");
  progress.className = "motion-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    document.documentElement.style.setProperty("--scroll-progress", String(Math.min(1, scrollY / max)));
  };
  updateProgress();
  addEventListener("scroll", updateProgress, { passive: true });

  if (matchMedia("(pointer:fine)").matches) {
    const cursor = document.createElement("div");
    cursor.className = "motion-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    addEventListener("pointermove", (event) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-active", Boolean(event.target.closest("a,button,summary,.motion-card")));
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  }

  const board = document.querySelector(".hero-proof-board");
  if (board && matchMedia("(pointer:fine)").matches) {
    board.addEventListener("pointermove", (event) => {
      const box = board.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      board.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      board.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
    }, { passive: true });
    board.addEventListener("pointerleave", () => {
      board.style.setProperty("--tilt-x", "0deg");
      board.style.setProperty("--tilt-y", "0deg");
    });
  }

  const tactileCards = document.querySelectorAll(".worry-card,.chapter-card,.plan-card,.bonus-list article,.support-grid article,.flow-diagram article");
  tactileCards.forEach((card) => {
    card.classList.add("motion-card");
    if (!matchMedia("(pointer:fine)").matches) return;
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--card-rx", `${(-y * 2.4).toFixed(2)}deg`);
      card.style.setProperty("--card-ry", `${(x * 3).toFixed(2)}deg`);
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-rx", "0deg");
      card.style.setProperty("--card-ry", "0deg");
    });
  });
})();
