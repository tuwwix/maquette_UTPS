function getPagesPrefix() {
  const path = window.location.pathname.replace(/\\/g, "/");
  const marker = "/pages/";
  const index = path.lastIndexOf(marker);
  if (index === -1) return "";

  const afterPages = path.slice(index + marker.length);
  const segments = afterPages.split("/").filter(Boolean);
  segments.pop(); // remove file

  if (segments.length === 0) return "";
  return segments.map(() => "../").join("");
}

function createPartialTemplates(prefix) {
  const link = (file) => `${prefix}${file}`;
  const assets = `${prefix}../assets`;

  return {
    navbar: `
<header class="site-header">
  <div class="container">
    <div class="navbar">
      <a href="${link("home.html")}" class="logo">
        <div class="logo-text">Un temps pour Soi</div>
      </a>

      <nav class="nav-links">
        <a href="${link("home.html")}" class="nav-link">Accueil</a>
        <a href="${link("prestations.html")}" class="nav-link">Prestations</a>
        <a href="${link("offre-du-mois.html")}" class="nav-link">Offre du mois</a>
        <a href="${link("galerie.html")}" class="nav-link">Galerie</a>
        <a href="${link("marques.html")}" class="nav-link">Nos marques</a>
      </nav>

      <a href="https://www.kalendes.com/site/untempspoursoi29/welcome" class="button" style="display:none;">Prendre RDV</a>

      <button class="nav-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="mobile-menu">
      <div class="mobile-menu-inner">
        <a href="${link("home.html")}">Accueil</a>
        <a href="${link("prestations.html")}">Prestations</a>
        <a href="${link("offre-du-mois.html")}">Offre du mois</a>
        <a href="${link("galerie.html")}">Galerie</a>
        <a href="${link("marques.html")}">Nos marques</a>
      </div>
    </div>
  </div>
</header>`.trim(),
    footer: `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <img src="${assets}/images/logo/logo.png" alt="Un temps pour Soi" class="footer-logo">
      </div>

      <div>
        <h3 class="footer-title">Coordonnées</h3>
        <p class="footer-text">
          3 Rue de Cornouaille<br>
          29170 Fouesnant, France
        </p>
        <p class="footer-text">Tel : 02 98 51 42 83</p>
      </div>

      <div>
        <h3 class="footer-title">Navigation</h3>
        <a href="${link("prestations.html")}" class="footer-link">Nos prestations</a>
        <a href="${link("offre-du-mois.html")}" class="footer-link">Offre du mois</a>
        <a href="${link("galerie.html")}" class="footer-link">Galerie</a>
        <a href="${link("marques.html")}" class="footer-link">Nos marques</a>
      </div>

      <div>
        <h3 class="footer-title">Horaires</h3>
        <p class="footer-text">
          Lundi - Vendredi : 9h30-13h et 14h-19h<br>
          Samedi : 9h30 - 18h<br>
          Dimanche : fermé
        </p>
      </div>
    </div>

    <div class="footer-bottom">
      &copy; 2025 Un temps pour Soi. Tous droits réservés.
    </div>
  </div>
</footer>`.trim(),
  };
}

function applyPartialPlaceholders(template, prefix) {
  if (!template) return "";
  const normalizedPrefix = prefix || "";
  const assets = `${normalizedPrefix}../assets`;

  return template.replace(/{{\s*(prefix|assets)\s*}}/g, (_, key) => {
    if (key === "assets") return assets;
    return normalizedPrefix;
  });
}

async function loadExternalPartial(key, prefix) {
  const filePath = `${prefix}${key}.html`;
  const response = await fetch(filePath, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Impossible de charger ${filePath}`);
  const raw = await response.text();
  return applyPartialPlaceholders(raw, prefix);
}

async function injectStaticPartials() {
  const prefix = getPagesPrefix();
  const templates = createPartialTemplates(prefix);
  const placeholders = document.querySelectorAll("[data-partial]");

  await Promise.all(
    Array.from(placeholders).map(async (placeholder) => {
      const key = placeholder.getAttribute("data-partial");
      if (!key) return;

      try {
        placeholder.innerHTML = await loadExternalPartial(key, prefix);
      } catch (error) {
        console.warn(error);
        if (templates[key]) {
          placeholder.innerHTML = templates[key];
        }
      }
    })
  );
}

function initNavbarInteractions() {
  const routeAliases = {
    "": "accueil",
    accueil: "accueil",
    "home.html": "accueil",
    "pages/home.html": "accueil",
    prestations: "prestations",
    "prestations.html": "prestations",
    "pages/prestations.html": "prestations",
    "offre-du-mois": "offre-du-mois",
    "offre-du-mois.html": "offre-du-mois",
    "pages/offre-du-mois.html": "offre-du-mois",
    galerie: "galerie",
    "galerie.html": "galerie",
    "pages/galerie.html": "galerie",
    marques: "marques",
    "marques.html": "marques",
    "pages/marques.html": "marques",
    "epilations.html": "prestations",
    "soins-mains-pieds.html": "prestations",
    "lpg-cellu-m6.html": "prestations",
    "bloomea.html": "prestations",
    "soins-corps.html": "prestations",
    "soins-visage.html": "prestations",
    "maquillage.html": "prestations",
    "bronzage-naturel.html": "prestations",
  };

  const normalizePath = (value) => {
    if (!value) return "";
    const sanitized = value
      .split("#")[0]
      .split("?")[0]
      .replace(/^\/+|\/+$/g, "")
      .replace(/\\/g, "/");

    const fileName = sanitized.split("/").pop() || sanitized;
    return routeAliases[fileName] || routeAliases[sanitized] || fileName || sanitized;
  };

  const toggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  const currentPage = normalizePath(window.location.pathname) || "accueil";
  const navLinks = document.querySelectorAll(".nav-links .nav-link, .mobile-menu a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const hrefPage = normalizePath(href);

    if (hrefPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function initLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = document.querySelector(".lightbox img");
  const galleryItems = document.querySelectorAll("[data-gallery-item]");

  if (lightbox && lightboxImg && galleryItems.length > 0) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const src = item.getAttribute("data-src");
        if (!src) return;
        lightboxImg.src = src;
        lightbox.classList.add("open");
      });
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) {
        lightbox.classList.remove("open");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await injectStaticPartials();
  initNavbarInteractions();
  initLightbox();
});

// Filtre prestations (tabs)
function filterPrestations(category) {
  const cards = document.querySelectorAll("[data-prestation-card]");
  cards.forEach((card) => {
    const cardCat = card.getAttribute("data-category");
    if (category === "all" || cardCat === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    if (tab.getAttribute("data-category") === category) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}


