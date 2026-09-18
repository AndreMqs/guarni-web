import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { render } from '../../test/render';
import { SearchField } from './SearchField';

test('reports text changes', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<SearchField placeholder="Buscar tarefa" value="" onChange={onChange} />);

  await user.type(screen.getByRole('textbox', { name: 'Buscar tarefa' }), 'freezer');
  expect(onChange).toHaveBeenCalled();
});
