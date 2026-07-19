const weddingDate = new Date("2026-09-06T19:00:00+05:00");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const openInvite = document.getElementById("openInvite");
const leafLayer = document.getElementById("leafLayer");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const sparklePath =
  "M1.1 2 8.05 7.07C8.3 6.85 8.4 6.85 8.76 6.65L5.8 1.8 8.9 6.56C10.3 5.82 11.5 6.15 12.36 6.65L13.6 5 12.44 6.7C13 7 13.5 7.8 13.65 8.48L15.7 8.1 13.67 8.57C13.74 9 13.77 10 13.25 11.1L20.4 16.78 13.07 11.3C12.6 11.54 12.4 11.63 12.22 11.73L16.7 18.9 12.09 11.81C11.3 12.3 9.9 12.4 8.74 11.64L7.3 13.4 8.66 11.57C8.296 11.2 7.84 10.9 7.53 9.82L6 10.1 7.52 9.77C7.37 9.2 7.3 8.5 7.86 7.28ZM8.1 7.5C7.25 8.55 7.42 9.2 7.55 9.76L9.97 9.2 8.3 8.5 9.7 8.9ZM8.26 7.27 9.75 8.2 8.81 6.76C8.35 7.1 8.35 7.2 8.26 7.27ZM12.33 6.69C11 5.99 10 5.99 8.97 6.67L10.5 8.55 10.57 7.2 10.7 8.7ZM10.9 9 13.63 8.488C13.4 7.6 12.98 7.09 12.42 6.73ZM13 10.89C13.9 10 13.65 8.7 13.645 8.577L11 9.2 13.2 9.9 11.4 9.5ZM11.1 9.94 12.18 11.67C12.3 11.6 12.4 11.6 12.8 11.1ZM10.2 9.4 7.57 9.81C7.8 10.8 8.3 11.18 8.679 11.54ZM10.45 9.6 8.77 11.6C9.9 12.3 11.2 12.3 12.06 11.74L10.7 9.8 10.56 11.7ZM4.7 9.6A1 1 0 105.5 11 1.1 1.1 0 114.7 9.6Z";

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

function createSparkles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.querySelectorAll(".block-sparkles").forEach((container) => {
    Array.from({ length: 2 }).forEach(() => {
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.1 1.8 19.3 17.1"><path d="${sparklePath}"/></svg>`;
      sparkle.style.setProperty("--sparkle-left", `${8 + Math.random() * 84}%`);
      sparkle.style.setProperty("--sparkle-top", `${8 + Math.random() * 78}%`);
      sparkle.style.setProperty("--sparkle-size", `${42 + Math.random() * 34}px`);
      sparkle.style.setProperty("--sparkle-rotate", `${Math.random() * 360}deg`);
      sparkle.style.setProperty("--sparkle-scale-x", Math.random() > 0.5 ? "1" : "-1");
      sparkle.style.setProperty("--sparkle-scale-y", Math.random() > 0.5 ? "1" : "-1");
      sparkle.style.setProperty("--sparkle-duration", `${12 + Math.random() * 8}s`);
      sparkle.style.setProperty("--sparkle-delay", `${Math.random() * -18}s`);
      container.appendChild(sparkle);
    });
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
createSparkles();
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
