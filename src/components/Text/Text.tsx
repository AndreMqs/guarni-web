import { Text as MantineText } from '@mantine/core';
import type { TextProps, TextTone } from './Text.types';

const toneColors: Record<TextTone, string | undefined> = {
  default: undefined,
  muted: 'dimmed',
  primary: 'var(--guarni-primary)',
  success: 'var(--guarni-success)',
  warning: 'var(--guarni-warning)',
  danger: 'var(--guarni-error)',
};

export function Text({ children, tone = 'default', size = 'md', weight, align, component = 'span', className, style, id, role }: TextProps) {
  return <MantineText component={component} c={toneColors[tone]} size={size} fw={weight} ta={align} className={className} style={style} id={id} role={role}>{children}</MantineText>;
}

export type { TextProps, TextTone, TextSize, TextComponent } from './Text.types';
