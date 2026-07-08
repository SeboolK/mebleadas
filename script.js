const nav = document.querySelector('.nav');

document.querySelector('.hamb')?.addEventListener('click', () => {
  nav.classList.toggle('open');
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.querySelector('form')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Dziękujemy! Formularz jest gotowy do podpięcia pod backend lub e-mail.');
});

const albumGrid = document.querySelector('#album-grid');
const albumTitle = document.querySelector('#album-title');

if (albumGrid && albumTitle) {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('kategoria');

  function makeImages(folder, prefix, count, extra = []) {
    const images = [...extra];

    images.push(`assets/img/${folder}/1.jpg`);

    for (let i = 1; i <= count; i++) {
      images.push(`assets/img/${folder}/${prefix}-${String(i).padStart(3, '0')}.jpg`);
    }

    return [...new Set(images)];
  }

  const albums = {
    kuchnie: {
      title: 'Kuchnie na wymiar',
      images: makeImages('kuchnie', 'kuchnie', 200, [
        'assets/img/kuchnie/hero.jpg'
      ])
    },
    szafy: {
      title: 'Szafy i garderoby',
      images: makeImages('szafy-garderoby', 'szafy-garderoby', 200)
    },
    pokojowe: {
      title: 'Meble pokojowe',
      images: makeImages('meble-pokojowe', 'meble-pokojowe', 200)
    },
    biurka: {
      title: 'Biurka i stoły',
      images: makeImages('biurka-stoly', 'biurka-stoly', 200)
    }
  };

  const selectedAlbum = albums[category] || albums.kuchnie;

  albumTitle.textContent = selectedAlbum.title;
  albumGrid.classList.add('show');

  albumGrid.innerHTML = selectedAlbum.images.map((src, index) => {
    return `
      <img 
        src="${src}" 
        alt="${selectedAlbum.title} ${index + 1}" 
        loading="lazy" 
        decoding="async"
      >
    `;
  }).join('');

  albumGrid.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.remove();
    });
  });
}