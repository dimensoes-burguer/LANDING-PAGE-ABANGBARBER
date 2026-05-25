(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const year = document.getElementById("year");

  init();

  function init() {
    initYear();
    initLogoFallback();
    initHeaderState();
    initMenu();
    initRevealAnimation();
  }

  function initYear() {
    if (year) {
      year.textContent = new Date().getFullYear();
    }
  }

  function initLogoFallback() {
    document.querySelectorAll("[data-logo-img]").forEach((img) => {
      const badge = img.closest(".logo-badge");
      if (!badge) return;

      const markMissing = () => badge.classList.add("logo-missing");
      const markLoaded = () => badge.classList.remove("logo-missing");

      img.addEventListener("error", markMissing);
      img.addEventListener("load", markLoaded);

      if (img.complete && img.naturalWidth === 0) {
        markMissing();
      }
    });
  }

  function initHeaderState() {
    if (!header) return;

    const update = () => {
      header.classList.toggle("scrolled", window.scrollY > 16);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
      header?.classList.toggle("menu-active", isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function closeMenu() {
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    header?.classList.remove("menu-active");
  }

  function initRevealAnimation() {
    const items = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.16,
      }
    );

    items.forEach((item) => observer.observe(item));
  }
})();
