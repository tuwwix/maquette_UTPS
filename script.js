// Menu mobile
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
  
    if (toggle && mobileMenu) {
      toggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
      });
    }
  
    // Lightbox (galerie)
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
  