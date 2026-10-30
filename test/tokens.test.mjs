import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadTokens, subtree, deriveBrands, contrast, flatten, resolveAll } from '../scripts/lib.mjs';

const tokens = loadTokens();
const color = subtree(tokens, 'color');
const semantic = subtree(tokens, 'semantic');
const brands = deriveBrands(tokens);

test('brand colors match the approved "Partnership" direction', () => {
  assert.equal(color.ink['900'], '#0F2A3D');
  assert.equal(color.sand['50'], '#F5EFE6');
  assert.equal(brands.group.light.accent, '#B8733A');
  assert.equal(brands.advisors.light.accent, '#1C8272');
  assert.equal(brands.tax.light.accent, '#8A2F5E');
  assert.equal(brands.solutions.light.accent, '#2F5BEA');
});

test('every color token is a #RRGGBB hex value', () => {
  for (const [path, { type, value }] of tokens) {
    if (type === 'color') assert.match(value, /^#[0-9A-F]{6}$/i, path);
  }
});

for (const mode of ['light', 'dark']) {
  test(`${mode}: body text meets WCAG AA (4.5:1)`, () => {
    const s = semantic[mode];
    for (const bg of ['background', 'surface', 'surfaceRaised']) {
      assert.ok(contrast(s.foreground, s[bg]) >= 4.5, `foreground on ${bg}`);
      assert.ok(contrast(s.foregroundMuted, s[bg]) >= 4.5, `foregroundMuted on ${bg}`);
    }
    assert.ok(contrast(s.primary, s.primaryForeground) >= 4.5, 'primary button text');
  });

  for (const id of Object.keys(brands)) {
    test(`${mode}: ${id} accent roles meet contrast targets`, () => {
      const b = brands[id][mode];
      const bg = semantic[mode].background;
      // Buttons rely on their label contrast, checked here; text in the accent uses accentText.
      assert.ok(contrast(b.accent, b.accentForeground) >= 4.5, `text on accent button (${contrast(b.accent, b.accentForeground).toFixed(2)})`);
      assert.ok(contrast(b.accentText, bg) >= 4.5, `accent text on background (${contrast(b.accentText, bg).toFixed(2)})`);
      assert.ok(contrast(b.accentText, b.accentSubtle) >= 4.5, `accent text on subtle badge (${contrast(b.accentText, b.accentSubtle).toFixed(2)})`);
    });
  }
}

test('references resolve and unknown references fail loudly', () => {
  const ok = resolveAll(flatten({ a: { $value: '#000000' }, b: { $value: '{a}' } }));
  assert.equal(ok.get('b').value, '#000000');
  assert.throws(() => resolveAll(flatten({ b: { $value: '{missing}' } })), /Unknown token reference/);
  assert.throws(() => resolveAll(flatten({ a: { $value: '{b}' }, b: { $value: '{a}' } })), /Circular/);
});

test('a token defined in two files is rejected', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tokens-'));
  writeFileSync(join(dir, 'a.json'), JSON.stringify({ x: { y: { $value: 1 } } }));
  writeFileSync(join(dir, 'b.json'), JSON.stringify({ x: { y: { $value: 2 } } }));
  assert.throws(() => loadTokens(dir), /defined twice/);
});
