export const isLive: boolean = false;
export const MathjaxConfig = {
  tex2jax: {
    inlineMath: [
      ['\\$', '\\$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
    processEscapes: true,
    ignoreClass: 'tex2jax_ignore|dno',
  },
  'HTML-CSS': {
    styles: { '.MathJax .mo, .MathJax .mi': { color: 'black ! important' }, '.MathJax .merror': { display: 'none' } },
    linebreaks: { automatic: true },
  },
  SVG: { linebreaks: { automatic: true } },
};

export const absolutePath = '';
export const assetURL = 'https://search-static-stg.byjusweb.com/assets'
