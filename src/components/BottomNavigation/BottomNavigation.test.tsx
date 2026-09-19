import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { render } from '../../test/render';
import { routes } from '../../navigation';
import { BottomNavigation } from './BottomNavigation';

it.each([['today', 'Hoje'], ['history', 'Histórico'], ['more', 'Mais']] as const)('marks only %s as the current destination', (active, label) => {
  render(<BottomNavigation active={active} mode="management" navigate={vi.fn()} />);
  expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-current', 'page');
  expect(screen.getAllByRole('button').filter(button => button.hasAttribute('aria-current'))).toHaveLength(1);
});

it('keeps the owner menu reachable from Today', async () => {
  const navigate = vi.fn();
  const user = userEvent.setup();
  render(<BottomNavigation active="today" mode="owner" navigate={navigate} />);
  await user.click(screen.getByRole('button', { name: 'Mais' }));
  expect(navigate).toHaveBeenCalledWith(routes.owner.menu);
});

it('only shows Today and More in the employee flow', () => {
  render(<BottomNavigation active="today" mode="employee" navigate={vi.fn()} />);
  expect(screen.getAllByRole('button')).toHaveLength(2);
  expect(screen.queryByRole('button', { name: 'Histórico' })).not.toBeInTheDocument();
});
