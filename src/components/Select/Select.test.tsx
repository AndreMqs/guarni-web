import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { render } from '../../test/render';
import { Select } from './Select';

test('reports selected values', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select ariaLabel="Filtro" value="all" onChange={onChange} options={[{ value: 'all', label: 'Todos' }, { value: 'done', label: 'Feitas' }]} />);

  await user.selectOptions(screen.getByRole('combobox', { name: 'Filtro' }), 'done');
  expect(onChange).toHaveBeenCalledWith('done');
});
