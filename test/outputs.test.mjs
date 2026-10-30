import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { build } from '../scripts/build.mjs';
import { ROOT } from '../scripts/lib.mjs';
import { brands, brandForHost, tokens } from '../dist/js/index.js';

const files = build();

test('committed outputs are up to date with tokens (run `npm run build`)', () => {
  for (const [rel, content] of Object.entries(files)) {
    assert.equal(readFileSync(join(ROOT, rel), 'utf8'), content, `${rel} is stale`);
  }
});

test('CSS defines every brand for light, system dark and forced dark', () => {
  const css = files['dist/css/tokens.css'];
  for (const id of Object.keys(brands)) {
    assert.ok(css.includes(`[data-brand="${id}"] {`), `${id} light`);
    assert.ok(css.includes(`:root:not([data-theme="light"])[data-brand="${id}"]`), `${id} system dark`);
    assert.ok(css.includes(`:root[data-theme="dark"][data-brand="${id}"]`), `${id} forced dark`);
  }
});

test('Dart output declares every brand', () => {
  const dart = files['flutter/lib/src/tokens.g.dart'];
  for (const id of Object.keys(brands)) assert.match(dart, new RegExp(`^  ${id}\\($`, 'm'));
});

test('brandForHost maps production, staging and unknown hosts', () => {
  assert.equal(brandForHost('unipal.group').id, 'group');
  assert.equal(brandForHost('www.unipal.group').id, 'group');
  assert.equal(brandForHost('tax.unipal.group').id, 'tax');
  assert.equal(brandForHost('staging-advisors.unipal.group').id, 'advisors');
  assert.equal(brandForHost('solutions.unipal.group:3000').id, 'solutions');
  assert.equal(brandForHost('hub.unipal.group').id, 'group');
  assert.equal(brandForHost('localhost:3000').id, 'group');
  assert.equal(brandForHost(undefined).id, 'group');
});

test('JS tokens expose the font stack with Inter before Arabic', () => {
  assert.deepEqual(tokens.font.family.sans.slice(0, 2), ['Inter', 'IBM Plex Sans Arabic']);
});

test('logos keep the letter navy and only change the dot', () => {
  for (const id of Object.keys(brands)) {
    const svg = files[`logos/symbol-${id}.svg`];
    assert.ok(svg.includes('stroke="#0E1A3A"'), `${id} letter`);
    assert.ok(svg.includes(`fill="${brands[id].light.accent}"`), `${id} dot`);
  }
});
