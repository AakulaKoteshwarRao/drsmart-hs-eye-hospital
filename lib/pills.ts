// Shared pill and stat colour palettes

export const PILL_STYLES = [
  { background: 'rgba(13,122,95,0.10)',  color: '#065F46' },
  { background: 'rgba(26,78,160,0.10)',  color: '#1e3a8a' },
  { background: 'rgba(214,137,16,0.12)', color: '#92400E' },
  { background: 'rgba(109,40,217,0.10)', color: '#4C1D95' },
  { background: 'rgba(30,132,73,0.10)',  color: '#14532D' },
  { background: 'rgba(185,28,28,0.10)',  color: '#7F1D1D' },
]

export const PILL_STYLES_DARK = [
  { background: 'rgba(13,122,95,0.25)',  color: '#ffffff', border: 'rgba(13,122,95,0.4)' },
  { background: 'rgba(26,78,160,0.25)',  color: '#ffffff', border: 'rgba(26,78,160,0.4)' },
  { background: 'rgba(214,137,16,0.25)', color: '#ffffff', border: 'rgba(214,137,16,0.4)' },
  { background: 'rgba(109,40,217,0.25)', color: '#ffffff', border: 'rgba(109,40,217,0.4)' },
  { background: 'rgba(30,132,73,0.25)',  color: '#ffffff', border: 'rgba(30,132,73,0.4)' },
  { background: 'rgba(185,28,28,0.25)',  color: '#ffffff', border: 'rgba(185,28,28,0.4)' },
]
// Accent colours for stat numbers shown on LIGHT backgrounds (Hero, detail heroes).
// Darkened to the -700 tone of each hue so text meets WCAG AA contrast on white
// (previous -400 pastels measured 1.7–2.7:1; these are ~5–7:1) while keeping the
// same multi-colour identity. Dark-background stats use STAT_COLOURS_DARK below.
export const STAT_COLOURS = [
  '#047857',
  '#1D4ED8',
  '#B45309',
  '#BE185D',
  '#6D28D9',
  '#C2410C',
]

export const STAT_COLOURS_DARK = [
  '#A7F3D0',
  '#BFDBFE',
  '#FDE68A',
  '#FBCFE8',
  '#DDD6FE',
  '#FED7AA',
]
