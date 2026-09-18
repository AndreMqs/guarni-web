import { BottomNavigation } from '../BottomNavigation';
import { Box } from '../Box';
import { Group } from '../Group';
import { IconButton } from '../IconButton';
import { Stack } from '../Stack';
import { TextButton } from '../TextButton';
import { Title } from '../Title';
import type { FrameProps } from './Frame.types';
import styles from './Frame.module.scss';

export function Frame({
  children,
  title,
  action,
  onAction,
  backTo,
  navigate,
  bottomNav,
  navMode = 'employee',
}: FrameProps) {
  return (
    <Box className={styles.viewport}>
      <Box className={styles.screen}>
        {title && (
          <Group justify="space-between" className={styles.header} wrap="nowrap">
            {backTo ? (
              <IconButton ariaLabel="Voltar" onClick={() => navigate(backTo)}>‹</IconButton>
            ) : (
              <Box style={{ width: 36 }} />
            )}
            <Title order={1} style={{ textAlign: 'center', fontSize: 'var(--mantine-font-size-lg)' }}>{title}</Title>
            {action ? <TextButton onClick={onAction}>{action}</TextButton> : <Box style={{ width: 36 }} />}
          </Group>
        )}
        <Stack gap="lg" className={styles.main}>{children}</Stack>
        {bottomNav && <BottomNavigation active={bottomNav} navigate={navigate} mode={navMode} />}
      </Box>
    </Box>
  );
}

export type { FrameProps } from './Frame.types';
