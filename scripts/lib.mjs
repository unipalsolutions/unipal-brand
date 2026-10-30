// Token loading, reference resolution and color math shared by the build and the tests.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = new URL('..', import.meta.url).pathname;
export const TOKENS_DIR = join(ROOT, 'tokens');

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function deepMerge(target, source, file) {
  for (const [key, value] of Object.entries(source)) {
    if (key in target && isPlainObject(value) && '$value' in value) {
      throw new Error(`Token "${key}" is defined twice (second time in ${file})`);
    }
    if (isPlainObject(value) && isPlainObject(target[key])) {
      deepMerge(target[key], value, file);
    } else if (key in target && !key.startsWith('$')) {
      throw new Error(`Token "${key}" is defined twice (second time in ${file})`);
    } else {
      target[key] = value;
    }
  }
  return target;
}

export function loadTokenTree(dir = TOKENS_DIR) {
  const tree = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    deepMerge(tree, JSON.parse(readFileSync(join(dir, file), 'utf8')), file);
  }
  return tree;
}

// Flattens a DTCG tree into "a.b.c" -> { value, type }. $type is inherited from groups.
export function flatten(tree) {
  const out = new Map();
  const walk = (node, path, inheritedType) => {
    const type = node.$type ?? inheritedType;
    if ('$value' in node) {
      out.set(path.join('.'), { value: node.$value, type });
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$') || !isPlainObject(child)) continue;
      walk(child, [...path, key], type);
    }
  };
  walk(tree, [], undefined);
  return out;
}

const REF = /^\{([^}]+)\}$/;

export function resolveAll(flat) {
  const resolved = new Map();
  const resolveValue = (value, stack) => {
    if (typeof value === 'string') {
      const match = value.match(REF);
      if (!match) return value;
      return resolveToken(match[1], stack);
    }
    if (Array.isArray(value)) return value.map((v) => resolveValue(v, stack));
    if (isPlainObject(value)) {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveValue(v, stack)]));
    }
    return value;
  };
  const resolveToken = (path, stack = []) => {
    if (resolved.has(path)) return resolved.get(path).value;
    if (stack.includes(path)) throw new Error(`Circular token reference: ${[...stack, path].join(' -> ')}`);
    const token = flat.get(path);
    if (!token) throw new Error(`Unknown token reference {${path}}${stack.length ? ` in ${stack.at(-1)}` : ''}`);
    const value = resolveValue(token.value, [...stack, path]);
    resolved.set(path, { ...token, value });
    return value;
  };
  for (const path of flat.keys()) resolveToken(path);
  return resolved;
}

export function loadTokens(dir) {
  return resolveAll(flatten(loadTokenTree(dir)));
}

// Returns the resolved values under a prefix as a nested object.
export function subtree(tokens, prefix) {
  const out = {};
  for (const [path, { value }] of tokens) {
    if (!path.startsWith(`${prefix}.`)) continue;
    const keys = path.slice(prefix.length + 1).split('.');
    let node = out;
    for (const key of keys.slice(0, -1)) node = node[key] ??= {};
    node[keys.at(-1)] = value;
  }
  return out;
}

// ---- color math -------------------------------------------------------------

export function parseHex(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Expected a #RRGGBB color, got "${hex}"`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const toHex = (rgb) =>
  '#' + rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('').toUpperCase();

// Mixes `amount` (0..1) of `other` into `base`.
export const mix = (base, other, amount) => {
  const a = parseHex(base);
  const b = parseHex(other);
  return toHex(a.map((c, i) => c + (b[i] - c) * amount));
};

export function luminance(hex) {
  const [r, g, b] = parseHex(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const pickForeground = (background, candidates) =>
  candidates.reduce((best, c) => (contrast(background, c) > contrast(background, best) ? c : best));

// Moves a color toward `toward` in 5% steps until it reaches `target` contrast against `background`.
export function ensureContrast(color, background, toward, target = 4.5) {
  for (let step = 0; step <= 20; step++) {
    const candidate = mix(color, toward, step * 0.05);
    if (contrast(candidate, background) >= target) return candidate;
  }
  return toward;
}

// ---- brand derivation ---------------------------------------------------------

// Derives every per-brand color role from the single accent token, for both themes.
export function deriveBrands(tokens) {
  const color = subtree(tokens, 'color');
  const semantic = subtree(tokens, 'semantic');
  const brands = subtree(tokens, 'brand');

  return Object.fromEntries(
    Object.entries(brands).map(([id, brand]) => {
      const accent = brand.accent;
      const lightSubtle = mix(accent, color.white, 0.88);
      const darkAccent = ensureContrast(accent, semantic.dark.background, color.white);
      const darkSubtle = mix(accent, semantic.dark.background, 0.75);
      return [
        id,
        {
          id,
          name: brand.name,
          nameAr: brand.nameAr,
          label: brand.label,
          labelAr: brand.labelAr,
          domain: brand.domain,
          light: {
            accent,
            accentForeground: pickForeground(accent, [color.white, color.ink['950']]),
            accentSubtle: lightSubtle,
            accentStrong: mix(accent, color.ink['950'], 0.2),
            // Darkened until it reads on the subtle tint, which is darker than the page background.
            accentText: ensureContrast(accent, lightSubtle, color.ink['950']),
          },
          dark: {
            // Lifted until it reads on the dark page; ink-950 text on it then has the same contrast.
            accent: darkAccent,
            accentForeground: color.ink['950'],
            accentSubtle: darkSubtle,
            accentStrong: mix(darkAccent, color.white, 0.2),
            accentText: ensureContrast(darkAccent, darkSubtle, color.white),
          },
        },
      ];
    }),
  );
}
