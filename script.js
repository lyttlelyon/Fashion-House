const pageNames = {
  home: "index.html",
  products: "products.html",
  board: "board.html",
  appointments: "appointments.html",
  events: "events.html",
  dom: "dom.html"
};

document.addEventListener("DOMContentLoaded", () => {
  setActiveNavigation();
  setupMobileNavigation();
  setupTypingMotto();
  revealOnScroll();
  setupBoardProfiles();
  animateCounters();
  setupProductFilters();
  setupAppointmentForm();
  setupCountdown();
  setFooterYear();
});

function setActiveNavigation() {
  const currentPage = document.body.dataset.page;
  const currentHref = pageNames[currentPage];

  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentHref) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupMobileNavigation() {
  const button = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  if (!button || !links) return;

  button.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    button.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

function setupBoardProfiles() {
  const cards = document.querySelectorAll(".member-card");
  const modal = document.querySelector("#memberModal");
  const closeButton = document.querySelector("#modalClose");
  const modalImg = document.querySelector("#modalImg");
  const modalName = document.querySelector("#modalName");
  const modalRole = document.querySelector("#modalRole");
  const modalBio = document.querySelector("#modalBio");

  if (!cards.length || !modal || !closeButton || !modalImg || !modalName || !modalRole || !modalBio) return;

  function closeModal() {
    modal.classList.remove("modal-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function openModal(card) {
      modalImg.src = card.dataset.img;
      modalImg.alt = `Professional portrait representing ${card.dataset.name}`;
      modalName.textContent = card.dataset.name;
      modalRole.textContent = card.dataset.role;
      modalBio.textContent = card.dataset.bio;
      modal.classList.add("modal-open");
      modal.setAttribute("aria-hidden", "false");
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      openModal(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function setupTypingMotto() {
  const motto = document.querySelector(".typing-motto");
  if (!motto) return;

  const text = motto.dataset.title || motto.textContent.trim();
  let index = 0;
  let deleting = false;

  motto.textContent = "";
  motto.classList.add("is-typing");

  function typeLoop() {
    motto.textContent = text.slice(0, index);

    if (!deleting && index < text.length) {
      index += 1;
      window.setTimeout(typeLoop, 64);
      return;
    }

    if (!deleting && index === text.length) {
      deleting = true;
      window.setTimeout(typeLoop, 1350);
      return;
    }

    if (deleting && index > 0) {
      index -= 1;
      window.setTimeout(typeLoop, 42);
      return;
    }

    deleting = false;
    window.setTimeout(typeLoop, 360);
  }

  window.setTimeout(typeLoop, 260);
}

function revealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const step = Math.max(1, Math.ceil(target / 45));
    let value = 0;

    const timer = window.setInterval(() => {
      value += step;
      if (value >= target) {
        value = target;
        window.clearInterval(timer);
      }
      counter.textContent = value;
    }, 26);
  });
}

function setupProductFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const products = document.querySelectorAll(".product-card");

  if (!buttons.length || !products.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      products.forEach((product) => {
        const shouldShow = filter === "all" || product.dataset.category === filter;
        product.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

function setupAppointmentForm() {
  const form = document.querySelector("#appointmentForm");
  const status = document.querySelector("#formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const clientName = formData.get("name") || "Client";
    const service = formData.get("service") || "your selected service";

    status.textContent = `Thank you, ${clientName}. Your request for ${service} has been received.`;
    form.reset();
  });
}

function setupCountdown() {
  const countdown = document.querySelector(".countdown");
  if (!countdown) return;

  const eventDate = new Date(countdown.dataset.eventDate).getTime();
  const days = countdown.querySelector("[data-days]");
  const hours = countdown.querySelector("[data-hours]");
  const minutes = countdown.querySelector("[data-minutes]");

  function updateCountdown() {
    const difference = Math.max(0, eventDate - Date.now());
    const dayValue = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hourValue = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minuteValue = Math.floor((difference / (1000 * 60)) % 60);

    days.textContent = dayValue;
    hours.textContent = hourValue;
    minutes.textContent = minuteValue;
  }

  updateCountdown();
  window.setInterval(updateCountdown, 60000);
}

function setFooterYear() {
  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
}
