/** Shared by badges, notices and icons so that each color has one meaning. */
export const semanticColors = {
  primary: 'var(--guarni-primary)',
  info: 'var(--guarni-primary)',
  success: 'var(--guarni-success)',
  done: 'var(--guarni-success)',
  pending: 'var(--guarni-warning)',
  warning: 'var(--guarni-warning)',
  danger: 'var(--guarni-error)',
  neutral: 'var(--guarni-text-muted)',
};

export function semanticSurface(color: string) {
  return { color, backgroundColor: `color-mix(in srgb, ${color} 12%, var(--guarni-surface))` };
}
