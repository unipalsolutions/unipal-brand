// The UniPal mark: a U (unity, the umbrella over the companies) holding a dot (the client).
// The U is always navy (white on dark backgrounds); the dot carries the brand color.

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const mark = ({ letter, dot }) =>
  [
    `<path d="M14 10V32a18 18 0 0 0 36 0V10" fill="none" stroke="${letter}" stroke-width="9" stroke-linecap="round"/>`,
    `<circle cx="32" cy="30" r="6.5" fill="${dot}"/>`,
  ].join('');

export function symbolSvg({ letter, dot, title }) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${escape(title)}">`,
    `<title>${escape(title)}</title>`,
    mark({ letter, dot }),
    '</svg>',
    '',
  ].join('\n');
}

// Wordmark text uses Inter. Final print files should have text outlined by the designer.
export function lockupSvg({ letter, dot, label, title }) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 64" width="184" height="64" direction="ltr" role="img" aria-label="${escape(title)}">`,
    `<title>${escape(title)}</title>`,
    mark({ letter, dot }),
    `<text x="72" y="35" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="30" font-weight="800" letter-spacing="-0.5" fill="${letter}">UniPal</text>`,
    `<text x="73" y="54" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="11.5" font-weight="600" letter-spacing="3.5" fill="${letter}">${escape(label)}</text>`,
    '</svg>',
    '',
  ].join('\n');
}
