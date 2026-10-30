# unipal-brand

Single source of truth for the UniPal Group visual identity. Everything the web (`unipal-web`) and
Flutter (`unipal-apps`) products show as color, type, spacing or logo comes from here.

## Rules

- Edit only `tokens/*.json` (DTCG format: `$value`, `$type`, references as `{path.to.token}`) and `scripts/*.mjs`.
- `dist/`, `logos/`, `preview/` and `flutter/lib/src/tokens.g.dart` are generated. Never edit them by hand;
  run `npm run build` and commit the result. CI fails if they are stale.
- Never hard-code a hex value in an app. Apps use semantic roles (`background`, `foreground`, `accent`, ...).
- The logo letter is always navy (white on dark). Only the dot / accent changes per brand.
- Per-brand accent roles (`accentForeground`, `accentSubtle`, `accentText`, dark variants) are derived in
  `scripts/lib.mjs#deriveBrands` to meet WCAG AA. Do not override them by hand; tests enforce contrast.
- Adding a brand: add an entry under `brand` in `tokens/brands.json`, run `npm run build`, commit.

## Commands

- `npm run build` - regenerate every output
- `npm test` - token, contrast and output tests (node:test, no dependencies)
- `npm run check` - build + test + fail if generated files differ from what is committed (what CI runs)
- `cd flutter && flutter analyze && flutter test` - Flutter package checks

## Branches

`main` = released, `develop` = integration. Work on a feature branch and open a PR into `develop`.
Tag releases `vX.Y.Z` on `main`; consumers pin to a tag.
