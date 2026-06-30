/**
 * Virtual Assistant — public widget.
 *
 * Loaded by every customer site that has the addon installed (the
 * <script src="https://mrrobot.co.il/assets/js/virtual-assistant.js" defer>
 * tag is injected by virtual-assistant-install.sh into every *.html at the
 * site root). On boot it:
 *
 *   1. POSTs /ajax/virtual_assistant_init.php with the current hostname.
 *      The server issues / refreshes the `va_visitor` cookie on
 *      mrrobot.co.il (Domain=mrrobot.co.il, SameSite=None, Secure, HttpOnly)
 *      and returns the bot config (uuid, name, model, requires_form,
 *      form_schema, has_existing_session, welcome_message).
 *   2. If a bot is configured, renders a floating bubble at bottom-right.
 *      Clicking it expands a chat panel.
 *   3. First time: shows the pre-chat form (when requires_form && !form_post)
 *      or the chat directly. Form submit -> POST /ajax/virtual_assistant_form.
 *   4. Visitor messages -> POST /ajax/virtual_assistant_chat. One message at
 *      a time. Insufficient-tokens / not-configured returns a polite system
 *      bubble.
 *   5. On page reload, /ajax/virtual_assistant_history is called to repaint
 *      prior turns from the same visitor cookie.
 *
 * Self-contained — no external CSS. Strings localised via the visitor's
 * <html lang> (he/en/fr; defaults to en).
 */
