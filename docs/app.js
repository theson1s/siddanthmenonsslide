(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const sidePrev = document.querySelector('#sidePrev');
  const sideNext = document.querySelector('#sideNext');
  const play = document.querySelector('#play');
  const fullscreen = document.querySelector('#fullscreen');
  const current = document.querySelector('#current');
  const total = document.querySelector('#total');
  const fill = document.querySelector('#progressFill');
  const stage = document.querySelector('.stage');

  const experience = document.querySelector('#quizExperience');
  const earthPortal = document.querySelector('#earthPortal');
  const questionField = document.querySelector('#questionField');
  const backToSpace = document.querySelector('#backToSpace');
  const conceptCards = [...document.querySelectorAll('.concept-card')];
  const letterButton = document.querySelector('#letterButton');
  const paperBackdrop = document.querySelector('#paperBackdrop');
  const paperClose = document.querySelector('#paperClose');
  const resetActivity = document.querySelector('#resetActivity');
  const activityRows = [...document.querySelectorAll('.activity-row')];

  let index = 0;
  let timer = null;
  let touchStartX = 0;
  let portalTimer = null;

  const pad = value => String(value).padStart(2, '0');

  total.textContent = pad(slides.length);
  fill.style.width = `${100 / slides.length}%`;

  function closePaper() {
    paperBackdrop.classList.remove('is-visible');
    paperBackdrop.setAttribute('aria-hidden', 'true');
    stage.classList.remove('has-paper');
  }

  function show(nextIndex, direction = 1) {
    const bounded = (nextIndex + slides.length) % slides.length;
    if (bounded === index) return;

    stage.scrollTop = 0;
    stage.scrollLeft = 0;

    closePaper();
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
    document.title = `${index + 1}/${slides.length} | What Happens to Sunlight?`;

    if (index === slides.length - 1) stop();
  }

  function step(amount) { show(index + amount, amount); }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    play.textContent = '\u25B6';
    play.setAttribute('aria-label', 'Start automatic playback');
    play.setAttribute('aria-pressed', 'false');
  }

  function togglePlay() {
    if (timer) return stop();
    timer = window.setInterval(() => step(1), 8000);
    play.textContent = '\u275A\u275A';
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

  earthPortal.addEventListener('click', () => {
    stop();
    window.clearTimeout(portalTimer);
    earthPortal.disabled = true;
    experience.classList.add('is-warping');
    portalTimer = window.setTimeout(() => {
      experience.classList.add('is-open');
      questionField.setAttribute('aria-hidden', 'false');
      earthPortal.disabled = false;
    }, 760);
  });

  backToSpace.addEventListener('click', () => {
    window.clearTimeout(portalTimer);
    experience.classList.remove('is-open', 'is-warping');
    questionField.setAttribute('aria-hidden', 'true');
    closePaper();
  });

  conceptCards.forEach(card => {
    card.addEventListener('click', () => {
      const willOpen = !card.classList.contains('is-expanded');
      conceptCards.forEach(other => {
        other.classList.remove('is-expanded');
        other.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        card.classList.add('is-expanded');
        card.setAttribute('aria-expanded', 'true');
      }
    });
  });

  letterButton.addEventListener('click', () => {
    paperBackdrop.classList.add('is-visible');
    paperBackdrop.setAttribute('aria-hidden', 'false');
    stage.classList.add('has-paper');
    window.setTimeout(() => paperClose.focus(), 350);
  });

  paperClose.addEventListener('click', closePaper);
  paperBackdrop.addEventListener('click', event => {
    if (event.target === paperBackdrop) closePaper();
  });

  activityRows.forEach(row => {
    const choices = [...row.querySelectorAll('[data-choice]')];
    const result = row.querySelector('.result-mark');

    choices.forEach(choice => {
      choice.addEventListener('click', () => {
        if (row.dataset.answered === 'true') return;

        const isCorrect = choice.dataset.choice === row.dataset.correct;
        row.dataset.answered = 'true';
        row.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
        choice.classList.add(isCorrect ? 'is-selected-correct' : 'is-selected-wrong');
        choices.forEach(button => { button.disabled = true; });
        result.textContent = isCorrect ? '\u2713' : '\u2715';
        result.setAttribute('aria-label', isCorrect ? 'Correct' : 'Incorrect');
      });
    });
  });

  resetActivity.addEventListener('click', () => {
    activityRows.forEach(row => {
      row.dataset.answered = 'false';
      row.classList.remove('is-correct', 'is-wrong');
      row.querySelectorAll('[data-choice]').forEach(button => {
        button.disabled = false;
        button.classList.remove('is-selected-correct', 'is-selected-wrong');
      });
      const result = row.querySelector('.result-mark');
      result.textContent = '';
      result.removeAttribute('aria-label');
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && paperBackdrop.classList.contains('is-visible')) {
      closePaper();
      letterButton.focus();
      return;
    }

    if (paperBackdrop.classList.contains('is-visible')) return;
    if (event.target.closest?.('button')) return;

    if (['ArrowRight', 'PageDown'].includes(event.key)) { stop(); step(1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { stop(); step(-1); }
    if (event.key === 'Home') { stop(); show(0, -1); }
    if (event.key === 'End') { stop(); show(slides.length - 1, 1); }
    if (event.key === ' ') { event.preventDefault(); togglePlay(); }
    if (event.key.toLowerCase() === 'f') fullscreen.click();
  });

  stage.addEventListener('touchstart', event => {
    if (event.target.closest?.('button, .paper')) return;
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchend', event => {
    if (event.target.closest?.('button, .paper')) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) { stop(); step(delta < 0 ? 1 : -1); }
  }, { passive: true });

  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
