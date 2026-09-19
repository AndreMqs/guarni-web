import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { routes, useNavigationStore, type AppRoute } from '../navigation'
import { AppRouter, type AppRouterProps } from './AppRouter'

// Keep route selection and browser history real; isolate the large view trees.
vi.mock('../views/Employee', () => ({ EmployeeView: ({ route }: { route: AppRoute }) => <div>employee:{route}</div> }))
vi.mock('../views/Management', () => ({ ManagementView: ({ route, onLogout }: { route: AppRoute } & Pick<AppRouterProps, 'onLogout'>) => <div>management:{route}<button onClick={onLogout}>Sair</button></div> }))
vi.mock('../views/Audit', () => ({ AuditView: ({ route }: { route: AppRoute }) => <div>audit:{route}</div> }))

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  useNavigationStore.setState(useNavigationStore.getInitialState(), true)
})
afterEach(() => {
  window.history.replaceState(null, '', '/')
  useNavigationStore.setState(useNavigationStore.getInitialState(), true)
})

it.each([
  [routes.tasks.today, 'employee'],
  [routes.management.dashboard, 'management'],
  [routes.audit.events, 'audit'],
  [routes.owner.menu, 'audit'],
] as const)('routes %s to the appropriate view', (route, view) => {
  render(<AppRouter initialRoute={route} onLogout={vi.fn()} />)
  expect(screen.getByText(`${view}:${route}`)).toBeInTheDocument()
})

it('opens a valid deep link instead of the default route', () => {
  window.history.replaceState(null, '', `#/${routes.audit.events}`)
  render(<AppRouter initialRoute={routes.tasks.today} onLogout={vi.fn()} />)
  expect(screen.getByText(`audit:${routes.audit.events}`)).toBeInTheDocument()
})

it('falls back to the initial route for an unknown hash', () => {
  window.history.replaceState(null, '', '#/missing')
  render(<AppRouter initialRoute={routes.tasks.today} onLogout={vi.fn()} />)
  expect(screen.getByText(`employee:${routes.tasks.today}`)).toBeInTheDocument()
})

it('synchronizes programmatic navigation and browser history events', () => {
  render(<AppRouter initialRoute={routes.tasks.today} onLogout={vi.fn()} />)
  act(() => useNavigationStore.getState().navigate(routes.management.users))
  expect(window.location.hash).toBe(`#/${routes.management.users}`)
  expect(screen.getByText(`management:${routes.management.users}`)).toBeInTheDocument()
  act(() => {
    window.history.replaceState(null, '', `#/${routes.history.daily}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  expect(screen.getByText(`employee:${routes.tasks.today}`)).toBeInTheDocument()
})

it('forwards logout and removes the history listener on unmount', async () => {
  const onLogout = vi.fn()
  const user = userEvent.setup()
  const { unmount } = render(<AppRouter initialRoute={routes.management.dashboard} onLogout={onLogout} />)
  await user.click(screen.getByRole('button', { name: 'Sair' }))
  expect(onLogout).toHaveBeenCalledOnce()
  unmount()
  window.history.replaceState(null, '', `#/${routes.tasks.today}`)
  window.dispatchEvent(new PopStateEvent('popstate'))
  expect(useNavigationStore.getState().route).toBe(routes.management.dashboard)
})
