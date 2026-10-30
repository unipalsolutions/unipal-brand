// The UniPal mark ("Partnership"): a U made of two halves that meet at the bottom.
// The left half is UniPal and is always ink (sand on dark backgrounds); the right half
// is the partner and takes the brand accent. Together they make one letter.

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const FONT = `font-family="'Readex Pro', 'Segoe UI', Tahoma, sans-serif"`;

// Drawn in a 64x64 box; `x` shifts it horizontally inside a wider lockup.
export const markPaths = ({ ink, accent, x = 0 }) =>
  [
    `<path d="M${17 + x} 8V33A15 15 0 0 0 ${32 + x} 48" fill="none" stroke="${ink}" stroke-width="12"/>`,
    `<path d="M${32 + x} 48A15 15 0 0 0 ${47 + x} 33V8" fill="none" stroke="${accent}" stroke-width="12"/>`,
  ].join('');

const svg = ({ width, title, rtl = false, body }) =>
  [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 64" width="${width}" height="64" direction="${rtl ? 'rtl' : 'ltr'}" role="img" aria-label="${escape(title)}">`,
    `<title>${escape(title)}</title>`,
    body,
    '</svg>',
    '',
  ].join('\n');

export function symbolSvg({ ink, accent, title }) {
  return svg({ width: 64, title, body: markPaths({ ink, accent }) });
}

// Latin lockup: mark on the left, "UniPal" with the letter-spaced company label under it.
// Text is live Readex Pro; print-ready files should have it outlined.
export function lockupSvg({ ink, accent, label, title }) {
  return svg({
    width: 196,
    title,
    body: [
      markPaths({ ink, accent }),
      `<text x="70" y="36" ${FONT} font-size="29" font-weight="700" letter-spacing="-0.4" fill="${ink}">UniPal</text>`,
      `<text x="71" y="54" ${FONT} font-size="10.5" font-weight="500" letter-spacing="3.6" fill="${ink}">${escape(label)}</text>`,
    ].join('\n'),
  });
}

// Arabic lockup: mark on the right, "يونيبال" with the company name in its accent under it.
export function lockupArabicSvg({ ink, accent, labelColor = accent, labelAr, title }) {
  const width = 196;
  return svg({
    width,
    title,
    rtl: true,
    body: [
      markPaths({ ink, accent, x: width - 64 }),
      `<text x="${width - 70}" y="34" ${FONT} font-size="28" font-weight="700" text-anchor="start" direction="rtl" fill="${ink}">يونيبال</text>`,
      `<text x="${width - 71}" y="55" ${FONT} font-size="13" font-weight="500" text-anchor="start" direction="rtl" fill="${labelColor}">${escape(labelAr)}</text>`,
    ].join('\n'),
  });
}
