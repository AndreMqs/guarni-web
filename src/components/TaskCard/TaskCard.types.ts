import type { ReactNode } from 'react';
import type { StatusTone } from '../StatusBadge';
export type TaskCardProps = { title: string; status?: string; tone?: StatusTone; due?: string; assignee?: string; evidence?: string; onClick?: () => void; action?: ReactNode };
