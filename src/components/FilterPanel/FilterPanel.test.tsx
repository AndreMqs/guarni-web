import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { render } from '../../test/render';
import { Select } from '../Select';
import { FilterPanel } from './FilterPanel';

it('keeps edits local until Apply and discards cancelled changes', async () => {
  const onApply = vi.fn();
  const user = userEvent.setup();
  render(<FilterPanel value="all" defaultValue="all" onApply={onApply} summary="Todos">
    {(draft, setDraft) => <Select ariaLabel="Status" value={draft} onChange={setDraft} options={[{ value: 'all', label: 'Todos' }, { value: 'done', label: 'Concluídas' }]} />}
  </FilterPanel>);
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  await user.selectOptions(await screen.findByRole('combobox'), 'done');
  expect(onApply).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'CANCELAR' }));
  expect(onApply).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  expect(await screen.findByRole('combobox')).toHaveValue('all');
  await user.selectOptions(screen.getByRole('combobox'), 'done');
  await user.click(screen.getByRole('button', { name: 'APLICAR FILTROS' }));
  expect(onApply).toHaveBeenLastCalledWith('done');
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  await user.click(await screen.findByRole('button', { name: 'LIMPAR FILTROS' }));
  expect(onApply).toHaveBeenLastCalledWith('all');
});
