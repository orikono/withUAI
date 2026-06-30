(function () {
  'use strict';

  // ===== i18n =====
  const LANG = (document.documentElement.lang || 'he').slice(0, 2).toLowerCase();
  const I18N = {
    he: {
      sending: 'שולח...',
      fillMissing: 'אנא מלאו את השדות החסרים',
      formSuccess: 'תודה, ההודעה התקבלה. נחזור אליכם בהקדם.',
      formError: 'משהו השתבש. אנא נסו שוב בעוד רגע.',
      formNetError: 'לא הצלחנו לשלוח את ההודעה. בדקו את החיבור ונסו שוב.',
      chooseOption: 'בחרו אחת מהאפשרויות כדי להמשיך',
      fillToContinue: 'אנא מלאו את השדות החסרים כדי להמשיך',
      submitFailed: 'שליחה נכשלה. נסו שוב בעוד רגע.',
      networkError: 'בעיית רשת. אנא נסו שוב.',
      funnelSuccessMyself: 'הצעד הראשון נעשה. הצוות שלנו פותח עבורך כעת שיחה רגועה — אם השארת אימייל, נחזור אליך בהקדם. בינתיים אנחנו פה.',
      funnelSuccessSomebodyelse: 'הדיווח שלך התקבל. הצוות שלנו יבחן את הפרטים ויחזור אליך בהקדם. תודה שלא עברת על זה לסדר היום — זהותך תישמר בסוד מוחלט.',
      moodPositiveCta: 'המשך לאיזון — שיחה שקטה',
      moodSupportiveCta: 'התחל שיחה אנונימית עכשיו',
      mood: {
        overwhelmed: { emoji: '🌿', title: 'תודה שעצרת רגע', text: 'ההרגשה הזו מוכרת — והיא לא תישאר ככה לתמיד. נשימה אחת בכל פעם. את או אתה לא לבד בזה, ויש מקום רך להגיע אליו. אם תרצו, אנחנו פה.' },
        anxious:     { emoji: '🌊', title: 'תודה ששיתפת',    text: 'חרדה היא תגובה אנושית — היא לא הופכת אותך לשבור או שבורה. רגע אחד בכל פעם, נשימה אחת בכל פעם. יש דרכים להקל, ואנחנו פה כשתרצו לדבר.' },
        neutral:     { emoji: '🪷', title: 'תודה ששיתפת',    text: 'אפילו "נייטרלי" שווה לעצור עליו. לא חייבים להרגיש משהו בעוצמה כדי שזה יהיה תקף. אנחנו פה — בלי לחץ, רק נוכחות.' },
        okay:        { emoji: '🌤️', title: 'יופי שיש לך את הרגע הזה', text: 'כל יום שאתה או את מצליחים להישאר ב"בסדר" — זה הישג שקט שצריך להוקיר. תמשיכו לטפח את זה, ותזכרו שמגיע לכם להרגיש כך.' },
        hopeful:     { emoji: '✨', title: 'זה יפהפה',        text: 'תקווה היא שריר — ואת או אתה מאמנים אותו ברגע הזה. שמרו על התחושה הזו קרוב; היא יכולה לחזור גם בימים פחות קלים. אנחנו גאים בכם.' },
      }
    },
    en: {
      sending: 'Sending…',
      fillMissing: 'Please fill in the missing fields',
      formSuccess: 'Thank you, your message has been received. We\'ll get back to you shortly.',
      formError: 'Something went wrong. Please try again in a moment.',
      formNetError: 'We couldn\'t send your message. Check your connection and try again.',
      chooseOption: 'Please choose an option to continue',
      fillToContinue: 'Please fill in the missing fields to continue',
      submitFailed: 'Submission failed. Please try again in a moment.',
      networkError: 'Network issue. Please try again.',
      funnelSuccessMyself: 'The first step is done. Our team is opening a quiet conversation for you now — if you left an email, we\'ll get back to you soon. In the meantime, we\'re here.',
      funnelSuccessSomebodyelse: 'Your report has been received. Our team will review the details and get back to you soon. Thank you for not letting this slide — your identity will be kept in strict confidence.',
      moodPositiveCta: 'Continue to balance — a quiet conversation',
      moodSupportiveCta: 'Start an anonymous conversation now',
      mood: {
        overwhelmed: { emoji: '🌿', title: 'Thank you for pausing',                 text: 'This feeling is familiar — and it won\'t stay this way forever. One breath at a time. You\'re not alone in this, and there\'s a soft place to reach. If you\'d like, we\'re here.' },
        anxious:     { emoji: '🌊', title: 'Thank you for sharing',                 text: 'Anxiety is a human response — it doesn\'t make you broken. One moment at a time, one breath at a time. There are ways to ease it, and we\'re here whenever you\'d like to talk.' },
        neutral:     { emoji: '🪷', title: 'Thank you for sharing',                 text: 'Even "neutral" is worth pausing on. You don\'t have to feel something intensely for it to be valid. We\'re here — no pressure, just presence.' },
        okay:        { emoji: '🌤️', title: 'How lovely that you have this moment', text: 'Every day you manage to stay "okay" — that\'s a quiet achievement worth honoring. Keep nurturing it, and remember that you deserve to feel this way.' },
        hopeful:     { emoji: '✨', title: 'That\'s beautiful',                      text: 'Hope is a muscle — and you\'re training it right now. Keep this feeling close; it can return on harder days too. We\'re proud of you.' },
      }
    },
    ar: {
      sending: 'جارٍ الإرسال…',
      fillMissing: 'يرجى ملء الحقول الناقصة',
      formSuccess: 'شكرًا، تم استلام رسالتك. سنرد عليك قريبًا.',
      formError: 'حدث خطأ ما. يرجى المحاولة مرة أخرى بعد قليل.',
      formNetError: 'لم نتمكن من إرسال رسالتك. تحقق من الاتصال وحاول مرة أخرى.',
      chooseOption: 'يرجى اختيار أحد الخيارات للمتابعة',
      fillToContinue: 'يرجى ملء الحقول الناقصة للمتابعة',
      submitFailed: 'فشل الإرسال. يرجى المحاولة مرة أخرى بعد قليل.',
      networkError: 'مشكلة في الشبكة. يرجى المحاولة مرة أخرى.',
      funnelSuccessMyself: 'تم اتخاذ الخطوة الأولى. فريقنا يفتح لك محادثة هادئة الآن — وإذا تركت بريدك الإلكتروني، فسنتواصل معك قريبًا. حتى ذلك الحين، نحن هنا.',
      funnelSuccessSomebodyelse: 'تم استلام تقريرك. سيراجع فريقنا التفاصيل ويعود إليك قريبًا. شكرًا لأنك لم تتجاهل هذا — ستبقى هويتك سرية تمامًا.',
      moodPositiveCta: 'تابع نحو التوازن — محادثة هادئة',
      moodSupportiveCta: 'ابدأ محادثة مجهولة الآن',
      mood: {
        overwhelmed: { emoji: '🌿', title: 'شكرًا لأنك توقفت لحظة',     text: 'هذا الشعور مألوف — ولن يبقى هكذا إلى الأبد. نَفَس واحد في كل مرة. أنت لست وحدك في هذا، وهناك مكان لطيف يمكنك الوصول إليه. إن أردت، نحن هنا.' },
        anxious:     { emoji: '🌊', title: 'شكرًا على المشاركة',         text: 'القلق ردّ فعل إنساني — لا يجعلك مكسورًا. لحظة واحدة في كل مرة، نَفَس واحد في كل مرة. هناك طرق للتخفيف، ونحن هنا حين تريد التحدث.' },
        neutral:     { emoji: '🪷', title: 'شكرًا على المشاركة',         text: 'حتى "محايد" يستحق التوقّف عنده. لا يجب أن تشعر بشيء بشدّة ليكون صحيحًا. نحن هنا — بلا ضغط، فقط حضور.' },
        okay:        { emoji: '🌤️', title: 'ما أجمل أن تملك هذه اللحظة', text: 'كل يوم تستطيع فيه أن تبقى "بخير" — هذا إنجاز هادئ يستحق التقدير. استمر في رعايته، وتذكّر أنك تستحق هذا الشعور.' },
        hopeful:     { emoji: '✨', title: 'هذا جميل',                  text: 'الأمل عضلة — وأنت تمرّنها في هذه اللحظة. احتفظ بهذا الشعور قريبًا منك؛ يمكنه أن يعود حتى في الأيام الأصعب. نحن فخورون بك.' },
      }
    },
    ru: {
      sending: 'Отправка…',
      fillMissing: 'Пожалуйста, заполните пропущенные поля',
      formSuccess: 'Спасибо, ваше сообщение получено. Мы свяжемся с вами в ближайшее время.',
      formError: 'Что-то пошло не так. Пожалуйста, попробуйте снова через мгновение.',
      formNetError: 'Нам не удалось отправить ваше сообщение. Проверьте соединение и попробуйте снова.',
      chooseOption: 'Пожалуйста, выберите один из вариантов, чтобы продолжить',
      fillToContinue: 'Пожалуйста, заполните пропущенные поля, чтобы продолжить',
      submitFailed: 'Отправка не удалась. Попробуйте снова через мгновение.',
      networkError: 'Проблема с сетью. Пожалуйста, попробуйте снова.',
      funnelSuccessMyself: 'Первый шаг сделан. Наша команда открывает для вас тихую беседу — если вы оставили email, мы свяжемся с вами в ближайшее время. А пока мы здесь.',
      funnelSuccessSomebodyelse: 'Ваш отчёт получен. Наша команда изучит детали и свяжется с вами в ближайшее время. Спасибо, что не оставили это без внимания — ваша личность останется строго конфиденциальной.',
      moodPositiveCta: 'Продолжить к балансу — тихий разговор',
      moodSupportiveCta: 'Начать анонимный разговор сейчас',
      mood: {
        overwhelmed: { emoji: '🌿', title: 'Спасибо, что остановились на мгновение', text: 'Это чувство знакомо — и оно не останется таким навсегда. По одному вдоху за раз. Вы не одни в этом, и есть мягкое место, до которого можно дотянуться. Если хотите, мы здесь.' },
        anxious:     { emoji: '🌊', title: 'Спасибо, что поделились',                text: 'Тревога — это человеческая реакция, она не делает вас сломленным. По одному моменту, по одному вдоху. Есть способы её облегчить, и мы здесь, когда захотите поговорить.' },
        neutral:     { emoji: '🪷', title: 'Спасибо, что поделились',                text: 'Даже «нейтрально» стоит того, чтобы на нём остановиться. Не обязательно чувствовать что-то сильно, чтобы это было значимо. Мы здесь — без давления, только присутствие.' },
        okay:        { emoji: '🌤️', title: 'Как хорошо, что у вас есть этот момент', text: 'Каждый день, когда вам удаётся оставаться «в порядке», — это тихое достижение, заслуживающее уважения. Продолжайте заботиться о нём и помните, что вы заслуживаете чувствовать себя так.' },
        hopeful:     { emoji: '✨', title: 'Это прекрасно',                          text: 'Надежда — это мышца, и вы тренируете её прямо сейчас. Держите это чувство рядом; оно может вернуться и в более сложные дни. Мы гордимся вами.' },
      }
    },
  };
  const t = I18N[LANG] || I18N.he;

  // ===== Shared theme helpers (used by the theme toggle + gender chooser) =====
  const docEl = document.documentElement;
  const THEME_COLORS = {
    'girl|light': '#9333EA', 'girl|dark': '#1B1424',
    'boy|light':  '#2563EB', 'boy|dark':  '#0F172A'
  };
  function currentGender() { return docEl.getAttribute('data-gender') === 'boy' ? 'boy' : 'girl'; }
  function currentTheme()  { return docEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function updateThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[currentGender() + '|' + currentTheme()] || '#9333EA');
  }
  let _switchTimer;
  function crossfade() {
    docEl.classList.add('theme-switching');
    clearTimeout(_switchTimer);
    _switchTimer = setTimeout(function () { docEl.classList.remove('theme-switching'); }, 360);
  }

  // ===== Theme toggle (light/dark — shared with blog via localStorage key `blog_theme`) =====
  // The pre-render <script> in <head> already applies any saved theme to <html>
  // before paint to avoid flash. Here we only need to wire the button.
  (function () {
    const themeBtn = document.getElementById('siteThemeToggle');
    if (!themeBtn) return;

    function syncAria() {
      themeBtn.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false');
    }
    syncAria();

    themeBtn.addEventListener('click', function () {
      crossfade();
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      docEl.setAttribute('data-theme', next);
      try { localStorage.setItem('blog_theme', next); } catch (e) {}
      syncAria();
      updateThemeColor();
    });
  })();

  // ===== Gender palette chooser (girl/boy) — shared via localStorage key `site_gender` =====
  // The pre-render <script> in <head> applies any saved data-gender before paint and
  // adds html.needs-gender when no choice exists (so CSS covers the page with no flash).
  // Here we inject the header toggle + the full-page overlay and wire the choices.
  (function () {
    const GENDER_I18N = {
      he: { title: 'בן או בת?', sub: 'נתאים את צבעי האתר במיוחד עבורך. תמיד אפשר לשנות מהכפתור שבתפריט.', girl: 'בת', boy: 'בן', change: 'שינוי ערכת הצבעים', close: 'סגירה' },
      en: { title: 'Are you a boy or a girl?', sub: 'We\'ll tailor the site\'s colors just for you. You can change it anytime from the header button.', girl: 'Girl', boy: 'Boy', change: 'Change color theme', close: 'Close' },
      ar: { title: 'هل أنت ولد أم بنت؟', sub: 'سنخصّص ألوان الموقع خصيصاً لك. يمكنك تغييره في أي وقت من زر القائمة.', girl: 'فتاة', boy: 'فتى', change: 'تغيير مجموعة الألوان', close: 'إغلاق' },
      ru: { title: 'Ты мальчик или девочка?', sub: 'Мы подберём цвета сайта специально для тебя. Изменить можно в любой момент кнопкой в шапке.', girl: 'Девочка', boy: 'Мальчик', change: 'Изменить цветовую тему', close: 'Закрыть' }
    };
    const g = GENDER_I18N[LANG] || GENDER_I18N.he;

    // Hand-crafted avatar illustrations (gradient squircle + white bust + features).
    const GIRL_ART = '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="gcGirlBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C77DFF"/><stop offset=".55" stop-color="#C084FC"/><stop offset="1" stop-color="#F472B6"/></linearGradient><linearGradient id="gcGirlHair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A855F7"/><stop offset="1" stop-color="#EC4899"/></linearGradient><radialGradient id="gcGirlGloss" cx=".32" cy=".24" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient><clipPath id="gcGirlClip"><rect x="3" y="3" width="90" height="90" rx="26"/></clipPath></defs><rect x="3" y="3" width="90" height="90" rx="26" fill="url(#gcGirlBg)"/><g clip-path="url(#gcGirlClip)"><path d="M16 96c0-15 13-24 32-24s32 9 32 24z" fill="#fff"/><path d="M42 60h12v10H42z" fill="#fff"/><path d="M24 48C24 27 35 17 48 17s24 10 24 31c0 13-2 25-5 35l-9-2c2-9 3-18 2-25-3 6-8 9-12 9s-9-3-12-9c-1 7 0 16 2 25l-9 2c-3-10-5-22-5-35z" fill="url(#gcGirlHair)"/><circle cx="48" cy="46" r="15" fill="#fff"/><path d="M34 42c1-11 7-17 14-17s13 6 14 17c-4-5-8-7-9-7-2 0-3 1-5 3-2-2-3-3-5-3-1 0-5 2-9 7z" fill="url(#gcGirlHair)"/><circle cx="39.5" cy="50.5" r="2.7" fill="#F472B6" opacity=".55"/><circle cx="56.5" cy="50.5" r="2.7" fill="#F472B6" opacity=".55"/><circle cx="42.3" cy="46.4" r="2.4" fill="#5B21B6"/><circle cx="53.7" cy="46.4" r="2.4" fill="#5B21B6"/><circle cx="43.1" cy="45.6" r=".85" fill="#fff"/><circle cx="54.5" cy="45.6" r=".85" fill="#fff"/><path d="M43 52.5c2.2 2.8 7.8 2.8 10 0" fill="none" stroke="#5B21B6" stroke-width="2.2" stroke-linecap="round"/><g transform="translate(68 31)"><circle cx="0" cy="-4.2" r="2.4" fill="#FBCFE8"/><circle cx="4" cy="-1.3" r="2.4" fill="#FBCFE8"/><circle cx="2.5" cy="3.4" r="2.4" fill="#FBCFE8"/><circle cx="-2.5" cy="3.4" r="2.4" fill="#FBCFE8"/><circle cx="-4" cy="-1.3" r="2.4" fill="#FBCFE8"/><circle r="1.7" fill="#F472B6"/></g></g><rect x="3" y="3" width="90" height="90" rx="26" fill="url(#gcGirlGloss)"/></svg>';
    const BOY_ART = '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="gcBoyBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset=".55" stop-color="#22A6DE"/><stop offset="1" stop-color="#06B6D4"/></linearGradient><linearGradient id="gcBoyHair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E40AF"/><stop offset="1" stop-color="#0E7490"/></linearGradient><radialGradient id="gcBoyGloss" cx=".32" cy=".24" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient><clipPath id="gcBoyClip"><rect x="3" y="3" width="90" height="90" rx="26"/></clipPath></defs><rect x="3" y="3" width="90" height="90" rx="26" fill="url(#gcBoyBg)"/><g clip-path="url(#gcBoyClip)"><path d="M16 96c0-15 13-24 32-24s32 9 32 24z" fill="#fff"/><path d="M42 60h12v10H42z" fill="#fff"/><circle cx="48" cy="46" r="15" fill="#fff"/><path d="M32 45c0-14 7-22 16-22 7 0 12 4 14 11-3-3-6-4-10-4-2 3-9 4-15 2-2 3-4 7-5 13z" fill="url(#gcBoyHair)"/><circle cx="39.5" cy="50.5" r="2.7" fill="#22D3EE" opacity=".5"/><circle cx="56.5" cy="50.5" r="2.7" fill="#22D3EE" opacity=".5"/><circle cx="42.3" cy="46.4" r="2.4" fill="#1E3A8A"/><circle cx="53.7" cy="46.4" r="2.4" fill="#1E3A8A"/><circle cx="43.1" cy="45.6" r=".85" fill="#fff"/><circle cx="54.5" cy="45.6" r=".85" fill="#fff"/><path d="M43 52.5c2.2 2.8 7.8 2.8 10 0" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round"/></g><rect x="3" y="3" width="90" height="90" rx="26" fill="url(#gcBoyGloss)"/></svg>';

    function savedGender() { try { return localStorage.getItem('site_gender'); } catch (e) { return null; } }

    // -- Header toggle button, injected right after the theme toggle --
    const themeBtn = document.getElementById('siteThemeToggle');
    let genderBtn = null;
    if (themeBtn && themeBtn.parentNode) {
      genderBtn = document.createElement('button');
      genderBtn.className = 'gender-toggle';
      genderBtn.id = 'siteGenderToggle';
      genderBtn.type = 'button';
      genderBtn.setAttribute('aria-haspopup', 'dialog');
      genderBtn.setAttribute('aria-label', g.change);
      genderBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2.6s-6.4 6.9-6.4 11.6a6.4 6.4 0 0 0 12.8 0C18.4 9.5 12 2.6 12 2.6Z"/></svg>';
      themeBtn.parentNode.insertBefore(genderBtn, themeBtn.nextSibling);
    }

    // -- Full-page overlay --
    const overlay = document.createElement('div');
    overlay.className = 'gender-overlay';
    overlay.id = 'genderOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'genderOverlayTitle');
    overlay.innerHTML =
      '<div class="gender-card" role="document">' +
        '<button class="gender-card-close" type="button" aria-label="' + g.close + '">&times;</button>' +
        '<div class="gender-card-emblem"><img src="/_uploads/IMG_1808.webp" alt="WithU AI" width="62" height="62"></div>' +
        '<h2 class="gender-card-title" id="genderOverlayTitle">' + g.title + '</h2>' +
        '<p class="gender-card-sub">' + g.sub + '</p>' +
        '<div class="gender-choices">' +
          '<button class="gender-choice" type="button" data-choice="girl"><span class="gender-choice-art">' + GIRL_ART + '</span><span class="gender-choice-label">' + g.girl + '</span></button>' +
          '<button class="gender-choice" type="button" data-choice="boy"><span class="gender-choice-art">' + BOY_ART + '</span><span class="gender-choice-label">' + g.boy + '</span></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.gender-card-close');
    const choices = Array.prototype.slice.call(overlay.querySelectorAll('.gender-choice'));
    let lastFocus = null;

    function markChoice() {
      const cur = currentGender();
      choices.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.choice === cur ? 'true' : 'false'); });
    }

    function openOverlay(dismissible) {
      markChoice();
      overlay.classList.toggle('can-dismiss', !!dismissible);
      lastFocus = document.activeElement;
      void overlay.offsetWidth;               // force reflow so the fade-in transition fires
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      const pre = overlay.querySelector('.gender-choice[aria-pressed="true"]') || choices[0];
      if (pre) setTimeout(function () { pre.focus(); }, 60);
    }

    function closeOverlay() {
      overlay.classList.remove('is-open');
      docEl.classList.remove('needs-gender');
      document.body.classList.remove('no-scroll');
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }

    function choose(gender) {
      if (gender !== 'girl' && gender !== 'boy') return;
      crossfade();
      docEl.setAttribute('data-gender', gender);
      try { localStorage.setItem('site_gender', gender); } catch (e) {}
      markChoice();
      updateThemeColor();
      closeOverlay();
    }

    choices.forEach(function (c) { c.addEventListener('click', function () { choose(c.dataset.choice); }); });
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay && overlay.classList.contains('can-dismiss')) closeOverlay();
    });
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('can-dismiss')) { closeOverlay(); return; }
      if (e.key === 'Tab') {
        const f = [closeBtn].concat(choices).filter(function (el) { return el && el.offsetParent !== null; });
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    if (genderBtn) genderBtn.addEventListener('click', function () { openOverlay(true); });

    // First visit (no stored choice): show the mandatory overlay (no dismiss).
    if (docEl.classList.contains('needs-gender') || !savedGender()) {
      docEl.classList.add('needs-gender');
      openOverlay(false);
    }
    updateThemeColor();
  })();

  // ===== Nav toggle + mobile drawer =====
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const nav = document.querySelector('.nav');
  const navStart = document.querySelector('.nav-start');

  if (navToggle && navLinks) {
    // -- Relocate the utility controls (language / theme / gender) into the
    //    drawer on mobile, and back into the top bar on desktop. This keeps the
    //    collapsed bar to just the wordmark + toggle so nothing crowds or wraps. --
    const mq = window.matchMedia('(max-width: 880px)');
    const utilRow = document.createElement('li');
    utilRow.className = 'nav-utils';
    const getControls = () => [
      document.querySelector('.lang-switcher'),
      document.getElementById('siteThemeToggle'),
      document.getElementById('siteGenderToggle')
    ].filter(Boolean);

    function placeControls(toDrawer) {
      const controls = getControls();
      if (toDrawer) {
        controls.forEach(c => utilRow.appendChild(c));
        if (!utilRow.parentNode) navLinks.appendChild(utilRow);
      } else {
        if (utilRow.parentNode) utilRow.remove();
        // back into the bar, in order, right after the logo
        controls.forEach(c => { if (navStart) navStart.appendChild(c); });
      }
    }
    placeControls(mq.matches);

    // -- Dimmed scrim behind the open drawer (tap anywhere to dismiss) --
    const scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    document.body.appendChild(scrim);

    function setMenu(open) {
      navLinks.classList.toggle('open', open);
      navToggle.classList.toggle('open', open);
      scrim.classList.toggle('show', open);
      document.body.classList.toggle('no-scroll', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    const closeMenu = () => setMenu(false);

    navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    scrim.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Crossing the breakpoint: reset state and re-flow the controls.
    const onBreakpoint = (e) => { closeMenu(); placeControls(e.matches); };
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint); // older Safari
  }

  // Nav shadow on scroll
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // ===== FAQ chip jump =====
  document.querySelectorAll('.chip[data-target]').forEach(chip => {
    chip.addEventListener('click', () => {
      const target = document.querySelector(chip.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== Forms — AJAX to form_post.php =====
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const resultBox = form.querySelector('.form-result') || createResult(form);
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      // Basic validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          valid = false;
          if (group) group.classList.add('error');
        } else if (group) {
          group.classList.remove('error');
        }
        if (input.type === 'email' && input.value.trim()) {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
          if (!ok) {
            valid = false;
            if (group) group.classList.add('error');
          }
        }
      });
      if (!valid) {
        showResult(resultBox, t.fillMissing, 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t.sending;
      }
      resultBox.classList.remove('show');

      const payload = {};
      new FormData(form).forEach((value, key) => {
        if (payload[key] !== undefined) {
          if (!Array.isArray(payload[key])) payload[key] = [payload[key]];
          payload[key].push(value);
        } else {
          payload[key] = value;
        }
      });
      payload._page = window.location.pathname.split('/').pop() || 'index';
      payload._submitted_at = new Date().toISOString();

      try {
        const res = await fetch('form_post.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data && data.success) {
          showResult(resultBox, form.dataset.successMessage || t.formSuccess, 'success');
          form.reset();
        } else {
          showResult(resultBox, (data && data.message) || t.formError, 'error');
        }
      } catch (err) {
        showResult(resultBox, t.formNetError, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });

  function createResult(form) {
    const div = document.createElement('div');
    div.className = 'form-result';
    form.appendChild(div);
    return div;
  }

  function showResult(box, text, kind) {
    box.textContent = text;
    box.classList.remove('success', 'error');
    box.classList.add(kind, 'show');
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ===== Multi-step funnel (branching flows) =====
  const funnel = document.querySelector('[data-funnel]');
  if (funnel) {
    const allPages = Array.from(funnel.querySelectorAll('.funnel-page'));
    const progressContainer = funnel.querySelector('.progress');
    const choiceState = {};
    let currentFlow = null; // 'myself' | 'somebodyelse'
    let stepIndex = 0;

    // ----- Wire up choice grids -----
    funnel.querySelectorAll('.choice-grid').forEach(grid => {
      const name = grid.dataset.field;
      choiceState[name] = null;
      grid.querySelectorAll('.choice').forEach(c => {
        c.addEventListener('click', () => {
          grid.querySelectorAll('.choice').forEach(s => s.classList.remove('selected'));
          c.classList.add('selected');
          const input = c.querySelector('input');
          const value = input ? input.value : c.textContent.trim();
          choiceState[name] = value;
          if (name === 'report') {
            currentFlow = value;
          }
        });
      });
    });

    // ----- Compute active page list based on flow -----
    function getActivePages() {
      if (!currentFlow) {
        return allPages.filter(p => p.dataset.page === 'intro');
      }
      return allPages.filter(p => p.dataset.flow === 'all' || p.dataset.flow === currentFlow);
    }

    // ----- Build progress dots -----
    function rebuildProgress() {
      if (!progressContainer) return;
      const active = getActivePages();
      const dataPages = active.filter(p => p.dataset.page !== 'result');
      progressContainer.innerHTML = '';
      if (dataPages.length <= 1) {
        progressContainer.style.display = 'none';
        return;
      }
      progressContainer.style.display = '';
      dataPages.forEach((p, idx) => {
        if (idx > 0) {
          const line = document.createElement('span');
          line.className = 'progress-line';
          progressContainer.appendChild(line);
        }
        const dot = document.createElement('span');
        dot.className = 'progress-dot';
        dot.textContent = idx + 1;
        if (idx < stepIndex) dot.classList.add('done');
        else if (idx === stepIndex) dot.classList.add('active');
        progressContainer.appendChild(dot);
      });
    }

    // ----- Navigate to a step index within the current flow -----
    function goTo(i, opts) {
      const active = getActivePages();
      stepIndex = Math.max(0, Math.min(i, active.length - 1));
      allPages.forEach(p => p.classList.remove('active'));
      if (active[stepIndex]) active[stepIndex].classList.add('active');
      rebuildProgress();
      // Stepping through the survey must NOT move the screen — each step
      // swaps in place, so the viewport stays exactly where the user left
      // it (no scrolling down or up). We only scroll when explicitly asked
      // (opts.scroll), which is reserved for the final result card so the
      // confirmation can't land off-screen after submission.
      if (opts && opts.scroll) {
        const scrollTarget = funnel.previousElementSibling || funnel;
        const navEl = document.querySelector('.nav');
        const navHeight = navEl ? navEl.offsetHeight : 72;
        const top = scrollTarget.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }

    // ----- Next-button handler -----
    funnel.querySelectorAll('[data-funnel-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        // choice-grid requirement
        const requiredChoice = btn.dataset.requires;
        if (requiredChoice === 'report' && !currentFlow) {
          flashMessage(funnel, t.chooseOption);
          return;
        }
        if (requiredChoice && requiredChoice !== 'report' && !choiceState[requiredChoice]) {
          flashMessage(funnel, t.chooseOption);
          return;
        }
        // free-text required-field requirement
        const requiredFields = btn.dataset.requiresField;
        if (requiredFields) {
          const page = btn.closest('.funnel-page');
          const names = requiredFields.split(',').map(s => s.trim()).filter(Boolean);
          let missing = false;
          names.forEach(n => {
            const input = page.querySelector('[name="' + n + '"]');
            const group = input ? input.closest('.form-group') : null;
            if (input && !String(input.value || '').trim()) {
              missing = true;
              if (group) group.classList.add('error');
            } else if (group) {
              group.classList.remove('error');
            }
          });
          if (missing) {
            flashMessage(funnel, t.fillToContinue);
            return;
          }
        }
        // If we are leaving the intro page, rebuild progress to reflect the chosen flow
        const wasIntro = !!btn.closest('[data-page="intro"]');
        if (wasIntro) {
          stepIndex = 1;
          goTo(stepIndex);
        } else {
          goTo(stepIndex + 1);
        }
      });
    });

    // ----- Back-button handler -----
    funnel.querySelectorAll('[data-funnel-back]').forEach(btn => {
      btn.addEventListener('click', () => goTo(Math.max(0, stepIndex - 1)));
    });

    // ----- Submission handlers (per-flow forms) -----
    funnel.querySelectorAll('[data-funnel-submit]').forEach(submitForm => {
      submitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const flow = submitForm.dataset.flowForm || currentFlow || 'myself';

        // Build payload from every form/flow-fields block in the active flow only
        const data = {};
        const active = getActivePages();
        active.forEach(page => {
          // include all named inputs/selects/textareas on each active page
          page.querySelectorAll('input[name], select[name], textarea[name]').forEach(inp => {
            // skip helper inputs from intro radios that we already captured in choiceState
            if (inp.name === 'report_intro') return;
            if (inp.type === 'radio' || inp.type === 'checkbox') {
              if (!inp.checked) return;
              data[inp.name] = inp.value;
            } else {
              const v = String(inp.value || '').trim();
              if (v !== '') data[inp.name] = v;
            }
          });
        });

        // Hard-coded "report" field per the chosen flow
        data.report = flow;

        // Merge choice-grid selections (for the myself flow choice-grids without name-attribute inputs visible)
        Object.keys(choiceState).forEach(k => {
          if (k === 'report') return;
          if (choiceState[k] != null && choiceState[k] !== '') {
            data[k] = choiceState[k];
          }
        });

        // Required-field gate for the somebodyelse final form (consent + contact)
        const requiredEls = submitForm.querySelectorAll('[required]');
        let valid = true;
        requiredEls.forEach(input => {
          const group = input.closest('.form-group') || input.closest('.consent');
          let bad = false;
          if (input.type === 'checkbox') {
            bad = !input.checked;
          } else {
            bad = !String(input.value || '').trim();
            if (!bad && input.type === 'email') {
              bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
            }
          }
          if (bad) {
            valid = false;
            if (group) group.classList.add('error');
          } else if (group) {
            group.classList.remove('error');
          }
        });
        if (!valid) {
          flashMessage(funnel, t.fillToContinue);
          return;
        }

        data._page = 'report';
        data._submitted_at = new Date().toISOString();

        const btn = submitForm.querySelector('[type="submit"]');
        const original = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = t.sending; }
        try {
          const res = await fetch('form_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const json = await res.json();
          if (json && json.success) {
            // Customize result message per flow
            const resultText = funnel.querySelector('[data-result-text]');
            if (resultText) {
              resultText.textContent = flow === 'somebodyelse'
                ? t.funnelSuccessSomebodyelse
                : t.funnelSuccessMyself;
            }
            const active2 = getActivePages();
            const resultIdx = active2.findIndex(p => p.dataset.page === 'result');
            if (resultIdx >= 0) goTo(resultIdx, { scroll: true });
          } else {
            flashMessage(funnel, (json && json.message) || t.submitFailed);
            if (btn) { btn.disabled = false; btn.textContent = original; }
          }
        } catch (err) {
          flashMessage(funnel, t.networkError);
          if (btn) { btn.disabled = false; btn.textContent = original; }
        }
      });
    });

    // ----- Init -----
    // First load lands the user at the top of the page (hero); the funnel
    // never scrolls the page on its own while stepping through the survey.
    goTo(0);
  }

  function flashMessage(scope, text) {
    let box = scope.querySelector('.funnel-flash');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-result error funnel-flash';
      scope.appendChild(box);
    }
    box.textContent = text;
    box.classList.add('show');
    clearTimeout(box._t);
    box._t = setTimeout(() => box.classList.remove('show'), 3500);
  }

  // ===== Mood check-in =====
  document.querySelectorAll('[data-mood]').forEach(moodCard => {
    const messages = t.mood;
    const positiveCtaText = t.moodPositiveCta;
    const supportiveCtaText = t.moodSupportiveCta;
    const supportiveMoods = new Set(['overwhelmed', 'anxious']);

    const question = moodCard.querySelector('[data-mood-step="question"]');
    const result = moodCard.querySelector('[data-mood-step="result"]');
    const resultEmoji = moodCard.querySelector('[data-mood-result-emoji]');
    const resultTitle = moodCard.querySelector('[data-mood-result-title]');
    const resultText = moodCard.querySelector('[data-mood-result-text]');
    const resultCta = moodCard.querySelector('[data-mood-cta]');
    const resetBtn = moodCard.querySelector('[data-mood-reset]');

    function show(stepEl) {
      moodCard.querySelectorAll('.mood-step').forEach(s => s.classList.remove('active'));
      stepEl.classList.add('active');
    }

    moodCard.querySelectorAll('.mood-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.dataset.moodValue;
        const msg = messages[mood];
        if (!msg || !result) return;
        if (resultEmoji) resultEmoji.textContent = msg.emoji;
        if (resultTitle) resultTitle.textContent = msg.title;
        if (resultText) resultText.textContent = msg.text;
        if (resultCta) {
          resultCta.textContent = supportiveMoods.has(mood) ? supportiveCtaText : positiveCtaText;
        }
        show(result);
      });
    });

    if (resetBtn && question) {
      resetBtn.addEventListener('click', () => show(question));
    }
  });

  // ===== Fade-out before navigation =====
  document.querySelectorAll('a[data-fade-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || link.dataset.fading === '1') return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      link.dataset.fading = '1';
      link.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = href; }, 500);
    });
  });

  // ===== Scroll-to-hash on page load (offset for fixed nav) =====
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      window.addEventListener('load', function () {
        setTimeout(function () {
          const navEl = document.querySelector('.nav');
          const navH = navEl ? navEl.offsetHeight : 72;
          const top = hashTarget.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }, 100);
      }, { once: true });
    }
  }

  // ===== Smooth-anchor for in-page links =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. טופס יצירת קשר (Contact Form)
    const contactForm = document.getElementById('contactForm') || document.querySelector('form');
    if (contactForm && window.location.pathname.includes('contact')) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('contactName')?.value || document.getElementById('name')?.value,
                email: document.getElementById('contactEmail')?.value || document.getElementById('email')?.value,
                message: document.getElementById('contactMessage')?.value || document.getElementById('message')?.value
            };

            try {
                const response = await fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (result.success) {
                    alert('תודה! ההודעה שלך נשלחה ונקלטה בהצלחה.');
                    contactForm.reset();
                } else {
                    alert('שגיאה מהשרת: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('שגיאה בתקשורת עם השרת. ודא שהשרת פועל.');
            }
        });
    }

    // 2. טופס דיווח (Report Form) - מותאם אישית ל-report.html שלך
    const reportForm = document.getElementById('reportForm') || document.querySelector('.report-form');
    if (reportForm && window.location.pathname.includes('report')) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                reporterName: document.getElementById('reporterName')?.value || 'אנונימי',
                category: document.getElementById('incidentType')?.value || 'לא נבחר',
                description: document.getElementById('incidentDescription')?.value || ''
            };

            try {
                const response = await fetch('http://localhost:5000/api/report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (result.success) {
                    alert('הדיווח התקבל במערכת ונשמר בהצלחה.');
                    reportForm.reset();
                } else {
                    alert('שגיאה בשמירת הדיווח: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('שגיאה בתקשורת עם השרת.');
            }
        });
    }
});