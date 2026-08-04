/* =========================================================
   DATOS EDITABLES DE LA INVITACIÓN
   Cambia únicamente este bloque para personalizar el evento.
   ========================================================= */
const INVITACION = {
  nombre: "Jazmin",
  fechaEvento: "2026-11-14T18:00:00-04:00",
  fechaLarga: "SÁBADO · 14 DE NOVIEMBRE · 2026",
  mesAnio: "Septiembre 2026",
  fechaLimite: "31 de octubre de 2026",

  padres: "Heydi Laim & por Confirmar xd",

  horaMisa: "18:00",
  lugarMisa: "Parroquia Sagrado Corazón",
  direccionMisa: "Av. Principal, Cochabamba",
  mapaMisa: "",

  horaRecepcion: "20:00",
  lugarRecepcion: "Salón Jardines del Lago",
  direccionRecepcion: "Zona Norte, Cochabamba",
  mapaRecepcion: "",

  banco: "Banco Nacional",
  titular: "Mariana López",
  cuenta: "0000-0000-0000",

  // Escribe el número con código de país y sin el símbolo +.
  // Ejemplo Bolivia: 59170000000. Déjalo vacío para confirmar dentro de la página.
  whatsapp: "",

  // Datos para el calendario:
  tituloCalendario: "XV Años de Jazmin",
  descripcionCalendario: "Celebración de XV años. ¡Te esperamos!",
  ubicacionCalendario: "Cochabamba, Bolivia"
};

/* =========================================================
   CARGA DE DATOS
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const field = element.dataset.field;
    if (Object.prototype.hasOwnProperty.call(INVITACION, field)) {
      element.textContent = INVITACION[field];
    }
  });

  setupRevealAnimations();
  setupMenu();
  setupMusic();
  setupMaps();
  setupCarousel();
  setupBankPanel();
  setupCountdown();
  buildCalendar();
  setupCalendarDownload();
  setupRsvp();
  setupProgressBar();
  setupImageFallbacks();
});

/* =========================================================
   ANIMACIONES AL HACER SCROLL
   ========================================================= */
function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}

/* =========================================================
   MENÚ
   ========================================================= */
function setupMenu() {
  const menu = document.getElementById("sideMenu");
  const backdrop = document.getElementById("menuBackdrop");
  const openButton = document.getElementById("menuButton");
  const closeButton = document.getElementById("menuClose");

  const openMenu = () => {
    menu.classList.add("open");
    backdrop.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.remove("open");
    backdrop.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* =========================================================
   MÚSICA
   Coloca tu archivo como: audio/musica.mp3
   ========================================================= */
function setupMusic() {
  const audio = document.getElementById("bgMusic");
  const button = document.getElementById("musicButton");
  const icon = button.querySelector(".icon");

  button.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      button.classList.remove("playing");
      icon.textContent = "♪";
      button.setAttribute("aria-label", "Reproducir música");
      return;
    }

    try {
      await audio.play();
      button.classList.add("playing");
      icon.textContent = "❚❚";
      button.setAttribute("aria-label", "Pausar música");
    } catch (error) {
      showToast("Agrega tu canción en la carpeta audio con el nombre musica.mp3.");
    }
  });
}

/* =========================================================
   UBICACIONES
   ========================================================= */
function setupMaps() {
  document.querySelectorAll(".map-button").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.map;
      const url = type === "misa" ? INVITACION.mapaMisa : INVITACION.mapaRecepcion;

      if (!url) {
        showToast("Agrega el enlace de Google Maps en script.js.");
        return;
      }

      window.open(url, "_blank", "noopener,noreferrer");
    });
  });
}

/* =========================================================
   GALERÍA
   ========================================================= */
function setupCarousel() {
  const slides = [...document.querySelectorAll(".carousel-slide")];
  const dotsContainer = document.getElementById("carouselDots");
  const previousButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");

  let currentIndex = 0;
  let autoPlay;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver fotografía ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.children];

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentIndex);
      dots[slideIndex].classList.toggle("active", slideIndex === currentIndex);
    });
  }

  function restartAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => showSlide(currentIndex + 1), 5000);
  }

  previousButton.addEventListener("click", () => {
    showSlide(currentIndex - 1);
    restartAutoPlay();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    restartAutoPlay();
  });

  let touchStartX = 0;
  const carousel = document.querySelector(".carousel");

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    const difference = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(difference) < 45) return;
    showSlide(difference > 0 ? currentIndex - 1 : currentIndex + 1);
    restartAutoPlay();
  }, { passive: true });

  showSlide(0);
  restartAutoPlay();
}

/* =========================================================
   DATOS BANCARIOS
   ========================================================= */
