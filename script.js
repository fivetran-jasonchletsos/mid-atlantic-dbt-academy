// ---------- Lesson accordions ----------
document.querySelectorAll('[data-lesson]').forEach((lesson, i) => {
  const head = lesson.querySelector('[data-toggle]');
  head.addEventListener('click', () => {
    lesson.classList.toggle('open');
  });
  if (i === 0) lesson.classList.add('open'); // Session 1 starts open
});

// ---------- Copy-to-clipboard for terminal blocks ----------
document.querySelectorAll('.term').forEach(block => {
  const btn = block.querySelector('.copy-btn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const text = block.textContent.replace('Copy', '').trim();
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = original; }, 1400);
    });
  });
});

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Checkpoint progress (persisted locally, no accounts needed) ----------
(function () {
  var STORAGE_KEY = 'dbtAcademyProgress';
  var progress = { boxes: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved && typeof saved === 'object') progress.boxes = saved.boxes || {};
  } catch (e) { /* localStorage unavailable or corrupt -- start fresh */ }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }

  document.querySelectorAll('[data-lesson]').forEach(function (lesson, lessonIdx) {
    var checkpoints = lesson.querySelectorAll('.checkpoint');
    checkpoints.forEach(function (cp, cpIdx) {
      cp.querySelectorAll('input[type="checkbox"]').forEach(function (box, boxIdx) {
        var key = lessonIdx + '-' + cpIdx + '-' + boxIdx;
        if (progress.boxes[key]) box.checked = true;
        box.addEventListener('change', function () {
          progress.boxes[key] = box.checked;
          save();
        });
      });
    });
  });
})();

// ---------- Wizard Console ----------
(function () {
  const chipRow = document.getElementById('consoleChips');
  const runBtn = document.getElementById('consoleRun');
  const log = document.getElementById('consoleLog');
  const caption = document.getElementById('consoleCaption');
  if (!chipRow) return;

  let activeScenario = WIZARD_SCENARIOS[0];
  let timers = [];

  function renderChips() {
    chipRow.innerHTML = WIZARD_SCENARIOS.map(s =>
      `<button class="chip" data-id="${s.id}">${s.label}</button>`
    ).join('');
    chipRow.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeScenario = WIZARD_SCENARIOS.find(s => s.id === btn.dataset.id);
        setActiveChip();
        resetStage();
      });
    });
    setActiveChip();
  }

  function setActiveChip() {
    chipRow.querySelectorAll('.chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === activeScenario.id);
    });
  }

  function resetStage() {
    timers.forEach(t => clearTimeout(t));
    timers = [];
    log.innerHTML = `<div class="console-step show"><div class="tool-tag">you ask</div><div class="console-step-body"><p class="q">${activeScenario.question}</p></div></div>`;
    caption.textContent = 'Click "Run Wizard" to replay this session step by step.';
  }

  function run() {
    resetStage();
    activeScenario.steps.forEach((step, i) => {
      const t = setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'console-step' + (step.final ? ' final' : '');
        el.innerHTML = `<div class="tool-tag">${step.tool}</div><div class="console-step-body"><p class="q">${step.label}</p><pre class="out">${step.out}</pre></div>`;
        log.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        if (step.final) caption.textContent = 'Nothing was materialized until the preview looked right — that\'s the whole point.';
      }, 500 + i * 650);
      timers.push(t);
    });
  }

  runBtn.addEventListener('click', run);
  renderChips();
  resetStage();
  run();
})();
