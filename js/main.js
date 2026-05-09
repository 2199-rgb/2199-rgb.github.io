(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector("#navLinks");
  const themeToggle = document.querySelector(".theme-toggle");
  const storageKey = "sihan-cv-theme";

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // localStorage may be unavailable in privacy-restricted contexts.
    }
  };

  const systemPrefersDark = () => {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const setTheme = (theme, shouldStore = true) => {
    root.dataset.theme = theme;

    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    }

    if (shouldStore) {
      storeTheme(theme);
    }
  };

  const initialTheme = getStoredTheme() || (systemPrefersDark() ? "dark" : "light");
  setTheme(initialTheme, Boolean(getStoredTheme()));

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });

  const closeMenu = () => {
    if (!navLinks || !menuButton) {
      return;
    }

    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };

  menuButton?.addEventListener("click", () => {
    if (!navLinks) {
      return;
    }

    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("open")) {
      return;
    }

    const target = event.target;
    const clickedMenu = navLinks.contains(target);
    const clickedButton = menuButton?.contains(target);

    if (!clickedMenu && !clickedButton) {
      closeMenu();
    }
  });

  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach((element) => {
    if (element.classList.contains("visible")) {
      return;
    }

    revealObserver.observe(element);
  });

  const systemThemeQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
  systemThemeQuery?.addEventListener("change", (event) => {
    if (getStoredTheme()) {
      return;
    }

    setTheme(event.matches ? "dark" : "light", false);
  });
})();
