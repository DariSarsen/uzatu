const weddingDate = new Date("2026-09-06T18:00:00+05:00");

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

const form = document.getElementById("rsvpForm");
const result = document.getElementById("rsvpResult");
const whatsappLink = document.getElementById("whatsappLink");
whatsappLink.setAttribute("aria-disabled", "true");

function buildMessage() {
  const name = document.getElementById("guestName").value.trim();
  const attendance = new FormData(form).get("attendance");
  return `Сәлеметсіз бе! Менің атым-жөнім: ${name}. Даринаның ұзату тойына жауабым: ${attendance}.`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("guestName").value.trim();

  if (!name) {
    result.textContent = "Аты-жөніңізді жазып жіберіңіз.";
    return;
  }

  const message = buildMessage();
  whatsappLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  whatsappLink.classList.add("is-ready");

  try {
    await navigator.clipboard.writeText(message);
    result.textContent = "Жауап мәтіні көшірілді. Енді WhatsApp арқылы жіберуге болады.";
  } catch {
    result.textContent = message;
  }

  whatsappLink.setAttribute("aria-disabled", "false");
});

whatsappLink.addEventListener("click", (event) => {
  if (!whatsappLink.classList.contains("is-ready")) {
    event.preventDefault();
    result.textContent = "Алдымен аты-жөніңізді жазып, жауап мәтінін дайындаңыз.";
  }
});

document.getElementById("calendarButton").addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "SUMMARY:Дарина - Қыз ұзату",
    "DTSTART:20260906T130000Z",
    "DTEND:20260906T180000Z",
    "LOCATION:Шұбарсу ауылы, Bereke Hall мейрамханасы",
    "DESCRIPTION:Даринаның қыз ұзату тойы",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "darina-uzatu.ics";
  link.click();
  URL.revokeObjectURL(url);
});
