document.addEventListener("DOMContentLoaded", function () {
  const slideshow = document.querySelector('.hero-slideshow');
  const slides = document.querySelectorAll('.hero-img');
  let currentSlide = 0;

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    slideshow.style.transform = `translateX(-${currentSlide * 100}%)`;
  }, 3000);
});



document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.createElement("div");
  lightbox.id = "image-lightbox";
  lightbox.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    cursor: zoom-out;
  `;

  const lightboxImg = document.createElement("img");
  lightboxImg.id = "lightbox-img";
  lightboxImg.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    transition: transform 0.2s ease;
    cursor: default;
  `;

  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  let scale = 1;

  // Obsługa kliknięcia w dowolną galerię
  const galleries = document.querySelectorAll('.gallery-masonry img');
  galleries.forEach(img => {
    img.addEventListener('click', (e) => {
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
      scale = 1;
      updateTransform();
      e.stopPropagation(); // nie zamyka od razu po otwarciu
    });
  });

  // Zamknięcie po kliknięciu tła
  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    scale = 1;
    updateTransform();
  });

  // Zoom scroll
  lightbox.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;

    if (e.deltaY < 0) {
      scale += zoomSpeed; // scroll up
    } else {
      scale -= zoomSpeed; // scroll down
    }

    scale = Math.min(Math.max(1, scale), 5);
    updateTransform();
  });

  function updateTransform() {
    lightboxImg.style.transform = `scale(${scale})`;
  }
});
