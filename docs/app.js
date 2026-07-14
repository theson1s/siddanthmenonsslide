(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const sidePrev = document.querySelector('#sidePrev');
  const sideNext = document.querySelector('#sideNext');
  const play = document.querySelector('#play');
  const fullscreen = document.querySelector('#fullscreen');
  const current = document.querySelector('#current');
  const fill = document.querySelector('#progressFill');
  const stage = document.querySelector('.stage');
  let index = 0;
  let timer = null;
  let touchStartX = 0;

  const pad = value => String(value).padStart(2, '0');

  function show(nextIndex, direction = 1) {
    const bounded = (nextIndex + slides.length) % slides.length;
    if (bounded === index) return;
    const old = slides[index];
    old.classList.add('is-leaving');
    old.classList.remove('is-active');
    window.setTimeout(() => old.classList.remove('is-leaving'), 1100);
    index = bounded;
    const incoming = slides[index];
    incoming.style.transformOrigin = direction > 0 ? 'right center' : 'left center';
    incoming.classList.add('is-active');
    current.textContent = pad(index + 1);
    fill.style.width = `${((index + 1) / slides.length) * 100}%`;
    document.title = `${index + 1}/6 · What Happens to Sunlight?`;
  }

  function step(amount) { show(index + amount, amount); }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    play.textContent = '▶';
    play.setAttribute('aria-label', 'Start automatic playback');
    play.setAttribute('aria-pressed', 'false');
  }

  function togglePlay() {
    if (timer) return stop();
    timer = window.setInterval(() => step(1), 8000);
    play.textContent = '❚❚';
    play.setAttribute('aria-label', 'Pause automatic playback');
    play.setAttribute('aria-pressed', 'true');
  }

  prev.addEventListener('click', () => { stop(); step(-1); });
  next.addEventListener('click', () => { stop(); step(1); });
  sidePrev.addEventListener('click', () => { stop(); step(-1); });
  sideNext.addEventListener('click', () => { stop(); step(1); });
  play.addEventListener('click', togglePlay);

  fullscreen.addEventListener('click', async () => {
    if (!document.fullscreenElement) await stage.requestFullscreen?.();
    else await document.exitFullscreen?.();
  });

  document.addEventListener('keydown', event => {
    if (['ArrowRight', 'PageDown'].includes(event.key)) { stop(); step(1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { stop(); step(-1); }
    if (event.key === 'Home') { stop(); show(0, -1); }
    if (event.key === 'End') { stop(); show(slides.length - 1, 1); }
    if (event.key === ' ') { event.preventDefault(); togglePlay(); }
    if (event.key.toLowerCase() === 'f') fullscreen.click();
  });

  stage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) { stop(); step(delta < 0 ? 1 : -1); }
  }, { passive: true });

  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
