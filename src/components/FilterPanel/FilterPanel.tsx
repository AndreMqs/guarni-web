import { useState } from 'react';
import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import type { FilterPanelProps } from './FilterPanel.types';

export function FilterPanel<T>({ value, defaultValue, onApply, summary, activeCount = 0, initiallyOpen = false, isValid = () => true, children }: FilterPanelProps<T>) {
  const [opened, setOpened] = useState(initiallyOpen);
  const [draft, setDraft] = useState(value);
  function apply(next: T) {
    onApply(next);
    setOpened(false);
  }
  return <Stack gap="xs">
    <Button variant="secondary" size="sm" aria-haspopup="dialog" aria-expanded={opened} onClick={() => { setDraft(value); setOpened(true); }}>
      Filtros{activeCount > 0 ? ` (${activeCount})` : ''}
    </Button>
    <Text size="sm" tone="muted">{summary}</Text>
    <BottomSheet title="Filtros" opened={opened} onClose={() => setOpened(false)}>
      <Stack gap="lg">
        {children(draft, setDraft)}
        <Button isFullWidth disabled={!isValid(draft)} onClick={() => apply(draft)}>APLICAR FILTROS</Button>
        <Button variant="secondary" isFullWidth onClick={() => apply(defaultValue)}>LIMPAR FILTROS</Button>
        <Button variant="secondary" isFullWidth onClick={() => setOpened(false)}>CANCELAR</Button>
      </Stack>
    </BottomSheet>
  </Stack>;
}
