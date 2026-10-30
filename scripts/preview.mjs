// Builds preview/index.html: a single self-contained page that shows the identity
// as the tokens define it, with a brand switcher and a light/dark toggle.
import { contrast } from './lib.mjs';
import { markPaths } from './logos.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const ratio = (a, b) => contrast(a, b).toFixed(1);
const textOn = (hex) => (contrast(hex, '#FFFFFF') >= contrast(hex, '#091C2A') ? '#FFFFFF' : '#091C2A');

export function previewHtml({ css, brands, color, text, font, logos }) {
  const brandList = Object.values(brands);
  const ink = color.ink['900'];
  const paper = color.sand['50'];

  const scale = (name, entries) =>
    `<div class="scale" dir="ltr" aria-label="${esc(name)}">${entries
      .map(([k, hex]) => `<div class="step" style="background:${hex};color:${textOn(hex)}"><span>${k}</span><code>${hex}</code></div>`)
      .join('')}</div>`;

  const swatch = (name, hex, note = '') => `
        <div class="swatch">
          <div class="chip" style="background:${hex}"></div>
          <div class="swatch-meta"><strong>${esc(name)}</strong><code>${hex}</code>${note ? `<span>${esc(note)}</span>` : ''}</div>
        </div>`;

  const brandCards = brandList
    .map(
      (b) => `
      <article class="brand-card" data-brand="${b.id}">
        <div class="logo-grid">
          <div class="logo-light">${logos[b.id].light}</div>
          <div class="logo-dark">${logos[b.id].dark}</div>
          <div class="logo-light">${logos[b.id].arLight}</div>
          <div class="logo-dark">${logos[b.id].arDark}</div>
        </div>
        <h3>${esc(b.nameAr)}</h3>
        <p class="muted" dir="ltr">${esc(b.name)} · ${esc(b.domain)}</p>
        <div class="roles">
          ${swatch('Accent', b.light.accent, `نص ${b.light.accentForeground === '#FFFFFF' ? 'أبيض' : 'داكن'} عليه: ${ratio(b.light.accent, b.light.accentForeground)}:1`)}
          ${swatch('Accent (dark)', b.dark.accent, `على الخلفية الداكنة: ${ratio(b.dark.accent, color.ink['950'])}:1`)}
          ${swatch('Accent text', b.light.accentText, `على الخلفية الفاتحة: ${ratio(b.light.accentText, color.sand['25'])}:1`)}
        </div>
        <button class="btn btn-accent" type="button">احجز استشارة</button>
      </article>`,
    )
    .join('');

  const typeRows = Object.entries(text)
    .map(
      ([k, t]) => `
        <div class="type-row">
          <code>${k} · ${t.fontSize} / ${t.fontWeight}</code>
          <div style="font-size:${t.fontSize};font-weight:${t.fontWeight};line-height:${t.lineHeight}">شريكك في كل خطوة · Your partner in every step</div>
        </div>`,
    )
    .join('');

  const appIcons = brandList
    .map(
      (b) => `
        <div class="app-icon" style="background:${paper}"><svg viewBox="0 0 64 64" aria-hidden="true">${markPaths({ ink, accent: b.light.accent })}</svg></div>`,
    )
    .join('');
  const appIconsInverse = brandList
    .map(
      (b) => `
        <div class="app-icon" style="background:${b.light.accent}"><svg viewBox="0 0 64 64" aria-hidden="true">${markPaths({ ink: paper, accent: ink })}</svg></div>`,
    )
    .join('');

  return `<!doctype html>
<html lang="ar" dir="rtl" data-brand="group">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UniPal Brand Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
${css}
* { box-sizing: border-box; }
html { background: var(--up-background); }
body {
  margin: 0;
  background: var(--up-background);
  color: var(--up-foreground);
  font-family: var(--up-font-sans);
  font-size: var(--up-font-size-base);
  line-height: var(--up-line-height-normal);
  -webkit-font-smoothing: antialiased;
}
code { font-family: var(--up-font-mono); font-size: 12px; color: var(--up-foreground-muted); direction: ltr; unicode-bidi: isolate; }
.wrap { max-width: 1120px; margin: 0 auto; padding: 0 16px; }
.muted { color: var(--up-foreground-muted); margin: 0; }
h1, h2, h3 { margin: 0; line-height: var(--up-line-height-tight); }
section { padding: var(--up-space-16) 0; border-top: 1px solid var(--up-border); }
section > .wrap > h2 { font-size: var(--up-font-size-2xl); margin-bottom: var(--up-space-2); }
section > .wrap > .muted { margin-bottom: var(--up-space-8); max-width: 70ch; }

.toolbar { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--up-background) 88%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--up-border); }
.toolbar .wrap { display: flex; flex-wrap: wrap; gap: var(--up-space-3); align-items: center; justify-content: space-between; padding-block: var(--up-space-3); }
.seg { display: inline-flex; flex-wrap: wrap; gap: 4px; padding: 4px; border-radius: var(--up-radius-md); background: var(--up-surface); border: 1px solid var(--up-border); }
.seg button { border: 0; background: transparent; color: var(--up-foreground-muted); font: inherit; font-size: 14px; padding: 6px 12px; border-radius: var(--up-radius-sm); cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--up-surface-raised); color: var(--up-foreground); box-shadow: var(--up-shadow-sm); font-weight: 600; }

.site-header { display: flex; align-items: center; justify-content: space-between; gap: var(--up-space-4); padding: var(--up-space-5) 0; flex-wrap: wrap; }
.site-header svg { height: 48px; width: auto; display: block; }
.site-header nav { display: flex; gap: var(--up-space-6); flex-wrap: wrap; font-size: 15px; }
.site-header nav a { color: var(--up-foreground); text-decoration: none; }
.site-header nav a:hover { color: var(--up-accent-text); }
.hero { position: relative; padding: var(--up-space-16) 0 var(--up-space-20); overflow: hidden; }
.hero .art { position: absolute; left: -48px; bottom: -96px; width: 380px; height: 380px; pointer-events: none; }
.hero .art .h1 { stroke: var(--up-border); }
.hero .art .h2 { stroke: var(--up-accent); opacity: .22; }
.hero .eyebrow { position: relative; display: inline-block; font-size: 13px; font-weight: 600; color: var(--up-accent-text); background: var(--up-accent-subtle); padding: 4px 12px; border-radius: var(--up-radius-full); margin-bottom: var(--up-space-4); }
.hero h1 { position: relative; font-size: clamp(34px, 5.4vw, 52px); font-weight: 700; max-width: 13ch; }
.hero p { position: relative; font-size: var(--up-font-size-lg); color: var(--up-foreground-muted); max-width: 48ch; margin: var(--up-space-4) 0 var(--up-space-8); }
.hero .actions { position: relative; display: flex; gap: var(--up-space-3); flex-wrap: wrap; align-items: center; }
.back-link { font-size: 14px; color: var(--up-foreground-muted); }

.btn { font: inherit; font-weight: 600; font-size: 15px; border-radius: var(--up-radius-md); padding: 11px 20px; border: 1px solid transparent; cursor: pointer; transition: background var(--up-duration-fast) var(--up-easing-standard); }
.btn:focus-visible { outline: 2px solid var(--up-focus-ring); outline-offset: 2px; }
.btn-accent { background: var(--up-accent); color: var(--up-accent-foreground); }
.btn-accent:hover { background: var(--up-accent-strong); }
.btn-primary { background: var(--up-primary); color: var(--up-primary-foreground); }
.btn-outline { background: transparent; color: var(--up-foreground); border-color: var(--up-border-strong); }

.grid { display: grid; gap: var(--up-space-6); grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.brand-card { background: var(--up-surface); border: 1px solid var(--up-border); border-radius: var(--up-radius-xl); padding: var(--up-space-5); display: flex; flex-direction: column; gap: var(--up-space-3); }
.brand-card h3 { font-size: var(--up-font-size-lg); }
.logo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--up-space-2); }
.logo-grid > div { border-radius: var(--up-radius-md); padding: var(--up-space-3) var(--up-space-2); display: flex; align-items: center; justify-content: center; }
.logo-grid svg { width: 100%; height: auto; max-height: 44px; }
.logo-light { background: ${color.sand['25']}; border: 1px solid var(--up-border); }
.logo-dark { background: ${ink}; border: 1px solid var(--up-border); }
.roles { display: grid; gap: var(--up-space-2); }
.brand-card .btn { align-self: flex-start; margin-top: auto; }

.swatch { display: flex; align-items: center; gap: var(--up-space-3); }
.swatch .chip { width: 36px; height: 36px; border-radius: var(--up-radius-sm); border: 1px solid var(--up-border); flex: none; }
.swatch-meta { display: flex; flex-direction: column; font-size: 13px; line-height: 1.35; min-width: 0; }
.swatch-meta span { color: var(--up-foreground-muted); font-size: 12px; }

.scale { display: grid; grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); border-radius: var(--up-radius-lg); overflow: hidden; border: 1px solid var(--up-border); margin-bottom: var(--up-space-4); }
.step { padding: var(--up-space-4) var(--up-space-3); min-height: 92px; display: flex; flex-direction: column; justify-content: flex-end; font-size: 13px; font-weight: 600; }
.step code { color: inherit; opacity: .8; font-size: 11px; }

.mark-row { display: grid; gap: var(--up-space-4); grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.mark-tile { border-radius: var(--up-radius-xl); min-height: 240px; display: flex; align-items: center; justify-content: center; gap: var(--up-space-6); flex-wrap: wrap; padding: var(--up-space-6); position: relative; }
.mark-tile .label { position: absolute; top: 12px; inset-inline-start: 16px; font-size: 12px; font-weight: 600; opacity: .7; }
.mark-tile svg.xl { width: 140px; height: 140px; }
.app-icons { display: flex; gap: var(--up-space-3); flex-wrap: wrap; justify-content: center; }
.app-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px -8px rgba(9, 28, 42, .5); }
.app-icon svg { width: 38px; height: 38px; }

.type-row { display: grid; gap: var(--up-space-2); padding: var(--up-space-4) 0; border-bottom: 1px solid var(--up-border); }

.components { display: grid; gap: var(--up-space-6); grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.panel { background: var(--up-surface-raised); border: 1px solid var(--up-border); border-radius: var(--up-radius-lg); padding: var(--up-space-6); box-shadow: var(--up-shadow-md); display: flex; flex-direction: column; gap: var(--up-space-4); }
.row { display: flex; gap: var(--up-space-2); flex-wrap: wrap; align-items: center; }
.badge { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: var(--up-radius-full); background: var(--up-accent-subtle); color: var(--up-accent-text); }
.badge.success { background: color-mix(in srgb, var(--up-success) 14%, transparent); color: var(--up-success); }
.badge.warning { background: color-mix(in srgb, var(--up-warning) 14%, transparent); color: var(--up-warning); }
.badge.danger { background: color-mix(in srgb, var(--up-danger) 14%, transparent); color: var(--up-danger); }
label { font-size: 14px; font-weight: 500; display: grid; gap: 6px; }
input { font: inherit; padding: 10px 12px; border-radius: var(--up-radius-md); border: 1px solid var(--up-border-strong); background: var(--up-background); color: var(--up-foreground); }
input:focus { outline: 2px solid var(--up-focus-ring); outline-offset: 1px; }
.task { display: flex; justify-content: space-between; gap: var(--up-space-3); padding: var(--up-space-3) 0; border-bottom: 1px solid var(--up-border); font-size: 14px; }
.task:last-child { border-bottom: 0; }

.cards { display: flex; gap: var(--up-space-5); flex-wrap: wrap; justify-content: center; }
.bcard { width: 300px; max-width: 100%; aspect-ratio: 1.75; border-radius: var(--up-radius-lg); padding: var(--up-space-5); display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--up-shadow-lg); }
.bcard svg { height: 40px; width: auto; align-self: flex-start; }
.bcard .person { font-size: 14px; font-weight: 700; }
.bcard .role { font-size: 11px; opacity: .75; }
.bcard .contact { font-size: 10.5px; direction: ltr; text-align: left; opacity: .85; }
footer { padding: var(--up-space-8) 0; color: var(--up-foreground-muted); font-size: 13px; border-top: 1px solid var(--up-border); }
</style>
</head>
<body>
<div class="toolbar">
  <div class="wrap">
    <div class="seg" role="group" aria-label="العلامة">
${brandList.map((b) => `      <button type="button" data-set-brand="${b.id}" aria-pressed="${b.id === 'group'}">${esc(b.label.charAt(0) + b.label.slice(1).toLowerCase())}</button>`).join('\n')}
    </div>
    <div class="seg" role="group" aria-label="المظهر">
      <button type="button" data-set-theme="system" aria-pressed="true">تلقائي</button>
      <button type="button" data-set-theme="light" aria-pressed="false">فاتح</button>
      <button type="button" data-set-theme="dark" aria-pressed="false">داكن</button>
    </div>
  </div>
</div>

<header class="wrap">
  <div class="site-header">
    <div id="header-logo">${logos.group.arLight}</div>
    <nav aria-label="القائمة"><a href="#brands">الرئيسية</a><a href="#mark">خدماتنا</a><a href="#type">من نحن</a><a href="#components">تواصل معنا</a></nav>
  </div>
  <div class="hero">
    <svg class="art" viewBox="0 0 64 64" aria-hidden="true"><path class="h1" d="M17 8V33A15 15 0 0 0 32 48" fill="none" stroke-width="12"/><path class="h2" d="M32 48A15 15 0 0 0 47 33V8" fill="none" stroke-width="12"/></svg>
    <span class="eyebrow" id="hero-eyebrow">${esc(brands.group.nameAr)}</span>
    <h1>شريكك في كل خطوة</h1>
    <p>استشارات، ضرائب، وحلول تقنية تحت مظلة واحدة، بفريق يعرف عملك كما تعرفه أنت.</p>
    <div class="actions">
      <button class="btn btn-accent" type="button">احجز استشارة</button>
      <button class="btn btn-outline" type="button">تعرّف علينا</button>
      <span class="back-link">جزء من مجموعة UniPal Group ←</span>
    </div>
  </div>
</header>

<section id="mark">
  <div class="wrap">
    <h2>الرمز: شراكة</h2>
    <p class="muted">حرف U من نصفين يلتقيان في الأسفل. النصف الأيسر هو UniPal وثابت دائماً، والنصف الأيمن هو الشريك ويأخذ لون الشركة. معاً يصنعان حرفاً واحداً.</p>
    <div class="mark-row">
      <div class="mark-tile" style="background:${paper};color:${ink}"><span class="label">على الفاتح</span><svg class="xl" viewBox="0 0 64 64" aria-hidden="true">${markPaths({ ink, accent: brands.group.light.accent })}</svg></div>
      <div class="mark-tile" style="background:${ink};color:${paper}"><span class="label">على الداكن</span><svg class="xl" viewBox="0 0 64 64" aria-hidden="true">${markPaths({ ink: paper, accent: brands.group.dark.accent })}</svg></div>
      <div class="mark-tile" style="background:${ink};color:${paper};flex-direction:column"><span class="label">أيقونات التطبيقات</span><div class="app-icons">${appIcons}</div><div class="app-icons">${appIconsInverse}</div></div>
    </div>
  </div>
</section>

<section id="brands">
  <div class="wrap">
    <h2>الشركات الأربع</h2>
    <p class="muted">كل شركة لها شعار لاتيني وعربي، فاتح وداكن. لون النص فوق كل لون يُختار تلقائياً حسب التباين.</p>
    <div class="grid">${brandCards}
    </div>
  </div>
</section>

<section id="colors">
  <div class="wrap">
    <h2>الألوان</h2>
    <p class="muted">البترولي للنصوص والنصف الثابت من الرمز، والرملي للخلفيات، ولون واحد لكل شركة.</p>
    ${scale('Ink', Object.entries(color.ink))}
    ${scale('Sand', Object.entries(color.sand))}
    ${scale('Accents', brandList.map((b) => [b.label.charAt(0) + b.label.slice(1).toLowerCase(), b.light.accent]))}
  </div>
</section>

<section id="type">
  <div class="wrap">
    <h2>الخط: ${esc(font.family.sans[0])}</h2>
    <p class="muted">خط واحد يغطي العربية واللاتينية بنفس الروح، فيبقى النص المختلط متناسقاً. مجاني برخصة OFL.</p>
    ${typeRows}
  </div>
</section>

<section id="components">
  <div class="wrap">
    <h2>عناصر الواجهة</h2>
    <p class="muted">عيّنة من شكل لوحة التحكم والمواقع بنفس الـ tokens.</p>
    <div class="components">
      <div class="panel">
        <div class="row"><button class="btn btn-accent" type="button">حفظ</button><button class="btn btn-primary" type="button">إرسال</button><button class="btn btn-outline" type="button">إلغاء</button></div>
        <div class="row"><span class="badge">جديد</span><span class="badge success">مكتمل</span><span class="badge warning">قيد المراجعة</span><span class="badge danger">متأخر</span></div>
        <label>اسم الشركة<input type="text" placeholder="مثال: شركة النور للتجارة"></label>
      </div>
      <div class="panel">
        <h3 style="font-size:var(--up-font-size-lg)">مهام هذا الأسبوع</h3>
        <div>
          <div class="task"><span>إقرار ضريبة القيمة المضافة لعميل جديد</span><span class="badge warning">الخميس</span></div>
          <div class="task"><span>مراجعة عقد شراكة الإحالة</span><span class="badge">اليوم</span></div>
          <div class="task"><span>إطلاق موقع UniPal Tax</span><span class="badge success">تم</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="cards">
  <div class="wrap">
    <h2>بطاقات العمل</h2>
    <p class="muted">وجه لاتيني داكن ووجه عربي فاتح.</p>
    <div class="cards">
      <div class="bcard" style="background:${ink};color:${paper}">
        ${logos.group.dark}
        <div style="direction:ltr;text-align:left"><div class="person">Full Name</div><div class="role">Managing Partner</div></div>
      </div>
      <div class="bcard" style="background:${color.sand['25']};color:${ink};border:1px solid ${color.sand['100']}">
        ${logos.advisors.arLight}
        <div><div class="person">الاسم الكامل</div><div class="role">مستشار أول</div><div class="contact">name@unipal.group · advisors.unipal.group</div></div>
      </div>
    </div>
  </div>
</section>

<footer><div class="wrap">UniPal Brand · مولّد من unipal-brand/tokens · غيّر الـ tokens وأعد البناء لتتغير الهوية في كل المنتجات.</div></footer>

<script>
(() => {
  const root = document.documentElement;
  const light = ${JSON.stringify(Object.fromEntries(Object.entries(logos).map(([id, l]) => [id, l.arLight])))};
  const dark = ${JSON.stringify(Object.fromEntries(Object.entries(logos).map(([id, l]) => [id, l.arDark])))};
  const names = ${JSON.stringify(Object.fromEntries(brandList.map((b) => [b.id, b.nameAr])))};
  const isDark = () => root.dataset.theme === 'dark' || (root.dataset.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  const paint = () => {
    const id = root.dataset.brand;
    document.getElementById('header-logo').innerHTML = (isDark() ? dark : light)[id];
    document.getElementById('hero-eyebrow').textContent = names[id];
  };
  const press = (attr, value) => document.querySelectorAll('[' + attr + ']').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value)));
  document.querySelectorAll('[data-set-brand]').forEach((b) => b.addEventListener('click', () => {
    root.dataset.brand = b.dataset.setBrand; press('data-set-brand', b.dataset.setBrand); paint();
  }));
  document.querySelectorAll('[data-set-theme]').forEach((b) => b.addEventListener('click', () => {
    const t = b.dataset.setTheme;
    if (t === 'system') delete root.dataset.theme; else root.dataset.theme = t;
    press('data-set-theme', t); paint();
  }));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);
  paint();
})();
</script>
</body>
</html>
`;
}
