import { Paper } from '@mantine/core';
import type { KeyboardEvent } from 'react';
import type { CardProps } from './Card.types';

export function Card({ children, onClick, className, style, padding = 'md', radius = 'md', withBorder = true, ariaLabel, onKeyDown }: CardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (!onClick || event.defaultPrevented) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }

  return <Paper withBorder={withBorder} p={padding} radius={radius} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={handleKeyDown} aria-label={ariaLabel} className={className} style={style}>{children}</Paper>;
}

export type { CardProps } from './Card.types';
