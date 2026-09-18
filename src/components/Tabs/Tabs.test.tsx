import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { render } from '../../test/render';
import { Tabs } from './Tabs';

test('reports the selected tab', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Tabs items={['Minhas', 'Gerais', 'Todas']} active="Minhas" onChange={onChange} />);

  await user.click(screen.getByText('Todas'));
  expect(onChange).toHaveBeenCalledWith('Todas');
});
