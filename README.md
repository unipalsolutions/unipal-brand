# unipal-brand

الهوية البصرية المشتركة لمجموعة UniPal: الألوان والخطوط والمسافات والشعارات، في مكان واحد،
مع مخرجات جاهزة لمواقع Next.js ولتطبيقات Flutter. تغيير الهوية لاحقاً = تعديل ملفات `tokens/` ثم `npm run build`.

The shared UniPal Group identity: design tokens, logos, and generated outputs for web and Flutter.

## What is in here

| Path | What |
| --- | --- |
| `tokens/` | Source of truth (DTCG JSON): palette, brands, semantic roles, type, spacing, radius, shadow, motion |
| `dist/css/tokens.css` | CSS custom properties (`--up-*`), per brand via `data-brand`, light/dark via system or `data-theme` |
| `dist/css/theme.css` | Tailwind CSS v4 `@theme` mapping (`bg-background`, `text-foreground`, `bg-accent`, `font-sans`, ...) |
| `dist/js/` | ESM + TypeScript: `tokens`, `brands`, `brandForHost(host)` |
| `flutter/` | Dart package `unipal_brand`: generated tokens + `UnipalTheme.light/dark(brand)` |
| `logos/` | Symbol and lockup SVGs per brand, normal and reversed |
| `preview/index.html` | Self-contained preview of the whole identity with brand and theme switchers |

## Brands

| Brand | Domain | Accent |
| --- | --- | --- |
| UniPal Group | unipal.group | `#C8A24A` gold |
| UniPal Advisors | advisors.unipal.group | `#0E7C66` emerald |
| UniPal Tax | tax.unipal.group | `#9B2C3E` burgundy |
| UniPal Solutions | solutions.unipal.group | `#2563EB` blue |

All brands share navy `#0E1A3A`, IBM Plex Sans Arabic + Inter, and the same scales. Values come from the
UniPal Group brand proposal v1.0 (October 2026) and are expected to change; change them in `tokens/` only.

## Use in Next.js (`unipal-web`)

```jsonc
// package.json
"@unipal/brand": "github:unipalsolutions/unipal-brand#v0.1.0"
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@unipal/brand/css/theme.css";
```

```tsx
// Pick the brand from the request host (tax.unipal.group -> tax)
import { brandForHost } from '@unipal/brand';
const brand = brandForHost((await headers()).get('host'));
return <html lang="ar" dir="rtl" data-brand={brand.id}>...</html>;
```

Load the fonts with `next/font/google` (`Inter`, `IBM_Plex_Sans_Arabic`) and keep Inter first in the stack.

## Use in Flutter (`unipal-apps`)

```yaml
dependencies:
  unipal_brand:
    git:
      url: https://github.com/unipalsolutions/unipal-brand
      path: flutter
      ref: v0.1.0
```

```dart
MaterialApp(
  theme: UnipalTheme.light(UnipalBrand.group),
  darkTheme: UnipalTheme.dark(UnipalBrand.group),
);
```

Bundle the Inter and IBM Plex Sans Arabic font files in the app (both OFL) under those family names.

## Logos

The mark is a U (unity, the umbrella over the companies) holding a dot (the client). The letter is always
navy, or white on dark backgrounds; only the dot changes color. These SVGs are generated working versions:
the lockup text is live Inter text, so the final print-ready files should be outlined by the designer.

## Development

```bash
npm run build   # regenerate outputs
npm test        # tokens, WCAG contrast, outputs
npm run check   # what CI runs
```

No npm dependencies. Node 22+.
