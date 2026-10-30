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
| `logos/` | Symbol, Latin lockup and Arabic lockup SVGs per brand, normal and reversed |
| `preview/index.html` | Self-contained preview of the whole identity with brand and theme switchers |

## Brands

| Brand | Domain | Accent |
| --- | --- | --- |
| UniPal Group | unipal.group | `#B8733A` copper |
| UniPal Advisors | advisors.unipal.group | `#1C8272` teal |
| UniPal Tax | tax.unipal.group | `#8A2F5E` plum |
| UniPal Solutions | solutions.unipal.group | `#2F5BEA` cobalt |

All brands share petrol ink `#0F2A3D`, sand `#F5EFE6`, the Readex Pro typeface (Arabic and Latin) and the
same scales. This is the "Partnership" direction chosen on 2026-10-30; change values in `tokens/` only.

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

Load the font with `next/font/google` (`Readex_Pro`, subsets `arabic` and `latin`).

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

Bundle the Readex Pro font files in the app (OFL) under the family name `Readex Pro`.

## Logos

The mark ("Partnership") is a U made of two halves that meet at the bottom: the left half is UniPal and is
always ink (sand on dark backgrounds), the right half is the partner and takes the company color. Together
they make one letter. These SVGs are generated working versions: lockup text is live Readex Pro, so the
final print-ready files should have it outlined.

## Development

```bash
npm run build   # regenerate outputs
npm test        # tokens, WCAG contrast, outputs
npm run check   # what CI runs
```

No npm dependencies. Node 22+.