function setupBankPanel() {
  const button = document.getElementById("bankButton");
  const panel = document.getElementById("bankPanel");

  button.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    panel.setAttribute("aria-hidden", String(!isOpen));
    button.textContent = isOpen ? "OCULTAR DATOS" : "VER DATOS BANCARIOS";
  });
}

/* =========================================================
   CUENTA REGRESIVA
   ========================================================= */
function setupCountdown() {
  const targetDate = new Date(INVITACION.fechaEvento).getTime();
  const fields = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  function update() {
    const distance = targetDate - Date.now();

    if (Number.isNaN(targetDate)) {
      Object.values(fields).forEach((field) => field.textContent = "--");
      return;
    }

    if (distance <= 0) {
      fields.days.textContent = "00";
      fields.hours.textContent = "00";
      fields.minutes.textContent = "00";
      fields.seconds.textContent = "00";
      return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    fields.days.textContent = String(days).padStart(2, "0");
    fields.hours.textContent = String(hours).padStart(2, "0");
    fields.minutes.textContent = String(minutes).padStart(2, "0");
    fields.seconds.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   CALENDARIO VISUAL
   ========================================================= */
function buildCalendar() {
  const container = document.getElementById("calendar");
  const date = new Date(INVITACION.fechaEvento);

  if (Number.isNaN(date.getTime())) {
    container.textContent = "Configura una fecha válida en script.js.";
    return;
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const eventDay = date.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayFirst = firstDay === 0 ? 6 : firstDay - 1;
  const weekdays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  weekdays.forEach((day) => {
    const cell = document.createElement("span");
    cell.className = "weekday";
    cell.textContent = day;
    grid.appendChild(cell);
  });

  for (let index = 0; index < mondayFirst; index += 1) {
    const empty = document.createElement("span");
    empty.className = "empty";
    empty.textContent = "0";
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement("span");
    cell.textContent = day;
    if (day === eventDay) cell.className = "event-day";
    grid.appendChild(cell);
  }

  container.replaceChildren(grid);
}

/* =========================================================
   DESCARGAR EVENTO .ICS
   ========================================================= */
function setupCalendarDownload() {
  const button = document.getElementById("calendarButton");

  button.addEventListener("click", () => {
    const start = new Date(INVITACION.fechaEvento);

    if (Number.isNaN(start.getTime())) {
      showToast("Configura una fecha válida en script.js.");
      return;
    }

    const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
    const formatDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Invitacion XV//ES",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@invitacion-xv`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${escapeIcs(INVITACION.tituloCalendario)}`,
      `DESCRIPTION:${escapeIcs(INVITACION.descripcionCalendario)}`,
      `LOCATION:${escapeIcs(INVITACION.ubicacionCalendario)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mis-xv-anos.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

function escapeIcs(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

/* =========================================================
   CONFIRMACIÓN DE ASISTENCIA
   ========================================================= */
function setupRsvp() {
  const form = document.getElementById("rsvpForm");
  const confirmationCard = document.getElementById("confirmationCard");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const nombre = String(data.get("nombre") || "").trim();
    const asistencia = String(data.get("asistencia") || "");
    const invitados = String(data.get("invitados") || "1");
    const mensaje = String(data.get("mensaje") || "").trim();

    if (!nombre || !asistencia) {
      showToast("Completa tu nombre y selecciona si asistirás.");
      return;
    }

    const confirmation = {
      nombre,
      asistencia,
      invitados,
      mensaje,
      fecha: new Date().toISOString()
    };

    localStorage.setItem("confirmacionXV", JSON.stringify(confirmation));

    if (INVITACION.whatsapp) {
      const text = [
        `Hola, soy ${nombre}.`,
        `${asistencia}.`,
        `Número de invitados: ${invitados}.`,
        mensaje ? `Mensaje: ${mensaje}` : ""
      ].filter(Boolean).join("\n");

      const url = `https://wa.me/${INVITACION.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }

    form.style.display = "none";
    confirmationCard.classList.add("show");
    confirmationCard.setAttribute("aria-hidden", "false");
    confirmationCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* =========================================================
   BARRA DE PROGRESO
   ========================================================= */
function setupProgressBar() {
  const progress = document.getElementById("progressBar");

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* =========================================================
   IMÁGENES DE RESPALDO
   ========================================================= */
function setupImageFallbacks() {
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.display = "none";
      image.parentElement.classList.add("missing-image");
      image.parentElement.setAttribute("data-placeholder", "Agrega una imagen en la carpeta img");
    });
  });
}

/* =========================================================
   MENSAJES
   ========================================================= */
let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}
