const weddingDate = new Date("2026-09-06T19:00:00+05:00");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const openInvite = document.getElementById("openInvite");
const leafLayer = document.getElementById("leafLayer");
const parallaxLayers = document.querySelectorAll(".parallax-layer");

const parts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function updateTimer() {
  const diff = weddingDate.getTime() - Date.now();

  if (diff <= 0) {
    parts.days.textContent = "0";
    parts.hours.textContent = "0";
    parts.minutes.textContent = "0";
    parts.seconds.textContent = "0";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  parts.days.textContent = days;
  parts.hours.textContent = String(hours).padStart(2, "0");
  parts.minutes.textContent = String(minutes).padStart(2, "0");
  parts.seconds.textContent = String(seconds).padStart(2, "0");
}

updateTimer();
setInterval(updateTimer, 1000);

async function playMusic() {
  if (!bgMusic) {
    return;
  }

  try {
    bgMusic.volume = 0.55;
    await bgMusic.play();
    musicToggle?.classList.add("is-playing");
    musicToggle?.setAttribute("aria-label", "Музыканы өшіру");
  } catch {
    musicToggle?.classList.remove("is-playing");
  }
}

musicToggle?.addEventListener("click", async () => {
  if (bgMusic.paused) {
    await playMusic();
    return;
  }

  bgMusic.pause();
  musicToggle.classList.remove("is-playing");
  musicToggle.setAttribute("aria-label", "Музыканы қосу");
});

openInvite?.addEventListener("click", async () => {
  document.body.classList.add("invite-opened");
  document.body.classList.remove("is-locked");
  await playMusic();
});

function createLeaves() {
  if (!leafLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const colors = [
    "rgba(127, 146, 115, 0.58)",
    "rgba(189, 143, 69, 0.45)",
    "rgba(201, 135, 143, 0.42)",
    "rgba(247, 239, 226, 0.68)",
  ];

  Array.from({ length: 26 }).forEach((_, index) => {
    const leaf = document.createElement("span");
    leaf.className = "leaf";
    leaf.style.setProperty("--leaf-left", `${Math.random() * 100}%`);
    leaf.style.setProperty("--leaf-size", `${10 + Math.random() * 16}px`);
    leaf.style.setProperty("--leaf-color", colors[index % colors.length]);
    leaf.style.setProperty("--leaf-opacity", `${0.34 + Math.random() * 0.36}`);
    leaf.style.setProperty("--leaf-rotate", `${Math.random() * 180}deg`);
    leaf.style.setProperty("--leaf-drift", `${-80 + Math.random() * 160}px`);
    leaf.style.setProperty("--leaf-duration", `${10 + Math.random() * 10}s`);
    leaf.style.setProperty("--leaf-delay", `${Math.random() * -18}s`);
    leafLayer.appendChild(leaf);
  });
}

function setupRevealEffects() {
  const revealItems = document.querySelectorAll(
    ".intro .section__inner, .section-heading, .detail-card, .month-card, .countdown__panel, .hosts .section__inner, .rsvp .section__inner, .farewell-footer__inner",
  );

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealItems.forEach((item) => item.classList.add("reveal-item"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

let parallaxFrame = null;

function updateParallaxLayers() {
  const viewportHeight = window.innerHeight || 1;

  parallaxLayers.forEach((layer) => {
    const rect = layer.parentElement.getBoundingClientRect();
    const progress = (viewportHeight / 2 - rect.top) / viewportHeight;
    const speed = layer.classList.contains("parallax-fast") ? 42 : 24;
    const y = Math.max(-70, Math.min(70, progress * speed));
    layer.style.setProperty("--parallax-y", `${y}px`);
  });

  parallaxFrame = null;
}

function scheduleParallaxUpdate() {
  if (parallaxFrame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  parallaxFrame = requestAnimationFrame(updateParallaxLayers);
}

createLeaves();
setupRevealEffects();
updateParallaxLayers();
window.addEventListener("scroll", scheduleParallaxUpdate, { passive: true });
window.addEventListener("resize", scheduleParallaxUpdate);

const form = document.getElementById("rsvpForm");
const result = document.getElementById("rsvpResult");
const whatsappLink = document.getElementById("whatsappLink");
whatsappLink.setAttribute("aria-disabled", "true");

function buildMessage() {
  const name = document.getElementById("guestName").value.trim();
  const attendance = new FormData(form).get("attendance");
  return `Сәлеметсіз бе! Менің атым-жөнім: ${name}. Даринаның ұзату тойына жауабым: ${attendance}.`;
}

function updateWhatsappLink() {
  const name = document.getElementById("guestName").value.trim();

  if (!name) {
    whatsappLink.href = "#";
    whatsappLink.classList.remove("is-ready");
    whatsappLink.setAttribute("aria-disabled", "true");
    return;
  }

  const message = buildMessage();
  whatsappLink.href = `https://wa.me/77066015891?text=${encodeURIComponent(message)}`;
  whatsappLink.classList.add("is-ready");
  whatsappLink.setAttribute("aria-disabled", "false");
}

form.addEventListener("input", updateWhatsappLink);
form.addEventListener("change", updateWhatsappLink);

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

whatsappLink.addEventListener("click", (event) => {
  updateWhatsappLink();

  if (whatsappLink.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    result.textContent = "Өтінеміз, алдымен аты-жөніңізді жазыңыз.";
  }
});