(function () {
  'use strict';

  if (window.__VA_LOADED) return;
  window.__VA_LOADED = true;

  var BASE = 'https://mrrobot.co.il';
  var INIT_URL    = BASE + '/ajax/virtual_assistant_init.php';
  var FORM_URL    = BASE + '/ajax/virtual_assistant_form.php';
  var CHAT_URL    = BASE + '/ajax/virtual_assistant_chat.php';
  var HISTORY_URL = BASE + '/ajax/virtual_assistant_history.php';
  var STATE_URL   = BASE + '/ajax/virtual_assistant_state.php';
  var RESET_URL   = BASE + '/ajax/virtual_assistant_reset.php';

  // ---- Locale ---------------------------------------------------------------
  var docLang = (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase();
  var LG = (docLang === 'he' || docLang === 'fr') ? docLang : 'en';
  var IS_RTL = LG === 'he';

  var T = {
    en: {
      title: 'Chat',
      placeholder: 'Type your message…',
      send: 'Send',
      open: 'Open chat',
      close: 'Close chat',
      typing: 'Assistant is typing…',
      formSubmit: 'Start chatting',
      formIntro: 'Please tell us a bit about yourself before we begin.',
      requiredField: 'This field is required',
      networkError: 'Couldn’t reach the assistant. Please try again.',
      formRequired: 'Please fill out the form first.',
      unavailable: 'The assistant is temporarily unavailable.',
      reset: 'Reset chat',
      resetHeading: 'Start a new conversation?',
      resetBody: 'This will clear the entire conversation and start a fresh chat. This can’t be undone.',
      resetConfirm: 'Clear conversation',
      resetCancel: 'Cancel'
    },
    he: {
      title: 'צ\'אט',
      placeholder: 'כתבו את ההודעה שלכם…',
      send: 'שליחה',
      open: 'פתיחת הצ\'אט',
      close: 'סגירת הצ\'אט',
      typing: 'הסוכן מקליד…',
      formSubmit: 'התחלת שיחה',
      formIntro: 'ספרו לנו קצת על עצמכם לפני שמתחילים.',
      requiredField: 'שדה חובה',
      networkError: 'לא ניתן להגיע לסוכן. נסו שוב.',
      formRequired: 'יש למלא קודם את הטופס.',
      unavailable: 'הסוכן אינו זמין כרגע.',
      reset: 'איפוס השיחה',
      resetHeading: 'להתחיל שיחה חדשה?',
      resetBody: 'פעולה זו תנקה את כל השיחה ותתחיל צ\'אט חדש. לא ניתן לבטל אותה.',
      resetConfirm: 'ניקוי השיחה',
      resetCancel: 'ביטול'
    },
    fr: {
      title: 'Chat',
      placeholder: 'Tapez votre message…',
      send: 'Envoyer',
      open: 'Ouvrir le chat',
      close: 'Fermer le chat',
      typing: 'L’assistant écrit…',
      formSubmit: 'Démarrer la discussion',
      formIntro: 'Dites-nous-en un peu plus avant de commencer.',
      requiredField: 'Ce champ est obligatoire',
      networkError: 'Impossible de joindre l’assistant. Réessayez.',
      formRequired: 'Veuillez d’abord remplir le formulaire.',
      unavailable: 'L’assistant est temporairement indisponible.',
      reset: 'Réinitialiser le chat',
      resetHeading: 'Démarrer une nouvelle conversation ?',
      resetBody: 'Toute la conversation sera effacée et une nouvelle discussion commencera. Action irréversible.',
      resetConfirm: 'Effacer la conversation',
      resetCancel: 'Annuler'
    }
  };
  function t(key) { return (T[LG] && T[LG][key]) || T.en[key] || key; }

  // ---- Tiny DOM helpers -----------------------------------------------------
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'style') n.style.cssText = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else if (k === 'dataset') for (var d in attrs[k]) n.dataset[d] = attrs[k][d];
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (kids) (kids.length === undefined ? [kids] : kids).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function postJson(url, body) {
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().catch(function () { return null; }); });
  }

  // ---- Styles (one inline <style>) -----------------------------------------
  // Theme + primary color are CSS custom properties set on the bubble + panel
  // root nodes. data-theme switches the background/text/surface palette;
  // --va-primary drives the header, send button, out-bubble, and launcher
  // gradient/shadow. All other colors are derived via color-mix().
  function injectStyles() {
    if (document.getElementById('va-widget-styles')) return;
    var GRAD = 'linear-gradient(135deg, var(--va-primary), color-mix(in srgb, var(--va-primary) 55%, #000))';
    var SHADOW_PRIMARY_45 = 'color-mix(in srgb, var(--va-primary) 45%, transparent)';
    var SHADOW_PRIMARY_60 = 'color-mix(in srgb, var(--va-primary) 60%, transparent)';
    var css = ''
      // ---- Bubble launcher (uses --va-primary, no theme dependency)
      + '#va-bubble{position:fixed;bottom:20px;' + (IS_RTL ? 'left' : 'right') + ':20px;width:60px;height:60px;border-radius:50%;'
      + '--va-primary:#22d3ee;background:' + GRAD + ';color:#fff;border:none;cursor:pointer;'
      + 'box-shadow:0 8px 24px ' + SHADOW_PRIMARY_45 + ';font-size:26px;z-index:2147483640;'
      + 'display:flex;align-items:center;justify-content:center;transition:transform 0.2s, box-shadow 0.2s;}'
      + '#va-bubble:hover{transform:translateY(-2px);box-shadow:0 12px 32px ' + SHADOW_PRIMARY_60 + ';}'
      + '#va-bubble svg{width:28px;height:28px;fill:#fff;}'
      // ---- Panel container (theme-aware via data-theme attr)
      + '#va-panel{position:fixed;bottom:90px;' + (IS_RTL ? 'left' : 'right') + ':20px;width:360px;height:540px;'
      + '--va-primary:#22d3ee;'
      + 'background:var(--va-bg);color:var(--va-text);'
      + 'border:1px solid var(--va-border);border-radius:16px;'
      + 'box-shadow:0 20px 60px rgba(0,0,0,0.5);display:none;flex-direction:column;overflow:hidden;'
      + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;line-height:1.5;'
      + 'z-index:2147483641;direction:' + (IS_RTL ? 'rtl' : 'ltr') + ';}'
      + '#va-panel[data-theme="dark"]{'
      + '--va-bg:#0f172a;--va-text:#e2e8f0;--va-border:rgba(255,255,255,0.08);'
      + '--va-msg-in-bg:rgba(255,255,255,0.06);--va-msg-in-border:rgba(255,255,255,0.08);'
      + '--va-composer-bg:rgba(255,255,255,0.02);--va-input-bg:rgba(255,255,255,0.04);'
      + '--va-input-border:rgba(255,255,255,0.08);--va-form-label:#cbd5e1;--va-form-intro:#94a3b8;'
      + '--va-typing-color:#94a3b8;'
      + '--va-scroll-thumb:color-mix(in srgb, var(--va-primary) 35%, transparent);'
      + '--va-scroll-thumb-hover:color-mix(in srgb, var(--va-primary) 60%, transparent);}'
      + '#va-panel[data-theme="light"]{'
      + '--va-bg:#ffffff;--va-text:#1e293b;--va-border:#e2e8f0;'
      + '--va-msg-in-bg:#f1f5f9;--va-msg-in-border:#e2e8f0;'
      + '--va-composer-bg:#f8fafc;--va-input-bg:#ffffff;'
      + '--va-input-border:#cbd5e1;--va-form-label:#475569;--va-form-intro:#64748b;'
      + '--va-typing-color:#64748b;'
      + '--va-scroll-thumb:color-mix(in srgb, var(--va-primary) 55%, transparent);'
      + '--va-scroll-thumb-hover:color-mix(in srgb, var(--va-primary) 80%, transparent);}'
      + '#va-panel.va-open{display:flex;animation:vaSlide 0.25s cubic-bezier(0.32,0.72,0,1);}'
      + '@keyframes vaSlide{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}'
      // ---- Header
      + '#va-header{padding:14px 16px;background:' + GRAD + ';color:#fff;'
      + 'display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}'
      + '#va-header .va-title{font-weight:600;font-size:15px;}'
      + '#va-header button{background:transparent;border:none;color:#fff;cursor:pointer;padding:4px 8px;font-size:18px;line-height:1;}'
      + '#va-header button:hover{opacity:0.8;}'
      + '#va-body{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--va-bg);}'
      // ---- Chat list (scrollbar tinted with the primary color, theme-aware)
      + '.va-chat{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;gap:8px;'
      + 'scrollbar-width:thin;scrollbar-color:var(--va-scroll-thumb) transparent;}'
      + '.va-chat::-webkit-scrollbar,.va-form::-webkit-scrollbar{width:8px;height:8px;}'
      + '.va-chat::-webkit-scrollbar-track,.va-form::-webkit-scrollbar-track{background:transparent;}'
      + '.va-chat::-webkit-scrollbar-thumb,.va-form::-webkit-scrollbar-thumb{background:var(--va-scroll-thumb);border-radius:8px;transition:background 0.2s;}'
      + '.va-chat::-webkit-scrollbar-thumb:hover,.va-form::-webkit-scrollbar-thumb:hover{background:var(--va-scroll-thumb-hover);}'
      + '.va-form{scrollbar-width:thin;scrollbar-color:var(--va-scroll-thumb) transparent;}'
      + '.va-msg{max-width:80%;padding:8px 12px;border-radius:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;}'
      + '.va-msg.in{align-self:' + (IS_RTL ? 'flex-end' : 'flex-start') + ';background:var(--va-msg-in-bg);border:1px solid var(--va-msg-in-border);}'
      + '.va-msg.out{align-self:' + (IS_RTL ? 'flex-start' : 'flex-end') + ';background:' + GRAD + ';color:#fff;}'
      + '.va-msg.system{align-self:center;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#dc2626;font-size:12.5px;font-style:italic;max-width:90%;text-align:center;}'
      + '#va-panel[data-theme="dark"] .va-msg.system{color:#fca5a5;}'
      + '.va-msg.typing{color:var(--va-typing-color);font-style:italic;}'
      + '.va-typing-dots{display:inline-flex;gap:3px;vertical-align:middle;margin-' + (IS_RTL ? 'right' : 'left') + ':6px;}'
      + '.va-typing-dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--va-typing-color);animation:vaTyping 1.1s infinite ease-in-out;}'
      + '.va-typing-dots span:nth-child(2){animation-delay:0.18s;}'
      + '.va-typing-dots span:nth-child(3){animation-delay:0.36s;}'
      + '@keyframes vaTyping{0%,80%,100%{opacity:0.3;transform:translateY(0);}40%{opacity:1;transform:translateY(-3px);}}'
      // ---- Composer
      + '.va-composer{border-top:1px solid var(--va-border);padding:10px 12px;background:var(--va-composer-bg);flex-shrink:0;}'
      + '.va-composer textarea{width:100%;min-height:40px;max-height:120px;padding:8px 10px;background:var(--va-input-bg);'
      + 'border:1px solid var(--va-input-border);border-radius:10px;color:var(--va-text);font-size:14px;font-family:inherit;'
      + 'resize:none;outline:none;line-height:1.4;box-sizing:border-box;}'
      + '.va-composer textarea:focus{border-color:var(--va-primary);}'
      + '.va-composer textarea:disabled{opacity:0.5;cursor:not-allowed;}'
      + '.va-composer .va-row{display:flex;gap:6px;align-items:flex-end;}'
      + '.va-composer button{flex-shrink:0;background:' + GRAD + ';color:#fff;border:none;'
      + 'border-radius:10px;padding:0 14px;height:40px;cursor:pointer;font-weight:600;font-size:13px;}'
      + '.va-composer button:disabled{opacity:0.4;cursor:not-allowed;}'
      // ---- Form
      + '.va-form{flex:1;overflow-y:auto;padding:16px;}'
      + '.va-form .va-form-intro{color:var(--va-form-intro);font-size:13px;margin-bottom:14px;}'
      + '.va-form-row{margin-bottom:12px;}'
      + '.va-form-row label{display:block;color:var(--va-form-label);font-size:12.5px;margin-bottom:4px;font-weight:500;}'
      + '.va-form-row label .req{color:#f87171;margin-' + (IS_RTL ? 'right' : 'left') + ':4px;}'
      + '.va-form-row input,.va-form-row textarea,.va-form-row select{width:100%;padding:8px 10px;background:var(--va-input-bg);'
      + 'border:1px solid var(--va-input-border);border-radius:8px;color:var(--va-text);font-size:14px;font-family:inherit;outline:none;box-sizing:border-box;}'
      + '.va-form-row input:focus,.va-form-row textarea:focus,.va-form-row select:focus{border-color:var(--va-primary);}'
      + '.va-form-row textarea{resize:vertical;min-height:60px;}'
      + '.va-form-err{color:#f87171;font-size:12px;margin-top:4px;display:none;}'
      + '.va-form-err.visible{display:block;}'
      + '.va-form-submit{width:100%;background:' + GRAD + ';color:#fff;border:none;border-radius:10px;'
      + 'padding:11px;cursor:pointer;font-weight:600;font-size:14px;margin-top:8px;}'
      + '.va-form-submit:disabled{opacity:0.5;cursor:not-allowed;}'
      // ---- Header actions + reset button
      + '#va-header .va-actions{display:flex;align-items:center;gap:2px;}'
      + '#va-reset-btn{display:flex;align-items:center;justify-content:center;}'
      + '#va-reset-btn svg{width:18px;height:18px;fill:#fff;display:block;}'
      // ---- Reset confirmation (fills the body in place of the chat)
      + '.va-confirm{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;'
      + 'text-align:center;gap:14px;padding:24px 22px;overflow-y:auto;background:var(--va-bg);}'
      + '.va-confirm-icon{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;'
      + 'background:color-mix(in srgb, var(--va-primary) 16%, transparent);}'
      + '.va-confirm-icon svg{width:26px;height:26px;fill:var(--va-primary);display:block;}'
      + '.va-confirm-title{font-weight:600;font-size:16px;color:var(--va-text);}'
      + '.va-confirm-text{font-size:13.5px;line-height:1.5;color:var(--va-form-intro);max-width:280px;}'
      + '.va-confirm-actions{display:flex;flex-direction:column;gap:8px;width:100%;max-width:240px;margin-top:4px;}'
      + '.va-confirm-btn{width:100%;border:none;border-radius:10px;padding:11px;cursor:pointer;font-weight:600;font-size:14px;'
      + 'transition:transform 0.15s, box-shadow 0.2s, opacity 0.2s;}'
      + '.va-confirm-btn.primary{background:' + GRAD + ';color:#fff;box-shadow:0 6px 18px ' + SHADOW_PRIMARY_45 + ';}'
      + '.va-confirm-btn.primary:hover{transform:translateY(-1px);box-shadow:0 10px 26px ' + SHADOW_PRIMARY_60 + ';}'
      + '.va-confirm-btn.primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}'
      + '.va-confirm-btn.secondary{background:var(--va-input-bg);color:var(--va-text);border:1px solid var(--va-input-border);}'
      + '.va-confirm-btn.secondary:hover{border-color:var(--va-primary);background:var(--va-msg-in-bg);}'
      + '@media (max-width:480px){'
      + '#va-panel{bottom:0;left:0;right:0;width:100%;height:100%;border-radius:0;}'
      + '#va-bubble{bottom:14px;' + (IS_RTL ? 'left' : 'right') + ':14px;}'
      + '}';
    var s = document.createElement('style');
    s.id = 'va-widget-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function applyTheme() {
    if (!W.cfg) return;
    var theme = (W.cfg.theme === 'light') ? 'light' : 'dark';
    var primary = /^#[0-9a-fA-F]{6}$/.test(W.cfg.primary_color || '') ? W.cfg.primary_color : '#22d3ee';
    [W.nodes.bubble, W.nodes.panel].forEach(function (n) {
      if (!n) return;
      n.dataset.theme = theme;
      n.style.setProperty('--va-primary', primary);
    });
  }

  // ---- Widget state --------------------------------------------------------
  var W = {
    cfg: null,            // init response
    open: false,
    busy: false,
    historyLoaded: false,
    historyLoading: false,    // lazy-load in flight
    noMoreHistory: false,     // server returned a partial (or empty) batch
    loadedOldestId: null,     // smallest message id currently rendered
    nodes: {}             // root, panel, chat, composer, etc.
  };

  // ---- Renderers -----------------------------------------------------------
  function renderBubble() {
    var bubble = el('button', {
      id: 'va-bubble',
      type: 'button',
      'aria-label': t('open'),
      title: W.cfg.bot_name || t('title'),
      onclick: toggle
    });
    bubble.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z"/></svg>';
    document.body.appendChild(bubble);
    W.nodes.bubble = bubble;
  }

  function renderPanel() {
    var panel = el('div', { id: 'va-panel' });
    panel.appendChild(renderHeader());
    var body = el('div', { id: 'va-body' });
    panel.appendChild(body);
    document.body.appendChild(panel);
    W.nodes.panel = panel;
    W.nodes.body  = body;
  }

  function renderHeader() {
    var header = el('div', { id: 'va-header' });
    header.appendChild(el('div', { class: 'va-title', text: W.cfg.bot_name || t('title') }));

    var actions = el('div', { class: 'va-actions' });
    // Reset button — hidden by default; shown only while the chat view is
    // active (renderChatView/renderFormView toggle it).
    var resetBtn = el('button', {
      id: 'va-reset-btn',
      type: 'button',
      'aria-label': t('reset'),
      title: t('reset'),
      onclick: showResetConfirm
    });
    resetBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 1 0 7.74 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
    resetBtn.style.display = 'none';
    actions.appendChild(resetBtn);
    actions.appendChild(el('button', { type: 'button', 'aria-label': t('close'), onclick: toggle, html: '×' }));
    header.appendChild(actions);

    W.nodes.resetBtn = resetBtn;
    return header;
  }

  function setResetVisible(show) {
    if (W.nodes.resetBtn) W.nodes.resetBtn.style.display = show ? '' : 'none';
  }

  function renderFormView() {
    var schema = (W.cfg.form_schema && W.cfg.form_schema.fields) || [];
    var wrap = el('div', { class: 'va-form' });
    if (schema.length === 0) {
      // No fields configured but requires_form is on — bypass gracefully.
      switchToChat();
      return;
    }
    var introText = (W.cfg.form_intro && W.cfg.form_intro.trim()) ? W.cfg.form_intro : t('formIntro');
    wrap.appendChild(el('div', { class: 'va-form-intro', text: introText }));
    schema.forEach(function (f) {
      var row = el('div', { class: 'va-form-row', dataset: { name: f.name } });
      var lab = el('label', null, [f.label]);
      if (f.required) lab.appendChild(el('span', { class: 'req', text: '*' }));
      row.appendChild(lab);
      var input;
      if (f.type === 'textarea') {
        input = el('textarea', { rows: '3' });
      } else if (f.type === 'select') {
        input = el('select');
        input.appendChild(el('option', { value: '' }, ['—']));
        (f.options || []).forEach(function (o) {
          input.appendChild(el('option', { value: o }, [o]));
        });
      } else {
        var inputType = f.type === 'email' ? 'email' : (f.type === 'tel' ? 'tel' : 'text');
        input = el('input', { type: inputType });
      }
      input.dataset.name = f.name;
      input.dataset.required = f.required ? '1' : '0';
      row.appendChild(input);
      row.appendChild(el('div', { class: 'va-form-err' }));
      wrap.appendChild(row);
    });
    var submitBtn = el('button', {
      type: 'button',
      class: 'va-form-submit',
      text: t('formSubmit'),
      onclick: submitForm
    });
    wrap.appendChild(submitBtn);
    W.nodes.body.innerHTML = '';
    W.nodes.body.appendChild(wrap);
    setResetVisible(false);
  }

  function renderChatView() {
    var chat = el('div', { class: 'va-chat' });
    var composer = el('div', { class: 'va-composer' });
    var row = el('div', { class: 'va-row' });
    var ta = el('textarea', {
      placeholder: t('placeholder'),
      maxlength: '255',
      rows: '1'
    });
    var btn = el('button', { type: 'button', text: t('send'), onclick: sendMessage });
    row.appendChild(ta);
    row.appendChild(btn);
    composer.appendChild(row);

    ta.addEventListener('input', function () {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
      btn.disabled = !ta.value.trim() || W.busy;
    });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!btn.disabled) sendMessage();
      }
    });

    // Lazy-load older messages when the visitor scrolls to the top.
    chat.addEventListener('scroll', function () {
      if (chat.scrollTop <= 30 && !W.historyLoading && !W.noMoreHistory && W.loadedOldestId) {
        loadMoreHistory();
      }
    });

    W.nodes.body.innerHTML = '';
    W.nodes.body.appendChild(chat);
    W.nodes.body.appendChild(composer);
    W.nodes.chat = chat;
    W.nodes.composer = composer;
    W.nodes.input = ta;
    W.nodes.sendBtn = btn;
    btn.disabled = true;
    setResetVisible(true);
  }

  function appendMsg(direction, body) {
    var div = el('div', { class: 'va-msg ' + direction, text: body });
    W.nodes.chat.appendChild(div);
    W.nodes.chat.scrollTop = W.nodes.chat.scrollHeight;
    return div;
  }
  function appendTyping() {
    var div = el('div', { class: 'va-msg in typing', html: escHtml(t('typing')) + '<span class="va-typing-dots"><span></span><span></span><span></span></span>' });
    div.id = 'va-typing-node';
    W.nodes.chat.appendChild(div);
    W.nodes.chat.scrollTop = W.nodes.chat.scrollHeight;
    return div;
  }
  function removeTyping() {
    var n = document.getElementById('va-typing-node');
    if (n && n.parentNode) n.parentNode.removeChild(n);
  }

  function appendSystem(text) {
    var div = el('div', { class: 'va-msg system', text: text });
    W.nodes.chat.appendChild(div);
    W.nodes.chat.scrollTop = W.nodes.chat.scrollHeight;
  }

  // ---- View transitions ----------------------------------------------------
  function switchToChat() {
    renderChatView();
    if (!W.historyLoaded) {
      W.historyLoaded = true;
      // Render welcome message before history (only if no prior messages exist).
      loadHistory().then(function (hadMessages) {
        if (!hadMessages && W.cfg.welcome_message) {
          appendMsg('in', W.cfg.welcome_message);
        }
        if (W.nodes.input) W.nodes.input.focus();
      });
    } else {
      if (W.nodes.input) W.nodes.input.focus();
    }
  }

  function showFormOrChat() {
    var needsForm = W.cfg.requires_form && !W.cfg.has_form_post;
    if (needsForm) {
      renderFormView();
    } else {
      switchToChat();
    }
  }

  function toggle(opts) {
    opts = opts || {};
    W.open = !W.open;
    if (W.open) {
      W.nodes.panel.classList.add('va-open');
      W.nodes.bubble.style.display = 'none';
      if (!W.nodes.body.firstChild) showFormOrChat();
    } else {
      W.nodes.panel.classList.remove('va-open');
      W.nodes.bubble.style.display = '';
    }
    // Persist open/close state on the visitor's vassistant_users row.
    // Skip when restoring on page load (silent) so we don't echo a no-op
    // round-trip back to the server.
    if (!opts.silent) {
      postJson(STATE_URL, { bot_uuid: W.cfg.bot_uuid, panel_open: W.open ? 1 : 0 })
        .catch(function () { /* silent */ });
    }
  }

  // ---- Reset session -------------------------------------------------------
  // The reset button turns the whole body into a confirmation. Confirming
  // rotates the `va_visitor` cookie server-side — that cookie is the chat
  // session's only token, and it's HttpOnly so the client can't clear it — then
  // re-renders a brand-new session (welcome message, or the pre-chat form again
  // if the bot requires one).
  function showResetConfirm() {
    if (!W.nodes.chat) return;       // only reachable from the chat view
    if (W.nodes.confirm) return;     // already confirming

    // Hide the live chat rather than destroy it, so Cancel restores it
    // instantly (scroll position + lazily-loaded history preserved).
    W.nodes.chat.style.display = 'none';
    if (W.nodes.composer) W.nodes.composer.style.display = 'none';
    setResetVisible(false);

    var wrap = el('div', { class: 'va-confirm' });
    var icon = el('div', { class: 'va-confirm-icon' });
    icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 1 0 7.74 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
    wrap.appendChild(icon);
    wrap.appendChild(el('div', { class: 'va-confirm-title', text: t('resetHeading') }));
    wrap.appendChild(el('div', { class: 'va-confirm-text', text: t('resetBody') }));

    var actions = el('div', { class: 'va-confirm-actions' });
    var confirmBtn = el('button', { type: 'button', class: 'va-confirm-btn primary', text: t('resetConfirm'), onclick: doReset });
    var cancelBtn  = el('button', { type: 'button', class: 'va-confirm-btn secondary', text: t('resetCancel'), onclick: closeResetConfirm });
    actions.appendChild(confirmBtn);
    actions.appendChild(cancelBtn);
    wrap.appendChild(actions);

    var err = el('div', { class: 'va-form-err' });
    wrap.appendChild(err);

    W.nodes.body.appendChild(wrap);
    W.nodes.confirm = wrap;
    W.nodes.confirmBtn = confirmBtn;
    W.nodes.confirmErr = err;
  }

  function closeResetConfirm() {
    if (W.nodes.confirm && W.nodes.confirm.parentNode) {
      W.nodes.confirm.parentNode.removeChild(W.nodes.confirm);
    }
    W.nodes.confirm = null;
    W.nodes.confirmBtn = null;
    W.nodes.confirmErr = null;
    if (W.nodes.chat) W.nodes.chat.style.display = '';
    if (W.nodes.composer) W.nodes.composer.style.display = '';
    setResetVisible(true);
    if (W.nodes.input) W.nodes.input.focus();
  }

  function doReset() {
    if (!W.nodes.confirmBtn) return;
    var btn = W.nodes.confirmBtn;
    var prev = btn.textContent;
    if (W.nodes.confirmErr) W.nodes.confirmErr.classList.remove('visible');
    btn.disabled = true;
    btn.textContent = '…';

    postJson(RESET_URL, { bot_uuid: W.cfg.bot_uuid })
      .then(function (data) {
        if (!(data && data.success)) {
          btn.disabled = false;
          btn.textContent = prev;
          if (W.nodes.confirmErr) {
            W.nodes.confirmErr.textContent = (data && data.message) || t('networkError');
            W.nodes.confirmErr.classList.add('visible');
          }
          return;
        }
        // Cookie rotated → this visitor is now brand-new. Drop all per-session
        // client state and re-render the body from scratch.
        W.cfg.has_form_post = false;
        W.cfg.has_existing_session = false;
        W.historyLoaded = false;
        W.historyLoading = false;
        W.noMoreHistory = false;
        W.loadedOldestId = null;
        W.busy = false;
        W.nodes.confirm = null;
        W.nodes.confirmBtn = null;
        W.nodes.confirmErr = null;
        W.nodes.chat = null;
        W.nodes.composer = null;
        W.nodes.input = null;
        W.nodes.sendBtn = null;
        W.nodes.body.innerHTML = '';
        showFormOrChat();
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = prev;
        if (W.nodes.confirmErr) {
          W.nodes.confirmErr.textContent = t('networkError');
          W.nodes.confirmErr.classList.add('visible');
        }
      });
  }

  // ---- Network actions -----------------------------------------------------
  function submitForm() {
    var rows = W.nodes.body.querySelectorAll('.va-form-row');
    var fields = {};
    var ok = true;
    rows.forEach(function (row) {
      var input = row.querySelector('input, textarea, select');
      var err = row.querySelector('.va-form-err');
      err.classList.remove('visible');
      var val = (input.value || '').trim();
      var req = input.dataset.required === '1';
      if (req && val === '') {
        err.textContent = t('requiredField');
        err.classList.add('visible');
        ok = false;
      }
      fields[input.dataset.name] = val;
    });
    if (!ok) return;

    var btn = W.nodes.body.querySelector('.va-form-submit');
    var prev = btn.textContent;
    btn.disabled = true;
    btn.textContent = '…';

    postJson(FORM_URL, { bot_uuid: W.cfg.bot_uuid, fields: fields, lg: LG })
      .then(function (data) {
        if (data && data.success) {
          W.cfg.has_form_post = true;
          switchToChat();
        } else {
          btn.disabled = false;
          btn.textContent = prev;
          alert((data && data.message) || t('networkError'));
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = prev;
        alert(t('networkError'));
      });
  }

  // Initial history fetch — only the last 15 messages. Older turns are loaded
  // lazily via loadMoreHistory() when the visitor scrolls up to the top.
  function loadHistory() {
    var INITIAL = 15;
    W.historyLoading = true;
    return postJson(HISTORY_URL, { bot_uuid: W.cfg.bot_uuid, limit: INITIAL })
      .then(function (data) {
        if (!(data && data.success && Array.isArray(data.messages) && data.messages.length > 0)) {
          W.noMoreHistory = true;
          return false;
        }
        data.messages.forEach(function (m) {
          appendMsg(m.direction === 'outbound' ? 'in' : 'out', m.body);
        });
        W.loadedOldestId = data.messages[0].id;
        // If the server returned fewer than asked, there are no older rows.
        W.noMoreHistory = data.messages.length < INITIAL;
        // Initial render starts pinned to the bottom (most recent).
        W.nodes.chat.scrollTop = W.nodes.chat.scrollHeight;
        return true;
      })
      .catch(function () { return false; })
      .then(function (had) {
        W.historyLoading = false;
        return had;
      });
  }

  // Lazy-load older messages — fired when the visitor scrolls to the top.
  // Pulls 10 more rows older than the currently-rendered oldest, prepends
  // them, and preserves the visual scroll position so the chat doesn't jump.
  function loadMoreHistory() {
    if (W.historyLoading || W.noMoreHistory || !W.loadedOldestId) return;
    var BATCH = 10;
    W.historyLoading = true;
    var prevHeight = W.nodes.chat.scrollHeight;
    var prevTop    = W.nodes.chat.scrollTop;

    postJson(HISTORY_URL, {
      bot_uuid:  W.cfg.bot_uuid,
      limit:     BATCH,
      before_id: W.loadedOldestId
    })
      .then(function (data) {
        if (!(data && data.success && Array.isArray(data.messages) && data.messages.length > 0)) {
          W.noMoreHistory = true;
          return;
        }
        // Prepend in chronological order so the oldest of the new batch is
        // the topmost rendered row.
        var firstChild = W.nodes.chat.firstChild;
        data.messages.forEach(function (m) {
          var div = document.createElement('div');
          div.className = 'va-msg ' + (m.direction === 'outbound' ? 'in' : 'out');
          div.textContent = m.body;
          W.nodes.chat.insertBefore(div, firstChild);
        });
        W.loadedOldestId = data.messages[0].id;
        if (data.messages.length < BATCH) W.noMoreHistory = true;
        // Preserve scroll: the user was looking at row X near the top —
        // keep that row in the same viewport position by re-anchoring.
        var newHeight = W.nodes.chat.scrollHeight;
        W.nodes.chat.scrollTop = prevTop + (newHeight - prevHeight);
      })
      .catch(function () { /* silent */ })
      .then(function () { W.historyLoading = false; });
  }

  function sendMessage() {
    if (W.busy) return;
    var ta = W.nodes.input;
    var text = (ta.value || '').trim();
    if (!text) return;
    // Hard cap: 255 UTF-8 codepoints (emoji-safe).
    if (Array.from(text).length > 255) {
      text = Array.from(text).slice(0, 255).join('');
    }

    appendMsg('out', text);
    ta.value = '';
    ta.style.height = 'auto';
    W.busy = true;
    W.nodes.sendBtn.disabled = true;
    ta.disabled = true;
    appendTyping();

    postJson(CHAT_URL, { bot_uuid: W.cfg.bot_uuid, message: text, lg: LG })
      .then(function (data) {
        removeTyping();
        if (!data) {
          appendSystem(t('networkError'));
        } else if (data.success && data.assistant && data.assistant.body) {
          appendMsg('in', data.assistant.body);
        } else if (data.code === 'form_required') {
          appendSystem(t('formRequired'));
          W.cfg.has_form_post = false;
          renderFormView();
          return;
        } else if (data.code === 'unavailable') {
          appendSystem(data.message || t('unavailable'));
        } else {
          appendSystem(data.message || t('networkError'));
        }
        W.busy = false;
        ta.disabled = false;
        W.nodes.sendBtn.disabled = !ta.value.trim();
        ta.focus();
      })
      .catch(function () {
        removeTyping();
        appendSystem(t('networkError'));
        W.busy = false;
        ta.disabled = false;
        W.nodes.sendBtn.disabled = !ta.value.trim();
      });
  }

  // ---- Boot ----------------------------------------------------------------
  function boot() {
    postJson(INIT_URL, { domain: location.hostname })
      .then(function (data) {
        if (!data || !data.configured) return;
        W.cfg = data;
        injectStyles();
        renderPanel();
        renderBubble();
        applyTheme();
        // Auto-restore: if the visitor closed the page with the panel open
        // and they have a persisted session, re-open it on this page load.
        if (W.cfg.panel_open && W.cfg.has_existing_session) {
          toggle({ silent: true });
        }
      })
      .catch(function () { /* silent */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
