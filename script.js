document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions();
  initRevealAnimations();
  initHeroSlideshow();
  initGalleryLightbox();
});

function initPageTransitions() {
  document.body.classList.add("page-ready");

  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      const opensElsewhere = link.target && link.target !== "_self";

      if (isModifiedClick || opensElsewhere) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("page-exit");

      setTimeout(() => {
        window.location.href = link.href;
      }, 220);
    });
  });
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(
    [
      "main > section",
      ".feature",
      ".feature-tile",
      ".service-item",
      ".category-box",
      ".offer-list li",
      ".gallery-masonry img"
    ].join(",")
  );

  if (!revealItems.length) {
    return;
  }

  revealItems.forEach((item, index) => {
    item.classList.add("reveal-on-scroll");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initHeroSlideshow() {
  const slideshow = document.querySelector(".hero-slideshow");
  const slides = document.querySelectorAll(".hero-img");

  if (!slideshow || slides.length < 2) {
    return;
  }

  let currentSlide = 0;

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    slideshow.style.transform = `translateX(-${currentSlide * 100}%)`;
  }, 3000);
}

function initGalleryLightbox() {
  const galleryImages = document.querySelectorAll(".gallery-masonry img");

  if (!galleryImages.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.id = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Powiększone zdjęcie");

  const lightboxImg = document.createElement("img");
  lightboxImg.id = "lightbox-img";
  lightboxImg.alt = "";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "lightbox-close";
  closeButton.setAttribute("aria-label", "Zamknij zdjęcie");
  closeButton.textContent = "×";

  lightbox.appendChild(closeButton);
  document.body.appendChild(lightbox);

  let scale = 1;

  galleryImages.forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `Powiększ zdjęcie: ${img.alt || "realizacja"}`);

    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const zoomStep = event.deltaY < 0 ? 0.1 : -0.1;
      scale = Math.min(Math.max(1, scale + zoomStep), 5);
      updateTransform();
    },
    { passive: false }
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  function openLightbox(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Powiększone zdjęcie";
    lightbox.insertBefore(lightboxImg, closeButton);
    scale = 1;
    updateTransform();
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    lightboxImg.remove();
    lightboxImg.removeAttribute("src");
    scale = 1;
    updateTransform();
  }

  function updateTransform() {
    lightboxImg.style.transform = `scale(${scale})`;
  }
}
