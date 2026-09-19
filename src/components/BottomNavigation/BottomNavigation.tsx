import { routes } from '../../navigation';
import type { Navigate } from '../../navigation';
import { Group } from '../Group';
import { Text } from '../Text';
import { UnstyledButton } from '../UnstyledButton';
import type { BottomNavigationProps, NavigationItemKey } from './BottomNavigation.types';
import styles from './BottomNavigation.module.scss';

export function BottomNavigation({ active, navigate, mode = 'employee' }: BottomNavigationProps) {
  const destinations = mode === 'employee'
    ? { today: routes.tasks.today, history: routes.history.daily, more: routes.tasks.menu }
    : mode === 'management'
      ? { today: routes.management.dashboard, history: routes.management.history, more: routes.management.menu }
      : { today: routes.management.dashboard, history: routes.management.history, more: routes.owner.menu };

  const items: Array<{ id: NavigationItemKey; label: string; icon: string }> = [
    { id: 'today', label: 'Hoje', icon: '▣' },
    { id: 'history', label: 'Histórico', icon: '◷' },
    { id: 'more', label: 'Mais', icon: '≡' },
  ];

  function handleNavigation(item: NavigationItemKey, navigateTo: Navigate) {
    navigateTo(destinations[item]);
  }

  return (
    <Group
      grow
      gap={6}
      style={{
        borderTop: '1px solid var(--mantine-color-gray-3)',
        position: 'sticky',
        bottom: 0,
        background: 'var(--mantine-color-body)',
        padding: 'var(--mantine-spacing-xs)',
      }}
    >
      {items.filter(item => mode !== 'employee' || item.id !== 'history').map((item) => (
        <UnstyledButton
          key={item.id}
          className={styles.item}
          ariaLabel={item.label}
          onClick={() => handleNavigation(item.id, navigate)}
          ariaCurrent={active === item.id ? 'page' : undefined}
        >
          <Group gap={4} justify="center">
            <Text>{item.icon}</Text>
            <Text size="sm" weight={active === item.id ? 700 : 400}>{item.label}</Text>
          </Group>
        </UnstyledButton>
      ))}
    </Group>
  );
}

export type { BottomNavigationProps, NavigationItemKey } from './BottomNavigation.types';
