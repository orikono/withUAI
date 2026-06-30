/* Healing Space — guided breathing experience */
(function () {
  'use strict';

  const stage = document.querySelector('[data-breathing]');
  if (!stage) return;

  /* ----- i18n ----- */
  const LANG = (document.documentElement.lang || 'he').slice(0, 2).toLowerCase();
  const I18N = {
    he: {
      inhale: 'שאיפה',
      exhale: 'נשיפה',
      phrases: [
        'ריפוי אינו ליניארי. כל פעולה קטנה של דאגה לעצמך חשובה.',
        'אתם ראויים לשלווה, בדיוק כפי שאתם כרגע.',
        'הנשימה הזו היא מתנה שקטה — ואתם ראויים לה.',
        'אתם חזקים יותר מהסערות שעברתם.',
        'רכּוּת אינה חולשה; היא צורה שקטה של אומץ.',
        'יש לכם רשות לתפוס מקום בעולם הזה.',
        'הרגשות שלכם תקפים. כולם שייכים כאן.',
        'כל נשימה שאתם לוקחים מקרבת אתכם לרוגע.',
        'אתם עושים את המיטב שאתם יכולים — וזה מספיק.',
        'יש בתוככם אור ששום דבר לא יכול לכבות.',
        'מותר לכם לנוח. מותר לכם להתחיל מחדש.',
        'תקווה חיה במקומות הקטנים והשקטים ביותר — כולל בכם.',
        'אתם אהובים, גם ברגעים שאתם שוכחים זאת.',
        'הרגע הזה שלכם. לא נדרש מכם דבר נוסף.',
        'הסיפור שלכם עדיין נכתב, והוא יפה.',
        'אתם לא היום הכי גרוע שלכם. אתם לא השעה הכי קשה שלכם.',
        'להיות אדיבים לעצמכם זה הדבר האמיץ ביותר.',
        'שאפו אומץ. נשפו פחד. אתם בטוחים כאן.',
        'אתם שייכים כאן. הנוכחות שלכם היא סוג שקט של אור.',
        'קחו את השקט הזה איתכם. אתם שלמים, ואתם בבית.'
      ]
    },
    en: {
      inhale: 'Inhale',
      exhale: 'Exhale',
      phrases: [
        'Healing is not linear. Every small act of self-care matters.',
        'You are worthy of peace, just as you are right now.',
        'This breath is a quiet gift — and you are worthy of it.',
        'You are stronger than the storms you have weathered.',
        'Softness is not weakness; it is a quiet form of courage.',
        'You have permission to take up space in this world.',
        'Your feelings are valid. All of them belong here.',
        'Every breath you take brings you closer to calm.',
        'You are doing the best you can — and that is enough.',
        'There is a light within you that nothing can extinguish.',
        'You are allowed to rest. You are allowed to begin again.',
        'Hope lives in the smallest, quietest places — including in you.',
        'You are loved, even in moments when you forget it.',
        'This moment is yours. Nothing more is asked of you.',
        'Your story is still being written, and it is beautiful.',
        'You are not your worst day. You are not your hardest hour.',
        'Being kind to yourself is the bravest thing.',
        'Breathe in courage. Breathe out fear. You are safe here.',
        'You belong here. Your presence is a quiet kind of light.',
        'Take this stillness with you. You are whole, and you are home.'
      ]
    },
    ar: {
      inhale: 'شهيق',
      exhale: 'زفير',
      phrases: [
        'الشفاء ليس خطيًا. كل فعل صغير من العناية بالنفس مهم.',
        'أنت تستحقّ السلام، تمامًا كما أنت الآن.',
        'هذا النَفَس هدية هادئة — وأنت تستحقّها.',
        'أنت أقوى من العواصف التي عبرتها.',
        'الرقّة ليست ضعفًا؛ إنها شكل هادئ من الشجاعة.',
        'لديك إذن بأن تأخذ مكانك في هذا العالم.',
        'مشاعرك صحيحة. جميعها تنتمي إلى هنا.',
        'كل نَفَس تأخذه يقرّبك من الهدوء.',
        'أنت تبذل قصارى جهدك — وهذا يكفي.',
        'في داخلك نور لا يستطيع شيء أن يطفئه.',
        'يحقّ لك أن تستريح. يحقّ لك أن تبدأ من جديد.',
        'الأمل يعيش في أصغر الأماكن وأهدئها — بما في ذلك في داخلك.',
        'أنت محبوب، حتى في اللحظات التي تنسى فيها ذلك.',
        'هذه اللحظة لك. لا يُطلب منك شيء آخر.',
        'قصّتك ما زالت تُكتب، وهي جميلة.',
        'أنت لست أسوأ أيامك. أنت لست أصعب ساعاتك.',
        'أن تكون لطيفًا مع نفسك هو أشجع شيء.',
        'استنشق الشجاعة. ازفر الخوف. أنت آمن هنا.',
        'أنت تنتمي إلى هنا. حضورك نوع هادئ من النور.',
        'خُذ هذا الهدوء معك. أنت كامل، وأنت في موطنك.'
      ]
    },
    ru: {
      inhale: 'Вдох',
      exhale: 'Выдох',
      phrases: [
        'Исцеление не линейно. Каждый маленький акт заботы о себе имеет значение.',
        'Вы достойны покоя, такого, какой вы есть прямо сейчас.',
        'Это дыхание — тихий дар, и вы его достойны.',
        'Вы сильнее бурь, через которые прошли.',
        'Мягкость — не слабость; это тихая форма мужества.',
        'У вас есть право занимать место в этом мире.',
        'Ваши чувства подлинны. Все они принадлежат этому моменту.',
        'Каждый ваш вдох приближает вас к покою.',
        'Вы делаете всё возможное — и этого достаточно.',
        'Внутри вас есть свет, который ничто не может погасить.',
        'Вам можно отдыхать. Вам можно начать заново.',
        'Надежда живёт в самых маленьких и тихих местах — в том числе в вас.',
        'Вы любимы, даже в моменты, когда забываете об этом.',
        'Этот момент — ваш. От вас больше ничего не требуется.',
        'Ваша история ещё пишется, и она прекрасна.',
        'Вы — не худший ваш день. Вы — не самый тяжёлый ваш час.',
        'Быть добрым к себе — самое смелое, что можно сделать.',
        'Вдохните смелость. Выдохните страх. Здесь вы в безопасности.',
        'Вы принадлежите этому месту. Ваше присутствие — тихий свет.',
        'Унесите этот покой с собой. Вы цельны, и вы дома.'
      ]
    }
  };
  const t = I18N[LANG] || I18N.he;

  /* Twenty quiet truths — one per cycle. */
  const PHRASES = t.phrases;

  /* Medically-advised calming cadence: 4s inhale, 6s exhale (longer exhale
     engages the parasympathetic nervous system). 20 cycles ≈ 3m 20s. */
  const CYCLES = PHRASES.length;
  const INHALE_MS = 4000;
  const EXHALE_MS = 6000;

  const intro      = stage.querySelector('.bs-intro');
  const active     = stage.querySelector('.bs-active');
  const completeEl = stage.querySelector('.bs-complete');

  const startBtn   = stage.querySelector('[data-bs-start]');
  const endBtn     = stage.querySelector('[data-bs-end]');
  const restartBtn = stage.querySelector('[data-bs-restart]');

  const orbWrap    = stage.querySelector('.bs-orb-wrap');
  const phaseEl    = stage.querySelector('[data-bs-phase]');
  const countEl    = stage.querySelector('[data-bs-count]');
  const messageEl  = stage.querySelector('[data-bs-message]');
  const progressEl = stage.querySelector('[data-bs-progress]');
  const stars      = stage.querySelector('.bs-stars');

  /* ----- build star field (decorative) ----- */
  if (stars && !stars.children.length) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 36; i++) {
      const s = document.createElement('span');
      s.className = 'bs-star';
      s.style.left  = (Math.random() * 100).toFixed(2) + '%';
      s.style.top   = (Math.random() * 100).toFixed(2) + '%';
      s.style.setProperty('--dur',   (3 + Math.random() * 4).toFixed(1) + 's');
      s.style.setProperty('--delay', (Math.random() * 4).toFixed(1) + 's');
      const size = (1 + Math.random() * 1.6).toFixed(1);
      s.style.width  = size + 'px';
      s.style.height = size + 'px';
      frag.appendChild(s);
    }
    stars.appendChild(frag);
  }

  /* ----- progress dots ----- */
  function buildProgress() {
    if (!progressEl) return;
    progressEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < CYCLES; i++) {
      const d = document.createElement('span');
      d.className = 'bs-progress-dot';
      frag.appendChild(d);
    }
    progressEl.appendChild(frag);
  }
  function updateProgress(currentIdx) {
    if (!progressEl) return;
    const dots = progressEl.querySelectorAll('.bs-progress-dot');
    dots.forEach((d, idx) => {
      d.classList.toggle('is-done',    idx < currentIdx);
      d.classList.toggle('is-current', idx === currentIdx);
    });
  }

  /* ----- state machine ----- */
  function setState(name) {
    [intro, active, completeEl].forEach(el => el && el.classList.remove('is-active'));
    if (name === 'intro'    && intro)      intro.classList.add('is-active');
    if (name === 'active'   && active)     active.classList.add('is-active');
    if (name === 'complete' && completeEl) completeEl.classList.add('is-active');
  }

  /* ----- affirmation reveal ----- */
  function showMessage(text) {
    if (!messageEl) return;
    messageEl.classList.remove('is-show');
    void messageEl.offsetWidth; /* restart animation */
    messageEl.textContent = text;
    messageEl.classList.add('is-show');
  }

  /* ----- cycle engine ----- */
  let timers = [];
  let stopped = false;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function runCycle(i) {
    if (stopped) return;
    if (i >= CYCLES) { finishSession(); return; }

    countEl.textContent = (i + 1);
    showMessage(PHRASES[i]);
    updateProgress(i);

    /* INHALE */
    phaseEl.textContent = t.inhale;
    orbWrap.classList.remove('is-exhale');
    orbWrap.classList.add('is-inhale');

    timers.push(setTimeout(() => {
      if (stopped) return;
      /* EXHALE */
      phaseEl.textContent = t.exhale;
      orbWrap.classList.remove('is-inhale');
      orbWrap.classList.add('is-exhale');
    }, INHALE_MS));

    timers.push(setTimeout(() => {
      runCycle(i + 1);
    }, INHALE_MS + EXHALE_MS));
  }

  function startSession() {
    stopped = false;
    clearTimers();
    buildProgress();
    setState('active');
    /* Small lead-in so the user can settle before the first inhale. */
    timers.push(setTimeout(() => runCycle(0), 700));
  }

  function endSession() {
    stopped = true;
    clearTimers();
    orbWrap.classList.remove('is-inhale', 'is-exhale');
    setState('intro');
  }

  function finishSession() {
    stopped = true;
    clearTimers();
    orbWrap.classList.remove('is-inhale', 'is-exhale');
    setState('complete');
  }

  startBtn   && startBtn.addEventListener('click', startSession);
  endBtn     && endBtn.addEventListener('click', endSession);
  restartBtn && restartBtn.addEventListener('click', startSession);

  /* Stop the session if the user navigates away — prevents jank on return. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && active && active.classList.contains('is-active')) {
      endSession();
    }
  });
})();
