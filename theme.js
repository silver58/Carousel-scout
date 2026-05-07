/* ═══════════════════════════════════════════════════════════════════════
 * SALCOMP THEME TOGGLE — light / dark
 *
 * How it works:
 * - Default theme stays DARK (no class on <body>)
 * - When user toggles to light: <body class="light-theme"> is added
 *   and CSS rules below override all the relevant variables.
 * - Persists in localStorage so the choice survives navigation/refresh.
 * - Auto-injects a small ☀ / 🌙 toggle button into existing top-right header
 *   so we don't have to edit each HTML file.
 * ═══════════════════════════════════════════════════════════════════════ */

(function injectThemeStyles(){
  // CSS that overrides the dark-theme variables when body.light-theme is set
  // We only override colors that exist across the codebase. Accent colors
  // (amb, grn, red, blu, pur, cyn) keep their values in both themes.
  const css = `
    /* ── LIGHT THEME OVERRIDES ── */
    body.light-theme {
      --bg:    #f5f7fa;
      --sur:   #ffffff;
      --sur2:  #f0f3f7;
      --bdr:   #d8dee5;
      --bdr2:  #b8c1cc;
      --txt:   #1a1f26;
      --mut:   #4a5562;
      --mut2:  #6b7785;
      background: #f5f7fa !important;
      color: #1a1f26;
    }
    /* Inputs/textareas in light mode */
    body.light-theme input[type="text"],
    body.light-theme input[type="number"],
    body.light-theme input[type="time"],
    body.light-theme input[type="date"],
    body.light-theme input[type="password"],
    body.light-theme input[type="email"],
    body.light-theme select,
    body.light-theme textarea {
      background: #fff !important;
      color: #1a1f26 !important;
      border-color: #c8d0d9 !important;
    }
    body.light-theme input::placeholder,
    body.light-theme textarea::placeholder {
      color: #8893a0 !important;
    }
    /* Cards, panels — slight shadow for elevation in light mode */
    body.light-theme .card,
    body.light-theme .panel {
      box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 0 0 1px rgba(0,0,0,.04);
    }
    body.light-theme .area-btn,
    body.light-theme .kpi {
      box-shadow: 0 1px 3px rgba(0,0,0,.05);
    }
    body.light-theme .area-btn,
    body.light-theme .area-btn .area-toggle {
      background: #ffffff !important;
    }
    body.light-theme .area.open .area-btn{
      background: linear-gradient(135deg, #ffffff 0%, #f0f3f7 100%) !important;
    }
    /* Reduce some glows that were tuned for dark mode */
    body.light-theme .hdr::before,
    body.light-theme body::after {
      opacity: 0.5;
    }
    body.light-theme .toast-bar {
      background: #ffffff !important;
      color: #1a1f26 !important;
      border: 1px solid #d8dee5 !important;
    }
    /* Borders that used dark variables */
    body.light-theme .nav-tabs,
    body.light-theme .panel-head,
    body.light-theme .card-head {
      border-color: #d8dee5;
    }
    /* PRINT TEMPLATES already use white background — leave alone */

    /* Theme toggle button */
    .theme-toggle{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      background:rgba(0,0,0,.25);
      border:1px solid var(--bdr,#21262d);
      border-radius:6px;
      padding:4px 9px;
      cursor:pointer;
      color:var(--mut2,#b1bac4);
      font-size:13px;
      transition:all .15s;
      font-family:'IBM Plex Mono',monospace;
      letter-spacing:.04em;
      min-width:30px;
    }
    .theme-toggle:hover{
      border-color:var(--amb,#f0a500);
      color:var(--amb,#f0a500);
    }
    body.light-theme .theme-toggle{
      background:rgba(255,255,255,.7);
      border-color:#c8d0d9;
      color:#4a5562;
    }
  `;
  const style = document.createElement('style');
  style.id = 'salcomp-theme-styles';
  style.textContent = css;
  // Insert as early as possible — beats FOUC on initial load
  if(document.head){
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  }
})();

// Apply saved theme immediately to avoid flash
(function applyInitialTheme(){
  let theme = 'dark';
  try { theme = localStorage.getItem('salcomp_theme') || 'dark'; } catch(e){}
  if(theme === 'light'){
    if(document.body) document.body.classList.add('light-theme');
    else document.addEventListener('DOMContentLoaded', () => document.body.classList.add('light-theme'));
  }
})();

window.toggleTheme = function(){
  const isLight = document.body.classList.toggle('light-theme');
  try { localStorage.setItem('salcomp_theme', isLight ? 'light' : 'dark'); } catch(e){}
  // Update all theme toggle buttons
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = isLight ? '☀' : '🌙';
    btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  });
};

// Inject the toggle button next to the language toggle on every page
function injectThemeToggle(){
  if(document.querySelector('.theme-toggle')) return;  // already injected
  const langToggle = document.querySelector('.lang-toggle');
  if(!langToggle) return;
  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  const isLight = document.body.classList.contains('light-theme');
  btn.textContent = isLight ? '☀' : '🌙';
  btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  btn.onclick = window.toggleTheme;
  // Insert immediately before the language toggle for visual consistency
  langToggle.parentNode.insertBefore(btn, langToggle);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', injectThemeToggle);
} else {
  injectThemeToggle();
}
