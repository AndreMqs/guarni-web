import { SegmentedControl } from '@mantine/core';
import type { TabsProps } from './Tabs.types';

export function Tabs({ items, active, onChange }: TabsProps) {
  return <SegmentedControl fullWidth data={items} value={active} onChange={onChange} />;
}

export type { TabsProps } from './Tabs.types';
