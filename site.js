(() => {
  const STORAGE_KEY = "guru-theme";
  const PREFS = ["system", "light", "dark"];

  const labels = {
    en: {
      system: "Theme: system (follows day/night). Click for light.",
      light: "Theme: light. Click for dark.",
      dark: "Theme: dark. Click for system.",
    },
    es: {
      system: "Tema: sistema (sigue día/noche). Clic para claro.",
      light: "Tema: claro. Clic para oscuro.",
      dark: "Tema: oscuro. Clic para sistema.",
    },
  };

  function lang() {
    const htmlLang = (document.documentElement.lang || "en").toLowerCase();
    return htmlLang.startsWith("es") ? "es" : "en";
  }

  function systemDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function readPref() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return PREFS.includes(value) ? value : "system";
    } catch {
      return "system";
    }
  }

  function writePref(pref) {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      /* ignore quota / private mode */
    }
  }

  function resolveTheme(pref) {
    if (pref === "light") return "light";
    if (pref === "dark") return "dark";
    return systemDark() ? "dark" : "light";
  }

  function applyTheme(pref) {
    const theme = resolveTheme(pref);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-pref", pref);

    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.dataset.pref = pref;
      btn.setAttribute("aria-label", labels[lang()][pref]);
      btn.setAttribute("title", labels[lang()][pref]);
    });
  }

  function nextPref(pref) {
    return PREFS[(PREFS.indexOf(pref) + 1) % PREFS.length];
  }

  function initThemeControls() {
    let pref = readPref();
    applyTheme(pref);

    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        pref = nextPref(readPref());
        writePref(pref);
        applyTheme(pref);
      });
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readPref() === "system") applyTheme("system");
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onChange);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("y");
    if (year) year.textContent = new Date().getFullYear();

    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (toggle && links) {
      toggle.addEventListener("click", () => links.classList.toggle("open"));
      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => links.classList.remove("open"));
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    initThemeControls();
  });
})();
